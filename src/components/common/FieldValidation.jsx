import React from 'react';
import {
  Box,
  InputAdornment,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Field Validation Indicator Component
 * Shows real-time validation status with icons and messages
 * 
 * @param {Object} props
 * @param {boolean} props.isValid - Whether the field is valid
 * @param {boolean} props.isTouched - Whether the field has been touched
 * @param {string} props.errorMessage - Error message to display
 * @param {string} props.successMessage - Success message to display (optional)
 * @param {boolean} props.showIcon - Show icon in input (default: true)
 * @param {boolean} props.showMessage - Show message below input (default: true)
 * @param {string} props.variant - Display variant: 'icon', 'message', 'both' (default: 'both')
 */
export const FieldValidationIndicator = ({
  isValid,
  isTouched,
  errorMessage,
  successMessage,
  showIcon = true,
  showMessage = true,
  variant = 'both',
}) => {
  const theme = useTheme();

  if (!isTouched) return null;

  const validationIcon = isValid ? (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
    >
      <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
    </motion.div>
  ) : (
    <motion.div
      initial={{ scale: 0, rotate: 180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
    >
      <CancelIcon sx={{ color: 'error.main', fontSize: 20 }} />
    </motion.div>
  );

  return (
    <>
      {/* Icon Indicator */}
      {(variant === 'icon' || variant === 'both') && showIcon && (
        <InputAdornment position="end">{validationIcon}</InputAdornment>
      )}

      {/* Message Indicator */}
      {(variant === 'message' || variant === 'both') && showMessage && (
        <AnimatePresence mode="wait">
          {!isValid && errorMessage && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: 'error.main',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  mt: 0.5,
                }}
              >
                <CancelIcon sx={{ fontSize: 14 }} />
                {errorMessage}
              </Typography>
            </motion.div>
          )}
          {isValid && successMessage && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: 'success.main',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  mt: 0.5,
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 14 }} />
                {successMessage}
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
};

/**
 * Form Field Strength Indicator
 * Shows password strength or field completeness
 */
export const FieldStrengthIndicator = ({ strength = 0, label = 'Strength' }) => {
  const theme = useTheme();

  const getColor = () => {
    if (strength < 25) return theme.palette.error.main;
    if (strength < 50) return theme.palette.warning.main;
    if (strength < 75) return theme.palette.info.main;
    return theme.palette.success.main;
  };

  const getLabel = () => {
    if (strength < 25) return 'Weak';
    if (strength < 50) return 'Fair';
    if (strength < 75) return 'Good';
    return 'Strong';
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography
          variant="caption"
          sx={{ fontWeight: 600, color: getColor() }}
        >
          {getLabel()}
        </Typography>
      </Box>
      <Box
        sx={{
          height: 4,
          borderRadius: 2,
          bgcolor: alpha(theme.palette.divider, 0.3),
          overflow: 'hidden',
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${strength}%` }}
          transition={{ duration: 0.3 }}
          style={{
            height: '100%',
            backgroundColor: getColor(),
            borderRadius: 2,
          }}
        />
      </Box>
    </Box>
  );
};

/**
 * Real-time Validation Rules Display
 * Shows a checklist of validation rules
 */
export const ValidationRulesList = ({ rules = [] }) => {
  return (
    <Box sx={{ mt: 1 }}>
      {rules.map((rule, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Typography
            variant="caption"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              mb: 0.5,
              color: rule.isValid ? 'success.main' : 'text.secondary',
              transition: 'color 0.3s',
            }}
          >
            {rule.isValid ? (
              <CheckCircleIcon sx={{ fontSize: 14 }} />
            ) : (
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  border: '2px solid',
                  borderColor: 'divider',
                }}
              />
            )}
            {rule.label}
          </Typography>
        </motion.div>
      ))}
    </Box>
  );
};

/**
 * Inline validation hook
 * Use this in forms to manage validation state
 */
export const useFieldValidation = (initialValue = '', validators = []) => {
  const [value, setValue] = React.useState(initialValue);
  const [isTouched, setIsTouched] = React.useState(false);
  const [errors, setErrors] = React.useState([]);

  const validate = (val) => {
    const newErrors = [];
    validators.forEach((validator) => {
      const error = validator(val);
      if (error) newErrors.push(error);
    });
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (isTouched) {
      validate(newValue);
    }
  };

  const handleBlur = () => {
    setIsTouched(true);
    validate(value);
  };

  return {
    value,
    setValue,
    isTouched,
    isValid: errors.length === 0,
    errors,
    errorMessage: errors[0],
    handleChange,
    handleBlur,
  };
};

/**
 * Common validators
 */
export const validators = {
  required: (message = 'This field is required') => (value) => {
    return !value || value.trim() === '' ? message : null;
  },
  
  email: (message = 'Invalid email address') => (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return value && !emailRegex.test(value) ? message : null;
  },
  
  minLength: (min, message) => (value) => {
    return value && value.length < min 
      ? message || `Must be at least ${min} characters`
      : null;
  },
  
  maxLength: (max, message) => (value) => {
    return value && value.length > max 
      ? message || `Must be at most ${max} characters`
      : null;
  },
  
  pattern: (regex, message = 'Invalid format') => (value) => {
    return value && !regex.test(value) ? message : null;
  },
  
  phone: (message = 'Invalid phone number') => (value) => {
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    return value && !phoneRegex.test(value) ? message : null;
  },
  
  url: (message = 'Invalid URL') => (value) => {
    try {
      new URL(value);
      return null;
    } catch {
      return value ? message : null;
    }
  },
  
  number: (message = 'Must be a number') => (value) => {
    return value && isNaN(value) ? message : null;
  },
  
  range: (min, max, message) => (value) => {
    const num = Number(value);
    return value && (num < min || num > max)
      ? message || `Must be between ${min} and ${max}`
      : null;
  },
};

export default FieldValidationIndicator;
