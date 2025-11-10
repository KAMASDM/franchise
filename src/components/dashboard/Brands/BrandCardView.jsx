import React from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Chip,
  Card,
  CardContent,
  Grid,
  Stack,
} from "@mui/material";
import { LocationOn, Download, PictureAsPdf } from "@mui/icons-material";
import BrandBrochureManager from "../../brand/BrandBrochureManager";

const BrandCardView = ({ brands, onLearnMore }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      case 'draft':
        return 'default';
      default:
        return 'info';
    }
  };

  const getStatusLabel = (status) => {
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown';
  };

  return (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      {brands.map((brand) => (
        <Grid item xs={12} key={brand.id}>
          <Card
            sx={{
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 3,
              },
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                <Box display="flex" alignItems="center">
                  <Avatar
                    src={brand.brandImage}
                    alt={brand.brandName}
                    sx={{ width: 40, height: 40, mr: 2 }}
                  />
                  <Typography variant="h6" fontWeight="bold">
                    {brand.brandName}
                  </Typography>
                </Box>
                <Chip 
                  label={getStatusLabel(brand.status)} 
                  color={getStatusColor(brand.status)}
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              </Box>

              <Box sx={{ mb: 1 }}>
                {brand.industries?.map((industry, index) => (
                  <Chip
                    key={index}
                    label={industry}
                    size="small"
                    color="primary"
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>

              <Box sx={{ mb: 1 }}>
                <Typography variant="body2">
                  <strong>Model:</strong> {brand.franchiseModel}
                </Typography>
                <Typography variant="body2">
                  <strong>Investment:</strong> {brand.investmentRange}
                </Typography>
                <Typography variant="body2">
                  <strong>Area Required:</strong> {brand?.areaRequired?.min} -
                  {brand?.areaRequired?.max} {brand?.areaRequired?.unit}
                </Typography>
                <Typography variant="body2">
                  <strong>Fee:</strong> ₹{brand.initialFranchiseFee} |{" "}
                  {brand.royaltyFee}% Royalty
                </Typography>
                <Typography variant="body2">
                  <strong>Views:</strong> {brand.totalViews}
                </Typography>
              </Box>

              <Box sx={{ mb: 1 }}>
                <Typography variant="body2">
                  <LocationOn
                    sx={{ fontSize: 16, mr: 0.5, color: "primary.main" }}
                  />
                  {brand.brandContactInformation?.city},{" "}
                  {brand.brandContactInformation?.state}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => onLearnMore(brand.brandName)}
                  size="small"
                  sx={{ flex: 1 }}
                >
                  View Details
                </Button>
                
                {brand.status === 'active' && (
                  <Button
                    variant="contained"
                    startIcon={<PictureAsPdf />}
                    size="small"
                    color="secondary"
                    onClick={() => {
                      // This will be handled by the BrandBrochureManager component
                    }}
                    disabled
                    sx={{ minWidth: 'auto', px: 1 }}
                  >
                    PDF
                  </Button>
                )}
              </Stack>

              {/* Brand Brochure Manager for Active Brands */}
              {brand.status === 'active' && (
                <Box sx={{ mt: 2, display: 'none' }}>
                  <BrandBrochureManager brand={brand} />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default BrandCardView;
