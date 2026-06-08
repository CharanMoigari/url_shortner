// URL service with Redis caching and RabbitMQ integration

import { URLRepository } from '../repositories/URLRepository';
import {
  ValidationError,
  NotFoundError,
  ConflictError,
} from '../utils/errors';
import {
  isValidURL,
  isURLExpired,
  formatURLResponse,
  getPaginationParams,
} from '../utils';
import { config } from '../config';
import logger from '../config/logger';
import { publishAnalyticsEvent } from './RabbitMQService';

export const URLService = {
  async createURL(
    userId: string,
    originalUrl: string,
    customAlias?: string,
    expiresAt?: Date
  ) {
    // Validate original URL
    if (!isValidURL(originalUrl)) {
      throw new ValidationError('Invalid URL format');
    }

    // Check if user already has a short URL for this original URL
    const existingURLs = await URLRepository.findByUserId(userId, 1000, 0);
    const duplicate = existingURLs.rows.find(
      (url: any) => url.original_url === originalUrl && !url.expires_at
    );
    
    if (duplicate && !customAlias) {
      logger.info(`URL already shortened for user: ${userId}, returning existing short code`);
      return formatURLResponse(duplicate, config.app.baseUrl);
    }

    // Validate custom alias if provided
    if (customAlias) {
      if (customAlias.length < 3 || customAlias.length > 20) {
        throw new ValidationError(
          'Custom alias must be 3-20 characters'
        );
      }

      if (!/^[a-zA-Z0-9-_]+$/.test(customAlias)) {
        throw new ValidationError(
          'Custom alias can only contain alphanumeric characters, dashes, and underscores'
        );
      }

      // Check if alias already exists
      const exists = await URLRepository.shortCodeExists(customAlias);
      if (exists) {
        throw new ConflictError('Custom alias already in use');
      }
    }

    // Validate expiration date
    if (expiresAt && expiresAt <= new Date()) {
      throw new ValidationError('Expiration date must be in the future');
    }

    // Create URL
    const url = await URLRepository.create(
      userId,
      originalUrl,
      customAlias,
      expiresAt
    );

    logger.info(`Short URL created: ${url.short_code} for user: ${userId}`);

    return formatURLResponse(url, config.app.baseUrl);
  },

  async getURLByShortCode(shortCode: string) {
    const url = await URLRepository.findByShortCode(shortCode);

    if (!url) {
      throw new NotFoundError('Short URL not found');
    }

    // Check if URL is expired
    if (isURLExpired(url.expires_at)) {
      throw new NotFoundError('Short URL has expired');
    }

    return url;
  },

  async redirectURL(shortCode: string, userAgent: string, referrer: string) {
    const url = await this.getURLByShortCode(shortCode);

    // Increment click count
    try {
      await URLRepository.incrementClickCount(shortCode);
    } catch (error) {
      logger.error(`Failed to increment click count for ${shortCode}:`, error);
      // Don't fail the redirect if click count increment fails
    }

    // Publish analytics event to RabbitMQ (async, don't wait for it)
    try {
      await publishAnalyticsEvent({
        urlId: url.id,
        userAgent,
        referrer,
      });
    } catch (error) {
      logger.error('Failed to publish analytics event:', error);
      // Don't fail the redirect if analytics fails
    }

    return url.original_url;
  },

  async getUserURLs(
    userId: string,
    page: string = '1',
    limit: string = '20',
    search?: string,
    sort: string = 'createdAt'
  ) {
    const { page: pageNum, limit: limitNum, offset } = getPaginationParams(
      page,
      limit
    );

    const result = await URLRepository.findByUserId(
      userId,
      limitNum,
      offset,
      search,
      sort
    );

    // Format response
    const formattedURLs = result.rows.map((url: any) =>
      formatURLResponse(url, config.app.baseUrl)
    );

    const pages = Math.ceil(result.total / limitNum);

    return {
      data: formattedURLs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: result.total,
        pages,
      },
    };
  },

  async deleteURL(urlId: string, userId: string) {
    // Verify ownership
    const url = await URLRepository.findByIdAndUserId(urlId, userId);
    if (!url) {
      throw new NotFoundError('URL not found');
    }

    // Delete
    await URLRepository.deleteById(urlId, userId);

    logger.info(`URL deleted: ${url.short_code}`);

    return { message: 'URL deleted successfully' };
  },

  async updateURL(urlId: string, userId: string, originalUrl: string) {
    // Verify ownership
    const url = await URLRepository.findByIdAndUserId(urlId, userId);
    if (!url) {
      throw new NotFoundError('URL not found');
    }

    // Validate new URL
    if (!isValidURL(originalUrl)) {
      throw new ValidationError('Invalid URL format');
    }

    // Update
    const updatedUrl = await URLRepository.updateOriginalUrl(
      urlId,
      userId,
      originalUrl
    );

    logger.info(`URL updated: ${url.short_code}`);

    return formatURLResponse(updatedUrl, config.app.baseUrl);
  },

  async getURLById(urlId: string, userId: string) {
    const url = await URLRepository.findByIdAndUserId(urlId, userId);

    if (!url) {
      throw new NotFoundError('URL not found');
    }

    return formatURLResponse(url, config.app.baseUrl);
  },
};

export default URLService;
