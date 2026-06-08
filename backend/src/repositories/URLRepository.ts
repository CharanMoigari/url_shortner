// URL repository with Redis caching (Cache-Aside Pattern)

import { URLModel } from '../models/URL';
import { getRedis } from '../config/redis';
import logger from '../config/logger';

const CACHE_TTL = 3600; // 1 hour
const URL_SHORT_CODE_CACHE_KEY = (shortCode: string) =>
  `url:shortcode:${shortCode}`;
const URL_ID_CACHE_KEY = (id: string) => `url:id:${id}`;
const USER_URLS_CACHE_KEY = (userId: string, page: number) =>
  `user:urls:${userId}:page:${page}`;

export const URLRepository = {
  async create(
    userId: string,
    originalUrl: string,
    customAlias?: string,
    expiresAt?: Date
  ) {
    const url = await URLModel.create(userId, originalUrl, customAlias, expiresAt);

    // Cache the new URL
    try {
      const redis = getRedis();
      await redis.setEx(
        URL_SHORT_CODE_CACHE_KEY(url.short_code),
        CACHE_TTL,
        JSON.stringify(url)
      );
      await redis.setEx(
        URL_ID_CACHE_KEY(url.id),
        CACHE_TTL,
        JSON.stringify(url)
      );
      
      // Invalidate user's URL list cache so new URL appears in dashboard
      for (let page = 1; page <= 10; page++) {
        await redis.del(USER_URLS_CACHE_KEY(userId, page));
      }
    } catch (error) {
      logger.error('Redis error caching new URL:', error);
    }

    return url;
  },

  async findByShortCode(shortCode: string) {
    const cacheKey = URL_SHORT_CODE_CACHE_KEY(shortCode);
    const redis = getRedis();

    try {
      // Check cache first
      const cached = await redis.get(cacheKey);
      if (cached) {
        logger.debug(`Cache hit for short code: ${shortCode}`);
        return JSON.parse(cached);
      }
    } catch (error) {
      logger.error('Redis error in URLRepository.findByShortCode:', error);
    }

    // Query database
    const url = await URLModel.findByShortCode(shortCode);

    // Store in cache
    if (url) {
      try {
        await redis.setEx(cacheKey, CACHE_TTL, JSON.stringify(url));
      } catch (error) {
        logger.error('Redis error saving URL to cache:', error);
      }
    }

    return url;
  },

  async findById(id: string) {
    const cacheKey = URL_ID_CACHE_KEY(id);
    const redis = getRedis();

    try {
      // Check cache
      const cached = await redis.get(cacheKey);
      if (cached) {
        logger.debug(`Cache hit for URL ID: ${id}`);
        return JSON.parse(cached);
      }
    } catch (error) {
      logger.error('Redis error in URLRepository.findById:', error);
    }

    // Query database
    const url = await URLModel.findById(id);

    // Store in cache
    if (url) {
      try {
        await redis.setEx(cacheKey, CACHE_TTL, JSON.stringify(url));
      } catch (error) {
        logger.error('Redis error saving URL to cache:', error);
      }
    }

    return url;
  },

  async findByIdAndUserId(id: string, userId: string) {
    const url = await URLModel.findByIdAndUserId(id, userId);
    
    // Cache the result
    if (url) {
      try {
        const redis = getRedis();
        await redis.setEx(
          URL_ID_CACHE_KEY(url.id),
          CACHE_TTL,
          JSON.stringify(url)
        );
      } catch (error) {
        logger.error('Redis error caching URL:', error);
      }
    }

    return url;
  },

  async findByUserId(
    userId: string,
    limit: number,
    offset: number,
    search?: string,
    sort: string = 'createdAt'
  ) {
    // Don't cache paginated results if search is applied
    const page = Math.floor(offset / limit) + 1;

    if (!search) {
      const cacheKey = USER_URLS_CACHE_KEY(userId, page);
      const redis = getRedis();

      try {
        const cached = await redis.get(cacheKey);
        if (cached) {
          logger.debug(`Cache hit for user URLs: ${userId} page ${page}`);
          return JSON.parse(cached);
        }
      } catch (error) {
        logger.error('Redis error in URLRepository.findByUserId:', error);
      }
    }

    // Query database
    const result = await URLModel.findByUserId(userId, limit, offset, search, sort);

    // Cache pagination results only if no search
    if (!search) {
      try {
        const redis = getRedis();
        await redis.setEx(
          USER_URLS_CACHE_KEY(userId, page),
          CACHE_TTL,
          JSON.stringify(result)
        );
      } catch (error) {
        logger.error('Redis error saving user URLs to cache:', error);
      }
    }

    return result;
  },

  async incrementClickCount(shortCode: string) {
    // Increment the count and get the updated URL
    const updatedUrl = await URLModel.incrementClickCount(shortCode);
    
    if (!updatedUrl) {
      logger.warn(`URL not found for incrementing click count: ${shortCode}`);
      return;
    }

    // Invalidate all caches for this URL
    try {
      const redis = getRedis();
      // Invalidate the short code cache
      await redis.del(URL_SHORT_CODE_CACHE_KEY(shortCode));
      
      // Invalidate the URL ID cache
      await redis.del(URL_ID_CACHE_KEY(updatedUrl.id));
      
      // Invalidate all user's URL list pages
      for (let page = 1; page <= 10; page++) {
        await redis.del(USER_URLS_CACHE_KEY(updatedUrl.user_id, page));
      }
      
      logger.debug(`Click count incremented for ${shortCode}, new count: ${updatedUrl.click_count}`);
    } catch (error) {
      logger.error('Redis error invalidating cache:', error);
    }
  },

  async deleteById(id: string, userId: string) {
    const deleted = await URLModel.deleteById(id, userId);

    if (deleted) {
      // Invalidate cache
      try {
        const redis = getRedis();
        await redis.del(URL_ID_CACHE_KEY(id));
        // Also clear user's URL list cache for all pages
        for (let page = 1; page <= 10; page++) {
          await redis.del(USER_URLS_CACHE_KEY(userId, page));
        }
      } catch (error) {
        logger.error('Redis error clearing cache:', error);
      }
    }

    return deleted;
  },

  async shortCodeExists(shortCode: string) {
    return URLModel.shortCodeExists(shortCode);
  },

  async updateOriginalUrl(id: string, userId: string, originalUrl: string) {
    const url = await URLModel.updateOriginalUrl(id, userId, originalUrl);

    if (url) {
      // Invalidate caches
      try {
        const redis = getRedis();
        await redis.del(URL_ID_CACHE_KEY(url.id));
        await redis.del(URL_SHORT_CODE_CACHE_KEY(url.short_code));
      } catch (error) {
        logger.error('Redis error invalidating cache:', error);
      }
    }

    return url;
  },
};

export default URLRepository;
