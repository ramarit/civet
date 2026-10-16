import { FastifyInstance } from 'fastify';
import { authService } from '../services/auth.service.js';
import { validateBody } from '../middleware/validation.js';
import { RegisterRequestSchema, LoginRequestSchema } from '../types/index.js';
import { z } from 'zod';

const RefreshRequestSchema = z.object({
  refreshToken: z.string(),
});

export const authRoutes = async (app: FastifyInstance) => {
  // Register
  app.post(
    '/register',
    {
      preHandler: validateBody(RegisterRequestSchema),
    },
    async (request, reply) => {
      const data = request.body as z.infer<typeof RegisterRequestSchema>;

      const { user, teamId } = await authService.register(data);

      const accessToken = app.jwt.sign(
        { userId: user.id, email: user.email },
        { expiresIn: '15m' }
      );

      const refreshToken = app.jwt.sign(
        { userId: user.id, type: 'refresh' },
        { expiresIn: '7d' }
      );

      // Store refresh token
      await authService.createRefreshToken(user.id, refreshToken, '7d');

      return reply.status(201).send({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        teamId,
        accessToken,
        refreshToken,
      });
    }
  );

  // Login
  app.post(
    '/login',
    {
      preHandler: validateBody(LoginRequestSchema),
    },
    async (request, reply) => {
      const data = request.body as z.infer<typeof LoginRequestSchema>;

      const user = await authService.login(data);

      const accessToken = app.jwt.sign(
        { userId: user.id, email: user.email },
        { expiresIn: '15m' }
      );

      const refreshToken = app.jwt.sign(
        { userId: user.id, type: 'refresh' },
        { expiresIn: '7d' }
      );

      // Store refresh token
      await authService.createRefreshToken(user.id, refreshToken, '7d');

      return reply.send({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        accessToken,
        refreshToken,
      });
    }
  );

  // Refresh token
  app.post(
    '/refresh',
    {
      preHandler: validateBody(RefreshRequestSchema),
    },
    async (request, reply) => {
      const { refreshToken } = request.body as z.infer<typeof RefreshRequestSchema>;

      // Validate refresh token
      const userId = await authService.validateRefreshToken(refreshToken);

      // Get user
      const user = await authService.getUserById(userId);

      // Generate new access token
      const accessToken = app.jwt.sign(
        { userId: user.id, email: user.email },
        { expiresIn: '15m' }
      );

      // Generate new refresh token
      const newRefreshToken = app.jwt.sign(
        { userId: user.id, type: 'refresh' },
        { expiresIn: '7d' }
      );

      // Revoke old refresh token and store new one
      await authService.revokeRefreshToken(refreshToken);
      await authService.createRefreshToken(user.id, newRefreshToken, '7d');

      return reply.send({
        accessToken,
        refreshToken: newRefreshToken,
      });
    }
  );

  // Logout
  app.post('/logout', async (request, reply) => {
    const { refreshToken } = request.body as { refreshToken?: string };

    if (refreshToken) {
      await authService.revokeRefreshToken(refreshToken);
    }

    return reply.send({ message: 'Logged out successfully' });
  });
};
