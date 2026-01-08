'use server';

import { directusAdmin } from '@/lib/directus-admin';
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
        error: 'System configuration error. Please contact support.' 
      };
    }

    console.log('Server: User role found:', userRoleId);

    // Create user with admin privileges (bypasses all permissions)
    const newUser = await directusAdmin.request(
      createUser<CustomDirectusUser>({
        email: data.email,
        password: data.password,
        first_name: data.name,
        subdomain: data.subdomain.toLowerCase(),
        role: userRoleId,
        status: 'active', // Activate immediately
      })
    );

    console.log('Server: User created successfully:', newUser.id);

    return { 
      success: true, 
      userId: newUser.id 
    };

  } catch (error: any) {
    console.error('Server: Signup error:', error);

    // Handle specific errors
    const errorMessage = error?.errors?.[0]?.message || error?.message || '';

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