/**
 * Core types for the translation engine
 */

export interface TranslationRequest {
  text: string;
  sourceLang: string;
  targetLang: string;
  context?: string;
  metadata?: Record<string, any>;
}

export interface TranslationResponse {
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  provider: string;
  qualityScore?: number;
  confidence?: number;
  metadata?: {
    cached?: boolean;
    attemptCount?: number;
    latency?: number;
    modelUsed?: string;
  };
}

export interface BatchTranslationRequest {
  texts: string[];
  sourceLang: string;
  targetLang: string;
  context?: string;
  metadata?: Record<string, any>;
}

export interface BatchTranslationResponse {
  translations: TranslationResponse[];
  totalCount: number;
  successCount: number;
  failureCount: number;
}

export interface ProviderConfig {
  apiKey: string;
  endpoint?: string;
  model?: string;
  maxRetries?: number;
  timeout?: number;
  rateLimit?: {
    requestsPerMinute: number;
    requestsPerDay?: number;
  };
}

export interface CacheConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  ttl?: number; // Time to live in seconds
  keyPrefix?: string;
}

export interface TranslationEngineConfig {
  providers: {
    anthropic?: ProviderConfig;
    openai?: ProviderConfig;
    deepl?: ProviderConfig;
  };
  cache?: CacheConfig;
  defaultProvider?: ProviderName;
  enableQualityScoring?: boolean;
  enableCaching?: boolean;
  retryConfig?: RetryConfig;
}

export interface RetryConfig {
  maxAttempts: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
}

export type ProviderName = 'anthropic' | 'openai' | 'deepl';

export interface QualityMetrics {
  score: number; // 0-100
  factors: {
    fluency?: number;
    accuracy?: number;
    consistency?: number;
    formality?: number;
  };
  issues?: string[];
}

export interface ProviderCapability {
  supportedLanguages: string[];
  qualityRatings: Record<string, number>; // language pair -> quality rating
  costPerChar?: number;
  avgLatency?: number;
  maxCharsPerRequest?: number;
}

export class TranslationError extends Error {
  constructor(
    message: string,
    public code: string,
    public provider?: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'TranslationError';
  }
}

export class ProviderError extends TranslationError {
  constructor(message: string, provider: string, originalError?: Error) {
    super(message, 'PROVIDER_ERROR', provider, originalError);
    this.name = 'ProviderError';
  }
}

export class RateLimitError extends TranslationError {
  constructor(message: string, provider: string, public retryAfter?: number) {
    super(message, 'RATE_LIMIT_ERROR', provider);
    this.name = 'RateLimitError';
  }
}

export class ValidationError extends TranslationError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}
