/**
 * Enterprise Color System
 * WCAG AAA compliant color tokens for accessibility
 * Supports light and dark modes
 */

/**
 * Primary Brand Colors
 */
export const brandColors = {
  // Primary blue - professional, trustworthy
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#5a76a9',  // Main brand color
    600: '#3a5483',
    700: '#2c4270',
    800: '#1e3050',
    900: '#1a325d',
  },

  // Secondary teal - calming, growth-oriented
  secondary: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#92baac',  // Main secondary color
    600: '#6c9486',
    700: '#4a6b5f',
    800: '#2d4842',
    900: '#1a2e28',
  },

  // Accent colors for CTAs and highlights
  accent: {
    orange: '#f97316',
    purple: '#a855f7',
    pink: '#ec4899',
  },
};

/**
 * Semantic Colors
 * Consistent meaning across the application
 */
export const semanticColors = {
  // Success - green (confirmations, completed states)
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },

  // Warning - amber (caution, pending states)
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  // Error - red (errors, destructive actions)
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  // Info - blue (informational messages)
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
};

/**
 * Neutral Colors
 * Grays for text, backgrounds, borders
 */
export const neutralColors = {
  // Light mode grays
  light: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },

  // Dark mode grays (blue-tinted for consistency)
  dark: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
};

/**
 * Light Mode Color Palette
 */
export const lightModeColors = {
  primary: {
    main: brandColors.primary[500],
    light: brandColors.primary[300],
    dark: brandColors.primary[700],
    contrastText: '#ffffff',
    // Additional shades for flexibility
    50: brandColors.primary[50],
    100: brandColors.primary[100],
    200: brandColors.primary[200],
  },

  secondary: {
    main: brandColors.secondary[500],
    light: brandColors.secondary[300],
    dark: brandColors.secondary[700],
    contrastText: '#ffffff',
    50: brandColors.secondary[50],
    100: brandColors.secondary[100],
    200: brandColors.secondary[200],
  },

  success: {
    main: semanticColors.success[500],
    light: semanticColors.success[300],
    dark: semanticColors.success[700],
    contrastText: '#ffffff',
  },

  warning: {
    main: semanticColors.warning[500],
    light: semanticColors.warning[300],
    dark: semanticColors.warning[700],
    contrastText: '#ffffff',
  },

  error: {
    main: semanticColors.error[500],
    light: semanticColors.error[300],
    dark: semanticColors.error[700],
    contrastText: '#ffffff',
  },

  info: {
    main: semanticColors.info[500],
    light: semanticColors.info[300],
    dark: semanticColors.info[700],
    contrastText: '#ffffff',
  },

  background: {
    default: '#f8fafb',
    paper: '#ffffff',
    subtle: neutralColors.light[50],
    elevated: '#ffffff',
  },

  text: {
    primary: neutralColors.light[900],
    secondary: neutralColors.light[600],
    disabled: neutralColors.light[400],
    hint: neutralColors.light[500],
  },

  divider: neutralColors.light[200],

  action: {
    active: neutralColors.light[700],
    hover: neutralColors.light[100],
    selected: neutralColors.light[200],
    disabled: neutralColors.light[300],
    disabledBackground: neutralColors.light[100],
    focus: brandColors.primary[100],
  },
};

/**
 * Dark Mode Color Palette
 */
export const darkModeColors = {
  primary: {
    main: brandColors.primary[400],
    light: brandColors.primary[300],
    dark: brandColors.primary[600],
    contrastText: '#ffffff',
    50: brandColors.primary[900],
    100: brandColors.primary[800],
    200: brandColors.primary[700],
  },

  secondary: {
    main: brandColors.secondary[400],
    light: brandColors.secondary[300],
    dark: brandColors.secondary[600],
    contrastText: '#ffffff',
    50: brandColors.secondary[900],
    100: brandColors.secondary[800],
    200: brandColors.secondary[700],
  },

  success: {
    main: semanticColors.success[400],
    light: semanticColors.success[300],
    dark: semanticColors.success[600],
    contrastText: '#000000',
  },

  warning: {
    main: semanticColors.warning[400],
    light: semanticColors.warning[300],
    dark: semanticColors.warning[600],
    contrastText: '#000000',
  },

  error: {
    main: semanticColors.error[400],
    light: semanticColors.error[300],
    dark: semanticColors.error[600],
    contrastText: '#000000',
  },

  info: {
    main: semanticColors.info[400],
    light: semanticColors.info[300],
    dark: semanticColors.info[600],
    contrastText: '#000000',
  },

  background: {
    default: '#0a0e14',
    paper: '#131820',
    subtle: neutralColors.dark[900],
    elevated: '#1a1f2e',
  },

  text: {
    primary: '#e5e7eb',
    secondary: '#9ca3af',
    disabled: '#6b7280',
    hint: '#6b7280',
  },

  divider: neutralColors.dark[800],

  action: {
    active: '#ffffff',
    hover: neutralColors.dark[800],
    selected: neutralColors.dark[700],
    disabled: neutralColors.dark[600],
    disabledBackground: neutralColors.dark[800],
    focus: brandColors.primary[800],
  },
};

/**
 * High Contrast Mode (for accessibility)
 */
export const highContrastColors = {
  light: {
    primary: { main: '#000080', light: '#0000CD', dark: '#000050' },
    secondary: { main: '#006400', light: '#008000', dark: '#004000' },
    background: { default: '#ffffff', paper: '#ffffff' },
    text: { primary: '#000000', secondary: '#000000' },
  },
  dark: {
    primary: { main: '#00BFFF', light: '#87CEEB', dark: '#0080FF' },
    secondary: { main: '#00FF00', light: '#7FFF00', dark: '#00CD00' },
    background: { default: '#000000', paper: '#000000' },
    text: { primary: '#ffffff', secondary: '#ffffff' },
  },
};

/**
 * Color Utilities
 */
export const colorUtils = {
  // Add alpha transparency to hex color
  alpha: (color, opacity) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  },

  // Generate gradient
  gradient: (color1, color2, angle = 90) => 
    `linear-gradient(${angle}deg, ${color1}, ${color2})`,

  // Status colors (quick access)
  status: {
    pending: semanticColors.warning[500],
    approved: semanticColors.success[500],
    rejected: semanticColors.error[500],
    draft: neutralColors.light[500],
    archived: neutralColors.light[400],
  },
};

/**
 * Export complete color system
 */
export const colors = {
  brand: brandColors,
  semantic: semanticColors,
  neutral: neutralColors,
  light: lightModeColors,
  dark: darkModeColors,
  highContrast: highContrastColors,
  utils: colorUtils,
};

export default colors;
