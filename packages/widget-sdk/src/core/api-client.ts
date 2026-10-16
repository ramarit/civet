/**
 * API client for fetching translations from Civet API
 */

import type { TranslationData, TranslationRequest, TranslationResponse } from '../types';
import { Logger } from '../utils/helpers';

export class APIClient {
  private apiUrl: string;
  private projectId: string;
  private logger: Logger;
  private requestQueue: Map<string, Promise<TranslationData>>;

  constructor(apiUrl: string, projectId: string, logger: Logger) {
    this.apiUrl = apiUrl.replace(/\/$/, ''); // Remove trailing slash
    this.projectId = projectId;
    this.logger = logger;
    this.requestQueue = new Map();
  }

  /**
   * Fetch translations from API
   */
  public async fetchTranslations(
    sourceLanguage: string,
    targetLanguage: string,
    texts: string[]
  ): Promise<TranslationData> {
    // Deduplicate texts
    const uniqueTexts = Array.from(new Set(texts));

    // Create cache key for this request
    const cacheKey = `${targetLanguage}:${uniqueTexts.join('|')}`;

    // Check if request is already in flight
    const existing = this.requestQueue.get(cacheKey);
    if (existing) {
      this.logger.debugLog('Using in-flight request for', targetLanguage);
      return existing;
    }

    // Create new request
    const request = this.makeRequest(sourceLanguage, targetLanguage, uniqueTexts);
    this.requestQueue.set(cacheKey, request);

    try {
      const result = await request;
      return result;
    } finally {
      // Clean up request queue
      this.requestQueue.delete(cacheKey);
    }
  }

  /**
   * Make HTTP request to translation API
   */
  private async makeRequest(
    sourceLanguage: string,
    targetLanguage: string,
    texts: string[]
  ): Promise<TranslationData> {
    const payload: TranslationRequest = {
      projectId: this.projectId,
      sourceLanguage,
      targetLanguage,
      texts
    };

    const url = `${this.apiUrl}/v1/translate`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Civet-Project': this.projectId
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data: TranslationResponse = await response.json();

      this.logger.debugLog(
        `Fetched ${Object.keys(data.translations).length} translations for ${targetLanguage}`
      );

      return data.translations;
    } catch (error) {
      this.logger.error('Failed to fetch translations:', error);
      throw error;
    }
  }

  /**
   * Batch multiple translation requests
   */
  public async fetchBatch(
    sourceLanguage: string,
    targetLanguage: string,
    textBatches: string[][]
  ): Promise<TranslationData[]> {
    const promises = textBatches.map(batch =>
      this.fetchTranslations(sourceLanguage, targetLanguage, batch)
    );

    return Promise.all(promises);
  }

  /**
   * Health check for API
   */
  public async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/health`, {
        method: 'GET',
        headers: {
          'X-Civet-Project': this.projectId
        }
      });

      return response.ok;
    } catch (error) {
      this.logger.error('Health check failed:', error);
      return false;
    }
  }
}
