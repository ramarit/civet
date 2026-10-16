import { buildServer } from './server.js';
import { config_settings } from './config/index.js';
import { db } from './db/client.js';

const start = async () => {
  try {
    // Check database connection
    const dbHealthy = await db.healthCheck();
    if (!dbHealthy) {
      throw new Error('Database connection failed');
    }

    // Build and start server
    const app = await buildServer();

    await app.listen({
      port: config_settings.server.port,
      host: config_settings.server.host,
    });

    console.log(`
┌─────────────────────────────────────────┐
│  Civet Translation API                  │
│  Environment: ${config_settings.server.env.padEnd(26)}│
│  Port: ${config_settings.server.port.toString().padEnd(33)}│
│  URL: http://${config_settings.server.host}:${config_settings.server.port.toString().padEnd(18)}│
└─────────────────────────────────────────┘
    `);

    // Graceful shutdown
    const signals = ['SIGINT', 'SIGTERM'];
    signals.forEach((signal) => {
      process.on(signal, async () => {
        console.log(`\nReceived ${signal}, closing server gracefully...`);
        await app.close();
        await db.close();
        console.log('Server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

start();
