/**
 * Modern Brands Page - Enterprise Level Design
 * Complete redesign with advanced filtering, sorting, and visualization
 */

import React, { useState, useEffect, lazy, Suspense, useMemo } from "react";
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
  Avatar,
  alpha,
  Drawer,
  useMediaQuery,
  Tooltip,
  Divider,
  Stack,
  LinearProgress,
  Badge,
} from "@mui/material";
import {
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  ViewComfy as ComfortViewIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Close as CloseIcon,
  TrendingUp,
  Business,
  LocationOn,
  AttachMoney,
  Star,
  Verified,
  Search as SearchIcon,
  ArrowForward,
  Bookmark,
  BookmarkBorder,
} from "@mui/icons-material";
import BrandCard from "../components/brand/BrandCard";
import BrandListItem from "../components/brand/BrandListItem";
import AdvancedSearchBar from "../components/search/AdvancedSearchBar";
import FacetedFilters from "../components/search/FacetedFilters";
import { BrandGridSkeleton } from "../components/common/SkeletonLoader";
import { NoSearchResultsEmpty } from "../components/common/EmptyState";
import RecentlyViewedBrands from "../components/brand/RecentlyViewedBrands";
import PersonalizedRecommendations from "../components/recommendations/PersonalizedRecommendations";
import { extractTagsFromBrands } from "../components/common/TagFilter";
import { DidYouMean } from "../components/common/SearchSuggestions";
import Breadcrumbs from "../components/common/Breadcrumbs";
import { useBrands } from "../hooks/useBrands";
import { useDevice } from "../hooks/useDevice";
import { useSearchWithURL } from "../hooks/useSearchWithURL";
import { enhancedSearch } from "../utils/fuzzySearch";
import { useGamification } from "../hooks/useGamification";
import { useNavigate } from "react-router-dom";

const BrandsMobile = lazy(() => import("./BrandsMobile"));

const MotionBox = motion(Box);
const MotionCard = motion(Card);

// Sort options
const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended', icon: <TrendingUp /> },
  { value: 'newest', label: 'Newest First', icon: <Star /> },
  { value: 'investment-low', label: 'Investment: Low to High', icon: <AttachMoney /> },
  { value: 'investment-high', label: 'Investment: High to Low', icon: <AttachMoney /> },
  { value: 'roi-high', label: 'Highest ROI', icon: <TrendingUp /> },
  { value: 'alphabetical', label: 'A to Z', icon: <Business /> },
];

// View density options
const VIEW_MODES = [
  { value: 'comfortable', label: 'Comfortable', icon: <ComfortViewIcon /> },
  { value: 'compact', label: 'Compact', icon: <GridViewIcon /> },
  { value: 'list', label: 'List', icon: <ListViewIcon /> },
];

