/**
 * Enhanced Theme Configuration
 * Integrates typography, colors, and spacing systems
 * 
 * Usage: Import this to enhance the existing DarkModeContext theme
 */

import { typography, fontFamilies } from './typography';
import { lightModeColors, darkModeColors } from './colors';
import { 
  borderRadius, 
  shadows, 
  darkShadows, 
  zIndex, 
  breakpoints,
  transitions,
} from './spacing';

/**
 * Component style overrides
 * Applies design system tokens to MUI components
 */
export const getComponentOverrides = (mode) => ({
  MuiCssBaseline: {
    styleOverrides: {
      html: {
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        boxSizing: 'border-box',
        height: '100%',
      },
      body: {
        height: '100%',
        margin: 0,
        padding: 0,
      },
      '#root': {
        height: '100%',
      },
      // Add custom scrollbar styling
      '*::-webkit-scrollbar': {
        width: '8px',
        height: '8px',
      },
      '*::-webkit-scrollbar-track': {
        background: mode === 'dark' ? '#1a1f2e' : '#f1f5f9',
      },
      '*::-webkit-scrollbar-thumb': {
        background: mode === 'dark' ? '#475569' : '#cbd5e1',
        borderRadius: '4px',
      },
      '*::-webkit-scrollbar-thumb:hover': {
        background: mode === 'dark' ? '#64748b' : '#94a3b8',
      },
    },
  },

  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 600,
        borderRadius: borderRadius.md,
        padding: '10px 20px',
        transition: transitions.create(['background-color', 'box-shadow', 'transform'], 'short'),
        '&:hover': {
          transform: 'translateY(-1px)',
        },
        '&:active': {
          transform: 'translateY(0)',
        },
      },
      contained: {
        boxShadow: shadows.sm,
        '&:hover': {
          boxShadow: shadows.md,
        },
      },
      sizeLarge: {
        padding: '12px 28px',
        fontSize: '1rem',
      },
      sizeSmall: {
        padding: '6px 16px',
        fontSize: '0.875rem',
      },
    },
  },

  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: borderRadius.lg,
        boxShadow: mode === 'dark' ? darkShadows.md : shadows.md,
        transition: transitions.create(['box-shadow', 'transform'], 'standard'),
        '&:hover': {
          boxShadow: mode === 'dark' ? darkShadows.lg : shadows.lg,
        },
      },
    },
  },

  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        borderRadius: borderRadius.lg,
      },
      elevation1: {
        boxShadow: mode === 'dark' ? darkShadows.sm : shadows.sm,
      },
      elevation2: {
        boxShadow: mode === 'dark' ? darkShadows.md : shadows.md,
      },
      elevation3: {
        boxShadow: mode === 'dark' ? darkShadows.lg : shadows.lg,
      },
      elevation4: {
        boxShadow: mode === 'dark' ? darkShadows.xl : shadows.xl,
      },
    },
  },

  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: borderRadius.md,
          transition: transitions.create(['border-color', 'box-shadow'], 'short'),
          '&:hover': {
            boxShadow: shadows.xs,
          },
          '&.Mui-focused': {
            boxShadow: shadows.sm,
          },
        },
      },
    },
  },

  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: borderRadius.full,
        fontWeight: 500,
      },
    },
  },

  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: borderRadius.xl,
        boxShadow: mode === 'dark' ? darkShadows['2xl'] : shadows['2xl'],
      },
    },
  },

  MuiDrawer: {
    styleOverrides: {
      paper: {
        borderRadius: 0,
        boxShadow: mode === 'dark' ? darkShadows.xl : shadows.xl,
      },
    },
  },

  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: shadows.sm,
        backdropFilter: 'blur(8px)',
      },
    },
  },

  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        borderRadius: borderRadius.md,
        fontSize: '0.875rem',
        padding: '8px 12px',
      },
    },
  },

  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: borderRadius.lg,
      },
      standardSuccess: {
        backgroundColor: mode === 'dark' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)',
      },
      standardWarning: {
        backgroundColor: mode === 'dark' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.1)',
      },
      standardError: {
        backgroundColor: mode === 'dark' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)',
      },
      standardInfo: {
        backgroundColor: mode === 'dark' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)',
      },
    },
  },

  MuiLinearProgress: {
    styleOverrides: {
      root: {
        borderRadius: borderRadius.full,
        height: 6,
      },
    },
  },

  MuiSkeleton: {
    styleOverrides: {
      root: {
        borderRadius: borderRadius.md,
      },
    },
  },
});

/**
 * Enhanced theme options
 * Merges design system with MUI theme
 */
export const getEnhancedThemeOptions = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light' ? lightModeColors : darkModeColors),
  },

  typography: {
    ...typography,
    fontFamily: fontFamilies.ui,
  },

  shape: {
    borderRadius: parseInt(borderRadius.lg),
  },

  spacing: 8, // Base spacing unit

  breakpoints: {
    values: breakpoints.values,
  },

  zIndex: {
    mobileStepper: zIndex.base,
    fab: zIndex.sticky,
    speedDial: zIndex.sticky,
    appBar: zIndex.sticky,
    drawer: zIndex.drawer,
    modal: zIndex.modal,
    snackbar: zIndex.notification,
    tooltip: zIndex.tooltip,
  },

  transitions: {
    duration: transitions.duration,
    easing: transitions.easing,
  },

  shadows: mode === 'dark' 
    ? Object.values(darkShadows) 
    : Object.values(shadows),

  components: getComponentOverrides(mode),
});

/**
 * Utility to merge enhanced theme with existing theme
 * Preserves backward compatibility
 */
export const mergeWithExistingTheme = (existingTheme, mode) => {
  const enhancedOptions = getEnhancedThemeOptions(mode);
  
  return {
    ...existingTheme,
    palette: {
      ...existingTheme.palette,
      ...enhancedOptions.palette,
    },
    typography: {
      ...existingTheme.typography,
      ...enhancedOptions.typography,
    },
    components: {
      ...existingTheme.components,
      ...enhancedOptions.components,
    },
    shadows: enhancedOptions.shadows,
    shape: enhancedOptions.shape,
    spacing: enhancedOptions.spacing,
    breakpoints: enhancedOptions.breakpoints,
    zIndex: {
      ...existingTheme.zIndex,
      ...enhancedOptions.zIndex,
    },
    transitions: enhancedOptions.transitions,
  };
};

export default getEnhancedThemeOptions;
