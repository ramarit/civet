import { z } from 'zod';

// User Types
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  password_hash: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type User = z.infer<typeof UserSchema>;

export const UserPublicSchema = UserSchema.omit({ password_hash: true });
export type UserPublic = z.infer<typeof UserPublicSchema>;

// Team Types
export const TeamSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  owner_id: z.string().uuid(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type Team = z.infer<typeof TeamSchema>;

export const TeamMemberSchema = z.object({
  id: z.string().uuid(),
  team_id: z.string().uuid(),
  user_id: z.string().uuid(),
  role: z.enum(['owner', 'admin', 'member']),
  created_at: z.date(),
});

export type TeamMember = z.infer<typeof TeamMemberSchema>;

// Project Types
export const ProjectSchema = z.object({
  id: z.string().uuid(),
  team_id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  api_key: z.string(),
  default_language: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type Project = z.infer<typeof ProjectSchema>;

export const ProjectLanguageSchema = z.object({
  id: z.string().uuid(),
  project_id: z.string().uuid(),
  language_code: z.string(),
  language_name: z.string(),
  enabled: z.boolean(),
  created_at: z.date(),
});

export type ProjectLanguage = z.infer<typeof ProjectLanguageSchema>;

// Translation Types
export const TranslationSchema = z.object({
  id: z.string().uuid(),
  project_id: z.string().uuid(),
  key: z.string(),
  language_code: z.string(),
  value: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type Translation = z.infer<typeof TranslationSchema>;

// Subscription Types
export const SubscriptionSchema = z.object({
  id: z.string().uuid(),
  team_id: z.string().uuid(),
  plan: z.enum(['free', 'pro', 'enterprise']),
  status: z.enum(['active', 'canceled', 'expired']),
  current_period_start: z.date(),
  current_period_end: z.date(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type Subscription = z.infer<typeof SubscriptionSchema>;

// Usage Log Types
export const UsageLogSchema = z.object({
  id: z.string().uuid(),
  team_id: z.string().uuid(),
  project_id: z.string().uuid(),
  endpoint: z.string(),
  method: z.string(),
  ip_address: z.string(),
  user_agent: z.string().nullable(),
  response_status: z.number(),
  response_time_ms: z.number(),
  created_at: z.date(),
});

export type UsageLog = z.infer<typeof UsageLogSchema>;

// Request/Response Schemas
export const RegisterRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const CreateProjectRequestSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  default_language: z.string().default('en'),
});

export type CreateProjectRequest = z.infer<typeof CreateProjectRequestSchema>;

export const UpdateProjectRequestSchema = CreateProjectRequestSchema.partial();
export type UpdateProjectRequest = z.infer<typeof UpdateProjectRequestSchema>;

export const GetTranslationsQuerySchema = z.object({
  project_id: z.string().uuid(),
  lang: z.string(),
});

export type GetTranslationsQuery = z.infer<typeof GetTranslationsQuerySchema>;

export const UpdateTranslationRequestSchema = z.object({
  key: z.string(),
  value: z.string(),
  language_code: z.string(),
});

export type UpdateTranslationRequest = z.infer<typeof UpdateTranslationRequestSchema>;

export const BatchTranslationRequestSchema = z.object({
  project_id: z.string().uuid(),
  translations: z.array(
    z.object({
      key: z.string(),
      language_code: z.string(),
      value: z.string(),
    })
  ),
});

export type BatchTranslationRequest = z.infer<typeof BatchTranslationRequestSchema>;

export const EnableLanguageRequestSchema = z.object({
  language_code: z.string(),
  language_name: z.string(),
});

export type EnableLanguageRequest = z.infer<typeof EnableLanguageRequestSchema>;

// JWT Payload
export interface JWTPayload {
  userId: string;
  email: string;
}

// Fastify Type Extensions
declare module 'fastify' {
  interface FastifyRequest {
    user?: JWTPayload;
    project?: Project;
  }
}
