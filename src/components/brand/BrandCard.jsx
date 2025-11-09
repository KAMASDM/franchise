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
  alpha,
} from "@mui/material";
import { db } from "../../firebase/firebase";
import { doc, setDoc, increment, serverTimestamp } from "firebase/firestore";
import {
  TrendingUp,
  AccessTime,
  LocationOn,
  Store as StoreIcon,
  Business as BusinessIcon,
  AttachMoney,
  TrendingDown,
  Star,
  ArrowForward,
  People,
  Verified,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getBrandUrl } from "../../utils/brandUtils";
import { ViewCounter, PopularityBadge, VerifiedBadge } from "../common/SocialProof";
import logger from "../../utils/logger";

const MotionCard = motion(Card);

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

  const investment = brand.investmentRange?.min || brand.initialInvestment || brand.investmentRequired || 0;
  const investmentFormatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(investment);

  return (
    <MotionCard
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: `0 2px 12px ${alpha(theme.palette.common.black, 0.08)}`,
        border: `1px solid ${theme.palette.divider}`,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        "&:hover": {
          boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.12)}`,
          transform: "translateY(-4px)",
          borderColor: theme.palette.primary.main,
        },
      }}
      onClick={handleLearnMore}
    >
      {/* Brand Image/Logo Header - Reduced Height */}
      <Box
        sx={{
          position: "relative",
          height: 140,
          background: brand.brandLogo || brand.brandImage 
            ? `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url(${brand.brandLogo || brand.brandImage})`
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
          <Typography variant="h3" fontWeight="bold" sx={{ opacity: 0.9 }}>
            {brand.brandName?.charAt(0)}
          </Typography>
        )}
        
        {/* Top Badges Row */}
        <Box
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            right: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {brand.verified && (
              <Chip
                icon={<Verified sx={{ fontSize: 12 }} />}
                label="Verified"
                size="small"
                sx={{
                  height: 22,
                  bgcolor: alpha(theme.palette.success.main, 0.95),
                  color: 'white',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  backdropFilter: 'blur(8px)',
                  '& .MuiChip-icon': { ml: 0.5 },
                }}
              />
            )}
          </Box>
          
          {brand.rating && (
            <Chip
              icon={<Star sx={{ fontSize: 12 }} />}
              label={brand.rating}
              size="small"
              sx={{
                height: 22,
                bgcolor: alpha(theme.palette.warning.main, 0.95),
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: 600,
                backdropFilter: 'blur(8px)',
                '& .MuiChip-icon': { ml: 0.5 },
              }}
            />
          )}
        </Box>

        {/* Bottom Badge */}
        {brand.estimatedROI && (
          <Box
            sx={{
              position: "absolute",
              bottom: 10,
              left: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              bgcolor: alpha(theme.palette.primary.main, 0.95),
              color: 'white',
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.75rem',
              fontWeight: 600,
              backdropFilter: 'blur(8px)',
            }}
          >
            <TrendingUp sx={{ fontSize: 14 }} />
            {brand.estimatedROI}% ROI
          </Box>
        )}
      </Box>

      <CardContent
        sx={{ 
          flexGrow: 1, 
          p: 2,
          display: "flex", 
          flexDirection: "column",
        }}
      >
        {/* Brand Name & Category */}
        <Box sx={{ mb: 1.5 }}>
          <Typography 
            variant="h6" 
            fontWeight="700" 
            sx={{ 
              lineHeight: 1.3,
              fontSize: '1.1rem',
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              mb: 0.5,
            }}
          >
            {brand.brandName}
          </Typography>
          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
            {brand.brandCategory && (
              <Chip
                label={brand.brandCategory}
                size="small"
                sx={{
                  height: 20,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                  fontWeight: 600,
                  fontSize: '0.65rem',
                }}
              />
            )}
            {brand.industries?.slice(0, 1).map((industry, i) => (
              <Chip
                key={i}
                label={industry}
                size="small"
                variant="outlined"
                sx={{ height: 20, fontSize: '0.65rem' }}
              />
            ))}
          </Stack>
        </Box>

        {/* Description - Compact */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ 
            mb: 1.5,
            lineHeight: 1.5,
            fontSize: '0.85rem',
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "2.5em",
          }}
        >
          {brand.brandMission || brand.brandStory || brand.description || "Explore this exciting franchise opportunity"}
        </Typography>

        {/* Key Metrics Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 1,
            mb: 1.5,
            p: 1.5,
            background: alpha(theme.palette.primary.main, 0.04),
            borderRadius: 1.5,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary" display="block" fontSize="0.65rem">
              Investment
            </Typography>
            <Typography variant="body2" fontWeight="700" color="primary.main" fontSize="0.9rem">
              {investmentFormatted}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block" fontSize="0.65rem">
              Business Model
            </Typography>
            <Typography variant="body2" fontWeight="700" fontSize="0.9rem" noWrap>
              {brand.businessModel || 'Franchise'}
            </Typography>
          </Box>
        </Box>

        {/* Quick Stats Row */}
        <Stack spacing={0.75} sx={{ mb: 1.5 }}>
          {brand.locations && brand.locations.length > 0 && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LocationOn sx={{ fontSize: 16, color: 'info.main' }} />
              <Typography variant="caption" fontWeight="600" fontSize="0.75rem">
                {brand.locations.length} {brand.locations.length === 1 ? 'Location' : 'Locations'}
              </Typography>
            </Box>
          )}
          
          {brand.brandfoundedYear && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AccessTime sx={{ fontSize: 16, color: 'warning.main' }} />
              <Typography variant="caption" fontWeight="600" fontSize="0.75rem">
                Established {brand.brandfoundedYear}
              </Typography>
            </Box>
          )}

          {brand.totalUnits && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <StoreIcon sx={{ fontSize: 16, color: 'secondary.main' }} />
              <Typography variant="caption" fontWeight="600" fontSize="0.75rem">
                {brand.totalUnits} Active Units
              </Typography>
            </Box>
          )}

          {brand.paybackPeriod && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
              <Typography variant="caption" fontWeight="600" fontSize="0.75rem">
                {brand.paybackPeriod} Payback
              </Typography>
            </Box>
          )}

          {brand.trainingDuration && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <People sx={{ fontSize: 16, color: 'primary.main' }} />
              <Typography variant="caption" fontWeight="600" fontSize="0.75rem">
                {brand.trainingDuration} Training
              </Typography>
            </Box>
          )}
        </Stack>

        {/* Additional Info Pills */}
        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
          {brand.royaltyFee && (
            <Chip
              label={`${brand.royaltyFee}% Royalty`}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.65rem',
                bgcolor: alpha(theme.palette.secondary.main, 0.1),
                color: 'secondary.main',
                fontWeight: 600,
              }}
            />
          )}
          {brand.trainingProvided && (
            <Chip
              label="Training"
              size="small"
              sx={{
                height: 20,
                fontSize: '0.65rem',
                bgcolor: alpha(theme.palette.success.main, 0.1),
                color: 'success.main',
                fontWeight: 600,
              }}
            />
          )}
          {brand.financingAvailable && (
            <Chip
              label="Financing"
              size="small"
              sx={{
                height: 20,
                fontSize: '0.65rem',
                bgcolor: alpha(theme.palette.info.main, 0.1),
                color: 'info.main',
                fontWeight: 600,
              }}
            />
          )}
          {brand.territoryRights && (
            <Chip
              label="Territory Rights"
              size="small"
              sx={{
                height: 20,
                fontSize: '0.65rem',
                bgcolor: alpha(theme.palette.warning.main, 0.1),
                color: 'warning.main',
                fontWeight: 600,
              }}
            />
          )}
          {brand.profitMargin && (
            <Chip
              label={`${brand.profitMargin}% Margin`}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.65rem',
                bgcolor: alpha(theme.palette.success.main, 0.1),
                color: 'success.main',
                fontWeight: 600,
              }}
            />
          )}
        </Stack>
          
        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />
          
        {/* CTA Button - Compact */}
        <Button
          variant="contained"
          fullWidth
          endIcon={<ArrowForward sx={{ fontSize: 16 }} />}
          sx={{
            borderRadius: 1.5,
            fontWeight: "600",
            py: 1,
            fontSize: '0.85rem',
            textTransform: 'none',
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            "&:hover": {
              background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
            },
          }}
        >
          View Details
        </Button>
      </CardContent>
    </MotionCard>
  );
};

export default BrandCard;
