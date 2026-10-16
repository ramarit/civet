/**
 * Translation entity types
 */

export enum TranslationStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CACHED = 'cached',
}

export enum TranslationQuality {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  UNRATED = 'unrated',
}

export interface Translation {
  id: string;
  projectId: string;
  sourceText: string;
  translatedText: string | null;
  sourceLanguage: string;
  targetLanguage: string;
  status: TranslationStatus;
  quality: TranslationQuality;
  qualityScore: number | null;
  context: TranslationContext;
  metadata: TranslationMetadata;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
}

export interface TranslationContext {
  url: string | null;
  selector: string | null;
  elementType: string | null;
  surroundingText: string | null;
  attributes: Record<string, string>;
}

export interface TranslationMetadata {
  engine: string;
  model: string | null;
  tokensUsed: number | null;
  latencyMs: number | null;
  cost: number | null;
  cached: boolean;
  cacheKey: string | null;
  retryCount: number;
  errorMessage: string | null;
}

export interface TranslationBatch {
  id: string;
  projectId: string;
  translationIds: string[];
  status: TranslationStatus;
  totalCount: number;
  completedCount: number;
  failedCount: number;
  createdAt: Date;
  completedAt: Date | null;
}

export type CreateTranslationInput = Pick<
  Translation,
  'projectId' | 'sourceText' | 'sourceLanguage' | 'targetLanguage'
> & {
  context?: Partial<TranslationContext>;
};

export type TranslationResult = Pick<
  Translation,
  'id' | 'sourceText' | 'translatedText' | 'status' | 'quality' | 'qualityScore'
>;
