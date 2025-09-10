// Design tokens for responsive breakpoints
export const breakpoints = {
  // Mobile-first breakpoint values (in pixels)
  xs: 0,      // Extra small devices (phones, portrait)
  sm: 480,    // Small devices (phones, landscape)
  md: 768,    // Medium devices (tablets, portrait)
  lg: 1024,   // Large devices (tablets, landscape, small desktops)
  xl: 1280,   // Extra large devices (desktops)
  '2xl': 1536, // Extra extra large devices (large desktops)
} as const;

// Breakpoint aliases for easier usage
export const deviceBreakpoints = {
  mobile: breakpoints.xs,
  mobileLandscape: breakpoints.sm,
  tablet: breakpoints.md,
  tabletLandscape: breakpoints.lg,
  desktop: breakpoints.xl,
  desktopLarge: breakpoints['2xl'],
} as const;

// Media query helpers for web
export const mediaQueries = {
  // Mobile-first approach (min-width)
  xs: `@media (min-width: ${breakpoints.xs}px)`,
  sm: `@media (min-width: ${breakpoints.sm}px)`,
  md: `@media (min-width: ${breakpoints.md}px)`,
  lg: `@media (min-width: ${breakpoints.lg}px)`,
  xl: `@media (min-width: ${breakpoints.xl}px)`,
  '2xl': `@media (min-width: ${breakpoints['2xl']}px)`,
  
  // Max-width queries (desktop-first)
  'xs-down': `@media (max-width: ${breakpoints.sm - 1}px)`,
  'sm-down': `@media (max-width: ${breakpoints.md - 1}px)`,
  'md-down': `@media (max-width: ${breakpoints.lg - 1}px)`,
  'lg-down': `@media (max-width: ${breakpoints.xl - 1}px)`,
  'xl-down': `@media (max-width: ${breakpoints['2xl'] - 1}px)`,
  
  // Range queries
  'sm-md': `@media (min-width: ${breakpoints.sm}px) and (max-width: ${breakpoints.md - 1}px)`,
  'md-lg': `@media (min-width: ${breakpoints.md}px) and (max-width: ${breakpoints.lg - 1}px)`,
  'lg-xl': `@media (min-width: ${breakpoints.lg}px) and (max-width: ${breakpoints.xl - 1}px)`,
  
  // Device-specific queries
  mobile: `@media (max-width: ${breakpoints.md - 1}px)`,
  tablet: `@media (min-width: ${breakpoints.md}px) and (max-width: ${breakpoints.lg - 1}px)`,
  desktop: `@media (min-width: ${breakpoints.lg}px)`,
  
  // Orientation queries
  portrait: '@media (orientation: portrait)',
  landscape: '@media (orientation: landscape)',
  
  // High DPI displays
  retina: '@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',
  
  // Touch devices
  touch: '@media (hover: none) and (pointer: coarse)',
  mouse: '@media (hover: hover) and (pointer: fine)',
  
  // Reduced motion preference
  reducedMotion: '@media (prefers-reduced-motion: reduce)',
  
  // Color scheme preference
  darkMode: '@media (prefers-color-scheme: dark)',
  lightMode: '@media (prefers-color-scheme: light)',
  
  // Contrast preference
  highContrast: '@media (prefers-contrast: high)',
  
  // Safe area support (for notched devices)
  safeArea: '@supports (padding: max(0px))',
} as const;

// Container max-widths for different breakpoints
export const containerSizes = {
  xs: '100%',
  sm: '100%',
  md: 720,
  lg: 960,
  xl: 1140,
  '2xl': 1320,
} as const;

// Grid system breakpoints
export const gridBreakpoints = {
  // Number of columns for each breakpoint
  columns: {
    xs: 4,
    sm: 8,
    md: 8,
    lg: 12,
    xl: 12,
    '2xl': 12,
  },
  
  // Gutters (spacing between columns)
  gutters: {
    xs: 16,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 32,
    '2xl': 32,
  },
  
  // Margins (outer spacing)
  margins: {
    xs: 16,
    sm: 24,
    md: 32,
    lg: 40,
    xl: 48,
    '2xl': 56,
  },
} as const;