const BrandsModern = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isMobile } = useDevice();
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { brands, loading, error } = useBrands();
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [filters, setFilters] = useState({});
  const { searchQuery, updateSearchQuery } = useSearchWithURL();
  const [selectedTags, setSelectedTags] = useState([]);
  const [viewMode, setViewMode] = useState('comfortable');
  const [sortBy, setSortBy] = useState('recommended');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { trackVisit } = useGamification();

  useEffect(() => {
    trackVisit();
  }, [trackVisit]);

  // Mobile version
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

  // Filter and search brands
  useEffect(() => {
    let results = brands || [];

    // Apply search
    if (searchQuery && searchQuery.trim()) {
      results = enhancedSearch(results, searchQuery, {
        keys: ['brandName', 'industries', 'businessModel', 'brandStory', 'description'],
        threshold: 0.3,
      });
    }

    // Apply tag filters
    if (selectedTags.length > 0) {
      results = results.filter(brand => {
        const brandTags = [
          brand.category,
          brand.businessModel,
          ...(brand.industries || []),
        ].filter(Boolean);
        return selectedTags.some(tag =>
          brandTags.some(bt => bt && bt.toLowerCase().includes(tag.toLowerCase()))
        );
      });
    }

    // Apply category filter
    if (filters.brandCategory && filters.brandCategory.length > 0) {
      results = results.filter(brand =>
        filters.brandCategory.includes(brand.brandCategory)
      );
    }

    // Apply business model filter
    if (filters.businessModel && filters.businessModel.length > 0) {
      results = results.filter(brand =>
        filters.businessModel.includes(brand.businessModel)
      );
    }

    // Apply industries filter
    if (filters.industries && filters.industries.length > 0) {
      results = results.filter(brand =>
        brand.industries && brand.industries.some(ind =>
          filters.industries.includes(ind)
        )
      );
    }

    // Apply locations filter
    if (filters.locations && filters.locations.length > 0) {
      results = results.filter(brand =>
        brand.locations && brand.locations.some(loc =>
          filters.locations.includes(loc.state || loc)
        )
      );
    }

    // Apply investment range filter
    if (filters.investmentRange && filters.investmentRange.length > 0) {
      results = results.filter(brand => {
        const investment = brand.investmentRange?.min || brand.initialInvestment || brand.investmentRequired || 0;
        return filters.investmentRange.some(range => {
          switch (range) {
            case "Under ₹50K":
              return investment < 50000;
            case "₹50K - ₹100K":
              return investment >= 50000 && investment < 100000;
            case "₹100K - ₹250K":
              return investment >= 100000 && investment < 250000;
            case "₹250K - ₹500K":
              return investment >= 250000 && investment < 500000;
            case "₹500K - ₹1M":
              return investment >= 500000 && investment < 1000000;
            case "Over ₹1M":
              return investment >= 1000000;
            default:
              return true;
          }
        });
      });
    }

    setFilteredBrands(results);
  }, [brands, searchQuery, filters, selectedTags]);

  // Sort brands
  const sortedBrands = useMemo(() => {
    const sorted = [...filteredBrands];
    
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => 
          (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
        );
      case 'investment-low':
        return sorted.sort((a, b) => {
          const invA = a.investmentRange?.min || a.initialInvestment || 0;
          const invB = b.investmentRange?.min || b.initialInvestment || 0;
          return invA - invB;
        });
      case 'investment-high':
        return sorted.sort((a, b) => {
          const invA = a.investmentRange?.min || a.initialInvestment || 0;
          const invB = b.investmentRange?.min || b.initialInvestment || 0;
          return invB - invA;
        });
      case 'roi-high':
        return sorted.sort((a, b) => 
          (b.estimatedROI || 0) - (a.estimatedROI || 0)
        );
      case 'alphabetical':
        return sorted.sort((a, b) => 
          (a.brandName || '').localeCompare(b.brandName || '')
        );
      case 'recommended':
      default:
        return sorted;
    }
  }, [filteredBrands, sortBy]);

  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({});
    updateSearchQuery('');
    setSelectedTags([]);
  };

  const activeFilterCount = useMemo(() => {
    return Object.values(filters).reduce((count, value) => {
      if (Array.isArray(value) && value.length > 0) return count + value.length;
      return count;
    }, 0) + selectedTags.length;
  }, [filters, selectedTags]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${theme.palette.background.default} 50%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`,
        }}
      >
        <Container maxWidth="xl" sx={{ py: 8 }}>
          <BrandGridSkeleton count={9} />
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${theme.palette.background.default} 50%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`,
      }}
    >
      {/* Hero Header */}
      <Box
        sx={{
          position: 'relative',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.08)} 100%)`,
          borderBottom: `1px solid ${theme.palette.divider}`,
          py: { xs: 6, md: 10 },
          overflow: 'hidden',
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '50%',
            height: '100%',
            opacity: 0.05,
            backgroundImage: `radial-gradient(circle, ${theme.palette.primary.main} 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
          }}
        />

        <Container maxWidth="xl">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Breadcrumbs */}
            <Box sx={{ mb: 4 }}>
              <Breadcrumbs />
            </Box>

            {/* Title Section */}
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography
                component="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  fontWeight: 800,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2,
                  lineHeight: 1.2,
                }}
              >
                Discover Your Perfect Franchise
              </Typography>
              <Typography
                variant="h5"
                color="text.secondary"
                sx={{
                  maxWidth: 800,
                  mx: 'auto',
                  fontWeight: 400,
                  lineHeight: 1.6,
                  mb: 2,
                }}
              >
                Explore {brands?.length || 0} verified franchise opportunities with proven business models
              </Typography>

              {/* Quick Stats */}
              <Stack
                direction="row"
                spacing={4}
                justifyContent="center"
                sx={{ mt: 4 }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="700" color="primary.main">
                    {brands?.length || 0}+
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Franchises
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="700" color="secondary.main">
                    50+
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Industries
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="700" color="success.main">
                    98%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Verified Brands
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* Advanced Search */}
            <Box sx={{ maxWidth: 700, mx: 'auto' }}>
              <AdvancedSearchBar
                brands={brands}
                onSearch={(query) => updateSearchQuery(query)}
                showSuggestions={true}
                initialValue={searchQuery}
              />

              {/* Did You Mean */}
              {searchQuery && filteredBrands.length === 0 && brands.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <DidYouMean
                    searchQuery={searchQuery}
                    brands={brands}
                    onSuggestionClick={(suggestion) => updateSearchQuery(suggestion)}
                  />
                </Box>
              )}
            </Box>
          </MotionBox>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        {/* Personalized Recommendations */}
        <Box sx={{ mb: 6 }}>
          <PersonalizedRecommendations
            allBrands={brands}
            limit={6}
            variant="default"
            excludeBrandIds={filteredBrands.map(b => b.id)}
          />
        </Box>

        {/* Control Bar */}
        <Box
          sx={{
            mb: 4,
            p: 3,
            background: theme.palette.background.paper,
            borderRadius: 3,
            boxShadow: `0 2px 12px ${alpha(theme.palette.common.black, 0.08)}`,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            alignItems={{ xs: 'stretch', md: 'center' }}
            justifyContent="space-between"
          >
            {/* Results Count */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Business color="primary" sx={{ fontSize: 28 }} />
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  {sortedBrands.length} Franchise{sortedBrands.length !== 1 ? 's' : ''}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {activeFilterCount > 0 && `${activeFilterCount} filters applied`}
                </Typography>
              </Box>
            </Box>

            {/* Controls */}
            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
              {/* Mobile Filter Button */}
              {isTablet && (
                <Badge badgeContent={activeFilterCount} color="primary">
                  <Button
                    variant="outlined"
                    startIcon={<FilterIcon />}
                    onClick={() => setDrawerOpen(true)}
                  >
                    Filters
                  </Button>
                </Badge>
              )}

              {/* Sort Dropdown */}
              <Box sx={{ minWidth: 200 }}>
                <ToggleButtonGroup
                  value={sortBy}
                  exclusive
                  onChange={(e, newValue) => newValue && setSortBy(newValue)}
                  size="small"
                  sx={{
                    '& .MuiToggleButton-root': {
                      textTransform: 'none',
                      px: 2,
                    }
                  }}
                >
                  {SORT_OPTIONS.slice(0, 3).map((option) => (
                    <ToggleButton key={option.value} value={option.value}>
                      {option.icon}
                      <Typography variant="body2" sx={{ ml: 1, display: { xs: 'none', lg: 'block' } }}>
                        {option.label}
                      </Typography>
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Box>

              {/* View Mode Toggle */}
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(e, newValue) => newValue && setViewMode(newValue)}
                size="small"
              >
                {VIEW_MODES.map((mode) => (
                  <ToggleButton key={mode.value} value={mode.value}>
                    <Tooltip title={mode.label}>
                      {mode.icon}
                    </Tooltip>
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>

              {/* Clear Filters */}
              {activeFilterCount > 0 && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CloseIcon />}
                  onClick={handleClearFilters}
                  size="small"
                >
                  Clear All
                </Button>
              )}
            </Stack>
          </Stack>

          {/* Active Filter Chips */}
          {activeFilterCount > 0 && (
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {Object.entries(filters).map(([key, values]) =>
                Array.isArray(values) && values.length > 0
                  ? values.map((value) => (
                      <Chip
                        key={`${key}-${value}`}
                        label={value}
                        size="small"
                        onDelete={() => {
                          handleFilterChange(
                            key,
                            values.filter((v) => v !== value)
                          );
                        }}
                        color="primary"
                        variant="outlined"
                      />
                    ))
                  : null
              )}
              {selectedTags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  onDelete={() => setSelectedTags(selectedTags.filter((t) => t !== tag))}
                  color="secondary"
                  variant="outlined"
                />
              ))}
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 4 }}>
          {/* Sidebar Filters - Desktop */}
          {!isTablet && (
            <Box
              sx={{
                width: 320,
                flexShrink: 0,
                position: 'sticky',
                top: 100,
                height: 'fit-content',
                maxHeight: 'calc(100vh - 120px)',
                overflowY: 'auto',
              }}
            >
              <Box
                sx={{
                  background: theme.palette.background.paper,
                  borderRadius: 3,
                  boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
                  border: `1px solid ${theme.palette.divider}`,
                  overflow: 'hidden',
                }}
              >
                <FacetedFilters
                  brands={brands}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                />
              </Box>
            </Box>
          )}

          {/* Mobile Filter Drawer */}
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          >
            <Box sx={{ width: 320, p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>
                  Filters
                </Typography>
                <IconButton onClick={() => setDrawerOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <FacetedFilters
                brands={brands}
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
            </Box>
          </Drawer>

          {/* Brand Results */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Recently Viewed */}
            <Box sx={{ mb: 4 }}>
              <RecentlyViewedBrands limit={6} />
            </Box>

            {/* Brand Grid/List */}
            <Box>
              {sortedBrands.length > 0 ? (
                viewMode === 'list' ? (
                  // List View
                  <Stack spacing={2}>
                    {sortedBrands.map((brand, index) => (
                      <motion.div
                        key={brand.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.4,
                          delay: Math.min(index * 0.05, 0.5),
                        }}
                      >
                        <BrandListItem brand={brand} index={index} />
                      </motion.div>
                    ))}
                  </Stack>
                ) : (
                  // Grid View
                  <Grid
                    container
                    spacing={viewMode === 'compact' ? 2 : 3}
                  >
                    {sortedBrands.map((brand, index) => (
                      <Grid
                        item
                        key={brand.id}
                        xs={12}
                        sm={6}
                        lg={viewMode === 'compact' ? 4 : 4}
                        xl={viewMode === 'compact' ? 3 : 4}
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.4,
                            delay: Math.min(index * 0.05, 0.5),
                          }}
                          whileHover={{ y: -4 }}
                          style={{ height: '100%' }}
                        >
                          <BrandCard brand={brand} index={index} />
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                )
              ) : (
                <NoSearchResultsEmpty
                  onReset={handleClearFilters}
                  message="No franchises match your search criteria"
                />
              )}
            </Box>

            {/* Load More / Pagination could go here */}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default BrandsModern;
