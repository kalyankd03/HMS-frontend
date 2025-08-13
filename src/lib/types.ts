// Core user types from HMS auth-service
export interface User {
  user_id: number;
  name: string;
  email: string;
  role_id: number;
  created_at: string;  // ISO 8601
  updated_at: string;  // ISO 8601
}

export interface Role {
  role_id: number;
  name: 'admin' | 'doctor' | 'frontdesk' | 'labtech' | 'pharmacist';
  description?: string;
}

// API response types
export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role_id: number;
}

// Type guards
export function isApiError(response: unknown): response is ApiError {
  return typeof response === 'object' && 
         response !== null && 
         'error' in response;
}

export function isLoginResponse(response: unknown): response is LoginResponse {
  return typeof response === 'object' && 
         response !== null && 
         'user' in response && 
         'token' in response;
}

export function isRegisterResponse(response: unknown): response is RegisterResponse {
  return typeof response === 'object' && 
         response !== null && 
         'user' in response && 
         'token' in response;
}

// Constants
export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PROFILE: '/auth/me',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'hms_auth_token',
} as const;

export const USER_ROLES = {
  ADMIN: 1,
  DOCTOR: 2, 
  FRONTDESK: 3,
  LABTECH: 4,
  PHARMACIST: 5,
} as const;

export const ROLE_NAMES: Record<number, string> = {
  1: 'Admin',
  2: 'Doctor',
  3: 'Front Desk',
  4: 'Lab Technician',
  5: 'Pharmacist',
};
