// Web-specific design token exports (CSS-optimized)
import { theme } from './index';

// CSS custom properties for web usage
export const cssVariables = {
  // Colors
  '--color-primary': theme.colors.semantic.primary,
  '--color-secondary': theme.colors.semantic.secondary,
  '--color-success': theme.colors.semantic.success,
  '--color-error': theme.colors.semantic.error,
  '--color-warning': theme.colors.semantic.warning,
  '--color-background': theme.colors.semantic.background,
  '--color-surface': theme.colors.semantic.surface,
  '--color-text': theme.colors.semantic.text,
  '--color-text-muted': theme.colors.semantic.textMuted,
  '--color-border': theme.colors.semantic.border,
  '--color-border-focus': theme.colors.semantic.borderFocus,

  // Typography
  '--font-family-sans': theme.typography.fontFamily.sans.join(', '),
  '--font-family-mono': theme.typography.fontFamily.mono.join(', '),
  '--font-size-base': `${theme.typography.fontSize.base}px`,
  '--line-height-normal': theme.typography.lineHeight.normal,

  // Spacing
  '--spacing-xs': `${theme.spacing.semantic.componentPadding.xs}px`,
  '--spacing-sm': `${theme.spacing.semantic.componentPadding.sm}px`,
  '--spacing-md': `${theme.spacing.semantic.componentPadding.md}px`,
  '--spacing-lg': `${theme.spacing.semantic.componentPadding.lg}px`,
  '--spacing-xl': `${theme.spacing.semantic.componentPadding.xl}px`,

  // Shadows
  '--shadow-xs': theme.shadows.web.xs,
  '--shadow-sm': theme.shadows.web.sm,
  '--shadow-md': theme.shadows.web.md,
  '--shadow-lg': theme.shadows.web.lg,
  '--shadow-xl': theme.shadows.web.xl,
  '--shadow-2xl': theme.shadows.web['2xl'],

  // Borders
  '--border-radius-sm': `${theme.borders.radius.sm}px`,
  '--border-radius-md': `${theme.borders.radius.md}px`,
  '--border-radius-lg': `${theme.borders.radius.lg}px`,
  '--border-radius-xl': `${theme.borders.radius.xl}px`,
  '--border-width': `${theme.borders.width.thin}px`,

  // Breakpoints
  '--breakpoint-sm': `${theme.breakpoints.sm}px`,
  '--breakpoint-md': `${theme.breakpoints.md}px`,
  '--breakpoint-lg': `${theme.breakpoints.lg}px`,
  '--breakpoint-xl': `${theme.breakpoints.xl}px`,
  '--breakpoint-2xl': `${theme.breakpoints['2xl']}px`,
} as const;

// Generate CSS string for injecting variables
export const generateCssVariables = (): string => {
  const entries = Object.entries(cssVariables);
  return `:root {\n${entries.map(([key, value]) => `  ${key}: ${value};`).join('\n')}\n}`;
};

// Tailwind CSS configuration object
export const tailwindConfig = {
  theme: {
    colors: {
      primary: {
        50: theme.colors.primary[50],
        100: theme.colors.primary[100],
        200: theme.colors.primary[200],
        300: theme.colors.primary[300],
        400: theme.colors.primary[400],
        500: theme.colors.primary[500],
        600: theme.colors.primary[600],
        700: theme.colors.primary[700],
        800: theme.colors.primary[800],
        900: theme.colors.primary[900],
        950: theme.colors.primary[950],
      },
      secondary: theme.colors.secondary,
      success: theme.colors.success,
      error: theme.colors.error,
      warning: theme.colors.warning,
      gray: theme.colors.gray,
    },
    fontFamily: {
      sans: theme.typography.fontFamily.sans,
      mono: theme.typography.fontFamily.mono,
    },
    fontSize: {
      xs: [`${theme.typography.fontSize.xs}px`, theme.typography.lineHeight.normal],
      sm: [`${theme.typography.fontSize.sm}px`, theme.typography.lineHeight.normal],
      base: [`${theme.typography.fontSize.base}px`, theme.typography.lineHeight.normal],
      lg: [`${theme.typography.fontSize.lg}px`, theme.typography.lineHeight.normal],
      xl: [`${theme.typography.fontSize.xl}px`, theme.typography.lineHeight.normal],
      '2xl': [`${theme.typography.fontSize['2xl']}px`, theme.typography.lineHeight.tight],
      '3xl': [`${theme.typography.fontSize['3xl']}px`, theme.typography.lineHeight.tight],
      '4xl': [`${theme.typography.fontSize['4xl']}px`, theme.typography.lineHeight.tight],
      '5xl': [`${theme.typography.fontSize['5xl']}px`, theme.typography.lineHeight.none],
      '6xl': [`${theme.typography.fontSize['6xl']}px`, theme.typography.lineHeight.none],
      '7xl': [`${theme.typography.fontSize['7xl']}px`, theme.typography.lineHeight.none],
      '8xl': [`${theme.typography.fontSize['8xl']}px`, theme.typography.lineHeight.none],
      '9xl': [`${theme.typography.fontSize['9xl']}px`, theme.typography.lineHeight.none],
    },
    spacing: Object.fromEntries(
      Object.entries(theme.spacing).map(([key, value]) => [key, `${value}px`])
    ),
    borderRadius: Object.fromEntries(
      Object.entries(theme.borders.radius).map(([key, value]) => [
        key,
        key === 'full' ? '9999px' : `${value}px`
      ])
    ),
    boxShadow: {
      xs: theme.shadows.web.xs,
      sm: theme.shadows.web.sm,
      DEFAULT: theme.shadows.web.md,
      md: theme.shadows.web.md,
      lg: theme.shadows.web.lg,
      xl: theme.shadows.web.xl,
      '2xl': theme.shadows.web['2xl'],
      inner: theme.shadows.web.inner,
      none: 'none',
    },
    screens: {
      xs: `${theme.breakpoints.xs}px`,
      sm: `${theme.breakpoints.sm}px`,
      md: `${theme.breakpoints.md}px`,
      lg: `${theme.breakpoints.lg}px`,
      xl: `${theme.breakpoints.xl}px`,
      '2xl': `${theme.breakpoints['2xl']}px`,
    },
  },
};

// Export all web-specific tokens
export { theme };
export * from './index';