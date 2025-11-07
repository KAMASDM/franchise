import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Stack,
  Paper,
  useTheme,
  alpha,
  Divider,
} from '@mui/material';
import {
  LocalOffer as TagIcon,
  Clear as ClearIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

/**
 * Tag-based Filtering Component
 * Displays popular filter tags as clickable chips
 * 
 * @param {Object} props
 * @param {Array} props.tags - Array of tag objects or strings
 * @param {Array} props.selectedTags - Currently selected tag values
 * @param {Function} props.onTagClick - Callback when tag is clicked (tag) => void
 * @param {Function} props.onClearAll - Callback to clear all tags
 * @param {string} props.title - Section title
 * @param {boolean} props.multiSelect - Allow multiple tag selection (default: true)
 * @param {boolean} props.showCount - Show item count for each tag
 */
const TagFilter = ({
  tags = [],
  selectedTags = [],
  onTagClick,
  onClearAll,
  title = 'Filter by Tags',
  multiSelect = true,
  showCount = false,
}) => {
  const theme = useTheme();

  const handleTagClick = (tagValue) => {
    if (multiSelect) {
      const isSelected = selectedTags.includes(tagValue);
      const newTags = isSelected
        ? selectedTags.filter((t) => t !== tagValue)
        : [...selectedTags, tagValue];
      onTagClick(newTags);
    } else {
      onTagClick(tagValue === selectedTags[0] ? [] : [tagValue]);
    }
  };

  const isTagSelected = (tagValue) => selectedTags.includes(tagValue);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <TagIcon color="primary" />
          {title}
        </Typography>
        {selectedTags.length > 0 && onClearAll && (
          <Chip
            label="Clear All"
            size="small"
            deleteIcon={<ClearIcon />}
            onDelete={onClearAll}
            onClick={onClearAll}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: alpha(theme.palette.error.main, 0.1),
              },
            }}
          />
        )}
      </Box>

      {/* Tags */}
      <Stack direction="row" flexWrap="wrap" gap={1}>
        {tags.map((tag, index) => {
          const tagValue = typeof tag === 'string' ? tag : tag.value;
          const tagLabel = typeof tag === 'string' ? tag : tag.label;
          const tagCount = typeof tag === 'object' ? tag.count : null;
          const isPopular = typeof tag === 'object' ? tag.popular : false;
          const selected = isTagSelected(tagValue);

          return (
            <motion.div
              key={tagValue}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
            >
              <Chip
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {isPopular && (
                      <TrendingIcon sx={{ fontSize: 14, color: 'warning.main' }} />
                    )}
                    {tagLabel}
                    {showCount && tagCount !== null && (
                      <Typography
                        component="span"
                        variant="caption"
                        sx={{
                          ml: 0.5,
                          opacity: 0.7,
                          fontWeight: 600,
                        }}
                      >
                        ({tagCount})
                      </Typography>
                    )}
                  </Box>
                }
                onClick={() => handleTagClick(tagValue)}
                color={selected ? 'primary' : 'default'}
                variant={selected ? 'filled' : 'outlined'}
                sx={{
                  fontWeight: selected ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[2],
                  },
                }}
              />
            </motion.div>
          );
        })}
      </Stack>

      {/* Selected Tags Summary */}
      {selectedTags.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="caption" color="text.secondary">
            {selectedTags.length} tag{selectedTags.length !== 1 ? 's' : ''} selected
          </Typography>
        </>
      )}
    </Paper>
  );
};

/**
 * Inline Tag Filter (compact version)
 */
export const InlineTagFilter = ({
  tags = [],
  selectedTags = [],
  onTagClick,
  label = 'Quick Filters:',
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        flexWrap: 'wrap',
      }}
    >
      {label && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: 600 }}
        >
          {label}
        </Typography>
      )}
      {tags.map((tag) => {
        const tagValue = typeof tag === 'string' ? tag : tag.value;
        const tagLabel = typeof tag === 'string' ? tag : tag.label;
        const selected = selectedTags.includes(tagValue);

        return (
          <Chip
            key={tagValue}
            label={tagLabel}
            size="small"
            onClick={() => onTagClick(tagValue)}
            color={selected ? 'primary' : 'default'}
            variant={selected ? 'filled' : 'outlined'}
            sx={{
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: selected
                  ? theme.palette.primary.dark
                  : alpha(theme.palette.primary.main, 0.1),
              },
            }}
          />
        );
      })}
    </Box>
  );
};

/**
 * Popular Tags Cloud
 */
export const TagCloud = ({
  tags = [],
  onTagClick,
  maxTags = 20,
  title = 'Popular Tags',
}) => {
  const theme = useTheme();
  const displayedTags = tags.slice(0, maxTags);

  return (
    <Box>
      <Typography
        variant="subtitle2"
        gutterBottom
        sx={{
          fontWeight: 600,
          color: 'text.secondary',
          mb: 1.5,
        }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        {displayedTags.map((tag, index) => {
          const tagValue = typeof tag === 'string' ? tag : tag.value;
          const tagLabel = typeof tag === 'string' ? tag : tag.label;
          const tagCount = typeof tag === 'object' ? tag.count : null;

          // Variable size based on popularity
          const size = tagCount
            ? tagCount > 10
              ? 'medium'
              : 'small'
            : 'small';

          return (
            <Chip
              key={tagValue}
              label={tagLabel}
              size={size}
              onClick={() => onTagClick(tagValue)}
              variant="outlined"
              sx={{
                cursor: 'pointer',
                opacity: 0.7,
                transition: 'all 0.2s',
                '&:hover': {
                  opacity: 1,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  borderColor: theme.palette.primary.main,
                },
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
};

/**
 * Utility function to extract tags from brands
 */
export const extractTagsFromBrands = (brands = [], fields = ['category', 'industries']) => {
  const tagCounts = {};

  brands.forEach((brand) => {
    fields.forEach((field) => {
      const value = brand[field];
      if (Array.isArray(value)) {
        value.forEach((v) => {
          tagCounts[v] = (tagCounts[v] || 0) + 1;
        });
      } else if (value) {
        tagCounts[value] = (tagCounts[value] || 0) + 1;
      }
    });
  });

  return Object.entries(tagCounts)
    .map(([value, count]) => ({
      value,
      label: value,
      count,
      popular: count >= 5,
    }))
    .sort((a, b) => b.count - a.count);
};

/**
 * Default popular franchise tags
 */
export const defaultFranchiseTags = [
  { value: 'food', label: 'Food & Beverage', popular: true },
  { value: 'retail', label: 'Retail', popular: true },
  { value: 'healthcare', label: 'Healthcare', popular: true },
  { value: 'education', label: 'Education', popular: false },
  { value: 'fitness', label: 'Fitness & Wellness', popular: true },
  { value: 'technology', label: 'Technology', popular: false },
  { value: 'automotive', label: 'Automotive', popular: false },
  { value: 'home-services', label: 'Home Services', popular: true },
  { value: 'low-investment', label: 'Low Investment (<₹5L)', popular: true },
  { value: 'high-roi', label: 'High ROI', popular: true },
  { value: 'trending', label: 'Trending', popular: true },
  { value: 'new', label: 'New Opportunities', popular: false },
];

export default TagFilter;
