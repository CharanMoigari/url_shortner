import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';
import { AppError } from '../utils/errors';
import { sendResponse } from '../utils';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  if (err instanceof AppError) {
    return sendResponse(
      res,
      err.statusCode,
      null,
      err.message
    );
  }

  // Unhandled error
  sendResponse(
    res,
    500,
    null,
    'Internal server error'
  );
};

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });

  next();
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  sendResponse(res, 404, null, `Route not found: ${req.path}`);
};
