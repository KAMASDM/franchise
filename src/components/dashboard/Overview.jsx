import React from "react";
import { Typography, Box } from "@mui/material";
import Leads from "./Overview/Leads";
import Brands from "./Overview/Brands";
import Locations from "./Overview/Locations";

const Overview = () => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        Dashboard Overview
      </Typography>

      <Typography variant="body1" paragraph sx={{ mb: 3 }}>
        Welcome to your dashboard! Here you can manage your brands and view
        important information.
      </Typography>
      <Leads />
      <Brands />
      <Locations />
    </Box>
  );
};

export default Overview;
