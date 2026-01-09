'use server';

import { directusAdmin, loginAsAdmin } from '@/lib/directus-admin';
import { createUser, readRoles } from '@directus/sdk';
import { CustomDirectusUser } from '@/lib/types';

interface SignupData {
  email: string;
  password: string;
  name: string;
  subdomain: string;
}

interface SignupResult {
  success: boolean;
  error?: string;
  userId?: string;
}

export async function signupUser(data: SignupData): Promise<SignupResult> {
  try {
    console.log('Server: Starting signup process...');

    // Login as admin first
    await loginAsAdmin();

    console.log('Server: Admin authenticated, fetching User role...');

    // Get the "User" role ID
    const roles = await directusAdmin.request(
      readRoles({
        filter: { name: { _eq: 'User' } },
        limit: 1,
      })
    );

    const userRoleId = roles[0]?.id;

    if (!userRoleId) {
      console.error('Server: User role not found');
      return {
        success: false,
        error: 'System configuration error. User role not found.'
      };
    }

    console.log('Server: User role found:', userRoleId);

    // Create user with admin privileges
    console.log('Server: Creating user...');
    const userData: Partial<CustomDirectusUser> = {
      email: data.email,
      password: data.password,
      first_name: data.name,
      subdomain: data.subdomain.toLowerCase(),
      role: userRoleId,
      status: 'active',
    };

    const newUser = await directusAdmin.request(createUser(userData));

    console.log('Server: User created successfully:', newUser.id);

    return {
      success: true,
      userId: newUser.id
    };

  } catch (error) {
    const directusError = error as { errors?: Array<{ message?: string }>; message?: string };

    console.error('Server: Signup error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      errors: directusError?.errors,
    });

    const errorMessage = directusError?.errors?.[0]?.message || (error instanceof Error ? error.message : '') || '';

    // Duplicate subdomain
    if (errorMessage.includes('subdomain') || errorMessage.includes('unique')) {
      return {
        success: false,
        error: 'This subdomain is already taken. Please choose another.'
      };
    }

    // Duplicate email
    if (errorMessage.includes('email')) {
      return {
        success: false,
        error: 'This email is already registered. Please login instead.'
      };
    }

    // Generic error
    return {
      success: false,
      error: 'Signup failed. Please try again.'
    };
  }
}