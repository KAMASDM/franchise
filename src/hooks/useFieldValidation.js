import { useState, useEffect, useRef } from 'react';

/**
 * Hook for real-time field validation with debouncing
 * @param {string} value - Current field value
 * @param {Function|Array} validators - Single validator or array of validators
 * @param {number} debounceTime - Debounce delay in ms
 * @returns {Object} - Validation state and helpers
 */
export const useFieldValidation = (value, validators, debounceTime = 500) => {
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState(null); // null = not validated, true = valid, false = invalid
  const timeoutRef = useRef(null);
  const isMountedRef = useRef(true);
  const validatorsRef = useRef(validators);

  // Update validators ref when they change
  useEffect(() => {
    validatorsRef.current = validators;
  }, [validators]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Don't validate empty values immediately
    if (!value || value.toString().trim() === '') {
      setIsValid(null);
      setError('');
      setIsValidating(false);
      return;
    }

    // Start validation indicator
    setIsValidating(true);

    // Debounce validation
    timeoutRef.current = setTimeout(async () => {
      if (!isMountedRef.current) return;

      const validatorArray = Array.isArray(validatorsRef.current) ? validatorsRef.current : [validatorsRef.current];
      
      try {
        for (const validator of validatorArray) {
          const result = await validator(value);
          
          if (!isMountedRef.current) return;

          if (result !== true) {
            setError(result || 'Invalid input');
            setIsValid(false);
            setIsValidating(false);
            return;
          }
        }
        
        // All validators passed
        if (isMountedRef.current) {
          setError('');
          setIsValid(true);
          setIsValidating(false);
        }
      } catch (err) {
        if (isMountedRef.current) {
          setError('Validation error');
          setIsValid(false);
          setIsValidating(false);
        }
      }
    }, debounceTime);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, debounceTime]); // Removed validators from dependencies to prevent infinite loop

  return {
    error,
    isValidating,
    isValid,
    reset: () => {
      setError('');
      setIsValid(null);
      setIsValidating(false);
    }
  };
};

/**
 * Common validators
 */
export const validators = {
  required: (fieldName = 'This field') => (value) => {
    if (!value || value.toString().trim() === '') {
      return `${fieldName} is required`;
    }
    return true;
  },

  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return true;
  },

  phone: (value) => {
    const phoneRegex = /^[+]?[\d\s-()]+$/;
    if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 10) {
      return 'Please enter a valid phone number (min 10 digits)';
    }
    return true;
  },

  url: (value) => {
    try {
      new URL(value.startsWith('http') ? value : `https://${value}`);
      return true;
    } catch {
      return 'Please enter a valid URL';
    }
  },

  minLength: (min) => (value) => {
    if (value.length < min) {
      return `Minimum ${min} characters required`;
    }
    return true;
  },

  maxLength: (max) => (value) => {
    if (value.length > max) {
      return `Maximum ${max} characters allowed`;
    }
    return true;
  },

  min: (min, fieldName = 'Value') => (value) => {
    const num = Number(value);
    if (isNaN(num) || num < min) {
      return `${fieldName} must be at least ${min}`;
    }
    return true;
  },

  max: (max, fieldName = 'Value') => (value) => {
    const num = Number(value);
    if (isNaN(num) || num > max) {
      return `${fieldName} must be at most ${max}`;
    }
    return true;
  },

  number: (value) => {
    if (isNaN(Number(value))) {
      return 'Please enter a valid number';
    }
    return true;
  },

  year: (value) => {
    const year = Number(value);
    const currentYear = new Date().getFullYear();
    if (isNaN(year) || year < 1900 || year > currentYear) {
      return `Please enter a valid year (1900-${currentYear})`;
    }
    return true;
  },

  noSpaces: (value) => {
    if (/\s/.test(value)) {
      return 'Spaces are not allowed';
    }
    return true;
  },

  alphanumeric: (value) => {
    if (!/^[a-zA-Z0-9]+$/.test(value)) {
      return 'Only letters and numbers are allowed';
    }
    return true;
  },

  match: (otherValue, fieldName = 'values') => (value) => {
    if (value !== otherValue) {
      return `${fieldName} do not match`;
    }
    return true;
  },
};

export default useFieldValidation;
