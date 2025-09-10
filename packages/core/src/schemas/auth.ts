import { z } from 'zod';
import { VALIDATION, USER_ROLES } from '../constants';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .regex(VALIDATION.EMAIL_PATTERN, 'Invalid email format'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(VALIDATION.PASSWORD_MIN_LENGTH, `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`),
});

export const registerSchema = z.object({
  first_name: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .regex(VALIDATION.NAME_PATTERN, 'First name can only contain letters and spaces'),
  last_name: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .regex(VALIDATION.NAME_PATTERN, 'Last name can only contain letters and spaces'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .regex(VALIDATION.EMAIL_PATTERN, 'Invalid email format'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(VALIDATION.PASSWORD_MIN_LENGTH, `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
  role_id: z
    .number()
    .int('Role must be a valid integer')
    .min(1, 'Please select a role')
    .refine(
      (val) => Object.values(USER_ROLES).includes(val as any),
      'Invalid role selected'
    ),
  hospital_id: z
    .number()
    .int('Hospital must be a valid integer')
    .min(1, 'Please select a hospital'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const userSchema = z.object({
  user_id: z.number().int().positive(),
  name: z.string().min(1),
  email: z.string().email(),
  role_id: z.number().int().positive(),
  hospital_id: z.number().int().positive(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const apiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  }),
});

// Type exports for use in applications
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type UserData = z.infer<typeof userSchema>;
export type ApiErrorData = z.infer<typeof apiErrorSchema>;