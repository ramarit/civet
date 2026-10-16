/**
 * Project entity types
 */

export enum ProjectStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

export enum ProjectType {
  WEBSITE = 'website',
  WEB_APP = 'web_app',
  MOBILE_APP = 'mobile_app',
  API = 'api',
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  type: ProjectType;
  status: ProjectStatus;
  userId: string;
  organizationId: string | null;
  sourceLanguage: string;
  targetLanguages: string[];
  domain: string | null;
  apiKey: string;
  settings: ProjectSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectSettings {
  autoTranslate: boolean;
  qualityThreshold: number;
  cacheEnabled: boolean;
  customGlossary: boolean;
  excludeSelectors: string[];
  includeSelectors: string[];
  translationEngine: 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3' | 'custom';
  maxConcurrentRequests: number;
}

export interface ProjectStats {
  projectId: string;
  totalTranslations: number;
  completedTranslations: number;
  failedTranslations: number;
  cachedTranslations: number;
  charactersTranslated: number;
  lastTranslationAt: Date | null;
  averageQualityScore: number;
}

export type CreateProjectInput = Pick<
  Project,
  'name' | 'description' | 'type' | 'sourceLanguage' | 'targetLanguages' | 'domain'
> & {
  settings?: Partial<ProjectSettings>;
};

export type UpdateProjectInput = Partial<
  Pick<Project, 'name' | 'description' | 'status' | 'targetLanguages' | 'domain'>
> & {
  settings?: Partial<ProjectSettings>;
};
