// Civet TypeScript Type Definitions

import { DirectusUser } from '@directus/sdk';

// Extend Directus User type with custom fields
export interface CustomDirectusUser extends DirectusUser {
  // Add any custom fields you added to directus_users
}

// Application User type (for use in the app)
export interface User {
  id: string;
  email: string;
  name: string;
  date_created: string;
}

export interface Page {
  id: string;
  user_id: string;
  subdomain: string;
  headline: string;
  description: string;
  cta_text: string;
  form_id: string;
  published: boolean;
  date_created: string;
}

export interface FormField {
  id: string;
  type: "text" | "email" | "tel" | "select" | "textarea" | "number" | "date";
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

export interface FormStep {
  id: string;
  title: string;
  fields: FormField[];
}

export interface ScoringRule {
  field: string;
  operator: "equals" | "contains" | "greater_than" | "less_than";
  value: string | number;
  points: number;
}

export interface Form {
  id: string;
  user_id: string;
  name: string;
  steps: FormStep[];
  scoring_rules: ScoringRule[];
  date_created: string;
}

export interface Lead {
  id: string;
  user_id: string;
  page_id: string;
  form_id: string;
  responses: Record<string, any>;
  score: number;
  status: "new" | "contacted" | "qualified" | "closed";
  date_created: string;
  date_updated?: string;
}

export interface Note {
  id: string;
  lead_id: string;
  user_id: string;
  content: string;
  date_created: string;
}

export interface Email {
  id: string;
  lead_id: string;
  user_id: string;
  subject: string;
  body: string;
  sent_at: string;
}

// API Response Types
export interface DirectusResponse<T> {
  data: T;
}

export interface DirectusListResponse<T> {
  data: T[];
  meta?: {
    total_count: number;
    filter_count: number;
  };
}

// Form Builder Types
export interface FormBuilderState {
  steps: FormStep[];
  scoring_rules: ScoringRule[];
}

// Lead Dashboard Filter Types
export interface LeadFilters {
  status?: Lead["status"];
  minScore?: number;
  maxScore?: number;
  startDate?: string;
  endDate?: string;
}
