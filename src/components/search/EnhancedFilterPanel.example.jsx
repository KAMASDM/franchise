/**
 * Enhanced Filter Panel Integration Example
 * Demonstrates how to integrate EnhancedFilterPanel with Brands page
 */

import React, { useState, useEffect } from 'react';
import { Container, Box, Grid, Typography } from '@mui/material';
import EnhancedFilterPanel from '../components/search/EnhancedFilterPanel';

/**
 * Example: Brands Page with Enhanced Filters
 */
const BrandsPageExample = () => {
  // Filter state
  const [activeFilters, setActiveFilters] = useState({});
  
  // View state
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [viewDensity, setViewDensity] = useState('comfortable'); // 'compact' | 'comfortable' | 'spacious'
  
  // Brands data
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  
  /**
   * Apply filters to brands
   */
  useEffect(() => {
    let filtered = [...brands];
    
    // Investment range filter
    if (activeFilters.investmentRange?.length > 0) {
      filtered = filtered.filter(brand => {
        return activeFilters.investmentRange.some(range => {
          // Parse range and check if brand investment falls within
          const brandInvestment = brand.investmentRequired || 0;
          
          if (range === 'Under ₹50K') return brandInvestment < 50000;
          if (range === '₹50K - ₹100K') return brandInvestment >= 50000 && brandInvestment < 100000;
          if (range === '₹100K - ₹500K') return brandInvestment >= 100000 && brandInvestment < 500000;
          if (range === 'Above ₹500K') return brandInvestment >= 500000;
          
          return false;
        });
      });
    }
    
    // Verification status filter
    if (activeFilters.verified !== undefined) {
      filtered = filtered.filter(brand => brand.verified === activeFilters.verified);
    }
    
    // ROI filter
    if (activeFilters.minROI) {
      filtered = filtered.filter(brand => (brand.roi || 0) >= activeFilters.minROI);
    }
    
    // Date range filter
    if (activeFilters.dateRange === 'last-30-days') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      filtered = filtered.filter(brand => {
        const createdDate = brand.createdAt?.toDate?.() || new Date(brand.createdAt);
        return createdDate >= thirtyDaysAgo;
      });
    }
    
    // Industry filter
    if (activeFilters.industry?.length > 0) {
      filtered = filtered.filter(brand => 
        activeFilters.industry.includes(brand.industry)
      );
    }
    
    // Location filter
    if (activeFilters.location?.length > 0) {
      filtered = filtered.filter(brand => 
        activeFilters.location.some(loc => 
          brand.city?.includes(loc) || brand.state?.includes(loc)
        )
      );
    }
    
    setFilteredBrands(filtered);
  }, [activeFilters, brands]);
  
  /**
   * Handle filter changes
   */
  const handleFiltersChange = (newFilters) => {
    setActiveFilters(newFilters);
    
    // Optional: Save to URL params for sharing
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        params.set(key, value.join(','));
      } else {
        params.set(key, value);
      }
    });
    
    // Update URL without reload
    // window.history.replaceState({}, '', `?${params.toString()}`);
  };
  
  /**
   * Get grid columns based on density
   */
  const getGridColumns = () => {
    if (viewMode === 'list') return 1;
    
    switch (viewDensity) {
      case 'compact':
        return { xs: 1, sm: 2, md: 3, lg: 4 };
      case 'comfortable':
        return { xs: 1, sm: 2, md: 3 };
      case 'spacious':
        return { xs: 1, sm: 1, md: 2, lg: 3 };
      default:
        return { xs: 1, sm: 2, md: 3 };
    }
  };
  
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Filter Panel */}
      <Box sx={{ mb: 3 }}>
        <EnhancedFilterPanel
          activeFilters={activeFilters}
          onFiltersChange={handleFiltersChange}
          availableFilters={{
            investmentRange: ['Under ₹50K', '₹50K - ₹100K', '₹100K - ₹500K', 'Above ₹500K'],
            industry: ['Food & Beverage', 'Retail', 'Services', 'Education'],
            location: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai'],
          }}
          showViewControls={true}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          viewDensity={viewDensity}
          onViewDensityChange={setViewDensity}
        />
      </Box>
      
      {/* Results Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Showing {filteredBrands.length} of {brands.length} brands
        </Typography>
      </Box>
      
      {/* Brands Grid/List */}
      <Grid container spacing={viewDensity === 'compact' ? 2 : viewDensity === 'comfortable' ? 3 : 4}>
        {filteredBrands.map((brand) => (
          <Grid item key={brand.id} {...getGridColumns()}>
            {/* Your BrandCard component here */}
            <div>{brand.brandName}</div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

/**
 * Usage Tips:
 * 
 * 1. Filter State Management:
 *    - Store filters in component state
 *    - Optionally sync with URL params for sharing
 *    - Persist to localStorage for user preference
 * 
 * 2. Filter Application:
 *    - Use useEffect to re-filter when activeFilters changes
 *    - Apply multiple filters with AND logic (all must match)
 *    - Use OR logic within array filters (any can match)
 * 
 * 3. View Controls Integration:
 *    - Pass viewMode and viewDensity to layout logic
 *    - Adjust grid columns based on density
 *    - Toggle between Card and List components
 * 
 * 4. Filter Presets:
 *    - Default presets are automatically included
 *    - Custom presets saved to localStorage
 *    - Users can create unlimited custom presets
 * 
 * 5. Performance:
 *    - For large datasets, consider memoization
 *    - Use pagination with filters
 *    - Debounce filter changes if needed
 */

export default BrandsPageExample;
