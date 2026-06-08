// User model and queries

import { query } from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

export interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  created_at: Date;
}

export const UserModel = {
  async create(email: string, password: string): Promise<UserRow> {
    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await query(
      `INSERT INTO users (id, email, password_hash, created_at)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
       RETURNING id, email, password_hash, created_at`,
      [id, email, hashedPassword]
    );

    return result.rows[0];
  },

  async findByEmail(email: string): Promise<UserRow | null> {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  },

  async findById(id: string): Promise<UserRow | null> {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  async verifyPassword(
    storedHash: string,
    plainPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, storedHash);
  },

  async emailExists(email: string): Promise<boolean> {
    const result = await query('SELECT id FROM users WHERE email = $1', [
      email,
    ]);
    return result.rows.length > 0;
  },
};

export default UserModel;
