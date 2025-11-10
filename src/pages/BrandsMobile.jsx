import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Button,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Divider,
  CircularProgress,
  Fab,
  Badge,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Close as CloseIcon,
  TrendingUp,
  AttachMoney,
  LocationOn,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useBrands } from '../hooks/useBrands';
import { SearchService } from '../utils/SearchService';
import { getBrandUrl } from '../utils/brandUtils';

const MotionCard = motion(Card);

/**
 * Mobile-Optimized Brands Page
 * Features: Search, filters drawer, grid view, infinite scroll ready
 */
const BrandsMobile = () => {
  const navigate = useNavigate();
  const { brands, loading, error } = useBrands();
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({
    industries: [],
    businessModels: [],
    investmentRanges: [],
  });

  // Industry options
  const industries = [
    'Food & Beverage',
    'Retail',
    'Healthcare',
    'Education',
    'Fitness',
    'Beauty & Wellness',
    'Technology',
    'Automotive',
    'Real Estate',
    'Home Services',
  ];

  // Business model options
  const businessModels = [
    'Unit Franchise',
    'Multi-Unit Franchise',
    'Master Franchise',
    'Area Development',
    'Dealer/Distributor',
  ];

  // Investment ranges
  const investmentRanges = [
    { label: 'Under ₹5L', min: 0, max: 500000 },
    { label: '₹5L - ₹10L', min: 500000, max: 1000000 },
    { label: '₹10L - ₹25L', min: 1000000, max: 2500000 },
    { label: '₹25L - ₹50L', min: 2500000, max: 5000000 },
    { label: 'Over ₹50L', min: 5000000, max: Infinity },
  ];

  // Apply filters and search
  useEffect(() => {
    let results = brands || [];

    // Apply search
    if (searchQuery.trim()) {
      results = SearchService.searchBrands(results, searchQuery, {
        threshold: 0.3,
        includePartialMatches: true,
        fields: ['brandName', 'industries', 'businessModel', 'brandStory'],
      });
    }

    // Apply industry filter
    if (filters.industries.length > 0) {
      results = results.filter(
        (brand) =>
          brand.industries &&
          brand.industries.some((ind) => filters.industries.includes(ind))
      );
    }

    // Apply business model filter
    if (filters.businessModels.length > 0) {
      results = results.filter((brand) =>
        filters.businessModels.includes(brand.businessModel)
      );
    }

    // Apply investment range filter
    if (filters.investmentRanges.length > 0) {
      results = results.filter((brand) => {
        const investment = brand.brandInvestment || 0;
        return filters.investmentRanges.some((rangeLabel) => {
          const range = investmentRanges.find((r) => r.label === rangeLabel);
          return investment >= range.min && investment < range.max;
        });
      });
    }

    setFilteredBrands(results);
  }, [brands, searchQuery, filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => {
      const currentValues = prev[filterType] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return { ...prev, [filterType]: newValues };
    });
  };

  const clearFilters = () => {
    setFilters({
      industries: [],
      businessModels: [],
      investmentRanges: [],
    });
  };

  const getActiveFilterCount = () => {
    return (
      filters.industries.length +
      filters.businessModels.length +
      filters.investmentRanges.length
    );
  };

  const formatInvestment = (amount) => {
    if (!amount) return 'Contact for details';
    const lakh = amount / 100000;
    return `₹${lakh.toFixed(1)}L`;
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="background.default"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3} textAlign="center">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Search Header */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          position: 'sticky',
          top: 56,
          zIndex: 1000,
        }}
      >
        <TextField
          fullWidth
          placeholder="Search brands, industries..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            bgcolor: 'background.default',
            borderRadius: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              fontSize: '1rem', // Better mobile readability
              '& input': {
                minHeight: 48, // WCAG touch target
                padding: '12px 14px',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" sx={{ fontSize: 24 }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton 
                  size="small" 
                  onClick={() => setSearchQuery('')}
                  sx={{ 
                    minWidth: 40,
                    minHeight: 40,
                  }}
                  aria-label="Clear search"
                >
                  <CloseIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Active Filters Summary */}
        {getActiveFilterCount() > 0 && (
          <Box display="flex" gap={1} mt={1.5} flexWrap="wrap">
            {filters.industries.map((industry) => (
              <Chip
                key={industry}
                label={industry}
                size="small"
                onDelete={() => handleFilterChange('industries', industry)}
                sx={{ 
                  height: 32, // Better touch target
                  fontSize: '0.85rem',
                }}
              />
            ))}
            {filters.businessModels.map((model) => (
              <Chip
                key={model}
                label={model}
                size="small"
                onDelete={() => handleFilterChange('businessModels', model)}
                sx={{ 
                  height: 32,
                  fontSize: '0.85rem',
                }}
              />
            ))}
            {filters.investmentRanges.map((range) => (
              <Chip
                key={range}
                label={range}
                size="small"
                onDelete={() => handleFilterChange('investmentRanges', range)}
                sx={{ 
                  height: 32,
                  fontSize: '0.85rem',
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Results Count */}
      <Box p={2} pb={1}>
        <Typography variant="body2" color="text.secondary">
          {filteredBrands.length} {filteredBrands.length === 1 ? 'brand' : 'brands'} found
        </Typography>
      </Box>

      {/* Brand Grid */}
      <Box px={2} pb={10}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: 2,
          }}
        >
          {filteredBrands.length > 0 ? (
            filteredBrands.map((brand, idx) => (
              <MotionCard
                key={brand.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => navigate(getBrandUrl(brand))}
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:active': {
                    transform: 'scale(0.98)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="120"
                  image={brand.brandImage || brand.brandLogo || '/placeholder.jpg'}
                  alt={brand.brandName}
                  sx={{
                    objectFit: 'cover',
                    bgcolor: 'grey.100',
                  }}
                />
                <CardContent sx={{ p: 1.5, pb: 1.5 }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    gutterBottom
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      minHeight: 40,
                      lineHeight: 1.3,
                    }}
                  >
                    {brand.brandName}
                  </Typography>

                  {brand.industries && brand.industries.length > 0 && (
                    <Chip
                      label={brand.industries[0]}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.65rem',
                        mb: 1,
                        bgcolor: 'primary.lighter',
                        color: 'primary.main',
                      }}
                    />
                  )}

                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Investment
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      color="primary.main"
                      sx={{ fontSize: '0.85rem' }}
                    >
                      {formatInvestment(brand.brandInvestment)}
                    </Typography>
                  </Box>
                </CardContent>
              </MotionCard>
            ))
          ) : (
            <Box
              gridColumn="1 / -1"
              textAlign="center"
              py={8}
            >
              <Typography variant="body1" color="text.secondary">
                No brands found matching your criteria
              </Typography>
              <Button
                variant="outlined"
                onClick={clearFilters}
                sx={{ mt: 2 }}
              >
                Clear Filters
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {/* Filter FAB */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 80,
          right: 16,
          zIndex: 1200,
        }}
        onClick={() => setFilterDrawerOpen(true)}
      >
        <Badge badgeContent={getActiveFilterCount()} color="error">
          <FilterIcon />
        </Badge>
      </Fab>

      {/* Filter Drawer */}
      <Drawer
        anchor="bottom"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            maxHeight: '85vh',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          },
        }}
      >
        <Box>
          {/* Drawer Header */}
          <AppBar
            position="static"
            elevation={0}
            sx={{ bgcolor: 'background.paper', color: 'text.primary' }}
          >
            <Toolbar>
              <Typography variant="h6" flex={1}>
                Filters
              </Typography>
              <Button onClick={clearFilters} size="small">
                Clear All
              </Button>
              <IconButton onClick={() => setFilterDrawerOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>

          <Divider />

          {/* Filter Content */}
          <Box sx={{ p: 2, maxHeight: 'calc(85vh - 64px)', overflowY: 'auto' }}>
            {/* Industries */}
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Industries
            </Typography>
            <FormGroup sx={{ mb: 3 }}>
              {industries.map((industry) => (
                <FormControlLabel
                  key={industry}
                  control={
                    <Checkbox
                      checked={filters.industries.includes(industry)}
                      onChange={() => handleFilterChange('industries', industry)}
                    />
                  }
                  label={industry}
                />
              ))}
            </FormGroup>

            <Divider sx={{ my: 2 }} />

            {/* Business Models */}
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Business Model
            </Typography>
            <FormGroup sx={{ mb: 3 }}>
              {businessModels.map((model) => (
                <FormControlLabel
                  key={model}
                  control={
                    <Checkbox
                      checked={filters.businessModels.includes(model)}
                      onChange={() => handleFilterChange('businessModels', model)}
                    />
                  }
                  label={model}
                />
              ))}
            </FormGroup>

            <Divider sx={{ my: 2 }} />

            {/* Investment Range */}
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Investment Range
            </Typography>
            <FormGroup sx={{ mb: 3 }}>
              {investmentRanges.map((range) => (
                <FormControlLabel
                  key={range.label}
                  control={
                    <Checkbox
                      checked={filters.investmentRanges.includes(range.label)}
                      onChange={() => handleFilterChange('investmentRanges', range.label)}
                    />
                  }
                  label={range.label}
                />
              ))}
            </FormGroup>
          </Box>

          {/* Apply Button */}
          <Box
            sx={{
              p: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={() => setFilterDrawerOpen(false)}
            >
              Apply Filters ({getActiveFilterCount()})
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default BrandsMobile;
