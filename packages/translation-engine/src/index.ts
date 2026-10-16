/**
 * Translation Engine - Main entry point
 * Provides a unified interface for multi-provider AI translation with caching and quality scoring
 */

import {
  TranslationRequest,
  TranslationResponse,
  BatchTranslationRequest,
  BatchTranslationResponse,
  TranslationEngineConfig,
  ProviderName,
  ValidationError,
  TranslationError,
} from './types';

import { ITranslationProvider } from './providers/base';
import { AnthropicProvider } from './providers/anthropic';
import { OpenAIProvider } from './providers/openai';
import { DeepLProvider } from './providers/deepl';

import { ICacheProvider, RedisCache, InMemoryCache } from './cache/redis-cache';
import {
  ProviderRouter,
  BalancedRouting,
  QualityBasedRouting,
  CostBasedRouting,
  LatencyBasedRouting,
  LanguageSpecificRouting,
} from './router/provider-router';
import { QualityScorer, QualityScorerFactory } from './quality/scorer';

export class TranslationEngine {
  private router: ProviderRouter;
  private cache?: ICacheProvider;
  private qualityScorer?: QualityScorer;
  private config: TranslationEngineConfig;

  constructor(config: TranslationEngineConfig) {
    this.config = config;
    this.validateConfig(config);

    // Initialize providers
    const providers = this.initializeProviders(config);

    // Initialize router with strategy
    const strategy = new BalancedRouting();
    this.router = new ProviderRouter(providers, strategy, config.defaultProvider);

    // Initialize cache if configured
    if (config.enableCaching && config.cache) {
      this.initializeCache(config.cache);
    }

    // Initialize quality scorer if enabled
    if (config.enableQualityScoring !== false) {
      this.qualityScorer = QualityScorerFactory.create('heuristic');
    }
  }

  /**
   * Translate a single text
   */
  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    this.validateTranslationRequest(request);

    // Check cache first
    if (this.cache) {
      const cacheKey = RedisCache.generateCacheKey(request);
      const cached = await this.cache.get(cacheKey);

      if (cached) {
        return cached;
      }
    }

    // Select provider
    const providerName = this.router.selectProvider(request);
    const provider = this.router.getProvider(providerName);

    if (!provider) {
      throw new TranslationError(
        `Provider ${providerName} not found`,
        'PROVIDER_NOT_FOUND'
      );
    }

    // Perform translation
    const response = await provider.translate(request);

    // Score quality if enabled
    if (this.qualityScorer) {
      const qualityMetrics = await this.qualityScorer.score(
        request.text,
        response,
        request.sourceLang,
        request.targetLang
      );
      response.qualityScore = qualityMetrics.score;
    }

    // Cache the result
    if (this.cache) {
      const cacheKey = RedisCache.generateCacheKey(request);
      await this.cache.set(cacheKey, response);
    }

