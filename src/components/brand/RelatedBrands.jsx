import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material';
import {
  ArrowBackIos,
  ArrowForwardIos,
  TrendingUp,
  Star,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

/**
 * Related Brands Carousel
 * Shows similar/recommended brands based on category, investment range, or business model
 * 
 * @param {Object} props
 * @param {Array} props.brands - Array of brand objects to display
 * @param {string} props.title - Section title (default: "Related Brands")
 * @param {string} props.currentBrandId - ID of current brand to exclude from related brands
 */
const RelatedBrands = ({ 
  brands = [], 
  title = "Related Brands You May Like",
  currentBrandId = null 
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const scrollRef = React.useRef(null);

  // Filter out current brand
  const relatedBrands = brands.filter(brand => brand.id !== currentBrandId);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 320; // Card width + gap
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!relatedBrands || relatedBrands.length === 0) {
    return null;
  }

  return (
    <Box sx={{ py: 4, position: 'relative' }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: 700,
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {title}
        <TrendingUp color="primary" />
      </Typography>

      {/* Scroll Buttons */}
      <IconButton
        onClick={() => scroll('left')}
        sx={{
          position: 'absolute',
          left: -20,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          bgcolor: 'background.paper',
          boxShadow: 2,
          '&:hover': {
            bgcolor: 'background.paper',
            boxShadow: 4,
          },
          display: { xs: 'none', md: 'flex' },
        }}
      >
        <ArrowBackIos sx={{ fontSize: 20 }} />
      </IconButton>

      <IconButton
        onClick={() => scroll('right')}
        sx={{
          position: 'absolute',
          right: -20,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          bgcolor: 'background.paper',
          boxShadow: 2,
          '&:hover': {
            bgcolor: 'background.paper',
            boxShadow: 4,
          },
          display: { xs: 'none', md: 'flex' },
        }}
      >
        <ArrowForwardIos sx={{ fontSize: 20 }} />
      </IconButton>

      {/* Horizontal Scrollable Container */}
      <Box
        ref={scrollRef}
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            height: 8,
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: alpha(theme.palette.divider, 0.1),
            borderRadius: 4,
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: alpha(theme.palette.primary.main, 0.3),
            borderRadius: 4,
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.5),
            },
          },
          pb: 1,
        }}
      >
        {relatedBrands.map((brand, index) => (
          <RelatedBrandCard
            key={brand.id || index}
            brand={brand}
            index={index}
            onClick={() => navigate(`/brand/${brand.slug || brand.id}`)}
          />
        ))}
      </Box>
    </Box>
  );
};

/**
 * Individual Related Brand Card
 */
const RelatedBrandCard = ({ brand, index, onClick }) => {
  const theme = useTheme();

  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      onClick={onClick}
      sx={{
        minWidth: 300,
        maxWidth: 300,
        cursor: 'pointer',
        position: 'relative',
        overflow: 'visible',
        '&:hover': {
          boxShadow: theme.shadows[8],
          '& .brand-image': {
            transform: 'scale(1.05)',
          },
        },
      }}
    >
      {/* Featured Badge */}
      {brand.featured && (
        <Chip
          icon={<Star sx={{ fontSize: 16 }} />}
          label="Featured"
          color="primary"
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 1,
            fontWeight: 600,
          }}
        />
      )}

      <CardMedia
        component="img"
        height="160"
        image={brand.logoUrl || brand.imageUrl || '/placeholder-brand.jpg'}
        alt={brand.name}
        className="brand-image"
        sx={{
          objectFit: 'cover',
          transition: 'transform 0.3s ease',
          bgcolor: alpha(theme.palette.primary.main, 0.05),
        }}
      />

      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {brand.name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: 40,
          }}
        >
          {brand.description || brand.shortDescription || 'Explore this franchise opportunity'}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
          {brand.category && (
            <Chip
              label={brand.category}
              size="small"
              variant="outlined"
              color="primary"
            />
          )}
          {brand.businessModel && (
            <Chip
              label={brand.businessModel}
              size="small"
              variant="outlined"
            />
          )}
        </Box>

        {brand.minInvestment && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pt: 1.5,
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Min. Investment
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
              }}
            >
              ₹{brand.minInvestment.toLocaleString('en-IN')}
            </Typography>
          </Box>
        )}
      </CardContent>
    </MotionCard>
  );
};

export default RelatedBrands;
