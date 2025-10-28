import React from 'react';
import { Box, Container } from '@mui/material';
import { useDevice } from '../../hooks/useDevice';

/**
 * Responsive container component that adapts to device type
 * Provides optimal spacing and layout for mobile, tablet, and desktop
 */
const ResponsiveContainer = ({ 
  children, 
  maxWidth,
  disableGutters = false,
  sx = {},
  component = 'div',
  ...props 
}) => {
  const { isMobile, isTablet, spacing, containerMaxWidth } = useDevice();
  
  return (
    <Container
      maxWidth={maxWidth || containerMaxWidth}
      disableGutters={disableGutters}
      component={component}
      sx={{
        px: isMobile ? (disableGutters ? 0 : 2) : isTablet ? 3 : 4,
        py: isMobile ? 2 : isTablet ? 3 : 4,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Container>
  );
};

/**
 * Mobile-optimized section wrapper with proper spacing
 */
export const MobileSection = ({ children, sx = {}, ...props }) => {
  const { isMobile, spacing } = useDevice();
  
  return (
    <Box
      sx={{
        py: { xs: spacing.md, sm: spacing.lg, md: spacing.xl },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

/**
 * Responsive grid container with automatic column calculation
 */
export const ResponsiveGrid = ({ 
  children, 
  columns, 
  gap = 2,
  sx = {},
  ...props 
}) => {
  const { gridColumns } = useDevice();
  
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: columns 
          ? `repeat(${columns}, 1fr)` 
          : `repeat(${gridColumns}, 1fr)`,
        gap: gap,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

/**
 * Stack component with responsive direction
 */
export const ResponsiveStack = ({ 
  children, 
  mobileDirection = 'column',
  desktopDirection = 'row',
  spacing = 2,
  sx = {},
  ...props 
}) => {
  const { isMobile } = useDevice();
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? mobileDirection : desktopDirection,
        gap: spacing,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

/**
 * Mobile-optimized card with touch-friendly padding
 */
export const MobileCard = ({ children, sx = {}, ...props }) => {
  const { isMobile, spacing } = useDevice();
  
  return (
    <Box
      sx={{
        p: { xs: spacing.sm, sm: spacing.md, md: spacing.lg },
        borderRadius: { xs: 2, sm: 3, md: 4 },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default ResponsiveContainer;
