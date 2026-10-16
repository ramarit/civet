import { FastifyReply, FastifyRequest } from 'fastify';
import { UnauthorizedError, ForbiddenError } from './error-handler.js';
import { db } from '../db/client.js';
import type { Project } from '../types/index.js';

export const authenticateJWT = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    await request.jwtVerify();
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired token');
  }
};

export const authenticateAPIKey = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const apiKey = request.headers['x-api-key'] as string;

  if (!apiKey) {
    throw new UnauthorizedError('API key is required');
  }

  const result = await db.query<Project>(
    'SELECT * FROM projects WHERE api_key = $1',
    [apiKey]
  );

  if (result.rows.length === 0) {
    throw new UnauthorizedError('Invalid API key');
  }

  request.project = result.rows[0];
};

export const requireTeamMember = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { teamId } = request.params as { teamId: string };
  const userId = request.user?.userId;

  if (!userId) {
    throw new UnauthorizedError();
  }

  const result = await db.query(
    `SELECT role FROM team_members
     WHERE team_id = $1 AND user_id = $2`,
    [teamId, userId]
  );

  if (result.rows.length === 0) {
    throw new ForbiddenError('You are not a member of this team');
  }

  // Attach role to request for further checks
  (request as any).teamRole = result.rows[0].role;
};

export const requireTeamAdmin = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  await requireTeamMember(request, reply);

  const role = (request as any).teamRole;

  if (role !== 'admin' && role !== 'owner') {
    throw new ForbiddenError('Admin or owner role required');
  }
};

export const requireProjectAccess = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { projectId } = request.params as { projectId: string };
  const userId = request.user?.userId;

  if (!userId) {
    throw new UnauthorizedError();
  }

  // Check if user has access to the project through team membership
  const result = await db.query(
    `SELECT p.* FROM projects p
     INNER JOIN team_members tm ON p.team_id = tm.team_id
     WHERE p.id = $1 AND tm.user_id = $2`,
    [projectId, userId]
  );

  if (result.rows.length === 0) {
    throw new ForbiddenError('You do not have access to this project');
  }

  request.project = result.rows[0];
};
