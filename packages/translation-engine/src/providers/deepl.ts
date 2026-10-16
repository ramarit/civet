/**
 * DeepL provider implementation
 */

import {
  TranslationRequest,
  TranslationResponse,
  ProviderConfig,
  ProviderCapability,
  ProviderError,
  RateLimitError,
} from '../types';
import { BaseTranslationProvider } from './base';

export class DeepLProvider extends BaseTranslationProvider {
  readonly name = 'deepl' as const;
  readonly capabilities: ProviderCapability = {
    supportedLanguages: [
      'en', 'de', 'fr', 'es', 'pt', 'it', 'nl', 'pl', 'ru',
      'ja', 'zh', 'bg', 'cs', 'da', 'el', 'et', 'fi', 'hu',
      'id', 'ko', 'lt', 'lv', 'nb', 'ro', 'sk', 'sl', 'sv', 'tr', 'uk',
    ],
    qualityRatings: {
      // DeepL excels at European languages
      'en-de': 98, 'de-en': 98, 'en-fr': 97, 'fr-en': 97,
      'en-es': 96, 'es-en': 96, 'en-pt': 96, 'pt-en': 96,
      'en-it': 96, 'it-en': 96, 'en-nl': 95, 'nl-en': 95,
      'en-pl': 94, 'pl-en': 94, 'en-ru': 93, 'ru-en': 93,
      'en-ja': 89, 'ja-en': 89, 'en-zh': 87, 'zh-en': 87,
      'de-fr': 96, 'fr-de': 96, 'de-es': 95, 'es-de': 95,
    },
    costPerChar: 0.00008,
    avgLatency: 1500,
    maxCharsPerRequest: 130000,
  };

  private readonly apiEndpoint: string;
  private readonly isFreeAPI: boolean;

  constructor(config: ProviderConfig) {
    super(config);
    this.isFreeAPI = config.endpoint?.includes('free') || false;
    this.apiEndpoint = config.endpoint || 'https://api.deepl.com/v2/translate';
  }

  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    this.validateRequest(request);

    const startTime = Date.now();

    const response = await this.executeWithRetry(
      () => this.callDeepLAPI(request),
      'DeepL translation'
    );

    return {
      translatedText: response.translatedText,
      sourceLang: request.sourceLang,
      targetLang: request.targetLang,
      provider: this.name,
      confidence: response.confidence,
      metadata: {
        cached: false,
        attemptCount: 1,
        latency: Date.now() - startTime,
        modelUsed: 'deepl',
      },
    };
  }

  private async callDeepLAPI(request: TranslationRequest): Promise<{
    translatedText: string;
    confidence?: number;
  }> {
    const body = this.buildRequestBody(request);

    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `DeepL-Auth-Key ${this.config.apiKey}`,
        },
        body: JSON.stringify(body),
        signal: this.config.timeout
          ? AbortSignal.timeout(this.config.timeout)
          : undefined,
      });

      if (!response.ok) {
        await this.handleAPIError(response);
      }

      const data = await response.json();
      const translatedText = this.extractTranslation(data);

      return {
        translatedText,
        confidence: 0.95, // DeepL is consistently high quality
      };
    } catch (error) {
      if (error instanceof ProviderError || error instanceof RateLimitError) {
        throw error;
      }
      throw new ProviderError(
        `DeepL API call failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        this.name,
        error instanceof Error ? error : undefined
      );
    }
  }

  private buildRequestBody(request: TranslationRequest): Record<string, any> {
    const body: Record<string, any> = {
      text: [request.text],
      source_lang: this.normalizeLanguageCode(request.sourceLang).toUpperCase(),
      target_lang: this.normalizeLanguageCode(request.targetLang).toUpperCase(),
      formality: 'default',
    };

    // Add context as a tag if provided
    if (request.context) {
      body.tag_handling = 'xml';
      body.text = [`<context>${request.context}</context>\n${request.text}`];
    }

    return body;
  }

  private extractTranslation(data: any): string {
    if (!data.translations || !Array.isArray(data.translations) || data.translations.length === 0) {
      throw new ProviderError('Invalid response format from DeepL API', this.name);
    }

    const translation = data.translations[0];
    if (!translation.text) {
      throw new ProviderError('No text in DeepL API response', this.name);
    }

    return translation.text.trim();
  }

  private async handleAPIError(response: Response): Promise<never> {
    const errorText = await response.text();
    let errorData: any;

    try {
      errorData = JSON.parse(errorText);
    } catch {
      errorData = { message: errorText };
    }

    if (response.status === 429) {
      throw new RateLimitError(
        `Rate limit exceeded: ${errorData.message || errorText}`,
        this.name
      );
    }

    if (response.status === 456) {
      throw new ProviderError('DeepL quota exceeded', this.name);
    }

    throw new ProviderError(
      `DeepL API error (${response.status}): ${errorData.message || errorText}`,
      this.name
    );
  }

  private normalizeLanguageCode(code: string): string {
    // DeepL uses specific codes for some languages
    const codeMap: Record<string, string> = {
      'en': 'EN',
      'pt': 'PT-PT', // Default to European Portuguese
      'zh': 'ZH',
      'nb': 'NB', // Norwegian Bokmål
    };

    return codeMap[code.toLowerCase()] || code;
  }

  isLanguagePairSupported(sourceLang: string, targetLang: string): boolean {
    // DeepL has specific source-target pair restrictions
    const normalizedSource = this.normalizeLanguageCode(sourceLang).toUpperCase();
    const normalizedTarget = this.normalizeLanguageCode(targetLang).toUpperCase();

    // Check if both languages are in supported list
    const sourceSupported = this.capabilities.supportedLanguages.includes(sourceLang.toLowerCase());
    const targetSupported = this.capabilities.supportedLanguages.includes(targetLang.toLowerCase());

    if (!sourceSupported || !targetSupported) {
      return false;
    }

    // DeepL doesn't support translation between the same language
    if (normalizedSource === normalizedTarget) {
      return false;
    }

    return true;
  }

  getQualityRating(sourceLang: string, targetLang: string): number {
    const pairKey = `${sourceLang}-${targetLang}`;
    const rating = this.capabilities.qualityRatings[pairKey];

    if (rating) {
      return rating;
    }

    // DeepL has strong baseline quality, especially for European languages
    const europeanLanguages = ['en', 'de', 'fr', 'es', 'pt', 'it', 'nl', 'pl'];
    const bothEuropean = europeanLanguages.includes(sourceLang) &&
                        europeanLanguages.includes(targetLang);

    return bothEuropean ? 92 : 85;
  }
}
