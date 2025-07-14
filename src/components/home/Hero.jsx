import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  useTheme,
  useMediaQuery,
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

const Hero = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const features = [
    {
      icon: <TrendingUp />,
      title: "Proven ROI",
      description:
        "Access franchises with verified track records and strong returns",
    },
    {
      icon: <Security />,
      title: "Verified Brands",
      description:
        "All franchise information is thoroughly vetted and up-to-date",
    },
    {
      icon: <Support />,
      title: "Expert Support",
      description: "Get personalized guidance from franchise specialists",
    },
    {
      icon: <Speed />,
      title: "Fast Process",
      description: "Streamlined application and approval process",
    },
  ];

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        py: { xs: 6, sm: 8, md: 12 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background pattern */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.3,
        }}
      />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <MotionBox
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Title and description */}
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem" },
                  lineHeight: 1.2,
                  mb: { xs: 2, sm: 3 },
                }}
              >
                Find Your Perfect
                <Box component="span" sx={{ color: "#FFD700" }}>
                  {" "}
                  Restaurant Franchise
                </Box>
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  mb: { xs: 3, sm: 4 },
                  opacity: 0.9,
                  fontWeight: 300,
                  lineHeight: 1.5,
                  fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.5rem" },
                }}
              >
                Connect with proven restaurant franchises that match your
                budget, goals, and vision. Start your entrepreneurial journey
                today.
              </Typography>

              {/* Buttons */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mb: { xs: 4, sm: 6 },
                  flexWrap: "wrap",
                }}
              >
                <Button
                  variant="contained"
                  size={isSmallMobile ? "medium" : "large"}
                  endIcon={<ArrowForward />}
                  onClick={() => navigate("/brands")}
                  sx={{
                    backgroundColor: "#FFD700",
                    color: "black",
                    fontWeight: "bold",
                    px: { xs: 3, sm: 4 },
                    py: { xs: 1, sm: 1.5 },
                    borderRadius: 30,
                    fontSize: { xs: "0.9rem", sm: "1.1rem" },
                    "&:hover": {
                      backgroundColor: "#FFC107",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 25px rgba(255, 215, 0, 0.3)",
                    },
                    transition: "all 0.3s ease",
                    minWidth: { xs: "100%", sm: "auto" },
                  }}
                >
                  Browse Franchises
                </Button>

                <Button
                  variant="outlined"
                  size={isSmallMobile ? "medium" : "large"}
                  onClick={() => navigate("/contact")}
                  sx={{
                    borderColor: "white",
                    color: "white",
                    fontWeight: "bold",
                    px: { xs: 3, sm: 4 },
                    py: { xs: 1, sm: 1.5 },
                    borderRadius: 30,
                    fontSize: { xs: "0.9rem", sm: "1.1rem" },
                    "&:hover": {
                      backgroundColor: "white",
                      color: theme.palette.primary.main,
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                    minWidth: { xs: "100%", sm: "auto" },
                  }}
                >
                  Get Expert Help
                </Button>
              </Box>

              {/* Stats */}
              <Box
                sx={{
                  display: "flex",
                  gap: { xs: 2, sm: 4 },
                  flexWrap: "wrap",
                  justifyContent: { xs: "space-between", sm: "flex-start" },
                }}
              >
                <Box sx={{ textAlign: "center", minWidth: "80px" }}>
                  <Typography
                    variant={isSmallMobile ? "h5" : "h4"}
                    fontWeight="bold"
                    sx={{ color: "#FFD700" }}
                  >
                    500+
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      opacity: 0.8,
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    }}
                  >
                    Franchise Brands
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "center", minWidth: "80px" }}>
                  <Typography
                    variant={isSmallMobile ? "h5" : "h4"}
                    fontWeight="bold"
                    sx={{ color: "#FFD700" }}
                  >
                    95%
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      opacity: 0.8,
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    }}
                  >
                    Success Rate
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "center", minWidth: "80px" }}>
                  <Typography
                    variant={isSmallMobile ? "h5" : "h4"}
                    fontWeight="bold"
                    sx={{ color: "#FFD700" }}
                  >
                    $10M+
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      opacity: 0.8,
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    }}
                  >
                    Investments
                  </Typography>
                </Box>
              </Box>
            </MotionBox>
          </Grid>

          {/* Feature Cards - Improved Layout */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 3,
            }}
          >
            {features.map((feature, index) => (
              <MotionCard
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                sx={{
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: 3,
                  flex: "1 1 240px", // responsive basis with flexibility
                  minWidth: "220px",
                  maxWidth: "300px",
                  height: "220px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 3,
                    textAlign: "center",
                  }}
                >
                  <Avatar
                    sx={{
                      backgroundColor: "#FFD700",
                      color: theme.palette.primary.main,
                      width: 60,
                      height: 60,
                      mb: 2,
                    }}
                  >
                    {feature.icon}
                  </Avatar>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ color: "white", mb: 1 }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255, 255, 255, 0.8)",
                      lineHeight: 1.5,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </MotionCard>
            ))}
          </Box>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;
