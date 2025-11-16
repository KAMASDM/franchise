/**
 * Market Trends Section
 * Current franchise market trends and insights
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
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  TrendingUp,
  AutoGraph,
  Insights,
  Public,
  Lightbulb,
  ArrowUpward,
  CheckCircle,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

const MarketTrends = () => {
  const theme = useTheme();

  const trends = [
    {
      title: 'Digital-First Franchises',
      growth: '+45%',
      description: 'Cloud kitchens, online tutoring, and e-commerce support franchises leading growth',
      icon: <AutoGraph />,
      color: theme.palette.primary.main,
      stats: [
        'Cloud Kitchens: 65% annual growth',
        'Online Education: 58% market expansion',
        'E-commerce Logistics: 42% YoY increase',
      ],
    },
    {
      title: 'Health & Wellness Boom',
      growth: '+38%',
      description: 'Post-pandemic surge in fitness, mental health, and organic food franchises',
      icon: <Insights />,
      color: theme.palette.success.main,
      stats: [
        'Fitness Studios: 35% growth rate',
        'Organic Food: 40% market increase',
        'Mental Wellness: 32% expansion',
      ],
    },
    {
      title: 'Tier 2/3 City Expansion',
      growth: '+52%',
      description: 'Rapid franchise growth in smaller cities with lower investment and higher returns',
      icon: <Public />,
      color: theme.palette.info.main,
      stats: [
        'Investment 30-40% lower than metros',
        'ROI 15-20% higher than tier 1 cities',
        '250+ cities now franchise-ready',
      ],
    },
    {
      title: 'Sustainable & Eco-Friendly',
      growth: '+28%',
      description: 'Green franchises gaining traction with conscious consumers',
      icon: <Lightbulb />,
      color: theme.palette.warning.main,
      stats: [
        'Eco-friendly products: 30% growth',
        'Sustainable packaging solutions',
        'Green energy consulting franchises',
      ],
    },
  ];

  const insights = [
    {
      title: '2024-2025 Market Predictions',
      points: [
        'Franchise industry expected to reach ₹6.5 trillion by 2025',
        'International brands expanding aggressively in India',
        'Home-based franchises growing 55% annually',
        'Technology integration becoming mandatory',
        'Multi-unit franchising increasing by 40%',
      ],
    },
    {
      title: 'Emerging Opportunities',
      points: [
        'Senior Care & Assisted Living franchises',
        'Pet Care & Veterinary services expanding',
        'Electric Vehicle charging networks',
        'Co-working & Flexible office spaces',
        'Subscription box & curated product franchises',
      ],
    },
  ];

  return (
    <Box
      sx={{
        py: 10,
        background: `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`,
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
              label="MARKET TRENDS 2024-2025"
              color="secondary"
              sx={{ mb: 2, fontWeight: 600 }}
            />
            <Typography
              variant="h3"
              fontWeight="800"
              gutterBottom
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              What's Trending in Franchising
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              Stay ahead with the latest market insights and emerging opportunities
            </Typography>
          </motion.div>
        </Box>

        {/* Trending Categories */}
        <Grid container spacing={4} sx={{ mb: 8 }} justifyContent="center">
          {trends.map((trend, index) => (
            <Grid item xs={12} sm={6} md={6} lg={6} key={index}>
              <MotionCard
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                sx={{
                  height: '100%',
                  background: `linear-gradient(135deg, ${alpha(trend.color, 0.05)} 0%, ${theme.palette.background.paper} 100%)`,
                  border: `2px solid ${alpha(trend.color, 0.2)}`,
                  borderRadius: 3,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${alpha(trend.color, 0.15)} 0%, transparent 70%)`,
                  }}
                />
                <CardContent sx={{ p: 4, position: 'relative' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: trend.color,
                        width: 56,
                        height: 56,
                      }}
                    >
                      {trend.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h5" fontWeight="700" gutterBottom>
                        {trend.title}
                      </Typography>
                      <Chip
                        icon={<ArrowUpward sx={{ fontSize: 16 }} />}
                        label={trend.growth}
                        size="small"
                        sx={{
                          bgcolor: alpha(theme.palette.success.main, 0.1),
                          color: theme.palette.success.main,
                          fontWeight: 700,
                        }}
                      />
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {trend.description}
                  </Typography>
                  <List dense>
                    {trend.stats.map((stat, i) => (
                      <ListItem key={i} sx={{ px: 0, py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircle sx={{ fontSize: 18, color: trend.color }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={stat}
                          primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>

        {/* Market Insights */}
        <Grid container spacing={4} justifyContent="center">
          {insights.map((insight, index) => (
            <Grid item xs={12} sm={6} md={6} key={index}>
              <MotionCard
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                sx={{
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${theme.palette.background.paper} 100%)`,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  borderRadius: 3,
                  height: '100%',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <TrendingUp color="primary" sx={{ fontSize: 32 }} />
                    <Typography variant="h5" fontWeight="700">
                      {insight.title}
                    </Typography>
                  </Box>
                  <List>
                    {insight.points.map((point, i) => (
                      <ListItem key={i} sx={{ px: 0, py: 1 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: 12,
                              fontWeight: 700,
                            }}
                          >
                            {i + 1}
                          </Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={point}
                          primaryTypographyProps={{
                            variant: 'body2',
                            fontWeight: 500,
                            color: 'text.primary',
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>

        {/* Bottom CTA */}
        <Box
          sx={{
            mt: 6,
            p: 4,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" fontWeight="700" color="white" gutterBottom>
            Ready to ride the franchise wave?
          </Typography>
          <Typography variant="body1" color="rgba(255,255,255,0.9)">
            Join 4,500+ successful franchise brands and be part of India's ₹5.2 trillion industry
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default MarketTrends;
