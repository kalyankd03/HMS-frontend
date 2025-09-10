import { z } from 'zod';
import { VALIDATION } from '../constants';

export const createPatientSchema = z.object({
  name: z
    .string()
    .min(1, 'Patient name is required')
    .min(2, 'Name must be at least 2 characters')
    .regex(VALIDATION.NAME_PATTERN, 'Name can only contain letters and spaces'),
  date_of_birth: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    }),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(VALIDATION.PHONE_PATTERN, 'Invalid phone number format'),
  hospital_id: z.number().int().positive().optional(),
});

export const patientSchema = z.object({
  patient_id: z.number().int().positive(),
  name: z.string().min(1),
  date_of_birth: z.string().nullable().optional(),
  phone: z.string().min(1),
  hospital_id: z.number().int().positive(),
});

export const createOpTicketSchema = z.object({
  patient_id: z.number().int().positive().optional(),
  patient_query: z.string().min(1).optional(),
  allotted_doctor_id: z.number().int().positive(),
  referral_doctor: z.string().optional(),
}).refine(
  (data) => data.patient_id || data.patient_query,
  {
    message: 'Either patient_id or patient_query must be provided',
    path: ['patient_id'],
  }
);

export const vitalSignsSchema = z.object({
  pulse: z.number().int().positive().optional(),
  spO2: z.number().int().min(0).max(100).optional(),
  bloodPressure: z.string().optional(),
  respiratoryRate: z.number().int().positive().optional(),
  temperature: z.number().positive().optional(),
  height: z.number().positive().optional(),
  weight: z.number().positive().optional(),
  bmi: z.number().positive().optional(),
  systolicBP: z.number().int().positive().optional(),
  diastolicBP: z.number().int().positive().optional(),
});

export const medicationSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Medication name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  duration: z.string().min(1, 'Duration is required'),
  instructions: z.string().optional(),
  isActive: z.boolean(),
});

export const prescriptionSchema = z.object({
  patientId: z.number().int().positive(),
  doctorId: z.number().int().positive(),
  visitDate: z.string().datetime(),
  vitals: vitalSignsSchema,
  symptoms: z.string().min(1, 'Symptoms are required'),
  diagnosis: z.string().min(1, 'Diagnosis is required'),
  medications: z.array(medicationSchema),
  notes: z.object({
    treatmentNotes: z.string(),
    privateNotes: z.string(),
  }),
  followUp: z.object({
    required: z.boolean(),
    duration: z.string().optional(),
    instructions: z.string().optional(),
  }),
});

// Type exports
export type CreatePatientFormData = z.infer<typeof createPatientSchema>;
export type PatientData = z.infer<typeof patientSchema>;
export type CreateOpTicketFormData = z.infer<typeof createOpTicketSchema>;
export type VitalSignsData = z.infer<typeof vitalSignsSchema>;
export type MedicationData = z.infer<typeof medicationSchema>;
export type PrescriptionFormData = z.infer<typeof prescriptionSchema>;