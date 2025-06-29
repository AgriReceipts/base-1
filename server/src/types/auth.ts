import {UserRole} from '@prisma/client';

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
