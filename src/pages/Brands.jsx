import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BrandCard from "../components/brand/BrandCard";
import SearchFilters from "../components/home/SearchFilters";
import AdvancedSearchBar from "../components/search/AdvancedSearchBar";
import FacetedFilters from "../components/search/FacetedFilters";
import {
  Container,
  Typography,
  Grid,
  CircularProgress,
  Box,
  useTheme,
} from "@mui/material";
import { useBrands } from "../hooks/useBrands";
import { useSearch } from "../hooks/useSearch";
import { SearchService } from "../utils/SearchService";

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
  const { brands, loading, error } = useBrands();
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [availableFranchiseModels, setAvailableFranchiseModels] = useState([]);
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  // Update filtered brands when brands, search, or filters change
  useEffect(() => {
    let results = brands || [];

    // Apply search using SearchService fuzzy matching
    if (searchQuery && searchQuery.trim()) {
      results = SearchService.searchBrands(results, searchQuery, {
        threshold: 0.3,
        includePartialMatches: true,
        fields: ['brandName', 'industries', 'businessModel', 'brandStory']
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
  }, [brands, searchQuery, filters]);

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
    setSearchQuery('');
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
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
        background: `linear-gradient(to bottom, ${theme.palette.primary[50]}, ${theme.palette.background.paper} 50%, ${theme.palette.secondary[50]})`,
      }}
    >
      <Container maxWidth="xl" sx={{ py: { xs: 5, md: 10 } }}>
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <Typography
            component="h1"
            variant="h2"
            sx={{
              textAlign: "center",
              mb: 2,
              fontSize: { xs: "2.25rem", md: "3rem" },
            }}
          >
            Featured Franchise Opportunities
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              maxWidth: 800,
              mx: "auto",
              textAlign: "center",
              mb: 4,
            }}
          >
            Discover top-performing restaurant franchises with proven business
            models and strong support systems.
          </Typography>

          {/* Advanced Search Bar */}
          <Box sx={{ maxWidth: 800, mx: "auto", mb: 6 }}>
            <AdvancedSearchBar 
              brands={brands}
              onSearch={handleSearch}
              showSuggestions={true}
            />
          </Box>
        </motion.div>

        <Grid container spacing={3}>
          {/* Faceted Filters Sidebar */}
          <Grid item xs={12} md={3}>
            <FacetedFilters
              brands={brands}
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </Grid>

          {/* Brand Results */}
          <Grid item xs={12} md={9}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Showing {filteredBrands.length} of {brands?.length || 0} franchises
              </Typography>
            </Box>

            <Grid container spacing={4}>
              {filteredBrands.length > 0 ? (
                filteredBrands.map((brand) => (
                  <Grid item key={brand.id} xs={12} sm={6} lg={4}>
                    <BrandCard brand={brand} />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                    {brands.length === 0
                      ? "No brands available yet."
                      : "No brands found matching your criteria."}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Brands;
