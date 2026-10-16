/**
 * Language selector UI component
 * Customizable dropdown for language switching
 */

import type { CivetConfig } from '../types';
import { Logger } from '../utils/helpers';

interface LanguageOption {
  code: string;
  name: string;
  flag?: string;
}

const DEFAULT_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

export class LanguageSelector {
  private config: CivetConfig;
  private logger: Logger;
  private container: HTMLElement | null;
  private dropdown: HTMLElement | null;
  private currentLanguage: string;
  private languages: LanguageOption[];
  private isOpen: boolean;
  private onLanguageChange: (language: string) => void;

  constructor(
    config: CivetConfig,
    logger: Logger,
    onLanguageChange: (language: string) => void
  ) {
    this.config = config;
    this.logger = logger;
    this.container = null;
    this.dropdown = null;
    this.currentLanguage = config.defaultLanguage || 'en';
    this.isOpen = false;
    this.onLanguageChange = onLanguageChange;

    // Filter languages based on config
    this.languages = this.getAvailableLanguages();
  }

  /**
   * Get available languages from config or defaults
   */
  private getAvailableLanguages(): LanguageOption[] {
    if (this.config.targetLanguages && this.config.targetLanguages.length > 0) {
      // Filter default languages by config
      const targetCodes = new Set([
        this.config.defaultLanguage || 'en',
        ...this.config.targetLanguages
      ]);

      return DEFAULT_LANGUAGES.filter(lang => targetCodes.has(lang.code));
    }

    return DEFAULT_LANGUAGES;
  }

  /**
   * Render the language selector
   */
  public render(): void {
    // Check if custom element is provided
    if (this.config.customSelectorElement) {
      this.container = this.config.customSelectorElement;
    } else {
      this.container = this.createContainer();
      document.body.appendChild(this.container);
    }

    // Inject styles
    this.injectStyles();

    // Build selector UI
    this.buildSelector();

    this.logger.debugLog('Language selector rendered');
  }

  /**
   * Create container element
   */
  private createContainer(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'civet-language-selector';

    const position = this.config.selectorPosition || 'top-right';
    container.classList.add(`civet-${position}`);

    return container;
  }

