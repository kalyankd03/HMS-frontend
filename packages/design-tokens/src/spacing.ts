// Design tokens for spacing
export const spacing = {
  // Base spacing scale (in pixels)
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
  36: 144,
  40: 160,
  44: 176,
  48: 192,
  52: 208,
  56: 224,
  60: 240,
  64: 256,
  72: 288,
  80: 320,
  96: 384,
} as const;

// Semantic spacing aliases
export const semanticSpacing = {
  // Component spacing
  componentPadding: {
    xs: spacing[2],   // 8px
    sm: spacing[3],   // 12px
    md: spacing[4],   // 16px
    lg: spacing[6],   // 24px
    xl: spacing[8],   // 32px
  },
  
  componentMargin: {
    xs: spacing[2],   // 8px
    sm: spacing[4],   // 16px
    md: spacing[6],   // 24px
    lg: spacing[8],   // 32px
    xl: spacing[12],  // 48px
  },

  // Layout spacing
  containerPadding: {
    mobile: spacing[4],  // 16px
    tablet: spacing[6],  // 24px
    desktop: spacing[8], // 32px
  },
  
  sectionSpacing: {
    xs: spacing[8],   // 32px
    sm: spacing[12],  // 48px
    md: spacing[16],  // 64px
    lg: spacing[24],  // 96px
    xl: spacing[32],  // 128px
  },

  // Form spacing
  formFieldGap: spacing[4],     // 16px
  formGroupGap: spacing[6],     // 24px
  formSectionGap: spacing[8],   // 32px

  // Card spacing
  cardPadding: {
    sm: spacing[3],   // 12px
    md: spacing[4],   // 16px
    lg: spacing[6],   // 24px
  },
  
  cardGap: {
    sm: spacing[3],   // 12px
    md: spacing[4],   // 16px
    lg: spacing[6],   // 24px
  },

  // Button spacing
  buttonPadding: {
    sm: {
      horizontal: spacing[3],  // 12px
      vertical: spacing[2],    // 8px
    },
    md: {
      horizontal: spacing[4],  // 16px
      vertical: spacing[3],    // 12px
    },
    lg: {
      horizontal: spacing[6],  // 24px
      vertical: spacing[4],    // 16px
    },
  },

  // List spacing
  listItemGap: spacing[2],      // 8px
  listSectionGap: spacing[4],   // 16px

  // Icon spacing
  iconGap: {
    sm: spacing[2],   // 8px
    md: spacing[3],   // 12px
    lg: spacing[4],   // 16px
  },

  // Touch targets (mobile-first)
  touchTarget: {
    minimum: spacing[11],  // 44px (iOS/Android minimum)
    comfortable: spacing[12], // 48px
  },

  // Safe areas and gutters
  safeArea: {
    top: spacing[3],     // 12px fallback
    bottom: spacing[3],  // 12px fallback
    left: spacing[4],    // 16px
    right: spacing[4],   // 16px
  },

  gutter: {
    mobile: spacing[4],   // 16px
    tablet: spacing[6],   // 24px
    desktop: spacing[8],  // 32px
  },
} as const;

// Breakpoint-aware spacing helpers
export const responsiveSpacing = {
  // Container max-widths
  container: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },
  
  // Grid gaps
  gridGap: {
    mobile: spacing[4],   // 16px
    tablet: spacing[6],   // 24px
    desktop: spacing[8],  // 32px
  },
  
  // Column gaps
  columnGap: {
    mobile: spacing[4],   // 16px
    tablet: spacing[6],   // 24px
    desktop: spacing[8],  // 32px
  },
} as const;