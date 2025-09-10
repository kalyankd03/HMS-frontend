// React Native-specific design token exports
import { theme } from './index';

// React Native StyleSheet-compatible theme
export const nativeTheme = {
  colors: theme.colors,
  typography: theme.typography,
  spacing: theme.spacing,
  shadows: theme.shadows,
  borders: theme.borders,
  breakpoints: theme.breakpoints,
};

// Pre-built style objects for common use cases (StyleSheet.create should be called by the consuming app)
export const commonStyles = {
  // Layout styles
  container: {
    flex: 1,
    backgroundColor: theme.colors.semantic.background,
  },
  
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  column: {
    flexDirection: 'column',
  },
  
  // Text styles
  h1: {
    fontSize: theme.typography.textStyles.h1.fontSize,
    fontWeight: theme.typography.textStyles.h1.fontWeight,
    lineHeight: theme.typography.textStyles.h1.lineHeight * theme.typography.textStyles.h1.fontSize,
    color: theme.colors.semantic.text,
  },
  
  h2: {
    fontSize: theme.typography.textStyles.h2.fontSize,
    fontWeight: theme.typography.textStyles.h2.fontWeight,
    lineHeight: theme.typography.textStyles.h2.lineHeight * theme.typography.textStyles.h2.fontSize,
    color: theme.colors.semantic.text,
  },
  
  h3: {
    fontSize: theme.typography.textStyles.h3.fontSize,
    fontWeight: theme.typography.textStyles.h3.fontWeight,
    lineHeight: theme.typography.textStyles.h3.lineHeight * theme.typography.textStyles.h3.fontSize,
    color: theme.colors.semantic.text,
  },
  
  body: {
    fontSize: theme.typography.textStyles.body.fontSize,
    fontWeight: theme.typography.textStyles.body.fontWeight,
    lineHeight: theme.typography.textStyles.body.lineHeight * theme.typography.textStyles.body.fontSize,
    color: theme.colors.semantic.text,
  },
  
  bodySmall: {
    fontSize: theme.typography.textStyles.bodySmall.fontSize,
    fontWeight: theme.typography.textStyles.bodySmall.fontWeight,
    lineHeight: theme.typography.textStyles.bodySmall.lineHeight * theme.typography.textStyles.bodySmall.fontSize,
    color: theme.colors.semantic.textMuted,
  },
  
  caption: {
    fontSize: theme.typography.textStyles.caption.fontSize,
    fontWeight: theme.typography.textStyles.caption.fontWeight,
    lineHeight: theme.typography.textStyles.caption.lineHeight * theme.typography.textStyles.caption.fontSize,
    color: theme.colors.semantic.textMuted,
  },
  
  // Button styles
  button: {
    paddingHorizontal: theme.spacing.semantic.buttonPadding.md.horizontal,
    paddingVertical: theme.spacing.semantic.buttonPadding.md.vertical,
    borderRadius: theme.borders.radius.md,
    minHeight: theme.spacing.semantic.touchTarget.minimum,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  buttonPrimary: {
    backgroundColor: theme.colors.semantic.primary,
  },
  
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: theme.borders.width.thin,
    borderColor: theme.colors.semantic.border,
  },
  
  buttonText: {
    fontSize: theme.typography.textStyles.button.fontSize,
    fontWeight: theme.typography.textStyles.button.fontWeight,
    color: theme.colors.semantic.text,
  },
  
  buttonTextPrimary: {
    color: theme.colors.semantic.background,
  },
  
  // Input styles
  input: {
    paddingHorizontal: theme.spacing.semantic.componentPadding.md,
    paddingVertical: theme.spacing.semantic.componentPadding.sm,
    borderWidth: theme.borders.width.thin,
    borderColor: theme.colors.semantic.border,
    borderRadius: theme.borders.radius.md,
    backgroundColor: theme.colors.semantic.background,
    fontSize: theme.typography.textStyles.input.fontSize,
    color: theme.colors.semantic.text,
    minHeight: theme.spacing.semantic.touchTarget.minimum,
  },
  
  inputFocused: {
    borderColor: theme.colors.semantic.borderFocus,
    borderWidth: theme.borders.width.medium,
  },
  
  inputError: {
    borderColor: theme.colors.semantic.error,
  },
  
  // Card styles
  card: {
    backgroundColor: theme.colors.semantic.background,
    borderRadius: theme.borders.radius.lg,
    padding: theme.spacing.semantic.cardPadding.md,
    ...theme.shadows.component.card,
  },
  
  cardSmall: {
    backgroundColor: theme.colors.semantic.background,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.semantic.cardPadding.sm,
    ...theme.shadows.component.card,
  },
  
  // List styles
  listItem: {
    paddingHorizontal: theme.spacing.semantic.componentPadding.md,
    paddingVertical: theme.spacing.semantic.componentPadding.sm,
    minHeight: theme.spacing.semantic.touchTarget.minimum,
    justifyContent: 'center',
  },
  
  listItemBorder: {
    borderBottomWidth: theme.borders.width.thin,
    borderBottomColor: theme.colors.semantic.border,
  },
  
  // Safe area styles
  safeArea: {
    paddingTop: theme.spacing.semantic.safeArea.top,
    paddingBottom: theme.spacing.semantic.safeArea.bottom,
    paddingLeft: theme.spacing.semantic.safeArea.left,
    paddingRight: theme.spacing.semantic.safeArea.right,
  },
  
  // Medical/Healthcare specific styles
  patientCard: {
    backgroundColor: theme.colors.semantic.background,
    borderRadius: theme.borders.radius.lg,
    padding: theme.spacing.semantic.cardPadding.md,
    borderLeftWidth: theme.borders.width.thick,
    borderLeftColor: theme.colors.semantic.primary,
    ...theme.shadows.component.patientCard,
  },
  
  emergencyCard: {
    backgroundColor: theme.colors.error[50],
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.semantic.cardPadding.md,
    borderWidth: theme.borders.width.medium,
    borderColor: theme.colors.semantic.error,
  },
  
  statusBadge: {
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borders.radius.full,
    minWidth: theme.spacing[16],
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  statusBadgeActive: {
    backgroundColor: theme.colors.success[100],
  },
  
  statusBadgeInactive: {
    backgroundColor: theme.colors.gray[100],
  },
  
  statusBadgeCritical: {
    backgroundColor: theme.colors.error[100],
  },
};

// Helper functions for responsive design
export const responsive = {
  // Get value based on screen width
  getValue: (values: { xs?: any; sm?: any; md?: any; lg?: any; xl?: any; '2xl'?: any }, width: number) => {
    if (width >= theme.breakpoints['2xl'] && values['2xl'] !== undefined) return values['2xl'];
    if (width >= theme.breakpoints.xl && values.xl !== undefined) return values.xl;
    if (width >= theme.breakpoints.lg && values.lg !== undefined) return values.lg;
    if (width >= theme.breakpoints.md && values.md !== undefined) return values.md;
    if (width >= theme.breakpoints.sm && values.sm !== undefined) return values.sm;
    return values.xs;
  },
  
  // Common responsive spacing
  spacing: {
    container: (width: number) => responsive.getValue({
      xs: theme.spacing.semantic.containerPadding.mobile,
      md: theme.spacing.semantic.containerPadding.tablet,
      lg: theme.spacing.semantic.containerPadding.desktop,
    }, width),
    
    section: (width: number) => responsive.getValue({
      xs: theme.spacing.semantic.sectionSpacing.xs,
      sm: theme.spacing.semantic.sectionSpacing.sm,
      md: theme.spacing.semantic.sectionSpacing.md,
      lg: theme.spacing.semantic.sectionSpacing.lg,
    }, width),
  },
  
  // Common responsive typography
  fontSize: {
    heading: (width: number) => responsive.getValue({
      xs: theme.typography.fontSize['2xl'],
      sm: theme.typography.fontSize['3xl'],
      md: theme.typography.fontSize['4xl'],
      lg: theme.typography.fontSize['5xl'],
    }, width),
  },
};

// Export the theme and utilities
export { theme };
export * from './index';