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
  alpha,
} from "@mui/material";
import {
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  Email,
  Phone,
  LocationOn,
  Palette as RestaurantIcon,
  ArrowForward,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
import FranchiseHubLogo from "../common/FranchiseHubLogo";

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const quickLinks = [
  { text: "About Us", href: "/about" },
  { text: "Brands", href: "/brands" },
  { text: "Blog", href: "/blogs" },
  { text: "Contact", href: "/contact" },
  { text: "FAQs", href: "/faq" },
];

const socialLinks = [
  { icon: <Facebook />, name: "Facebook", href: "https://www.facebook.com/" },
  { icon: <Twitter />, name: "Twitter", href: "https://twitter.com/" },
  { icon: <LinkedIn />, name: "LinkedIn", href: "https://www.linkedin.com/" },
  {
    icon: <Instagram />,
    name: "Instagram",
    href: "https://www.instagram.com/",
  },
];

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "primary.50",
        color: "text.secondary",
        mt: 8,
        py: { xs: 4, md: 6 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        <Grid container spacing={4}>
          <Grid xs={12} md={4}>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Box sx={{ mb: 2 }}>
                <FranchiseHubLogo variant="full" width={200} height={50} />
              </Box>
              <Typography
                variant="body2"
                color="primary.main"
                sx={{ mb: 3, lineHeight: 1.8 }}
              >
                Your trusted partner in finding the perfect franchise
                opportunity. We connect aspiring entrepreneurs with proven
                franchise brands.
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                {socialLinks.map((social) => (
                  <MotionButton
                    key={social.name}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    component={IconButton}
                    sx={{
                      color: "text.primary",
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.primary.main, 0.2),
                      },
                    }}
                    aria-label={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.icon}
                  </MotionButton>
                ))}
              </Box>
            </MotionBox>
          </Grid>

          <Grid xs={6} sm={4} md={2}>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ mb: 2, color: "text.primary" }}
            >
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {quickLinks.map((link) => (
                <Link
                  key={link.text}
                  component={RouterLink}
                  to={link.href}
                  color="inherit"
                  underline="hover"
                  sx={{
                    "&:hover": {
                      color: "primary.dark",
                      textDecoration: "none",
                    },
                  }}
                >
                  {link.text}
                </Link>
              ))}
            </Box>
          </Grid>

          <Grid xs={12} sm={4} md={3}>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ mb: 2, color: "text.primary" }}
            >
              Contact Info
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Phone sx={{ color: "primary.main" }} />
                <Typography variant="body2">+91 9638389455</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Email sx={{ color: "primary.main" }} />
                <Typography variant="body2">support@ikama.in</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                <LocationOn sx={{ color: "primary.main", mt: 0.5 }} />
                <Typography variant="body2" lineHeight={1.6}>
                  1C Satyam Appartment, Vishwas Colony, Alkapuri
                  <br />
                  Vadodara, Gujarat 390007
                </Typography>
              </Box>
              <MotionButton
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/contact"
                endIcon={<ArrowForward />}
                sx={{ mt: 2 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Get In Touch
              </MotionButton>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: { xs: 3, md: 5 }, bgcolor: "divider" }} />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column-reverse", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="body2">
            © {new Date().getFullYear()} iKama. All rights reserved.
          </Typography>
          <Box
            sx={{ display: "flex", gap: { xs: 2, sm: 3 }, flexWrap: "wrap" }}
          >
            {[
              { text: "Privacy Policy", href: "/privacy-policy" },
              { text: "Terms and Conditions", href: "/terms-and-conditions" },
            ].map((link) => (
              <Link
                key={link.text}
                component={RouterLink}
                to={link.href}
                color="inherit"
                underline="hover"
                sx={{
                  "&:hover": { color: "primary.dark", textDecoration: "none" },
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
