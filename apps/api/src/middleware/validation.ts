import { FastifyReply, FastifyRequest } from 'fastify';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from './error-handler.js';

export const validateBody = (schema: ZodSchema) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      request.body = schema.parse(request.body);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError(
          error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')
        );
      }
      throw error;
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      request.query = schema.parse(request.query);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError(
          error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')
        );
      }
      throw error;
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      request.params = schema.parse(request.params);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError(
          error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')
        );
      }
      throw error;
    }
  };
};
