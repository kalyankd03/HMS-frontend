// User Roles
export const USER_ROLES = {
  ADMIN: 1,
  DOCTOR: 2,
  FRONTDESK: 3,
  LABTECH: 4,
  PHARMACIST: 5,
} as const;

export const ROLE_NAMES: Record<number, string> = {
  [USER_ROLES.ADMIN]: 'Admin',
  [USER_ROLES.DOCTOR]: 'Doctor',
  [USER_ROLES.FRONTDESK]: 'Front Desk',
  [USER_ROLES.LABTECH]: 'Lab Technician',
  [USER_ROLES.PHARMACIST]: 'Pharmacist',
} as const;

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// Navigation Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PATIENTS: '/patients',
  QUEUE: '/queue',
  PRESCRIPTION: '/prescription',
  ADMIN: '/admin',
} as const;

// Form Validation
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PHONE_PATTERN: /^[+]?[\d\s\-\(\)]{10,}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  NAME_PATTERN: /^[a-zA-Z\s]{2,}$/,
} as const;

// UI Configuration
export const UI_CONFIG = {
  DEBOUNCE_DELAY: 300,
  SEARCH_MIN_LENGTH: 2,
  MAX_SEARCH_RESULTS: 10,
  TOAST_DURATION: 5000,
  ANIMATION_DURATION: 300,
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'hms_auth_token',
  USER_PREFERENCES: 'hms_user_preferences',
  THEME: 'hms_theme',
  LANGUAGE: 'hms_language',
} as const;

// Medical Constants
export const MEDICAL = {
  VITAL_SIGNS: {
    NORMAL_TEMP_RANGE: { min: 36, max: 37.5 }, // Celsius
    NORMAL_PULSE_RANGE: { min: 60, max: 100 }, // BPM
    NORMAL_BP_RANGE: { systolic: { min: 90, max: 140 }, diastolic: { min: 60, max: 90 } }, // mmHg
    NORMAL_SPO2_MIN: 95, // Percentage
  },
  PRESCRIPTION: {
    MAX_MEDICATIONS: 20,
    MAX_INVESTIGATIONS: 15,
    MAX_PROCEDURES: 10,
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
  AUTH_EXPIRED: 'Your session has expired. Please log in again.',
  ACCESS_DENIED: 'You do not have permission to access this resource.',
  VALIDATION_FAILED: 'Please correct the errors in the form.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in!',
  LOGOUT_SUCCESS: 'Successfully logged out.',
  PATIENT_CREATED: 'Patient registered successfully.',
  PRESCRIPTION_SAVED: 'Prescription saved successfully.',
  PROFILE_UPDATED: 'Profile updated successfully.',
} as const;