// Core user types from HMS auth-service
export interface User {
  user_id: number;
  name: string;
  email: string;
  role_id: number;
  hospital_id: number;
  created_at: string;  // ISO 8601
  updated_at: string;  // ISO 8601
}

export interface Role {
  role_id: number;
  name: 'admin' | 'doctor' | 'frontdesk' | 'labtech' | 'pharmacist';
  description?: string;
}

export interface Hospital {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  is_active: boolean;
  created_at: string;  // ISO 8601
  updated_at: string;  // ISO 8601
}

export interface Doctor {
  id: number; // Foreign key to users.id
  dept: string;
  speciality: string;
  is_active: boolean;
  created_at: string;  // ISO 8601
  updated_at: string;  // ISO 8601
}

export interface DoctorWithUser extends Doctor {
  // User fields from JOIN
  name: string;
  email: string;
  hospital_id: number;
  user_created_at: string;  // ISO 8601
  user_updated_at: string;  // ISO 8601
}

export interface CreateDoctorForm {
  id: number; // Must be a valid user ID with role_id = 2 (doctor)
  dept: string;
  speciality: string;
  is_active?: boolean;
}

export interface UpdateDoctorForm {
  dept?: string;
  speciality?: string;
  is_active?: boolean;
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
  hospital_id: number;
}

// Patient service types
export interface Patient {
  patient_id: number;
  name: string;
  date_of_birth?: string | null;
  phone: string;
  hospital_id: number;
}

export interface CreatePatientForm {
  name: string;
  date_of_birth?: string;
  phone: string;
  hospital_id?: number;
}

export interface OpTicket {
  op_id: number;
  patient_id: number;
  allotted_doctor_id: number;
  referral_doctor?: string | null;
}

export interface CreateOpTicketForm {
  patient_id?: number;
  patient_query?: string;
  allotted_doctor_id: number;
  referral_doctor?: string;
}

export interface PatientSearchResponse {
  results: Patient[];
}

export interface DoctorSearchResult {
  id: number; // User ID
  name: string;
  email: string;
  hospital_id: number;
  dept: string;
  speciality: string;
  is_active: boolean;
}

export interface DoctorSearchResponse {
  results: DoctorSearchResult[];
}

// Roster management types
export interface RosterUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role_id: number;
  status: 'invited' | 'active' | 'inactive';
  invited_at?: string;
  created_at: string;
}

export interface InviteUserRequest {
  email: string;
  first_name: string;
  last_name: string;
  role_id: number;
  department_id?: number;
  speciality?: string;
}

export interface HospitalInfo {
  id: number;
  name: string;
  address: string;
}

export interface Department {
  id: number;
  name: string;
  code: string;
  description?: string;
}

// User roles constants
export const USER_ROLES = {
  ADMIN: 1,
  DOCTOR: 2,
  FRONTDESK: 3,
  PHARMACIST: 4
} as const;

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
         'id' in response && 
         'email' in response;
}

// Constants
export const API_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  PROFILE: '/api/auth/me',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'hms_auth_token',
} as const;

// USER_ROLES is defined above

export const ROLE_NAMES: Record<number, string> = {
  1: 'Admin',
  2: 'Doctor',
  3: 'Front Desk',
  4: 'Lab Technician',
  5: 'Pharmacist',
};
