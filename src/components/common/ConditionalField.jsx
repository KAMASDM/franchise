import React from 'react';
import { Box, Chip, Fade } from '@mui/material';
import { Visibility as VisibleIcon } from '@mui/icons-material';

/**
 * Wrapper component for conditional fields
 * Shows/hides fields with animation and optional badge
 */
const ConditionalField = ({ 
  show = true, 
  children, 
  showBadge = false,
  badgeText = 'Conditional',
  animationDuration = 300
}) => {
  if (!show) {
    return null;
  }

  return (
    <Fade in={show} timeout={animationDuration}>
      <Box sx={{ position: 'relative', width: '100%' }}>
        {showBadge && (
          <Chip
            icon={<VisibleIcon />}
            label={badgeText}
            size="small"
            color="info"
            variant="outlined"
            sx={{
              position: 'absolute',
              top: -12,
              right: 8,
              zIndex: 10,
              fontSize: '0.65rem',
              height: 18,
              backgroundColor: 'background.paper',
              '& .MuiChip-icon': {
                fontSize: 12,
                marginLeft: '4px'
              },
              '& .MuiChip-label': {
                paddingLeft: '4px',
                paddingRight: '6px'
              }
            }}
          />
        )}
        {children}
      </Box>
    </Fade>
  );
};

export default ConditionalField;
