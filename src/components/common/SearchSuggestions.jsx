import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Paper,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  TipsAndUpdates as SuggestionIcon,
} from '@mui/icons-material';

/**
 * "Did You Mean?" component for search suggestions
 * Shows spelling corrections and search suggestions
 */
export const DidYouMean = ({ suggestion, onSuggestionClick }) => {
  const theme = useTheme();

  if (!suggestion) return null;

  return (
    <Paper
      sx={{
        p: 2,
        mb: 3,
        background: alpha(theme.palette.info.main, 0.05),
        border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <SuggestionIcon sx={{ color: 'info.main', fontSize: 20 }} />
        <Typography variant="body2" color="text.secondary">
          Did you mean
        </Typography>
        <Chip
          label={suggestion}
          onClick={() => onSuggestionClick(suggestion)}
          clickable
          color="info"
          size="small"
          sx={{
            fontWeight: 600,
            cursor: 'pointer',
            '&:hover': {
              transform: 'translateY(-1px)',
            },
            transition: 'transform 0.2s',
          }}
        />
        <Typography variant="body2" color="text.secondary">
          ?
        </Typography>
      </Box>
    </Paper>
  );
};

/**
 * Search Suggestions component
 * Shows autocomplete suggestions as user types
 */
export const SearchSuggestions = ({ 
  suggestions = [], 
  onSuggestionClick,
  currentQuery = '',
}) => {
  const theme = useTheme();

  if (!suggestions || suggestions.length === 0) return null;

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        mt: 1,
        maxHeight: 300,
        overflowY: 'auto',
        zIndex: 1000,
        borderRadius: 2,
      }}
    >
      {suggestions.map((suggestion, index) => (
        <Box
          key={index}
          onClick={() => onSuggestionClick(suggestion)}
          sx={{
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            cursor: 'pointer',
            borderBottom: index < suggestions.length - 1 ? `1px solid ${theme.palette.divider}` : 'none',
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
            },
            transition: 'background-color 0.2s',
          }}
        >
          <SearchIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
          <Typography variant="body2">
            {highlightMatch(suggestion, currentQuery)}
          </Typography>
        </Box>
      ))}
    </Paper>
  );
};

/**
 * Popular Search Tags component
 * Shows clickable popular search terms
 */
export const PopularSearchTags = ({ tags = [], onTagClick }) => {
  if (!tags || tags.length === 0) return null;

  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="body2"
        color="text.secondary"
        gutterBottom
        sx={{ mb: 1.5, fontWeight: 500 }}
      >
        Popular Searches:
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {tags.map((tag, index) => (
          <Chip
            key={index}
            label={tag}
            onClick={() => onTagClick(tag)}
            clickable
            size="small"
            variant="outlined"
            sx={{
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                borderColor: 'primary.main',
              },
              transition: 'all 0.2s',
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

/**
 * Search Result Count component
 */
export const SearchResultCount = ({ count, query }) => {
  if (count === 0 && !query) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" color="text.secondary">
        {count === 0 ? (
          <>No results found for <strong>"{query}"</strong></>
        ) : (
          <>
            Found <strong>{count.toLocaleString()}</strong> result{count !== 1 ? 's' : ''}
            {query && <> for <strong>"{query}"</strong></>}
          </>
        )}
      </Typography>
    </Box>
  );
};

/**
 * Helper function to highlight matching text in suggestions
 */
const highlightMatch = (text, query) => {
  if (!query) return text;

  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return text;

  const before = text.substring(0, index);
  const match = text.substring(index, index + query.length);
  const after = text.substring(index + query.length);

  return (
    <>
      {before}
      <strong style={{ fontWeight: 700 }}>{match}</strong>
      {after}
    </>
  );
};

export default DidYouMean;
