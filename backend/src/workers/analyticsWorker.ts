// Analytics worker - runs separately to process analytics events from RabbitMQ

import dotenv from 'dotenv';
import logger from '../config/logger';
import { initRabbitMQ, startAnalyticsWorker, closeRabbitMQ } from '../services/RabbitMQService';

dotenv.config();

const start = async () => {
  try {
    logger.info('Starting Analytics Worker...');

    // Initialize RabbitMQ connection
    await initRabbitMQ();

    // Start consuming messages
    await startAnalyticsWorker();

    logger.info('Analytics Worker is running');

    // Graceful shutdown
    process.on('SIGINT', async () => {
      logger.info('Shutting down Analytics Worker...');
      await closeRabbitMQ();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      logger.info('Shutting down Analytics Worker...');
      await closeRabbitMQ();
      process.exit(0);
    });
  } catch (error) {
    logger.error('Failed to start Analytics Worker:', error);
    process.exit(1);
  }
};

start();
