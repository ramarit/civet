/**
 * Caching examples for the Translation Engine
 */

import { TranslationEngine } from '../src/index';

async function redisCacheExample() {
  console.log('=== Redis Cache Example ===\n');

  const engine = new TranslationEngine({
    providers: {
      anthropic: {
        apiKey: process.env.ANTHROPIC_API_KEY || 'your-api-key',
      },
    },
    enableCaching: true,
    cache: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      ttl: 3600, // 1 hour
      keyPrefix: 'translation:',
    },
  });

  try {
    const text = 'The quick brown fox jumps over the lazy dog';

    // First translation - will hit the API
    console.log('First translation (API call)...');
    const start1 = Date.now();
    const result1 = await engine.translate({
      text,
      sourceLang: 'en',
      targetLang: 'fr',
    });
    const duration1 = Date.now() - start1;

    console.log('Result:', result1.translatedText);
    console.log('Cached:', result1.metadata?.cached);
    console.log('Duration:', duration1, 'ms\n');

    // Second translation - will use cache
    console.log('Second translation (from cache)...');
    const start2 = Date.now();
    const result2 = await engine.translate({
      text,
      sourceLang: 'en',
      targetLang: 'fr',
    });
    const duration2 = Date.now() - start2;

    console.log('Result:', result2.translatedText);
    console.log('Cached:', result2.metadata?.cached);
    console.log('Duration:', duration2, 'ms');
    console.log('Speedup:', Math.round(duration1 / duration2) + 'x faster\n');

    // Get cache statistics
    const stats = await engine.getCacheStats();
    console.log('Cache stats:', stats);

    // Clear cache
    await engine.clearCache();
    console.log('\nCache cleared');
  } catch (error) {
    console.error('Caching error:', error);
  }

  await engine.close();
}

async function inMemoryCacheExample() {
  console.log('=== In-Memory Cache Example ===\n');

  const engine = new TranslationEngine({
    providers: {
      openai: {
        apiKey: process.env.OPENAI_API_KEY || 'your-api-key',
      },
    },
    enableCaching: true,
    cache: {
      // No host/port means in-memory cache
      ttl: 3600,
      keyPrefix: 'translation:',
    },
  });

  try {
    const texts = [
      'Hello',
      'Goodbye',
      'Thank you',
      'Hello', // Duplicate - will be cached
    ];

    console.log('Translating texts with in-memory cache...\n');

    for (const text of texts) {
      const start = Date.now();
      const result = await engine.translate({
        text,
        sourceLang: 'en',
        targetLang: 'es',
      });
      const duration = Date.now() - start;

      console.log(`"${text}" → "${result.translatedText}"`);
      console.log(`  Cached: ${result.metadata?.cached}, Duration: ${duration}ms\n`);
    }

    // Get cache size
    const stats = await engine.getCacheStats();
    console.log('Cache contains', stats.totalKeys, 'entries');
  } catch (error) {
    console.error('Caching error:', error);
  }

  await engine.close();
}

async function cacheBenefitsExample() {
  console.log('=== Cache Performance Benefits ===\n');

  // Engine without cache
  const engineNoCache = new TranslationEngine({
    providers: {
      anthropic: {
        apiKey: process.env.ANTHROPIC_API_KEY || 'your-api-key',
      },
    },
    enableCaching: false,
  });

  // Engine with cache
  const engineWithCache = new TranslationEngine({
    providers: {
      anthropic: {
        apiKey: process.env.ANTHROPIC_API_KEY || 'your-api-key',
      },
    },
    enableCaching: true,
    cache: {
      ttl: 3600,
    },
  });

  const testTexts = [
    'Welcome',
    'Hello',
    'Goodbye',
    'Welcome', // Repeat
    'Hello',   // Repeat
    'Welcome', // Repeat
  ];

  try {
    // Test without cache
    console.log('Testing WITHOUT cache:');
    const noCacheStart = Date.now();
    for (const text of testTexts) {
      await engineNoCache.translate({
        text,
        sourceLang: 'en',
        targetLang: 'ja',
      });
    }
    const noCacheDuration = Date.now() - noCacheStart;
    console.log(`Total time: ${noCacheDuration}ms\n`);

    // Test with cache
    console.log('Testing WITH cache:');
    const cacheStart = Date.now();
    let hitCount = 0;
    for (const text of testTexts) {
      const result = await engineWithCache.translate({
        text,
        sourceLang: 'en',
        targetLang: 'ja',
      });
      if (result.metadata?.cached) {
        hitCount++;
      }
    }
    const cacheDuration = Date.now() - cacheStart;

    console.log(`Total time: ${cacheDuration}ms`);
    console.log(`Cache hits: ${hitCount}/${testTexts.length}`);
    console.log(`Time saved: ${noCacheDuration - cacheDuration}ms`);
    console.log(`Speedup: ${(noCacheDuration / cacheDuration).toFixed(2)}x\n`);
  } catch (error) {
    console.error('Performance test error:', error);
  }

  await engineNoCache.close();
  await engineWithCache.close();
}

async function cacheKeyExample() {
  console.log('=== Cache Key Generation ===\n');

  const { RedisCache } = await import('../src/cache/redis-cache');

  // Same text, different context = different cache keys
  const request1 = {
    text: 'bank',
    sourceLang: 'en',
    targetLang: 'es',
    context: 'financial institution',
  };

  const request2 = {
    text: 'bank',
    sourceLang: 'en',
    targetLang: 'es',
    context: 'river bank',
  };

  const key1 = RedisCache.generateCacheKey(request1);
  const key2 = RedisCache.generateCacheKey(request2);

  console.log('Request 1 (financial context):');
  console.log('  Cache key:', key1);

  console.log('\nRequest 2 (geographical context):');
  console.log('  Cache key:', key2);

  console.log('\nKeys are different:', key1 !== key2);
  console.log('(Different contexts generate different cache keys)');
}

// Run examples
if (require.main === module) {
  (async () => {
    // await redisCacheExample();
    // console.log('\n' + '='.repeat(50) + '\n');

    await inMemoryCacheExample();
    console.log('\n' + '='.repeat(50) + '\n');

    await cacheBenefitsExample();
    console.log('\n' + '='.repeat(50) + '\n');

    await cacheKeyExample();
  })();
}

export {
  redisCacheExample,
  inMemoryCacheExample,
  cacheBenefitsExample,
  cacheKeyExample,
};
