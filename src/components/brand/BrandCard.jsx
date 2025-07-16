import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  Chip,
  Avatar,
  Divider,
} from "@mui/material";
import { LocationOn, TrendingUp, AccessTime, Star } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const MotionCard = motion(Card);

const BrandCard = ({ brand, index = 0 }) => {
  const navigate = useNavigate();

  const handleLearnMore = () => {
    navigate(`/brand/${brand.id}`);
  };

  const handleInquiry = () => {
    navigate(`/brand/${brand.id}?inquiry=true`);
  };

  return (
    <MotionCard
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -10, scale: 1.02 }}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400"}
        alt={brand.brandName}
        sx={{ objectFit: "cover" }}
      />

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
              {brand.brandName}
            </Typography>
            {brand.industries &&
              brand.industries.length > 0 &&
              brand.industries.map((industry, index) => (
                <Chip
                  key={index}
                  label={industry}
                  size="small"
                  color="primary"
                  sx={{ fontWeight: "bold", mr: 1 }}
                />
              ))}
          </Box>
          <Avatar sx={{ backgroundColor: "secondary.main" }}>
            <Star />
          </Avatar>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3, lineHeight: 1.6 }}
        >
          {brand.brandStory || brand.mission}
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6" fontWeight="bold" color="primary.main">
              {brand.initialFranchiseFee} $
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Franchise Fee
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6" fontWeight="bold" color="secondary.main">
              {brand.royaltyFee} %
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Royalty Fee
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6" fontWeight="bold" color="success.main">
              {brand.franchiseTermLength} years
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Term Length
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <TrendingUp sx={{ color: "success.main", mr: 1, fontSize: 20 }} />
            <Typography variant="body2" fontWeight="bold">
              Investment: {brand.investmentRange}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <AccessTime sx={{ color: "info.main", mr: 1, fontSize: 20 }} />
            <Typography variant="body2">
              Founded: {brand.brandfoundedYear} years
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <LocationOn sx={{ color: "warning.main", mr: 1, fontSize: 20 }} />
            <Typography variant="body2">
              Location:{" "}
              {brand.brandContactInformation.city +
                ", " +
                brand.brandContactInformation.state +
                ", " +
                brand.brandContactInformation.country}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleLearnMore}
            sx={{
              borderRadius: 25,
              fontWeight: "bold",
              py: 1,
            }}
          >
            Learn More
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleInquiry}
            sx={{
              borderRadius: 25,
              fontWeight: "bold",
              py: 1,
            }}
          >
            Inquire Now
          </Button>
        </Box>
      </CardContent>
    </MotionCard>
  );
};

export default BrandCard;