  /**
   * Inject CSS styles
   */
  private injectStyles(): void {
    // Check if styles are already injected
    if (document.getElementById('civet-widget-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'civet-widget-styles';
    style.textContent = `
      ${this.getCSSContent()}
    `;

    document.head.appendChild(style);
  }

  /**
   * Get CSS content (inline from styles.css)
   */
  private getCSSContent(): string {
    // CSS will be inlined during build
    return `.civet-language-selector{position:fixed;z-index:999999;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,sans-serif;font-size:14px;line-height:1.5}.civet-language-selector.civet-top-right{top:20px;right:20px}.civet-language-selector.civet-top-left{top:20px;left:20px}.civet-language-selector.civet-bottom-right{bottom:20px;right:20px}.civet-language-selector.civet-bottom-left{bottom:20px;left:20px}.civet-selector-button{display:flex;align-items:center;gap:8px;padding:10px 16px;background:#fff;border:1px solid #e0e0e0;border-radius:8px;cursor:pointer;transition:all .2s ease;box-shadow:0 2px 8px rgba(0,0,0,.1);font-size:14px;color:#333;font-weight:500}.civet-selector-button:hover{border-color:#3b82f6;box-shadow:0 4px 12px rgba(59,130,246,.15)}.civet-selector-button:focus{outline:none;border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.1)}.civet-globe-icon{width:18px;height:18px;display:inline-block}.civet-globe-icon svg{width:100%;height:100%;fill:currentColor}.civet-arrow-icon{width:12px;height:12px;transition:transform .2s ease}.civet-arrow-icon.civet-open{transform:rotate(180deg)}.civet-selector-dropdown{position:absolute;top:calc(100% + 8px);right:0;min-width:200px;background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.15);opacity:0;visibility:hidden;transform:translateY(-10px);transition:all .2s ease;max-height:300px;overflow-y:auto}.civet-selector-dropdown.civet-open{opacity:1;visibility:visible;transform:translateY(0)}.civet-dropdown-item{display:flex;align-items:center;gap:12px;padding:12px 16px;cursor:pointer;transition:background-color .15s ease;color:#333;text-decoration:none;border:none;background:none;width:100%;text-align:left;font-size:14px}.civet-dropdown-item:hover{background-color:#f5f5f5}.civet-dropdown-item.civet-active{background-color:#eff6ff;color:#3b82f6;font-weight:600}.civet-dropdown-item:first-child{border-radius:8px 8px 0 0}.civet-dropdown-item:last-child{border-radius:0 0 8px 8px}.civet-language-flag{font-size:20px;line-height:1}.civet-language-name{flex:1}.civet-selector-loading{opacity:.6;pointer-events:none}.civet-loading-spinner{width:16px;height:16px;border:2px solid #e0e0e0;border-top-color:#3b82f6;border-radius:50%;animation:civet-spin .8s linear infinite}@keyframes civet-spin{to{transform:rotate(360deg)}}@media (max-width:640px){.civet-language-selector.civet-top-right,.civet-language-selector.civet-top-left{top:12px}.civet-language-selector.civet-top-right,.civet-language-selector.civet-bottom-right{right:12px}.civet-language-selector.civet-top-left,.civet-language-selector.civet-bottom-left{left:12px}.civet-language-selector.civet-bottom-right,.civet-language-selector.civet-bottom-left{bottom:12px}.civet-selector-button{padding:8px 12px;font-size:13px}.civet-selector-dropdown{min-width:180px;max-height:250px}.civet-dropdown-item{padding:10px 14px;font-size:13px}}@media (prefers-color-scheme:dark){.civet-selector-button{background:#1f2937;border-color:#374151;color:#f9fafb}.civet-selector-button:hover{border-color:#3b82f6}.civet-selector-dropdown{background:#1f2937;border-color:#374151}.civet-dropdown-item{color:#f9fafb}.civet-dropdown-item:hover{background-color:#374151}.civet-dropdown-item.civet-active{background-color:#1e3a8a;color:#93c5fd}.civet-loading-spinner{border-color:#374151;border-top-color:#3b82f6}}.civet-selector-button:focus-visible{outline:2px solid #3b82f6;outline-offset:2px}.civet-dropdown-item:focus-visible{outline:2px solid #3b82f6;outline-offset:-2px}.civet-selector-dropdown::-webkit-scrollbar{width:6px}.civet-selector-dropdown::-webkit-scrollbar-track{background:transparent}.civet-selector-dropdown::-webkit-scrollbar-thumb{background:#d1d5db;border-radius:3px}.civet-selector-dropdown::-webkit-scrollbar-thumb:hover{background:#9ca3af}`;
  }

  /**
   * Build selector UI
   */
  private buildSelector(): void {
    if (!this.container) return;

    const currentLang = this.languages.find(l => l.code === this.currentLanguage);

    // Create button
    const button = document.createElement('button');
    button.className = 'civet-selector-button';
    button.setAttribute('aria-label', 'Select language');
    button.setAttribute('aria-haspopup', 'true');
    button.setAttribute('aria-expanded', 'false');

    button.innerHTML = `
      <span class="civet-globe-icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
          <path d="M2 12H22" stroke="currentColor" stroke-width="2"/>
          <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" stroke-width="2"/>
        </svg>
      </span>
      <span class="civet-language-name">${currentLang?.name || 'Language'}</span>
      <span class="civet-arrow-icon">
        <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 4L6 8L10 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </span>
    `;

    // Create dropdown
    this.dropdown = document.createElement('div');
    this.dropdown.className = 'civet-selector-dropdown';
    this.dropdown.setAttribute('role', 'menu');

    // Add language options
    this.languages.forEach(lang => {
      const item = document.createElement('button');
      item.className = 'civet-dropdown-item';
      item.setAttribute('role', 'menuitem');
      item.setAttribute('data-language', lang.code);

      if (lang.code === this.currentLanguage) {
        item.classList.add('civet-active');
      }

      item.innerHTML = `
        ${lang.flag ? `<span class="civet-language-flag">${lang.flag}</span>` : ''}
        <span class="civet-language-name">${lang.name}</span>
      `;

      item.addEventListener('click', () => this.selectLanguage(lang.code));
      this.dropdown!.appendChild(item);
    });

    // Toggle dropdown
    button.addEventListener('click', () => this.toggle());

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (this.container && !this.container.contains(e.target as Node)) {
        this.close();
      }
    });

    // Keyboard navigation
    button.addEventListener('keydown', (e) => this.handleKeyDown(e));

    this.container.appendChild(button);
    this.container.appendChild(this.dropdown);
  }

