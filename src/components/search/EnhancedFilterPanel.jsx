/**
 * Enhanced Filter Panel
 * Visual filter pills, saved presets, verification status, view density controls
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Stack,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  useTheme,
  alpha,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Bookmark as PresetIcon,
  VerifiedUser as VerifiedIcon,
  ViewModule as GridIcon,
  ViewList as ListIcon,
  ViewComfy as ComfortIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const MotionChip = motion(Chip);
const MotionBox = motion(Box);

const FILTER_PRESETS_KEY = 'filter_presets';
const ACTIVE_FILTERS_KEY = 'active_filters';

/**
 * Predefined filter presets
 */
const DEFAULT_PRESETS = [
  {
    id: 'low-investment',
    name: 'Low Investment',
    icon: '💰',
    filters: {
      investmentRange: ['Under ₹50K', '₹50K - ₹100K'],
    },
  },
  {
    id: 'high-roi',
    name: 'High ROI',
    icon: '📈',
    filters: {
      minROI: 20,
    },
  },
  {
    id: 'verified-only',
    name: 'Verified Brands',
    icon: '✓',
    filters: {
      verified: true,
    },
  },
  {
    id: 'new-opportunities',
    name: 'New This Month',
    icon: '🆕',
    filters: {
      dateRange: 'last-30-days',
    },
  },
];

/**
 * Get saved presets from localStorage
 */
