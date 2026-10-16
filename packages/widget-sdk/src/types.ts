/**
 * Core types for Civet Widget SDK
 */

export interface CivetConfig {
  projectId: string;
  apiUrl?: string;
  defaultLanguage?: string;
  targetLanguages?: string[];
  autoDetect?: boolean;
  selector?: string;
  excludeSelectors?: string[];
  cookieName?: string;
  cookieDomain?: string;
  cookieExpiry?: number;
  enableCache?: boolean;
  cacheExpiry?: number;
  selectorPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'custom';
  customSelectorElement?: HTMLElement;
  selectorStyle?: Partial<CSSStyleDeclaration>;
  onLanguageChange?: (language: string) => void;
  onTranslationComplete?: () => void;
  onError?: (error: Error) => void;
  debug?: boolean;
}

export interface TranslationData {
  [key: string]: {
    [targetLang: string]: string;
  };
}

export interface TranslationResponse {
  translations: TranslationData;
  metadata?: {
    projectId: string;
    sourceLanguage: string;
    targetLanguage: string;
    timestamp: number;
  };
}

export interface CacheEntry {
  data: TranslationData;
  timestamp: number;
  language: string;
}

export interface TextNode {
  node: Node;
  text: string;
  hash: string;
}

export interface TranslationRequest {
  projectId: string;
  sourceLanguage: string;
  targetLanguage: string;
  texts: string[];
}

export interface MutationQueueItem {
  text: string;
  node: Node;
  hash: string;
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
