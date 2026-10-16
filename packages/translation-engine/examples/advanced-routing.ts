/**
 * Advanced provider routing examples
 */

import { TranslationEngine } from '../src/index';
import {
  QualityBasedRouting,
  CostBasedRouting,
  LatencyBasedRouting,
  BalancedRouting,
  LanguageSpecificRouting,
} from '../src/router/provider-router';

async function qualityBasedRoutingExample() {
  console.log('=== Quality-Based Routing ===\n');

  const engine = new TranslationEngine({
    providers: {
      anthropic: {
        apiKey: process.env.ANTHROPIC_API_KEY || 'your-anthropic-key',
      },
      openai: {
        apiKey: process.env.OPENAI_API_KEY || 'your-openai-key',
      },
      deepl: {
        apiKey: process.env.DEEPL_API_KEY || 'your-deepl-key',
      },
    },
  });

  // Quality-based routing prioritizes the highest quality provider
  const testPairs = [
    { from: 'en', to: 'de', desc: 'English to German (DeepL excels)' },
    { from: 'en', to: 'ja', desc: 'English to Japanese (Claude excels)' },
    { from: 'en', to: 'fr', desc: 'English to French (DeepL excels)' },
  ];

  console.log('Testing quality-based provider selection:\n');

  for (const pair of testPairs) {
    const bestProvider = engine.getBestProvider(pair.from, pair.to);
    console.log(`${pair.desc}`);
    console.log(`  Selected provider: ${bestProvider}\n`);
  }

  await engine.close();
}

async function costBasedRoutingExample() {
  console.log('=== Cost-Based Routing ===\n');

  const { AnthropicProvider } = await import('../src/providers/anthropic');
  const { OpenAIProvider } = await import('../src/providers/openai');
  const { DeepLProvider } = await import('../src/providers/deepl');
  const { ProviderRouter } = await import('../src/router/provider-router');

  const providers = new Map();
  providers.set('anthropic', new AnthropicProvider({
    apiKey: process.env.ANTHROPIC_API_KEY || 'key',
  }));
  providers.set('openai', new OpenAIProvider({
    apiKey: process.env.OPENAI_API_KEY || 'key',
  }));
  providers.set('deepl', new DeepLProvider({
    apiKey: process.env.DEEPL_API_KEY || 'key',
  }));

  const router = new ProviderRouter(providers, new CostBasedRouting());

  console.log('Cost per character for each provider:');
  for (const [name, provider] of providers) {
    console.log(`  ${name}: $${provider.capabilities.costPerChar}`);
  }

  console.log('\nCost-based routing always selects the cheapest provider.');
  const selected = router.selectProvider({
    text: 'test',
    sourceLang: 'en',
    targetLang: 'de',
  });

  console.log(`Selected: ${selected} (lowest cost)`);
}

async function latencyBasedRoutingExample() {
  console.log('=== Latency-Based Routing ===\n');

  const { AnthropicProvider } = await import('../src/providers/anthropic');
  const { OpenAIProvider } = await import('../src/providers/openai');
  const { DeepLProvider } = await import('../src/providers/deepl');
  const { ProviderRouter } = await import('../src/router/provider-router');

  const providers = new Map();
  providers.set('anthropic', new AnthropicProvider({
    apiKey: process.env.ANTHROPIC_API_KEY || 'key',
  }));
  providers.set('openai', new OpenAIProvider({
    apiKey: process.env.OPENAI_API_KEY || 'key',
  }));
  providers.set('deepl', new DeepLProvider({
    apiKey: process.env.DEEPL_API_KEY || 'key',
  }));

  const router = new ProviderRouter(providers, new LatencyBasedRouting());

  console.log('Average latency for each provider:');
  for (const [name, provider] of providers) {
    console.log(`  ${name}: ${provider.capabilities.avgLatency}ms`);
  }

  console.log('\nLatency-based routing selects the fastest provider.');
  const selected = router.selectProvider({
    text: 'test',
    sourceLang: 'en',
    targetLang: 'de',
  });

  console.log(`Selected: ${selected} (lowest latency)`);
}

async function balancedRoutingExample() {
  console.log('=== Balanced Routing ===\n');

  const { AnthropicProvider } = await import('../src/providers/anthropic');
  const { OpenAIProvider } = await import('../src/providers/openai');
  const { DeepLProvider } = await import('../src/providers/deepl');
  const { ProviderRouter } = await import('../src/router/provider-router');

  const providers = new Map();
  providers.set('anthropic', new AnthropicProvider({
    apiKey: process.env.ANTHROPIC_API_KEY || 'key',
  }));
  providers.set('openai', new OpenAIProvider({
    apiKey: process.env.OPENAI_API_KEY || 'key',
  }));
  providers.set('deepl', new DeepLProvider({
    apiKey: process.env.DEEPL_API_KEY || 'key',
  }));

  // Default balanced routing (60% quality, 20% cost, 20% latency)
  const defaultRouter = new ProviderRouter(providers, new BalancedRouting());

  // Custom weights (80% quality, 10% cost, 10% latency)
  const qualityFocusedRouter = new ProviderRouter(
    providers,
    new BalancedRouting({ quality: 0.8, cost: 0.1, latency: 0.1 })
  );

  // Custom weights (20% quality, 60% cost, 20% latency)
  const costFocusedRouter = new ProviderRouter(
    providers,
    new BalancedRouting({ quality: 0.2, cost: 0.6, latency: 0.2 })
  );

  const testRequest = {
    text: 'test',
    sourceLang: 'en',
    targetLang: 'de',
  };

  console.log('Default balanced (60% quality, 20% cost, 20% latency):');
  console.log(`  Selected: ${defaultRouter.selectProvider(testRequest)}\n`);

  console.log('Quality-focused (80% quality, 10% cost, 10% latency):');
  console.log(`  Selected: ${qualityFocusedRouter.selectProvider(testRequest)}\n`);

  console.log('Cost-focused (20% quality, 60% cost, 20% latency):');
  console.log(`  Selected: ${costFocusedRouter.selectProvider(testRequest)}\n`);
}

