/**
 * Error Recovery Utilities
 * Provides mechanisms to gracefully handle and recover from errors
 */

import logger from './logger';

/**
 * Retry a failed operation with exponential backoff
 * @param {Function} operation - The async operation to retry
 * @param {Object} options - Retry configuration
 * @returns {Promise} - Result of the operation
 */
export async function retryOperation(
  operation,
  {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2,
    onRetry = null,
  } = {}
) {
  let lastError;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) {
        logger.error(`Operation failed after ${maxRetries + 1} attempts:`, error);
        throw error;
      }

      logger.warn(`Operation failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delay}ms...`, error);

      if (onRetry) {
        onRetry(attempt + 1, delay, error);
      }

      await sleep(delay);
      delay = Math.min(delay * backoffMultiplier, maxDelay);
    }
  }

  throw lastError;
}

/**
 * Sleep for a specified duration
 * @param {number} ms - Duration in milliseconds
 * @returns {Promise}
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Wrap an async operation with error handling
 * @param {Function} operation - The async operation
 * @param {Object} options - Error handling options
 * @returns {Promise} - Result or error handling
 */
export async function withErrorHandling(
  operation,
  {
    fallbackValue = null,
    onError = null,
    throwError = false,
  } = {}
) {
  try {
    return await operation();
  } catch (error) {
    logger.error('Operation failed:', error);

    if (onError) {
      onError(error);
    }

    if (throwError) {
      throw error;
    }

    return fallbackValue;
  }
}

/**
 * Create a circuit breaker to prevent cascading failures
 * @param {Function} operation - The operation to protect
 * @param {Object} options - Circuit breaker configuration
 * @returns {Function} - Protected operation
 */
export function createCircuitBreaker(
  operation,
  {
    failureThreshold = 5,
    resetTimeout = 60000,
    onOpen = null,
    onClose = null,
  } = {}
) {
  let failureCount = 0;
  let lastFailureTime = null;
  let state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN

  return async function (...args) {
    // Check if circuit should be half-open (attempt recovery)
    if (state === 'OPEN') {
      const timeSinceLastFailure = Date.now() - lastFailureTime;
      if (timeSinceLastFailure >= resetTimeout) {
        state = 'HALF_OPEN';
        logger.log('Circuit breaker entering HALF_OPEN state');
      } else {
        throw new Error('Circuit breaker is OPEN - operation blocked');
      }
    }

    try {
      const result = await operation(...args);

      // Success - reset if in HALF_OPEN
      if (state === 'HALF_OPEN') {
        state = 'CLOSED';
        failureCount = 0;
        logger.log('Circuit breaker reset to CLOSED state');
        if (onClose) onClose();
      }

      return result;
    } catch (error) {
      failureCount++;
      lastFailureTime = Date.now();

      if (failureCount >= failureThreshold) {
        state = 'OPEN';
        logger.error(`Circuit breaker opened after ${failureCount} failures`);
        if (onOpen) onOpen();
      }

      throw error;
    }
  };
}

/**
 * Debounce a function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export function debounce(func, wait = 300) {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle a function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Minimum time between calls in milliseconds
 * @returns {Function} - Throttled function
 */
export function throttle(func, limit = 1000) {
  let inThrottle;

  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Safely parse JSON with error handling
 * @param {string} jsonString - JSON string to parse
 * @param {*} fallbackValue - Value to return on error
 * @returns {*} - Parsed value or fallback
 */
export function safeJsonParse(jsonString, fallbackValue = null) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    logger.warn('Failed to parse JSON:', error);
    return fallbackValue;
  }
}

/**
 * Safely access nested object properties
 * @param {Object} obj - Object to access
 * @param {string} path - Property path (e.g., 'user.profile.name')
 * @param {*} defaultValue - Default value if path doesn't exist
 * @returns {*} - Value or default
 */
export function safeGet(obj, path, defaultValue = undefined) {
  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result == null || typeof result !== 'object') {
      return defaultValue;
    }
    result = result[key];
  }

  return result !== undefined ? result : defaultValue;
}

/**
 * Create a cancellable promise
 * @param {Promise} promise - Promise to make cancellable
 * @returns {Object} - Object with promise and cancel function
 */
export function makeCancellable(promise) {
  let isCancelled = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise
      .then(value => (isCancelled ? reject({ isCancelled: true }) : resolve(value)))
      .catch(error => (isCancelled ? reject({ isCancelled: true }) : reject(error)));
  });

  return {
    promise: wrappedPromise,
    cancel: () => {
      isCancelled = true;
    },
  };
}

export default {
  retryOperation,
  withErrorHandling,
  createCircuitBreaker,
  debounce,
  throttle,
  safeJsonParse,
  safeGet,
  makeCancellable,
};
