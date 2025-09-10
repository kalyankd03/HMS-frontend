import { Dimensions } from 'react-native';
import { responsive } from '@hms/design-tokens/native';

const { width: screenWidth } = Dimensions.get('window');

/**
 * Get a responsive value based on screen width
 */
export const getResponsiveValue = <T>(values: {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
}): T | undefined => {
  return responsive.getValue(values, screenWidth);
};

/**
 * Get responsive padding for containers
 */
export const getResponsivePadding = (): number => {
  return responsive.spacing.container(screenWidth);
};

/**
 * Get responsive section spacing
 */
export const getResponsiveSectionSpacing = (): number => {
  return responsive.spacing.section(screenWidth);
};

/**
 * Get responsive font size for headings
 */
export const getResponsiveHeadingSize = (): number => {
  return responsive.fontSize.heading(screenWidth);
};

/**
 * Check if screen is considered mobile size
 */
export const isMobile = (): boolean => {
  return screenWidth < 768; // md breakpoint
};

/**
 * Check if screen is considered tablet size
 */
export const isTablet = (): boolean => {
  return screenWidth >= 768 && screenWidth < 1024; // md to lg breakpoint
};

/**
 * Check if screen is considered desktop size
 */
export const isDesktop = (): boolean => {
  return screenWidth >= 1024; // lg breakpoint and above
};