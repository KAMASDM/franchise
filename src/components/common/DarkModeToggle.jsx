import React from 'react';
import {
  IconButton,
  Tooltip,
  useTheme,
  Switch,
  FormControlLabel,
  Box,
  Typography,
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  DarkMode,
  LightMode,
} from '@mui/icons-material';
import { useDarkMode } from '../../context/DarkModeContext';

/**
 * Dark Mode Toggle Components
 * Various UI patterns for switching between light and dark themes
 */

export const DarkModeToggleIcon = () => {
  const { mode, toggleTheme } = useDarkMode();
  const theme = useTheme();

  return (
    <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
      <IconButton
        onClick={toggleTheme}
        color="inherit"
        aria-label="toggle theme"
      >
        {mode === 'dark' ? <LightMode /> : <DarkMode />}
      </IconButton>
    </Tooltip>
  );
};

export const DarkModeToggleSwitch = ({ showLabel = true }) => {
  const { mode, toggleTheme, isDark } = useDarkMode();

  if (!showLabel) {
    return (
      <Switch
        checked={isDark}
        onChange={toggleTheme}
        icon={<Brightness7 />}
        checkedIcon={<Brightness4 />}
        aria-label="toggle theme"
      />
    );
  }

  return (
    <FormControlLabel
      control={
        <Switch
          checked={isDark}
          onChange={toggleTheme}
          icon={<Brightness7 />}
          checkedIcon={<Brightness4 />}
        />
      }
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isDark ? <DarkMode /> : <LightMode />}
          <Typography variant="body2">
            {isDark ? 'Dark' : 'Light'} Mode
          </Typography>
        </Box>
      }
    />
  );
};

export const DarkModeMenu = () => {
  const { mode, setTheme } = useDarkMode();

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Theme Preference
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
        <Box
          onClick={() => setTheme('light')}
          sx={{
            flex: 1,
            p: 2,
            borderRadius: 2,
            border: '2px solid',
            borderColor: mode === 'light' ? 'primary.main' : 'divider',
            cursor: 'pointer',
            textAlign: 'center',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'action.hover',
            },
          }}
        >
          <LightMode sx={{ fontSize: 32, mb: 1 }} />
          <Typography variant="body2">Light</Typography>
        </Box>

        <Box
          onClick={() => setTheme('dark')}
          sx={{
            flex: 1,
            p: 2,
            borderRadius: 2,
            border: '2px solid',
            borderColor: mode === 'dark' ? 'primary.main' : 'divider',
            cursor: 'pointer',
            textAlign: 'center',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'action.hover',
            },
          }}
        >
          <DarkMode sx={{ fontSize: 32, mb: 1 }} />
          <Typography variant="body2">Dark</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default DarkModeToggleIcon;
