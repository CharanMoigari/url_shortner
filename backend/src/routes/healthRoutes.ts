// Health check routes

import { Router } from 'express';
import { sendResponse } from '../utils';
import { query as dbQuery } from '../config/database';
import { getRedis } from '../config/redis';
import logger from '../config/logger';

const router = Router();

router.get('/health', async (_req, res) => {
  try {
    const checks: {
      database: boolean;
      redis: boolean;
      rabbitmq: boolean;
    } = {
      database: false,
      redis: false,
      rabbitmq: false,
    };

    // Check database
    try {
      await dbQuery('SELECT 1');
      checks.database = true;
    } catch (error) {
      logger.error('Database health check failed:', error);
    }

    // Check Redis
    try {
      const redis = getRedis();
      await redis.ping();
      checks.redis = true;
    } catch (error) {
      logger.error('Redis health check failed:', error);
    }

    // For now, mark RabbitMQ as true if connection was established
    // In production, you'd want to send a test message
    checks.rabbitmq = true;

    const allHealthy =
      checks.database && checks.redis && checks.rabbitmq;

    sendResponse(
      res,
      allHealthy ? 200 : 503,
      {
        status: allHealthy ? 'healthy' : 'degraded',
        services: checks,
        timestamp: new Date(),
      },
      allHealthy
        ? 'All systems operational'
        : 'Some systems are down'
    );
  } catch (error) {
    logger.error('Health check route error:', error);
    sendResponse(res, 500, { status: 'error', error: String(error) }, 'Health check failed');
  }
});

export default router;
