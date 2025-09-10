import { USER_ROLES } from '../constants';

// Permission constants
export const PERMISSIONS = {
  // Admin permissions
  MANAGE_USERS: 'manage_users',
  MANAGE_HOSPITALS: 'manage_hospitals',
  MANAGE_DEPARTMENTS: 'manage_departments',
  VIEW_ALL_PATIENTS: 'view_all_patients',
  MANAGE_SYSTEM_SETTINGS: 'manage_system_settings',
  
  // Doctor permissions
  VIEW_PATIENTS: 'view_patients',
  MANAGE_PRESCRIPTIONS: 'manage_prescriptions',
  VIEW_MEDICAL_RECORDS: 'view_medical_records',
  UPDATE_MEDICAL_RECORDS: 'update_medical_records',
  
  // Front desk permissions
  REGISTER_PATIENTS: 'register_patients',
  MANAGE_APPOINTMENTS: 'manage_appointments',
  VIEW_PATIENT_INFO: 'view_patient_info',
  MANAGE_QUEUE: 'manage_queue',
  
  // Lab tech permissions
  VIEW_LAB_ORDERS: 'view_lab_orders',
  UPDATE_LAB_RESULTS: 'update_lab_results',
  
  // Pharmacist permissions
  VIEW_PRESCRIPTIONS: 'view_prescriptions',
  DISPENSE_MEDICATIONS: 'dispense_medications',
} as const;

// Role-based permissions mapping
const ROLE_PERMISSIONS: Record<number, string[]> = {
  [USER_ROLES.ADMIN]: [
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_HOSPITALS,
    PERMISSIONS.MANAGE_DEPARTMENTS,
    PERMISSIONS.VIEW_ALL_PATIENTS,
    PERMISSIONS.MANAGE_SYSTEM_SETTINGS,
    PERMISSIONS.VIEW_PATIENTS,
    PERMISSIONS.MANAGE_PRESCRIPTIONS,
    PERMISSIONS.VIEW_MEDICAL_RECORDS,
    PERMISSIONS.UPDATE_MEDICAL_RECORDS,
    PERMISSIONS.REGISTER_PATIENTS,
    PERMISSIONS.MANAGE_APPOINTMENTS,
    PERMISSIONS.VIEW_PATIENT_INFO,
    PERMISSIONS.MANAGE_QUEUE,
  ],
  [USER_ROLES.DOCTOR]: [
    PERMISSIONS.VIEW_PATIENTS,
    PERMISSIONS.MANAGE_PRESCRIPTIONS,
    PERMISSIONS.VIEW_MEDICAL_RECORDS,
    PERMISSIONS.UPDATE_MEDICAL_RECORDS,
    PERMISSIONS.VIEW_PATIENT_INFO,
  ],
  [USER_ROLES.FRONTDESK]: [
    PERMISSIONS.REGISTER_PATIENTS,
    PERMISSIONS.MANAGE_APPOINTMENTS,
    PERMISSIONS.VIEW_PATIENT_INFO,
    PERMISSIONS.MANAGE_QUEUE,
  ],
  [USER_ROLES.LABTECH]: [
    PERMISSIONS.VIEW_LAB_ORDERS,
    PERMISSIONS.UPDATE_LAB_RESULTS,
    PERMISSIONS.VIEW_PATIENT_INFO,
  ],
  [USER_ROLES.PHARMACIST]: [
    PERMISSIONS.VIEW_PRESCRIPTIONS,
    PERMISSIONS.DISPENSE_MEDICATIONS,
    PERMISSIONS.VIEW_PATIENT_INFO,
  ],
};

// Permission checking functions
export function hasPermission(userRoleId: number, permission: string): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRoleId] || [];
  return rolePermissions.includes(permission);
}

export function hasAnyPermission(userRoleId: number, permissions: string[]): boolean {
  return permissions.some(permission => hasPermission(userRoleId, permission));
}

export function hasAllPermissions(userRoleId: number, permissions: string[]): boolean {
  return permissions.every(permission => hasPermission(userRoleId, permission));
}

export function getRolePermissions(userRoleId: number): string[] {
  return ROLE_PERMISSIONS[userRoleId] || [];
}

export function canAccessRoute(userRoleId: number, route: string): boolean {
  switch (route) {
    case '/admin':
      return hasPermission(userRoleId, PERMISSIONS.MANAGE_USERS);
    case '/patients':
      return hasAnyPermission(userRoleId, [
        PERMISSIONS.REGISTER_PATIENTS,
        PERMISSIONS.VIEW_PATIENTS,
        PERMISSIONS.VIEW_ALL_PATIENTS
      ]);
    case '/prescriptions':
      return hasAnyPermission(userRoleId, [
        PERMISSIONS.MANAGE_PRESCRIPTIONS,
        PERMISSIONS.VIEW_PRESCRIPTIONS
      ]);
    case '/queue':
      return hasPermission(userRoleId, PERMISSIONS.MANAGE_QUEUE);
    case '/dashboard':
      return true; // All authenticated users can access dashboard
    default:
      return false;
  }
}

// Type exports
export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];