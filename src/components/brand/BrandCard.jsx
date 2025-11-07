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
  Stack,
} from "@mui/material";
import { db } from "../../firebase/firebase";
import { doc, setDoc, increment, serverTimestamp } from "firebase/firestore";
import {
  TrendingUp,
  AccessTime,
  CropLandscape,
  Store as StoreIcon,
  Business as BusinessIcon,
  LocalShipping as LocalShippingIcon,
  Inventory as InventoryIcon,
  Handshake as HandshakeIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getBrandUrl } from "../../utils/brandUtils";
import { ViewCounter, PopularityBadge, VerifiedBadge } from "../common/SocialProof";
import logger from "../../utils/logger";
import { BUSINESS_MODEL_CONFIG } from "../../constants/businessModels";

const MotionCard = motion(Card);

const iconMap = {
  Store: StoreIcon,
  Business: BusinessIcon,
  LocalShipping: LocalShippingIcon,
  Inventory: InventoryIcon,
  Handshake: HandshakeIcon,
};

const BrandCard = ({ brand, index = 0 }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleLearnMore = (e) => {
    e.preventDefault();
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
      logger.error("Error tracking view:", error);
    }
  };

  return (
    <MotionCard
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        border: `1px solid ${theme.palette.divider}`,
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        "&:hover": {
          boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
          transform: "translateY(-4px)",
          borderColor: theme.palette.primary.main,
        },
      }}
      onClick={handleLearnMore}
    >
      {/* Brand Image/Logo Header */}
      <Box
        sx={{
          position: "relative",
          height: 120,
          background: brand.brandLogo || brand.brandImage 
            ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${brand.brandLogo || brand.brandImage})`
            : `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        {!brand.brandLogo && !brand.brandImage && (
          <Typography variant="h3" fontWeight="bold" sx={{ opacity: 0.8 }}>
            {brand.brandName?.charAt(0)}
          </Typography>
        )}
        
        {/* Franchise Model Badge */}
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "rgba(255,255,255,0.9)",
            borderRadius: 2,
            px: 1.5,
            py: 0.5,
          }}
        >
          <Typography variant="caption" fontWeight="bold" color="text.primary">
            {brand.franchiseModels?.[0] || "Franchise"}
          </Typography>
        </Box>

        {/* Social Proof Badges */}
        <Box
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            display: "flex",
            gap: 0.5,
          }}
        >
          {brand.verified && <VerifiedBadge size="small" />}
          {(brand.trending || brand.featured) && (
            <PopularityBadge 
              isTrending={brand.trending} 
              isFeatured={brand.featured}
              size="small"
            />
          )}
        </Box>
      </Box>

      <CardContent
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          display: "flex", 
          flexDirection: "column",
          minHeight: 300 // Ensure minimum height for consistency
        }}
      >
        {/* Brand Name & Industries */}
        <Box sx={{ mb: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography 
              variant="h6" 
              fontWeight="bold" 
              sx={{ 
                lineHeight: 1.3,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flex: 1,
                mr: 1,
              }}
            >
              {brand.brandName}
            </Typography>
            {/* View Counter */}
            <ViewCounter 
              views={brand.viewCount || brand.totalViews || 0} 
              compact 
            />
          </Box>
          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
            {brand.industries?.slice(0, 2).map((industry, i) => (
              <Chip
                key={i}
                label={industry}
                size="small"
                variant="filled"
                sx={{
                  bgcolor: `${theme.palette.primary.main}15`,
                  color: theme.palette.primary.main,
                  fontWeight: "medium",
                  fontSize: "0.75rem",
                  height: 24,
                }}
              />
            ))}
            {brand.industries?.length > 2 && (
              <Chip
                label={`+${brand.industries.length - 2}`}
                size="small"
                variant="outlined"
                sx={{ height: 24, fontSize: "0.75rem" }}
              />
            )}
          </Stack>
        </Box>

        {/* Brand Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ 
            mb: 3, 
            lineHeight: 1.6,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "2.4em"
          }}
        >
          {brand.brandMission || brand.brandStory || brand.brandDescription || "Explore this exciting franchise opportunity"}
        </Typography>

        {/* Key Metrics */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 2,
              mb: 3,
              p: 2.5,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}08, ${theme.palette.secondary.main}08)`,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6" fontWeight="bold" color="primary.main">
                ₹{brand.initialFranchiseFee ? Number(brand.initialFranchiseFee).toLocaleString("en-IN") : "N/A"}
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight="medium">
                Initial Fee
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6" fontWeight="bold" color="secondary.main">
                {brand.royaltyFee || "N/A"}{brand.royaltyFee ? "%" : ""}
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight="medium">
                Royalty
              </Typography>
            </Box>
          </Box>

          {/* Quick Info */}
          <Stack spacing={1.5} sx={{ mb: 3 }}>
            {brand.investmentRange && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TrendingUp sx={{ color: "success.main", mr: 1.5, fontSize: 18 }} />
                <Typography variant="body2" fontWeight="medium">
                  {brand.investmentRange}
                </Typography>
              </Box>
            )}
            {brand.areaRequired?.min && brand.areaRequired?.max && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CropLandscape sx={{ color: "info.main", mr: 1.5, fontSize: 18 }} />
                <Typography variant="body2" fontWeight="medium">
                  {brand.areaRequired.min}-{brand.areaRequired.max} {brand.areaRequired.unit}
                </Typography>
              </Box>
            )}
            {brand.brandfoundedYear && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <AccessTime sx={{ color: "warning.main", mr: 1.5, fontSize: 18 }} />
                <Typography variant="body2" fontWeight="medium">
                  Est. {brand.brandfoundedYear}
                </Typography>
              </Box>
            )}
          </Stack>
          
          {/* Spacer to push button to bottom */}
          <Box sx={{ flexGrow: 1 }} />
          
          {/* CTA Button */}
          <Button
            variant="contained"
            fullWidth
            aria-label={`Learn more about ${brand.brandName} franchise opportunity`}
            sx={{
              borderRadius: 2,
              fontWeight: "bold",
              py: 1.5,
              mt: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              "&:hover": {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                transform: "translateY(-1px)",
              },
            }}
          >
            View Details
          </Button>
        </Box>
      </CardContent>
    </MotionCard>
  );
};

export default BrandCard;
