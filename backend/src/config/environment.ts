/**
 * Centralized Environment Configuration
 * Change values here to update everywhere in the app
 */

import dotenv from 'dotenv';

dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  'JWT_SECRET',
  'DB_HOST',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'REDIS_HOST',
  'RABBITMQ_URL',
  'LOG_DIR'
];

const missingVars = requiredEnvVars.filter(v => !process.env[v]);
if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

export const env = {
  // Server
  PORT: parseInt(process.env.PORT || '3000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',

  // Database (PostgreSQL)
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    poolSize: parseInt(process.env.DB_POOL_SIZE || '10', 10),
  },

  // Redis
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    db: parseInt(process.env.REDIS_DB || '0', 10),
    password: process.env.REDIS_PASSWORD || undefined,
    ttl: 3600, // 1 hour cache TTL
  },

  // JWT Authentication
  jwt: {
    secret: process.env.JWT_SECRET as string,
    expiryShort: process.env.JWT_EXPIRY || '24h',
    expiryLong: process.env.JWT_REFRESH_EXPIRY || '7d',
    expiresIn: process.env.JWT_EXPIRY || '24h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRY || '7d',
  },

  // RabbitMQ
  rabbitmq: {
    url: process.env.RABBITMQ_URL,
    exchange: 'url_shortener',
    queue: 'analytics_events',
    routingKey: 'analytics.*',
  },

  // API & CORS
  app: {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    url: process.env.APP_URL || 'http://localhost:3000',
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10), // 1 minute
    general: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '300', 10), // Increased from 100
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '300', 10), // Increased from 100
    urlCreation: 50, // Increased from 20
    authAttempts: 20, // Increased from 5
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    dir: process.env.LOG_DIR || process.cwd() + '/logs',
  },
};

export default env;
