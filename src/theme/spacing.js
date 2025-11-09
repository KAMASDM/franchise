/**
 * Enterprise Spacing System
 * 8px baseline grid for consistent vertical rhythm
 */

/**
 * Base spacing unit (8px)
 * All spacing should be multiples of this base
 */
const BASE_UNIT = 8;

/**
 * Spacing scale
 * Use these tokens instead of hardcoded pixel values
 */
export const spacing = {
  0: 0,
  0.5: BASE_UNIT * 0.5,   // 4px
  1: BASE_UNIT,            // 8px
  1.5: BASE_UNIT * 1.5,    // 12px
  2: BASE_UNIT * 2,        // 16px
  2.5: BASE_UNIT * 2.5,    // 20px
  3: BASE_UNIT * 3,        // 24px
  3.5: BASE_UNIT * 3.5,    // 28px
  4: BASE_UNIT * 4,        // 32px
  5: BASE_UNIT * 5,        // 40px
  6: BASE_UNIT * 6,        // 48px
  7: BASE_UNIT * 7,        // 56px
  8: BASE_UNIT * 8,        // 64px
  9: BASE_UNIT * 9,        // 72px
  10: BASE_UNIT * 10,      // 80px
  12: BASE_UNIT * 12,      // 96px
  14: BASE_UNIT * 14,      // 112px
  16: BASE_UNIT * 16,      // 128px
  20: BASE_UNIT * 20,      // 160px
  24: BASE_UNIT * 24,      // 192px
  32: BASE_UNIT * 32,      // 256px
};

/**
 * Semantic spacing tokens
 * Use these for specific contexts
 */
export const semanticSpacing = {
  // Component internal spacing
  componentPadding: {
    small: spacing[2],       // 16px
    medium: spacing[3],      // 24px
    large: spacing[4],       // 32px
  },

  // Gap between elements
  gap: {
    xs: spacing[1],          // 8px
    sm: spacing[2],          // 16px
    md: spacing[3],          // 24px
    lg: spacing[4],          // 32px
    xl: spacing[6],          // 48px
  },

  // Section spacing (vertical rhythm)
  section: {
    small: spacing[8],       // 64px
    medium: spacing[12],     // 96px
    large: spacing[16],      // 128px
    xlarge: spacing[20],     // 160px
  },

  // Container padding
  container: {
    mobile: spacing[2],      // 16px
    tablet: spacing[3],      // 24px
    desktop: spacing[4],     // 32px
  },

  // Card spacing
  card: {
    padding: spacing[3],     // 24px
    gap: spacing[2],         // 16px
  },

  // Form spacing
  form: {
    fieldGap: spacing[3],    // 24px
    labelGap: spacing[1],    // 8px
    sectionGap: spacing[6],  // 48px
  },
};

/**
 * Border Radius System
 */
export const borderRadius = {
  none: 0,
  xs: '2px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  '3xl': '32px',
  full: '9999px',   // Perfect circle/pill
};

/**
 * Semantic border radius
 */
export const semanticBorderRadius = {
  button: borderRadius.md,
  card: borderRadius.lg,
  input: borderRadius.md,
  dialog: borderRadius.xl,
  image: borderRadius.lg,
  badge: borderRadius.full,
  chip: borderRadius.full,
};

/**
 * Elevation/Shadow System
 * Following Material Design principles with custom values
 */
export const shadows = {
  none: 'none',
  
  // Subtle shadows for slight elevation
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  
  // Default shadow for cards and elevated elements
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  
  // Prominent shadows for modals and popovers
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  
  // Maximum elevation for overlays
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  
  // Inner shadow for inset elements
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  
  // Colored shadows for emphasis
  primary: '0 10px 25px -5px rgba(90, 118, 169, 0.3)',
  secondary: '0 10px 25px -5px rgba(146, 186, 172, 0.3)',
  success: '0 10px 25px -5px rgba(16, 185, 129, 0.3)',
  error: '0 10px 25px -5px rgba(239, 68, 68, 0.3)',
};

/**
 * Dark mode shadows (lighter for contrast)
 */
export const darkShadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.4)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.5)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -4px rgba(0, 0, 0, 0.6)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 8px 10px -6px rgba(0, 0, 0, 0.7)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
  primary: '0 10px 25px -5px rgba(90, 118, 169, 0.6)',
  secondary: '0 10px 25px -5px rgba(146, 186, 172, 0.6)',
  success: '0 10px 25px -5px rgba(16, 185, 129, 0.6)',
  error: '0 10px 25px -5px rgba(239, 68, 68, 0.6)',
};

/**
 * Z-Index Scale
 * Consistent layering across the application
 */
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  backdrop: 1040,
  drawer: 1200,
  modal: 1300,
  popover: 1400,
  tooltip: 1500,
  notification: 1600,
  max: 9999,
};

/**
 * Breakpoints
 * Responsive design system
 */
export const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
    xxl: 1920,
  },
  
  // Helper functions
  up: (key) => `@media (min-width:${breakpoints.values[key]}px)`,
  down: (key) => `@media (max-width:${breakpoints.values[key] - 0.05}px)`,
  between: (min, max) => 
    `@media (min-width:${breakpoints.values[min]}px) and (max-width:${breakpoints.values[max] - 0.05}px)`,
};

/**
 * Container Max Widths
 */
export const containerMaxWidth = {
  xs: '100%',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  xxl: '1536px',
};

/**
 * Transitions
 * Consistent animation timings
 */
export const transitions = {
  duration: {
    shortest: 150,
    shorter: 200,
    short: 250,
    standard: 300,
    complex: 375,
    enteringScreen: 225,
    leavingScreen: 195,
  },
  
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },
  
  // Pre-built transition strings
  create: (property = 'all', duration = 'standard', easing = 'easeInOut') => {
    const durationValue = transitions.duration[duration] || duration;
    const easingValue = transitions.easing[easing] || easing;
    return `${property} ${durationValue}ms ${easingValue}`;
  },
};

/**
 * Layout utilities
 */
export const layout = {
  // Common widths
  sidebar: {
    collapsed: '64px',
    expanded: '240px',
  },
  
  header: {
    mobile: '56px',
    desktop: '64px',
  },
  
  footer: {
    mobile: '200px',
    desktop: '300px',
  },
  
  // Content spacing
  maxContentWidth: '1440px',
  readingWidth: '720px',
};

/**
 * Export complete spacing system
 */
export default {
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
  layout,
};
