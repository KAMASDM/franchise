import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  useTheme,
  alpha,
  Chip,
} from '@mui/material';
import {
  History as HistoryIcon,
  Clear as ClearIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRecentlyViewed } from '../../hooks/useRecentlyViewed';
import { getBrandUrl } from '../../utils/brandUtils';
import { formatDistanceToNow } from 'date-fns';

const MotionCard = motion(Card);

/**
 * Recently Viewed Brands Component
 * Displays a horizontal scrollable list of recently viewed brands
 */
const RecentlyViewedBrands = ({ limit = 6, showTitle = true }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { recentBrands, clearRecentBrands } = useRecentlyViewed();
  const scrollRef = React.useRef(null);

  if (!recentBrands || recentBrands.length === 0) {
    return null;
  }

  const displayedBrands = limit ? recentBrands.slice(0, limit) : recentBrands;

  return (
    <Box sx={{ py: 3 }}>
      {/* Header */}
      {showTitle && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <HistoryIcon color="action" />
            Recently Viewed
          </Typography>
          
          <IconButton
            size="small"
            onClick={clearRecentBrands}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                color: 'error.main',
              },
            }}
            title="Clear history"
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      {/* Horizontal Scroll Container */}
      <Box
        ref={scrollRef}
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            height: 6,
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: alpha(theme.palette.divider, 0.1),
            borderRadius: 3,
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: alpha(theme.palette.primary.main, 0.3),
            borderRadius: 3,
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.5),
            },
          },
          pb: 1,
        }}
      >
        {displayedBrands.map((brand, index) => (
          <RecentBrandCard
            key={brand.id}
            brand={brand}
            index={index}
            onClick={() => navigate(getBrandUrl(brand))}
          />
        ))}
      </Box>
    </Box>
  );
};

/**
 * Individual Recently Viewed Brand Card
 */
const RecentBrandCard = ({ brand, index, onClick }) => {
  const theme = useTheme();

  // Calculate time since viewed
  const timeAgo = brand.viewedAt
    ? formatDistanceToNow(new Date(brand.viewedAt), { addSuffix: true })
    : '';

  return (
    <MotionCard
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      sx={{
        minWidth: 260,
        maxWidth: 260,
        cursor: 'pointer',
        position: 'relative',
        '&:hover': {
          boxShadow: theme.shadows[6],
          '& .brand-image': {
            transform: 'scale(1.05)',
          },
          '& .view-arrow': {
            opacity: 1,
            transform: 'translateX(0)',
          },
        },
      }}
    >
      {/* Time Badge */}
      {timeAgo && (
        <Chip
          label={timeAgo}
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
            bgcolor: alpha(theme.palette.background.paper, 0.9),
            fontSize: '0.7rem',
            height: 22,
          }}
        />
      )}

      <CardMedia
        component="img"
        height="120"
        image={brand.brandLogo || brand.brandImage || '/placeholder-brand.jpg'}
        alt={brand.brandName}
        className="brand-image"
        sx={{
          objectFit: 'cover',
          transition: 'transform 0.3s ease',
          bgcolor: alpha(theme.palette.primary.main, 0.05),
        }}
      />

      <CardContent sx={{ pb: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            mb: 0.5,
          }}
        >
          {brand.brandName}
        </Typography>

        {brand.category && (
          <Chip
            label={brand.category}
            size="small"
            variant="outlined"
            color="primary"
            sx={{ fontSize: '0.7rem', height: 20, mb: 1 }}
          />
        )}

        {brand.initialFranchiseFee && (
          <Typography variant="body2" color="text.secondary">
            ₹{Number(brand.initialFranchiseFee).toLocaleString('en-IN')}
          </Typography>
        )}

        {/* Hover Arrow */}
        <Box
          className="view-arrow"
          sx={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            opacity: 0,
            transform: 'translateX(-5px)',
            transition: 'all 0.3s ease',
            color: 'primary.main',
          }}
        >
          <ArrowForwardIcon fontSize="small" />
        </Box>
      </CardContent>
    </MotionCard>
  );
};

/**
 * Compact Recently Viewed List (for sidebar/dashboard)
 */
export const RecentlyViewedList = ({ limit = 5 }) => {
  const navigate = useNavigate();
  const { recentBrands } = useRecentlyViewed();

  if (!recentBrands || recentBrands.length === 0) {
    return null;
  }

  const displayedBrands = limit ? recentBrands.slice(0, limit) : recentBrands;

  return (
    <Box>
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 700,
          mb: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          color: 'text.secondary',
        }}
      >
        <HistoryIcon fontSize="small" />
        Recently Viewed
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {displayedBrands.map((brand) => (
          <Box
            key={brand.id}
            onClick={() => navigate(getBrandUrl(brand))}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 1,
              borderRadius: 1,
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: 'action.hover',
                transform: 'translateX(4px)',
              },
            }}
          >
            <Box
              component="img"
              src={brand.brandLogo || brand.brandImage || '/placeholder-brand.jpg'}
              alt={brand.brandName}
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1,
                objectFit: 'cover',
              }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {brand.brandName}
              </Typography>
              {brand.viewedAt && (
                <Typography variant="caption" color="text.secondary">
                  {formatDistanceToNow(new Date(brand.viewedAt), { addSuffix: true })}
                </Typography>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default RecentlyViewedBrands;
