import React from "react";
import {
  Box,
  Typography,
  Card,
  Avatar,
  CardContent,
} from "@mui/material";
import {
  Business,
  TrendingUp,
  Support,
  VerifiedUser,
} from "@mui/icons-material";
import { motion } from "framer-motion";

const whyChooseUs = [
  {
    icon: <Business fontSize="large" color="primary" />,
    title: "Curated Opportunities",
    description:
      "Hand-picked franchise opportunities with proven track records and strong market presence.",
  },
  {
    icon: <TrendingUp fontSize="large" color="primary" />,
    title: "Market Intelligence",
    description:
      "Access to comprehensive market data, trends, and financial projections for informed decisions.",
  },
  {
    icon: <Support fontSize="large" color="primary" />,
    title: "End-to-End Support",
    description:
      "From initial consultation to grand opening, we're with you every step of the way.",
  },
  {
    icon: <VerifiedUser fontSize="large" color="primary" />,
    title: "Trusted Network",
    description:
      "Join a network of verified franchises and industry experts with a focus on your success.",
  },
];

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const WhyChooseUs = () => {
  return (
    <Box component="section" sx={{ py: { xs: 6, md: 10 }, px: 2 }}>
      <MotionBox
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        textAlign="center"
        mb={6}
      >
        <Typography
          variant="h3"
          component="h2"
          fontWeight="bold"
          sx={{ mb: 3, color: "text.primary" }}
        >
          Why Choose FranchiseHub?
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          maxWidth={600}
          mx="auto"
          lineHeight={1.6}
        >
          We're committed to helping you find the perfect franchise opportunity
          with comprehensive support and guidance.
        </Typography>
      </MotionBox>

      <Box display="flex" flexWrap="wrap" justifyContent="center" gap={4}>
        {whyChooseUs.map((item, index) => (
          <MotionCard
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03, y: -5 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            sx={{
              width: {
                xs: "100%",
                sm: "45%",
                md: "22%",
              },
              minWidth: "280px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              textAlign: "center",
              p: 3,
              borderRadius: 3,
              boxShadow: 3,
              backgroundColor: "#fff",
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Avatar
                sx={{
                  bgcolor: "#FFD700",
                  width: 80,
                  height: 80,
                  mx: "auto",
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "primary.main",
                }}
              >
                {item.icon}
              </Avatar>
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ mb: 2, color: "text.primary" }}
              >
                {item.title}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ lineHeight: 1.6 }}
              >
                {item.description}
              </Typography>
            </CardContent>
          </MotionCard>
        ))}
      </Box>
    </Box>
  );
};

export default WhyChooseUs;
