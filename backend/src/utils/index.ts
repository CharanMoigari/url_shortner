/// <reference types="node" />

// General utility functions

import { Response } from 'express';

/**
 * Send a standardized JSON response
 */
export const sendResponse = (
  res: Response,
  statusCode: number,
  data: any,
  message: string = 'Success'
) => {
  res.status(statusCode).json({
    success: statusCode < 400,
    statusCode,
    message,
    data,
    timestamp: new Date(),
  });
};

/**
 * Pagination helper
 */
export const getPaginationParams = (page?: string, limit?: string) => {
  const pageNum = Math.max(1, parseInt(page || '1', 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit || '20', 10)));

  return {
    page: pageNum,
    limit: limitNum,
    offset: (pageNum - 1) * limitNum,
  };
};

/**
 * Format database row to URL response
 */
export const formatURLResponse = (row: any, baseUrl: string) => {
  return {
    id: row.id,
    shortCode: row.short_code,
    shortUrl: `${baseUrl}/${row.short_code}`,
    originalUrl: row.original_url,
    clickCount: row.click_count,
    createdAt: row.created_at,
    expiresAt: row.expires_at,
  };
};

/**
 * Check if URL is expired
 */
export const isURLExpired = (expiresAt: Date | null): boolean => {
  if (!expiresAt) return false;
  return new Date() > expiresAt;
};

/**
 * Validate URL format
 */
export const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Extract user agent details (simplified)
 */
export const getUserAgentDetails = (userAgent: string) => {
  const browser = userAgent.includes('Chrome')
    ? 'Chrome'
    : userAgent.includes('Firefox')
    ? 'Firefox'
    : userAgent.includes('Safari')
    ? 'Safari'
    : userAgent.includes('Edge')
    ? 'Edge'
    : 'Unknown';

  const device = userAgent.includes('Mobile')
    ? 'Mobile'
    : userAgent.includes('Tablet')
    ? 'Tablet'
    : 'Desktop';

  return { browser, device };
};

/**
 * Sleep for debugging
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
