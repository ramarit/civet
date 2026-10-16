/**
 * SEO-friendly URL rewriting
 * Handles /en/, /fr/, etc. URL patterns
 */

export class URLRewriter {
  private defaultLanguage: string;
  private currentLanguage: string;

  constructor(defaultLanguage: string = 'en') {
    this.defaultLanguage = defaultLanguage;
    this.currentLanguage = this.detectLanguageFromURL() || defaultLanguage;
  }

  /**
   * Detect language from URL path
   */
  public detectLanguageFromURL(): string | null {
    const path = window.location.pathname;
    const match = path.match(/^\/([a-z]{2})(\/|$)/);
    return match ? match[1] : null;
  }

  /**
   * Get current language from URL or default
   */
  public getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  /**
   * Rewrite URL to include language code
   */
  public rewriteURL(language: string, replace: boolean = false): void {
    if (language === this.defaultLanguage) {
      // Remove language prefix for default language
      this.removeLanguagePrefix(replace);
      return;
    }

    const path = window.location.pathname;
    const currentLang = this.detectLanguageFromURL();

    let newPath: string;

    if (currentLang) {
      // Replace existing language code
      newPath = path.replace(/^\/[a-z]{2}(\/|$)/, `/${language}$1`);
    } else {
      // Add language code
      newPath = `/${language}${path}`;
    }

    // Update URL without page reload
    const url = newPath + window.location.search + window.location.hash;

    if (replace) {
      window.history.replaceState({ language }, '', url);
    } else {
      window.history.pushState({ language }, '', url);
    }

    this.currentLanguage = language;
  }

  /**
   * Remove language prefix from URL
   */
  private removeLanguagePrefix(replace: boolean = false): void {
    const path = window.location.pathname;
    const currentLang = this.detectLanguageFromURL();

    if (!currentLang) return;

    const newPath = path.replace(/^\/[a-z]{2}(\/|$)/, '/');
    const url = newPath + window.location.search + window.location.hash;

    if (replace) {
      window.history.replaceState({ language: this.defaultLanguage }, '', url);
    } else {
      window.history.pushState({ language: this.defaultLanguage }, '', url);
    }

    this.currentLanguage = this.defaultLanguage;
  }

  /**
   * Listen to popstate events (browser back/forward)
   */
  public onPopState(callback: (language: string) => void): void {
    window.addEventListener('popstate', (event) => {
      const language = event.state?.language || this.detectLanguageFromURL() || this.defaultLanguage;
      this.currentLanguage = language;
      callback(language);
    });
  }

  /**
   * Get all links on page and rewrite them
   */
  public rewriteLinks(targetLanguage: string): void {
    if (targetLanguage === this.defaultLanguage) return;

    const links = document.querySelectorAll('a[href^="/"], a[href^="' + window.location.origin + '"]');

    links.forEach((link) => {
      const anchor = link as HTMLAnchorElement;
      const href = anchor.getAttribute('href');

      if (!href) return;

      // Skip if already has language prefix
      if (href.match(/^\/[a-z]{2}(\/|$)/) || href.match(/\/[a-z]{2}(\/|$)/)) {
        return;
      }

      // Add language prefix
      let newHref: string;
      if (href.startsWith(window.location.origin)) {
        const path = href.replace(window.location.origin, '');
        newHref = `${window.location.origin}/${targetLanguage}${path}`;
      } else {
        newHref = `/${targetLanguage}${href}`;
      }

      anchor.setAttribute('href', newHref);
    });
  }

  /**
   * Normalize path for comparison
   */
  public normalizePath(path: string): string {
    return path.replace(/^\/[a-z]{2}(\/|$)/, '/');
  }
}
