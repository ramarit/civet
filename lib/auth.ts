import { cookies } from "next/headers";
import { directus } from "./directus";
import { readMe } from "@directus/sdk";
import type { User } from "./types";

const AUTH_COOKIE_NAME = "directus_token";

/**
 * Get the current authenticated user from the session
 * Server-side only
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return null;
    }

    // Set the token for this request
    directus.setToken(token);

    // Get current user from Directus
    const directusUser = await directus.request(readMe());

    // Map Directus user to our application User type
    const user: User = {
      id: directusUser.id,
      email: directusUser.email || "",
      name: directusUser.first_name || "",
      subdomain: (directusUser as any).subdomain || "",
      created_at: (directusUser as any).date_created || new Date().toISOString(),
    };

    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Set the authentication token in cookies
 * Server-side only
 */
export async function setAuthToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

/**
 * Clear the authentication token
 * Server-side only
 */
export async function clearAuthToken() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

/**
 * Check if user is authenticated
 * Server-side only
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

/**
 * Require authentication - redirect to login if not authenticated
 * Server-side only
 */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized - please login");
  }

  return user;
}
