import React from "react";
import { motion } from "framer-motion";
import { Box, Container, Typography, useTheme, Paper } from "@mui/material";

const MotionBox = motion(Box);

export const PageLayout = ({ title, children }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        background: `linear-gradient(to bottom, ${theme.palette.primary[50]}, ${theme.palette.background.paper}, ${theme.palette.secondary[50]})`,
        color: "text.primary",
        py: { xs: 6, md: 10 },
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="lg">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 2,
              backgroundColor: "background.paper",
            }}
          >
            <Typography
              component="h1"
              variant="h2"
              sx={{
                textAlign: "center",
                mb: 2,
                fontSize: { xs: "2.25rem", md: "3rem" },
              }}
            >
              {title}
            </Typography>
            {children}
          </Paper>
        </MotionBox>
      </Container>
    </Box>
  );
};

export const PolicySection = ({ title, children }) => (
  <Box sx={{ mb: 3 }}>
    <Typography
      variant="h5"
      component="h2"
      sx={{ fontWeight: "bold", color: "text.primary", mb: 1.5 }}
    >
      {title}
    </Typography>
    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
      {children}
    </Typography>
  </Box>
);

export const PrivacyPolicy = () => {
  return (
    <PageLayout title="Privacy Policy">
      <PolicySection title="1. Introduction">
        Welcome to our restaurant franchise platform. We are committed to
        protecting your privacy. This Privacy Policy explains how we collect,
        use, disclose, and safeguard your information when you visit our
        website. Please read this privacy policy carefully. If you do not agree
        with the terms of this privacy policy, please do not access the site.
      </PolicySection>

      <PolicySection title="2. Information We Collect">
        We may collect personal information such as your name, email address,
        phone number, and financial information when you register on our site,
        express an interest in obtaining information about us or our services,
        or otherwise contact us. This information is necessary to connect you
        with franchise opportunities that match your budget, goals, and vision.
      </PolicySection>

      <PolicySection title="3. How We Use Your Information">
        Having accurate information about you permits us to provide you with a
        smooth, efficient, and customized experience. Specifically, we may use
        information collected about you to: create and manage your account,
        email you regarding your account or potential franchise matches, provide
        expert support, and streamline the application and approval process.
      </PolicySection>

      <PolicySection title="4. Disclosure of Your Information">
        We may share information we have collected about you in certain
        situations. Your information may be disclosed to verified franchise
        brands to facilitate the connection process. We will not share your
        information with third parties for marketing purposes without your
        express consent.
      </PolicySection>

      <PolicySection title="5. Security of Your Information">
        We use administrative, technical, and physical security measures to help
        protect your personal information. While we have taken reasonable steps
        to secure the personal information you provide to us, please be aware
        that despite our efforts, no security measures are perfect or
        impenetrable.
      </PolicySection>

      <PolicySection title="6. Contact Us">
        If you have questions or comments about this Privacy Policy, please
        contact us through the "Get Expert Help" section on our website.
      </PolicySection>
    </PageLayout>
  );
};

export default PrivacyPolicy;
