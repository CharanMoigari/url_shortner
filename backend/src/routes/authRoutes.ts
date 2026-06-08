// Authentication routes

import { Router } from 'express';
import * as authController from '../controllers/authController';
import { authLimiterMiddleware } from '../middleware/rateLimit';

const router = Router();

router.post('/register', authLimiterMiddleware, authController.register);
router.post('/login', authLimiterMiddleware, authController.login);
router.post('/refresh-token', authController.refreshToken);

export default router;
