import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Avatar,
  Divider,
  useTheme,
} from "@mui/material";
import { db } from "../../firebase/firebase";
import { doc, setDoc, increment, serverTimestamp } from "firebase/firestore";
import { TrendingUp, AccessTime, CropLandscape } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getBrandUrl } from "../../utils/brandUtils";

const MotionCard = motion(Card);

const BrandCard = ({ brand, index = 0 }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleLearnMore = () => {
    trackView();
    navigate(getBrandUrl(brand));
  };

  const trackView = async () => {
    try {
      const viewRef = doc(db, "brandViews", brand.id);

      await setDoc(
        viewRef,
        {
          brandId: brand.id,
          brandOwnerId: brand.userId,
          totalViews: increment(1),
          lastUpdated: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error tracking view:", error);
    }
  };

  return (
    <MotionCard
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 4,
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
        },
      }}
    >
      <CardContent
        sx={{ flexGrow: 1, p: 3, display: "flex", flexDirection: "column" }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar
            src={brand.brandLogo}
            alt={`${brand.brandName} Logo`}
            sx={{
              width: 64,
              height: 64,
              mr: 2,
              border: `2px solid ${theme.palette.divider}`,
            }}
          >
            {!brand.brandLogo && brand.brandName?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {brand.brandName}
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              {brand.industries?.map((industry, i) => (
                <Chip
                  key={i}
                  label={industry}
                  size="small"
                  variant="outlined"
                  color="primary"
                  sx={{ fontWeight: "medium", mr: 1 }}
                />
              ))}
            </Box>
          </Box>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3, lineHeight: 1.6 }}
        >
          {brand.brandMission}
        </Typography>

        <Box sx={{ flexGrow: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              textAlign: "center",
              gap: 2,
              mb: 3,
              p: 2,
              backgroundColor: theme.palette.action.hover,
              borderRadius: 2,
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {Number(brand.initialFranchiseFee).toLocaleString("en-IN")}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Franchise Fee
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {brand.royaltyFee}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Royalty Fee
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {brand.franchiseTermLength} yrs
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Term Length
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2, display: "none" }} />

          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
              <TrendingUp
                sx={{ color: "success.main", mr: 1.5, fontSize: 22 }}
              />
              <Typography variant="body2" fontWeight="medium">
                Investment: {brand.investmentRange}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
              <CropLandscape
                sx={{ color: "primary.main", mr: 1.5, fontSize: 22 }}
              />
              <Typography variant="body2" fontWeight="medium">
                Area: {brand.areaRequired?.min}-{brand.areaRequired?.max}{" "}
                {brand.areaRequired?.unit}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <AccessTime sx={{ color: "info.main", mr: 1.5, fontSize: 22 }} />
              <Typography variant="body2" fontWeight="medium">
                Founded: {brand.brandfoundedYear}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Button
          variant="contained"
          fullWidth
          onClick={handleLearnMore}
          sx={{
            borderRadius: 25,
            fontWeight: "bold",
            py: 1.5,
          }}
        >
          Learn More
        </Button>
      </CardContent>
    </MotionCard>
  );
};

export default BrandCard;
