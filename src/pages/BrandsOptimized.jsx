/**
 * OPTIMIZED Brands Page - Performance Focused
 * Fixes for 10-second loading issue
 */

import React, { useState, useEffect, lazy, Suspense, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Container,
  Typography,
  Grid,
  CircularProgress,
  Box,
  useTheme,
  Button,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  Card,
  CardContent,
  alpha,
  Drawer,
  useMediaQuery,
  Divider,
  Stack,
  Pagination,
} from "@mui/material";
import {
  ViewList as ListViewIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Close as CloseIcon,
  TrendingUp,
  Business,
  AttachMoney,
  Star,
} from "@mui/icons-material";
import BrandCard from "../components/brand/BrandCard";
import BrandListItem from "../components/brand/BrandListItem";
import AdvancedSearchBar from "../components/search/AdvancedSearchBar";
import { BrandGridSkeleton } from "../components/common/SkeletonLoader";
import { NoSearchResultsEmpty } from "../components/common/EmptyState";
import Breadcrumbs from "../components/common/Breadcrumbs";
import PerformanceMonitor from "../components/debug/PerformanceMonitor";
import { useBrandsOptimized } from "../hooks/useBrandsOptimized";
import { useDevice } from "../hooks/useDevice";
import { useSearchWithURL } from "../hooks/useSearchWithURL";
import { useNavigate } from "react-router-dom";

// Lazy load heavy components
const FacetedFilters = lazy(() => import("../components/search/FacetedFilters"));
const BrandsMobile = lazy(() => import("./BrandsMobile"));
const RecentlyViewedBrands = lazy(() => import("../components/brand/RecentlyViewedBrands"));

const MotionBox = motion(Box);

// Simplified sort options for faster initial load
const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended', icon: <TrendingUp /> },
  { value: 'newest', label: 'Newest', icon: <Star /> },
  { value: 'alphabetical', label: 'A to Z', icon: <Business /> },
];

// Simple search function for initial load (no fuzzy search)
const simpleSearch = (brands, query) => {
  if (!query || !query.trim()) return brands;
  
  const lowerQuery = query.toLowerCase();
  return brands.filter(brand => {
    const searchText = [
      brand.brandName,
      brand.category,
      brand.businessModel,
      ...(brand.industries || [])
    ].join(' ').toLowerCase();
    
    return searchText.includes(lowerQuery);
  });
};

// Simple sort function
const simpleSortBrands = (brands, sortBy) => {
  const sorted = [...brands];
  
  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => 
        (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
      );
    case 'alphabetical':
      return sorted.sort((a, b) => 
        (a.brandName || '').localeCompare(b.brandName || '')
      );
    case 'recommended':
    default:
      return sorted; // Keep original order
  }
};

