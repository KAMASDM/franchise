import React from 'react';
import { Box, CircularProgress, Tooltip } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';

/**
 * Visual indicator for field validation state
 */
const ValidationIndicator = ({ isValid, isValidating, error, showWhen = 'always' }) => {
  // Don't show anything if showWhen is 'touched' and field hasn't been validated
  if (showWhen === 'touched' && isValid === null && !error) {
    return null;
  }

  // Don't show anything if showWhen is 'error' and there's no error
  if (showWhen === 'error' && !error) {
    return null;
  }

  if (isValidating) {
    return (
      <Tooltip title="Validating...">
        <Box sx={{ display: 'inline-flex', ml: 1 }}>
          <CircularProgress size={16} />
        </Box>
      </Tooltip>
    );
  }

  if (error) {
    return (
      <Tooltip title={error}>
        <Box sx={{ display: 'inline-flex', ml: 1 }}>
          <ErrorIcon fontSize="small" color="error" />
        </Box>
      </Tooltip>
    );
  }

  if (isValid === true) {
    return (
      <Tooltip title="Valid">
        <Box sx={{ display: 'inline-flex', ml: 1 }}>
          <CheckCircleIcon fontSize="small" color="success" />
        </Box>
      </Tooltip>
    );
  }

  // Show info icon for untouched fields if showWhen is 'always'
  if (showWhen === 'always' && isValid === null) {
    return (
      <Tooltip title="Enter value to validate">
        <Box sx={{ display: 'inline-flex', ml: 1 }}>
          <InfoIcon fontSize="small" color="action" />
        </Box>
      </Tooltip>
    );
  }

  return null;
};

export default ValidationIndicator;
