# Translation Engine Architecture

## Overview

The Translation Engine is a production-ready, multi-provider AI translation system designed for the Civet platform. It provides a unified interface for translating text using multiple AI providers (Anthropic Claude, OpenAI GPT-4, DeepL) with intelligent routing, caching, and quality assessment.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Translation Engine                       │
│                                                              │
│  ┌───────────────┐    ┌──────────────┐    ┌─────────────┐ │
│  │   Request     │───▶│   Validate   │───▶│    Cache    │ │
│  │  Validation   │    │   Language   │    │   Lookup    │ │
│  └───────────────┘    │     Pair     │    └──────┬──────┘ │
│                       └──────────────┘           │         │
│                                                  │         │
│                                      ┌───────────▼──────┐  │
│                                      │  Cache Hit?      │  │
│                                      └───┬──────────┬───┘  │
│                                          │ No       │ Yes  │
│                                          │          │      │
│                       ┌──────────────────▼──┐       │      │
│                       │  Provider Router    │       │      │
│                       │                     │       │      │
│                       │  • Quality-based    │       │      │
│                       │  • Cost-based       │       │      │
│                       │  • Latency-based    │       │      │
│                       │  • Balanced         │       │      │
│                       │  • Language-specific│       │      │
│                       └──────────┬──────────┘       │      │
│                                  │                  │      │
│              ┌───────────────────┼──────────────────┘      │
│              │                   │                         │
│              │                   │                         │
│    ┌─────────▼─────────┐ ┌──────▼──────┐ ┌──────────────┐│
│    │    Anthropic      │ │   OpenAI    │ │    DeepL     ││
│    │     Provider      │ │   Provider  │ │   Provider   ││
│    │                   │ │             │ │              ││
│    │  • Claude 3.5     │ │  • GPT-4    │ │  • DeepL API ││
│    │  • Retry Logic    │ │  • Retry    │ │  • Retry     ││
│    │  • Error Handle   │ │             │ │              ││
│    └─────────┬─────────┘ └──────┬──────┘ └──────┬───────┘│
│              │                   │                │        │
│              └───────────────────┼────────────────┘        │
│                                  │                         │
│                       ┌──────────▼──────────┐             │
│                       │   Quality Scorer    │             │
│                       │                     │             │
│                       │  • Fluency          │             │
│                       │  • Consistency      │             │
│                       │  • Formality        │             │
│                       └──────────┬──────────┘             │
│                                  │                         │
│                       ┌──────────▼──────────┐             │
│                       │   Cache Storage     │             │
│                       │                     │             │
│                       │  • Redis / In-Mem   │             │
│                       └─────────────────────┘             │
│                                  │                         │
│                       ┌──────────▼──────────┐             │
│                       │   Return Result     │             │
│                       └─────────────────────┘             │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Translation Engine (`src/index.ts`)

The main entry point and orchestrator. Responsibilities:
- Request validation
- Provider initialization
- Cache management
- Quality scoring coordination
- Result aggregation

### 2. Provider System (`src/providers/`)

#### Base Provider (`base.ts`)
- Abstract base class for all providers
- Retry logic with exponential backoff
- Rate limit handling
- Batch translation support
- Error classification (retryable vs non-retryable)

#### Provider Implementations
- **Anthropic** (`anthropic.ts`): Claude 3.5 Sonnet for general translation, excels at Asian languages
- **OpenAI** (`openai.ts`): GPT-4 for general translation with broad language support
- **DeepL** (`deepl.ts`): Specialized in European languages with highest quality

### 3. Router System (`src/router/provider-router.ts`)

Intelligent provider selection based on multiple strategies:

#### Routing Strategies

1. **QualityBasedRouting**: Selects provider with highest quality rating for language pair
2. **CostBasedRouting**: Selects cheapest provider
3. **LatencyBasedRouting**: Selects fastest provider
4. **BalancedRouting**: Weighted combination of quality, cost, and latency
5. **LanguageSpecificRouting**: Custom preferences with fallback

### 4. Cache System (`src/cache/redis-cache.ts`)

Two-tier caching strategy:

#### Redis Cache
- Production-grade caching
- Distributed cache support
- Configurable TTL
- Automatic connection management
- Cache statistics

#### In-Memory Cache
- Development fallback
- Zero dependencies
- Automatic expiration
- Memory-efficient

### 5. Quality Scoring (`src/quality/scorer.ts`)

Automated translation quality assessment:

#### Heuristic Scorer
- **Fluency**: Sentence structure, punctuation, word patterns
- **Consistency**: Length ratios, formatting preservation, URL/email handling
- **Formality**: Tone appropriateness, capitalization
- **Issue Detection**: Untranslated content, malformed structure, repetition

