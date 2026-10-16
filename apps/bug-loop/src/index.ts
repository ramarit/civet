import dotenv from 'dotenv';
import { BugTrackingDB } from './db/bug-tracking';
import { startServer } from './server';
import { logger } from './utils/logger';

// Load environment variables
dotenv.config();

async function main() {
  try {
    logger.info('Starting Bug Loop system...');

    // Initialize database
    logger.info('Initializing database...');
    await BugTrackingDB.initialize();

    // Start server
    logger.info('Starting server...');
    startServer();

    logger.info('Bug Loop system started successfully');
  } catch (error) {
    logger.error('Failed to start Bug Loop system:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

main();
