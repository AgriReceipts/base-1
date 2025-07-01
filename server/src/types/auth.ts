import {UserRole} from '@prisma/client';
import {z} from 'zod';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    name: string;
    role: UserRole;
    designation: string;
    committeeId?: string;
  };
}

export interface JwtPayload {
  userId: string;
  username: string;
  role: UserRole;
  committeeId?: string;
}

export interface AuthenticatedUser {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  designation: string;
  committeeId?: string;
}

export const RegisterUserSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required'),
  role: z.enum(['deo', 'supervisor', 'secretary', 'ad']),
  designation: z.string().min(1, 'Designation is required'),
  committeeName: z.string().optional(),
});

// Inferred TypeScript type
export type RegisterUserInput = z.infer<typeof RegisterUserSchema>;
