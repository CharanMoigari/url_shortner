/**
 * Centralized Configuration Export
 * 
 * All environment variables are loaded and validated in environment.ts
 * This file re-exports for backward compatibility
 * 
 * Usage:
 *   import { env } from './config/environment';
 *   
 * Or for backward compatibility:
 *   import config from './config';
 */

export { env, default } from './environment';

// Also export config alias for backward compatibility
export { env as config } from './environment';
