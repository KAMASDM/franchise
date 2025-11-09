/**
 * Enterprise Typography System
 * Professional font pairing with Inter (UI) + Playfair Display (Display)
 * 
 * Usage:
 * - Import into theme: import { typography } from './theme/typography';
 * - Use in components: <Typography variant="h1">...</Typography>
 */

/**
 * Font Loading Instructions:
 * Add to index.html <head>:
 * 
 * <link rel="preconnect" href="https://fonts.googleapis.com">
 * <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
 * <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700;800&display=swap" rel="stylesheet">
 */

// Base font stacks with fallbacks
export const fontFamilies = {
  // Primary UI font - clean, modern, highly legible
  ui: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  
  // Display font - elegant, professional for headings
  display: '"Playfair Display", Georgia, "Times New Roman", Times, serif',
  
  // Monospace for code/data
  mono: '"Fira Code", "Courier New", Courier, monospace',
};

// Font weights
export const fontWeights = {
  light: 300,
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
  extraBold: 800,
};

// Line heights for optimal readability
export const lineHeights = {
  tight: 1.2,    // Headings
  normal: 1.5,   // Body text
  relaxed: 1.75, // Long-form content
};

// Letter spacing
export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
};

/**
 * Complete Typography Scale
 * Follows 8px baseline grid with consistent vertical rhythm
 */
export const typography = {
  // Font families
  fontFamily: fontFamilies.ui,
  
  // Font smoothing for crisp rendering
  fontSmoothing: {
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  },

  // Display styles - large, attention-grabbing
  h1: {
    fontFamily: fontFamilies.display,
    fontSize: '3.5rem',      // 56px
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.tight,
    '@media (max-width:900px)': {
      fontSize: '2.75rem',   // 44px on tablet
    },
    '@media (max-width:600px)': {
      fontSize: '2.25rem',   // 36px on mobile
    },
  },

  h2: {
    fontFamily: fontFamilies.display,
    fontSize: '2.75rem',     // 44px
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.tight,
    '@media (max-width:900px)': {
      fontSize: '2.25rem',   // 36px on tablet
    },
    '@media (max-width:600px)': {
      fontSize: '1.875rem',  // 30px on mobile
    },
  },

  h3: {
    fontFamily: fontFamilies.display,
    fontSize: '2.125rem',    // 34px
    fontWeight: fontWeights.semiBold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.tight,
    '@media (max-width:900px)': {
      fontSize: '1.875rem',  // 30px on tablet
    },
    '@media (max-width:600px)': {
      fontSize: '1.5rem',    // 24px on mobile
    },
  },

  h4: {
    fontFamily: fontFamilies.ui,
    fontSize: '1.75rem',     // 28px
    fontWeight: fontWeights.semiBold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.normal,
    '@media (max-width:900px)': {
      fontSize: '1.5rem',    // 24px on tablet
    },
    '@media (max-width:600px)': {
      fontSize: '1.25rem',   // 20px on mobile
    },
  },

  h5: {
    fontFamily: fontFamilies.ui,
    fontSize: '1.375rem',    // 22px
    fontWeight: fontWeights.semiBold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.normal,
    '@media (max-width:600px)': {
      fontSize: '1.125rem',  // 18px on mobile
    },
  },

  h6: {
    fontFamily: fontFamilies.ui,
    fontSize: '1.125rem',    // 18px
    fontWeight: fontWeights.semiBold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.wide,
    '@media (max-width:600px)': {
      fontSize: '1rem',      // 16px on mobile
    },
  },

  // Subtitles and leads
  subtitle1: {
    fontFamily: fontFamilies.ui,
    fontSize: '1.125rem',    // 18px
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },

  subtitle2: {
    fontFamily: fontFamilies.ui,
    fontSize: '1rem',        // 16px
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.wide,
  },

  // Body text
  body1: {
    fontFamily: fontFamilies.ui,
    fontSize: '1rem',        // 16px
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },

  body2: {
    fontFamily: fontFamilies.ui,
    fontSize: '0.875rem',    // 14px
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },

  // Button text
  button: {
    fontFamily: fontFamilies.ui,
    fontSize: '0.9375rem',   // 15px
    fontWeight: fontWeights.semiBold,
    lineHeight: 1.75,
    letterSpacing: letterSpacing.wide,
    textTransform: 'none',   // Override MUI default
  },

  // Caption and helper text
  caption: {
    fontFamily: fontFamilies.ui,
    fontSize: '0.75rem',     // 12px
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.wide,
  },

  // Overline for labels
  overline: {
    fontFamily: fontFamilies.ui,
    fontSize: '0.75rem',     // 12px
    fontWeight: fontWeights.semiBold,
    lineHeight: 2,
    letterSpacing: letterSpacing.widest,
    textTransform: 'uppercase',
  },
};

/**
 * Custom typography variants for specific use cases
 */
export const customTypography = {
  // Large display text (hero sections)
  displayLarge: {
    fontFamily: fontFamilies.display,
    fontSize: '4.5rem',      // 72px
    fontWeight: fontWeights.bold,
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
    '@media (max-width:900px)': {
      fontSize: '3.5rem',
    },
    '@media (max-width:600px)': {
      fontSize: '2.5rem',
    },
  },

  // Lead paragraph
  lead: {
    fontFamily: fontFamilies.ui,
    fontSize: '1.25rem',     // 20px
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.relaxed,
    letterSpacing: letterSpacing.normal,
  },

  // Small text
  small: {
    fontFamily: fontFamilies.ui,
    fontSize: '0.8125rem',   // 13px
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.normal,
  },

  // Tiny text
  tiny: {
    fontFamily: fontFamilies.ui,
    fontSize: '0.6875rem',   // 11px
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.normal,
  },
};

/**
 * Typography utilities
 */
export const typographyUtils = {
  // Truncate text with ellipsis
  truncate: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  // Clamp text to N lines
  lineClamp: (lines = 2) => ({
    display: '-webkit-box',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  }),

  // Gradient text effect
  gradientText: (gradient = 'linear-gradient(90deg, #5a76a9 0%, #92baac 100%)') => ({
    background: gradient,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  }),
};

export default typography;
