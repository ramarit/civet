/**
 * Cache management for translations
 * Uses localStorage with expiry
 */

import type { TranslationData, CacheEntry } from '../types';

const CACHE_PREFIX = 'civet_cache_';

export class TranslationCache {
  private enabled: boolean;
  private expiry: number; // in milliseconds

  constructor(enabled: boolean = true, expiryDays: number = 7) {
    this.enabled = enabled && this.isLocalStorageAvailable();
    this.expiry = expiryDays * 24 * 60 * 60 * 1000;
  }

  private isLocalStorageAvailable(): boolean {
    try {
      const test = '__civet_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  private getCacheKey(projectId: string, language: string): string {
    return `${CACHE_PREFIX}${projectId}_${language}`;
  }

  /**
   * Get cached translations for a language
   */
  public get(projectId: string, language: string): TranslationData | null {
    if (!this.enabled) return null;

    try {
      const key = this.getCacheKey(projectId, language);
      const cached = localStorage.getItem(key);

      if (!cached) return null;

      const entry: CacheEntry = JSON.parse(cached);

      // Check if cache has expired
      if (Date.now() - entry.timestamp > this.expiry) {
        this.remove(projectId, language);
        return null;
      }

      return entry.data;
    } catch (e) {
      return null;
    }
  }

  /**
   * Store translations in cache
   */
  public set(projectId: string, language: string, data: TranslationData): void {
    if (!this.enabled) return;

    try {
      const key = this.getCacheKey(projectId, language);
      const entry: CacheEntry = {
        data,
        timestamp: Date.now(),
        language
      };

      localStorage.setItem(key, JSON.stringify(entry));
    } catch (e) {
      // localStorage might be full, try to clear old entries
      this.clearExpired();
    }
  }

  /**
   * Remove cached translations for a language
   */
  public remove(projectId: string, language: string): void {
    if (!this.enabled) return;

    try {
      const key = this.getCacheKey(projectId, language);
      localStorage.removeItem(key);
    } catch (e) {
      // Ignore
    }
  }

  /**
   * Clear all Civet caches
   */
  public clear(): void {
    if (!this.enabled) return;

    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(CACHE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      // Ignore
    }
  }

  /**
   * Clear expired cache entries
   */
  public clearExpired(): void {
    if (!this.enabled) return;

    try {
      const keys = Object.keys(localStorage);
      const now = Date.now();

      keys.forEach(key => {
        if (key.startsWith(CACHE_PREFIX)) {
          const cached = localStorage.getItem(key);
          if (cached) {
            try {
              const entry: CacheEntry = JSON.parse(cached);
              if (now - entry.timestamp > this.expiry) {
                localStorage.removeItem(key);
              }
            } catch (e) {
              // Invalid entry, remove it
              localStorage.removeItem(key);
            }
          }
        }
      });
    } catch (e) {
      // Ignore
    }
  }

  /**
   * Get cache size in bytes (approximate)
   */
  public getSize(): number {
    if (!this.enabled) return 0;

    try {
      let size = 0;
      const keys = Object.keys(localStorage);

      keys.forEach(key => {
        if (key.startsWith(CACHE_PREFIX)) {
          const item = localStorage.getItem(key);
          if (item) {
            size += key.length + item.length;
          }
        }
      });

      return size;
    } catch (e) {
      return 0;
    }
  }
}