async function languageSpecificRoutingExample() {
  console.log('=== Language-Specific Routing ===\n');

  const { AnthropicProvider } = await import('../src/providers/anthropic');
  const { OpenAIProvider } = await import('../src/providers/openai');
  const { DeepLProvider } = await import('../src/providers/deepl');
  const { ProviderRouter } = await import('../src/router/provider-router');

  const providers = new Map();
  providers.set('anthropic', new AnthropicProvider({
    apiKey: process.env.ANTHROPIC_API_KEY || 'key',
  }));
  providers.set('openai', new OpenAIProvider({
    apiKey: process.env.OPENAI_API_KEY || 'key',
  }));
  providers.set('deepl', new DeepLProvider({
    apiKey: process.env.DEEPL_API_KEY || 'key',
  }));

  // Define custom preferences
  const preferences = new Map([
    ['en-de', 'deepl'],      // Use DeepL for English to German
    ['en-fr', 'deepl'],      // Use DeepL for English to French
    ['en-ja', 'anthropic'],  // Use Claude for English to Japanese
    ['en-zh', 'anthropic'],  // Use Claude for English to Chinese
    ['en-ko', 'anthropic'],  // Use Claude for English to Korean
  ]);

  const strategy = new LanguageSpecificRouting(preferences);
  const router = new ProviderRouter(providers, strategy);

  console.log('Custom language preferences:');
  for (const [pair, provider] of preferences) {
    console.log(`  ${pair} → ${provider}`);
  }

  console.log('\nTesting provider selection:\n');

  const testPairs = [
    { from: 'en', to: 'de' },
    { from: 'en', to: 'fr' },
    { from: 'en', to: 'ja' },
    { from: 'en', to: 'es' }, // Not in preferences, will use fallback
  ];

  for (const pair of testPairs) {
    const selected = router.selectProvider({
      text: 'test',
      sourceLang: pair.from,
      targetLang: pair.to,
    });
    const preference = preferences.get(`${pair.from}-${pair.to}`);
    console.log(`${pair.from}-${pair.to}:`);
    console.log(`  Expected: ${preference || 'fallback'}`);
    console.log(`  Selected: ${selected}\n`);
  }
}

async function dynamicRoutingExample() {
  console.log('=== Dynamic Provider Routing ===\n');

  const engine = new TranslationEngine({
    providers: {
      anthropic: {
        apiKey: process.env.ANTHROPIC_API_KEY || 'your-anthropic-key',
      },
      deepl: {
        apiKey: process.env.DEEPL_API_KEY || 'your-deepl-key',
      },
    },
  });

  const testCases = [
    {
      text: 'Die Qualität unserer Produkte ist erstklassig.',
      from: 'de',
      to: 'en',
      desc: 'German to English (DeepL excels at European languages)',
    },
    {
      text: 'この製品の品質は最高です。',
      from: 'ja',
      to: 'en',
      desc: 'Japanese to English (Claude excels at Asian languages)',
    },
    {
      text: 'La qualité de nos produits est exceptionnelle.',
      from: 'fr',
      to: 'en',
      desc: 'French to English (DeepL excels)',
    },
  ];

  console.log('The engine automatically selects the best provider:\n');

  for (const tc of testCases) {
    const result = await engine.translate({
      text: tc.text,
      sourceLang: tc.from,
      targetLang: tc.to,
    });

    console.log(tc.desc);
    console.log(`  Original: ${tc.text}`);
    console.log(`  Translated: ${result.translatedText}`);
    console.log(`  Provider: ${result.provider}`);
    console.log(`  Quality Score: ${result.qualityScore}\n`);
  }

  await engine.close();
}

// Run examples
if (require.main === module) {
  (async () => {
    await qualityBasedRoutingExample();
    console.log('\n' + '='.repeat(50) + '\n');

    await costBasedRoutingExample();
    console.log('\n' + '='.repeat(50) + '\n');

    await latencyBasedRoutingExample();
    console.log('\n' + '='.repeat(50) + '\n');

    await balancedRoutingExample();
    console.log('\n' + '='.repeat(50) + '\n');

    await languageSpecificRoutingExample();
    console.log('\n' + '='.repeat(50) + '\n');

    // Uncomment if you have API keys configured
    // await dynamicRoutingExample();
  })();
}

export {
  qualityBasedRoutingExample,
  costBasedRoutingExample,
  latencyBasedRoutingExample,
  balancedRoutingExample,
  languageSpecificRoutingExample,
  dynamicRoutingExample,
};
