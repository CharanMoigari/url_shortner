/**
 * Frontend Centralized Configuration
 * 
 * All environment variables are defined here
 * Change values to configure the entire app from one place
 */

// Get environment variables from Vite
const apiUrl = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:3000/api';
const baseUrl = (import.meta.env.VITE_BASE_URL as string | undefined) || 'http://localhost:3000';

export const config = {
  // API Configuration
  api: {
    baseUrl: apiUrl,
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
  },

  // Application Configuration
  app: {
    baseUrl: baseUrl,
    appName: 'URL Shortener Pro',
    appVersion: '1.0.0',
  },

  // Authentication Configuration
  auth: {
    storageKey: 'url_shortener_auth',
    accessTokenKey: 'accessToken',
    refreshTokenKey: 'refreshToken',
    tokenRefreshThreshold: 5 * 60 * 1000, // 5 minutes before expiry
  },

  // Pagination Configuration
  pagination: {
    defaultLimit: 10,
    minLimit: 1,
    maxLimit: 100,
  },

  // Feature Flags
  features: {
    enableAnalytics: true,
    enableSearch: true,
    enableCustomAlias: true,
    enableUrlExpiration: true,
  },

  // UI Configuration
  ui: {
    itemsPerPage: 10,
    animationDuration: 300,
    debounceDelay: 500,
  },

  // Validation Configuration
  validation: {
    minUrlLength: 10,
    maxUrlLength: 2048,
    minAliasLength: 3,
    maxAliasLength: 20,
  },
};

export default config;
