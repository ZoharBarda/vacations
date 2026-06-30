export type UserRole = "user" | "admin" | "manager";

export interface AuthUser {
  userId: number;
  firstName?: string;
  lastName?: string;
  email: string;
  role: UserRole;
}

export interface AuthState {
  token: string | null;
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface AuthResponse {
  token: string;
  userId: number;
  role: UserRole;
  email?: string;
  firstName?: string;
  lastName?: string;
}
