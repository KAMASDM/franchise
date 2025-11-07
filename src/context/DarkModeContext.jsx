import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

/**
 * Dark Mode Context and Provider
 * Manages theme state and persistence
 */

const DarkModeContext = createContext();

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within DarkModeProvider');
  }
  return context;
};

const STORAGE_KEY = 'theme_mode';

export const DarkModeProvider = ({ children }) => {
  // Initialize from localStorage or system preference
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  });

  // Save to localStorage when mode changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        setMode(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                // Light mode colors
                primary: {
                  main: '#5a76a9',
                  light: '#8ca3cc',
                  dark: '#3a5483',
                  contrastText: '#ffffff',
                },
                secondary: {
                  main: '#92baac',
                  light: '#a5cdbf',
                  dark: '#6c9486',
                },
                background: {
                  default: '#f5f7fa',
                  paper: '#ffffff',
                },
                text: {
                  primary: '#1a325d',
                  secondary: '#3a5483',
                },
                success: {
                  main: '#10b981',
                  light: '#34d399',
                  dark: '#059669',
                },
                warning: {
                  main: '#f59e0b',
                  light: '#fbbf24',
                  dark: '#d97706',
                },
                error: {
                  main: '#ef4444',
                  light: '#f87171',
                  dark: '#dc2626',
                },
                info: {
                  main: '#3b82f6',
                  light: '#60a5fa',
                  dark: '#2563eb',
                },
              }
            : {
                // Dark mode colors
                primary: {
                  main: '#8ca3cc',
                  light: '#a5b8dc',
                  dark: '#5a76a9',
                  contrastText: '#ffffff',
                },
                secondary: {
                  main: '#92baac',
                  light: '#a5cdbf',
                  dark: '#6c9486',
                },
                background: {
                  default: '#0f1419',
                  paper: '#1a1f2e',
                },
                text: {
                  primary: '#e5e7eb',
                  secondary: '#9ca3af',
                },
                success: {
                  main: '#10b981',
                  light: '#34d399',
                  dark: '#059669',
                },
                warning: {
                  main: '#f59e0b',
                  light: '#fbbf24',
                  dark: '#d97706',
                },
                error: {
                  main: '#ef4444',
                  light: '#f87171',
                  dark: '#dc2626',
                },
                info: {
                  main: '#3b82f6',
                  light: '#60a5fa',
                  dark: '#2563eb',
                },
              }),
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontWeight: 700,
          },
          h2: {
            fontWeight: 700,
          },
          h3: {
            fontWeight: 600,
          },
          h4: {
            fontWeight: 600,
          },
          h5: {
            fontWeight: 600,
          },
          h6: {
            fontWeight: 600,
          },
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                borderRadius: 8,
                fontWeight: 500,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                boxShadow: mode === 'dark' 
                  ? '0 4px 20px rgba(0, 0, 0, 0.3)'
                  : '0 4px 20px rgba(0, 0, 0, 0.08)',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
        },
      }),
    [mode]
  );

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newMode) => {
    if (newMode === 'light' || newMode === 'dark') {
      setMode(newMode);
    }
  };

  const value = {
    mode,
    toggleTheme,
    setTheme,
    isDark: mode === 'dark',
    isLight: mode === 'light',
  };

  return (
    <DarkModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </DarkModeContext.Provider>
  );
};

export default DarkModeProvider;
