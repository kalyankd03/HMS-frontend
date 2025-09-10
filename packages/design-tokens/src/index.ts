// Main design tokens export
export * from './colors';
export * from './typography';
export * from './spacing';
export * from './shadows';
export * from './borders';
export * from './breakpoints';

// Create a unified theme object
import { colors, semanticColors } from './colors';
import { typography } from './typography';
import { spacing, semanticSpacing, responsiveSpacing } from './spacing';
import { shadows, webShadows, componentShadows } from './shadows';
import { borders, semanticBorders } from './borders';
import { breakpoints, deviceBreakpoints, mediaQueries, containerSizes, gridBreakpoints } from './breakpoints';

export const theme = {
  colors: {
    ...colors,
    semantic: semanticColors,
  },
  typography,
  spacing: {
    ...spacing,
    semantic: semanticSpacing,
    responsive: responsiveSpacing,
  },
  shadows: {
    ...shadows,
    web: webShadows,
    component: componentShadows,
  },
  borders: {
    ...borders,
    semantic: semanticBorders,
  },
  breakpoints: {
    ...breakpoints,
    device: deviceBreakpoints,
    media: mediaQueries,
    container: containerSizes,
    grid: gridBreakpoints,
  },
} as const;

// Export individual token categories for tree-shaking
export {
  colors,
  semanticColors,
  typography,
  spacing,
  semanticSpacing,
  responsiveSpacing,
  shadows,
  webShadows,
  componentShadows,
  borders,
  semanticBorders,
  breakpoints,
  deviceBreakpoints,
  mediaQueries,
  containerSizes,
  gridBreakpoints,
};

// Default theme export
export default theme;