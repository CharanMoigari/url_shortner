import { createClient } from 'redis';
import { env } from './environment';
import logger from './logger';

let client: any = null;

export const initRedis = async () => {
  if (client) return client;

  const redisClient = createClient({
    socket: {
      host: env.redis.host,
      port: env.redis.port,
    },
    password: env.redis.password || undefined,
  });

  // Type assertion for event listeners (redis client supports EventEmitter interface at runtime)
  (redisClient as any).on('error', (err: Error) => {
    logger.error('Redis error:', err);
  });

  (redisClient as any).on('connect', () => {
    logger.info('Connected to Redis');
  });

  await redisClient.connect();
  client = redisClient;
  return redisClient;
};

export const getRedis = () => {
  if (!client) {
    throw new Error('Redis client not initialized. Call initRedis() first.');
  }
  return client;
};

export const closeRedis = async (): Promise<void> => {
  if (client) {
    await client.quit();
    client = null;
  }
};

export default { initRedis, getRedis, closeRedis };
