import { FastifyInstance } from 'fastify';
import { projectService } from '../services/project.service.js';
import { authenticateJWT, requireProjectAccess } from '../middleware/auth.js';
import { validateBody, validateParams } from '../middleware/validation.js';
import { CreateProjectRequestSchema, UpdateProjectRequestSchema } from '../types/index.js';
import { z } from 'zod';

const ProjectIdParamsSchema = z.object({
  projectId: z.string().uuid(),
});

export const projectRoutes = async (app: FastifyInstance) => {
  // Get all projects for authenticated user
  app.get(
    '/',
    {
      preHandler: [authenticateJWT],
    },
    async (request, reply) => {
      const userId = request.user!.userId;
      const projects = await projectService.findByUser(userId);

      return reply.send({ projects });
    }
  );

  // Get project by ID
  app.get(
    '/:projectId',
    {
      preHandler: [authenticateJWT, validateParams(ProjectIdParamsSchema), requireProjectAccess],
    },
    async (request, reply) => {
      const project = request.project;
      return reply.send({ project });
    }
  );

  // Create new project
  app.post(
    '/',
    {
      preHandler: [authenticateJWT, validateBody(CreateProjectRequestSchema)],
    },
    async (request, reply) => {
      const userId = request.user!.userId;
      const data = request.body as z.infer<typeof CreateProjectRequestSchema>;

      const project = await projectService.create(userId, data);

      return reply.status(201).send({ project });
    }
  );

  // Update project
  app.patch(
    '/:projectId',
    {
      preHandler: [
        authenticateJWT,
        validateParams(ProjectIdParamsSchema),
        requireProjectAccess,
        validateBody(UpdateProjectRequestSchema),
      ],
    },
    async (request, reply) => {
      const { projectId } = request.params as z.infer<typeof ProjectIdParamsSchema>;
      const data = request.body as z.infer<typeof UpdateProjectRequestSchema>;

      const project = await projectService.update(projectId, data);

      return reply.send({ project });
    }
  );

  // Delete project
  app.delete(
    '/:projectId',
    {
      preHandler: [authenticateJWT, validateParams(ProjectIdParamsSchema), requireProjectAccess],
    },
    async (request, reply) => {
      const { projectId } = request.params as z.infer<typeof ProjectIdParamsSchema>;

      await projectService.delete(projectId);

      return reply.status(204).send();
    }
  );

  // Regenerate API key
  app.post(
    '/:projectId/regenerate-key',
    {
      preHandler: [authenticateJWT, validateParams(ProjectIdParamsSchema), requireProjectAccess],
    },
    async (request, reply) => {
      const { projectId } = request.params as z.infer<typeof ProjectIdParamsSchema>;

      const apiKey = await projectService.regenerateApiKey(projectId);

      return reply.send({ apiKey });
    }
  );
};
