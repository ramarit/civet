import { FastifyInstance } from 'fastify';
import { db } from '../db/client.js';

export const healthRoutes = async (app: FastifyInstance) => {
  // Basic health check
  app.get('/', async (request, reply) => {
    return reply.send({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // Detailed health check
  app.get('/detailed', async (request, reply) => {
    const dbHealthy = await db.healthCheck();

    const status = dbHealthy ? 'ok' : 'degraded';
    const statusCode = dbHealthy ? 200 : 503;

    return reply.status(statusCode).send({
      status,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks: {
        database: dbHealthy ? 'ok' : 'error',
      },
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    });
  });

  // Readiness probe (for Kubernetes)
  app.get('/ready', async (request, reply) => {
    const dbHealthy = await db.healthCheck();

    if (dbHealthy) {
      return reply.send({ ready: true });
    }

    return reply.status(503).send({ ready: false });
  });

  // Liveness probe (for Kubernetes)
  app.get('/live', async (request, reply) => {
    return reply.send({ alive: true });
  });
};
