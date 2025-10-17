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

// User profile from /auth/me endpoint
export interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role_id: number;
  hospital_id: number;
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
  service_ids?: number[];
}

export interface CreateOpTicketForm {
  patient_id?: number;
  patient_query?: string;
  allotted_doctor_id: number;
  referral_doctor?: string;
  service_ids?: number[];
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

// Service catalog types
export interface ServiceCatalogItem {
  id: number;
  hospital_id: number;
  service_code: string;
  service_name: string;
  description?: string | null;
  category?: string | null;
  default_price: number;
  is_active: boolean;
  is_default_opd_service: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: number | null;
  updated_by?: number | null;
}

export interface CreateServiceInput {
  service_code: string;
  service_name: string;
  description?: string;
  category?: string;
  default_price: number;
  is_default_opd_service?: boolean;
}

export interface UpdateServiceInput {
  service_name?: string;
  description?: string;
  category?: string;
  default_price?: number;
  is_active?: boolean;
}

export interface BillingDocument {
  id: number;
  hospital_id: number;
  patient_id: number;
  op_ticket_id?: number | null;
  document_type: string;
  bill_number: string;
  status: 'draft' | 'finalized' | 'cancelled' | 'refunded';
  total_amount: number;
  discount_amount: number;
  net_total: number;
  amount_paid: number;
  balance_due: number;
  notes?: string | null;
  finalized_at?: string | null;
  finalized_by?: number | null;
  created_at?: string;
  updated_at?: string;
  created_by?: number | null;
  updated_by?: number | null;
}

export interface PaymentRecord {
  id: number;
  hospital_id: number;
  patient_id: number;
  payment_number: string;
  payment_method: 'Cash' | 'Card' | 'UPI' | 'Insurance' | 'Corporate' | 'NEFT' | 'Bank';
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  reference_number?: string | null;
  card_last_four?: string | null;
  upi_id?: string | null;
  bank_name?: string | null;
  notes?: string | null;
  payment_date: string;
  created_at?: string;
  created_by?: number | null;
  updated_by?: number | null;
}

export interface BillingDocumentFilters {
  status?: BillingDocument['status'];
  from_date?: string;
  to_date?: string;
  patient_id?: number;
}

export interface PaymentFilters {
  status?: PaymentRecord['status'];
  from_date?: string;
  to_date?: string;
  patient_id?: number;
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

// User roles type (constants defined in constants/index.ts)
export type UserRoleType = 1 | 2 | 3 | 4 | 5;

// Type guards (isApiError is defined in utils/index.ts)

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

// Note: STORAGE_KEYS, USER_ROLES, and ROLE_NAMES are defined in constants/index.ts

// Prescription and Medical Record Types
export interface VitalSigns {
  pulse?: number;
  spO2?: number;
  bloodPressure?: string;
  respiratoryRate?: number;
  temperature?: number;
  height?: number;
  weight?: number;
  bmi?: number;
  systolicBP?: number;
  diastolicBP?: number;
  muscleMass?: number;
  boneMass?: number;
  hbA1c?: number;
  flaccPainSeverityScore?: number;
  midArmCircumference?: number;
  neckCircumference?: number;
  nipssPainScale?: number;
  wongBakerPainScale?: number;
  headCircumference?: number;
  waistCircumference?: number;
  chestCircumference?: number;
  abdominalGirth?: number;
  lastMenstrualPeriod?: string;
}

export interface MedicalCondition {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  since?: string;
  notes?: string;
}

export interface MedicalHistory {
  existingConditions: MedicalCondition[];
  currentMedications: Medication[];
  familyHistory: string[];
  lifestyleHabits: string[];
  foodAllergies: string[];
  drugAllergies: string[];
  pastSurgicalProcedures: string[];
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  isActive: boolean;
}

export interface LabInvestigation {
  id: string;
  name: string;
  type: 'blood' | 'urine' | 'imaging' | 'other';
  urgency: 'routine' | 'urgent' | 'stat';
  notes?: string;
}

export interface PrescriptionData {
  patientId: number;
  doctorId: number;
  visitDate: string;
  vitals: VitalSigns;
  medicalHistory: MedicalHistory;
  symptoms: string;
  diagnosis: string;
  medications: Medication[];
  labInvestigations: LabInvestigation[];
  notes: {
    treatmentNotes: string;
    privateNotes: string;
  };
  followUp: {
    required: boolean;
    duration?: string;
    instructions?: string;
  };
  procedures: string[];
}

export interface PatientVisit {
  visitId: number;
  patientId: number;
  patientName: string;
  tokenNumber: number;
  scheduledTime: string;
  status: "waiting" | "in_progress" | "done";
  prescription?: PrescriptionData;
}

// Medicine search types
export interface MedicineSearchResult {
  id: number;
  name: string;
  salt_composition?: string | null;
  dosage_form?: string;
  manufacturer_name?: string;
  price?: string;
  is_discontinued?: boolean;
}

export interface MedicineSearchResponse {
  data: MedicineSearchResult[];
}
