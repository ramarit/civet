import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(401, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(404, message);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(429, message);
  }
}

export const errorHandler = async (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  // Log error
  request.log.error(error);

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return reply.status(400).send({
      error: 'Validation Error',
      message: 'Invalid request data',
      details: error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      })),
    });
  }

  // Handle custom application errors
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      error: error.name,
      message: error.message,
    });
  }

  // Handle Fastify errors
  if (error.statusCode) {
    return reply.status(error.statusCode).send({
      error: error.name,
      message: error.message,
    });
  }

  // Handle database errors
  if (error.name === 'PostgresError') {
    const pgError = error as any;

    // Unique constraint violation
    if (pgError.code === '23505') {
      return reply.status(409).send({
        error: 'Conflict',
        message: 'A resource with this identifier already exists',
      });
    }

    // Foreign key violation
    if (pgError.code === '23503') {
      return reply.status(400).send({
        error: 'Bad Request',
        message: 'Referenced resource does not exist',
      });
    }
  }

  // Default to 500 server error
  return reply.status(500).send({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
    ...(process.env.NODE_ENV === 'development' && {
      details: error.message,
      stack: error.stack,
    }),
  });
};
