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
} from "@mui/material";
import { LocationOn } from "@mui/icons-material";

const BrandCardView = ({ brands, onLearnMore }) => {
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
              <Box display="flex" alignItems="center" mb={1}>
                <Avatar
                  src={brand.brandImage}
                  alt={brand.brandName}
                  sx={{ width: 40, height: 40, mr: 2 }}
                />
                <Typography variant="h6" fontWeight="bold">
                  {brand.brandName}
                </Typography>
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

              <Button
                variant="outlined"
                fullWidth
                onClick={() => onLearnMore(brand.id)}
                size="small"
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default BrandCardView;
