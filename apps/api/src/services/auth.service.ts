import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import { db } from '../db/client.js';
import type { User, RegisterRequest, LoginRequest } from '../types/index.js';
import { ConflictError, UnauthorizedError, NotFoundError } from '../middleware/error-handler.js';

const SALT_ROUNDS = 10;

export class AuthService {
  async register(data: RegisterRequest): Promise<{ user: Omit<User, 'password_hash'>; teamId: string }> {
    // Check if user already exists
    const existing = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [data.email]
    );

    if (existing.rows.length > 0) {
      throw new ConflictError('User with this email already exists');
    }

    // Hash password
    const password_hash = await bcrypt.hash(data.password, SALT_ROUNDS);

    // Create user and team in a transaction
    return db.transaction(async (client) => {
      // Create user
      const userResult = await client.query<User>(
        `INSERT INTO users (email, name, password_hash)
         VALUES ($1, $2, $3)
         RETURNING id, email, name, created_at, updated_at`,
        [data.email, data.name, password_hash]
      );

      const user = userResult.rows[0];

      // Create default team
      const teamResult = await client.query(
        `INSERT INTO teams (name, owner_id)
         VALUES ($1, $2)
         RETURNING id`,
        [`${data.name}'s Team`, user.id]
      );

      const teamId = teamResult.rows[0].id;

      return { user, teamId };
    });
  }

  async login(data: LoginRequest): Promise<User> {
    // Find user by email
    const result = await db.query<User>(
      'SELECT * FROM users WHERE email = $1',
      [data.email]
    );

    if (result.rows.length === 0) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const user = result.rows[0];

    // Verify password
    const isValid = await bcrypt.compare(data.password, user.password_hash);

    if (!isValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    return user;
  }

  async createRefreshToken(userId: string, token: string, expiresIn: string): Promise<void> {
    // Parse expiration (e.g., "7d" -> 7 days)
    const days = parseInt(expiresIn.replace('d', ''));
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);

    await db.query(
      `INSERT INTO refresh_tokens (user_id, token, expires_at)
       VALUES ($1, $2, $3)`,
      [userId, token, expiresAt]
    );
  }

  async validateRefreshToken(token: string): Promise<string> {
    const result = await db.query(
      `SELECT user_id FROM refresh_tokens
       WHERE token = $1 AND expires_at > NOW()`,
      [token]
    );

    if (result.rows.length === 0) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    return result.rows[0].user_id;
  }

  async revokeRefreshToken(token: string): Promise<void> {
    await db.query('DELETE FROM refresh_tokens WHERE token = $1', [token]);
  }

  async getUserById(userId: string): Promise<User> {
    const result = await db.query<User>(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('User not found');
    }

    return result.rows[0];
  }

  async cleanupExpiredTokens(): Promise<void> {
    await db.query('DELETE FROM refresh_tokens WHERE expires_at < NOW()');
  }
}

export const authService = new AuthService();
