// Analytics service

import { AnalyticsModel } from '../models/Analytics';
import { URLRepository } from '../repositories/URLRepository';
import { NotFoundError } from '../utils/errors';
import { getPaginationParams } from '../utils';

export const AnalyticsService = {
  async getAnalyticsByUrlId(
    urlId: string,
    userId: string,
    page: string = '1',
    limit: string = '20'
  ) {
    // Verify URL ownership
    const url = await URLRepository.findByIdAndUserId(urlId, userId);
    if (!url) {
      throw new NotFoundError('URL not found');
    }

    const { page: pageNum, limit: limitNum, offset } = getPaginationParams(
      page,
      limit
    );

    const result = await AnalyticsModel.findByUrlId(urlId, limitNum, offset);

    const pages = Math.ceil(result.total / limitNum);

    return {
      data: result.rows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: result.total,
        pages,
      },
    };
  },

  async getBrowserStats(urlId: string, userId: string) {
    // Verify URL ownership
    const url = await URLRepository.findByIdAndUserId(urlId, userId);
    if (!url) {
      throw new NotFoundError('URL not found');
    }

    return AnalyticsModel.getBrowserStats(urlId);
  },

  async getDeviceStats(urlId: string, userId: string) {
    // Verify URL ownership
    const url = await URLRepository.findByIdAndUserId(urlId, userId);
    if (!url) {
      throw new NotFoundError('URL not found');
    }

    return AnalyticsModel.getDeviceStats(urlId);
  },

  async getDailyStats(urlId: string, userId: string, days: number = 7) {
    // Verify URL ownership
    const url = await URLRepository.findByIdAndUserId(urlId, userId);
    if (!url) {
      throw new NotFoundError('URL not found');
    }

    return AnalyticsModel.getDailyStats(urlId, days);
  },

  async getTotalClicks(urlId: string, userId: string) {
    // Verify URL ownership
    const url = await URLRepository.findByIdAndUserId(urlId, userId);
    if (!url) {
      throw new NotFoundError('URL not found');
    }

    return AnalyticsModel.getTotalClicksByUrlId(urlId);
  },

  async getReferrerStats(urlId: string, userId: string) {
    // Verify URL ownership
    const url = await URLRepository.findByIdAndUserId(urlId, userId);
    if (!url) {
      throw new NotFoundError('URL not found');
    }

    return AnalyticsModel.getReferrerStats(urlId);
  },
};

export default AnalyticsService;