#### Simple Scorer
- Fast, lightweight alternative
- Basic validation checks
- Provider confidence integration

## Data Flow

### Single Translation Flow

```
1. Request received
   ↓
2. Validate request (text, languages, supported)
   ↓
3. Generate cache key (hash of text + languages + context)
   ↓
4. Check cache
   ├─ Hit: Return cached result
   └─ Miss: Continue
   ↓
5. Provider Router selects best provider
   ↓
6. Provider translates (with retry logic)
   ↓
7. Quality scorer evaluates result
   ↓
8. Store in cache
   ↓
9. Return result
```

### Batch Translation Flow

```
1. Batch request received
   ↓
2. Validate batch (texts, languages)
   ↓
3. For each text, check cache
   ├─ Cached: Add to results
   └─ Not cached: Add to translate list
   ↓
4. Select provider for batch
   ↓
5. Chunk texts (concurrency control)
   ↓
6. Translate chunks in parallel
   ↓
7. Score quality for each result
   ↓
8. Cache new translations
   ↓
9. Merge cached + new results
   ↓
10. Return batch response
```

## Error Handling

### Error Types

1. **ValidationError**: Invalid request (empty text, missing languages, unsupported pair)
2. **ProviderError**: Provider-specific failures (API errors, timeout)
3. **RateLimitError**: Rate limit exceeded (includes retry-after)
4. **TranslationError**: General translation failures

### Retry Strategy

```typescript
Attempt 1: Immediate
Attempt 2: Wait initialDelayMs (default: 1000ms)
Attempt 3: Wait initialDelayMs * backoffMultiplier (default: 2000ms)
...
Max delay: maxDelayMs (default: 10000ms)
```

### Non-Retryable Errors
- Invalid API key
- Authentication failures
- Invalid request format
- Unsupported language pairs

## Performance Optimizations

1. **Caching**: Eliminates redundant API calls
2. **Batch Processing**: Reduces overhead for multiple translations
3. **Concurrent Execution**: Parallel translation with concurrency limits
4. **Provider Selection**: Routes to optimal provider per language pair
5. **Retry Logic**: Handles transient failures gracefully

## Quality Ratings

Provider quality ratings by language pair (0-100 scale):

### DeepL Strengths
- European languages: 95-98
- German, French, Spanish: 96+
- Best for: Business content in European languages

### Anthropic Claude Strengths
- Asian languages: 91-92
- Japanese, Chinese, Korean: 91+
- Best for: Technical content, Asian languages

### OpenAI GPT-4 Strengths
- Broad language support: 86-94
- Consistent quality across pairs: 86+
- Best for: General purpose, less common pairs

## Configuration Best Practices

### Production Configuration

```typescript
{
  providers: {
    anthropic: { apiKey: process.env.ANTHROPIC_API_KEY },
    openai: { apiKey: process.env.OPENAI_API_KEY },
    deepl: { apiKey: process.env.DEEPL_API_KEY },
  },
  enableCaching: true,
  cache: {
    host: 'redis.example.com',
    port: 6379,
    ttl: 86400, // 24 hours
  },
  enableQualityScoring: true,
  retryConfig: {
    maxAttempts: 3,
    initialDelayMs: 1000,
    maxDelayMs: 10000,
    backoffMultiplier: 2,
  },
}
```

### Development Configuration

```typescript
{
  providers: {
    anthropic: { apiKey: process.env.ANTHROPIC_API_KEY },
  },
  enableCaching: true,
  cache: { ttl: 3600 }, // In-memory cache
  enableQualityScoring: true,
}
```

## Extensibility

### Adding New Providers

1. Create provider class extending `BaseTranslationProvider`
2. Implement required methods: `translate()`, define `capabilities`
3. Add to provider initialization in `TranslationEngine`
4. Update type definitions for `ProviderName`

### Adding New Routing Strategies

1. Implement `RoutingStrategy` interface
2. Define `selectProvider()` logic
3. Use in `ProviderRouter` constructor

### Custom Quality Scoring

1. Implement `QualityScorer` interface
2. Define `score()` method
3. Register in `QualityScorerFactory`

## Security Considerations

1. **API Keys**: Never commit API keys, use environment variables
2. **Input Validation**: All requests validated before processing
3. **Error Messages**: Sanitized error messages, no sensitive data exposure
4. **Rate Limiting**: Respects provider rate limits
5. **Cache Keys**: Hashed to prevent cache key enumeration

## Monitoring & Observability

Key metrics to track:
- Cache hit rate
- Provider usage distribution
- Average latency per provider
- Quality score distribution
- Error rates by type
- Retry count distribution

## License

MIT License - see LICENSE file for details
