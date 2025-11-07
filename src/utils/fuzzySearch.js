import Fuse from 'fuse.js';

/**
 * Fuzzy Search Utility using Fuse.js
 * Provides typo-tolerant search with "Did you mean?" suggestions
 */

/**
 * Create a Fuse.js instance for fuzzy searching
 * @param {Array} data - Array of items to search
 * @param {Object} options - Fuse.js configuration options
 * @returns {Fuse} - Fuse instance
 */
export const createFuzzySearch = (data, options = {}) => {
  const defaultOptions = {
    includeScore: true,
    threshold: 0.4, // 0.0 = perfect match, 1.0 = match anything
    location: 0,
    distance: 100,
    minMatchCharLength: 2,
    keys: ['name', 'description'], // Fields to search
    ...options,
  };

  return new Fuse(data, defaultOptions);
};

/**
 * Perform fuzzy search and return results
 * @param {Fuse} fuseInstance - Fuse.js instance
 * @param {string} query - Search query
 * @param {number} limit - Maximum results to return
 * @returns {Array} - Search results with scores
 */
export const fuzzySearch = (fuseInstance, query, limit = 10) => {
  if (!query) return [];
  
  const results = fuseInstance.search(query);
  return results.slice(0, limit).map(result => ({
    item: result.item,
    score: result.score,
    matches: result.matches,
  }));
};

/**
 * Get search suggestions based on common terms
 * @param {Array} data - Array of items
 * @param {string} query - User's search query
 * @param {Array<string>} fields - Fields to extract suggestions from
 * @param {number} limit - Max suggestions
 * @returns {Array<string>} - Array of suggested search terms
 */
export const getSearchSuggestions = (data, query, fields = ['brandName', 'category'], limit = 5) => {
  if (!query || query.length < 2) return [];

  const lowerQuery = query.toLowerCase();
  const suggestions = new Set();

  data.forEach(item => {
    fields.forEach(field => {
      const value = item[field];
      if (!value) return;

      const valueStr = String(value).toLowerCase();
      
      // Exact prefix match
      if (valueStr.startsWith(lowerQuery)) {
        suggestions.add(String(value));
      }
      // Word boundary match
      else if (valueStr.includes(` ${lowerQuery}`)) {
        suggestions.add(String(value));
      }
    });
  });

  return Array.from(suggestions).slice(0, limit);
};

/**
 * Find "Did you mean?" suggestions for misspelled queries
 * @param {Array} data - Array of items to search
 * @param {string} query - User's potentially misspelled query
 * @param {Array<string>} fields - Fields to search in
 * @returns {string|null} - Suggested correction or null
 */
export const getDidYouMean = (data, query, fields = ['brandName', 'category', 'industries']) => {
  if (!query || query.length < 3) return null;

  // Create a list of all unique terms from the data
  const allTerms = new Set();
  data.forEach(item => {
    fields.forEach(field => {
      const value = item[field];
      if (Array.isArray(value)) {
        value.forEach(v => allTerms.add(String(v).toLowerCase()));
      } else if (value) {
        allTerms.add(String(value).toLowerCase());
      }
    });
  });

  // Use Fuse to find closest match
  const termsFuse = new Fuse(Array.from(allTerms), {
    threshold: 0.3,
    distance: 50,
  });

  const results = termsFuse.search(query.toLowerCase());
  
  // Return suggestion only if it's different from the query
  if (results.length > 0 && results[0].item !== query.toLowerCase()) {
    return results[0].item;
  }

  return null;
};

/**
 * Enhanced search with fuzzy matching and suggestions
 * @param {Array} data - Items to search
 * @param {string} query - Search query
 * @param {Object} options - Search configuration
 * @returns {Object} - { results, suggestions, didYouMean }
 */
export const enhancedSearch = (data, query, options = {}) => {
  const {
    searchFields = ['brandName', 'category', 'industries', 'brandDescription'],
    suggestionFields = ['brandName', 'category'],
    limit = 20,
    suggestionLimit = 5,
  } = options;

  // Create Fuse instance
  const fuse = createFuzzySearch(data, {
    keys: searchFields,
    threshold: 0.4,
  });

  // Get search results
  const results = fuzzySearch(fuse, query, limit);

  // Get suggestions for autocomplete
  const suggestions = getSearchSuggestions(data, query, suggestionFields, suggestionLimit);

  // Get "Did you mean?" if no results found
  const didYouMean = results.length === 0 ? getDidYouMean(data, query, searchFields) : null;

  return {
    results: results.map(r => r.item),
    suggestions,
    didYouMean,
    hasResults: results.length > 0,
  };
};

/**
 * Calculate Levenshtein distance between two strings
 * Used for determining spelling similarity
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} - Edit distance
 */
export const levenshteinDistance = (str1, str2) => {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
};

export default {
  createFuzzySearch,
  fuzzySearch,
  getSearchSuggestions,
  getDidYouMean,
  enhancedSearch,
  levenshteinDistance,
};
