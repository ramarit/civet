/**
 * API request types
 */

import type {
  CreateProjectInput,
  UpdateProjectInput,
  CreateTranslationInput,
  CreateUserInput,
  UpdateUserInput,
} from '../entities';

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
  cursor?: string;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Project requests
export interface ListProjectsRequest extends PaginationParams, SortParams {
  status?: string;
  type?: string;
  userId?: string;
  search?: string;
}

export interface GetProjectRequest {
  projectId: string;
}

export interface CreateProjectRequest {
  data: CreateProjectInput;
}

export interface UpdateProjectRequest {
  projectId: string;
  data: UpdateProjectInput;
}

export interface DeleteProjectRequest {
  projectId: string;
}

// Translation requests
export interface ListTranslationsRequest extends PaginationParams, SortParams {
  projectId: string;
  status?: string;
  sourceLanguage?: string;
  targetLanguage?: string;
  quality?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface GetTranslationRequest {
  translationId: string;
}

export interface CreateTranslationRequest {
  data: CreateTranslationInput;
}

export interface CreateBatchTranslationRequest {
  projectId: string;
  translations: CreateTranslationInput[];
}

export interface RetryTranslationRequest {
  translationId: string;
}

// User requests
export interface ListUsersRequest extends PaginationParams, SortParams {
  role?: string;
  status?: string;
  organizationId?: string;
  search?: string;
}

export interface GetUserRequest {
  userId: string;
}

export interface CreateUserRequest {
  data: CreateUserInput;
}

export interface UpdateUserRequest {
  userId: string;
  data: UpdateUserInput;
}

export interface DeleteUserRequest {
  userId: string;
}

// Authentication requests
export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

// Analytics requests
export interface GetProjectStatsRequest {
  projectId: string;
  startDate?: string;
  endDate?: string;
}

export interface GetUsageStatsRequest {
  userId?: string;
  organizationId?: string;
  startDate?: string;
  endDate?: string;
  granularity?: 'day' | 'week' | 'month';
}
