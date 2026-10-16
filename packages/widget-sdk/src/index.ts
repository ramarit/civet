/**
 * Civet Widget SDK
 * Production-ready JavaScript widget for website translation
 */

import type { CivetConfig, TranslationData, TextNode } from './types';
import { Translator } from './core/translator';
import { DOMObserver } from './core/dom-observer';
import { APIClient } from './core/api-client';
import { LanguageSelector } from './ui/language-selector';
import { TranslationCache } from './utils/cache';
import { URLRewriter } from './utils/url-rewriter';
import {
  Logger,
  getCookie,
  setCookie,
  getBrowserLanguage,
  perfMark
} from './utils/helpers';

class CivetWidget {
  private config: CivetConfig;
  private logger: Logger;
  private translator: Translator;
  private observer: DOMObserver;
  private apiClient: APIClient;
  private cache: TranslationCache;
  private urlRewriter: URLRewriter;
  private selector: LanguageSelector | null;
  private isInitialized: boolean;
  private currentLanguage: string;

  constructor(config: CivetConfig) {
    // Validate required config
    if (!config.projectId) {
      throw new Error('Civet: projectId is required');
    }

    // Merge with defaults
    this.config = {
      apiUrl: 'https://api.civet.ai',
      defaultLanguage: 'en',
      autoDetect: true,
      cookieName: 'civet_lang',
      cookieExpiry: 365,
      enableCache: true,
      cacheExpiry: 7,
      selectorPosition: 'top-right',
      excludeSelectors: [],
      debug: false,
      ...config
    };

    this.logger = new Logger(this.config.debug);
    this.translator = new Translator(this.config, this.logger);
    this.observer = new DOMObserver(
      this.config.excludeSelectors || [],
      this.logger
    );
    this.apiClient = new APIClient(
      this.config.apiUrl!,
      this.config.projectId,
      this.logger
    );
    this.cache = new TranslationCache(
      this.config.enableCache,
      this.config.cacheExpiry
    );
    this.urlRewriter = new URLRewriter(this.config.defaultLanguage);
    this.selector = null;
    this.isInitialized = false;
    this.currentLanguage = this.config.defaultLanguage!;

    this.logger.info('Civet Widget initialized with project:', this.config.projectId);
  }

  /**
   * Initialize the widget
   */
  public async init(): Promise<void> {
    if (this.isInitialized) {
      this.logger.warn('Widget already initialized');
      return;
    }

    const mark = perfMark('init');

    try {
      // Determine initial language
      const targetLanguage = this.determineLanguage();
      this.currentLanguage = targetLanguage;

      // Extract original text nodes
      const originalNodes = this.translator.extractTextNodes();
      this.translator.storeTextNodes(this.config.defaultLanguage!, originalNodes);

      // Render language selector
      this.renderSelector();

      // Translate if not default language
      if (targetLanguage !== this.config.defaultLanguage) {
        await this.translateToLanguage(targetLanguage);
      }

      // Start observing DOM mutations
      this.observer.start(async (newNodes) => {
        await this.handleNewNodes(newNodes);
      });

      // Listen to URL changes
      this.urlRewriter.onPopState(async (language) => {
        await this.changeLanguage(language);
      });

      this.isInitialized = true;

      const duration = mark();
      this.logger.info(`Widget initialized in ${duration.toFixed(2)}ms`);

      // Call callback
      if (this.config.onTranslationComplete) {
        this.config.onTranslationComplete();
      }
    } catch (error) {
      this.logger.error('Failed to initialize widget:', error);

      if (this.config.onError) {
        this.config.onError(error as Error);
      }

      throw error;
    }
  }

  /**
   * Determine which language to show
   */
  private determineLanguage(): string {
    // 1. Check URL
    const urlLang = this.urlRewriter.detectLanguageFromURL();
    if (urlLang) {
      this.logger.debugLog('Language from URL:', urlLang);
      return urlLang;
    }

    // 2. Check cookie
    const cookieLang = getCookie(this.config.cookieName!);
    if (cookieLang) {
      this.logger.debugLog('Language from cookie:', cookieLang);
      return cookieLang;
    }

    // 3. Auto-detect from browser
    if (this.config.autoDetect) {
      const browserLang = getBrowserLanguage();

      // Check if browser language is in target languages
      if (
        this.config.targetLanguages &&
        this.config.targetLanguages.includes(browserLang)
      ) {
        this.logger.debugLog('Language auto-detected:', browserLang);
        return browserLang;
      }
    }

    // 4. Fall back to default
    return this.config.defaultLanguage!;
  }

  /**
   * Render language selector
   */
  private renderSelector(): void {
    this.selector = new LanguageSelector(
      this.config,
      this.logger,
      async (language) => {
        await this.changeLanguage(language);
      }
    );

    this.selector.render();
    this.selector.setLanguage(this.currentLanguage);
  }

