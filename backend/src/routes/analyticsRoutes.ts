// Analytics routes

import { Router } from 'express';
import * as analyticsController from '../controllers/analyticsController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Protected routes
router.get(
  '/urls/:urlId/analytics',
  authMiddleware,
  analyticsController.getAnalytics
);
router.get(
  '/urls/:urlId/analytics/browser',
  authMiddleware,
  analyticsController.getBrowserStats
);
router.get(
  '/urls/:urlId/analytics/device',
  authMiddleware,
  analyticsController.getDeviceStats
);
router.get(
  '/urls/:urlId/analytics/daily',
  authMiddleware,
  analyticsController.getDailyStats
);
router.get(
  '/urls/:urlId/analytics/clicks',
  authMiddleware,
  analyticsController.getTotalClicks
);
router.get(
  '/urls/:urlId/analytics/referrer',
  authMiddleware,
  analyticsController.getReferrerStats
);

export default router;
