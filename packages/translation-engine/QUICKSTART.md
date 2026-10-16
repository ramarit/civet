# Quick Start Guide

Get up and running with the Translation Engine in minutes.

## Installation

```bash
cd /Users/ryanamarit/civet/packages/translation-engine
npm install
```

For Redis caching support (optional):
```bash
npm install redis
```

## Build the Package

```bash
npm run build
```

This will compile TypeScript to JavaScript in the `dist/` directory.

## Configuration

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Add your API keys to `.env`:
```env
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
DEEPL_API_KEY=...
```

## Basic Usage

### Simple Translation

```typescript
import { TranslationEngine } from '@civet/translation-engine';

const engine = new TranslationEngine({
  providers: {
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY,
    },
  },
});

const result = await engine.translate({
  text: 'Hello, world!',
  sourceLang: 'en',
  targetLang: 'es',
});

console.log(result.translatedText); // "¡Hola, mundo!"
```

### With Multiple Providers

```typescript
const engine = new TranslationEngine({
  providers: {
    anthropic: { apiKey: process.env.ANTHROPIC_API_KEY },
    openai: { apiKey: process.env.OPENAI_API_KEY },
    deepl: { apiKey: process.env.DEEPL_API_KEY },
  },
});

// The engine automatically selects the best provider
const result = await engine.translate({
  text: 'Good morning',
  sourceLang: 'en',
  targetLang: 'de',
});

console.log(result.provider); // "deepl" (best for German)
```

### With Caching

```typescript
const engine = new TranslationEngine({
  providers: {
    anthropic: { apiKey: process.env.ANTHROPIC_API_KEY },
  },
  enableCaching: true,
  cache: {
    host: 'localhost',
    port: 6379,
    ttl: 86400, // 24 hours
  },
});

// First call hits the API
const result1 = await engine.translate({
  text: 'Hello',
  sourceLang: 'en',
  targetLang: 'fr',
});

// Second call uses cache (much faster!)
const result2 = await engine.translate({
  text: 'Hello',
  sourceLang: 'en',
  targetLang: 'fr',
});

console.log(result2.metadata?.cached); // true
```

### Batch Translation

```typescript
const result = await engine.translateBatch({
  texts: ['Hello', 'Goodbye', 'Thank you'],
  sourceLang: 'en',
  targetLang: 'ja',
});

result.translations.forEach((t, i) => {
  console.log(`${i + 1}. ${t.translatedText}`);
});
```

## Run Examples

The package includes several example files:

```bash
# Basic usage examples
npm run build && node dist/examples/basic-usage.js

# Caching examples
npm run build && node dist/examples/caching-example.js

# Advanced routing examples
npm run build && node dist/examples/advanced-routing.js
```

Or run with ts-node:
```bash
npx ts-node examples/basic-usage.ts
```

## Development

### Watch Mode
```bash
npm run build:watch
```

### Linting
```bash
npm run lint
npm run lint:fix
```

### Testing
```bash
npm test
npm run test:watch
npm run test:coverage
```

## Common Patterns

### Error Handling

```typescript
import {
  TranslationError,
  ProviderError,
  RateLimitError,
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
  }
}
```

### Check Language Support

```typescript
// Check if a language pair is supported
const isSupported = engine.isLanguagePairSupported('en', 'ko');

// Get the best provider for a language pair
const bestProvider = engine.getBestProvider('en', 'de');
console.log(bestProvider); // "deepl"

// Get all available providers
const providers = engine.getAvailableProviders();
```

### Cache Management

```typescript
// Get cache statistics
const stats = await engine.getCacheStats();
console.log('Cached translations:', stats.totalKeys);

// Clear cache
await engine.clearCache();

// Always close when done (to close Redis connections)
await engine.close();
```

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Review [ARCHITECTURE.md](ARCHITECTURE.md) to understand the system design
- Check out the [examples/](examples/) directory for more usage patterns
- Configure custom routing strategies for your use case

## Troubleshooting

### Redis Connection Issues

If you see Redis connection errors:
1. Make sure Redis is running: `redis-cli ping`
2. Check your Redis configuration in `.env`
3. Or use in-memory cache (no Redis required):
   ```typescript
   cache: { ttl: 3600 } // No host/port
   ```

### API Key Issues

If you get authentication errors:
1. Verify your API keys are correct in `.env`
2. Check that environment variables are loaded
3. Ensure API keys have the correct permissions

### Provider Not Found

If a provider isn't available:
1. Make sure you've configured it in the TranslationEngine
2. Check that the API key is valid
3. Verify the language pair is supported by that provider

## Support

For issues and questions:
- Open an issue on GitHub
- Check the documentation
- Review example code

## License

MIT - see [LICENSE](LICENSE) file
