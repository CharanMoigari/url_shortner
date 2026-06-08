// URL model and queries

import { query } from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { generateRandomBase62 } from '../utils/base62';

export interface URLRow {
  id: string;
  user_id: string;
  short_code: string;
  original_url: string;
  click_count: number;
  created_at: Date;
  expires_at: Date | null;
}

export const URLModel = {
  async create(
    userId: string,
    originalUrl: string,
    customAlias?: string,
    expiresAt?: Date
  ): Promise<URLRow> {
    const id = uuidv4();
    const shortCode = customAlias || generateRandomBase62(8);

    const result = await query(
      `INSERT INTO urls (id, user_id, short_code, original_url, click_count, created_at, expires_at)
       VALUES ($1, $2, $3, $4, 0, CURRENT_TIMESTAMP, $5)
       RETURNING id, user_id, short_code, original_url, click_count, created_at, expires_at`,
      [id, userId, shortCode, originalUrl, expiresAt || null]
    );

    return result.rows[0];
  },

  async findByShortCode(shortCode: string): Promise<URLRow | null> {
    const result = await query(
      'SELECT * FROM urls WHERE short_code = $1',
      [shortCode]
    );
    return result.rows[0] || null;
  },

  async findById(id: string): Promise<URLRow | null> {
    const result = await query('SELECT * FROM urls WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  async findByIdAndUserId(id: string, userId: string): Promise<URLRow | null> {
    const result = await query(
      'SELECT * FROM urls WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return result.rows[0] || null;
  },

  async findByUserId(
    userId: string,
    limit: number,
    offset: number,
    search?: string,
    sort: string = 'created_at'
  ): Promise<{ rows: URLRow[]; total: number }> {
    let whereClause = 'WHERE user_id = $1';
    const params: any[] = [userId];

    if (search) {
      whereClause += ` AND (original_url ILIKE $${
        params.length + 1
      } OR short_code ILIKE $${params.length + 1})`;
      params.push(`%${search}%`);
    }

    // Validate sort to prevent SQL injection
    const validSorts: { [key: string]: string } = {
      createdAt: 'created_at',
      clickCount: 'click_count',
      shortCode: 'short_code',
    };

    const sortColumn = validSorts[sort] || 'created_at';

    const countResult = await query(
      `SELECT COUNT(*) as count FROM urls ${whereClause}`,
      params
    );

    const dataResult = await query(
      `SELECT * FROM urls ${whereClause} 
       ORDER BY ${sortColumn} DESC 
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    );

    return {
      rows: dataResult.rows,
      total: parseInt(countResult.rows[0].count, 10),
    };
  },

  async incrementClickCount(shortCode: string): Promise<URLRow | null> {
    const result = await query(
      `UPDATE urls SET click_count = click_count + 1 WHERE short_code = $1
       RETURNING id, user_id, short_code, original_url, click_count, created_at, expires_at`,
      [shortCode]
    );
    return result.rows[0] || null;
  },

  async deleteById(id: string, userId: string): Promise<boolean> {
    const result = await query(
      'DELETE FROM urls WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );
    return result.rows.length > 0;
  },

  async shortCodeExists(shortCode: string): Promise<boolean> {
    const result = await query(
      'SELECT id FROM urls WHERE short_code = $1',
      [shortCode]
    );
    return result.rows.length > 0;
  },

  async updateOriginalUrl(id: string, userId: string, originalUrl: string): Promise<URLRow | null> {
    const result = await query(
      `UPDATE urls SET original_url = $1 WHERE id = $2 AND user_id = $3
       RETURNING id, user_id, short_code, original_url, click_count, created_at, expires_at`,
      [originalUrl, id, userId]
    );
    return result.rows[0] || null;
  },
};

export default URLModel;
