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
  const { brands, loading, error } = useBrands(null, { limit: limit });
  const [displayBrands, setDisplayBrands] = useState([]);

  useEffect(() => {
    // Since the hook now handles the limit, we can simplify this.
    // The filter logic would still apply if filters were passed.
    if (brands) {
        let currentFilteredBrands = [...brands];
        // Apply additional client-side filtering if needed
        setDisplayBrands(currentFilteredBrands);
    }
  }, [brands]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="40vh" // Reduced height for loading state
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
        <Typography variant="h5" color="text.secondary">
          No featured franchises available at the moment.
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
    </Box>
  );
};

export default BrandGrid;