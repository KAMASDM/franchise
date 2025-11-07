import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

/**
 * Custom hook for managing search state with URL persistence
 * Syncs search filters with URL query parameters for shareable/bookmarkable searches
 * 
 * @param {Object} defaultFilters - Default filter values
 * @returns {Object} - { filters, updateFilter, updateFilters, resetFilters, searchParams }
 */
export const useSearchWithURL = (defaultFilters = {}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => {
    // Initialize from URL params or use defaults
    const initialFilters = { ...defaultFilters };
    
    for (const [key, value] of searchParams.entries()) {
      // Parse arrays (e.g., "categories=Food,Retail")
      if (value.includes(',')) {
        initialFilters[key] = value.split(',');
      }
      // Parse booleans
      else if (value === 'true' || value === 'false') {
        initialFilters[key] = value === 'true';
      }
      // Parse numbers
      else if (!isNaN(value) && value !== '') {
        initialFilters[key] = Number(value);
      }
      // Keep as string
      else {
        initialFilters[key] = value;
      }
    }
    
    return initialFilters;
  });

  // Sync filters to URL whenever they change
  useEffect(() => {
    const newParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        return; // Skip empty values
      }
      
      if (Array.isArray(value) && value.length > 0) {
        newParams.set(key, value.join(','));
      } else if (typeof value === 'boolean') {
        newParams.set(key, String(value));
      } else if (value !== defaultFilters[key]) {
        // Only add to URL if different from default
        newParams.set(key, String(value));
      }
    });
    
    setSearchParams(newParams, { replace: true });
  }, [filters]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  return {
    filters,
    updateFilter,
    updateFilters,
    resetFilters,
    searchParams,
  };
};

/**
 * Helper function to generate shareable search URL
 * @param {Object} filters - Current filter state
 * @param {string} baseUrl - Base URL (optional, defaults to current page)
 * @returns {string} - Full URL with search params
 */
export const generateShareableSearchURL = (filters, baseUrl = window.location.pathname) => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') {
      return;
    }
    
    if (Array.isArray(value) && value.length > 0) {
      params.set(key, value.join(','));
    } else {
      params.set(key, String(value));
    }
  });
  
  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

/**
 * Parse URL search params into filter object
 * @param {URLSearchParams} searchParams - URL search params
 * @param {Object} defaultFilters - Default filter values for type reference
 * @returns {Object} - Parsed filters
 */
export const parseSearchParams = (searchParams, defaultFilters = {}) => {
  const filters = { ...defaultFilters };
  
  for (const [key, value] of searchParams.entries()) {
    if (value.includes(',')) {
      filters[key] = value.split(',');
    } else if (value === 'true' || value === 'false') {
      filters[key] = value === 'true';
    } else if (!isNaN(value) && value !== '') {
      filters[key] = Number(value);
    } else {
      filters[key] = value;
    }
  }
  
  return filters;
};

export default useSearchWithURL;
