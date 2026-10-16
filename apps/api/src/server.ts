import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { config_settings } from './config/index.js';
import { errorHandler } from './middleware/error-handler.js';
import { registerRateLimiter } from './middleware/rate-limit.js';
import { authRoutes } from './routes/auth.js';
import { projectRoutes } from './routes/projects.js';
import { translationRoutes } from './routes/translations.js';
import { languageRoutes } from './routes/languages.js';
import { userRoutes } from './routes/users.js';
import { healthRoutes } from './routes/health.js';

export const buildServer = async () => {
  const app = Fastify({
    logger: {
      level: config_settings.logging.level,
      transport:
        config_settings.server.env === 'development'
          ? {
              target: 'pino-pretty',
              options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
              },
            }
          : undefined,
    },
    trustProxy: true,
    requestIdHeader: 'x-request-id',
    requestIdLogLabel: 'requestId',
  });

  // Register CORS
  await app.register(cors, {
    origin: config_settings.cors.origin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  // Register JWT
  await app.register(jwt, {
    secret: config_settings.jwt.secret,
  });

  // Register rate limiter
  await registerRateLimiter(app);

  // Register error handler
  app.setErrorHandler(errorHandler);

  // Register routes
  await app.register(authRoutes, { prefix: '/api/auth' });
  await app.register(projectRoutes, { prefix: '/api/projects' });
  await app.register(translationRoutes, { prefix: '/api/translations' });
  await app.register(languageRoutes, { prefix: '/api/languages' });
  await app.register(userRoutes, { prefix: '/api/users' });
  await app.register(healthRoutes, { prefix: '/api/health' });

  // Root endpoint
  app.get('/', async (request, reply) => {
    return reply.send({
      name: 'Civet Translation API',
      version: '1.0.0',
      status: 'ok',
      documentation: '/api/health',
    });
  });

  // 404 handler
  app.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      error: 'Not Found',
      message: `Route ${request.method} ${request.url} not found`,
      statusCode: 404,
    });
  });

  return app;
};
