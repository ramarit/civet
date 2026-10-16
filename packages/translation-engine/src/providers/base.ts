/**
 * Base provider interface and abstract class
 */

import {
  TranslationRequest,
  TranslationResponse,
  BatchTranslationRequest,
  BatchTranslationResponse,
  ProviderConfig,
  ProviderCapability,
  ProviderName,
  RetryConfig,
  ProviderError,
  RateLimitError,
} from '../types';

export interface ITranslationProvider {
  readonly name: ProviderName;
  readonly capabilities: ProviderCapability;

  translate(request: TranslationRequest): Promise<TranslationResponse>;
  translateBatch(request: BatchTranslationRequest): Promise<BatchTranslationResponse>;
  isLanguagePairSupported(sourceLang: string, targetLang: string): boolean;
  getQualityRating(sourceLang: string, targetLang: string): number;
}

export abstract class BaseTranslationProvider implements ITranslationProvider {
  abstract readonly name: ProviderName;
  abstract readonly capabilities: ProviderCapability;

  protected config: ProviderConfig;
  protected retryConfig: RetryConfig;

  constructor(config: ProviderConfig, retryConfig?: RetryConfig) {
    this.config = config;
    this.retryConfig = retryConfig || {
      maxAttempts: 3,
      initialDelayMs: 1000,
      maxDelayMs: 10000,
      backoffMultiplier: 2,
    };
  }

  abstract translate(request: TranslationRequest): Promise<TranslationResponse>;

  async translateBatch(request: BatchTranslationRequest): Promise<BatchTranslationResponse> {
    const results: TranslationResponse[] = [];
    let successCount = 0;
    let failureCount = 0;

    // Process translations in parallel with concurrency limit
    const concurrencyLimit = 5;
    const chunks = this.chunkArray(request.texts, concurrencyLimit);

    for (const chunk of chunks) {
      const promises = chunk.map(async (text) => {
        try {
          const response = await this.translate({
            text,
            sourceLang: request.sourceLang,
            targetLang: request.targetLang,
            context: request.context,
            metadata: request.metadata,
          });
          successCount++;
          return response;
        } catch (error) {
          failureCount++;
          // Return error as part of response
          return {
            translatedText: '',
            sourceLang: request.sourceLang,
            targetLang: request.targetLang,
            provider: this.name,
            metadata: {
              error: error instanceof Error ? error.message : 'Unknown error',
            },
          } as TranslationResponse;
        }
      });

      const chunkResults = await Promise.all(promises);
      results.push(...chunkResults);
    }

    return {
      translations: results,
      totalCount: request.texts.length,
      successCount,
      failureCount,
    };
  }

  isLanguagePairSupported(sourceLang: string, targetLang: string): boolean {
    return (
      this.capabilities.supportedLanguages.includes(sourceLang) &&
      this.capabilities.supportedLanguages.includes(targetLang)
    );
  }

  getQualityRating(sourceLang: string, targetLang: string): number {
    const pairKey = `${sourceLang}-${targetLang}`;
    return this.capabilities.qualityRatings[pairKey] || 0;
  }

  protected async executeWithRetry<T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> {
    let lastError: Error | undefined;
    let delay = this.retryConfig.initialDelayMs;

    for (let attempt = 1; attempt <= this.retryConfig.maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        // Don't retry on certain errors
        if (error instanceof RateLimitError && error.retryAfter) {
          delay = error.retryAfter * 1000;
        } else if (this.isNonRetryableError(error)) {
          throw error;
        }

        if (attempt < this.retryConfig.maxAttempts) {
          await this.sleep(delay);
          delay = Math.min(delay * this.retryConfig.backoffMultiplier, this.retryConfig.maxDelayMs);
        }
      }
    }

    throw new ProviderError(
      `${operationName} failed after ${this.retryConfig.maxAttempts} attempts: ${lastError?.message}`,
      this.name,
      lastError
    );
  }

  protected isNonRetryableError(error: unknown): boolean {
    if (error instanceof Error) {
      // Add validation errors, auth errors, etc.
      const nonRetryableMessages = ['invalid api key', 'authentication failed', 'invalid request'];
      return nonRetryableMessages.some((msg) =>
        error.message.toLowerCase().includes(msg)
      );
    }
    return false;
  }

  protected sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  protected chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  protected validateRequest(request: TranslationRequest): void {
    if (!request.text || request.text.trim().length === 0) {
      throw new Error('Text to translate cannot be empty');
    }

    if (!request.sourceLang || !request.targetLang) {
      throw new Error('Source and target languages are required');
    }

    if (!this.isLanguagePairSupported(request.sourceLang, request.targetLang)) {
      throw new Error(
        `Language pair ${request.sourceLang}-${request.targetLang} is not supported by ${this.name}`
      );
    }

    const maxChars = this.capabilities.maxCharsPerRequest || Infinity;
    if (request.text.length > maxChars) {
      throw new Error(
        `Text exceeds maximum length of ${maxChars} characters for provider ${this.name}`
      );
    }
  }
}
