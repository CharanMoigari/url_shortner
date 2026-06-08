import rateLimit from 'express-rate-limit';
import { config } from '../config';

export const createRateLimiter = (options: {
  windowMs?: number;
  max?: number;
  keyGenerator?: (req: any) => string;
  message?: string;
} = {}) => {
  // Skip rate limiting in development mode for localhost
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  return rateLimit({
    windowMs: options.windowMs || config.rateLimit.windowMs,
    max: options.max || config.rateLimit.maxRequests,
    keyGenerator:
      options.keyGenerator ||
      ((req) => req.ip || req.connection.remoteAddress || 'unknown'),
    message: options.message || 'Too many requests, please try again later',
    skip: (req) => {
      // Always skip rate limiting for health check endpoint (needed for Docker/orchestration)
      if (req.path === '/health' || req.path.startsWith('/health/')) {
        return true;
      }
      
      // Skip rate limiting in development mode for localhost
      if (isDevelopment) {
        const ip = req.ip || req.connection.remoteAddress || '';
        return ip === '127.0.0.1' || ip === '::1' || ip.includes('172.20'); // Docker network
      }
      
      return false;
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Specific rate limiters (lazy initialization)
let generalLimiter: any = null;
let createURLLimiter: any = null;
let authLimiter: any = null;

export const getGeneralLimiter = () => {
  if (!generalLimiter) {
    generalLimiter = createRateLimiter({
      windowMs: 60 * 1000, // 1 minute
      max: 300, // 300 requests per minute (or unlimited in dev)
    });
  }
  return generalLimiter;
};

export const getCreateURLLimiter = () => {
  if (!createURLLimiter) {
    createURLLimiter = createRateLimiter({
      windowMs: 60 * 1000, // 1 minute
      max: 50, // 50 short URLs per minute (or unlimited in dev)
    });
  }
  return createURLLimiter;
};

export const getAuthLimiter = () => {
  if (!authLimiter) {
    authLimiter = createRateLimiter({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 20, // 20 attempts per 15 minutes (or unlimited in dev)
    });
  }
  return authLimiter;
};

// Middleware wrappers for lazy initialization
export const generalLimiterMiddleware = (req: any, res: any, next: any) => {
  getGeneralLimiter()(req, res, next);
};

export const createURLLimiterMiddleware = (req: any, res: any, next: any) => {
  getCreateURLLimiter()(req, res, next);
};

export const authLimiterMiddleware = (req: any, res: any, next: any) => {
  getAuthLimiter()(req, res, next);
};
