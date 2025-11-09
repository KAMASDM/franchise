import React from 'react';
import { IconButton, Tooltip, Box } from '@mui/material';
import { Contrast as ContrastIcon } from '@mui/icons-material';
import { useHighContrast } from '../../context/HighContrastContext';

const HighContrastToggle = ({ sx }) => {
  const { isHighContrast, toggleHighContrast } = useHighContrast();

  return (
    <Tooltip 
      title={isHighContrast ? "Disable High Contrast Mode" : "Enable High Contrast Mode"}
      arrow
    >
      <IconButton
        onClick={toggleHighContrast}
        color={isHighContrast ? "primary" : "default"}
        aria-label={isHighContrast ? "Disable high contrast mode" : "Enable high contrast mode"}
        aria-pressed={isHighContrast}
        sx={{
          ...sx,
          border: isHighContrast ? '2px solid' : 'none',
          borderColor: 'primary.main'
        }}
      >
        <ContrastIcon />
      </IconButton>
    </Tooltip>
  );
};

export default HighContrastToggle;
