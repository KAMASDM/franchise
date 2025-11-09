/**
 * Brand List Item - Horizontal Layout for List View
 */

import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Avatar,
  useTheme,
  Stack,
  alpha,
} from "@mui/material";
import {
  TrendingUp,
  LocationOn,
  AttachMoney,
  Business,
  ArrowForward,
  Verified,
  Star,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getBrandUrl } from "../../utils/brandUtils";
import { db } from "../../firebase/firebase";
import { doc, setDoc, increment, serverTimestamp } from "firebase/firestore";
import logger from "../../utils/logger";

const MotionCard = motion(Card);

const BrandListItem = ({ brand, index = 0 }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleClick = (e) => {
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

  const investment = brand.investmentRange?.min || brand.initialInvestment || 0;
  const investmentFormatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(investment);

  return (
    <MotionCard
      sx={{
        display: 'flex',
        flexDirection: 'row',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: `0 2px 12px ${alpha(theme.palette.common.black, 0.08)}`,
        border: `1px solid ${theme.palette.divider}`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.12)}`,
          transform: 'translateY(-2px)',
          borderColor: theme.palette.primary.main,
        },
      }}
    >
      {/* Brand Image */}
      <Box
        sx={{
          width: { xs: 120, sm: 180, md: 240 },
          flexShrink: 0,
          position: 'relative',
          background: brand.brandLogo || brand.brandImage
            ? `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url(${brand.brandLogo || brand.brandImage})`
            : `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Verified Badge */}
        {brand.verified && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              bgcolor: alpha(theme.palette.success.main, 0.95),
              color: 'white',
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.75rem',
              fontWeight: 600,
              backdropFilter: 'blur(8px)',
            }}
          >
            <Verified sx={{ fontSize: 14 }} />
            Verified
          </Box>
        )}

        {/* ROI Badge */}
        {brand.estimatedROI && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 12,
              left: 12,
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

      {/* Content */}
      <CardContent sx={{ flex: 1, p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  mb: 0.5,
                  color: theme.palette.text.primary,
                }}
              >
                {brand.brandName}
              </Typography>
              
              {/* Category & Industry */}
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
                {brand.brandCategory && (
                  <Chip
                    label={brand.brandCategory}
                    size="small"
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                    }}
                  />
                )}
                {brand.industries && brand.industries[0] && (
                  <Chip
                    label={brand.industries[0]}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem' }}
                  />
                )}
              </Stack>
            </Box>

            {/* Rating */}
            {brand.rating && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  bgcolor: alpha(theme.palette.warning.main, 0.1),
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                }}
              >
                <Star sx={{ fontSize: 16, color: 'warning.main' }} />
                <Typography variant="body2" fontWeight={700}>
                  {brand.rating}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.6,
              mb: 2,
            }}
          >
            {brand.brandStory || brand.description || "Discover this exciting franchise opportunity"}
          </Typography>
        </Box>

        {/* Metrics */}
        <Box sx={{ flex: 1 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
            {/* Investment */}
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <AttachMoney sx={{ fontSize: 18, color: 'primary.main' }} />
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Investment
                </Typography>
              </Box>
              <Typography variant="body1" fontWeight={700} color="primary.main">
                {investmentFormatted}
              </Typography>
            </Box>

            {/* Business Model */}
            {brand.businessModel && (
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Business sx={{ fontSize: 18, color: 'secondary.main' }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    Model
                  </Typography>
                </Box>
                <Typography variant="body2" fontWeight={600}>
                  {brand.businessModel}
                </Typography>
              </Box>
            )}

            {/* Location */}
            {brand.locations && brand.locations.length > 0 && (
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <LocationOn sx={{ fontSize: 18, color: 'info.main' }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    Locations
                  </Typography>
                </Box>
                <Typography variant="body2" fontWeight={600}>
                  {brand.locations.length} {brand.locations.length === 1 ? 'City' : 'Cities'}
                </Typography>
              </Box>
            )}

            {/* Payback Period */}
            {brand.paybackPeriod && (
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <TrendingUp sx={{ fontSize: 18, color: 'success.main' }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    Payback
                  </Typography>
                </Box>
                <Typography variant="body2" fontWeight={600} color="success.main">
                  {brand.paybackPeriod}
                </Typography>
              </Box>
            )}
          </Stack>

          {/* Additional Info Pills */}
          <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
            {brand.royaltyFee && (
              <Chip
                label={`${brand.royaltyFee}% Royalty`}
                size="small"
                sx={{
                  height: 22,
                  fontSize: '0.7rem',
                  bgcolor: alpha(theme.palette.secondary.main, 0.1),
                  color: 'secondary.main',
                  fontWeight: 600,
                }}
              />
            )}
            {brand.profitMargin && (
              <Chip
                label={`${brand.profitMargin}% Margin`}
                size="small"
                sx={{
                  height: 22,
                  fontSize: '0.7rem',
                  bgcolor: alpha(theme.palette.success.main, 0.1),
                  color: 'success.main',
                  fontWeight: 600,
                }}
              />
            )}
            {brand.trainingDuration && (
              <Chip
                label={`${brand.trainingDuration} Training`}
                size="small"
                sx={{
                  height: 22,
                  fontSize: '0.7rem',
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                  fontWeight: 600,
                }}
              />
            )}
            {brand.territoryRights && (
              <Chip
                label="Territory Rights"
                size="small"
                sx={{
                  height: 22,
                  fontSize: '0.7rem',
                  bgcolor: alpha(theme.palette.warning.main, 0.1),
                  color: 'warning.main',
                  fontWeight: 600,
                }}
              />
            )}
            {brand.financingAvailable && (
              <Chip
                label="Financing"
                size="small"
                sx={{
                  height: 22,
                  fontSize: '0.7rem',
                  bgcolor: alpha(theme.palette.info.main, 0.1),
                  color: 'info.main',
                  fontWeight: 600,
                }}
              />
            )}
            {brand.franchiseTermLength && (
              <Chip
                label={`${brand.franchiseTermLength} Term`}
                size="small"
                sx={{
                  height: 22,
                  fontSize: '0.7rem',
                  bgcolor: alpha(theme.palette.secondary.main, 0.1),
                  color: 'secondary.main',
                  fontWeight: 600,
                }}
              />
            )}
          </Stack>
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 'auto' }}>
          <Button
            variant="contained"
            endIcon={<ArrowForward />}
            onClick={handleClick}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
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

export default BrandListItem;
