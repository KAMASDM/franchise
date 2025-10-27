import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import { useBrands } from "../../hooks/useBrands";
import { useAuth } from "../../context/AuthContext";
import { useTestimonials } from "../../hooks/useTestimonials";
import { Search, Clear } from "@mui/icons-material";
import AddReview from "./Review/AddReview";
import ReviewCardView from "./Review/ReviewCardView";
import ReviewTableView from "./Review/ReviewTableView";

const Review = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const { brands, loading: brandsLoading } = useBrands(user);
  const { testimonials, loading: testimonialsLoading } = useTestimonials(user);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const filteredTestimonials = testimonials.filter((testimonial) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      testimonial.userName.toLowerCase().includes(searchLower) ||
      testimonial.brand.toLowerCase().includes(searchLower) ||
      testimonial.content.toLowerCase().includes(searchLower)
    );
  });

  if (brandsLoading || testimonialsLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          p: { xs: 2, sm: 3, md: 4 },
          textAlign: "center",
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          fontWeight="bold"
          sx={{
            fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3rem" },
            mb: { xs: 1, md: 2 },
          }}
        >
          Brands Review
        </Typography>
        <Typography
          variant="h6"
          sx={{
            opacity: 0.9,
            fontSize: { xs: "1rem", sm: "1.2rem", md: "1.25rem" },
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          Read what our clients say about their experience with our franchise
          opportunities.
        </Typography>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {testimonials.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              You haven't add any reviews yet.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Start your journey by registering your first brand!
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={handleOpenModal}
              sx={{
                bgcolor: "secondary.main",
                "&:hover": { bgcolor: "secondary.dark" },
              }}
            >
              Add New Review
            </Button>
          </Box>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              elevation={2}
              sx={{
                p: 3,
                mb: 3,
                bgcolor: "background.paper",
                borderRadius: 2,
              }}
            >
              <Box
                display="flex"
                flexDirection={isMobile ? "column" : "row"}
                alignItems={isMobile ? "stretch" : "center"}
                justifyContent="space-between"
                gap={2}
              >
                <Box
                  display="flex"
                  flexDirection={isMobile ? "column" : "row"}
                  gap={3}
                  width={isMobile ? "100%" : "auto"}
                >
                  <TextField
                    fullWidth={isMobile}
                    variant="outlined"
                    placeholder="Search reviews..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: searchTerm && (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setSearchTerm("")} aria-label="Clear search">
                            <Clear fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      flex: isMobile ? "none" : 1,
                      maxWidth: isMobile ? "100%" : "400px",
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleOpenModal}
                    sx={{
                      bgcolor: "primary.main",
                      "&:hover": { bgcolor: "primary.dark" },
                    }}
                  >
                    + Add New Review
                  </Button>
                </Box>
              </Box>
            </Paper>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" color="text.secondary">
                Showing {filteredTestimonials.length} of{" "}
                {filteredTestimonials.length} reviews
              </Typography>
            </Box>

            {isMobile ? (
              <ReviewCardView testimonials={filteredTestimonials} />
            ) : (
              <ReviewTableView testimonials={filteredTestimonials} />
            )}
          </motion.div>
        )}
      </Container>
      <AddReview open={openModal} onClose={handleCloseModal} brands={brands} />
    </>
  );
};

export default Review;
