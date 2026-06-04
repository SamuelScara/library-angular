export type Role = 'ROLE_ADMIN' | 'ROLE_USER' | 'ROLE_DIRECTOR' | 'ROLE_AUTHOR';

export interface AppUser {
  id: number;
  username: string;
  role: Role;
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
