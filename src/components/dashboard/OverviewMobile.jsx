import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  Chip,
  IconButton,
  Button,
  Grid,
  alpha,
  useTheme,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  Business,
  TrendingUp,
  People,
  LocationOn,
  Leaderboard,
  AddCircle,
  ChevronRight,
  AttachMoney,
  Star,
  AutoAwesome,
  Speed,
  Verified,
  PictureAsPdf,
  TravelExplore,
  CheckCircle,
  PendingActions,
  Store,
  Phone,
  Email,
  Language,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import { useDevice } from '../../../hooks/useDevice';

const MotionCard = motion(Card);

/**
 * Mobile-Optimized Dashboard Overview
 * Features:
 * - Native app card layout
 * - Quick action buttons
 * - Stats visualization
 * - Smooth animations
 */

const OverviewMobile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const { isMobile } = useDevice();

  // Quick Stats (mock data - replace with actual data)
  const stats = [
    {
      label: 'Active Brands',
      value: '3',
      change: '+2 this month',
      icon: <Business />,
      color: theme.palette.primary.main,
      path: '/dashboard/brands',
    },
    {
      label: 'Total Leads',
      value: '12',
      change: '+5 this week',
      icon: <Leaderboard />,
      color: theme.palette.success.main,
      path: '/dashboard/leads',
    },
    {
      label: 'Locations',
      value: '8',
      change: 'Across India',
      icon: <LocationOn />,
      color: theme.palette.info.main,
      path: '/dashboard/locations',
    },
    {
      label: 'Revenue',
      value: '₹45L',
      change: '+18% growth',
      icon: <TrendingUp />,
      color: theme.palette.warning.main,
      path: '/dashboard',
    },
  ];

  // Quick Actions
  const quickActions = [
    {
      label: 'Register Brand',
      icon: <AddCircle />,
      color: theme.palette.primary.main,
      path: '/dashboard/register-brand',
      featured: true,
    },
    {
      label: 'Find Location',
      icon: <TravelExplore />,
      color: theme.palette.secondary.main,
      path: '/location-analysis-enhanced',
      badge: 'AI',
    },
    {
      label: 'Marketing',
      icon: <PictureAsPdf />,
      color: theme.palette.info.main,
      path: '/dashboard/marketing',
    },
    {
      label: 'View Brands',
      icon: <Store />,
      color: theme.palette.success.main,
      path: '/dashboard/brands',
    },
  ];

  // Recent Activity (mock data)
  const recentActivity = [
    {
      title: 'New Lead Received',
      brand: 'Chai Point',
      time: '2 hours ago',
      icon: <People />,
      color: theme.palette.success.main,
      status: 'new',
    },
    {
      title: 'Brand Verification Pending',
      brand: 'Workout Gym',
      time: '1 day ago',
      icon: <PendingActions />,
      color: theme.palette.warning.main,
      status: 'pending',
    },
    {
      title: 'Brand Approved',
      brand: 'Tech Academy',
      time: '3 days ago',
      icon: <CheckCircle />,
      color: theme.palette.primary.main,
      status: 'approved',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <Box sx={{ p: 2, pb: 4 }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome Section */}
        <motion.div variants={itemVariants}>
          <Card
            sx={{
              mb: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <CardContent sx={{ py: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  src={user?.photoURL}
                  sx={{
                    width: 56,
                    height: 56,
                    border: 3,
                    borderColor: 'white',
                  }}
                >
                  {user?.displayName?.[0] || 'U'}
                </Avatar>
                
                <Box flex={1}>
                  <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 0.5 }}>
                    Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {user?.displayName || 'Welcome'}
                  </Typography>
                </Box>

                <Chip
                  icon={<Verified />}
                  label="Verified"
                  sx={{
                    bgcolor: alpha('#fff', 0.2),
                    color: 'white',
                    fontWeight: 700,
                    backdropFilter: 'blur(10px)',
                  }}
                />
              </Stack>
            </CardContent>

            {/* Background Decoration */}
            <Box
              sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 150,
                height: 150,
                borderRadius: '50%',
                bgcolor: alpha('#fff', 0.1),
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: -30,
                right: 20,
                width: 100,
                height: 100,
                borderRadius: '50%',
                bgcolor: alpha('#fff', 0.05),
              }}
            />
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div variants={itemVariants}>
          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ px: 0.5 }}>
            Overview
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {stats.map((stat, index) => (
              <Grid item xs={6} key={index}>
                <MotionCard
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(stat.path)}
                  sx={{
                    cursor: 'pointer',
                    height: '100%',
                    background: `linear-gradient(135deg, ${alpha(stat.color, 0.1)}, ${alpha(stat.color, 0.05)})`,
                    border: 1,
                    borderColor: alpha(stat.color, 0.2),
                  }}
                >
                  <CardContent>
                    <Avatar
                      sx={{
                        bgcolor: alpha(stat.color, 0.15),
                        color: stat.color,
                        width: 48,
                        height: 48,
                        mb: 2,
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                    
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                      {stat.value}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {stat.label}
                    </Typography>
                    
                    <Chip
                      label={stat.change}
                      size="small"
                      sx={{
                        bgcolor: alpha(stat.color, 0.15),
                        color: stat.color,
                        fontWeight: 600,
                        fontSize: '0.7rem',
                      }}
                    />
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ px: 0.5 }}>
            Quick Actions
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {quickActions.map((action, index) => (
              <Grid item xs={6} key={index}>
                <MotionCard
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(action.path)}
                  sx={{
                    cursor: 'pointer',
                    height: '100%',
                    background: action.featured
                      ? `linear-gradient(135deg, ${action.color}, ${theme.palette.primary.dark})`
                      : 'background.paper',
                    color: action.featured ? 'white' : 'text.primary',
                    position: 'relative',
                    overflow: 'visible',
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    {action.badge && (
                      <Chip
                        label={action.badge}
                        size="small"
                        color="secondary"
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          fontWeight: 700,
                          fontSize: '0.65rem',
                          boxShadow: 2,
                        }}
                      />
                    )}
                    
                    <Avatar
                      sx={{
                        bgcolor: action.featured ? alpha('#fff', 0.2) : alpha(action.color, 0.15),
                        color: action.featured ? 'white' : action.color,
                        width: 56,
                        height: 56,
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      {action.icon}
                    </Avatar>
                    
                    <Typography variant="subtitle2" fontWeight="bold">
                      {action.label}
                    </Typography>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* AI Location Finder Promo */}
        <motion.div variants={itemVariants}>
          <Card
            sx={{
              mb: 3,
              background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <CardContent sx={{ py: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                <Avatar
                  sx={{
                    bgcolor: alpha('#fff', 0.2),
                    width: 48,
                    height: 48,
                  }}
                >
                  <AutoAwesome />
                </Avatar>
                
                <Box flex={1}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                    <Typography variant="h6" fontWeight="bold">
                      AI Location Finder
                    </Typography>
                    <Chip
                      label="NEW"
                      size="small"
                      sx={{
                        bgcolor: alpha('#fff', 0.3),
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.65rem',
                      }}
                    />
                  </Stack>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Find the perfect location for your franchise with AI-powered insights
                  </Typography>
                </Box>
              </Stack>

              <Button
                fullWidth
                variant="contained"
                endIcon={<ChevronRight />}
                onClick={() => navigate('/location-analysis-enhanced')}
                sx={{
                  bgcolor: 'white',
                  color: theme.palette.secondary.main,
                  minHeight: 48,
                  fontWeight: 700,
                  '&:hover': {
                    bgcolor: alpha('#fff', 0.9),
                  },
                }}
              >
                Try Location Finder
              </Button>
            </CardContent>

            {/* Background Decoration */}
            <Box
              sx={{
                position: 'absolute',
                top: -30,
                right: -30,
                width: 120,
                height: 120,
                borderRadius: '50%',
                bgcolor: alpha('#fff', 0.1),
              }}
            />
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={itemVariants}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h6" fontWeight="bold" sx={{ px: 0.5 }}>
              Recent Activity
            </Typography>
            <Button
              size="small"
              endIcon={<ChevronRight />}
              sx={{ fontWeight: 600 }}
            >
              View All
            </Button>
          </Stack>
          
          <Card>
            <CardContent sx={{ p: 0 }}>
              {recentActivity.map((activity, index) => (
                <React.Fragment key={index}>
                  <Box sx={{ p: 2, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        sx={{
                          bgcolor: alpha(activity.color, 0.15),
                          color: activity.color,
                          width: 48,
                          height: 48,
                        }}
                      >
                        {activity.icon}
                      </Avatar>
                      
                      <Box flex={1}>
                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                          {activity.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {activity.brand}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {activity.time}
                        </Typography>
                      </Box>

                      <ChevronRight color="action" />
                    </Stack>
                  </Box>
                  {index < recentActivity.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div variants={itemVariants}>
          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ px: 0.5, mt: 3 }}>
            Performance
          </Typography>
          <Card>
            <CardContent>
              <Stack spacing={3}>
                <Box>
                  <Stack direction="row" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" fontWeight={600}>
                      Brand Completion Rate
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" color="primary">
                      85%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={85}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    }}
                  />
                </Box>

                <Box>
                  <Stack direction="row" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" fontWeight={600}>
                      Lead Response Rate
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" color="success.main">
                      92%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={92}
                    color="success"
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                    }}
                  />
                </Box>

                <Box>
                  <Stack direction="row" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" fontWeight={600}>
                      Profile Strength
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" color="warning.main">
                      78%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={78}
                    color="warning"
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: alpha(theme.palette.warning.main, 0.1),
                    }}
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Support Card */}
        <motion.div variants={itemVariants}>
          <Card sx={{ mt: 3, bgcolor: alpha(theme.palette.info.main, 0.05) }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.info.main, 0.15),
                    color: theme.palette.info.main,
                  }}
                >
                  <Phone />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Need Help?
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Our support team is here for you
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Phone />}
                  sx={{ minHeight: 40, flex: 1, fontWeight: 600 }}
                >
                  Call
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Email />}
                  sx={{ minHeight: 40, flex: 1, fontWeight: 600 }}
                >
                  Email
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </Box>
  );
};

export default OverviewMobile;
