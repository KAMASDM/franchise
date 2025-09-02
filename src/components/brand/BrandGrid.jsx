import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  CircularProgress,
} from "@mui/material";
import BrandCard from "./BrandCard";
import { motion } from "framer-motion";
import { useBrands } from "../../hooks/useBrands";

const MotionBox = motion(Box);

const BrandGrid = ({ limit = null, filters = null }) => {
  const { brands, loading, error } = useBrands();
  const [showAll, setShowAll] = useState(false);
  const [displayBrands, setDisplayBrands] = useState([]);

  const applyFilters = useCallback(() => {
    let currentFilteredBrands = [...brands];

    if (filters) {
      if (filters.keyword) {
        const lowercasedKeyword = filters.keyword.toLowerCase();
        currentFilteredBrands = currentFilteredBrands.filter(
          (brand) =>
            brand.brandName?.toLowerCase().includes(lowercasedKeyword) ||
            (brand.industries &&
              brand.industries.some((industry) =>
                industry.toLowerCase().includes(lowercasedKeyword)
              )) ||
            brand.businessModel?.toLowerCase().includes(lowercasedKeyword) ||
            brand.brandStory?.toLowerCase().includes(lowercasedKeyword) ||
            brand.mission?.toLowerCase().includes(lowercasedKeyword) ||
            brand.productsServices?.toLowerCase().includes(lowercasedKeyword) ||
            brand.competitiveAdvantage
              ?.toLowerCase()
              .includes(lowercasedKeyword)
        );
      }

      if (filters.industry && filters.industry !== "All Industries") {
        currentFilteredBrands = currentFilteredBrands.filter(
          (brand) =>
            brand.industries && brand.industries.includes(filters.industry)
        );
      }

      if (filters.investmentRange && filters.investmentRange !== "All Ranges") {
        currentFilteredBrands = currentFilteredBrands.filter(
          (brand) => brand.investmentRange === filters.investmentRange
        );
      }

      if (filters.franchiseModel && filters.franchiseModel !== "All Models") {
        currentFilteredBrands = currentFilteredBrands.filter(
          (brand) => brand.franchiseModel === filters.franchiseModel
        );
      }
    }

    if (limit && !showAll) {
      currentFilteredBrands = currentFilteredBrands.slice(0, limit);
    }

    setDisplayBrands(currentFilteredBrands);
  }, [brands, limit, filters, showAll]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

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

  if (displayBrands.length === 0) {
    return (
      <Container maxWidth="md" sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
          No franchises found matching your criteria
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Try adjusting your filters or search terms to see more results.
        </Typography>
      </Container>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {displayBrands.map((brand, index) => (
          <Box
            key={brand.id}
            sx={{
              width: {
                xs: "100%",
                sm: "calc(50% - 12px)",
                md: "calc(33.333% - 21.33px)",
              },
            }}
          >
            <BrandCard brand={brand} index={index} />
          </Box>
        ))}
      </Box>

      {limit && brands.length > limit && !showAll && (
        <MotionBox
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          sx={{ textAlign: "center", mt: 6 }}
        >
          <Button
            variant="outlined"
            size="large"
            onClick={() => setShowAll(true)}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 25,
              fontWeight: "bold",
              fontSize: "1.1rem",
            }}
          >
            Show More Franchises
          </Button>
        </MotionBox>
      )}
    </Box>
  );
};

export default BrandGrid;
