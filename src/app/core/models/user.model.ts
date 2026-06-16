export type Role = 'ROLE_ADMIN' | 'ROLE_USER' | 'ROLE_DIRECTOR' | 'ROLE_AUTHOR';

export interface AppUser {
  id: number;
  username: string;
  role: Role;
  email?: string;
  linkedAuthorId?: number; // only for ROLE_AUTHOR
  linkedDirectorId?: number; // only for ROLE_DIRECTOR
}

export interface AuthResponse {
  id: number;
  username: string;
  role: Role;
  token: string;
  email: string;
  linkedAuthorId?: number;
  linkedDirectorId?: number;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface ProfileUpdateRequest {
  username?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}
