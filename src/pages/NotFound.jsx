import React from "react";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { Home as HomeIcon, Storefront as BrandsIcon, ArrowBack } from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import SEO from "../components/common/SEO";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEO title="Page Not Found | ikama - Franchise Hub" description="The page you are looking for could not be found." />
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: "70vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            py: 8,
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "5rem", md: "7rem" },
              fontWeight: 800,
              lineHeight: 1,
              color: "primary.main",
              opacity: 0.15,
              userSelect: "none",
            }}
          >
            404
          </Typography>
          <Typography variant="h4" component="h1" sx={{ mt: -3, mb: 1.5, fontWeight: 700 }}>
            Page not found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 420 }}>
            The page you're looking for doesn't exist or may have moved. Let's get you back on track.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button variant="contained" size="large" startIcon={<HomeIcon />} component={RouterLink} to="/">
              Go home
            </Button>
            <Button variant="outlined" size="large" startIcon={<BrandsIcon />} component={RouterLink} to="/brands">
              Browse brands
            </Button>
            <Button size="large" startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
              Go back
            </Button>
          </Stack>
        </Box>
      </Container>
    </>
  );
};

export default NotFound;
