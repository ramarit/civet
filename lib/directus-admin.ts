import { createDirectus, rest, authentication, RestClient, AuthenticationClient } from '@directus/sdk';
import { CustomDirectusUser, Page, Form, Lead, Note, Email } from './types';

type DirectusSchema = {
  directus_users: CustomDirectusUser[];
  pages: Page[];
  forms: Form[];
  leads: Lead[];
  notes: Note[];
  emails: Email[];
};

type DirectusAdminClient = RestClient<DirectusSchema> & AuthenticationClient<DirectusSchema>;

// Get Directus URL - check both env vars
function getDirectusUrl(): string {
  const url = process.env.NEXT_PUBLIC_DIRECTUS_URL || process.env.DIRECTUS_URL || 'http://localhost:8055';
  return url;
}

// Lazy initialization of admin client
let _directusAdmin: DirectusAdminClient | null = null;

function getDirectusAdmin(): DirectusAdminClient {
  if (!_directusAdmin) {
    const directusUrl = getDirectusUrl();
    console.log('Initializing Directus admin client with URL:', directusUrl);
    _directusAdmin = createDirectus<DirectusSchema>(directusUrl)
      .with(rest())
      .with(authentication('json')) as DirectusAdminClient;
  }
  return _directusAdmin;
}

// Export the admin client directly - it will be initialized lazily
export const directusAdmin = {
  request: (...args: Parameters<DirectusAdminClient['request']>) =>
    getDirectusAdmin().request(...args),
};

// Login function
let adminLoginPromise: Promise<void> | null = null;

export async function loginAsAdmin() {
  if (!adminLoginPromise) {
    adminLoginPromise = (async () => {
      try {
        const email = process.env.DIRECTUS_ADMIN_EMAIL || '';
        const password = process.env.DIRECTUS_ADMIN_PASSWORD || '';

        if (!email || !password) {
          throw new Error('DIRECTUS_ADMIN_EMAIL and DIRECTUS_ADMIN_PASSWORD must be set');
        }

        // Get the actual client and call login with the proper method signature
        const client = getDirectusAdmin();
        await client.login({ email, password });
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
