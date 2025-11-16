/**
 * Success Stories Section
 * Real franchise success case studies and metrics
 */

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  useTheme,
  alpha,
  Chip,
  Stack,
} from '@mui/material';
import {
  TrendingUp,
  Store,
  Timer,
  LocalAtm,
  EmojiEvents,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

const SuccessStories = () => {
  const theme = useTheme();

  const successStories = [
    {
      name: 'Rajesh Sharma',
      location: 'Mumbai, Maharashtra',
      franchise: 'Quick Service Restaurant',
      investment: '₹25 Lakhs',
      timeline: '18 months',
      roi: '145%',
      outlets: 3,
      story: 'Started with a single outlet in 2022. Within 18 months, expanded to 3 locations with consistent 145% ROI.',
      avatar: 'RS',
      color: theme.palette.primary.main,
    },
    {
      name: 'Priya Patel',
      location: 'Ahmedabad, Gujarat',
      franchise: 'Education & Training Center',
      investment: '₹18 Lakhs',
      timeline: '12 months',
      roi: '168%',
      outlets: 2,
      story: 'Transformed passion for education into a thriving business. Now serving 500+ students across 2 centers.',
      avatar: 'PP',
      color: theme.palette.success.main,
    },
    {
      name: 'Vikram Singh',
      location: 'Bangalore, Karnataka',
      franchise: 'Fitness & Wellness Studio',
      investment: '₹35 Lakhs',
      timeline: '24 months',
      roi: '132%',
      outlets: 4,
      story: 'Built a fitness empire from scratch. 4 state-of-the-art studios with 1200+ active members.',
      avatar: 'VS',
      color: theme.palette.info.main,
    },
    {
      name: 'Anita Desai',
      location: 'Pune, Maharashtra',
      franchise: 'Beauty & Salon Chain',
      investment: '₹22 Lakhs',
      timeline: '15 months',
      roi: '158%',
      outlets: 3,
      story: 'From a single salon to a premium chain. Serving 200+ customers weekly with 15+ skilled professionals.',
      avatar: 'AD',
      color: theme.palette.secondary.main,
    },
    {
      name: 'Arjun Mehta',
      location: 'Delhi NCR',
      franchise: 'Cloud Kitchen Network',
      investment: '₹12 Lakhs',
      timeline: '10 months',
      roi: '185%',
      outlets: 5,
      story: 'Leveraged digital ordering boom. 5 virtual brands operating from 2 kitchens with 400+ daily orders.',
      avatar: 'AM',
      color: theme.palette.warning.main,
    },
    {
      name: 'Sneha Krishnan',
      location: 'Chennai, Tamil Nadu',
      franchise: 'Healthcare & Diagnostics',
      investment: '₹40 Lakhs',
      timeline: '20 months',
      roi: '125%',
      outlets: 2,
      story: 'Brought quality healthcare to tier-2 city. 2 diagnostic centers serving 1500+ patients monthly.',
      avatar: 'SK',
      color: theme.palette.error.main,
    },
  ];

  const achievements = [
    { icon: <Store />, value: '850+', label: 'Success Stories' },
    { icon: <TrendingUp />, value: '28%', label: 'Avg. Annual Growth' },
    { icon: <LocalAtm />, value: '₹450Cr+', label: 'Revenue Generated' },
    { icon: <EmojiEvents />, value: '92%', label: 'Success Rate' },
  ];

  return (
    <Box
      sx={{
        py: 10,
        background: `linear-gradient(180deg, ${alpha(theme.palette.secondary.main, 0.03)} 0%, ${theme.palette.background.paper} 100%)`,
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
              label="SUCCESS STORIES"
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
              Real Franchisees, Real Success
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              Join thousands of entrepreneurs who transformed their dreams into thriving businesses
            </Typography>
          </motion.div>
        </Box>

        {/* Achievement Metrics */}
        <Grid container spacing={3} sx={{ mb: 8 }} justifyContent="center">
          {achievements.map((achievement, index) => (
            <Grid item xs={6} md={3} key={index}>
              <MotionCard
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                sx={{
                  textAlign: 'center',
                  p: 3,
                  background: alpha(theme.palette.primary.main, 0.03),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  borderRadius: 2,
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  {achievement.icon}
                </Box>
                <Typography variant="h4" fontWeight="800" color="primary.main">
                  {achievement.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {achievement.label}
                </Typography>
              </MotionCard>
            </Grid>
          ))}
        </Grid>

        {/* Success Story Cards */}
        <Grid container spacing={4} justifyContent="center">
          {successStories.map((story, index) => (
            <Grid item xs={12} sm={6} md={6} lg={4} key={index}>
              <MotionCard
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                sx={{
                  height: '100%',
                  background: `linear-gradient(135deg, ${alpha(story.color, 0.05)} 0%, ${theme.palette.background.paper} 100%)`,
                  border: `2px solid ${alpha(story.color, 0.2)}`,
                  borderRadius: 3,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 100,
                    height: 100,
                    background: `linear-gradient(135deg, ${alpha(story.color, 0.2)} 0%, transparent 100%)`,
                    borderRadius: '0 0 0 100%',
                  }}
                />
                <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Avatar
                      sx={{
                        width: 60,
                        height: 60,
                        bgcolor: story.color,
                        fontSize: 24,
                        fontWeight: 700,
                      }}
                    >
                      {story.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="700">
                        {story.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {story.location}
                      </Typography>
                    </Box>
                  </Box>

                  <Chip
                    label={story.franchise}
                    size="small"
                    sx={{ mb: 2, bgcolor: alpha(story.color, 0.1), fontWeight: 600 }}
                  />

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, minHeight: 60 }}>
                    {story.story}
                  </Typography>

                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary">
                        Investment
                      </Typography>
                      <Typography variant="body2" fontWeight="600">
                        {story.investment}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary">
                        Timeline
                      </Typography>
                      <Typography variant="body2" fontWeight="600">
                        {story.timeline}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary">
                        ROI Achieved
                      </Typography>
                      <Typography variant="h6" fontWeight="700" color="success.main">
                        {story.roi}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary">
                        Outlets
                      </Typography>
                      <Typography variant="body2" fontWeight="600">
                        {story.outlets} locations
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default SuccessStories;
