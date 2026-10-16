/**
 * Basic usage examples for the Translation Engine
 */

import { TranslationEngine } from '../src/index';

async function basicExample() {
  console.log('=== Basic Translation Example ===\n');

  // Initialize the engine with minimal configuration
  const engine = new TranslationEngine({
    providers: {
      anthropic: {
        apiKey: process.env.ANTHROPIC_API_KEY || 'your-api-key',
      },
    },
  });

  try {
    // Simple translation
    const result = await engine.translate({
      text: 'Hello, how are you?',
      sourceLang: 'en',
      targetLang: 'es',
    });

    console.log('Original:', 'Hello, how are you?');
    console.log('Translated:', result.translatedText);
    console.log('Provider:', result.provider);
    console.log('Quality Score:', result.qualityScore);
    console.log('Latency:', result.metadata?.latency, 'ms\n');
  } catch (error) {
    console.error('Translation error:', error);
  }

  await engine.close();
}

async function multiProviderExample() {
  console.log('=== Multi-Provider Example ===\n');

  // Initialize with multiple providers
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
    enableQualityScoring: true,
  });

  try {
    // The engine will automatically select the best provider
    const translations = [
      { text: 'Good morning', from: 'en', to: 'de' },
      { text: 'Thank you very much', from: 'en', to: 'ja' },
      { text: 'Welcome to our platform', from: 'en', to: 'fr' },
    ];

    for (const t of translations) {
      const result = await engine.translate({
        text: t.text,
        sourceLang: t.from,
        targetLang: t.to,
      });

      console.log(`${t.from} → ${t.to}: "${t.text}"`);
      console.log(`  Translated: "${result.translatedText}"`);
      console.log(`  Provider: ${result.provider}`);
      console.log(`  Quality: ${result.qualityScore}\n`);
    }

    // Check which providers are available
    console.log('Available providers:', engine.getAvailableProviders());
  } catch (error) {
    console.error('Translation error:', error);
  }

  await engine.close();
}

async function contextExample() {
  console.log('=== Translation with Context Example ===\n');

  const engine = new TranslationEngine({
    providers: {
      anthropic: {
        apiKey: process.env.ANTHROPIC_API_KEY || 'your-api-key',
      },
    },
  });

  try {
    // Ambiguous word without context
    const result1 = await engine.translate({
      text: 'Bank',
      sourceLang: 'en',
      targetLang: 'es',
    });

    console.log('Without context:', result1.translatedText);

    // Same word with financial context
    const result2 = await engine.translate({
      text: 'Bank',
      sourceLang: 'en',
      targetLang: 'es',
      context: 'Financial institution where people deposit money',
    });

    console.log('With financial context:', result2.translatedText);

    // Same word with geographical context
    const result3 = await engine.translate({
      text: 'Bank',
      sourceLang: 'en',
      targetLang: 'es',
      context: 'The land alongside a river or stream',
    });

    console.log('With geographical context:', result3.translatedText);
  } catch (error) {
    console.error('Translation error:', error);
  }

  await engine.close();
}

async function batchExample() {
  console.log('=== Batch Translation Example ===\n');

  const engine = new TranslationEngine({
    providers: {
      deepl: {
        apiKey: process.env.DEEPL_API_KEY || 'your-api-key',
      },
    },
  });

  try {
    const texts = [
      'Welcome to our website',
      'Click here to learn more',
      'Contact us for support',
      'Thank you for your purchase',
      'Your order has been shipped',
    ];

    console.log(`Translating ${texts.length} texts from English to German...\n`);

    const result = await engine.translateBatch({
      texts,
      sourceLang: 'en',
      targetLang: 'de',
    });

    console.log(`Success: ${result.successCount}/${result.totalCount}`);
    console.log(`Failures: ${result.failureCount}\n`);

    result.translations.forEach((translation, index) => {
      console.log(`${index + 1}. ${texts[index]}`);
      console.log(`   → ${translation.translatedText}\n`);
    });
  } catch (error) {
    console.error('Batch translation error:', error);
  }

  await engine.close();
}

// Run examples
if (require.main === module) {
  (async () => {
    await basicExample();
    console.log('\n' + '='.repeat(50) + '\n');

    await multiProviderExample();
    console.log('\n' + '='.repeat(50) + '\n');

    await contextExample();
    console.log('\n' + '='.repeat(50) + '\n');

    await batchExample();
  })();
}

export {
  basicExample,
  multiProviderExample,
  contextExample,
  batchExample,
};