const BrandsOptimized = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isMobile } = useDevice();
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { brands, loading, error } = useBrandsOptimized();
  
  // Simplified state management
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({});
  const { searchQuery, updateSearchQuery } = useSearchWithURL();
  const [viewMode, setViewMode] = useState('list');
  const [sortBy, setSortBy] = useState('recommended');
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Mobile version with lazy loading
  if (isMobile) {
    return (
      <Suspense
        fallback={
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <CircularProgress />
          </Box>
        }
      >
        <BrandsMobile />
      </Suspense>
    );
  }

  // OPTIMIZED: Only process data when needed, simplified calculations
  const processedBrands = useMemo(() => {
    console.log('Processing brands...', brands?.length || 0);
    let results = brands || [];

    // Apply simple search first (fastest)
    if (searchQuery && searchQuery.trim()) {
      results = simpleSearch(results, searchQuery);
    }

    // Apply basic filters only if any are set
    if (showFilters && Object.keys(filters).length > 0) {
      // Only apply filters if filter panel is open and filters exist
      if (filters.brandCategory && filters.brandCategory.length > 0) {
        results = results.filter(brand =>
          filters.brandCategory.includes(brand.brandCategory)
        );
      }

      if (filters.businessModel && filters.businessModel.length > 0) {
        results = results.filter(brand =>
          filters.businessModel.includes(brand.businessModel)
        );
      }

      // Add other filters only when needed
      // This prevents unnecessary processing on initial load
    }

    // Sort (simple sort)
    results = simpleSortBrands(results, sortBy);

    console.log('Processed results:', results.length);
    return results;
  }, [brands, searchQuery, showFilters, filters, sortBy]);

  // OPTIMIZED: Simple pagination without heavy calculations
  const { paginatedBrands, totalPages } = useMemo(() => {
    const total = Math.ceil(processedBrands.length / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = processedBrands.slice(startIndex, endIndex);
    
    return {
      paginatedBrands: paginated,
      totalPages: total
    };
  }, [processedBrands, page, itemsPerPage]);

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery, sortBy]);

  // Optimized handlers
  const handlePageChange = useCallback((event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleFilterChange = useCallback((filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    updateSearchQuery('');
    setShowFilters(false);
  }, [updateSearchQuery]);

  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  // Fast loading state
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${theme.palette.background.default} 50%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`,
        }}
      >
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Simplified loading skeleton */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Loading Brands...
            </Typography>
            <BrandGridSkeleton count={6} />
          </Box>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h5" color="error" gutterBottom>
          Failed to Load Brands
        </Typography>
        <Typography variant="body1">{error}</Typography>
        <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 2 }}>
          Try Again
        </Button>
      </Container>
    );
  }

  return (
    <>
      <PerformanceMonitor componentName="BrandsOptimized" />
      <Box
        sx={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${theme.palette.background.default} 50%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`,
        }}
      >
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs
          links={[
            { text: 'Home', path: '/' },
            { text: 'Brands', path: '/brands' },
          ]}
          current="Browse Brands"
        />

        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 'bold',
              mb: 1,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Discover Franchise Opportunities
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {processedBrands.length} brands available
          </Typography>
        </Box>

        {/* Search and Controls */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <AdvancedSearchBar
              value={searchQuery}
              onChange={updateSearchQuery}
              placeholder="Search brands, categories, business models..."
              autoFocus={false}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack direction="row" spacing={2} sx={{ height: '100%' }}>
              <Button
                variant={showFilters ? "contained" : "outlined"}
                startIcon={<FilterIcon />}
                onClick={toggleFilters}
                fullWidth
              >
                Filters {showFilters ? '(On)' : ''}
              </Button>
              <ToggleButtonGroup
                value={sortBy}
                exclusive
                onChange={(e, value) => value && setSortBy(value)}
                size="small"
              >
                {SORT_OPTIONS.slice(0, 3).map(option => (
                  <ToggleButton key={option.value} value={option.value}>
                    {option.icon}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Stack>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Filters Sidebar - Lazy loaded */}
          {showFilters && (
            <Grid item xs={12} md={3}>
              <Suspense
                fallback={
                  <Card sx={{ p: 3 }}>
                    <CircularProgress size={20} />
                    <Typography variant="body2" sx={{ ml: 2 }}>
                      Loading filters...
                    </Typography>
                  </Card>
                }
              >
                <FacetedFilters
                  brands={brands || []}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                />
              </Suspense>
            </Grid>
          )}

          {/* Main Content */}
          <Grid item xs={12} md={showFilters ? 9 : 12}>
            {/* Results Info */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                {processedBrands.length} Results
              </Typography>
              
              {Object.keys(filters).length > 0 && (
                <Button
                  variant="text"
                  startIcon={<CloseIcon />}
                  onClick={handleClearFilters}
                  size="small"
                >
                  Clear Filters
                </Button>
              )}
            </Box>

            {/* Brands Grid - Simplified animations */}
            {paginatedBrands.length === 0 ? (
              <NoSearchResultsEmpty 
                searchQuery={searchQuery}
                onClearSearch={() => updateSearchQuery('')}
              />
            ) : (
              <>
                <Grid container spacing={3}>
                  {paginatedBrands.map((brand, index) => (
                    <Grid item xs={12} md={6} lg={4} key={brand.id}>
                      <MotionBox
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        {viewMode === 'list' ? (
                          <BrandListItem brand={brand} />
                        ) : (
                          <BrandCard brand={brand} />
                        )}
                      </MotionBox>
                    </Grid>
                  ))}
                </Grid>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                      size="large"
                    />
                  </Box>
                )}
              </>
            )}

            {/* Recently Viewed - Lazy loaded */}
            {!searchQuery && (
              <Box sx={{ mt: 6 }}>
                <Suspense fallback={null}>
                  <RecentlyViewedBrands />
                </Suspense>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
      </Box>
    </>
  );
};

export default BrandsOptimized;