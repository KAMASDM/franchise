import React from "react";
import { motion } from "framer-motion";
import BrandGrid from "../brand/BrandGrid";
import { Box, Typography, Button } from "@mui/material";

const MotionBox = motion(Box);

const FeaturedFranchise = () => {
  return (
    <Box component="section" sx={{ py: { xs: 6, md: 10 }, px: 2 }}>
      <MotionBox
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        sx={{ textAlign: "center", mb: 6 }}
      >
        <Typography
          variant="h3"
          component="h2"
          fontWeight="bold"
          sx={{ mb: 3, color: "text.primary" }}
        >
          Featured Franchise Opportunities
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: "auto", lineHeight: 1.6 }}
        >
          Discover top-performing restaurant franchises with proven business
          models and strong support systems.
        </Typography>
      </MotionBox>

      <BrandGrid limit={6} />

      <Box sx={{ textAlign: "center", mt: 6 }}>
        <Button
          variant="contained"
          size="large"
          href="/brands"
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 25,
            fontWeight: "bold",
            fontSize: "1.1rem",
          }}
        >
          View All Franchises
        </Button>
      </Box>
    </Box>
  );
};

export default FeaturedFranchise;
