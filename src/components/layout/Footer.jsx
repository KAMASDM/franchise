import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  Email,
  Phone,
  LocationOn,
  Restaurant as RestaurantIcon,
  ArrowForward,
} from "@mui/icons-material";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(135deg, #2c3e50 0%, #1a1a2e 100%)",
        color: "white",
        mt: 8,
        py: 6,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.3,
        }}
      />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        <Grid container spacing={4}>
          {/* Brand Info Column */}
          <Grid item xs={12} md={4}>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <RestaurantIcon
                  sx={{ color: "#FFD700", mr: 1, fontSize: 30 }}
                />
                <Typography variant="h5" fontWeight="bold" color="#FFD700">
                  FranchiseHub
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.8 }}>
                Your trusted partner in finding the perfect restaurant franchise
                opportunity. We connect aspiring entrepreneurs with proven
                franchise brands.
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                {[
                  { icon: <Facebook />, name: "Facebook" },
                  { icon: <Twitter />, name: "Twitter" },
                  { icon: <LinkedIn />, name: "LinkedIn" },
                  { icon: <Instagram />, name: "Instagram" },
                ].map((social, index) => (
                  <MotionButton
                    key={index}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    component={IconButton}
                    sx={{
                      color: "white",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                      },
                    }}
                    aria-label={social.name}
                  >
                    {social.icon}
                  </MotionButton>
                ))}
              </Box>
            </MotionBox>
          </Grid>

          {/* Quick Links Column */}
          <Grid item xs={6} sm={4} md={2}>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ mb: 2, color: "#FFD700" }}
              >
                Quick Links
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {[
                  { text: "Browse Brands", href: "/brands" },
                  { text: "About Us", href: "/about" },
                  { text: "Blogs", href: "/blogs" },
                  { text: "FAQ", href: "/faq" },
                  { text: "Contact", href: "/contact" },
                ].map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    color="inherit"
                    underline="hover"
                    sx={{
                      transition: "all 0.3s ease",
                      "&:hover": {
                        color: "#FFD700",
                        transform: "translateX(5px)",
                      },
                    }}
                  >
                    {link.text}
                  </Link>
                ))}
              </Box>
            </MotionBox>
          </Grid>

          {/* Categories Column */}
          <Grid item xs={6} sm={4} md={3}>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ mb: 2, color: "#FFD700" }}
              >
                Popular Categories
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {[
                  { text: "Pizza Franchises", href: "/brands?category=pizza" },
                  {
                    text: "Burger Franchises",
                    href: "/brands?category=burgers",
                  },
                  { text: "Mexican Food", href: "/brands?category=mexican" },
                  { text: "Coffee Shops", href: "/brands?category=coffee" },
                  { text: "Asian Cuisine", href: "/brands?category=asian" },
                ].map((category, index) => (
                  <Link
                    key={index}
                    href={category.href}
                    color="inherit"
                    underline="hover"
                    sx={{
                      transition: "all 0.3s ease",
                      "&:hover": {
                        color: "#FFD700",
                        transform: "translateX(5px)",
                      },
                    }}
                  >
                    {category.text}
                  </Link>
                ))}
              </Box>
            </MotionBox>
          </Grid>

          {/* Contact Info Column */}
          <Grid item xs={12} sm={4} md={3}>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ mb: 2, color: "#FFD700" }}
              >
                Contact Info
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Phone sx={{ color: "#FFD700" }} />
                  <Typography variant="body2">+1 (555) 123-4567</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Email sx={{ color: "#FFD700" }} />
                  <Typography variant="body2">info@franchisehub.com</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                  <LocationOn sx={{ color: "#FFD700" }} />
                  <Typography variant="body2">
                    123 Business Avenue
                    <br />
                    Suite 100
                    <br />
                    New York, NY 10001
                  </Typography>
                </Box>

                <MotionButton
                  variant="outlined"
                  color="primary"
                  endIcon={<ArrowForward />}
                  sx={{
                    mt: 2,
                    color: "white",
                    borderColor: "#FFD700",
                    "&:hover": {
                      backgroundColor: "rgba(255, 215, 0, 0.1)",
                      borderColor: "#FFC107",
                    },
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Contact Us
                </MotionButton>
              </Box>
            </MotionBox>
          </Grid>
        </Grid>

        <Divider
          sx={{
            my: 4,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            height: "1px",
          }}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column-reverse", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
            © {new Date().getFullYear()} FranchiseHub. All rights reserved.
          </Typography>
          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            {[
              { text: "Privacy Policy", href: "/privacy" },
              { text: "Terms of Service", href: "/terms" },
              { text: "Sitemap", href: "/sitemap" },
            ].map((link, index) => (
              <Link
                key={index}
                href={link.href}
                color="rgba(255, 255, 255, 0.7)"
                underline="hover"
                sx={{
                  "&:hover": {
                    color: "#FFD700",
                  },
                }}
              >
                {link.text}
              </Link>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
