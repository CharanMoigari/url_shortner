// Migration runner

import dotenv from 'dotenv';
import { migrate } from './001_create_initial_schema';

dotenv.config();

// Setup logger manually for migrations
const logger = {
  info: (msg: string) => console.log(`[INFO] ${msg}`),
  error: (msg: string, err?: any) => console.error(`[ERROR] ${msg}`, err),
};

const runMigrations = async () => {
  try {
    logger.info('Running migrations...');
    await migrate();
    logger.info('✅ Migrations completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

runMigrations();
