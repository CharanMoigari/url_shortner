// Database migration to create tables

import { query } from '../src/config/database';
import dotenv from 'dotenv';

dotenv.config();

export const migrate = async () => {
  try {
    console.log('[INFO] Starting database migration...');

    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `);

    console.log('[INFO] Created users table');

    // Create urls table
    await query(`
      CREATE TABLE IF NOT EXISTS urls (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        short_code VARCHAR(20) UNIQUE NOT NULL,
        original_url TEXT NOT NULL,
        click_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NULL
      );

      CREATE INDEX IF NOT EXISTS idx_urls_short_code ON urls(short_code);
      CREATE INDEX IF NOT EXISTS idx_urls_user_id ON urls(user_id);
      CREATE INDEX IF NOT EXISTS idx_urls_created_at ON urls(created_at DESC);
    `);

    console.log('[INFO] Created urls table');

    // Create analytics table
    await query(`
      CREATE TABLE IF NOT EXISTS analytics (
        id UUID PRIMARY KEY,
        url_id UUID NOT NULL REFERENCES urls(id) ON DELETE CASCADE,
        browser VARCHAR(50) NULL,
        device VARCHAR(50) NULL,
        referrer TEXT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_analytics_url_id ON analytics(url_id);
      CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON analytics(timestamp DESC);
    `);

    console.log('[INFO] Created analytics table');

    console.log('[INFO] Database migration completed successfully');
  } catch (error) {
    console.error('[ERROR] Database migration failed:', error);
    throw error;
  }
};
