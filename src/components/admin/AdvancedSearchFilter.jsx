import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  IconButton,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
  Slider,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Autocomplete,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Save as SaveIcon,
  CloudDownload as ExportIcon,
  ExpandMore as ExpandMoreIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
} from '@mui/icons-material';

const AdvancedSearchFilter = ({ onFilterChange, totalResults }) => {
  // Filter State
  const [filters, setFilters] = useState({
    searchQuery: '',
    status: [],
    businessModel: [],
    industry: [],
    dateRange: {
      start: null,
      end: null,
    },
    investmentRange: {
      min: 0,
      max: 10000000,
    },
    location: {
      country: [],
      state: [],
      city: [],
    },
    franchise: {
      minUnits: 0,
      maxUnits: 1000,
      hasTraining: null,
      hasSupport: null,
    },
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // Saved Filters
  const [savedFilters, setSavedFilters] = useState([]);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [filterName, setFilterName] = useState('');

  // UI State
  const [activeFilters, setActiveFilters] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState(null);

  // Options
  const statusOptions = ['pending', 'approved', 'rejected', 'under_review', 'draft'];
  const businessModelOptions = [
    'Single Unit Franchise',
    'Multi-Unit Franchise',
    'Master Franchise',
    'Area Development',
    'Conversion Franchise',
  ];
  const industryOptions = [
    'Food & Beverage',
    'Retail',
    'Health & Fitness',
    'Education',
    'Services',
    'Automotive',
    'Real Estate',
    'Technology',
    'Other',
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Date Created' },
    { value: 'brandName', label: 'Brand Name' },
    { value: 'totalInvestment', label: 'Investment Amount' },
    { value: 'franchiseUnits', label: 'Number of Units' },
    { value: 'status', label: 'Status' },
  ];

  // Update active filters display
  useEffect(() => {
    const active = [];

    if (filters.searchQuery) {
      active.push({ type: 'search', label: `Search: ${filters.searchQuery}`, value: filters.searchQuery });
    }
    
    filters.status.forEach(s => {
      active.push({ type: 'status', label: `Status: ${s}`, value: s });
    });
    
    filters.businessModel.forEach(bm => {
      active.push({ type: 'businessModel', label: `Model: ${bm}`, value: bm });
    });
    
    filters.industry.forEach(ind => {
      active.push({ type: 'industry', label: `Industry: ${ind}`, value: ind });
    });

    if (filters.investmentRange.min > 0 || filters.investmentRange.max < 10000000) {
      active.push({
        type: 'investment',
        label: `Investment: $${filters.investmentRange.min.toLocaleString()} - $${filters.investmentRange.max.toLocaleString()}`,
        value: filters.investmentRange,
      });
    }

    filters.location.country.forEach(country => {
      active.push({ type: 'country', label: `Country: ${country}`, value: country });
    });

    setActiveFilters(active);
    onFilterChange(filters);
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
    }));
  };

  // Handle array filter toggle
  const handleArrayToggle = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value],
    }));
  };

  // Remove specific filter
  const handleRemoveFilter = (filterItem) => {
    switch (filterItem.type) {
      case 'search':
        setFilters(prev => ({ ...prev, searchQuery: '' }));
        break;
      case 'status':
      case 'businessModel':
      case 'industry':
      case 'country':
        setFilters(prev => ({
          ...prev,
          [filterItem.type]: prev[filterItem.type].filter(item => item !== filterItem.value),
        }));
        break;
      case 'investment':
        setFilters(prev => ({
          ...prev,
          investmentRange: { min: 0, max: 10000000 },
        }));
        break;
      default:
        break;
    }
  };

  // Clear all filters
  const handleClearAll = () => {
    setFilters({
      searchQuery: '',
      status: [],
      businessModel: [],
      industry: [],
      dateRange: { start: null, end: null },
      investmentRange: { min: 0, max: 10000000 },
      location: { country: [], state: [], city: [] },
      franchise: { minUnits: 0, maxUnits: 1000, hasTraining: null, hasSupport: null },
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  // Save current filter preset
  const handleSaveFilter = () => {
    if (!filterName.trim()) return;

    const newFilter = {
      id: Date.now(),
      name: filterName,
      filters: { ...filters },
      createdAt: new Date().toISOString(),
    };

    const updated = [...savedFilters, newFilter];
    setSavedFilters(updated);
    localStorage.setItem('savedBrandFilters', JSON.stringify(updated));
    
    setFilterName('');
    setSaveDialogOpen(false);
  };

  // Load saved filter
  const handleLoadFilter = (savedFilter) => {
    setFilters(savedFilter.filters);
    setMenuAnchor(null);
  };

  // Delete saved filter
  const handleDeleteSavedFilter = (filterId) => {
    const updated = savedFilters.filter(f => f.id !== filterId);
    setSavedFilters(updated);
    localStorage.setItem('savedBrandFilters', JSON.stringify(updated));
  };

  // Load saved filters on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedBrandFilters');
    if (saved) {
      try {
        setSavedFilters(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved filters:', e);
      }
    }
  }, []);

  return (
    <Box>
      {/* Search Bar and Quick Actions */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search by brand name, owner, industry..."
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
                endAdornment: filters.searchQuery && (
                  <IconButton size="small" onClick={() => handleFilterChange('searchQuery', '')}>
                    <ClearIcon />
                  </IconButton>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Tooltip title="Save current filters">
                <IconButton
                  onClick={() => setSaveDialogOpen(true)}
                  disabled={activeFilters.length === 0}
                >
                  <SaveIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Load saved filters">
                <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
                  <BookmarkIcon />
                </IconButton>
              </Tooltip>

              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={handleClearAll}
                disabled={activeFilters.length === 0}
              >
                Clear All
              </Button>

              <Button variant="contained" startIcon={<FilterIcon />}>
                Apply Filters ({totalResults})
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            <Typography variant="caption" sx={{ alignSelf: 'center' }}>
              Active Filters:
            </Typography>
            {activeFilters.map((filter, index) => (
              <Chip
                key={index}
                label={filter.label}
                onDelete={() => handleRemoveFilter(filter)}
                size="small"
                color="primary"
                variant="outlined"
              />
            ))}
          </Stack>
        </Box>
      )}

      {/* Advanced Filters */}
      <Paper sx={{ mb: 2 }}>
        {/* Status Filter */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Status {filters.status.length > 0 && `(${filters.status.length})`}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup row>
              {statusOptions.map(status => (
                <FormControlLabel
                  key={status}
                  control={
                    <Checkbox
                      checked={filters.status.includes(status)}
                      onChange={() => handleArrayToggle('status', status)}
                    />
                  }
                  label={status.replace('_', ' ').toUpperCase()}
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>

        {/* Business Model Filter */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Business Model {filters.businessModel.length > 0 && `(${filters.businessModel.length})`}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              {businessModelOptions.map(model => (
                <FormControlLabel
                  key={model}
                  control={
                    <Checkbox
                      checked={filters.businessModel.includes(model)}
                      onChange={() => handleArrayToggle('businessModel', model)}
                    />
                  }
                  label={model}
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>

        {/* Industry Filter */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Industry {filters.industry.length > 0 && `(${filters.industry.length})`}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup row>
              {industryOptions.map(industry => (
                <FormControlLabel
                  key={industry}
                  control={
                    <Checkbox
                      checked={filters.industry.includes(industry)}
                      onChange={() => handleArrayToggle('industry', industry)}
                    />
                  }
                  label={industry}
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>

        {/* Investment Range Filter */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Investment Range</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ px: 2 }}>
              <Typography gutterBottom>
                ${filters.investmentRange.min.toLocaleString()} - ${filters.investmentRange.max.toLocaleString()}
              </Typography>
              <Slider
                value={[filters.investmentRange.min, filters.investmentRange.max]}
                onChange={(e, newValue) => {
                  handleFilterChange('investmentRange', {
                    min: newValue[0],
                    max: newValue[1],
                  });
                }}
                min={0}
                max={10000000}
                step={50000}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Sort Options */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Sort By</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <FormControl fullWidth size="small">
                  <InputLabel>Sort Field</InputLabel>
                  <Select
                    value={filters.sortBy}
                    label="Sort Field"
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  >
                    {sortOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Order</InputLabel>
                  <Select
                    value={filters.sortOrder}
                    label="Order"
                    onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                  >
                    <MenuItem value="asc">Ascending</MenuItem>
                    <MenuItem value="desc">Descending</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Paper>

      {/* Saved Filters Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        {savedFilters.length === 0 ? (
          <MenuItem disabled>No saved filters</MenuItem>
        ) : (
          savedFilters.map(savedFilter => (
            <MenuItem key={savedFilter.id} onClick={() => handleLoadFilter(savedFilter)}>
              <ListItemIcon>
                <BookmarkIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={savedFilter.name} />
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteSavedFilter(savedFilter.id);
                }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </MenuItem>
          ))
        )}
      </Menu>

      {/* Save Filter Dialog */}
      {saveDialogOpen && (
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Save Filter Preset
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter filter name..."
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Stack direction="row" spacing={2}>
            <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleSaveFilter}
              disabled={!filterName.trim()}
            >
              Save
            </Button>
          </Stack>
        </Paper>
      )}
    </Box>
  );
};

export default AdvancedSearchFilter;