  /**
   * Change language
   */
  public async changeLanguage(targetLanguage: string): Promise<void> {
    if (targetLanguage === this.currentLanguage) {
      return;
    }

    const mark = perfMark('changeLanguage');

    try {
      this.selector?.showLoading();

      // Update URL
      this.urlRewriter.rewriteURL(targetLanguage);

      // Save to cookie
      setCookie(
        this.config.cookieName!,
        targetLanguage,
        this.config.cookieExpiry,
        this.config.cookieDomain
      );

      // Translate
      if (targetLanguage === this.config.defaultLanguage) {
        this.translator.revertToOriginal();
      } else {
        await this.translateToLanguage(targetLanguage);
      }

      // Update selector
      this.selector?.setLanguage(targetLanguage);
      this.currentLanguage = targetLanguage;

      const duration = mark();
      this.logger.info(`Language changed to ${targetLanguage} in ${duration.toFixed(2)}ms`);

      // Call callback
      if (this.config.onLanguageChange) {
        this.config.onLanguageChange(targetLanguage);
      }
    } catch (error) {
      this.logger.error('Failed to change language:', error);

      if (this.config.onError) {
        this.config.onError(error as Error);
      }
    } finally {
      this.selector?.hideLoading();
    }
  }

  /**
   * Translate to a specific language
   */
  private async translateToLanguage(targetLanguage: string): Promise<void> {
    // Get original text nodes
    const originalNodes = this.translator.getTextNodes(this.config.defaultLanguage!);
    if (!originalNodes) {
      this.logger.error('No original text nodes found');
      return;
    }

    // Check cache first
    let translations = this.cache.get(this.config.projectId, targetLanguage);

    if (!translations) {
      // Fetch from API
      const texts = this.translator.getUniqueTexts(originalNodes);

      this.logger.debugLog(`Fetching ${texts.length} translations for ${targetLanguage}`);

      translations = await this.apiClient.fetchTranslations(
        this.config.defaultLanguage!,
        targetLanguage,
        texts
      );

      // Cache the translations
      this.cache.set(this.config.projectId, targetLanguage, translations);
    } else {
      this.logger.debugLog(`Using cached translations for ${targetLanguage}`);
    }

    // Apply translations
    this.translator.applyTranslations(targetLanguage, translations);
  }

  /**
   * Handle new nodes from mutation observer
   */
  private async handleNewNodes(nodes: TextNode[]): Promise<void> {
    if (this.currentLanguage === this.config.defaultLanguage) {
      // Store new original nodes
      const existingNodes = this.translator.getTextNodes(this.config.defaultLanguage!) || [];
      this.translator.storeTextNodes(this.config.defaultLanguage!, [
        ...existingNodes,
        ...nodes
      ]);
      return;
    }

    // Get translations for new nodes
    const texts = this.translator.getUniqueTexts(nodes);

    if (texts.length === 0) return;

    try {
      // Check cache first
      let translations = this.cache.get(this.config.projectId, this.currentLanguage);

      // Check if we need to fetch new translations
      const missingTexts = texts.filter(text => {
        return !translations || !translations[text];
      });

      if (missingTexts.length > 0) {
        this.logger.debugLog(`Fetching ${missingTexts.length} new translations`);

        const newTranslations = await this.apiClient.fetchTranslations(
          this.config.defaultLanguage!,
          this.currentLanguage,
          missingTexts
        );

        // Merge with existing cache
        translations = { ...translations, ...newTranslations };
        this.cache.set(this.config.projectId, this.currentLanguage, translations);
      }

      // Translate new nodes
      if (translations) {
        await this.translator.translateNewNodes(nodes, this.currentLanguage, translations);
      }
    } catch (error) {
      this.logger.error('Failed to translate new nodes:', error);
    }
  }

  /**
   * Get current language
   */
  public getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  /**
   * Get widget statistics
   */
  public getStats() {
    return {
      ...this.translator.getStats(),
      cacheSize: this.cache.getSize(),
      observerActive: this.observer.isActive(),
      queueSize: this.observer.getQueueSize()
    };
  }

  /**
   * Clear all caches
   */
  public clearCache(): void {
    this.cache.clear();
    this.logger.info('Cache cleared');
  }

  /**
   * Destroy the widget
   */
  public destroy(): void {
    this.observer.stop();
    this.selector?.destroy();
    this.translator.clear();
    this.isInitialized = false;
    this.logger.info('Widget destroyed');
  }
}

// Auto-initialize from script tag
if (typeof window !== 'undefined') {
  const initFromScriptTag = () => {
    const script = document.currentScript as HTMLScriptElement;

    if (!script) {
      // Try to find script tag with data-project attribute
      const scripts = document.querySelectorAll('script[data-project]');
      if (scripts.length === 0) return;

      const projectId = scripts[0].getAttribute('data-project');
      if (!projectId) return;

      const widget = new CivetWidget({ projectId });

      // Wait for DOM ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => widget.init());
      } else {
        widget.init();
      }

      // Expose to window
      (window as any).civetWidget = widget;
      return;
    }

    const projectId = script.getAttribute('data-project');
    if (!projectId) return;

    const config: CivetConfig = {
      projectId,
      apiUrl: script.getAttribute('data-api-url') || undefined,
      defaultLanguage: script.getAttribute('data-default-lang') || undefined,
      debug: script.hasAttribute('data-debug')
    };

    const widget = new CivetWidget(config);

    // Wait for DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => widget.init());
    } else {
      widget.init();
    }

    // Expose to window
    (window as any).civetWidget = widget;
  };

  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFromScriptTag);
  } else {
    initFromScriptTag();
  }
}

// Export for programmatic usage
export { CivetWidget };
export type { CivetConfig };
export default CivetWidget;
