import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  TextField,
  Button,
  Chip,
  Stack,
  Divider,
  Radio,
  RadioGroup,
  Tooltip
} from '@mui/material';
import {
  ExpandMore,
  FilterList,
  Clear,
  AttachMoney,
  Business,
  Category,
  Room,
  TrendingUp,
  Store as StoreIcon,
  LocalShipping as LocalShippingIcon,
  Handshake as HandshakeIcon
} from '@mui/icons-material';
import { BUSINESS_MODEL_CONFIG, getBusinessModelsByCategory } from '../../constants/businessModels';

const FacetedFilters = ({ 
  brands = [],
  filters,
  onFilterChange,
  onClearFilters
}) => {
  const [expanded, setExpanded] = useState(['category', 'investment']);

  // Calculate facet counts
  const facets = useMemo(() => {
    const categories = {};
    const industries = {};
    const models = {};
    const businessModels = {}; // New: Business model counts
    const locations = {};
    const investmentRanges = {
      'under50k': { label: 'Under ₹50K', min: 0, max: 50000, count: 0 },
      '50k-100k': { label: '₹50K - ₹100K', min: 50000, max: 100000, count: 0 },
      '100k-250k': { label: '₹100K - ₹250K', min: 100000, max: 250000, count: 0 },
      '250k-500k': { label: '₹250K - ₹500K', min: 250000, max: 500000, count: 0 },
      '500k-1m': { label: '₹500K - ₹1M', min: 500000, max: 1000000, count: 0 },
      'over1m': { label: 'Over ₹1M', min: 1000000, max: Infinity, count: 0 }
    };

    brands.forEach(brand => {
      // Categories
      const category = brand.brandCategory || 'Other';
      categories[category] = (categories[category] || 0) + 1;

      // Industries
      if (brand.industries && Array.isArray(brand.industries)) {
        brand.industries.forEach(industry => {
          industries[industry] = (industries[industry] || 0) + 1;
        });
      }

      // Business Models (NEW)
      if (brand.businessModels && Array.isArray(brand.businessModels)) {
        brand.businessModels.forEach(modelId => {
          businessModels[modelId] = (businessModels[modelId] || 0) + 1;
        });
      } else {
        // Default to franchise for brands without businessModels field
        businessModels['franchise'] = (businessModels['franchise'] || 0) + 1;
      }

      // Old business model field (kept for backward compatibility)
      const model = brand.businessModel || 'Other';
      models[model] = (models[model] || 0) + 1;

      // Locations (states)
      if (brand.locations && Array.isArray(brand.locations)) {
        brand.locations.forEach(loc => {
          const state = loc.state || loc;
          locations[state] = (locations[state] || 0) + 1;
        });
      }

      // Investment ranges
      const investment = brand.investmentRange?.min || brand.initialInvestment || brand.investmentRequired || 0;
      Object.keys(investmentRanges).forEach(range => {
        const { min, max } = investmentRanges[range];
        if (investment >= min && investment < max) {
          investmentRanges[range].count += 1;
        }
      });
    });

    return {
      categories: Object.entries(categories)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      industries: Object.entries(industries)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10), // Top 10 industries
      models: Object.entries(models)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      businessModels: Object.entries(businessModels)
        .map(([id, count]) => ({ 
          id, 
          count,
          ...BUSINESS_MODEL_CONFIG[id]
        }))
        .filter(model => model.label) // Only show valid models
        .sort((a, b) => b.count - a.count),
      locations: Object.entries(locations)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 15), // Top 15 states
      investmentRanges: Object.entries(investmentRanges)
        .map(([key, data]) => ({ key, ...data }))
    };
  }, [brands]);

  const handlePanelChange = (panel) => (event, isExpanded) => {
    setExpanded(prev => 
      isExpanded 
        ? [...prev, panel]
        : prev.filter(p => p !== panel)
    );
  };

  const handleCheckboxChange = (filterType, value) => {
    const currentValues = filters[filterType] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFilterChange(filterType, newValues);
  };

  const handleInvestmentChange = (event, newValue) => {
    onFilterChange('investmentRange', {
      min: newValue[0],
      max: newValue[1]
    });
  };

  const activeFilterCount = useMemo(() => {
    return Object.values(filters).reduce((count, value) => {
      if (Array.isArray(value) && value.length > 0) return count + value.length;
      if (value && typeof value === 'object' && (value.min || value.max)) return count + 1;
      return count;
    }, 0);
  }, [filters]);

  return (
    <Box 
      sx={{ 
        p: 0, 
        height: 'fit-content',
        width: '100%',
        maxWidth: '100%'
      }}
    >
      {/* Header */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          mb: 3,
          p: 2.5,
          background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.08), rgba(156, 39, 176, 0.08))',
          borderRadius: '12px 12px 0 0',
          borderBottom: '1px solid',
          borderBottomColor: 'divider'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <FilterList color="primary" sx={{ fontSize: 24 }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Refine Search
          </Typography>
          {activeFilterCount > 0 && (
            <Chip 
              label={activeFilterCount} 
              size="small" 
              color="primary"
              sx={{ fontWeight: 'bold' }}
            />
          )}
        </Box>
        {activeFilterCount > 0 && (
          <Button 
            size="small" 
            startIcon={<Clear />}
            onClick={onClearFilters}
            variant="outlined"
            color="error"
            sx={{ 
              borderRadius: 2,
              fontWeight: 'medium'
            }}
          >
            Clear
          </Button>
        )}
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Active Filters:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            {Object.entries(filters).map(([key, value]) => {
              if (Array.isArray(value)) {
                return value.map(v => (
                  <Chip
                    key={`${key}-${v}`}
                    label={v}
                    size="small"
                    onDelete={() => handleCheckboxChange(key, v)}
                    color="primary"
                    variant="outlined"
                  />
                ));
              }
              return null;
            })}
          </Stack>
          <Divider sx={{ mt: 2 }} />
        </Box>
      )}

      {/* Category Filter */}
      <Accordion 
        expanded={expanded.includes('category')}
        onChange={handlePanelChange('category')}
        elevation={0}
        sx={{ 
          '&:before': { display: 'none' },
          '&:not(:last-child)': { borderBottom: '1px solid', borderColor: 'divider' },
          borderRadius: 2,
          mb: 1,
          mx: 2
        }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Category fontSize="small" color="primary" />
            <Typography sx={{ fontWeight: 'bold' }}>Category</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {facets.categories.map(({ name, count }) => (
              <FormControlLabel
                key={name}
                control={
                  <Checkbox 
                    checked={filters.brandCategory?.includes(name) || false}
                    onChange={() => handleCheckboxChange('brandCategory', name)}
                    size="small"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Typography variant="body2">{name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      ({count})
                    </Typography>
                  </Box>
                }
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* Investment Range Filter */}
      <Accordion 
        expanded={expanded.includes('investment')}
        onChange={handlePanelChange('investment')}
        elevation={0}
        sx={{ '&:before': { display: 'none' } }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AttachMoney fontSize="small" color="primary" />
            <Typography sx={{ fontWeight: 'bold' }}>Investment Range</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {facets.investmentRanges.map(({ key, label, min, max, count }) => (
              <FormControlLabel
                key={key}
                control={
                  <Checkbox 
                    size="small"
                    checked={(filters.investmentRange || []).includes(label)}
                    onChange={() => handleCheckboxChange('investmentRange', label)}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Typography variant="body2">{label}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      ({count})
                    </Typography>
                  </Box>
                }
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* Business Model Filter (NEW - Enhanced) */}
      <Accordion 
        expanded={expanded.includes('businessModels')}
        onChange={handlePanelChange('businessModels')}
        elevation={0}
        sx={{ '&:before': { display: 'none' } }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <StoreIcon fontSize="small" color="primary" />
            <Typography sx={{ fontWeight: 'bold' }}>Partnership Type</Typography>
            {filters.businessModels?.length > 0 && (
              <Chip label={filters.businessModels.length} size="small" color="primary" />
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {facets.businessModels.map(({ id, label, count, icon, color }) => (
              <FormControlLabel
                key={id}
                control={
                  <Checkbox 
                    checked={filters.businessModels?.includes(id) || false}
                    onChange={() => handleCheckboxChange('businessModels', id)}
                    size="small"
                    sx={{ 
                      color: color,
                      '&.Mui-checked': { color: color }
                    }}
                  />
                }
                label={
                  <Tooltip title={BUSINESS_MODEL_CONFIG[id]?.description || ''} arrow>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant="body2">{label}</Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        ({count})
                      </Typography>
                    </Box>
                  </Tooltip>
                }
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* Old Business Model Filter (kept for backward compatibility) */}
      {facets.models.length > 0 && facets.models.some(m => m.name !== 'Other') && (
        <Accordion 
          expanded={expanded.includes('model')}
          onChange={handlePanelChange('model')}
          elevation={0}
          sx={{ '&:before': { display: 'none' } }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Business fontSize="small" color="primary" />
              <Typography sx={{ fontWeight: 'bold' }}>Legacy Model</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              {facets.models.map(({ name, count }) => (
                <FormControlLabel
                  key={name}
                  control={
                    <Checkbox 
                      checked={filters.businessModel?.includes(name) || false}
                      onChange={() => handleCheckboxChange('businessModel', name)}
                      size="small"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <Typography variant="body2">{name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        ({count})
                      </Typography>
                    </Box>
                  }
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Industry Filter */}
      <Accordion 
        expanded={expanded.includes('industry')}
        onChange={handlePanelChange('industry')}
        elevation={0}
        sx={{ '&:before': { display: 'none' } }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUp fontSize="small" color="primary" />
            <Typography sx={{ fontWeight: 'bold' }}>Industry</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {facets.industries.map(({ name, count }) => (
              <FormControlLabel
                key={name}
                control={
                  <Checkbox 
                    checked={filters.industries?.includes(name) || false}
                    onChange={() => handleCheckboxChange('industries', name)}
                    size="small"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Typography variant="body2">{name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      ({count})
                    </Typography>
                  </Box>
                }
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* Location Filter */}
      <Accordion 
        expanded={expanded.includes('location')}
        onChange={handlePanelChange('location')}
        elevation={0}
        sx={{ '&:before': { display: 'none' } }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Room fontSize="small" color="primary" />
            <Typography sx={{ fontWeight: 'bold' }}>Location</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {facets.locations.map(({ name, count }) => (
              <FormControlLabel
                key={name}
                control={
                  <Checkbox 
                    checked={filters.locations?.includes(name) || false}
                    onChange={() => handleCheckboxChange('locations', name)}
                    size="small"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Typography variant="body2">{name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      ({count})
                    </Typography>
                  </Box>
                }
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default FacetedFilters;
