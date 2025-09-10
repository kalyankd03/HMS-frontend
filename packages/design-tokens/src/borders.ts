// Design tokens for borders and border radius
export const borders = {
  // Border widths
  width: {
    none: 0,
    thin: 1,
    medium: 2,
    thick: 4,
    thicker: 8,
  },

  // Border radius values
  radius: {
    none: 0,
    xs: 2,
    sm: 4,
    md: 6,
    lg: 8,
    xl: 12,
    '2xl': 16,
    '3xl': 24,
    full: 9999,
  },

  // Border styles
  style: {
    solid: 'solid' as const,
    dashed: 'dashed' as const,
    dotted: 'dotted' as const,
  },
} as const;

// Semantic border definitions
export const semanticBorders = {
  // Input borders
  input: {
    width: borders.width.thin,
    style: borders.style.solid,
    radius: borders.radius.md,
  },
  
  inputFocus: {
    width: borders.width.medium,
    style: borders.style.solid,
    radius: borders.radius.md,
  },
  
  inputError: {
    width: borders.width.thin,
    style: borders.style.solid,
    radius: borders.radius.md,
  },

  // Button borders
  button: {
    width: borders.width.thin,
    style: borders.style.solid,
    radius: borders.radius.md,
  },
  
  buttonRounded: {
    width: borders.width.thin,
    style: borders.style.solid,
    radius: borders.radius.full,
  },

  // Card borders
  card: {
    width: borders.width.thin,
    style: borders.style.solid,
    radius: borders.radius.lg,
  },
  
  cardSmall: {
    width: borders.width.thin,
    style: borders.style.solid,
    radius: borders.radius.md,
  },

  // Modal borders
  modal: {
    width: borders.width.none,
    style: borders.style.solid,
    radius: borders.radius.xl,
  },
  
  // Dividers
  divider: {
    width: borders.width.thin,
    style: borders.style.solid,
    radius: borders.radius.none,
  },
  
  dividerThick: {
    width: borders.width.medium,
    style: borders.style.solid,
    radius: borders.radius.none,
  },

  // Avatar borders
  avatar: {
    width: borders.width.medium,
    style: borders.style.solid,
    radius: borders.radius.full,
  },

  // Badge borders
  badge: {
    width: borders.width.thin,
    style: borders.style.solid,
    radius: borders.radius.full,
  },

  // Table borders
  table: {
    width: borders.width.thin,
    style: borders.style.solid,
    radius: borders.radius.none,
  },

  // Medical/Healthcare specific borders
  patientCard: {
    width: borders.width.thin,
    style: borders.style.solid,
    radius: borders.radius.lg,
  },
  
  emergencyBorder: {
    width: borders.width.thick,
    style: borders.style.solid,
    radius: borders.radius.md,
  },
  
  criticalAlert: {
    width: borders.width.medium,
    style: borders.style.solid,
    radius: borders.radius.md,
  },
} as const;