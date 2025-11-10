/**
 * Request Deduplication Utility
 * Prevents multiple identical requests from being made simultaneously
 */

const requestCache = new Map();

/**
 * Execute a function with request deduplication
 * @param {string} key - Unique key for the request
 * @param {Function} fetchFn - Function that returns a Promise
 * @returns {Promise} The deduplicated promise
 */
export const fetchWithDeduplication = (key, fetchFn) => {
  // Return existing promise if request is already in flight
  if (requestCache.has(key)) {
    return requestCache.get(key);
  }
  
  const promise = fetchFn()
    .finally(() => {
      // Clean up after request completes
      requestCache.delete(key);
    });

  requestCache.set(key, promise);
  return promise;
};

/**
 * Clear all cached requests (useful for testing or manual cleanup)
 */
export const clearRequestCache = () => {
  requestCache.clear();
};

/**
 * Get current cache status (useful for debugging)
 */
export const getRequestCacheStatus = () => {
  return {
    size: requestCache.size,
    keys: Array.from(requestCache.keys())
  };
};

export default fetchWithDeduplication;