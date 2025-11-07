import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Grid,
  Chip,
  Stack,
  CircularProgress,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Refresh,
  TrendingUp,
  Star,
  Lightbulb,
  NavigateNext,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useRecommendations from '../../hooks/useRecommendations';

const MotionCard = motion(Card);

/**
 * Personalized Recommendations Component
 * 
 * Displays AI-powered brand recommendations based on user behavior
 */
const PersonalizedRecommendations = ({
  allBrands = [],
  limit = 6,
  excludeBrandIds = [],
  title = 'Recommended For You',
  subtitle = 'Based on your browsing history and preferences',
  variant = 'default', // 'default' | 'compact' | 'sidebar'
  showReasons = true,
  onBrandClick,
}) => {
  const navigate = useNavigate();
  const { recommendations, loading, refresh } = useRecommendations(allBrands, {
    limit,
    excludeBrandIds,
  });

  const handleBrandClick = (brand) => {
    if (onBrandClick) {
      onBrandClick(brand);
    } else {
      navigate(`/brands/${brand.slug}`);
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Personalizing recommendations...
        </Typography>
      </Box>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Lightbulb sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No recommendations yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Browse some brands to get personalized recommendations
        </Typography>
        <Button
          variant="outlined"
          onClick={() => navigate('/brands')}
        >
          Explore Brands
        </Button>
      </Box>
    );
  }

  // Compact variant for sidebar/small spaces
  if (variant === 'compact') {
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Star sx={{ color: 'primary.main' }} />
            {title}
          </Typography>
          <Tooltip title="Refresh recommendations">
            <IconButton size="small" onClick={refresh}>
              <Refresh fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        
        <Stack spacing={1.5}>
          {recommendations.map(({ brand, reasons }, index) => (
            <MotionCard
              key={brand.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 3,
                  transform: 'translateX(4px)',
                  transition: 'all 0.2s',
                },
              }}
              onClick={() => handleBrandClick(brand)}
            >
              <CardActionArea>
                <Box sx={{ display: 'flex', p: 1.5 }}>
                  {brand.logoUrl && (
                    <CardMedia
                      component="img"
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 1,
                        objectFit: 'cover',
                        mr: 1.5,
                      }}
                      image={brand.logoUrl}
                      alt={brand.brandName}
                    />
                  )}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle2" noWrap>
                      {brand.brandName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {brand.category}
                    </Typography>
                    {showReasons && reasons.length > 0 && (
                      <Chip
                        label={reasons[0]}
                        size="small"
                        sx={{ mt: 0.5, height: 20, fontSize: '0.7rem' }}
                      />
                    )}
                  </Box>
                </Box>
              </CardActionArea>
            </MotionCard>
          ))}
        </Stack>
        
        <Button
          fullWidth
          variant="text"
          endIcon={<NavigateNext />}
          onClick={() => navigate('/brands')}
          sx={{ mt: 2 }}
        >
          View All Brands
        </Button>
      </Box>
    );
  }

  // Sidebar variant
  if (variant === 'sidebar') {
    return (
      <Card sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontSize="1rem">
            {title}
          </Typography>
          <IconButton size="small" onClick={refresh}>
            <Refresh fontSize="small" />
          </IconButton>
        </Box>
        
        <Stack spacing={2}>
          {recommendations.slice(0, 3).map(({ brand, reasons }) => (
            <Box
              key={brand.id}
              sx={{
                cursor: 'pointer',
                '&:hover': { opacity: 0.8 },
              }}
              onClick={() => handleBrandClick(brand)}
            >
              <Typography variant="subtitle2" gutterBottom>
                {brand.brandName}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                {brand.category}
              </Typography>
              {showReasons && reasons.length > 0 && (
                <Typography variant="caption" color="primary.main" sx={{ fontStyle: 'italic' }}>
                  {reasons[0]}
                </Typography>
              )}
            </Box>
          ))}
        </Stack>
      </Card>
    );
  }

  // Default variant - full grid
  return (
    <Box sx={{ mb: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUp sx={{ color: 'primary.main' }} />
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
        <Button
          startIcon={<Refresh />}
          onClick={refresh}
          variant="outlined"
          size="small"
        >
          Refresh
        </Button>
      </Box>

      <Grid container spacing={3}>
        {recommendations.map(({ brand, score, reasons }, index) => (
          <Grid item xs={12} sm={6} md={4} key={brand.id}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, boxShadow: 6 }}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
              }}
              onClick={() => handleBrandClick(brand)}
            >
              <CardActionArea sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                {brand.logoUrl && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={brand.logoUrl}
                    alt={brand.brandName}
                    sx={{ objectFit: 'cover' }}
                  />
                )}
                
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {brand.brandName}
                  </Typography>
                  
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip
                      label={brand.category}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    {brand.initialInvestment && (
                      <Chip
                        label={`$${(brand.initialInvestment / 1000).toFixed(0)}K`}
                        size="small"
                      />
                    )}
                  </Stack>
                  
                  {brand.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {brand.description}
                    </Typography>
                  )}
                  
                  {showReasons && reasons.length > 0 && (
                    <Box sx={{ mt: 'auto' }}>
                      <Typography variant="caption" color="primary.main" sx={{ fontStyle: 'italic' }}>
                        <Lightbulb sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                        {reasons[0]}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </CardActionArea>
            </MotionCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PersonalizedRecommendations;
