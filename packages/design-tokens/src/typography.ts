// Design tokens for typography
export const typography = {
  // Font families
  fontFamily: {
    sans: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
    ],
    mono: [
      'SF Mono',
      'Monaco',
      'Inconsolata',
      'Roboto Mono',
      'Consolas',
      'monospace',
    ],
  },

  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
    '7xl': 72,
    '8xl': 96,
    '9xl': 128,
  },

  // Font weights
  fontWeight: {
    thin: 100,
    extralight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },

  // Line heights
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Letter spacing
  letterSpacing: {
    tighter: -0.05,
    tight: -0.025,
    normal: 0,
    wide: 0.025,
    wider: 0.05,
    widest: 0.1,
  },

  // Text styles for common use cases
  textStyles: {
    // Headings
    h1: {
      fontSize: 48,
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: -0.025,
    },
    h2: {
      fontSize: 36,
      fontWeight: 600,
      lineHeight: 1.25,
      letterSpacing: -0.025,
    },
    h3: {
      fontSize: 30,
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: 0,
    },
    h4: {
      fontSize: 24,
      fontWeight: 600,
      lineHeight: 1.35,
      letterSpacing: 0,
    },
    h5: {
      fontSize: 20,
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: 0,
    },
    h6: {
      fontSize: 18,
      fontWeight: 500,
      lineHeight: 1.45,
      letterSpacing: 0,
    },

    // Body text
    body: {
      fontSize: 16,
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: 0,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: 400,
      lineHeight: 1.45,
      letterSpacing: 0,
    },
    bodyLarge: {
      fontSize: 18,
      fontWeight: 400,
      lineHeight: 1.55,
      letterSpacing: 0,
    },

    // UI elements
    button: {
      fontSize: 16,
      fontWeight: 500,
      lineHeight: 1.25,
      letterSpacing: 0,
    },
    buttonSmall: {
      fontSize: 14,
      fontWeight: 500,
      lineHeight: 1.25,
      letterSpacing: 0,
    },
    buttonLarge: {
      fontSize: 18,
      fontWeight: 500,
      lineHeight: 1.25,
      letterSpacing: 0,
    },

    // Form elements
    label: {
      fontSize: 14,
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: 0,
    },
    input: {
      fontSize: 16,
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: 0,
    },
    placeholder: {
      fontSize: 16,
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: 0,
    },

    // Captions and small text
    caption: {
      fontSize: 12,
      fontWeight: 400,
      lineHeight: 1.35,
      letterSpacing: 0.025,
    },
    overline: {
      fontSize: 12,
      fontWeight: 500,
      lineHeight: 1.35,
      letterSpacing: 0.1,
      textTransform: 'uppercase' as const,
    },

    // Code and monospace
    code: {
      fontSize: 14,
      fontWeight: 400,
      lineHeight: 1.45,
      letterSpacing: 0,
    },
    codeSmall: {
      fontSize: 12,
      fontWeight: 400,
      lineHeight: 1.4,
      letterSpacing: 0,
    },
  },
} as const;