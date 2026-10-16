/**
 * Core translation engine
 * Manages text extraction, translation, and DOM updates
 */

import type { TranslationData, TextNode, CivetConfig } from '../types';
import { hashText, shouldTranslateNode, sanitizeText, perfMark } from '../utils/helpers';
import { Logger } from '../utils/helpers';

export class Translator {
  private config: CivetConfig;
  private logger: Logger;
  private textNodes: Map<string, TextNode[]>;
  private currentLanguage: string;
  private translationCache: Map<string, TranslationData>;

  constructor(config: CivetConfig, logger: Logger) {
    this.config = config;
    this.logger = logger;
    this.textNodes = new Map();
    this.currentLanguage = config.defaultLanguage || 'en';
    this.translationCache = new Map();
  }

  /**
   * Extract all translatable text nodes from the DOM
   */
  public extractTextNodes(root: Document | HTMLElement = document.body): TextNode[] {
    const mark = perfMark('extractTextNodes');
    const nodes: TextNode[] = [];
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          return shouldTranslateNode(node, this.config.excludeSelectors || [])
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        }
      }
    );

    let node: Node | null;
    while ((node = walker.nextNode())) {
      const text = node.textContent?.trim();
      if (text) {
        const hash = hashText(text);
        nodes.push({ node, text, hash });
      }
    }

    const duration = mark();
    this.logger.debugLog(`Extracted ${nodes.length} text nodes in ${duration.toFixed(2)}ms`);

    return nodes;
  }

  /**
   * Store text nodes by language
   */
  public storeTextNodes(language: string, nodes: TextNode[]): void {
    this.textNodes.set(language, nodes);
  }

  /**
   * Get unique texts for translation
   */
  public getUniqueTexts(nodes: TextNode[]): string[] {
    const uniqueTexts = new Set<string>();
    nodes.forEach(({ text }) => uniqueTexts.add(text));
    return Array.from(uniqueTexts);
  }

  /**
   * Apply translations to DOM
   */
  public applyTranslations(
    targetLanguage: string,
    translations: TranslationData
  ): void {
    const mark = perfMark('applyTranslations');

    // Get original text nodes
    const originalNodes = this.textNodes.get(this.config.defaultLanguage || 'en');
    if (!originalNodes) {
      this.logger.warn('No original text nodes found');
      return;
    }

    let translatedCount = 0;

    // Create a document fragment for batch updates
    const fragment = document.createDocumentFragment();

    originalNodes.forEach(({ node, text, hash }) => {
      const translated = translations[text]?.[targetLanguage];

      if (translated && node.parentNode) {
        // Sanitize translated text to prevent XSS
        const safeText = sanitizeText(translated);

        // Check if node is still in DOM
        if (node.isConnected) {
          node.textContent = safeText;
          translatedCount++;
        }
      }
    });

    const duration = mark();
    this.logger.debugLog(
      `Applied ${translatedCount} translations in ${duration.toFixed(2)}ms`
    );

    this.currentLanguage = targetLanguage;
  }

  /**
   * Revert to original language
   */
  public revertToOriginal(): void {
    const mark = perfMark('revertToOriginal');
    const originalLanguage = this.config.defaultLanguage || 'en';
    const originalNodes = this.textNodes.get(originalLanguage);

    if (!originalNodes) {
      this.logger.warn('No original text nodes found for revert');
      return;
    }

    let revertedCount = 0;

    originalNodes.forEach(({ node, text }) => {
      if (node.isConnected && node.textContent !== text) {
        node.textContent = text;
        revertedCount++;
      }
    });

    const duration = mark();
    this.logger.debugLog(`Reverted ${revertedCount} nodes in ${duration.toFixed(2)}ms`);

    this.currentLanguage = originalLanguage;
  }

  /**
   * Translate new nodes (for dynamic content)
   */
  public async translateNewNodes(
    nodes: TextNode[],
    targetLanguage: string,
    translations: TranslationData
  ): void {
    if (nodes.length === 0) return;

    const mark = perfMark('translateNewNodes');
    let translatedCount = 0;

    nodes.forEach(({ node, text }) => {
      const translated = translations[text]?.[targetLanguage];

      if (translated && node.isConnected) {
        const safeText = sanitizeText(translated);
        node.textContent = safeText;
        translatedCount++;
      }
    });

    const duration = mark();
    this.logger.debugLog(
      `Translated ${translatedCount} new nodes in ${duration.toFixed(2)}ms`
    );
  }

  /**
   * Get current language
   */
  public getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  /**
   * Get stored text nodes for a language
   */
  public getTextNodes(language: string): TextNode[] | undefined {
    return this.textNodes.get(language);
  }

  /**
   * Clear all stored text nodes
   */
  public clear(): void {
    this.textNodes.clear();
    this.translationCache.clear();
  }

  /**
   * Get translation statistics
   */
  public getStats(): {
    storedLanguages: number;
    totalNodes: number;
    currentLanguage: string;
  } {
    let totalNodes = 0;
    this.textNodes.forEach((nodes) => {
      totalNodes += nodes.length;
    });

    return {
      storedLanguages: this.textNodes.size,
      totalNodes,
      currentLanguage: this.currentLanguage
    };
  }
}
