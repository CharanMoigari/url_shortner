// Analytics model and queries

import { query } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export interface AnalyticsRow {
  id: string;
  url_id: string;
  browser: string | null;
  device: string | null;
  referrer: string | null;
  timestamp: Date;
}

export const AnalyticsModel = {
  async create(
    urlId: string,
    browser: string | null,
    device: string | null,
    referrer: string | null
  ): Promise<AnalyticsRow> {
    const id = uuidv4();

    const result = await query(
      `INSERT INTO analytics (id, url_id, browser, device, referrer, timestamp)
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
       RETURNING id, url_id, browser, device, referrer, timestamp`,
      [id, urlId, browser, device, referrer]
    );

    return result.rows[0];
  },

  async findByUrlId(
    urlId: string,
    limit: number,
    offset: number
  ): Promise<{ rows: AnalyticsRow[]; total: number }> {
    const countResult = await query(
      'SELECT COUNT(*) as count FROM analytics WHERE url_id = $1',
      [urlId]
    );

    const dataResult = await query(
      `SELECT * FROM analytics WHERE url_id = $1 
       ORDER BY timestamp DESC 
       LIMIT $2 OFFSET $3`,
      [urlId, limit, offset]
    );

    return {
      rows: dataResult.rows,
      total: parseInt(countResult.rows[0].count, 10),
    };
  },

  async getBrowserStats(urlId: string): Promise<any[]> {
    const result = await query(
      `SELECT browser, COUNT(*) as count FROM analytics 
       WHERE url_id = $1 AND browser IS NOT NULL 
       GROUP BY browser 
       ORDER BY count DESC`,
      [urlId]
    );
    return result.rows;
  },

  async getDeviceStats(urlId: string): Promise<any[]> {
    const result = await query(
      `SELECT device, COUNT(*) as count FROM analytics 
       WHERE url_id = $1 AND device IS NOT NULL 
       GROUP BY device 
       ORDER BY count DESC`,
      [urlId]
    );
    return result.rows;
  },

  async getDailyStats(urlId: string, days: number = 7): Promise<any[]> {
    const result = await query(
      `SELECT DATE(timestamp) as date, COUNT(*) as count FROM analytics 
       WHERE url_id = $1 AND timestamp >= NOW() - INTERVAL '${days} days' 
       GROUP BY DATE(timestamp) 
       ORDER BY date DESC`,
      [urlId]
    );
    return result.rows;
  },

  async getTotalClicksByUrlId(urlId: string): Promise<number> {
    const result = await query(
      'SELECT COUNT(*) as count FROM analytics WHERE url_id = $1',
      [urlId]
    );
    return parseInt(result.rows[0].count, 10);
  },

  async getReferrerStats(urlId: string): Promise<any[]> {
    const result = await query(
      `SELECT referrer, COUNT(*) as count FROM analytics 
       WHERE url_id = $1 AND referrer IS NOT NULL 
       GROUP BY referrer 
       ORDER BY count DESC 
       LIMIT 10`,
      [urlId]
    );
    return result.rows;
  },
};


export default AnalyticsModel;
