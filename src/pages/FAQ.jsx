import React from "react";
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Avatar,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { ExpandMore, HelpOutline } from "@mui/icons-material";
import { portalFAQs } from "../data/faqData";

const MotionBox = motion(Box);

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
};

const FAQ = () => {
  const theme = useTheme();
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

        <Box sx={{ maxWidth: 900, mx: "auto" }}>
          {portalFAQs.map((faq, index) => (
            <MotionBox
              key={index}
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
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
                    <Typography variant="subtitle1" fontWeight="bold">
                      {faq.question}
                    </Typography>
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
                </AccordionDetails>
              </Accordion>
            </MotionBox>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default FAQ;