  /**
   * Toggle dropdown
   */
  private toggle(): void {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Open dropdown
   */
  private open(): void {
    if (!this.dropdown) return;

    this.dropdown.classList.add('civet-open');
    this.isOpen = true;

    const button = this.container?.querySelector('.civet-selector-button');
    button?.setAttribute('aria-expanded', 'true');

    const arrow = this.container?.querySelector('.civet-arrow-icon');
    arrow?.classList.add('civet-open');
  }

  /**
   * Close dropdown
   */
  private close(): void {
    if (!this.dropdown) return;

    this.dropdown.classList.remove('civet-open');
    this.isOpen = false;

    const button = this.container?.querySelector('.civet-selector-button');
    button?.setAttribute('aria-expanded', 'false');

    const arrow = this.container?.querySelector('.civet-arrow-icon');
    arrow?.classList.remove('civet-open');
  }

  /**
   * Select a language
   */
  private selectLanguage(code: string): void {
    if (code === this.currentLanguage) {
      this.close();
      return;
    }

    this.currentLanguage = code;
    this.updateUI(code);
    this.close();

    this.logger.info(`Language changed to: ${code}`);
    this.onLanguageChange(code);
  }

  /**
   * Update UI after language change
   */
  private updateUI(code: string): void {
    const lang = this.languages.find(l => l.code === code);
    if (!lang) return;

    // Update button text
    const buttonText = this.container?.querySelector('.civet-selector-button .civet-language-name');
    if (buttonText) {
      buttonText.textContent = lang.name;
    }

    // Update active state
    const items = this.dropdown?.querySelectorAll('.civet-dropdown-item');
    items?.forEach(item => {
      if (item.getAttribute('data-language') === code) {
        item.classList.add('civet-active');
      } else {
        item.classList.remove('civet-active');
      }
    });
  }

  /**
   * Handle keyboard navigation
   */
  private handleKeyDown(e: KeyboardEvent): void {
    switch (e.key) {
      case 'Escape':
        this.close();
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        this.toggle();
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!this.isOpen) this.open();
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!this.isOpen) this.open();
        break;
    }
  }

  /**
   * Show loading state
   */
  public showLoading(): void {
    this.container?.classList.add('civet-selector-loading');
  }

  /**
   * Hide loading state
   */
  public hideLoading(): void {
    this.container?.classList.remove('civet-selector-loading');
  }

  /**
   * Set current language programmatically
   */
  public setLanguage(code: string): void {
    this.currentLanguage = code;
    this.updateUI(code);
  }

  /**
   * Destroy the selector
   */
  public destroy(): void {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }

    // Remove styles if no other selectors exist
    const selectors = document.querySelectorAll('.civet-language-selector');
    if (selectors.length === 0) {
      const styles = document.getElementById('civet-widget-styles');
      if (styles) {
        styles.remove();
      }
    }

    this.logger.debugLog('Language selector destroyed');
  }
}
