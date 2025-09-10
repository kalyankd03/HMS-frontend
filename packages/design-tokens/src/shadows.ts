// Design tokens for shadows and elevation
export const shadows = {
  // Standard shadow definitions
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0, // Android
  },
  
  xs: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  
  xl: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 12,
  },
  
  '2xl': {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 16,
  },

  // Colored shadows for specific use cases
  primary: {
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  
  success: {
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  
  error: {
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  
  warning: {
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  // Inner shadows (for inputs, inset elements)
  inner: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 0, // Inner shadows don't work well on Android
  },
} as const;

// Web-specific shadow values (CSS box-shadow format)
export const webShadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  
  // Colored shadows for web
  primaryGlow: '0 0 0 1px rgb(59 130 246 / 0.05), 0 4px 16px -2px rgb(59 130 246 / 0.1)',
  successGlow: '0 0 0 1px rgb(16 185 129 / 0.05), 0 4px 16px -2px rgb(16 185 129 / 0.1)',
  errorGlow: '0 0 0 1px rgb(239 68 68 / 0.05), 0 4px 16px -2px rgb(239 68 68 / 0.1)',
  warningGlow: '0 0 0 1px rgb(245 158 11 / 0.05), 0 4px 16px -2px rgb(245 158 11 / 0.1)',
} as const;

// Semantic shadow aliases for component usage
export const componentShadows = {
  // Cards and surfaces
  card: shadows.sm,
  cardHover: shadows.md,
  cardActive: shadows.xs,
  
  // Modals and overlays
  modal: shadows.xl,
  dropdown: shadows.lg,
  tooltip: shadows.md,
  popover: shadows.lg,
  
  // Buttons
  button: shadows.xs,
  buttonHover: shadows.sm,
  buttonActive: shadows.none,
  buttonFloating: shadows.lg,
  
  // Inputs
  input: shadows.inner,
  inputFocus: shadows.sm,
  
  // Navigation
  navbar: shadows.sm,
  sidebar: shadows.lg,
  
  // Content sections
  section: shadows.xs,
  paper: shadows.sm,
  
  // Medical/Healthcare specific
  patientCard: shadows.sm,
  appointmentCard: shadows.xs,
  emergencyAlert: shadows.error,
  criticalNotification: shadows.lg,
} as const;