    return response;
  }

  /**
   * Translate multiple texts
   */
  async translateBatch(request: BatchTranslationRequest): Promise<BatchTranslationResponse> {
    if (!request.texts || request.texts.length === 0) {
      throw new ValidationError('Batch translation requires at least one text');
    }

    // Select provider
    const sampleRequest: TranslationRequest = {
      text: request.texts[0],
      sourceLang: request.sourceLang,
      targetLang: request.targetLang,
      context: request.context,
      metadata: request.metadata,
    };

    const providerName = this.router.selectProvider(sampleRequest);
    const provider = this.router.getProvider(providerName);

    if (!provider) {
      throw new TranslationError(
        `Provider ${providerName} not found`,
        'PROVIDER_NOT_FOUND'
      );
    }

    // Check cache for each text
    const cachedResults: Map<number, TranslationResponse> = new Map();
    const textsToTranslate: Array<{ index: number; text: string }> = [];

    if (this.cache) {
      for (let i = 0; i < request.texts.length; i++) {
        const req: TranslationRequest = {
          text: request.texts[i],
          sourceLang: request.sourceLang,
          targetLang: request.targetLang,
          context: request.context,
        };

        const cacheKey = RedisCache.generateCacheKey(req);
        const cached = await this.cache.get(cacheKey);

        if (cached) {
          cachedResults.set(i, cached);
        } else {
          textsToTranslate.push({ index: i, text: request.texts[i] });
        }
      }
    } else {
      textsToTranslate.push(
        ...request.texts.map((text, index) => ({ index, text }))
      );
    }

    // Translate uncached texts
    let batchResponse: BatchTranslationResponse;

    if (textsToTranslate.length > 0) {
      batchResponse = await provider.translateBatch({
        texts: textsToTranslate.map((t) => t.text),
        sourceLang: request.sourceLang,
        targetLang: request.targetLang,
        context: request.context,
        metadata: request.metadata,
      });

      // Score quality and cache results
      for (let i = 0; i < batchResponse.translations.length; i++) {
        const translation = batchResponse.translations[i];
        const originalText = textsToTranslate[i].text;

        if (this.qualityScorer && translation.translatedText) {
          const qualityMetrics = await this.qualityScorer.score(
            originalText,
            translation,
            request.sourceLang,
            request.targetLang
          );
          translation.qualityScore = qualityMetrics.score;
        }

        // Cache the result
        if (this.cache && translation.translatedText) {
          const req: TranslationRequest = {
            text: originalText,
            sourceLang: request.sourceLang,
            targetLang: request.targetLang,
            context: request.context,
          };
          const cacheKey = RedisCache.generateCacheKey(req);
          await this.cache.set(cacheKey, translation);
        }
      }
    } else {
      batchResponse = {
        translations: [],
        totalCount: 0,
        successCount: 0,
        failureCount: 0,
      };
    }

    // Merge cached and new results
    const allResults: TranslationResponse[] = new Array(request.texts.length);

    for (const [index, cached] of cachedResults.entries()) {
      allResults[index] = cached;
    }

    for (let i = 0; i < textsToTranslate.length; i++) {
      const originalIndex = textsToTranslate[i].index;
      allResults[originalIndex] = batchResponse.translations[i];
    }

    return {
      translations: allResults,
      totalCount: request.texts.length,
      successCount: batchResponse.successCount + cachedResults.size,
      failureCount: batchResponse.failureCount,
    };
  }

  /**
   * Get available providers
   */
  getAvailableProviders(): ProviderName[] {
    return Array.from(this.router.getAllProviders().keys());
  }

  /**
   * Check if a language pair is supported
   */
  isLanguagePairSupported(sourceLang: string, targetLang: string): boolean {
    for (const provider of this.router.getAllProviders().values()) {
      if (provider.isLanguagePairSupported(sourceLang, targetLang)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get the best provider for a language pair
   */
  getBestProvider(sourceLang: string, targetLang: string): ProviderName | null {
    try {
      return this.router.selectProvider({
        text: 'test',
        sourceLang,
        targetLang,
      });
    } catch {
      return null;
    }
  }

  /**
   * Clear translation cache
   */
  async clearCache(): Promise<void> {
    if (this.cache) {
      await this.cache.clear();
    }
  }

  /**
   * Get cache statistics
   */
  async getCacheStats(): Promise<any> {
    if (this.cache instanceof RedisCache) {
      return await this.cache.getStats();
    } else if (this.cache instanceof InMemoryCache) {
      return { totalKeys: this.cache.getSize() };
    }
    return null;
  }

  /**
   * Close connections (e.g., Redis)
   */
  async close(): Promise<void> {
    if (this.cache instanceof RedisCache) {
      await this.cache.disconnect();
    }
  }

  private validateConfig(config: TranslationEngineConfig): void {
    if (!config.providers || Object.keys(config.providers).length === 0) {
      throw new ValidationError('At least one provider must be configured');
    }

    // Validate each provider has an API key
    for (const [name, providerConfig] of Object.entries(config.providers)) {
      if (!providerConfig?.apiKey) {
        throw new ValidationError(`Provider ${name} requires an API key`);
      }
    }
  }

  private validateTranslationRequest(request: TranslationRequest): void {
    if (!request.text || request.text.trim().length === 0) {
      throw new ValidationError('Text to translate cannot be empty');
    }

    if (!request.sourceLang || !request.targetLang) {
      throw new ValidationError('Source and target languages are required');
    }

    if (request.sourceLang === request.targetLang) {
      throw new ValidationError('Source and target languages must be different');
    }
  }

  private initializeProviders(
    config: TranslationEngineConfig
  ): Map<ProviderName, ITranslationProvider> {
    const providers = new Map<ProviderName, ITranslationProvider>();

    if (config.providers.anthropic) {
      providers.set(
        'anthropic',
        new AnthropicProvider(config.providers.anthropic)
      );
    }

    if (config.providers.openai) {
      providers.set(
        'openai',
        new OpenAIProvider(config.providers.openai)
      );
    }

    if (config.providers.deepl) {
      providers.set(
        'deepl',
        new DeepLProvider(config.providers.deepl)
      );
    }

    return providers;
  }

  private initializeCache(cacheConfig: any): void {
    if (cacheConfig.host && cacheConfig.port) {
      // Use Redis cache
      this.cache = new RedisCache(cacheConfig);
      // Connect asynchronously (non-blocking)
      (this.cache as RedisCache).connect().catch((err) => {
        console.error('Failed to connect to Redis, caching disabled:', err);
        this.cache = undefined;
      });
    } else {
      // Use in-memory cache as fallback
      this.cache = new InMemoryCache(cacheConfig);
    }
  }
}

// Export all types and classes
export * from './types';
export * from './providers/base';
export * from './providers/anthropic';
export * from './providers/openai';
export * from './providers/deepl';
export * from './cache/redis-cache';
export * from './router/provider-router';
export * from './quality/scorer';
