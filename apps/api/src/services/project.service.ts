import { nanoid } from 'nanoid';
import { db } from '../db/client.js';
import type { Project, CreateProjectRequest, UpdateProjectRequest } from '../types/index.js';
import { NotFoundError, ForbiddenError } from '../middleware/error-handler.js';

export class ProjectService {
  async create(userId: string, data: CreateProjectRequest): Promise<Project> {
    // Get user's team (for now, use the first team they're a member of)
    const teamResult = await db.query(
      `SELECT team_id FROM team_members WHERE user_id = $1 LIMIT 1`,
      [userId]
    );

    if (teamResult.rows.length === 0) {
      throw new ForbiddenError('User is not a member of any team');
    }

    const teamId = teamResult.rows[0].team_id;

    // Generate API key
    const apiKey = `civet_${nanoid(32)}`;

    // Create project
    const result = await db.query<Project>(
      `INSERT INTO projects (team_id, name, description, api_key, default_language)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [teamId, data.name, data.description || null, apiKey, data.default_language || 'en']
    );

    const project = result.rows[0];

    // Add default language
    await db.query(
      `INSERT INTO project_languages (project_id, language_code, language_name, enabled)
       VALUES ($1, $2, $3, $4)`,
      [project.id, project.default_language, 'English', true]
    );

    return project;
  }

  async findById(projectId: string): Promise<Project> {
    const result = await db.query<Project>(
      'SELECT * FROM projects WHERE id = $1',
      [projectId]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Project not found');
    }

    return result.rows[0];
  }

  async findByTeam(teamId: string): Promise<Project[]> {
    const result = await db.query<Project>(
      'SELECT * FROM projects WHERE team_id = $1 ORDER BY created_at DESC',
      [teamId]
    );

    return result.rows;
  }

  async findByUser(userId: string): Promise<Project[]> {
    const result = await db.query<Project>(
      `SELECT p.* FROM projects p
       INNER JOIN team_members tm ON p.team_id = tm.team_id
       WHERE tm.user_id = $1
       ORDER BY p.created_at DESC`,
      [userId]
    );

    return result.rows;
  }

  async update(projectId: string, data: UpdateProjectRequest): Promise<Project> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(data.name);
    }

    if (data.description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(data.description);
    }

    if (data.default_language !== undefined) {
      updates.push(`default_language = $${paramCount++}`);
      values.push(data.default_language);
    }

    if (updates.length === 0) {
      return this.findById(projectId);
    }

    values.push(projectId);

    const result = await db.query<Project>(
      `UPDATE projects
       SET ${updates.join(', ')}
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Project not found');
    }

    return result.rows[0];
  }

  async delete(projectId: string): Promise<void> {
    const result = await db.query(
      'DELETE FROM projects WHERE id = $1',
      [projectId]
    );

    if (result.rowCount === 0) {
      throw new NotFoundError('Project not found');
    }
  }

  async regenerateApiKey(projectId: string): Promise<string> {
    const apiKey = `civet_${nanoid(32)}`;

    const result = await db.query<Project>(
      'UPDATE projects SET api_key = $1 WHERE id = $2 RETURNING api_key',
      [apiKey, projectId]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Project not found');
    }

    return result.rows[0].api_key;
  }
}

export const projectService = new ProjectService();
