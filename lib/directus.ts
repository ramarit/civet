import { createDirectus, rest, authentication } from "@directus/sdk";
import type { User, Page, Form, Lead, Note, Email } from "./types";

// Define Directus schema
interface DirectusSchema {
  users: User[];
  pages: Page[];
  forms: Form[];
  leads: Lead[];
  notes: Note[];
  emails: Email[];
}

// Create Directus client instance
const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || process.env.DIRECTUS_URL || "http://localhost:8055";

export const directus = createDirectus<DirectusSchema>(directusUrl)
  .with(rest())
  .with(authentication("json"));

/**
 * Server-side Directus client with credentials
 * Use this in API routes and server components
 */
export function getServerDirectus() {
  return directus;
}

/**
 * Client-side Directus client
 * Use this in client components
 */
export function getClientDirectus() {
  return directus;
}

// Export the directus instance as default
export default directus;
