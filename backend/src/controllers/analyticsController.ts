// Analytics controller

import { Request, Response, NextFunction } from 'express';
import AnalyticsService from '../services/AnalyticsService';
import { sendResponse } from '../utils';

export const getAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = req.query.page as string;
    const limit = req.query.limit as string;

    const result = await AnalyticsService.getAnalyticsByUrlId(
      req.params.urlId,
      req.userId!,
      page,
      limit
    );

    sendResponse(res, 200, result, 'Analytics retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getBrowserStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stats = await AnalyticsService.getBrowserStats(
      req.params.urlId,
      req.userId!
    );

    sendResponse(res, 200, stats, 'Browser statistics retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getDeviceStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stats = await AnalyticsService.getDeviceStats(
      req.params.urlId,
      req.userId!
    );

    sendResponse(res, 200, stats, 'Device statistics retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getDailyStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const days = req.query.days ? parseInt(req.query.days as string) : 7;

    const stats = await AnalyticsService.getDailyStats(
      req.params.urlId,
      req.userId!,
      days
    );

    sendResponse(res, 200, stats, 'Daily statistics retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getTotalClicks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const totalClicks = await AnalyticsService.getTotalClicks(
      req.params.urlId,
      req.userId!
    );

    sendResponse(
      res,
      200,
      { totalClicks },
      'Total clicks retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

export default {
  getAnalytics,
  getBrowserStats,
  getDeviceStats,
  getDailyStats,
  getTotalClicks,
};
