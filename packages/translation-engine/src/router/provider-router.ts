/**
 * Provider router - selects the best provider for a given translation request
 */

import { TranslationRequest, ProviderName, ValidationError } from '../types';
import { ITranslationProvider } from '../providers/base';

export interface RoutingStrategy {
  selectProvider(
    request: TranslationRequest,
    providers: Map<ProviderName, ITranslationProvider>
  ): ProviderName | null;
}

/**
 * Quality-based routing - selects provider with highest quality rating for language pair
 */
export class QualityBasedRouting implements RoutingStrategy {
  selectProvider(
    request: TranslationRequest,
    providers: Map<ProviderName, ITranslationProvider>
  ): ProviderName | null {
    let bestProvider: ProviderName | null = null;
    let bestQuality = -1;

    for (const [name, provider] of providers.entries()) {
      if (!provider.isLanguagePairSupported(request.sourceLang, request.targetLang)) {
        continue;
      }

      const quality = provider.getQualityRating(request.sourceLang, request.targetLang);
      if (quality > bestQuality) {
        bestQuality = quality;
        bestProvider = name;
      }
    }

    return bestProvider;
  }
}

/**
 * Cost-based routing - selects cheapest available provider
 */
export class CostBasedRouting implements RoutingStrategy {
  selectProvider(
    request: TranslationRequest,
    providers: Map<ProviderName, ITranslationProvider>
  ): ProviderName | null {
    let bestProvider: ProviderName | null = null;
    let bestCost = Infinity;

    for (const [name, provider] of providers.entries()) {
      if (!provider.isLanguagePairSupported(request.sourceLang, request.targetLang)) {
        continue;
      }

      const cost = provider.capabilities.costPerChar || Infinity;
      if (cost < bestCost) {
        bestCost = cost;
        bestProvider = name;
      }
    }

    return bestProvider;
  }
}

/**
 * Latency-based routing - selects fastest provider
 */
export class LatencyBasedRouting implements RoutingStrategy {
  selectProvider(
    request: TranslationRequest,
    providers: Map<ProviderName, ITranslationProvider>
  ): ProviderName | null {
    let bestProvider: ProviderName | null = null;
    let bestLatency = Infinity;

    for (const [name, provider] of providers.entries()) {
      if (!provider.isLanguagePairSupported(request.sourceLang, request.targetLang)) {
        continue;
      }

      const latency = provider.capabilities.avgLatency || Infinity;
      if (latency < bestLatency) {
        bestLatency = latency;
        bestProvider = name;
      }
    }

    return bestProvider;
  }
}

/**
 * Balanced routing - considers quality, cost, and latency
 */
export class BalancedRouting implements RoutingStrategy {
  private weights: {
    quality: number;
    cost: number;
    latency: number;
  };

  constructor(weights?: { quality?: number; cost?: number; latency?: number }) {
    this.weights = {
      quality: weights?.quality || 0.6,
      cost: weights?.cost || 0.2,
      latency: weights?.latency || 0.2,
    };

    // Normalize weights
    const total = this.weights.quality + this.weights.cost + this.weights.latency;
    this.weights.quality /= total;
    this.weights.cost /= total;
    this.weights.latency /= total;
  }

  selectProvider(
    request: TranslationRequest,
    providers: Map<ProviderName, ITranslationProvider>
  ): ProviderName | null {
    let bestProvider: ProviderName | null = null;
    let bestScore = -Infinity;

    // Collect metrics for normalization
    const metrics: Array<{
      name: ProviderName;
      quality: number;
      cost: number;
      latency: number;
    }> = [];

    for (const [name, provider] of providers.entries()) {
      if (!provider.isLanguagePairSupported(request.sourceLang, request.targetLang)) {
        continue;
      }

      metrics.push({
        name,
        quality: provider.getQualityRating(request.sourceLang, request.targetLang),
        cost: provider.capabilities.costPerChar || 0.0001,
        latency: provider.capabilities.avgLatency || 2000,
      });
    }

    if (metrics.length === 0) {
      return null;
    }

    // Normalize metrics
    const maxQuality = Math.max(...metrics.map((m) => m.quality));
    const minCost = Math.min(...metrics.map((m) => m.cost));
    const minLatency = Math.min(...metrics.map((m) => m.latency));

    // Calculate weighted scores
    for (const metric of metrics) {
      const normalizedQuality = metric.quality / maxQuality;
      const normalizedCost = minCost / metric.cost;
      const normalizedLatency = minLatency / metric.latency;

      const score =
        normalizedQuality * this.weights.quality +
        normalizedCost * this.weights.cost +
        normalizedLatency * this.weights.latency;

      if (score > bestScore) {
        bestScore = score;
        bestProvider = metric.name;
      }
    }

    return bestProvider;
  }
}

