/**
 * Modern Featured Franchise Section
 * Enterprise-level design with enhanced brand cards
 */

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  Avatar,
  AvatarGroup,
} from '@mui/material';
import {
  ArrowForward,
  TrendingUp,
  Schedule,
  AttachMoney,
  LocationOn,
  Verified,
  Star,
  FavoriteBorder,
  Favorite,
  Share,
  InfoOutlined,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useBrands } from '../../hooks/useBrands';
import { getBrandUrl } from '../../utils/brandUtils';

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionButton = motion(Button);

/**
 * Modern Brand Card Component
 */
const ModernBrandCard = ({ brand, index }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);

  const handleCardClick = () => {
    navigate(getBrandUrl(brand));
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    // Share functionality
  };

  return (
    <MotionCard
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -12, scale: 1.02 }}
      onClick={handleCardClick}
      sx={{
        height: '100%',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          borderColor: theme.palette.primary.main,
          boxShadow: `0 24px 48px ${alpha(theme.palette.primary.main, 0.2)}`,
          '& .brand-image': {
            transform: 'scale(1.1)',
          },
          '& .hover-overlay': {
            opacity: 1,
          },
        },
      }}
    >
      {/* Image Section */}
      <Box
        sx={{
          position: 'relative',
          height: 240,
          overflow: 'hidden',
          bgcolor: alpha(theme.palette.primary.main, 0.05),
        }}
      >
        <CardMedia
          component="img"
          image={brand.brandLogo || brand.imageUrl || '/placeholder-brand.jpg'}
          alt={brand.brandName || brand.name}
          className="brand-image"
          sx={{
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />

        {/* Overlay on Hover */}
        <Box
          className="hover-overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(to bottom, transparent 0%, ${alpha(
              theme.palette.common.black,
              0.7
            )} 100%)`,
            opacity: 0,
            transition: 'opacity 0.4s',
            display: 'flex',
            alignItems: 'flex-end',
            p: 2,
          }}
        >
          <Button
            variant="contained"
            endIcon={<ArrowForward />}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': { bgcolor: 'grey.100' },
              fontWeight: 700,
              borderRadius: 2,
            }}
          >
            View Details
          </Button>
        </Box>

        {/* Top Badges */}
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            right: 12,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <Stack direction="row" spacing={1}>
            {brand.verified && (
              <Chip
                icon={<Verified sx={{ fontSize: 16 }} />}
                label="Verified"
                size="small"
                sx={{
                  bgcolor: alpha(theme.palette.success.main, 0.95),
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  backdropFilter: 'blur(10px)',
                }}
              />
            )}
            {brand.featured && (
              <Chip
                label="Featured"
                size="small"
                sx={{
                  bgcolor: alpha(theme.palette.warning.main, 0.95),
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  backdropFilter: 'blur(10px)',
                }}
              />
            )}
          </Stack>

          <Stack direction="row" spacing={0.5}>
            <IconButton
              size="small"
              onClick={handleFavoriteClick}
              sx={{
                bgcolor: alpha(theme.palette.background.paper, 0.95),
                backdropFilter: 'blur(10px)',
                '&:hover': { bgcolor: alpha(theme.palette.background.paper, 1) },
              }}
            >
              {isFavorited ? (
                <Favorite sx={{ fontSize: 18, color: 'error.main' }} />
              ) : (
                <FavoriteBorder sx={{ fontSize: 18 }} />
              )}
            </IconButton>
            <IconButton
              size="small"
              onClick={handleShareClick}
              sx={{
                bgcolor: alpha(theme.palette.background.paper, 0.95),
                backdropFilter: 'blur(10px)',
                '&:hover': { bgcolor: alpha(theme.palette.background.paper, 1) },
              }}
            >
              <Share sx={{ fontSize: 18 }} />
            </IconButton>
          </Stack>
        </Box>

        {/* Rating Badge */}
        {brand.rating && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              bgcolor: alpha(theme.palette.background.paper, 0.95),
              backdropFilter: 'blur(10px)',
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
            }}
          >
            <Star sx={{ fontSize: 16, color: 'warning.main' }} />
            <Typography variant="caption" fontWeight="700">
              {brand.rating}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Content Section */}
      <CardContent sx={{ p: 3 }}>
        {/* Category */}
        <Typography
          variant="caption"
          sx={{
            color: 'primary.main',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 1,
            fontSize: '0.7rem',
          }}
        >
          {brand.industry || brand.category || 'Food & Beverage'}
        </Typography>

        {/* Brand Name */}
        <Typography
          variant="h5"
          fontWeight="800"
          gutterBottom
          sx={{
            mt: 1,
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {brand.brandName || brand.name}
        </Typography>

        {/* Key Metrics */}
        <Stack spacing={1.5} sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1.5,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AttachMoney sx={{ fontSize: 18, color: 'primary.main' }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Investment Range
              </Typography>
              <Typography variant="body2" fontWeight="700">
                {brand.investmentRange || `₹${(brand.investmentRequired / 100000).toFixed(0)}L - ₹${((brand.investmentRequired * 1.5) / 100000).toFixed(0)}L`}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1.5,
                bgcolor: alpha(theme.palette.success.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TrendingUp sx={{ fontSize: 18, color: 'success.main' }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Expected ROI
              </Typography>
              <Typography variant="body2" fontWeight="700" color="success.main">
                {brand.roi || '25-30%'}
              </Typography>
            </Box>
          </Box>

          {brand.city && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1.5,
                  bgcolor: alpha(theme.palette.info.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <LocationOn sx={{ fontSize: 18, color: 'info.main' }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Location
                </Typography>
                <Typography variant="body2" fontWeight="700">
                  {brand.city}
                </Typography>
              </Box>
            </Box>
          )}
        </Stack>

        {/* Footer */}
        <Box
          sx={{
            pt: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            <Schedule sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
            Updated recently
          </Typography>
          <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.75rem' } }}>
            <Avatar>A</Avatar>
            <Avatar>B</Avatar>
            <Avatar>C</Avatar>
          </AvatarGroup>
        </Box>
      </CardContent>
    </MotionCard>
  );
};

/**
 * Main Featured Franchise Section
 */
const ModernFeaturedFranchise = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { brands = [], loading, error } = useBrands(null, { limit: 6 });

  const displayBrands = brands.length > 0 ? brands : [
    {
      id: 1,
      brandName: "McDonald's India",
      industry: 'Quick Service Restaurant',
      investmentRequired: 2000000,
      city: 'Pan India',
      verified: true,
      featured: true,
      rating: 4.8,
      roi: '28-32%',
    },
    {
      id: 2,
      brandName: 'Subway',
      industry: 'Fast Food',
      investmentRequired: 1200000,
      city: 'Multiple Cities',
      verified: true,
      rating: 4.6,
      roi: '25-30%',
    },
    {
      id: 3,
      brandName: 'Café Coffee Day',
      industry: 'Café & Coffee',
      investmentRequired: 1500000,
      city: 'Bangalore',
      verified: true,
      featured: true,
      rating: 4.7,
      roi: '22-27%',
    },
    {
      id: 4,
      brandName: 'Dominos Pizza',
      industry: 'Pizza Chain',
      investmentRequired: 1800000,
      city: 'Delhi NCR',
      verified: true,
      rating: 4.9,
      roi: '30-35%',
    },
    {
      id: 5,
      brandName: 'KFC India',
      industry: 'Quick Service',
      investmentRequired: 2500000,
      city: 'Mumbai',
      verified: true,
      rating: 4.7,
      roi: '26-31%',
    },
    {
      id: 6,
      brandName: 'Burger King',
      industry: 'Fast Food',
      investmentRequired: 2200000,
      city: 'Pune',
      verified: true,
      featured: true,
      rating: 4.8,
      roi: '27-32%',
    },
  ];

  if (loading) {
    return (
      <Box sx={{ py: 10, textAlign: 'center' }}>
        <Typography>Loading brands...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.03,
          backgroundImage: `linear-gradient(${theme.palette.primary.main} 1.5px, transparent 1.5px), linear-gradient(90deg, ${theme.palette.primary.main} 1.5px, transparent 1.5px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative' }}>
        {/* Header */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          sx={{ textAlign: 'center', mb: 8 }}
        >
          <Chip
            label="Featured Opportunities"
            sx={{
              mb: 2,
              bgcolor: alpha(theme.palette.secondary.main, 0.1),
              color: 'secondary.main',
              fontWeight: 700,
              fontSize: '0.875rem',
              px: 2,
              py: 2.5,
            }}
          />
          <Typography
            variant="h2"
            fontWeight="800"
            gutterBottom
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.secondary.main} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Premium Franchise Opportunities
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 700, mx: 'auto', lineHeight: 1.7 }}
          >
            Handpicked verified franchises with proven business models and exceptional support
          </Typography>
        </MotionBox>

        {/* Brand Cards Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
            },
            gap: 4,
            mb: 6,
          }}
        >
          {displayBrands.map((brand, index) => (
            <ModernBrandCard key={brand.id} brand={brand} index={index} />
          ))}
        </Box>

        {/* CTA Section */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          sx={{ textAlign: 'center' }}
        >
          <MotionButton
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            onClick={() => navigate('/brands')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            sx={{
              px: 5,
              py: 2,
              fontSize: '1.125rem',
              fontWeight: 700,
              borderRadius: 2,
              textTransform: 'none',
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
              '&:hover': {
                boxShadow: `0 16px 40px ${alpha(theme.palette.primary.main, 0.4)}`,
              },
            }}
          >
            Explore All Franchises
          </MotionButton>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default ModernFeaturedFranchise;
