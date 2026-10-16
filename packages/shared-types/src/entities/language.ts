/**
 * Language entity types
 */

export interface Language {
  code: string; // ISO 639-1 code (e.g., 'en', 'es', 'fr')
  name: string; // Native name (e.g., 'English', 'Español', 'Français')
  englishName: string; // English name
  direction: 'ltr' | 'rtl'; // Text direction
  supported: boolean; // Whether the platform supports this language
}

export interface LanguageDetection {
  code: string;
  confidence: number; // 0-1
  isReliable: boolean;
}

export interface LanguagePair {
  sourceLanguage: string;
  targetLanguage: string;
  supported: boolean;
  qualityRating: number; // 0-5 scale
}

export interface LocaleInfo {
  locale: string; // Full locale (e.g., 'en-US', 'es-MX')
  language: string; // Language code
  country: string | null; // Country code
  displayName: string;
  nativeName: string;
}

// Common language codes
export const SUPPORTED_LANGUAGES = {
  EN: 'en',
  ES: 'es',
  FR: 'fr',
  DE: 'de',
  IT: 'it',
  PT: 'pt',
  RU: 'ru',
  JA: 'ja',
  ZH: 'zh',
  KO: 'ko',
  AR: 'ar',
  HI: 'hi',
  NL: 'nl',
  PL: 'pl',
  TR: 'tr',
  SV: 'sv',
  DA: 'da',
  NO: 'no',
  FI: 'fi',
  EL: 'el',
} as const;

export type SupportedLanguageCode = (typeof SUPPORTED_LANGUAGES)[keyof typeof SUPPORTED_LANGUAGES];
