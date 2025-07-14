import React, { useState, useEffect } from "react";
import { Grid, Box, Typography, Button, Container } from "@mui/material";
import { motion } from "framer-motion";
import BrandCard from "./BrandCard";
import { brandsData } from "../../data/brandsData";

const MotionBox = motion(Box);

const BrandGrid = ({ featured = false, limit = null, filters = null }) => {
  const [displayBrands, setDisplayBrands] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    let filteredBrands = [...brandsData];

    if (filters) {
      if (filters.keyword) {
        filteredBrands = filteredBrands.filter((brand) =>
          [brand.name, brand.category, brand.description]
            .join(" ")
            .toLowerCase()
            .includes(filters.keyword.toLowerCase())
        );
      }

      if (filters.category && filters.category !== "All Categories") {
        filteredBrands = filteredBrands.filter(
          (brand) =>
            brand.category.toLowerCase() === filters.category.toLowerCase()
        );
      }

      if (filters.investment && filters.investment !== "All Ranges") {
        const parseInvestment = (investmentString) => {
          const match = investmentString.match(/\$(\d+(?:,\d+)*)(K)?/);
          if (!match) return 0;
          const value = parseInt(match[1].replace(/,/g, ""));
          return match[2] === "K" ? value * 1000 : value;
        };

        filteredBrands = filteredBrands.filter((brand) => {
          const brandMin = parseInvestment(brand.investment);
          switch (filters.investment) {
            case "Under $100K":
              return brandMin < 100000;
            case "$100K - $200K":
              return brandMin >= 100000 && brandMin <= 200000;
            case "$200K - $300K":
              return brandMin >= 200000 && brandMin <= 300000;
            case "$300K - $500K":
              return brandMin >= 300000 && brandMin <= 500000;
            case "Over $500K":
              return brandMin > 500000;
            default:
              return true;
          }
        });
      }

      if (filters.minROI) {
        filteredBrands = filteredBrands.filter((brand) => {
          const roi = parseInt(brand.roi.split("-")[0]);
          return roi >= parseInt(filters.minROI);
        });
      }
    }

    if (featured) {
      filteredBrands = filteredBrands.filter((brand) => brand.locations > 75);
    }

    if (limit && !showAll) {
      filteredBrands = filteredBrands.slice(0, limit);
    }

    setDisplayBrands(filteredBrands);
  }, [featured, limit, filters, showAll]);

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
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {displayBrands.map((brand, index) => (
          <Grid item xs={12} sm={6} md={4} key={brand.id}>
            <BrandCard brand={brand} index={index} />
          </Grid>
        ))}
      </Grid>

      {limit && displayBrands.length >= limit && !showAll && (
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