/**
 * Language-specific routing with fallback rules
 */
export class LanguageSpecificRouting implements RoutingStrategy {
  private preferredProviders: Map<string, ProviderName>;
  private fallbackStrategy: RoutingStrategy;

  constructor(
    preferredProviders?: Map<string, ProviderName>,
    fallbackStrategy?: RoutingStrategy
  ) {
    this.preferredProviders = preferredProviders || new Map();
    this.fallbackStrategy = fallbackStrategy || new QualityBasedRouting();

    // Default preferences (can be overridden)
    if (this.preferredProviders.size === 0) {
      this.setDefaultPreferences();
    }
  }

  private setDefaultPreferences(): void {
    // DeepL excels at European languages
    const europeanPairs = [
      'en-de', 'de-en', 'en-fr', 'fr-en', 'en-es', 'es-en',
      'en-pt', 'pt-en', 'en-it', 'it-en', 'en-nl', 'nl-en',
    ];
    europeanPairs.forEach((pair) => this.preferredProviders.set(pair, 'deepl'));

    // Anthropic Claude for Asian languages and general purpose
    const asianPairs = ['en-ja', 'ja-en', 'en-ko', 'ko-en', 'en-zh', 'zh-en'];
    asianPairs.forEach((pair) => this.preferredProviders.set(pair, 'anthropic'));
  }

  selectProvider(
    request: TranslationRequest,
    providers: Map<ProviderName, ITranslationProvider>
  ): ProviderName | null {
    const pairKey = `${request.sourceLang}-${request.targetLang}`;

    // Check for preferred provider
    const preferred = this.preferredProviders.get(pairKey);
    if (preferred && providers.has(preferred)) {
      const provider = providers.get(preferred)!;
      if (provider.isLanguagePairSupported(request.sourceLang, request.targetLang)) {
        return preferred;
      }
    }

    // Fallback to other strategy
    return this.fallbackStrategy.selectProvider(request, providers);
  }

  setPreference(languagePair: string, provider: ProviderName): void {
    this.preferredProviders.set(languagePair, provider);
  }
}

/**
 * Main provider router
 */
export class ProviderRouter {
  private providers: Map<ProviderName, ITranslationProvider>;
  private strategy: RoutingStrategy;
  private defaultProvider?: ProviderName;

  constructor(
    providers: Map<ProviderName, ITranslationProvider>,
    strategy?: RoutingStrategy,
    defaultProvider?: ProviderName
  ) {
    this.providers = providers;
    this.strategy = strategy || new BalancedRouting();
    this.defaultProvider = defaultProvider;

    if (this.providers.size === 0) {
      throw new ValidationError('At least one provider must be configured');
    }
  }

  selectProvider(request: TranslationRequest): ProviderName {
    // Try strategy-based selection
    const selected = this.strategy.selectProvider(request, this.providers);

    if (selected) {
      return selected;
    }

    // Try default provider
    if (this.defaultProvider && this.providers.has(this.defaultProvider)) {
      const provider = this.providers.get(this.defaultProvider)!;
      if (provider.isLanguagePairSupported(request.sourceLang, request.targetLang)) {
        return this.defaultProvider;
      }
    }

    // Try any available provider
    for (const [name, provider] of this.providers.entries()) {
      if (provider.isLanguagePairSupported(request.sourceLang, request.targetLang)) {
        return name;
      }
    }

    throw new ValidationError(
      `No provider supports translation from ${request.sourceLang} to ${request.targetLang}`
    );
  }

  getProvider(name: ProviderName): ITranslationProvider | undefined {
    return this.providers.get(name);
  }

  getAllProviders(): Map<ProviderName, ITranslationProvider> {
    return this.providers;
  }

  setStrategy(strategy: RoutingStrategy): void {
    this.strategy = strategy;
  }

  addProvider(name: ProviderName, provider: ITranslationProvider): void {
    this.providers.set(name, provider);
  }

  removeProvider(name: ProviderName): void {
    this.providers.delete(name);
  }
}
