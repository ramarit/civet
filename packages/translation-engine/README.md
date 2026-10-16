# Translation Engine

A robust, production-ready AI translation engine with multi-provider support, intelligent caching, and quality scoring for the Civet platform.

## Features

- **Multi-Provider Support**: Seamlessly integrate with Anthropic Claude, OpenAI GPT-4, and DeepL
- **Intelligent Provider Selection**: Automatically selects the best provider based on language pair quality, cost, and latency
- **Translation Caching**: Redis-based caching layer to reduce costs and improve response times
- **Quality Scoring**: Automatic quality assessment of translations using heuristic analysis
- **Retry Logic**: Built-in exponential backoff for handling API failures and rate limits
- **Batch Translation**: Efficient batch processing with concurrency control
- **TypeScript**: Full type safety with comprehensive TypeScript definitions

## Installation

```bash
npm install @civet/translation-engine
```

For Redis caching support:

```bash
npm install redis
```

## Quick Start

```typescript
import { TranslationEngine } from '@civet/translation-engine';

// Initialize the engine
const engine = new TranslationEngine({
  providers: {
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY,
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
    },
    deepl: {
      apiKey: process.env.DEEPL_API_KEY,
    },
  },
  enableCaching: true,
  enableQualityScoring: true,
  cache: {
    host: 'localhost',
    port: 6379,
    ttl: 86400, // 24 hours
  },
});

// Translate text
const result = await engine.translate({
  text: 'Hello, world!',
  sourceLang: 'en',
  targetLang: 'es',
});

console.log(result.translatedText); // "¡Hola, mundo!"
console.log(result.provider); // "deepl" (automatically selected)
console.log(result.qualityScore); // 95
```

## Configuration

### Provider Configuration

```typescript
interface ProviderConfig {
  apiKey: string;
  endpoint?: string;        // Custom API endpoint
  model?: string;           // Model version (for Anthropic/OpenAI)
  maxRetries?: number;      // Max retry attempts (default: 3)
  timeout?: number;         // Request timeout in ms
  rateLimit?: {
    requestsPerMinute: number;
    requestsPerDay?: number;
  };
}
```

### Translation Engine Configuration

```typescript
interface TranslationEngineConfig {
  providers: {
    anthropic?: ProviderConfig;
    openai?: ProviderConfig;
    deepl?: ProviderConfig;
  };
  cache?: CacheConfig;
  defaultProvider?: 'anthropic' | 'openai' | 'deepl';
  enableQualityScoring?: boolean;  // Default: true
  enableCaching?: boolean;          // Default: false
  retryConfig?: RetryConfig;
}
```

## Usage Examples

### Basic Translation

```typescript
const result = await engine.translate({
  text: 'This is a test.',
  sourceLang: 'en',
  targetLang: 'fr',
});

console.log(result.translatedText);
console.log(result.qualityScore);
console.log(result.metadata?.cached);
```

### Translation with Context

```typescript
const result = await engine.translate({
  text: 'Bank',
  sourceLang: 'en',
  targetLang: 'es',
  context: 'Financial institution, not river bank',
});

console.log(result.translatedText); // "Banco" (financial)
```

### Batch Translation

```typescript
const result = await engine.translateBatch({
  texts: [
    'Hello',
    'Goodbye',
    'Thank you',
  ],
  sourceLang: 'en',
  targetLang: 'ja',
});

console.log(result.translations[0].translatedText); // "こんにちは"
console.log(`${result.successCount}/${result.totalCount} succeeded`);
```

### Custom Provider Selection

```typescript
// Quality-based routing (default)
import { QualityBasedRouting } from '@civet/translation-engine';

const engine = new TranslationEngine({
  providers: { /* ... */ },
  routingStrategy: new QualityBasedRouting(),
});

// Cost-based routing
import { CostBasedRouting } from '@civet/translation-engine';

const costEngine = new TranslationEngine({
  providers: { /* ... */ },
  routingStrategy: new CostBasedRouting(),
});

// Custom language-specific routing
import { LanguageSpecificRouting } from '@civet/translation-engine';

const preferredProviders = new Map([
  ['en-de', 'deepl'],      // Use DeepL for English to German
  ['en-ja', 'anthropic'],  // Use Claude for English to Japanese
]);

const customEngine = new TranslationEngine({
  providers: { /* ... */ },
  routingStrategy: new LanguageSpecificRouting(preferredProviders),
});
```

### Using In-Memory Cache (No Redis)

```typescript
const engine = new TranslationEngine({
  providers: {
    anthropic: { apiKey: process.env.ANTHROPIC_API_KEY },
  },
  enableCaching: true,
  cache: {
    ttl: 3600, // 1 hour
    keyPrefix: 'translation:',
  },
  // No host/port = in-memory cache
});
```

### Provider Capabilities

