/**
 * Format text for better accessibility
 */
export const formatTextForAccessibility = (text: string): string => {
  if (!text) return text;
  
  // Add pauses for better screen reader pronunciation
  return text
    .replace(/\./g, '. ') // Add space after periods
    .replace(/,/g, ', ') // Add space after commas
    .replace(/:/g, ': ') // Add space after colons
    .replace(/;/g, '; ') // Add space after semicolons
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
};

/**
 * Generate accessibility label for medical status
 */
export const getMedicalStatusAccessibilityLabel = (status: string): string => {
  const statusMap: Record<string, string> = {
    'active': 'Patient status: Active',
    'inactive': 'Patient status: Inactive',
    'critical': 'Patient status: Critical - requires immediate attention',
    'stable': 'Patient status: Stable',
    'emergency': 'Emergency status - urgent care needed',
    'discharged': 'Patient status: Discharged',
  };
  
  return statusMap[status.toLowerCase()] || `Status: ${status}`;
};

/**
 * Generate accessibility hint for buttons
 */
export const getButtonAccessibilityHint = (action: string): string => {
  const hintMap: Record<string, string> = {
    'save': 'Double tap to save changes',
    'delete': 'Double tap to delete item',
    'edit': 'Double tap to edit item',
    'cancel': 'Double tap to cancel action',
    'submit': 'Double tap to submit form',
    'back': 'Double tap to go back',
    'next': 'Double tap to continue',
    'close': 'Double tap to close',
  };
  
  return hintMap[action.toLowerCase()] || `Double tap to ${action}`;
};

/**
 * Create accessible label for patient information
 */
export const getPatientAccessibilityLabel = (patient: {
  name: string;
  age?: number;
  status?: string;
  room?: string;
}): string => {
  const parts = [`Patient: ${patient.name}`];
  
  if (patient.age) {
    parts.push(`Age: ${patient.age} years old`);
  }
  
  if (patient.status) {
    parts.push(getMedicalStatusAccessibilityLabel(patient.status));
  }
  
  if (patient.room) {
    parts.push(`Room: ${patient.room}`);
  }
  
  return parts.join(', ');
};

/**
 * Create accessible label for appointment information
 */
export const getAppointmentAccessibilityLabel = (appointment: {
  patientName: string;
  doctorName: string;
  time: string;
  type?: string;
}): string => {
  const parts = [
    `Appointment for ${appointment.patientName}`,
    `with Dr. ${appointment.doctorName}`,
    `at ${appointment.time}`,
  ];
  
  if (appointment.type) {
    parts.push(`Type: ${appointment.type}`);
  }
  
  return parts.join(', ');
};