// URL routes

import { Router } from 'express';
import * as urlController from '../controllers/urlController';
import { authMiddleware } from '../middleware/auth';
import { createURLLimiterMiddleware } from '../middleware/rateLimit';

const router = Router();

// Protected routes
router.post('/urls', authMiddleware, createURLLimiterMiddleware, urlController.createURL);
router.get('/urls', authMiddleware, urlController.getUserURLs);
router.get('/urls/:id', authMiddleware, urlController.getURLById);
router.put('/urls/:id', authMiddleware, urlController.updateURL);
router.delete('/urls/:id', authMiddleware, urlController.deleteURL);

export default router;
