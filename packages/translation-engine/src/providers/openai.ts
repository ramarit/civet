/**
 * OpenAI GPT-4 provider implementation
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

export class OpenAIProvider extends BaseTranslationProvider {
  readonly name = 'openai' as const;
  readonly capabilities: ProviderCapability = {
    supportedLanguages: [
      'en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh',
      'ar', 'hi', 'nl', 'pl', 'sv', 'tr', 'vi', 'th', 'id', 'ms',
      'uk', 'ro', 'cs', 'da', 'fi', 'el', 'he', 'hu', 'no',
    ],
    qualityRatings: {
      'en-es': 94, 'en-fr': 94, 'en-de': 93, 'en-ja': 91, 'en-zh': 90,
      'es-en': 94, 'fr-en': 94, 'de-en': 93, 'ja-en': 91, 'zh-en': 90,
      'en-pt': 92, 'en-ru': 89, 'en-ar': 87, 'en-hi': 86,
      'pt-en': 92, 'ru-en': 89, 'ar-en': 87, 'hi-en': 86,
    },
    costPerChar: 0.00012,
    avgLatency: 2500,
    maxCharsPerRequest: 80000,
  };

  private readonly apiEndpoint: string;
  private readonly model: string;

  constructor(config: ProviderConfig) {
    super(config);
    this.apiEndpoint = config.endpoint || 'https://api.openai.com/v1/chat/completions';
    this.model = config.model || 'gpt-4-turbo-preview';
  }

  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    this.validateRequest(request);

    const startTime = Date.now();

    const response = await this.executeWithRetry(
      () => this.callOpenAIAPI(request),
      'OpenAI translation'
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

  private async callOpenAIAPI(request: TranslationRequest): Promise<{
    translatedText: string;
    confidence?: number;
  }> {
    const messages = this.buildMessages(request);

    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature: 0.3,
          max_tokens: 4096,
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
        `OpenAI API call failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        this.name,
        error instanceof Error ? error : undefined
      );
    }
  }

  private buildMessages(request: TranslationRequest): Array<{
    role: string;
    content: string;
  }> {
    const sourceLangName = this.getLanguageName(request.sourceLang);
    const targetLangName = this.getLanguageName(request.targetLang);

    const systemMessage = {
      role: 'system',
      content: `You are a professional translator specializing in ${sourceLangName} to ${targetLangName} translation. Provide accurate, natural-sounding translations that preserve the original meaning, tone, and style. Return ONLY the translated text without any explanations or commentary.`,
    };

    let userContent = `Translate the following ${sourceLangName} text to ${targetLangName}:\n\n`;

    if (request.context) {
      userContent += `Context: ${request.context}\n\n`;
    }

    userContent += request.text;

    const userMessage = {
      role: 'user',
      content: userContent,
    };

    return [systemMessage, userMessage];
  }

  private extractTranslation(data: any): string {
    if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      throw new ProviderError('Invalid response format from OpenAI API', this.name);
    }

    const choice = data.choices[0];
    if (!choice.message || !choice.message.content) {
      throw new ProviderError('No content in OpenAI API response', this.name);
    }

    return choice.message.content.trim();
  }

  private estimateConfidence(data: any): number {
    if (!data.choices || !data.choices[0]) {
      return 0.5;
    }

    const choice = data.choices[0];

    // Check finish_reason
    if (choice.finish_reason === 'stop') {
      return 0.95;
    } else if (choice.finish_reason === 'length') {
      return 0.7; // Truncated response
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
      `OpenAI API error (${response.status}): ${errorData.error?.message || errorText}`,
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
      uk: 'Ukrainian', ro: 'Romanian', cs: 'Czech', da: 'Danish',
      fi: 'Finnish', el: 'Greek', he: 'Hebrew', hu: 'Hungarian',
      no: 'Norwegian',
    };
    return languageNames[code] || code;
  }
}
