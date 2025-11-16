/**
 * Industry Insights Section
 * Real-time franchise industry statistics and trends
 */

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
  alpha,
  LinearProgress,
  Stack,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  People,
  Business,
  AccountBalance,
  LocalAtm,
  WorkOutline,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

const IndustryInsights = () => {
  const theme = useTheme();

  const industryStats = [
    {
      icon: <AccountBalance sx={{ fontSize: 40 }} />,
      title: 'Market Size',
      value: '₹5.2 Trillion',
      growth: '+12.3%',
      subtitle: 'Indian Franchise Industry (2024)',
      color: theme.palette.primary.main,
    },
    {
      icon: <Business sx={{ fontSize: 40 }} />,
      title: 'Active Brands',
      value: '4,500+',
      growth: '+18%',
      subtitle: 'Registered franchise brands in India',
      color: theme.palette.success.main,
    },
    {
      icon: <WorkOutline sx={{ fontSize: 40 }} />,
      title: 'Employment',
      value: '8.2M+',
      growth: '+15%',
      subtitle: 'Jobs created by franchise sector',
      color: theme.palette.info.main,
    },
    {
      icon: <LocalAtm sx={{ fontSize: 40 }} />,
      title: 'Avg. ROI',
      value: '22-28%',
      growth: 'Industry avg',
      subtitle: 'Return on investment annually',
      color: theme.palette.warning.main,
    },
  ];

  const trendingIndustries = [
    { name: 'Quick Service Restaurants', growth: 28, investment: '₹15-50L' },
    { name: 'Education & Training', growth: 32, investment: '₹10-40L' },
    { name: 'Health & Fitness', growth: 25, investment: '₹20-60L' },
    { name: 'Beauty & Wellness', growth: 30, investment: '₹8-30L' },
    { name: 'E-commerce Support', growth: 45, investment: '₹5-25L' },
    { name: 'Home Services', growth: 35, investment: '₹3-15L' },
  ];

  return (
    <Box
      sx={{
        py: 10,
        background: `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
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
              label="INDUSTRY INSIGHTS"
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
              Franchise Industry at a Glance
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              Real-time data and trends shaping India's booming franchise ecosystem
            </Typography>
          </motion.div>
        </Box>

        {/* Key Statistics */}
        <Grid container spacing={4} sx={{ mb: 8 }} justifyContent="center">
          {industryStats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <MotionCard
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                sx={{
                  height: '100%',
                  background: alpha(stat.color, 0.05),
                  border: `2px solid ${alpha(stat.color, 0.2)}`,
                  borderRadius: 3,
                  position: 'relative',
                  overflow: 'visible',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -20,
                      left: 20,
                      width: 60,
                      height: 60,
                      borderRadius: 2,
                      background: `linear-gradient(135deg, ${stat.color} 0%, ${alpha(stat.color, 0.8)} 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      boxShadow: `0 8px 24px ${alpha(stat.color, 0.4)}`,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Box sx={{ mt: 5 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" fontWeight="800" color={stat.color} gutterBottom>
                      {stat.value}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <TrendingUp sx={{ fontSize: 18, color: theme.palette.success.main }} />
                      <Typography variant="body2" color="success.main" fontWeight="600">
                        {stat.growth}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {stat.subtitle}
                    </Typography>
                  </Box>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>

        {/* Trending Industries */}
        <MotionCard
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${theme.palette.background.paper} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight="700" gutterBottom sx={{ mb: 4 }}>
              <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
              Fastest Growing Franchise Sectors (2024-2025)
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              {trendingIndustries.map((industry, index) => (
                <Grid item xs={12} sm={6} md={6} lg={4} key={index}>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body1" fontWeight="600">
                        {industry.name}
                      </Typography>
                      <Typography variant="body2" color="success.main" fontWeight="700">
                        +{industry.growth}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={industry.growth}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.success.main} 100%)`,
                        },
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      Investment Range: {industry.investment}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </MotionCard>
      </Container>
    </Box>
  );
};

export default IndustryInsights;
