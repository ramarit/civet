import rateLimit from '@fastify/rate-limit';
import { config_settings } from '../config/index.js';
import { FastifyInstance } from 'fastify';

export const registerRateLimiter = async (app: FastifyInstance) => {
  await app.register(rateLimit, {
    max: config_settings.rateLimit.max,
    timeWindow: config_settings.rateLimit.timeWindow,
    cache: 10000,
    allowList: ['127.0.0.1'],
    redis: undefined, // Can be configured with Redis for distributed rate limiting
    keyGenerator: (request) => {
      // Rate limit per API key for widget requests
      const apiKey = request.headers['x-api-key'];
      if (apiKey) {
        return `api_key:${apiKey}`;
      }

      // Rate limit per user for authenticated requests
      if (request.user) {
        return `user:${request.user.userId}`;
      }

      // Rate limit per IP for unauthenticated requests
      return request.ip;
    },
    errorResponseBuilder: (request, context) => {
      return {
        error: 'Too Many Requests',
        message: `Rate limit exceeded. Maximum ${context.max} requests per ${context.after}`,
        retryAfter: context.ttl,
      };
    },
    onExceeding: (request, key) => {
      request.log.warn(`Rate limit exceeded for key: ${key}`);
    },
  });
};

export const projectRateLimiter = {
  config: {
    rateLimit: {
      max: 100,
      timeWindow: '1 minute',
      keyGenerator: (request: any) => {
        // Rate limit per project
        if (request.project) {
          return `project:${request.project.id}`;
        }
        return request.ip;
      },
    },
  },
};
