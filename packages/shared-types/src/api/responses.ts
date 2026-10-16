/**
 * API response types
 */

import type {
  User,
  UserProfile,
  Project,
  ProjectStats,
  Translation,
  TranslationBatch,
  Language,
} from '../entities';

// Base response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface CursorPaginatedResponse<T> {
  items: T[];
  pagination: {
    cursor: string | null;
    nextCursor: string | null;
    hasNextPage: boolean;
  };
}

// User responses
export type GetUserResponse = ApiResponse<User>;
export type ListUsersResponse = ApiResponse<PaginatedResponse<User>>;
export type CreateUserResponse = ApiResponse<User>;
export type UpdateUserResponse = ApiResponse<User>;
export type DeleteUserResponse = ApiResponse<{ deleted: boolean }>;
export type GetUserProfileResponse = ApiResponse<UserProfile>;

// Project responses
export type GetProjectResponse = ApiResponse<Project>;
export type ListProjectsResponse = ApiResponse<PaginatedResponse<Project>>;
export type CreateProjectResponse = ApiResponse<Project>;
export type UpdateProjectResponse = ApiResponse<Project>;
export type DeleteProjectResponse = ApiResponse<{ deleted: boolean }>;
export type GetProjectStatsResponse = ApiResponse<ProjectStats>;

// Translation responses
export type GetTranslationResponse = ApiResponse<Translation>;
export type ListTranslationsResponse = ApiResponse<PaginatedResponse<Translation>>;
export type CreateTranslationResponse = ApiResponse<Translation>;
export type CreateBatchTranslationResponse = ApiResponse<TranslationBatch>;
export type RetryTranslationResponse = ApiResponse<Translation>;

// Language responses
export type ListLanguagesResponse = ApiResponse<Language[]>;
export type GetLanguageResponse = ApiResponse<Language>;

// Authentication responses
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthUser extends User {
  permissions: string[];
}

export type LoginResponse = ApiResponse<{
  user: AuthUser;
  tokens: AuthTokens;
}>;

export type RegisterResponse = ApiResponse<{
  user: User;
  tokens: AuthTokens;
}>;

export type RefreshTokenResponse = ApiResponse<AuthTokens>;

export type LogoutResponse = ApiResponse<{ success: boolean }>;

// Analytics responses
export interface UsageStats {
  totalTranslations: number;
  totalCharacters: number;
  totalCost: number;
  translationsByLanguage: Record<string, number>;
  translationsByStatus: Record<string, number>;
  averageQualityScore: number;
  cacheHitRate: number;
  dailyStats: Array<{
    date: string;
    translations: number;
    characters: number;
    cost: number;
  }>;
}

export type GetUsageStatsResponse = ApiResponse<UsageStats>;

// Health check response
export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  uptime: number;
  timestamp: string;
  services: {
    database: 'up' | 'down';
    cache: 'up' | 'down';
    translationEngine: 'up' | 'down';
  };
}
