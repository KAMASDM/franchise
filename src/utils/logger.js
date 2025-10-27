/**
 * Logger Utility
 * Provides conditional logging for development and production environments
 * Prevents console pollution in production while maintaining error visibility
 */

const isDevelopment = import.meta.env.DEV;

export const logger = {
  /**
   * Log general information (development only)
   */
  log: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  /**
   * Log errors (always logged, even in production)
   */
  error: (...args) => {
    console.error(...args);
  },

  /**
   * Log warnings (development only)
   */
  warn: (...args) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  /**
   * Log debug information (development only)
   */
  debug: (...args) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },

  /**
   * Log informational messages (development only)
   */
  info: (...args) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },

  /**
   * Group logs together (development only)
   */
  group: (label, ...args) => {
    if (isDevelopment) {
      console.group(label);
      args.forEach(arg => console.log(arg));
      console.groupEnd();
    }
  },

  /**
   * Log with timestamp (development only)
   */
  logWithTime: (message, ...args) => {
    if (isDevelopment) {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] ${message}`, ...args);
    }
  },
};

export default logger;
