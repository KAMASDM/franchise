/**
 * Featured Brands Carousel
 * Auto-scrolling carousel showing recently registered or featured brands
 */

import React, { useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Button,
  useTheme,
  alpha,
  IconButton,
  Stack,
} from '@mui/material';
import {
  ArrowForward,
  AttachMoney,
  TrendingUp,
  NavigateBefore,
  NavigateNext,
  Verified,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import { useBrands } from '../../hooks/useBrands';
import { getBrandUrl } from '../../utils/brandUtils';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

/**
 * Brand Card for Carousel
 */
const BrandCard = ({ brand }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(getBrandUrl(brand));
  };

  return (
    <Box sx={{ px: 1.5 }}>
      <MotionCard
        whileHover={{ y: -8, scale: 1.02 }}
        onClick={handleClick}
        sx={{
          cursor: 'pointer',
          height: '100%',
          borderRadius: 3,
          overflow: 'hidden',
          border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            borderColor: theme.palette.primary.main,
            boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.25)}`,
            '& .brand-image': {
              transform: 'scale(1.15)',
            },
          },
        }}
      >
        {/* Brand Image */}
        <Box
          sx={{
            position: 'relative',
            height: 200,
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
          
          {/* Verified Badge */}
          {brand.verificationStatus === 'verified' && (
            <Chip
              icon={<Verified />}
              label="Verified"
              size="small"
              color="success"
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                fontWeight: 600,
              }}
            />
          )}
          
          {/* New Badge for recently registered */}
          {brand.isNew && (
            <Chip
              label="New"
              size="small"
              color="error"
              sx={{
                position: 'absolute',
                top: 12,
                left: 12,
                fontWeight: 600,
              }}
            />
          )}
        </Box>

        {/* Brand Info */}
        <CardContent sx={{ p: 2.5 }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {brand.brandName || brand.name}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              height: 40,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {brand.brandDescription || brand.description || 'Premium franchise opportunity'}
          </Typography>

          <Stack spacing={1.5}>
            {/* Investment */}
            {brand.brandInvestment && (
              <Box display="flex" alignItems="center" gap={1}>
                <AttachMoney fontSize="small" color="primary" />
                <Typography variant="body2" fontWeight="600" color="text.primary">
                  ₹{(brand.brandInvestment / 100000).toFixed(1)}L - ₹
                  {((brand.brandInvestment * 1.5) / 100000).toFixed(1)}L
                </Typography>
              </Box>
            )}

            {/* Business Model */}
            {brand.businessModel && brand.businessModel.length > 0 && (
              <Box display="flex" alignItems="center" gap={1}>
                <TrendingUp fontSize="small" color="secondary" />
                <Typography variant="body2" color="text.secondary">
                  {Array.isArray(brand.businessModel) 
                    ? brand.businessModel.join(', ')
                    : brand.businessModel}
                </Typography>
              </Box>
            )}
          </Stack>

          <Button
            variant="contained"
            endIcon={<ArrowForward />}
            fullWidth
            sx={{ mt: 2.5, borderRadius: 2, fontWeight: 600 }}
            onClick={handleClick}
          >
            View Details
          </Button>
        </CardContent>
      </MotionCard>
    </Box>
  );
};

/**
 * Custom Arrow Components
 */
const PrevArrow = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: 'absolute',
      left: { xs: -16, md: -24 },
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 2,
      bgcolor: 'background.paper',
      boxShadow: 3,
      '&:hover': { bgcolor: 'primary.main', color: 'white' },
      display: { xs: 'none', md: 'flex' },
    }}
  >
    <NavigateBefore />
  </IconButton>
);

const NextArrow = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: 'absolute',
      right: { xs: -16, md: -24 },
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 2,
      bgcolor: 'background.paper',
      boxShadow: 3,
      '&:hover': { bgcolor: 'primary.main', color: 'white' },
      display: { xs: 'none', md: 'flex' },
    }}
  >
    <NavigateNext />
  </IconButton>
);

/**
 * Main Featured Brands Carousel Component
 */
const FeaturedBrandsCarousel = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const { brands, loading } = useBrands();

  // Filter and sort brands (recently registered or featured)
  const getFeaturedBrands = () => {
    if (!brands || brands.length === 0) return [];
    
    // Mark new brands (registered in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const brandsWithNewFlag = brands.map(brand => ({
      ...brand,
      isNew: brand.createdAt && new Date(brand.createdAt.toDate?.() || brand.createdAt) > thirtyDaysAgo,
    }));

    // Sort: verified first, then new, then by creation date
    return brandsWithNewFlag
      .sort((a, b) => {
        // Verified brands first
        if (a.verificationStatus === 'verified' && b.verificationStatus !== 'verified') return -1;
        if (a.verificationStatus !== 'verified' && b.verificationStatus === 'verified') return 1;
        
        // Then new brands
        if (a.isNew && !b.isNew) return -1;
        if (!a.isNew && b.isNew) return 1;
        
        // Then by creation date
        const dateA = new Date(a.createdAt?.toDate?.() || a.createdAt || 0);
        const dateB = new Date(b.createdAt?.toDate?.() || b.createdAt || 0);
        return dateB - dateA;
      })
      .slice(0, 12); // Show top 12 brands
  };

  const featuredBrands = getFeaturedBrands();

  // Adjust slides to show based on number of brands
  const slidesToShow = Math.min(4, featuredBrands.length);

  const sliderSettings = {
    dots: true,
    infinite: featuredBrands.length > 1,
    speed: 600,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    autoplay: featuredBrands.length > 1,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1536,
        settings: {
          slidesToShow: Math.min(3, featuredBrands.length),
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: Math.min(3, featuredBrands.length),
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: Math.min(2, featuredBrands.length),
          arrows: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          arrows: false,
        },
      },
    ],
  };

  if (loading || featuredBrands.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        bgcolor: alpha(theme.palette.background.default, 0.5),
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="xl">
        {/* Section Header */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          sx={{ textAlign: 'center', mb: 6 }}
        >
          <Typography
            variant="h3"
            fontWeight="bold"
            gutterBottom
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Featured Franchise Opportunities
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 700, mx: 'auto', mb: 2 }}
          >
            Discover our handpicked selection of verified and recently added franchise brands
          </Typography>
        </MotionBox>

        {/* Carousel */}
        <Box
          sx={{
            position: 'relative',
            px: { xs: 0, md: 4 },
            '& .slick-dots': {
              bottom: -45,
              '& li button:before': {
                fontSize: 12,
                color: theme.palette.primary.main,
              },
              '& li.slick-active button:before': {
                color: theme.palette.primary.main,
              },
            },
          }}
        >
          <Slider ref={sliderRef} {...sliderSettings}>
            {featuredBrands.map((brand, index) => (
              <BrandCard key={brand.id || index} brand={brand} />
            ))}
          </Slider>
        </Box>

        {/* View All Button */}
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            onClick={() => navigate('/brands')}
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontWeight: 600,
              fontSize: '1.1rem',
            }}
          >
            Explore All Brands
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default FeaturedBrandsCarousel;
