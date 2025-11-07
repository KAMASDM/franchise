import React from 'react';
import { Box } from '@mui/material';

/**
 * Highlight matching text in search results
 * @param {string} text - The full text to search within
 * @param {string} query - The search query to highlight
 * @param {Object} highlightStyle - Custom styles for highlighted text
 * @returns {JSX.Element} - Text with highlighted matches
 */
export const highlightText = (text, query, highlightStyle = {}) => {
  if (!query || !text) {
    return text;
  }

  // Escape special regex characters in query
  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  try {
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    const parts = text.split(regex);

    return (
      <span>
        {parts.map((part, index) =>
          regex.test(part) ? (
            <Box
              component="mark"
              key={index}
              sx={{
                backgroundColor: 'primary.light',
                color: 'primary.contrastText',
                padding: '2px 4px',
                borderRadius: '4px',
                fontWeight: 600,
                ...highlightStyle,
              }}
            >
              {part}
            </Box>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </span>
    );
  } catch (error) {
    console.error('Error highlighting text:', error);
    return text;
  }
};

/**
 * React component for highlighting search text
 */
export const HighlightedText = ({ 
  text, 
  query, 
  highlightStyle = {},
  ...props 
}) => {
  return <span {...props}>{highlightText(text, query, highlightStyle)}</span>;
};

/**
 * Check if text matches search query (case-insensitive)
 * @param {string} text - Text to search in
 * @param {string} query - Search query
 * @returns {boolean} - Whether text contains query
 */
export const matchesQuery = (text, query) => {
  if (!query || !text) return true;
  return text.toLowerCase().includes(query.toLowerCase());
};

/**
 * Get matching excerpts from text with context
 * @param {string} text - Full text to extract from
 * @param {string} query - Search query
 * @param {number} contextLength - Characters of context before/after match
 * @returns {string} - Excerpt with match and surrounding context
 */
export const getMatchExcerpt = (text, query, contextLength = 50) => {
  if (!query || !text) return text;

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);

  if (index === -1) return text.substring(0, contextLength * 2) + '...';

  const start = Math.max(0, index - contextLength);
  const end = Math.min(text.length, index + query.length + contextLength);

  let excerpt = text.substring(start, end);
  
  if (start > 0) excerpt = '...' + excerpt;
  if (end < text.length) excerpt = excerpt + '...';

  return excerpt;
};

/**
 * Calculate relevance score for search results
 * @param {Object} item - Item to score
 * @param {string} query - Search query
 * @param {Array<string>} fields - Fields to search in
 * @returns {number} - Relevance score (0-100)
 */
export const calculateRelevanceScore = (item, query, fields = []) => {
  if (!query) return 0;

  let score = 0;
  const lowerQuery = query.toLowerCase();

  fields.forEach((field) => {
    const value = String(item[field] || '').toLowerCase();
    
    // Exact match in field
    if (value === lowerQuery) {
      score += 100;
    }
    // Starts with query
    else if (value.startsWith(lowerQuery)) {
      score += 50;
    }
    // Contains query
    else if (value.includes(lowerQuery)) {
      score += 25;
    }
    // Word boundary match (whole word)
    else if (new RegExp(`\\b${lowerQuery}\\b`, 'i').test(value)) {
      score += 30;
    }
  });

  return Math.min(score, 100);
};

/**
 * Filter and sort items by search relevance
 * @param {Array} items - Items to filter
 * @param {string} query - Search query
 * @param {Array<string>} searchFields - Fields to search in
 * @returns {Array} - Filtered and sorted items with relevance scores
 */
export const searchAndRank = (items, query, searchFields = ['name', 'description']) => {
  if (!query) return items;

  return items
    .map(item => ({
      ...item,
      _relevanceScore: calculateRelevanceScore(item, query, searchFields),
    }))
    .filter(item => item._relevanceScore > 0)
    .sort((a, b) => b._relevanceScore - a._relevanceScore);
};

export default {
  highlightText,
  HighlightedText,
  matchesQuery,
  getMatchExcerpt,
  calculateRelevanceScore,
  searchAndRank,
};
