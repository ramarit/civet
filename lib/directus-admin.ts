import { createDirectus, rest, authentication } from '@directus/sdk';
import { CustomDirectusUser, Page, Form, Lead, Note, Email } from './types';

type DirectusSchema = {
  directus_users: CustomDirectusUser[];
  pages: Page[];
  forms: Form[];
  leads: Lead[];
  notes: Note[];
  emails: Email[];
};

const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

// Create admin client with email/password authentication
export const directusAdmin = createDirectus<DirectusSchema>(directusUrl)
  .with(rest())
  .with(authentication('json'));

// Admin credentials
const ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || '';
const ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || '';

// Login function
let adminLoginPromise: Promise<void> | null = null;

export async function loginAsAdmin() {
  if (!adminLoginPromise) {
    adminLoginPromise = (async () => {
      try {
        await directusAdmin.login({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
        });
        console.log('Admin logged in successfully');
      } catch (error) {
        console.error('Admin login failed:', error);
        adminLoginPromise = null; // Reset so it can retry
        throw error;
      }
    })();
  }
  return adminLoginPromise;
}