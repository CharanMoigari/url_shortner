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

    res.redirect(301, originalUrl);
  } catch (error) {
    next(error);
  }
});

export default router;
