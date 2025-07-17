import React from "react";
import { motion } from "framer-motion";
import BrandGrid from "../brand/BrandGrid";
import { Box, Typography, Button, useTheme, Container } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { ArrowForward } from "@mui/icons-material";

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const FeaturedFranchise = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        background: `linear-gradient(to bottom, ${theme.palette.primary[50]}, ${theme.palette.background.paper}, ${theme.palette.secondary[50]})`,
        color: "text.primary",
        py: { xs: 6, md: 10 },
      }}
    >
      <Container maxWidth="xl">
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}
        >
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontWeight: 600,
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
              mb: 2,
              color: "text.primary",
            }}
          >
            Featured Franchise Opportunities
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              maxWidth: "700px",
              mx: "auto",
              lineHeight: 1.6,
              fontWeight: 300,
            }}
          >
            Discover top-performing restaurant franchises with proven business
            models and strong support systems, ready for you to explore.
          </Typography>
        </MotionBox>

        <BrandGrid limit={6} />

        <Box sx={{ textAlign: "center", mt: { xs: 5, md: 7 } }}>
          <MotionButton
            variant="contained"
            color="primary"
            size="large"
            component={RouterLink}
            to="/brands"
            endIcon={<ArrowForward />}
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
            sx={{
              px: { xs: 3, sm: 5 },
              py: 1.5,
              textTransform: "none",
              fontSize: { xs: "1rem", sm: "1.1rem" },
              "&:hover": {
                boxShadow: theme.shadows[6],
              },
            }}
          >
            View All Franchises
          </MotionButton>
        </Box>
      </Container>
    </Box>
  );
};

export default FeaturedFranchise;
