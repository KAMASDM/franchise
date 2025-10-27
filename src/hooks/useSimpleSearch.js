import { useState, useEffect } from 'react';

/**
 * Simple search hook with debouncing
 * @param {string} initialValue - Initial search value
 * @param {number} delay - Debounce delay in ms
 * @returns {Object} - Search term, setter, and debounced value
 */
export const useSimpleSearch = (initialValue = '', delay = 300) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm, delay]);

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm
  };
};
