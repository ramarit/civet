/**
 * Translation quality scoring
 */

import { TranslationResponse, QualityMetrics } from '../types';

export interface QualityScorer {
  score(
    originalText: string,
    translation: TranslationResponse,
    sourceLang: string,
    targetLang: string
  ): Promise<QualityMetrics>;
}

/**
 * Heuristic-based quality scorer
 * Uses various heuristics to estimate translation quality
 */
export class HeuristicQualityScorer implements QualityScorer {
  async score(
    originalText: string,
    translation: TranslationResponse,
    sourceLang: string,
    targetLang: string
  ): Promise<QualityMetrics> {
    const factors = {
      fluency: this.scoreFluency(translation.translatedText),
      consistency: this.scoreConsistency(originalText, translation.translatedText),
      formality: this.scoreFormality(translation.translatedText),
    };

    const issues: string[] = [];

    // Check for common issues
    if (factors.fluency < 0.5) {
      issues.push('Low fluency score - translation may be awkward');
    }

    if (this.hasUntranslatedContent(translation.translatedText, originalText)) {
      issues.push('Contains untranslated content');
      factors.fluency *= 0.8;
    }

    if (this.hasMalformedStructure(translation.translatedText)) {
      issues.push('Malformed structure detected');
      factors.fluency *= 0.9;
    }

    if (this.hasExcessiveRepetition(translation.translatedText)) {
      issues.push('Excessive repetition detected');
      factors.fluency *= 0.85;
    }

    // Calculate overall score (0-100)
    const overallScore = Math.round(
      (factors.fluency * 0.4 + factors.consistency * 0.4 + factors.formality * 0.2) * 100
    );

    return {
      score: Math.max(0, Math.min(100, overallScore)),
      factors,
      issues: issues.length > 0 ? issues : undefined,
    };
  }

  private scoreFluency(text: string): number {
    let score = 1.0;

    // Check for incomplete sentences
    if (!this.endsWithProperPunctuation(text)) {
      score -= 0.1;
    }

    // Check for awkward character patterns
    if (this.hasAwkwardPatterns(text)) {
      score -= 0.15;
    }

    // Check word-to-character ratio (very rough fluency indicator)
    const words = text.split(/\s+/).filter((w) => w.length > 0);
    const avgWordLength = text.length / Math.max(words.length, 1);

    // Extremely long or short average word lengths might indicate issues
    if (avgWordLength < 2 || avgWordLength > 20) {
      score -= 0.1;
    }

    return Math.max(0, Math.min(1, score));
  }

  private scoreConsistency(original: string, translation: string): number {
    let score = 1.0;

    // Check length ratio (very different lengths might indicate issues)
    const lengthRatio = translation.length / original.length;

    // Most languages have reasonable length ratios (0.5 to 2.0)
    if (lengthRatio < 0.3 || lengthRatio > 3.0) {
      score -= 0.2;
    }

    // Check if formatting is preserved (line breaks, etc.)
    const originalLineBreaks = (original.match(/\n/g) || []).length;
    const translationLineBreaks = (translation.match(/\n/g) || []).length;

    if (originalLineBreaks !== translationLineBreaks) {
      score -= 0.1;
    }

    // Check for preserved special characters (URLs, emails, etc.)
    const originalUrls = this.extractUrls(original);
    const translationUrls = this.extractUrls(translation);

    if (originalUrls.length !== translationUrls.length) {
      score -= 0.15;
    }

    return Math.max(0, Math.min(1, score));
  }

  private scoreFormality(text: string): number {
    // Basic formality scoring (placeholder - could be enhanced with NLP)
    let score = 0.5; // Neutral starting point

    // Check for common informal markers (language-specific)
    const informalPatterns = /\b(lol|omg|btw|tbh|idk)\b/gi;
    if (informalPatterns.test(text)) {
      score -= 0.2;
    }

    // Check for proper capitalization
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    let properCapitalization = 0;

    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      if (trimmed.length > 0 && /^[A-Z]/.test(trimmed)) {
        properCapitalization++;
      }
    }

