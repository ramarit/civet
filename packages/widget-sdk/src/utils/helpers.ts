/**
 * Utility helper functions
 */

import type { LogLevel } from '../types';

/**
 * Generate a fast hash for text content
 * Using FNV-1a algorithm for speed
 */
export function hashText(text: string): string {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return (hash >>> 0).toString(36);
}

/**
 * Sanitize text to prevent XSS attacks
 */
export function sanitizeText(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Check if a node should be translated
 */
export function shouldTranslateNode(node: Node, excludeSelectors: string[]): boolean {
  if (node.nodeType !== Node.TEXT_NODE) return false;

  const text = node.textContent?.trim();
  if (!text || text.length === 0) return false;

  // Check if parent element should be excluded
  const parent = node.parentElement;
  if (!parent) return false;

  // Exclude script, style, and noscript tags
  const tagName = parent.tagName.toLowerCase();
  if (['script', 'style', 'noscript', 'svg', 'code', 'pre'].includes(tagName)) {
    return false;
  }

  // Check if parent has civet-no-translate attribute
  if (parent.hasAttribute('data-civet-no-translate')) {
    return false;
  }

  // Check exclude selectors
  if (excludeSelectors.length > 0) {
    for (const selector of excludeSelectors) {
      try {
        if (parent.matches(selector) || parent.closest(selector)) {
          return false;
        }
      } catch (e) {
        // Invalid selector, skip
      }
    }
  }

  return true;
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Get cookie value by name
 */
export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

/**
 * Set cookie with options
 */
export function setCookie(
  name: string,
  value: string,
  days: number = 365,
  domain?: string
): void {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  const domainStr = domain ? `; domain=${domain}` : '';
  const sameSite = '; SameSite=Lax';
  document.cookie = `${name}=${value}; ${expires}${domainStr}; path=/${sameSite}`;
}

/**
 * Simple logger with levels
 */
export class Logger {
  private debug: boolean;
  private prefix: string = '[Civet]';

  constructor(debug: boolean = false) {
    this.debug = debug;
  }

  private log(level: LogLevel, ...args: any[]): void {
    if (!this.debug && level === 'debug') return;

    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const prefix = `${this.prefix} [${level.toUpperCase()}] ${timestamp}`;

    switch (level) {
      case 'debug':
      case 'info':
        console.log(prefix, ...args);
        break;
      case 'warn':
        console.warn(prefix, ...args);
        break;
      case 'error':
        console.error(prefix, ...args);
        break;
    }
  }

  public debugLog(...args: any[]): void {
    this.log('debug', ...args);
  }

  public info(...args: any[]): void {
    this.log('info', ...args);
  }

  public warn(...args: any[]): void {
    this.log('warn', ...args);
  }

  public error(...args: any[]): void {
    this.log('error', ...args);
  }
}

/**
 * Get browser language
 */
export function getBrowserLanguage(): string {
  return (
    navigator.language ||
    (navigator as any).userLanguage ||
    'en'
  ).split('-')[0];
}

/**
 * Performance marker for debugging
 */
export function perfMark(label: string): () => number {
  const start = performance.now();
  return () => {
    const duration = performance.now() - start;
    return duration;
  };
}
