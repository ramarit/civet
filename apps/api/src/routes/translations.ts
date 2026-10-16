import { FastifyInstance } from 'fastify';
import { translationService } from '../services/translation.service.js';
import { authenticateAPIKey, authenticateJWT, requireProjectAccess } from '../middleware/auth.js';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.js';
import { projectRateLimiter } from '../middleware/rate-limit.js';
import {
  GetTranslationsQuerySchema,
  UpdateTranslationRequestSchema,
  BatchTranslationRequestSchema,
} from '../types/index.js';
import { z } from 'zod';

const ProjectIdParamsSchema = z.object({
  projectId: z.string().uuid(),
});

const KeyParamsSchema = z.object({
  projectId: z.string().uuid(),
  key: z.string(),
});

const LanguageCodeParamsSchema = z.object({
  projectId: z.string().uuid(),
  key: z.string(),
  languageCode: z.string(),
});

export const translationRoutes = async (app: FastifyInstance) => {
  // Get translations by project and language (widget endpoint - uses API key)
  app.get(
    '/',
    {
      preHandler: [authenticateAPIKey, validateQuery(GetTranslationsQuerySchema)],
      config: projectRateLimiter.config,
    },
    async (request, reply) => {
      const { project_id, lang } = request.query as z.infer<typeof GetTranslationsQuerySchema>;

      const translations = await translationService.getByProject(project_id, lang);

      return reply.send({ translations });
    }
  );

  // Get all translations for a project (authenticated)
  app.get(
    '/project/:projectId',
    {
      preHandler: [authenticateJWT, validateParams(ProjectIdParamsSchema), requireProjectAccess],
    },
    async (request, reply) => {
      const { projectId } = request.params as z.infer<typeof ProjectIdParamsSchema>;

      const translations = await translationService.getAll(projectId);

      return reply.send({ translations });
    }
  );

  // Get translation stats
  app.get(
    '/project/:projectId/stats',
    {
      preHandler: [authenticateJWT, validateParams(ProjectIdParamsSchema), requireProjectAccess],
    },
    async (request, reply) => {
      const { projectId } = request.params as z.infer<typeof ProjectIdParamsSchema>;

      const stats = await translationService.getTranslationStats(projectId);

      return reply.send(stats);
    }
  );

  // Update single translation
  app.put(
    '/project/:projectId',
    {
      preHandler: [
        authenticateJWT,
        validateParams(ProjectIdParamsSchema),
        requireProjectAccess,
        validateBody(UpdateTranslationRequestSchema),
      ],
    },
    async (request, reply) => {
      const { projectId } = request.params as z.infer<typeof ProjectIdParamsSchema>;
      const data = request.body as z.infer<typeof UpdateTranslationRequestSchema>;

      const translation = await translationService.update(projectId, data);

      return reply.send({ translation });
    }
  );

  // Batch update translations
  app.post(
    '/batch',
    {
      preHandler: [authenticateJWT, validateBody(BatchTranslationRequestSchema)],
    },
    async (request, reply) => {
      const data = request.body as z.infer<typeof BatchTranslationRequestSchema>;

      // Verify user has access to the project
      const userId = request.user!.userId;
      const projects = await translationService['db']?.query(
        `SELECT p.id FROM projects p
         INNER JOIN team_members tm ON p.team_id = tm.team_id
         WHERE p.id = $1 AND tm.user_id = $2`,
        [data.project_id, userId]
      );

      const updatedCount = await translationService.batchUpdate(data);

      return reply.send({
        message: 'Translations updated successfully',
        updatedCount,
      });
    }
  );

  // Delete translation key (all languages)
  app.delete(
    '/project/:projectId/key/:key',
    {
      preHandler: [authenticateJWT, validateParams(KeyParamsSchema), requireProjectAccess],
    },
    async (request, reply) => {
      const { projectId, key } = request.params as z.infer<typeof KeyParamsSchema>;

      await translationService.deleteKey(projectId, key);

      return reply.status(204).send();
    }
  );

  // Delete specific translation
  app.delete(
    '/project/:projectId/key/:key/lang/:languageCode',
    {
      preHandler: [authenticateJWT, validateParams(LanguageCodeParamsSchema), requireProjectAccess],
    },
    async (request, reply) => {
      const { projectId, key, languageCode } = request.params as z.infer<
        typeof LanguageCodeParamsSchema
      >;

      await translationService.delete(projectId, key, languageCode);

      return reply.status(204).send();
    }
  );
};
