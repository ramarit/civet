/**
 * Database schema types
 */

// Database table names
export const TABLE_NAMES = {
  USERS: 'users',
  PROJECTS: 'projects',
  TRANSLATIONS: 'translations',
  TRANSLATION_BATCHES: 'translation_batches',
  ORGANIZATIONS: 'organizations',
  API_KEYS: 'api_keys',
  SESSIONS: 'sessions',
  AUDIT_LOGS: 'audit_logs',
  TRANSLATION_CACHE: 'translation_cache',
  WEBHOOKS: 'webhooks',
  GLOSSARIES: 'glossaries',
  GLOSSARY_TERMS: 'glossary_terms',
} as const;

// Base database record
export interface BaseRecord {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Database schema for users table
export interface UserRecord extends BaseRecord {
  email: string;
  passwordHash: string;
  name: string | null;
  role: string;
  status: string;
  avatar: string | null;
  organizationId: string | null;
  emailVerified: Date | null;
  lastLoginAt: Date | null;
}

// Database schema for projects table
export interface ProjectRecord extends BaseRecord {
  name: string;
  description: string | null;
  type: string;
  status: string;
  userId: string;
  organizationId: string | null;
  sourceLanguage: string;
  targetLanguages: string[]; // JSON array in database
  domain: string | null;
  apiKey: string;
  settings: string; // JSON string in database
}

// Database schema for translations table
export interface TranslationRecord extends BaseRecord {
  projectId: string;
  sourceText: string;
  translatedText: string | null;
  sourceLanguage: string;
  targetLanguage: string;
  status: string;
  quality: string;
  qualityScore: number | null;
  context: string; // JSON string in database
  metadata: string; // JSON string in database
  completedAt: Date | null;
}

// Database schema for organizations table
export interface OrganizationRecord extends BaseRecord {
  name: string;
  slug: string;
  description: string | null;
  ownerId: string;
  plan: string;
  billingEmail: string | null;
  settings: string; // JSON string
}

// Database schema for API keys table
export interface ApiKeyRecord extends BaseRecord {
  key: string;
  name: string;
  projectId: string;
  userId: string;
  permissions: string[]; // JSON array
  lastUsedAt: Date | null;
  expiresAt: Date | null;
  revokedAt: Date | null;
}

// Database schema for sessions table
export interface SessionRecord extends BaseRecord {
  userId: string;
  token: string;
  refreshToken: string;
  expiresAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
}

// Database schema for audit logs table
export interface AuditLogRecord extends BaseRecord {
  userId: string | null;
  action: string;
  resourceType: string;
  resourceId: string;
  changes: string; // JSON string
  ipAddress: string | null;
  userAgent: string | null;
}

// Database schema for translation cache table
export interface TranslationCacheRecord {
  cacheKey: string; // Primary key
  sourceText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  projectId: string;
  quality: string;
  qualityScore: number | null;
  hitCount: number;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

// Database schema for webhooks table
export interface WebhookRecord extends BaseRecord {
  projectId: string;
  url: string;
  events: string[]; // JSON array
  secret: string;
  active: boolean;
  lastTriggeredAt: Date | null;
  failureCount: number;
}

// Database schema for glossaries table
export interface GlossaryRecord extends BaseRecord {
  projectId: string;
  name: string;
  description: string | null;
  sourceLanguage: string;
  targetLanguage: string;
  active: boolean;
}

// Database schema for glossary terms table
export interface GlossaryTermRecord extends BaseRecord {
  glossaryId: string;
  sourceTerm: string;
  targetTerm: string;
  context: string | null;
  caseSensitive: boolean;
}

// Query filter types
export interface QueryFilter {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'like' | 'ilike';
  value: unknown;
}

export interface QueryOptions {
  filters?: QueryFilter[];
  sort?: {
    field: string;
    order: 'asc' | 'desc';
  };
  limit?: number;
  offset?: number;
}
