import { Pool } from 'pg';
import { env } from './environment';
import logger from './logger';

const pool = new Pool(env.database);

pool.on('error', (err: Error) => {
  logger.error('Unexpected error on idle client', err);
});

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.debug(`Query executed in ${duration}ms`);
    return result;
  } catch (error) {
    logger.error('Database query error:', error);
    throw error;
  }
};

export const getClient = async () => {
  return await pool.connect();
};

export { pool };

export default { query, getClient, pool };
