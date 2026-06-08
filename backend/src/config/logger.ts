import winston from 'winston';
import path from 'path';
import { env } from './environment';

// Create logs directory if it doesn't exist
import fs from 'fs';
const logsDir = path.resolve(env.logging.dir);

try {
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
} catch (error) {
  const errorMsg = error instanceof Error ? error.message : String(error);
  console.error(`Failed to create logs directory at ${logsDir}: ${errorMsg}`);
  console.error('Falling back to console-only logging');
  // Logs will only be written to console if directory creation fails
}

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    const meta = stack ? `\n${stack}` : '';
    return `${timestamp} [${level.toUpperCase()}]: ${message}${meta}`;
  })
);

export const logger = winston.createLogger({
  level: env.logging.level,
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      ),
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
    }),
  ],
});

export default logger;