const getSavedPresets = () => {
  try {
    const saved = localStorage.getItem(FILTER_PRESETS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

/**
 * Save presets to localStorage
 */
const savePresets = (presets) => {
  localStorage.setItem(FILTER_PRESETS_KEY, JSON.stringify(presets));
};

/**
 * Enhanced Filter Panel Component
 */
const EnhancedFilterPanel = ({
  activeFilters = {},
  onFiltersChange,
  availableFilters = {},
  showViewControls = true,
  viewMode = 'grid',
  onViewModeChange,
  viewDensity = 'comfortable',
  onViewDensityChange,
}) => {
  const theme = useTheme();
  const [presets, setPresets] = useState([...DEFAULT_PRESETS, ...getSavedPresets()]);
  const [savePresetDialog, setSavePresetDialog] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [presetMenuAnchor, setPresetMenuAnchor] = useState(null);
  
  /**
   * Get active filter count
   */
  const getActiveFilterCount = () => {
    return Object.values(activeFilters).filter(value => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object' && value !== null) return Object.keys(value).length > 0;
      return value !== null && value !== undefined && value !== '';
    }).length;
  };
  
  const activeCount = getActiveFilterCount();
  
  /**
   * Handle filter change
   */
  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...activeFilters };
    
    if (Array.isArray(newFilters[filterKey])) {
      // Toggle array values
      const index = newFilters[filterKey].indexOf(value);
      if (index > -1) {
        newFilters[filterKey] = newFilters[filterKey].filter(v => v !== value);
      } else {
        newFilters[filterKey] = [...newFilters[filterKey], value];
      }
    } else {
      // Set single value
      newFilters[filterKey] = value;
    }
    
    onFiltersChange(newFilters);
  };
  
  /**
   * Remove specific filter
   */
  const handleRemoveFilter = (filterKey, value = null) => {
    const newFilters = { ...activeFilters };
    
    if (value !== null && Array.isArray(newFilters[filterKey])) {
      newFilters[filterKey] = newFilters[filterKey].filter(v => v !== value);
    } else {
      delete newFilters[filterKey];
    }
    
    onFiltersChange(newFilters);
  };
  
  /**
   * Clear all filters
   */
  const handleClearAll = () => {
    onFiltersChange({});
  };
  
  /**
   * Apply preset
   */
  const handleApplyPreset = (preset) => {
    onFiltersChange(preset.filters);
    setPresetMenuAnchor(null);
  };
  
  /**
   * Save current filters as preset
   */
  const handleSavePreset = () => {
    if (!presetName.trim()) return;
    
    const newPreset = {
      id: `custom-${Date.now()}`,
      name: presetName,
      icon: '⭐',
      filters: activeFilters,
      custom: true,
    };
    
    const customPresets = getSavedPresets();
    const updated = [...customPresets, newPreset];
    savePresets(updated);
    setPresets([...DEFAULT_PRESETS, ...updated]);
    
    setPresetName('');
    setSavePresetDialog(false);
  };
  
  /**
   * Delete custom preset
   */
  const handleDeletePreset = (presetId) => {
    const customPresets = getSavedPresets().filter(p => p.id !== presetId);
    savePresets(customPresets);
    setPresets([...DEFAULT_PRESETS, ...customPresets]);
  };
  
  /**
   * Render filter chips
   */
  const renderFilterChips = () => {
    const chips = [];
    
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        value.forEach((item, idx) => {
          chips.push({
            key: `${key}-${idx}`,
            label: `${key}: ${item}`,
            onDelete: () => handleRemoveFilter(key, item),
          });
        });
      } else if (value !== null && value !== undefined && value !== '') {
        chips.push({
          key,
          label: `${key}: ${value}`,
          onDelete: () => handleRemoveFilter(key),
        });
      }
    });
    
    return chips;
  };
  
  const filterChips = renderFilterChips();
  
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterIcon color="primary" />
          <Typography variant="h6" fontWeight="600">
            Filters
            {activeCount > 0 && (
              <Chip 
                label={activeCount} 
                size="small" 
                color="primary" 
                sx={{ ml: 1, height: 20 }}
              />
            )}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* Preset Menu */}
          <Tooltip title="Filter Presets">
            <IconButton
              size="small"
              onClick={(e) => setPresetMenuAnchor(e.currentTarget)}
            >
              <PresetIcon />
            </IconButton>
          </Tooltip>
          
          {/* Save Current Filters */}
          {activeCount > 0 && (
            <Tooltip title="Save as Preset">
              <IconButton
                size="small"
                onClick={() => setSavePresetDialog(true)}
              >
                <SaveIcon />
              </IconButton>
            </Tooltip>
          )}
          
          {/* Clear All */}
          {activeCount > 0 && (
            <Button
              size="small"
              onClick={handleClearAll}
              startIcon={<CloseIcon />}
            >
              Clear All
            </Button>
          )}
        </Box>
      </Box>
      
      {/* Active Filter Chips */}
      {filterChips.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Active Filters:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <AnimatePresence>
              {filterChips.map((chip) => (
                <MotionChip
                  key={chip.key}
                  label={chip.label}
                  onDelete={chip.onDelete}
                  color="primary"
                  size="small"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              ))}
            </AnimatePresence>
          </Stack>
        </Box>
      )}
      
      {/* View Controls */}
      {showViewControls && (
        <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* View Mode */}
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                View
              </Typography>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(e, value) => value && onViewModeChange(value)}
                size="small"
              >
                <ToggleButton value="grid">
                  <Tooltip title="Grid View">
                    <GridIcon fontSize="small" />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="list">
                  <Tooltip title="List View">
                    <ListIcon fontSize="small" />
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
            
            {/* Density */}
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                Density
              </Typography>
              <ToggleButtonGroup
                value={viewDensity}
                exclusive
                onChange={(e, value) => value && onViewDensityChange(value)}
                size="small"
              >
                <ToggleButton value="compact">
                  <Tooltip title="Compact">
                    <Typography variant="caption">S</Typography>
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="comfortable">
                  <Tooltip title="Comfortable">
                    <Typography variant="caption">M</Typography>
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="spacious">
                  <Tooltip title="Spacious">
                    <Typography variant="caption">L</Typography>
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>
        </Box>
      )}
      
      {/* Preset Menu */}
      <Menu
        anchorEl={presetMenuAnchor}
        open={Boolean(presetMenuAnchor)}
        onClose={() => setPresetMenuAnchor(null)}
      >
        <MenuItem disabled>
          <Typography variant="caption" color="text.secondary">
            Quick Presets
          </Typography>
        </MenuItem>
        {presets.map((preset) => (
          <MenuItem
            key={preset.id}
            onClick={() => handleApplyPreset(preset)}
          >
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>{preset.icon}</span>
                  <span>{preset.name}</span>
                </Box>
              }
            />
            {preset.custom && (
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePreset(preset.id);
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </ListItemSecondaryAction>
            )}
          </MenuItem>
        ))}
      </Menu>
      
      {/* Save Preset Dialog */}
      <Dialog open={savePresetDialog} onClose={() => setSavePresetDialog(false)}>
        <DialogTitle>Save Filter Preset</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Preset Name"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            placeholder="e.g., My Favorites"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSavePresetDialog(false)}>Cancel</Button>
          <Button onClick={handleSavePreset} variant="contained" disabled={!presetName.trim()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default EnhancedFilterPanel;
