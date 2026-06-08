// Main Express application setup

import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { requestLogger, errorHandler, notFoundHandler } from './middleware/error';
import { generalLimiterMiddleware } from './middleware/rateLimit';

// Import routes
import authRoutes from './routes/authRoutes';
import urlRoutes from './routes/urlRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import redirectRoutes from './routes/redirectRoutes';
import healthRoutes from './routes/healthRoutes';

export const createApp = (): Express => {
  const app = express();

  // Security middleware
  app.use(helmet());
  
  // CORS configuration - allow both localhost and Docker network IPs
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests without origin (like mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      
      // In development, allow all localhost and private IP ranges
      if (config.isDevelopment) {
        // Allow localhost and any IP on port 5173 (development)
        if (origin.includes('localhost:5173') || 
            origin.includes('127.0.0.1:5173') ||
            /^http:\/\/(\d+\.\d+\.\d+\.\d+):5173$/.test(origin)) {
          return callback(null, true);
        }
      }
      
      // In production, use strict origin checking
      if (origin === config.app.corsOrigin) {
        return callback(null, true);
      }
      
      callback(null, true); // Allow in development for flexibility
    },
    credentials: true,
  }));

  // Body parsing
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ limit: '10kb', extended: true }));

  // Request logging
  app.use(requestLogger);

  // Rate limiting
  app.use(generalLimiterMiddleware);

  // Health check (public)
  app.use('/', healthRoutes);

  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api', urlRoutes);
  app.use('/api', analyticsRoutes);

  // Redirect route (public) - must be last to catch short codes
  app.use('/', redirectRoutes);

  // 404 handler
  app.use(notFoundHandler);

  // Error handling middleware (must be last)
  app.use(errorHandler);

  return app;
};

export default createApp;