```typescript
// Check if a language pair is supported
const isSupported = engine.isLanguagePairSupported('en', 'ko');

// Get the best provider for a language pair
const bestProvider = engine.getBestProvider('en', 'de');
console.log(bestProvider); // "deepl"

// Get all available providers
const providers = engine.getAvailableProviders();
console.log(providers); // ['anthropic', 'openai', 'deepl']
```

### Cache Management

```typescript
// Get cache statistics
const stats = await engine.getCacheStats();
console.log(stats.totalKeys);
console.log(stats.memoryUsage);

// Clear cache
await engine.clearCache();

// Close connections when done
await engine.close();
```

## Provider Selection Strategy

The engine automatically selects the best provider based on several factors:

### Quality Ratings by Language Pair

| Language Pair | DeepL | Anthropic | OpenAI |
|--------------|-------|-----------|--------|
| en-de        | 98    | 94        | 93     |
| en-fr        | 97    | 95        | 94     |
| en-es        | 96    | 95        | 94     |
| en-ja        | 89    | 92        | 91     |
| en-zh        | 87    | 91        | 90     |

### Default Routing Strategy (Balanced)

The balanced routing strategy considers:
- **Quality**: 60% weight - Translation accuracy and naturalness
- **Cost**: 20% weight - API cost per character
- **Latency**: 20% weight - Average response time

## Error Handling

```typescript
import {
  TranslationError,
  ProviderError,
  RateLimitError,
  ValidationError
} from '@civet/translation-engine';

try {
  const result = await engine.translate({
    text: 'Hello',
    sourceLang: 'en',
    targetLang: 'es',
  });
} catch (error) {
  if (error instanceof RateLimitError) {
    console.log('Rate limited, retry after:', error.retryAfter);
  } else if (error instanceof ProviderError) {
    console.log('Provider failed:', error.provider);
  } else if (error instanceof ValidationError) {
    console.log('Invalid request:', error.message);
  }
}
```

## Quality Scoring

The engine provides automatic quality scoring based on:

- **Fluency**: Natural language flow and readability
- **Consistency**: Length ratio, formatting preservation
- **Formality**: Appropriate tone and style
- **Issues Detection**: Untranslated content, malformed structure, repetition

```typescript
const result = await engine.translate({
  text: 'Your text here',
  sourceLang: 'en',
  targetLang: 'fr',
});

console.log(result.qualityScore); // 0-100
```

## Advanced Configuration

### Custom Retry Configuration

```typescript
const engine = new TranslationEngine({
  providers: { /* ... */ },
  retryConfig: {
    maxAttempts: 5,
    initialDelayMs: 1000,
    maxDelayMs: 30000,
    backoffMultiplier: 2,
  },
});
```

### Redis Configuration

```typescript
const engine = new TranslationEngine({
  providers: { /* ... */ },
  enableCaching: true,
  cache: {
    host: 'localhost',
    port: 6379,
    password: 'your-password',
    db: 0,
    ttl: 86400,              // 24 hours
    keyPrefix: 'translation:',
  },
});
```

### Provider-Specific Configuration

```typescript
const engine = new TranslationEngine({
  providers: {
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: 'claude-3-5-sonnet-20241022',
      timeout: 30000,
      maxRetries: 3,
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      model: 'gpt-4-turbo-preview',
      endpoint: 'https://api.openai.com/v1/chat/completions',
    },
    deepl: {
      apiKey: process.env.DEEPL_API_KEY,
      endpoint: 'https://api.deepl.com/v2/translate',
    },
  },
});
```

## Supported Languages

### All Providers
- English (en), Spanish (es), French (fr), German (de), Italian (it)
- Portuguese (pt), Russian (ru), Japanese (ja), Korean (ko), Chinese (zh)
- Arabic (ar), Hindi (hi), Dutch (nl), Polish (pl), Swedish (sv)
- Turkish (tr), Vietnamese (vi), Thai (th), Indonesian (id), Malay (ms)

### DeepL Specific
Also supports: Bulgarian (bg), Czech (cs), Danish (da), Greek (el), Estonian (et), Finnish (fi), Hungarian (hu), Lithuanian (lt), Latvian (lv), Norwegian (nb), Romanian (ro), Slovak (sk), Slovenian (sl), Ukrainian (uk)

## Performance Tips

1. **Enable Caching**: Significantly reduces API costs and latency for repeated translations
2. **Use Batch Translation**: More efficient for translating multiple texts
3. **Choose the Right Provider**: DeepL for European languages, Claude for Asian languages
4. **Configure Rate Limits**: Prevent hitting API limits with proper configuration
5. **Monitor Quality Scores**: Track translation quality over time

## Testing

The package includes comprehensive test coverage. To run tests:

```bash
npm test
```

## License

MIT

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our repository.

## Support

For issues and questions, please open an issue on our GitHub repository.
