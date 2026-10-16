import { FastifyInstance } from 'fastify';
import { translationService } from '../services/translation.service.js';
import { authenticateJWT, requireProjectAccess } from '../middleware/auth.js';
import { validateBody, validateParams } from '../middleware/validation.js';
import { EnableLanguageRequestSchema } from '../types/index.js';
import { z } from 'zod';

const ProjectIdParamsSchema = z.object({
  projectId: z.string().uuid(),
});

const LanguageCodeParamsSchema = z.object({
  projectId: z.string().uuid(),
  languageCode: z.string(),
});

export const languageRoutes = async (app: FastifyInstance) => {
  // Get all languages for a project
  app.get(
    '/project/:projectId',
    {
      preHandler: [authenticateJWT, validateParams(ProjectIdParamsSchema), requireProjectAccess],
    },
    async (request, reply) => {
      const { projectId } = request.params as z.infer<typeof ProjectIdParamsSchema>;

      const languages = await translationService.getLanguages(projectId);

      return reply.send({ languages });
    }
  );

  // Enable language for project
  app.post(
    '/project/:projectId',
    {
      preHandler: [
        authenticateJWT,
        validateParams(ProjectIdParamsSchema),
        requireProjectAccess,
        validateBody(EnableLanguageRequestSchema),
      ],
    },
    async (request, reply) => {
      const { projectId } = request.params as z.infer<typeof ProjectIdParamsSchema>;
      const { language_code, language_name } = request.body as z.infer<
        typeof EnableLanguageRequestSchema
      >;

      await translationService.enableLanguage(projectId, language_code, language_name);

      return reply.status(201).send({
        message: 'Language enabled successfully',
        language: { language_code, language_name },
      });
    }
  );

  // Disable language for project
  app.delete(
    '/project/:projectId/lang/:languageCode',
    {
      preHandler: [authenticateJWT, validateParams(LanguageCodeParamsSchema), requireProjectAccess],
    },
    async (request, reply) => {
      const { projectId, languageCode } = request.params as z.infer<
        typeof LanguageCodeParamsSchema
      >;

      await translationService.disableLanguage(projectId, languageCode);

      return reply.status(204).send();
    }
  );
};
