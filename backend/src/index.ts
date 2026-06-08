// Main server entry point

import dotenv from 'dotenv';
import { config } from './config';
import logger from './config/logger';
import createApp from './app';
import { initRedis, closeRedis } from './config/redis';
import { initRabbitMQ, closeRabbitMQ } from './services/RabbitMQService';

dotenv.config();

const startServer = async () => {
  try {
    logger.info(
      `Starting server in ${config.NODE_ENV} mode on port ${config.PORT}`
    );

    // Initialize Redis
    logger.info('Initializing Redis...');
    await initRedis();

    // Initialize RabbitMQ
    logger.info('Initializing RabbitMQ...');
    await initRabbitMQ();

    // Create Express app
    const app = createApp();

    // Start server
    const server = app.listen(config.PORT, '0.0.0.0', () => {
      logger.info(`Server running at http://0.0.0.0:${config.PORT}`);
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}, shutting down gracefully...`);

      server.close(async () => {
        logger.info('HTTP server closed');

        try {
          await closeRedis();
          logger.info('Redis connection closed');
        } catch (error) {
          logger.error('Error closing Redis:', error);
        }

        try {
          await closeRabbitMQ();
          logger.info('RabbitMQ connection closed');
        } catch (error) {
          logger.error('Error closing RabbitMQ:', error);
        }

        process.exit(0);
      });

      // Force shutdown after 30 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after 30 seconds');
        process.exit(1);
      }, 30000);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

    // Unhandled error handlers
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled Rejection:', reason);
      process.exit(1);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();