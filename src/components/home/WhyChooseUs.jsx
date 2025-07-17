import React from "react";
import {
  Box,
  Typography,
  Card,
  Avatar,
  Container,
  CardContent,
  useTheme,
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
    icon: <Business fontSize="large" />,
    title: "Curated Opportunities",
    description:
      "Hand-picked franchise opportunities with proven track records and strong market presence.",
  },
  {
    icon: <TrendingUp fontSize="large" />,
    title: "Market Intelligence",
    description:
      "Access to comprehensive market data, trends, and financial projections for informed decisions.",
  },
  {
    icon: <Support fontSize="large" />,
    title: "End-to-End Support",
    description:
      "From initial consultation to grand opening, we're with you every step of the way.",
  },
  {
    icon: <VerifiedUser fontSize="large" />,
    title: "Trusted Network",
    description:
      "Join a network of verified franchises and industry experts with a focus on your success.",
  },
];

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const WhyChooseUs = () => {
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
            Why Choose Us?
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
            We're committed to helping you find the perfect franchise
            opportunity with comprehensive support and guidance.
          </Typography>
        </MotionBox>

        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent="center"
          sx={{
            gap: { xs: 2, md: 4 },
            px: { xs: 2, md: 4 },
          }}
        >
          {whyChooseUs.map((item, index) => (
            <MotionCard
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03, y: -5 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              sx={{
                flex: {
                  xs: "1 1 100%",
                  sm: "1 1 40%",
                  md: "1 1 21%",
                },
                maxWidth: { xs: "100%", sm: "420px" },
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
              }}
            >
              <CardContent
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  p: { xs: 2, md: 3 },
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: theme.palette.primary[100],
                    color: "primary.main",
                    width: 72,
                    height: 72,
                    mx: "auto",
                    mb: 3,
                  }}
                >
                  {item.icon}
                </Avatar>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  sx={{ mb: 1.5, color: "text.primary" }}
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
      </Container>
    </Box>
  );
};

export default WhyChooseUs;
