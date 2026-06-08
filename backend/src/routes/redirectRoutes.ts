// Redirect route (public)

import { Router } from 'express';
import URLService from '../services/URLService';

const router = Router();

// Public redirect endpoint
router.get('/:shortCode', async (req, res, next) => {
  try {
    const originalUrl = await URLService.redirectURL(
      req.params.shortCode,
      req.headers['user-agent'] || '',
      req.headers['referer'] || ''
    );

    // Use 302 (Moved Temporarily) instead of 301 to prevent browser caching
    // Add Cache-Control headers to ensure each click hits the backend
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.redirect(302, originalUrl);
  } catch (error) {
    next(error);
  }
});

export default router;
