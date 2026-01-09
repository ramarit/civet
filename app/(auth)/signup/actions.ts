'use server';

import { directusAdmin, loginAsAdmin } from '@/lib/directus-admin';
import { readRoles } from '@directus/sdk';

interface SignupData {
  email: string;
  password: string;
  name: string;
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

    // Create user with admin privileges using fetch directly
    console.log('Server: Creating user...');

    const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
    const token = await directusAdmin.getToken();

    const response = await fetch(`${directusUrl}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        first_name: data.name,
        role: userRoleId,
        status: 'active',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }

    const result = await response.json() as { data: { id: string; email: string } };
    const newUser = result.data;

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
      error: `Signup failed: ${errorMessage || 'Please try again.'}`
    };
  }
}