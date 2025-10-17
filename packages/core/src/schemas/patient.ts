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
  patient_id: z.number().int().positive(),
  allotted_doctor_id: z.number().int().positive(),
  referral_doctor: z.string().optional(),
  service_ids: z.array(z.number().int().positive()).optional(),
});

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

// Medical History Schema
export const medicalHistorySchema = z.object({
  smokingStatus: z.enum(['never', 'former', 'current']).optional(),
  alcoholConsumption: z.enum(['never', 'occasional', 'regular', 'heavy']).optional(),
  diabetes: z.boolean().optional(),
  hypertension: z.boolean().optional(),
  heartDisease: z.boolean().optional(),
  asthma: z.boolean().optional(),
  allergies: z.array(z.string()).optional(),
  currentMedications: z.array(z.string()).optional(),
  familyHistory: z.string().optional(),
  surgicalHistory: z.array(z.string()).optional(),
});

// Symptoms Schema
export const symptomsSchema = z.object({
  chiefComplaint: z.string().min(1, 'Chief complaint is required'),
  fever: z.boolean().optional(),
  cough: z.boolean().optional(),
  headache: z.boolean().optional(),
  nausea: z.boolean().optional(),
  vomiting: z.boolean().optional(),
  diarrhea: z.boolean().optional(),
  fatigue: z.boolean().optional(),
  chestPain: z.boolean().optional(),
  abdomenPain: z.boolean().optional(),
  painLevel: z.number().min(0).max(10).optional(),
  symptomDuration: z.string().optional(),
  additionalSymptoms: z.string().optional(),
});

// Lab Investigations Schema
export const labInvestigationsSchema = z.object({
  bloodTests: z.object({
    cbc: z.boolean().optional(),
    lft: z.boolean().optional(),
    rft: z.boolean().optional(),
    lipidProfile: z.boolean().optional(),
    hba1c: z.boolean().optional(),
    thyroidFunction: z.boolean().optional(),
    other: z.string().optional(),
  }).optional(),
  imaging: z.object({
    xray: z.boolean().optional(),
    ultrasound: z.boolean().optional(),
    ctScan: z.boolean().optional(),
    mri: z.boolean().optional(),
    ecg: z.boolean().optional(),
    other: z.string().optional(),
  }).optional(),
  otherTests: z.string().optional(),
});

// Lab Results Schema
export const labResultsSchema = z.object({
  hemoglobin: z.number().positive().optional(),
  wbcCount: z.number().positive().optional(),
  plateletCount: z.number().positive().optional(),
  bloodSugar: z.number().positive().optional(),
  cholesterol: z.number().positive().optional(),
  creatinine: z.number().positive().optional(),
  bilirubin: z.number().positive().optional(),
  alt: z.number().positive().optional(),
  ast: z.number().positive().optional(),
  hba1c: z.number().positive().optional(),
  otherResults: z.string().optional(),
});

// Diagnosis Schema
export const diagnosisSchema = z.object({
  primaryDiagnosis: z.string().min(1, 'Primary diagnosis is required'),
  primaryDiagnosisCode: z.string().optional(),
  secondaryDiagnoses: z.array(z.string()).optional(),
  differentialDiagnoses: z.array(z.string()).optional(),
  diagnosisNotes: z.string().optional(),
});

// Clinical Notes Schema
export const clinicalNotesSchema = z.object({
  generalExamination: z.string().optional(),
  systemicExamination: z.string().optional(),
  provisionalDiagnosis: z.string().optional(),
  treatmentPlan: z.string().optional(),
  doctorNotes: z.string().optional(),
  privateNotes: z.string().optional(),
});

// Follow-up Schema
export const followUpSchema = z.object({
  required: z.boolean(),
  nextVisitDate: z.string().optional(),
  followUpDuration: z.string().optional(),
  instructions: z.string().optional(),
  referrals: z.array(z.string()).optional(),
  precautions: z.string().optional(),
});

// Complete EMR Schema
export const emrSchema = z.object({
  opId: z.number().int().positive(),
  patientId: z.number().int().positive(),
  doctorId: z.number().int().positive(),
  visitDate: z.string().datetime(),
  vitals: vitalSignsSchema,
  medicalHistory: medicalHistorySchema,
  symptoms: symptomsSchema,
  labInvestigations: labInvestigationsSchema,
  diagnosis: diagnosisSchema,
  medications: z.array(medicationSchema),
  labResults: labResultsSchema.optional(),
  clinicalNotes: clinicalNotesSchema,
  followUp: followUpSchema,
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
export type MedicalHistoryData = z.infer<typeof medicalHistorySchema>;
export type SymptomsData = z.infer<typeof symptomsSchema>;
export type LabInvestigationsData = z.infer<typeof labInvestigationsSchema>;
export type LabResultsData = z.infer<typeof labResultsSchema>;
export type DiagnosisData = z.infer<typeof diagnosisSchema>;
export type ClinicalNotesData = z.infer<typeof clinicalNotesSchema>;
export type FollowUpData = z.infer<typeof followUpSchema>;
export type EMRData = z.infer<typeof emrSchema>;
