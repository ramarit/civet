/**
 * Anthropic Claude provider implementation
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

export class AnthropicProvider extends BaseTranslationProvider {
  readonly name = 'anthropic' as const;
  readonly capabilities: ProviderCapability = {
    supportedLanguages: [
      'en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh',
      'ar', 'hi', 'nl', 'pl', 'sv', 'tr', 'vi', 'th', 'id', 'ms',
    ],
    qualityRatings: {
      'en-es': 95, 'en-fr': 95, 'en-de': 94, 'en-ja': 92, 'en-zh': 91,
      'es-en': 95, 'fr-en': 95, 'de-en': 94, 'ja-en': 92, 'zh-en': 91,
      'en-pt': 93, 'en-ru': 90, 'en-ar': 88, 'en-hi': 87,
      'pt-en': 93, 'ru-en': 90, 'ar-en': 88, 'hi-en': 87,
    },
    costPerChar: 0.0001,
    avgLatency: 2000,
    maxCharsPerRequest: 100000,
  };

  private readonly apiEndpoint: string;
  private readonly model: string;

  constructor(config: ProviderConfig) {
    super(config);
    this.apiEndpoint = config.endpoint || 'https://api.anthropic.com/v1/messages';
    this.model = config.model || 'claude-3-5-sonnet-20241022';
  }

  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    this.validateRequest(request);

    const startTime = Date.now();

    const response = await this.executeWithRetry(
      () => this.callAnthropicAPI(request),
      'Anthropic translation'
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
        modelUsed: this.model,
      },
    };
  }

  private async callAnthropicAPI(request: TranslationRequest): Promise<{
    translatedText: string;
    confidence?: number;
  }> {
    const prompt = this.buildPrompt(request);

    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.config.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: 4096,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.3,
        }),
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
        confidence: this.estimateConfidence(data),
      };
    } catch (error) {
      if (error instanceof ProviderError || error instanceof RateLimitError) {
        throw error;
      }
      throw new ProviderError(
        `Anthropic API call failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        this.name,
        error instanceof Error ? error : undefined
      );
    }
  }

  private buildPrompt(request: TranslationRequest): string {
    const sourceLangName = this.getLanguageName(request.sourceLang);
    const targetLangName = this.getLanguageName(request.targetLang);

    let prompt = `Translate the following text from ${sourceLangName} to ${targetLangName}.\n\n`;

    if (request.context) {
      prompt += `Context: ${request.context}\n\n`;
    }

    prompt += `Source text:\n${request.text}\n\n`;
    prompt += `Provide ONLY the translated text without any explanations, notes, or additional commentary. `;
    prompt += `Maintain the original tone, style, and formatting.`;

    return prompt;
  }

  private extractTranslation(data: any): string {
    if (!data.content || !Array.isArray(data.content) || data.content.length === 0) {
      throw new ProviderError('Invalid response format from Anthropic API', this.name);
    }

    const textContent = data.content.find((c: any) => c.type === 'text');
    if (!textContent || !textContent.text) {
      throw new ProviderError('No text content in Anthropic API response', this.name);
    }

    return textContent.text.trim();
  }

  private estimateConfidence(data: any): number {
    // Claude doesn't provide confidence scores directly
    // We can estimate based on stop_reason and other factors
    if (data.stop_reason === 'end_turn') {
      return 0.95;
    } else if (data.stop_reason === 'max_tokens') {
      return 0.75; // Might be truncated
    }
    return 0.85;
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
      const retryAfter = response.headers.get('retry-after');
      throw new RateLimitError(
        `Rate limit exceeded: ${errorData.error?.message || errorText}`,
        this.name,
        retryAfter ? parseInt(retryAfter, 10) : undefined
      );
    }

    throw new ProviderError(
      `Anthropic API error (${response.status}): ${errorData.error?.message || errorText}`,
      this.name
    );
  }

  private getLanguageName(code: string): string {
    const languageNames: Record<string, string> = {
      en: 'English', es: 'Spanish', fr: 'French', de: 'German',
      it: 'Italian', pt: 'Portuguese', ru: 'Russian', ja: 'Japanese',
      ko: 'Korean', zh: 'Chinese', ar: 'Arabic', hi: 'Hindi',
      nl: 'Dutch', pl: 'Polish', sv: 'Swedish', tr: 'Turkish',
      vi: 'Vietnamese', th: 'Thai', id: 'Indonesian', ms: 'Malay',
    };
    return languageNames[code] || code;
  }
}
