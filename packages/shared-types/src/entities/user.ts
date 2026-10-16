/**
 * User entity types
 */

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  VIEWER = 'viewer',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  status: UserStatus;
  avatar: string | null;
  organizationId: string | null;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends Pick<User, 'id' | 'email' | 'name' | 'avatar' | 'role'> {
  projectCount: number;
  lastLoginAt: Date | null;
}

export interface UserPreferences {
  userId: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    translationComplete: boolean;
    weeklyReport: boolean;
  };
}

export type CreateUserInput = Pick<User, 'email' | 'name' | 'role'> & {
  password: string;
};

export type UpdateUserInput = Partial<Pick<User, 'name' | 'role' | 'status' | 'avatar'>>;
