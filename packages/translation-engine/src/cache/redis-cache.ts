/**
 * Redis cache implementation for translations
 */

import { createHash } from 'crypto';
import { CacheConfig, TranslationRequest, TranslationResponse } from '../types';

export interface ICacheProvider {
  get(key: string): Promise<TranslationResponse | null>;
  set(key: string, value: TranslationResponse, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  isConnected(): boolean;
}

export class RedisCache implements ICacheProvider {
  private client: any; // Redis client type
  private config: CacheConfig;
  private connected: boolean = false;
  private keyPrefix: string;

  constructor(config: CacheConfig) {
    this.config = config;
    this.keyPrefix = config.keyPrefix || 'translation:';
  }

  async connect(): Promise<void> {
    if (this.connected) {
      return;
    }

    try {
      // Dynamic import to avoid requiring redis if not used
      const redis = await import('redis');

      this.client = redis.createClient({
        socket: {
          host: this.config.host,
          port: this.config.port,
        },
        password: this.config.password,
        database: this.config.db || 0,
      });

      this.client.on('error', (err: Error) => {
        console.error('Redis Client Error:', err);
        this.connected = false;
      });

      this.client.on('connect', () => {
        this.connected = true;
      });

      await this.client.connect();
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client && this.connected) {
      await this.client.quit();
      this.connected = false;
    }
  }

  async get(key: string): Promise<TranslationResponse | null> {
    if (!this.connected || !this.client) {
      return null;
    }

    try {
      const fullKey = this.keyPrefix + key;
      const data = await this.client.get(fullKey);

      if (!data) {
        return null;
      }

      const response = JSON.parse(data) as TranslationResponse;

      // Mark as cached
      if (response.metadata) {
        response.metadata.cached = true;
      } else {
        response.metadata = { cached: true };
      }

      return response;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  async set(key: string, value: TranslationResponse, ttl?: number): Promise<void> {
    if (!this.connected || !this.client) {
      return;
    }

    try {
      const fullKey = this.keyPrefix + key;
      const data = JSON.stringify(value);
      const cacheTTL = ttl || this.config.ttl || 86400; // Default 24 hours

      await this.client.setEx(fullKey, cacheTTL, data);
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }

  async delete(key: string): Promise<void> {
    if (!this.connected || !this.client) {
      return;
    }

    try {
      const fullKey = this.keyPrefix + key;
      await this.client.del(fullKey);
    } catch (error) {
      console.error('Redis delete error:', error);
    }
  }

  async clear(): Promise<void> {
    if (!this.connected || !this.client) {
      return;
    }

    try {
      // Delete all keys with our prefix
      const keys = await this.client.keys(`${this.keyPrefix}*`);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
    } catch (error) {
      console.error('Redis clear error:', error);
    }
  }

  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Generate a cache key for a translation request
   */
  static generateCacheKey(request: TranslationRequest): string {
    const keyData = {
      text: request.text,
      sourceLang: request.sourceLang,
      targetLang: request.targetLang,
      context: request.context || '',
    };

    const hash = createHash('sha256')
      .update(JSON.stringify(keyData))
      .digest('hex');

    return `${request.sourceLang}:${request.targetLang}:${hash}`;
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{
    totalKeys: number;
    memoryUsage?: string;
  }> {
    if (!this.connected || !this.client) {
      return { totalKeys: 0 };
    }

    try {
      const keys = await this.client.keys(`${this.keyPrefix}*`);
      const info = await this.client.info('memory');

      // Parse memory usage from info string
      const memoryMatch = info.match(/used_memory_human:([^\r\n]+)/);
      const memoryUsage = memoryMatch ? memoryMatch[1] : undefined;

      return {
        totalKeys: keys.length,
        memoryUsage,
      };
    } catch (error) {
      console.error('Redis stats error:', error);
      return { totalKeys: 0 };
    }
  }
}

/**
 * In-memory cache fallback (for development or when Redis is unavailable)
 */
export class InMemoryCache implements ICacheProvider {
  private cache: Map<string, { value: TranslationResponse; expiry: number }>;
  private ttl: number;
  private keyPrefix: string;

  constructor(config?: Partial<CacheConfig>) {
    this.cache = new Map();
    this.ttl = (config?.ttl || 3600) * 1000; // Convert to milliseconds
    this.keyPrefix = config?.keyPrefix || 'translation:';

    // Clean up expired entries periodically
    setInterval(() => this.cleanup(), 60000); // Every minute
  }

  async get(key: string): Promise<TranslationResponse | null> {
    const fullKey = this.keyPrefix + key;
    const entry = this.cache.get(fullKey);

    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiry) {
      this.cache.delete(fullKey);
      return null;
    }

    const response = { ...entry.value };
    if (response.metadata) {
      response.metadata.cached = true;
    } else {
      response.metadata = { cached: true };
    }

    return response;
  }

  async set(key: string, value: TranslationResponse, ttl?: number): Promise<void> {
    const fullKey = this.keyPrefix + key;
    const cacheTTL = ttl ? ttl * 1000 : this.ttl;

    this.cache.set(fullKey, {
      value,
      expiry: Date.now() + cacheTTL,
    });
  }

  async delete(key: string): Promise<void> {
    const fullKey = this.keyPrefix + key;
    this.cache.delete(fullKey);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  isConnected(): boolean {
    return true; // In-memory cache is always "connected"
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
  }

  getSize(): number {
    return this.cache.size;
  }
}
