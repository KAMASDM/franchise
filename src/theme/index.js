/**
 * Design System Export
 * Central hub for all design tokens
 * 
 * Usage:
 * import { typography, colors, spacing } from '@/theme';
 * import { useTheme } from '@/theme';
 */

// Export all design tokens
export { typography, fontFamilies, fontWeights, lineHeights, customTypography, typographyUtils } from './typography';
export { colors, brandColors, semanticColors, neutralColors, lightModeColors, darkModeColors, colorUtils } from './colors';
export { 
  spacing, 
  semanticSpacing, 
  borderRadius, 
  semanticBorderRadius, 
  shadows, 
  darkShadows, 
  zIndex, 
  breakpoints, 
  containerMaxWidth, 
  transitions,
  layout 
} from './spacing';

// Export theme configuration
export { getEnhancedThemeOptions, getComponentOverrides, mergeWithExistingTheme } from './themeConfig';

// Default export with all design tokens
export default {
  typography,
  colors,
  spacing,
  borderRadius,
  shadows,
  zIndex,
  breakpoints,
  transitions,
};