    if (sentences.length > 0) {
      score += (properCapitalization / sentences.length) * 0.3;
    }

    return Math.max(0, Math.min(1, score));
  }

  private hasUntranslatedContent(translation: string, original: string): boolean {
    // Check if large chunks of original text appear in translation
    const originalWords = original
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 4);
    const translationLower = translation.toLowerCase();

    let untranslatedCount = 0;
    for (const word of originalWords.slice(0, 10)) {
      // Check first 10 words
      if (translationLower.includes(word)) {
        untranslatedCount++;
      }
    }

    // If more than 70% of words appear unchanged, might be untranslated
    return untranslatedCount / Math.min(originalWords.length, 10) > 0.7;
  }

  private hasMalformedStructure(text: string): boolean {
    // Check for unbalanced brackets, quotes, etc.
    const openBrackets = (text.match(/[\[({]/g) || []).length;
    const closeBrackets = (text.match(/[\])}]/g) || []).length;

    const openQuotes = (text.match(/["'`]/g) || []).length;

    return (
      Math.abs(openBrackets - closeBrackets) > 1 ||
      openQuotes % 2 !== 0
    );
  }

  private hasExcessiveRepetition(text: string): boolean {
    const words = text.toLowerCase().split(/\s+/);

    if (words.length < 10) {
      return false;
    }

    // Check for repeated consecutive words
    let repetitions = 0;
    for (let i = 0; i < words.length - 1; i++) {
      if (words[i] === words[i + 1] && words[i].length > 3) {
        repetitions++;
      }
    }

    return repetitions > words.length * 0.1;
  }

  private endsWithProperPunctuation(text: string): boolean {
    const trimmed = text.trim();
    return /[.!?;:]$/.test(trimmed);
  }

  private hasAwkwardPatterns(text: string): boolean {
    // Check for multiple spaces
    if (/\s{3,}/.test(text)) {
      return true;
    }

    // Check for repeated punctuation (except ellipsis)
    if (/[!?]{3,}/.test(text) || /\.{4,}/.test(text)) {
      return true;
    }

    return false;
  }

  private extractUrls(text: string): string[] {
    const urlPattern = /https?:\/\/[^\s]+/g;
    return text.match(urlPattern) || [];
  }
}

/**
 * Simple quality scorer (faster, less detailed)
 */
export class SimpleQualityScorer implements QualityScorer {
  async score(
    originalText: string,
    translation: TranslationResponse,
    sourceLang: string,
    targetLang: string
  ): Promise<QualityMetrics> {
    const translatedText = translation.translatedText;

    // Basic checks
    let score = 100;
    const issues: string[] = [];

    // Check if empty
    if (!translatedText || translatedText.trim().length === 0) {
      return {
        score: 0,
        factors: { fluency: 0, accuracy: 0, consistency: 0 },
        issues: ['Translation is empty'],
      };
    }

    // Check length ratio
    const lengthRatio = translatedText.length / originalText.length;
    if (lengthRatio < 0.2 || lengthRatio > 5.0) {
      score -= 20;
      issues.push('Unusual length ratio');
    }

    // Check for same content (might indicate no translation)
    if (translatedText === originalText) {
      score -= 30;
      issues.push('Translation identical to source');
    }

    // Use provider confidence if available
    if (translation.confidence) {
      score = (score * 0.5) + (translation.confidence * 100 * 0.5);
    }

    return {
      score: Math.max(0, Math.min(100, Math.round(score))),
      factors: {
        fluency: score / 100,
        accuracy: score / 100,
        consistency: score / 100,
      },
      issues: issues.length > 0 ? issues : undefined,
    };
  }
}

/**
 * Factory for creating quality scorers
 */
export class QualityScorerFactory {
  static create(type: 'heuristic' | 'simple' = 'heuristic'): QualityScorer {
    switch (type) {
      case 'heuristic':
        return new HeuristicQualityScorer();
      case 'simple':
        return new SimpleQualityScorer();
      default:
        return new HeuristicQualityScorer();
    }
  }
}
