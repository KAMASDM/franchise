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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import { useFAQs } from "../../hooks/useFAQs";
import { useBrands } from "../../hooks/useBrands";
import { useAuth } from "../../context/AuthContext";
import AddFAQs from "./FAQs/AddFAQs";
import { Search, ExpandMore, Clear } from "@mui/icons-material";

const FAQs = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { brands, loading: brandsLoading } = useBrands(user);
  const { faqs, loading: faqsLoading } = useFAQs(user);

  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const filteredFaqs = faqs?.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getBrandImage = (brandName) => {
    const brand = brands?.find((b) => b.brandName === brandName);
    return brand?.brandImage || "";
  };

  if (brandsLoading || faqsLoading) {
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
          Brands FAQs
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
          Here are some frequently asked questions about brands.
        </Typography>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {faqs?.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              You haven't added any FAQs yet.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Start by adding your first FAQ!
            </Typography>
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
              Add New FAQs
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
                    placeholder="Search FAQs..."
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
                          <IconButton onClick={() => setSearchTerm("")}>
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
                    + Add New FAQs
                  </Button>
                </Box>
              </Box>
            </Paper>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" color="text.secondary">
                Showing {filteredFaqs?.length} of {faqs?.length} FAQs
              </Typography>
            </Box>

            <Box sx={{ mt: 3 }}>
              {filteredFaqs?.map((faq) => (
                <Accordion key={faq.id} sx={{ mb: 2 }}>
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    sx={{
                      bgcolor: "background.paper",
                      borderRadius: 1,
                    }}
                  >
                    <Box display="flex" alignItems="center" width="100%">
                      <Avatar
                        src={getBrandImage(faq.brand)}
                        sx={{ mr: 2, width: 40, height: 40 }}
                      />
                      <Box flexGrow={1}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {faq.question}
                        </Typography>
                        <Chip
                          label={faq.brand}
                          size="small"
                          sx={{ mt: 0.5, mr: 1 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          Asked by: {faq.userName}
                        </Typography>
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                      {faq.answer}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      mt={1}
                    >
                      Created: {new Date(faq.createdAt).toLocaleDateString()}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </motion.div>
        )}
      </Container>
      <AddFAQs open={openModal} onClose={handleCloseModal} brands={brands} />
    </>
  );
};

export default FAQs;
