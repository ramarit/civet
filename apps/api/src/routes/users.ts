import { FastifyInstance } from 'fastify';
import { userService } from '../services/user.service.js';
import { authenticateJWT } from '../middleware/auth.js';
import { validateBody } from '../middleware/validation.js';
import { z } from 'zod';

const UpdateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
});

const UpdatePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8),
});

export const userRoutes = async (app: FastifyInstance) => {
  // Get current user profile
  app.get(
    '/me',
    {
      preHandler: [authenticateJWT],
    },
    async (request, reply) => {
      const userId = request.user!.userId;
      const user = await userService.findById(userId);

      return reply.send({ user });
    }
  );

  // Update user profile
  app.patch(
    '/me',
    {
      preHandler: [authenticateJWT, validateBody(UpdateProfileSchema)],
    },
    async (request, reply) => {
      const userId = request.user!.userId;
      const data = request.body as z.infer<typeof UpdateProfileSchema>;

      const user = await userService.updateProfile(userId, data);

      return reply.send({ user });
    }
  );

  // Update password
  app.post(
    '/me/password',
    {
      preHandler: [authenticateJWT, validateBody(UpdatePasswordSchema)],
    },
    async (request, reply) => {
      const userId = request.user!.userId;
      const { currentPassword, newPassword } = request.body as z.infer<
        typeof UpdatePasswordSchema
      >;

      await userService.updatePassword(userId, currentPassword, newPassword);

      return reply.send({ message: 'Password updated successfully' });
    }
  );

  // Get user teams
  app.get(
    '/me/teams',
    {
      preHandler: [authenticateJWT],
    },
    async (request, reply) => {
      const userId = request.user!.userId;
      const teams = await userService.getTeams(userId);

      return reply.send({ teams });
    }
  );

  // Delete user account
  app.delete(
    '/me',
    {
      preHandler: [authenticateJWT],
    },
    async (request, reply) => {
      const userId = request.user!.userId;

      await userService.delete(userId);

      return reply.status(204).send();
    }
  );
};
