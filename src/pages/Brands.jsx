import React, { useState, useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import BrandCard from "../components/brand/BrandCard";
import SearchFilters from "../components/home/SearchFilters";
import AdvancedSearchBar from "../components/search/AdvancedSearchBar";
import FacetedFilters from "../components/search/FacetedFilters";
import { BrandGridSkeleton } from "../components/common/SkeletonLoader";
import { NoBrandsEmpty, NoSearchResultsEmpty } from "../components/common/EmptyState";
import RecentlyViewedBrands from "../components/brand/RecentlyViewedBrands";
import PersonalizedRecommendations from "../components/recommendations/PersonalizedRecommendations";
import TagFilter, { InlineTagFilter, extractTagsFromBrands } from "../components/common/TagFilter";
import { SearchSuggestions, DidYouMean } from "../components/common/SearchSuggestions";
import VirtualizedBrandList from "../components/common/VirtualizedList";
import Breadcrumbs from "../components/common/Breadcrumbs";
import { FavoriteButton } from "../components/favorites/FavoritesPage";
import {
  Container,
  Typography,
  Grid,
  CircularProgress,
  Box,
  useTheme,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import { Store as StoreIcon, TrendingUp } from "@mui/icons-material";
import { useBrands } from "../hooks/useBrands";
import { useSearch } from "../hooks/useSearch";
import { SearchService } from "../utils/SearchService";
import { useDevice } from "../hooks/useDevice";
import { useSearchWithURL } from "../hooks/useSearchWithURL";
import { enhancedSearch, getDidYouMean } from "../utils/fuzzySearch";
import { useGamification } from "../hooks/useGamification";

// Lazy load mobile version
const BrandsMobile = lazy(() => import("./BrandsMobile"));

const industries = [
  "Food & Beverage",
  "Retail",
  "Healthcare",
  "Education",
  "Fitness",
  "Beauty & Wellness",
  "Technology",
  "Automotive",
  "Real Estate",
  "Home Services",
  "Entertainment",
  "Travel & Hospitality",
  "Other",
];

const investmentRanges = [
  "Under ₹50K",
  "₹50K - ₹100K",
  "₹100K - ₹250K",
  "₹250K - ₹500K",
  "₹500K - ₹1M",
  "Over ₹1M",
];

const franchiseModelOptions = [
  "Unit",
  "Multicity",
  "Dealer/Distributor",
  "Master Franchise",
];

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
};

const Brands = () => {
  const theme = useTheme();
  const { isMobile } = useDevice();
  const { brands, loading, error } = useBrands();
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [availableFranchiseModels, setAvailableFranchiseModels] = useState([]);
  const [filters, setFilters] = useState({});
  const { searchQuery, updateSearchQuery } = useSearchWithURL();
  const [selectedTags, setSelectedTags] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const { trackVisit } = useGamification();

  // Track visit for gamification
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

  // Desktop version continues below...

  // Update filtered brands when brands, search, or filters change
  useEffect(() => {
    let results = brands || [];

    // Apply enhanced fuzzy search
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
          brand.initialInvestment < 50000 ? 'Low Investment' : null,
          brand.estimatedROI > 20 ? 'High ROI' : null,
        ].filter(Boolean);
        
        return selectedTags.some(tag => 
          brandTags.some(bt => bt && bt.toLowerCase().includes(tag.toLowerCase()))
        );
      });
    }

    // Apply filters
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

    if (filters.industries && filters.industries.length > 0) {
      results = results.filter(brand => 
        brand.industries && brand.industries.some(ind => 
          filters.industries.includes(ind)
        )
      );
    }

    if (filters.locations && filters.locations.length > 0) {
      results = results.filter(brand => 
        brand.locations && brand.locations.some(loc => 
          filters.locations.includes(loc.state || loc)
        )
      );
    }

    setFilteredBrands(results);
  }, [brands, searchQuery, filters, selectedTags]);

  useEffect(() => {
    if (brands && brands.length > 0) {
      const models = new Set();
      brands.forEach((brand) => {
        if (Array.isArray(brand.franchiseModels)) {
          brand.franchiseModels.forEach((model) => models.add(model));
        } else if (brand.franchiseModel) {
          models.add(brand.franchiseModel);
        }
      });
      setAvailableFranchiseModels(Array.from(models));
    }
  }, [brands]);

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

  const handleSearch = (query) => {
    updateSearchQuery(query);
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${theme.palette.primary[50]} 0%, ${theme.palette.background.paper} 40%, ${theme.palette.secondary[50]} 100%)`,
        }}
      >
        <Box
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
            borderBottom: `1px solid ${theme.palette.divider}`,
            py: { xs: 4, md: 8 },
            mb: 4,
          }}
        >
          <Container maxWidth="xl">
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography
                component="h1"
                variant="h2"
                sx={{
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2,
                }}
              >
                Franchise Marketplace
              </Typography>
            </Box>
          </Container>
        </Box>
        <Container maxWidth="xl" sx={{ pb: 8 }}>
          <BrandGridSkeleton count={6} />
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
        background: `linear-gradient(135deg, ${theme.palette.primary[50]} 0%, ${theme.palette.background.paper} 40%, ${theme.palette.secondary[50]} 100%)`,
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
          borderBottom: `1px solid ${theme.palette.divider}`,
          py: { xs: 4, md: 8 },
          mb: 4,
        }}
      >
        <Container maxWidth="xl">
          <motion.div variants={itemVariants} initial="hidden" animate="visible">
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography
                component="h1"
                variant="h2"
                sx={{
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2,
                }}
              >
                Franchise Marketplace
              </Typography>
              <Typography
                variant="h5"
                color="text.secondary"
                sx={{
                  maxWidth: 700,
                  mx: "auto",
                  fontWeight: 300,
                  lineHeight: 1.6,
                  mb: 4,
                }}
              >
                Discover premium franchise opportunities with proven business models and comprehensive support systems
              </Typography>

              {/* Advanced Search Bar */}
              <Box sx={{ maxWidth: 600, mx: "auto" }}>
                <AdvancedSearchBar 
                  brands={brands}
                  onSearch={(query) => updateSearchQuery(query)}
                  showSuggestions={true}
                  initialValue={searchQuery}
                />
                
                {/* Did You Mean Suggestion */}
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

              {/* Tag Filter - Inline */}
              <Box sx={{ mt: 3, maxWidth: 800, mx: "auto" }}>
                <InlineTagFilter 
                  tags={extractTagsFromBrands(brands, ['category', 'industries'])}
                  selectedTags={selectedTags}
                  onTagClick={(tag) => {
                    setSelectedTags(prev => 
                      prev.includes(tag) 
                        ? prev.filter(t => t !== tag)
                        : [...prev, tag]
                    );
                  }}
                />
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Breadcrumbs */}
      <Container maxWidth="xl">
        <Breadcrumbs />
      </Container>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ pb: 8 }}>
        {/* Personalized Recommendations */}
        <Box sx={{ mb: 4 }}>
          <PersonalizedRecommendations 
            allBrands={brands}
            limit={6}
            variant="default"
            excludeBrandIds={filteredBrands.map(b => b.id)}
          />
        </Box>
        <Box sx={{ 
          display: 'flex', 
          gap: { xs: 3, lg: 4 }, 
          flexDirection: { xs: 'column', lg: 'row' },
          alignItems: 'flex-start'
        }}>
          {/* Filters Sidebar */}
          <Box 
            sx={{ 
              width: { xs: '100%', lg: '320px' }, 
              flexShrink: 0,
              position: { lg: 'sticky' },
              top: { lg: 120 },
              zIndex: 1,
            }}
          >
            <Box
              sx={{
                background: theme.palette.background.paper,
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: `1px solid ${theme.palette.divider}`,
                overflow: 'hidden'
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

          {/* Brand Results */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Recently Viewed Brands */}
            <RecentlyViewedBrands limit={6} />

            {/* Results Header */}
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
                p: 3,
                background: theme.palette.background.paper,
                borderRadius: 2,
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                border: `1px solid ${theme.palette.divider}`
              }}
            >
              <Typography 
                variant="h6" 
                fontWeight={600}
                sx={{ 
                  color: theme.palette.text.primary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <StoreIcon color="primary" />
                {filteredBrands.length} Franchise{filteredBrands.length !== 1 ? 's' : ''} Available
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Out of {brands?.length || 0} total opportunities
              </Typography>
            </Box>

            {/* Brand Cards Grid */}
            <Box sx={{ minHeight: '400px' }}>
              {filteredBrands.length > 0 ? (
                // Use virtualized list for performance if more than 50 brands
                filteredBrands.length > 50 ? (
                  <VirtualizedBrandList 
                    brands={filteredBrands}
                    height={800}
                  />
                ) : (
                  <Grid 
                    container 
                    spacing={{ xs: 3, md: 4 }}
                    sx={{
                      '& .MuiGrid-item': {
                        display: 'flex',
                        alignItems: 'stretch'
                      }
                    }}
                  >
                    {filteredBrands.map((brand, index) => (
                      <Grid 
                        item 
                        key={brand.id} 
                        xs={12} 
                        sm={6} 
                        xl={4}
                        sx={{ display: 'flex' }}
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ 
                            duration: 0.5, 
                            delay: Math.min(index * 0.1, 1),
                            ease: "easeOut"
                          }}
                          whileHover={{ y: -8 }}
                          style={{ 
                            height: '100%', 
                            width: '100%',
                            display: 'flex'
                          }}
                        >
                          <BrandCard brand={brand} index={index} />
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                )
              ) : brands.length === 0 ? (
                <NoBrandsEmpty />
              ) : (
                <NoSearchResultsEmpty 
                  onReset={handleClearFilters}
                  message="No franchises match your search criteria"
                />
              )}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Brands;
