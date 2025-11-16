/**
 * Popular Categories Section
 * Showcase different franchise categories with real data
 */

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  useTheme,
  alpha,
  Chip,
  Stack,
} from '@mui/material';
import {
  Restaurant,
  School,
  FitnessCenter,
  LocalHospital,
  ShoppingCart,
  LocalCafe,
  Build,
  BeachAccess,
  Spa,
  ChildCare,
  DirectionsCar,
  Pets,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const MotionCard = motion(Card);

const PopularCategories = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const categories = [
    {
      icon: <Restaurant sx={{ fontSize: 48 }} />,
      name: 'Food & Beverage',
      count: '1,200+',
      investment: '₹10-50L',
      roi: '22-28%',
      topBrands: ['QSR Chains', 'Cafes', 'Cloud Kitchens'],
      color: '#FF6B6B',
      gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
    },
    {
      icon: <School sx={{ fontSize: 48 }} />,
      name: 'Education',
      count: '850+',
      investment: '₹8-40L',
      roi: '28-35%',
      topBrands: ['Coaching', 'Preschools', 'Skill Training'],
      color: '#4ECDC4',
      gradient: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
    },
    {
      icon: <FitnessCenter sx={{ fontSize: 48 }} />,
      name: 'Fitness & Wellness',
      count: '620+',
      investment: '₹15-60L',
      roi: '20-26%',
      topBrands: ['Gyms', 'Yoga Studios', 'Sports Centers'],
      color: '#95E1D3',
      gradient: 'linear-gradient(135deg, #95E1D3 0%, #38B2AC 100%)',
    },
    {
      icon: <Spa sx={{ fontSize: 48 }} />,
      name: 'Beauty & Salon',
      count: '720+',
      investment: '₹6-35L',
      roi: '25-32%',
      topBrands: ['Salons', 'Spas', 'Cosmetics'],
      color: '#F38181',
      gradient: 'linear-gradient(135deg, #F38181 0%, #FCE38A 100%)',
    },
    {
      icon: <ShoppingCart sx={{ fontSize: 48 }} />,
      name: 'Retail',
      count: '950+',
      investment: '₹12-45L',
      roi: '18-24%',
      topBrands: ['Fashion', 'Electronics', 'Grocery'],
      color: '#A8E6CF',
      gradient: 'linear-gradient(135deg, #A8E6CF 0%, #56AB91 100%)',
    },
    {
      icon: <LocalCafe sx={{ fontSize: 48 }} />,
      name: 'Cafe & Bakery',
      count: '580+',
      investment: '₹8-30L',
      roi: '24-30%',
      topBrands: ['Coffee Shops', 'Bakeries', 'Dessert Parlors'],
      color: '#FFD93D',
      gradient: 'linear-gradient(135deg, #FFD93D 0%, #F4A261 100%)',
    },
    {
      icon: <LocalHospital sx={{ fontSize: 48 }} />,
      name: 'Healthcare',
      count: '420+',
      investment: '₹20-80L',
      roi: '22-28%',
      topBrands: ['Clinics', 'Diagnostics', 'Pharmacies'],
      color: '#6C5CE7',
      gradient: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
    },
    {
      icon: <Build sx={{ fontSize: 48 }} />,
      name: 'Home Services',
      count: '380+',
      investment: '₹3-18L',
      roi: '30-38%',
      topBrands: ['Repair', 'Cleaning', 'Maintenance'],
      color: '#74B9FF',
      gradient: 'linear-gradient(135deg, #74B9FF 0%, #0984E3 100%)',
    },
    {
      icon: <ChildCare sx={{ fontSize: 48 }} />,
      name: 'Kids & Toys',
      count: '290+',
      investment: '₹10-35L',
      roi: '20-25%',
      topBrands: ['Toy Stores', 'Play Areas', 'Learning Centers'],
      color: '#FD79A8',
      gradient: 'linear-gradient(135deg, #FD79A8 0%, #E17055 100%)',
    },
    {
      icon: <DirectionsCar sx={{ fontSize: 48 }} />,
      name: 'Automotive',
      count: '340+',
      investment: '₹15-70L',
      roi: '18-23%',
      topBrands: ['Car Wash', 'Detailing', 'Repair'],
      color: '#636E72',
      gradient: 'linear-gradient(135deg, #636E72 0%, #2D3436 100%)',
    },
    {
      icon: <Pets sx={{ fontSize: 48 }} />,
      name: 'Pet Care',
      count: '180+',
      investment: '₹5-25L',
      roi: '26-33%',
      topBrands: ['Pet Stores', 'Grooming', 'Veterinary'],
      color: '#00B894',
      gradient: 'linear-gradient(135deg, #00B894 0%, #00CEC9 100%)',
    },
    {
      icon: <BeachAccess sx={{ fontSize: 48 }} />,
      name: 'Hospitality',
      count: '450+',
      investment: '₹25-100L',
      roi: '20-28%',
      topBrands: ['Hotels', 'Resorts', 'Travel'],
      color: '#FDCB6E',
      gradient: 'linear-gradient(135deg, #FDCB6E 0%, #E17055 100%)',
    },
  ];

  return (
    <Box
      sx={{
        py: 10,
        background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${theme.palette.background.paper} 100%)`,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Chip
              label="EXPLORE CATEGORIES"
              color="primary"
              sx={{ mb: 2, fontWeight: 600 }}
            />
            <Typography
              variant="h3"
              fontWeight="800"
              gutterBottom
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Popular Franchise Categories
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              Discover franchise opportunities across diverse industries
            </Typography>
          </motion.div>
        </Box>

        <Grid container spacing={3} justifyContent="center">
          {categories.map((category, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <MotionCard
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  overflow: 'hidden',
                  position: 'relative',
                  border: `2px solid ${alpha(category.color, 0.2)}`,
                }}
              >
                <CardActionArea
                  onClick={() => navigate(`/brands?category=${encodeURIComponent(category.name)}`)}
                  sx={{ height: '100%' }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 120,
                      background: category.gradient,
                      opacity: 0.9,
                    }}
                  />
                  <CardContent sx={{ p: 3, position: 'relative' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mb: 2,
                        color: 'white',
                      }}
                    >
                      {category.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      fontWeight="700"
                      align="center"
                      sx={{ mb: 1, color: 'white' }}
                    >
                      {category.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      align="center"
                      sx={{ mb: 3, color: 'rgba(255,255,255,0.9)' }}
                    >
                      {category.count} Brands
                    </Typography>

                    <Stack spacing={1.5} sx={{ mt: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">
                          Investment
                        </Typography>
                        <Typography variant="caption" fontWeight="600">
                          {category.investment}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">
                          Avg. ROI
                        </Typography>
                        <Typography variant="caption" fontWeight="600" color="success.main">
                          {category.roi}
                        </Typography>
                      </Box>
                    </Stack>

                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" color="text.secondary" gutterBottom>
                        Top Segments:
                      </Typography>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ mt: 0.5 }}>
                        {category.topBrands.map((brand, i) => (
                          <Chip
                            key={i}
                            label={brand}
                            size="small"
                            sx={{
                              fontSize: '0.65rem',
                              height: 20,
                              bgcolor: alpha(category.color, 0.1),
                              mb: 0.5,
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </MotionCard>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Can't find your category?
            </Typography>
            <Typography
              variant="body2"
              color="primary"
              sx={{ cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => navigate('/brands')}
            >
              View all franchise opportunities →
            </Typography>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default PopularCategories;
