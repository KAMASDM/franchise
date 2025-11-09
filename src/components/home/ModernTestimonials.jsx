/**
 * Modern Testimonials Section
 * Enterprise-level design with enhanced visuals and interactions
 * Content to be redesigned later
 */

import React from 'react';
import {
  Box,
  useTheme,
  alpha,
} from '@mui/material';

/**
 * Main Testimonials Section
 */
const ModernTestimonials = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden',
        background: theme.palette.mode === 'dark'
          ? `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${alpha(
              theme.palette.primary.dark,
              0.1
            )} 100%)`
          : `linear-gradient(180deg, ${alpha(theme.palette.primary.light, 0.03)} 0%, ${
              theme.palette.background.default
            } 50%, ${alpha(theme.palette.secondary.light, 0.03)} 100%)`,
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '40%',
          height: '100%',
          opacity: 0.05,
          backgroundImage: `radial-gradient(circle, ${theme.palette.primary.main} 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }}
      />

      {/* Content removed - will be redesigned later */}
    </Box>
  );
};

export default ModernTestimonials;
