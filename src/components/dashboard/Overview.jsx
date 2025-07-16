import React from "react";
import { Typography, Box } from "@mui/material";

const Overview = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      <Typography variant="body1">
        Welcome to your dashboard! Here you can see a summary of your
        activities.
      </Typography>
    </Box>
  );
};

export default Overview;
