import { createHmsApiClient } from '@hms/api-client';

// API URLs - these should be environment variables in production
const API_URLS = {
  authUrl: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:3001',
  patientUrl: process.env.NEXT_PUBLIC_PATIENT_SERVICE_URL || 'http://localhost:3002',
  doctorUrl: process.env.NEXT_PUBLIC_DOCTOR_SERVICE_URL || 'http://localhost:3003',
  billingUrl:
    process.env.NEXT_PUBLIC_BILLING_SERVICE_URL ||
    process.env.NEXT_PUBLIC_PHARMACY_SERVICE_URL ||
    'http://localhost:3004',
};

// Create and export the API client instance
export const apiClient = createHmsApiClient(API_URLS, {
  timeout: 30000, // 30 seconds
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
});

// Export individual API modules for convenience
export const {
  auth: authApi,
  patients: patientsApi,
  doctors: doctorsApi,
  medicines: medicinesApi,
  services: servicesApi,
  billing: billingApi,
} = apiClient;
