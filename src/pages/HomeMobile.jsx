import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Grid,
} from '@mui/material';
import {
  TrendingUp,
  Security,
  Support,
  Search as SearchIcon,
  ArrowForward,
  Star,
  Business,
  AttachMoney,
  EmojiEvents,
  LocalShipping,
  Restaurant,
  FitnessCenter,
  School,
  ShoppingCart,
  ChevronRight,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useDevice } from '../hooks/useDevice';
import { useAllBrands } from '../hooks/useAllBrands';
import { getBrandUrl } from '../utils/brandUtils';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

/**
 * Mobile-Optimized Home Page
 * Native app feeling with cards, horizontal scrolls, and touch interactions
 */
const HomeMobile = () => {
  const navigate = useNavigate();
  const { spacing } = useDevice();
  const { brands, loading } = useAllBrands();
  const [searchQuery, setSearchQuery] = useState('');

  const featuredBrands = brands?.slice(0, 10) || [];
  const topInvestments = brands?.sort((a, b) => (b.brandInvestment || 0) - (a.brandInvestment || 0)).slice(0, 5) || [];

  // Quick stats
  const stats = [
    { label: 'Brands', value: '500+', icon: <Business />, color: 'primary' },
    { label: 'Placements', value: '5K+', icon: <TrendingUp />, color: 'success' },
    { label: 'Success Rate', value: '95%', icon: <Star />, color: 'warning' },
    { label: 'ROI', value: '25%+', icon: <AttachMoney />, color: 'secondary' },
  ];

  // Categories with icons
  const categories = [
    { name: 'Food & Beverage', icon: <Restaurant />, color: '#FF6B6B', count: 120 },
    { name: 'Retail', icon: <ShoppingCart />, color: '#4ECDC4', count: 85 },
    { name: 'Fitness', icon: <FitnessCenter />, color: '#FFE66D', count: 45 },
    { name: 'Education', icon: <School />, color: '#95E1D3', count: 60 },
    { name: 'Logistics', icon: <LocalShipping />, color: '#F38181', count: 38 },
  ];

  const features = [
    {
      icon: <TrendingUp fontSize="large" />,
      title: 'Proven ROI',
      description: 'Verified track records',
      color: 'primary.main',
    },
    {
      icon: <Security fontSize="large" />,
      title: 'Verified Brands',
      description: 'Trusted partners only',
      color: 'success.main',
    },
    {
      icon: <Support fontSize="large" />,
      title: 'Expert Guidance',
      description: '24/7 support team',
      color: 'secondary.main',
    },
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/brands?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/brands');
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Section with Search */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          p: 3,
          pb: 4,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
        }}
      >
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography 
            variant="h4" 
            fontWeight="bold" 
            gutterBottom
            sx={{ mt: 2 }}
          >
            Find Your Perfect
            <br />
            Franchise 🚀
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.95, mb: 3 }}>
            Discover 500+ verified franchise opportunities
          </Typography>

          {/* Search Bar */}
          <TextField
            fullWidth
            placeholder="Search brands, industries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            sx={{
              bgcolor: 'rgba(255,255,255,0.95)',
              borderRadius: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                '& fieldset': {
                  border: 'none',
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton 
                    onClick={handleSearch}
                    sx={{ 
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': { bgcolor: 'primary.dark' },
                    }}
                  >
                    <ArrowForward />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </MotionBox>
      </Box>

      {/* Quick Stats */}
      <Box sx={{ px: 2, mt: -3 }}>
        <Grid container spacing={1.5}>
          {stats.map((stat, idx) => (
            <Grid item xs={6} key={idx}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                sx={{
                  p: 2,
                  textAlign: 'center',
                  bgcolor: 'background.paper',
                  borderRadius: 3,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: `${stat.color}.lighter`,
                    color: `${stat.color}.main`,
                    width: 48,
                    height: 48,
                    mx: 'auto',
                    mb: 1,
                  }}
                >
                  {stat.icon}
                </Avatar>
                <Typography variant="h5" fontWeight="bold" color="text.primary">
                  {stat.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stat.label}
                </Typography>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Categories */}
      <Box sx={{ p: 2, pt: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            Browse Categories
          </Typography>
          <Button 
            size="small" 
            endIcon={<ChevronRight />}
            onClick={() => navigate('/brands')}
          >
            See All
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', pb: 1 }}>
          {categories.map((category, idx) => (
            <MotionBox
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => navigate(`/brands?industry=${encodeURIComponent(category.name)}`)}
              sx={{ cursor: 'pointer' }}
            >
              <Card
                sx={{
                  minWidth: 110,
                  p: 2,
                  textAlign: 'center',
                  borderRadius: 3,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  transition: 'all 0.2s',
                  '&:active': {
                    transform: 'scale(0.95)',
                  },
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: category.color,
                    color: 'white',
                    width: 56,
                    height: 56,
                    mx: 'auto',
                    mb: 1,
                  }}
                >
                  {category.icon}
                </Avatar>
                <Typography variant="caption" fontWeight="600" display="block" gutterBottom>
                  {category.name}
                </Typography>
                <Chip 
                  label={`${category.count}+`} 
                  size="small" 
                  sx={{ 
                    height: 20,
                    fontSize: '0.65rem',
                    bgcolor: 'action.hover',
                  }}
                />
              </Card>
            </MotionBox>
          ))}
        </Box>
      </Box>

      {/* Featured Brands */}
      <Box sx={{ py: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" px={2} mb={2}>
          <Typography variant="h6" fontWeight="bold">
            Featured Brands
          </Typography>
          <Button 
            size="small" 
            endIcon={<ChevronRight />}
            onClick={() => navigate('/brands')}
          >
            View All
          </Button>
        </Box>

        <Box 
          sx={{ 
            display: 'flex', 
            gap: 2, 
            overflowX: 'auto', 
            px: 2, 
            pb: 2,
            scrollSnapType: 'x mandatory',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          {featuredBrands.map((brand, idx) => (
            <Card
              key={brand.id || idx}
              onClick={() => navigate(getBrandUrl(brand))}
              sx={{
                minWidth: 280,
                maxWidth: 280,
                scrollSnapAlign: 'start',
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:active': {
                  transform: 'scale(0.98)',
                },
              }}
            >
              <Box
                sx={{
                  height: 140,
                  backgroundImage: `url(${brand.brandImage || brand.brandLogo})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                }}
              >
                <Chip
                  label="Featured"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    bgcolor: 'warning.main',
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
              </Box>
              <CardContent sx={{ pb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {brand.brandName}
                </Typography>
                <Box display="flex" gap={0.5} mb={1.5} flexWrap="wrap">
                  {brand.industries?.slice(0, 2).map((ind, i) => (
                    <Chip 
                      key={i}
                      label={ind} 
                      size="small" 
                      variant="outlined"
                      sx={{ height: 22, fontSize: '0.7rem' }}
                    />
                  ))}
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Investment
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" color="primary.main">
                      ₹{(brand.brandInvestment / 100000).toFixed(1)}L
                    </Typography>
                  </Box>
                  <Button 
                    size="small" 
                    variant="contained"
                    endIcon={<ArrowForward />}
                    sx={{ borderRadius: 2 }}
                  >
                    Explore
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Why Choose Us */}
      <Box sx={{ px: 2, py: 3, bgcolor: 'background.paper' }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom align="center">
          Why Choose Us?
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" mb={3}>
          Your trusted partner in franchise success
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>
          {features.map((feature, idx) => (
            <MotionCard
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              sx={{
                display: 'flex',
                p: 2,
                borderRadius: 3,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              <Avatar
                sx={{
                  bgcolor: `${feature.color.split('.')[0]}.lighter`,
                  color: feature.color,
                  width: 56,
                  height: 56,
                  mr: 2,
                }}
              >
                {feature.icon}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Box>
            </MotionCard>
          ))}
        </Box>
      </Box>

      {/* CTA Section */}
      <Box 
        sx={{ 
          p: 3,
          mx: 2,
          my: 3,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <EmojiEvents sx={{ fontSize: 48, mb: 1 }} />
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Ready to Start?
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.95, mb: 2 }}>
          Register your brand or find your perfect franchise today
        </Typography>
        <Box display="flex" gap={1} justifyContent="center">
          <Button 
            variant="contained"
            sx={{ 
              bgcolor: 'white',
              color: 'primary.main',
              fontWeight: 'bold',
              borderRadius: 2,
              '&:hover': {
                bgcolor: 'grey.100',
              },
            }}
            onClick={() => navigate('/brands')}
          >
            Browse Brands
          </Button>
          <Button 
            variant="outlined"
            sx={{ 
              borderColor: 'white',
              color: 'white',
              fontWeight: 'bold',
              borderRadius: 2,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)',
                borderColor: 'white',
              },
            }}
            onClick={() => navigate('/create-brand-profile')}
          >
            Register
          </Button>
        </Box>
      </Box>

      {/* Bottom Spacing for Nav */}
      <Box sx={{ height: 24 }} />
    </Box>
  );
};

export default HomeMobile;
