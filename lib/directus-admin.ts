import { createDirectus, rest, staticToken } from '@directus/sdk';
import { CustomDirectusUser, Page, Form, Lead, Note, Email } from './types';

// Define schema
type DirectusSchema = {
  directus_users: CustomDirectusUser[];
  pages: Page[];
  forms: Form[];
  leads: Lead[];
  notes: Note[];
  emails: Email[];
};

// Admin client with static token (server-side only)
export const directusAdmin = createDirectus<DirectusSchema>(
  process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055'
)
  .with(rest())
  .with(staticToken(process.env.DIRECTUS_ADMIN_TOKEN || ''));