/**
 * Enhanced Search Hook
 * Provides debounced search with history and suggestions
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { debounce } from '../utils/errorRecovery';
import { LOCAL_STORAGE_KEYS } from '../constants';
import logger from '../utils/logger';

/**
 * Custom hook for enhanced search functionality
 * @param {Object} options - Configuration options
 * @returns {Object} - Search state and methods
 */
export function useSearch(options = {}) {
  const {
    onSearch,
    debounceDelay = 300,
    minSearchLength = 2,
    maxHistoryItems = 10,
    storageKey = LOCAL_STORAGE_KEYS.SEARCH_HISTORY,
  } = options;

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const searchTimeoutRef = useRef(null);

  // Load search history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setSearchHistory(JSON.parse(stored));
      }
    } catch (error) {
      logger.warn('Failed to load search history:', error);
    }
  }, [storageKey]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (!query || query.length < minSearchLength) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        if (onSearch) {
          const results = await onSearch(query);
          setSearchResults(results);
        }
      } catch (error) {
        logger.error('Search failed:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, debounceDelay),
    [onSearch, debounceDelay, minSearchLength]
  );

  // Handle search query change
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // Add to search history
  const addToHistory = (query) => {
    if (!query || query.trim().length === 0) return;

    const newHistory = [
      query,
      ...searchHistory.filter(item => item !== query)
    ].slice(0, maxHistoryItems);

    setSearchHistory(newHistory);
    
    try {
      localStorage.setItem(storageKey, JSON.stringify(newHistory));
    } catch (error) {
      logger.warn('Failed to save search history:', error);
    }
  };

  // Clear search history
  const clearHistory = () => {
    setSearchHistory([]);
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      logger.warn('Failed to clear search history:', error);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSuggestions([]);
  };

  // Execute search (for form submit)
  const executeSearch = () => {
    if (searchQuery) {
      addToHistory(searchQuery);
      debouncedSearch(searchQuery);
    }
  };

  return {
    searchQuery,
    searchResults,
    isSearching,
    searchHistory,
    suggestions,
    handleSearchChange,
    clearSearch,
    executeSearch,
    addToHistory,
    clearHistory,
  };
}

/**
 * Fuzzy search implementation
 * @param {string} query - Search query
 * @param {Array} items - Items to search
 * @param {Array} keys - Keys to search in
 * @returns {Array} - Filtered items
 */
export function fuzzySearch(query, items, keys = []) {
  if (!query) return items;

  const lowerQuery = query.toLowerCase();
  
  return items.filter(item => {
    // If no keys specified, search all string values
    const searchableFields = keys.length > 0
      ? keys.map(key => getNestedValue(item, key))
      : Object.values(item).filter(val => typeof val === 'string');

    return searchableFields.some(field => {
      if (!field || typeof field !== 'string') return false;
      
      const lowerField = field.toLowerCase();
      
      // Exact match
      if (lowerField.includes(lowerQuery)) return true;
      
      // Fuzzy match (allows for typos)
      return fuzzyMatch(lowerQuery, lowerField);
    });
  });
}

/**
 * Fuzzy string matching
 * @param {string} pattern - Search pattern
 * @param {string} str - String to match against
 * @returns {boolean} - True if matches
 */
function fuzzyMatch(pattern, str) {
  let patternIdx = 0;
  let strIdx = 0;
  const patternLength = pattern.length;
  const strLength = str.length;

  while (patternIdx < patternLength && strIdx < strLength) {
    if (pattern[patternIdx] === str[strIdx]) {
      patternIdx++;
    }
    strIdx++;
  }

  return patternIdx === patternLength;
}

/**
 * Get nested object value
 * @param {Object} obj - Object
 * @param {string} path - Dot-separated path
 * @returns {*} - Value
 */
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Highlight search query in text
 * @param {string} text - Text to highlight
 * @param {string} query - Search query
 * @returns {string} - HTML string with highlighted text
 */
export function highlightSearchQuery(text, query) {
  if (!query || !text) return text;

  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Generate search suggestions based on query
 * @param {string} query - Current query
 * @param {Array} history - Search history
 * @param {Array} popularSearches - Popular searches
 * @returns {Array} - Suggestions
 */
export function generateSuggestions(query, history = [], popularSearches = []) {
  if (!query) return [...history.slice(0, 5), ...popularSearches.slice(0, 3)];

  const lowerQuery = query.toLowerCase();
  
  // Filter history and popular searches
  const matchingHistory = history.filter(item =>
    item.toLowerCase().includes(lowerQuery)
  );
  
  const matchingPopular = popularSearches.filter(item =>
    item.toLowerCase().includes(lowerQuery) &&
    !matchingHistory.includes(item)
  );

  return [...matchingHistory.slice(0, 5), ...matchingPopular.slice(0, 3)];
}

export default useSearch;
