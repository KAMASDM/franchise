import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  useTheme,
} from "@mui/material";
import {
  TrendingUp,
  Security,
  Support,
  Speed,
  ArrowForward,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const FeatureCard = ({ icon, title, description, delay }) => {
  const theme = useTheme();
  return (
    <MotionCard
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5, boxShadow: theme.shadows[6] }}
      sx={{
        bgcolor: "background.paper",
        height: "100%",
        display: "flex",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Avatar
          sx={{
            bgcolor: "primary.main",
            color: "primary.contrastText",
            width: 60,
            height: 60,
            mb: 2,
          }}
        >
          {icon}
        </Avatar>
        <Typography
          variant="h6"
          fontWeight="bold"
          color="text.primary"
          gutterBottom
        >
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </MotionCard>
  );
};

const Hero = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      icon: <TrendingUp fontSize="large" />,
      title: "Proven ROI",
      description: "Access franchises with verified track records.",
    },
    {
      icon: <Security fontSize="large" />,
      title: "Verified Brands",
      description: "All franchise information is thoroughly vetted.",
    },
    {
      icon: <Support fontSize="large" />,
      title: "Expert Support",
      description: "Get personalized guidance from specialists.",
    },
    {
      icon: <Speed fontSize="large" />,
      title: "Fast Process",
      description: "Streamlined application and approval process.",
    },
  ];

  return (
    <Box
      sx={{
        background: `linear-gradient(to bottom, ${theme.palette.primary[50]}, ${theme.palette.background.paper}, ${theme.palette.secondary[50]})`,
        color: "text.primary",
        py: { xs: 6, md: 10 },
        overflow: "hidden",
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: { xs: 8, md: 4 },
          }}
        >
          <Box
            sx={{ flex: "1 1 55%", textAlign: { xs: "center", md: "left" } }}
          >
            <MotionBox
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "2.5rem", sm: "3rem", md: "3.75rem" },
                  lineHeight: 1.2,
                  mb: 2,
                }}
              >
                Find Your Perfect
                <Box component="span" sx={{ color: "primary.main" }}>
                  {" "}
                  Restaurant Franchise
                </Box>
              </Typography>

              <Typography
                variant="h5"
                sx={{ mb: 4, color: "text.secondary", fontWeight: 300 }}
              >
                Connect with proven brands that match your budget, goals, and
                vision. Start your entrepreneurial journey today.
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: { xs: "center", md: "flex-start" },
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate("/brands")}
                  sx={{
                    px: 4,
                    py: 1.5,
                  }}
                >
                  Browse Franchises
                </Button>

                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  onClick={() => navigate("/contact")}
                  sx={{
                    px: 4,
                    py: 1.5,
                  }}
                >
                  Get Expert Help
                </Button>
              </Box>
            </MotionBox>
          </Box>

          <Box
            sx={{
              flex: "1 1 45%",
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              justifyContent: "center",
            }}
          >
            {features.map((feature, index) => (
              <Box
                key={index}
                sx={{
                  flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 16px)" },
                  minWidth: "220px",
                }}
              >
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  delay={0.4 + index * 0.1}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;
