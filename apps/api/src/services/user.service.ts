import bcrypt from 'bcrypt';
import { db } from '../db/client.js';
import type { User, Team } from '../types/index.js';
import { NotFoundError, ConflictError } from '../middleware/error-handler.js';

const SALT_ROUNDS = 10;

export class UserService {
  async findById(userId: string): Promise<Omit<User, 'password_hash'>> {
    const result = await db.query<User>(
      'SELECT id, email, name, created_at, updated_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('User not found');
    }

    return result.rows[0];
  }

  async updateProfile(userId: string, data: { name?: string }): Promise<Omit<User, 'password_hash'>> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(data.name);
    }

    if (updates.length === 0) {
      return this.findById(userId);
    }

    values.push(userId);

    const result = await db.query<User>(
      `UPDATE users
       SET ${updates.join(', ')}
       WHERE id = $${paramCount}
       RETURNING id, email, name, created_at, updated_at`,
      values
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('User not found');
    }

    return result.rows[0];
  }

  async updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    // Get current password hash
    const userResult = await db.query<User>(
      'SELECT password_hash FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      throw new NotFoundError('User not found');
    }

    const user = userResult.rows[0];

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password_hash);

    if (!isValid) {
      throw new ConflictError('Current password is incorrect');
    }

    // Hash new password
    const password_hash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    // Update password
    await db.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [password_hash, userId]
    );
  }

  async getTeams(userId: string): Promise<Team[]> {
    const result = await db.query<Team>(
      `SELECT t.* FROM teams t
       INNER JOIN team_members tm ON t.id = tm.team_id
       WHERE tm.user_id = $1
       ORDER BY t.created_at DESC`,
      [userId]
    );

    return result.rows;
  }

  async getTeamRole(userId: string, teamId: string): Promise<string | null> {
    const result = await db.query(
      `SELECT role FROM team_members
       WHERE user_id = $1 AND team_id = $2`,
      [userId, teamId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0].role;
  }

  async delete(userId: string): Promise<void> {
    await db.query('DELETE FROM users WHERE id = $1', [userId]);
  }
}

export const userService = new UserService();
