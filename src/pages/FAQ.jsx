import React from "react";
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Avatar,
} from "@mui/material";
import { motion } from "framer-motion";
import { ExpandMore, HelpOutline } from "@mui/icons-material";
import { portalFAQs } from "../data/faqData";

const MotionBox = motion(Box);

const FAQ = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 10 }}>
      <MotionBox
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        sx={{ textAlign: "center", mb: 8 }}
      >
        <Typography
          variant="h3"
          component="h2"
          fontWeight="bold"
          sx={{ mb: 3, color: "text.primary" }}
        >
          Frequently Asked Questions
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 700, mx: "auto", lineHeight: 1.6 }}
        >
          Have questions? We've got answers. Explore our most common inquiries
          to learn more about our franchise programs, services, and what we
          offer.
        </Typography>
      </MotionBox>

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
              sx={{
                borderRadius: 2,
                "&:before": { display: "none" },
                boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={{
                  backgroundColor: "#FFF8E1",
                  borderRadius: "8px 8px 0 0",
                  px: 3,
                  py: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Avatar
                  sx={{ bgcolor: "#FFD700", width: 32, height: 32, mr: 1 }}
                >
                  <HelpOutline sx={{ color: "black", fontSize: 20 }} />
                </Avatar>
                <Typography variant="subtitle1" fontWeight="bold">
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 3, backgroundColor: "white" }}>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </MotionBox>
        ))}
      </Box>
    </Container>
  );
};

export default FAQ;
