// User repository with caching

import { UserModel } from '../models/User';
import { getRedis } from '../config/redis';
import logger from '../config/logger';

const CACHE_TTL = 3600; // 1 hour
const USER_CACHE_KEY = (email: string) => `user:email:${email}`;
const USER_ID_CACHE_KEY = (id: string) => `user:id:${id}`;

export const UserRepository = {
  async findByEmail(email: string) {
    const cacheKey = USER_CACHE_KEY(email);
    const redis = getRedis();

    try {
      // Check cache
      const cached = await redis.get(cacheKey);
      if (cached) {
        logger.debug(`Cache hit for user email: ${email}`);
        return JSON.parse(cached);
      }
    } catch (error) {
      logger.error('Redis error in UserRepository.findByEmail:', error);
      // Continue to DB if cache fails
    }

    // Query database
    const user = await UserModel.findByEmail(email);

    // Store in cache
    if (user) {
      try {
        await redis.setEx(
          cacheKey,
          CACHE_TTL,
          JSON.stringify(user)
        );
      } catch (error) {
        logger.error('Redis error saving to cache:', error);
      }
    }

    return user;
  },

  async findById(id: string) {
    const cacheKey = USER_ID_CACHE_KEY(id);
    const redis = getRedis();

    try {
      // Check cache
      const cached = await redis.get(cacheKey);
      if (cached) {
        logger.debug(`Cache hit for user ID: ${id}`);
        return JSON.parse(cached);
      }
    } catch (error) {
      logger.error('Redis error in UserRepository.findById:', error);
    }

    // Query database
    const user = await UserModel.findById(id);

    // Store in cache
    if (user) {
      try {
        await redis.setEx(
          cacheKey,
          CACHE_TTL,
          JSON.stringify(user)
        );
      } catch (error) {
        logger.error('Redis error saving to cache:', error);
      }
    }

    return user;
  },

  async create(email: string, password: string) {
    const user = await UserModel.create(email, password);

    // Cache the new user
    try {
      const redis = getRedis();
      await redis.setEx(
        USER_CACHE_KEY(email),
        CACHE_TTL,
        JSON.stringify(user)
      );
      await redis.setEx(
        USER_ID_CACHE_KEY(user.id),
        CACHE_TTL,
        JSON.stringify(user)
      );
    } catch (error) {
      logger.error('Redis error saving new user to cache:', error);
    }

    return user;
  },

  async emailExists(email: string) {
    return UserModel.emailExists(email);
  },

  async verifyPassword(storedHash: string, plainPassword: string) {
    return UserModel.verifyPassword(storedHash, plainPassword);
  },

  async clearCache(email: string, id: string) {
    try {
      const redis = getRedis();
      await redis.del(USER_CACHE_KEY(email));
      await redis.del(USER_ID_CACHE_KEY(id));
    } catch (error) {
      logger.error('Redis error clearing cache:', error);
    }
  },
};

export default UserRepository;
