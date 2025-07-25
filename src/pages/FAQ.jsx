import React, { useState } from "react";
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Avatar,
  useTheme,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import { useFAQs } from "../hooks/useFAQs";
import { ExpandMore, HelpOutline, Restaurant } from "@mui/icons-material";

const MotionBox = motion(Box);

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
};

const FAQ = () => {
  const theme = useTheme();
  const { faqs, loading, error } = useFAQs();
  const [selectedBrand, setSelectedBrand] = useState("All");

  const brands = ["All", ...new Set(faqs.map((faq) => faq.brand))];

  const filteredFAQs =
    selectedBrand === "All"
      ? faqs
      : faqs.filter((faq) => faq.brand === selectedBrand);

  if (loading)
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

  if (error)
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h4" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
        <Button
          variant="contained"
          onClick={() => window.location.reload()}
          sx={{ mt: 2, borderRadius: 25 }}
        >
          Retry
        </Button>
      </Container>
    );

  return (
    <Box
      sx={{
        background: `linear-gradient(to bottom, ${theme.palette.primary[50]}, ${theme.palette.background.paper} 50%, ${theme.palette.secondary[50]})`,
        minHeight: "100vh",
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
            Frequently Asked Questions
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              maxWidth: 800,
              mx: "auto",
              textAlign: "center",
              mb: { xs: 8, md: 10 },
            }}
          >
            Have questions? We've got answers. Explore our most common inquiries
            to learn more about our franchise programs, services, and what we
            offer.
          </Typography>
        </motion.div>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
          }}
        >
          <Box
            sx={{
              width: { xs: "100%", md: 250 },
              flexShrink: 0,
              mb: { xs: 4, md: 0 },
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Filter by Brand
            </Typography>
            <List
              sx={{
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                overflow: "hidden",
              }}
            >
              {brands.map((brand) => (
                <ListItem key={brand} disablePadding>
                  <ListItemButton
                    selected={selectedBrand === brand}
                    onClick={() => setSelectedBrand(brand)}
                    sx={{
                      "&.Mui-selected": {
                        backgroundColor: theme.palette.primary[50],
                        borderLeft: `4px solid ${theme.palette.primary.main}`,
                      },
                      px: 3,
                      py: 1.5,
                    }}
                  >
                    <ListItemText
                      primary={brand}
                      primaryTypographyProps={{ fontWeight: "medium" }}
                    />
                    <Chip
                      label={
                        faqs.filter((f) =>
                          brand === "All" ? true : f.brand === brand
                        ).length
                      }
                      size="small"
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>

          <Box sx={{ flexGrow: 1 }}>
            {filteredFAQs.length === 0 ? (
              <Box
                sx={{
                  textAlign: "center",
                  p: 4,
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                }}
              >
                <Typography variant="h6">
                  No FAQs found for {selectedBrand}
                </Typography>
              </Box>
            ) : (
              <>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                  {selectedBrand === "All"
                    ? "All FAQs"
                    : `${selectedBrand} FAQs`}
                </Typography>
                {filteredFAQs.map((faq, index) => (
                  <MotionBox
                    key={faq.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    sx={{ mb: 2 }}
                  >
                    <Accordion
                      disableGutters
                      sx={{
                        borderRadius: 2,
                        "&:before": { display: "none" },
                        boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                        overflow: "hidden",
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMore color="primary" />}
                        sx={{
                          backgroundColor: theme.palette.primary[50],
                          px: 3,
                          py: 1,
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: "primary.main",
                              color: "primary.contrastText",
                              width: 32,
                              height: 32,
                            }}
                          >
                            <HelpOutline sx={{ fontSize: 20 }} />
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {faq.question}
                            </Typography>
                            {selectedBrand === "All" && (
                              <Chip
                                label={faq.brand}
                                size="small"
                                icon={<Restaurant sx={{ fontSize: 14 }} />}
                                sx={{ mt: 0.5 }}
                              />
                            )}
                          </Box>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails
                        sx={{
                          p: 3,
                          backgroundColor: "background.paper",
                        }}
                      >
                        <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                          {faq.answer}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mt: 2,
                            color: "text.secondary",
                            fontSize: "0.8rem",
                          }}
                        >
                          <span>Posted by: {faq.userName}</span>
                          <span>
                            {new Date(faq.createdAt).toLocaleDateString()}
                          </span>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  </MotionBox>
                ))}
              </>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default FAQ;