/**
 * Enhanced Hero Section
 * Features: Stats ticker, trust badges, animated background, stronger CTAs
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Chip,
  Stack,
  useTheme,
  alpha,
  useMediaQuery,
  Dialog,
  DialogContent,
  IconButton,
} from '@mui/material';
import {
  ArrowForward,
  PlayArrow,
  Verified,
  TrendingUp,
  BusinessCenter,
  People,
  Star,
  Close,
} from '@mui/icons-material';
import { motion, useAnimation } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDemoVideo } from '../../hooks/useDemoVideo';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

/**
 * Animated Counter Component
 */
const AnimatedCounter = ({ end, duration = 2, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / (duration * 1000);

      if (progress < 1) {
        setCount(Math.floor(end * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return (
    <span>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

/**
 * Stats Ticker Component
 */
const StatsTicker = () => {
  const theme = useTheme();
  
  const stats = [
    { label: 'Active Brands', value: 1234, icon: <BusinessCenter fontSize="small" />, suffix: '+' },
    { label: 'Success Rate', value: 94, icon: <TrendingUp fontSize="small" />, suffix: '%' },
    { label: 'Happy Investors', value: 5678, icon: <People fontSize="small" />, suffix: '+' },
    { label: 'Avg Rating', value: 4.8, icon: <Star fontSize="small" />, suffix: '/5' },
  ];

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      sx={{
        mt: 6,
        p: 3,
        borderRadius: 3,
        bgcolor: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(10px)',
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
      }}
    >
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={6} md={3} key={index}>
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.5 }}>
                <Box sx={{ color: 'primary.main' }}>{stat.icon}</Box>
                <Typography variant="h4" fontWeight="700" color="primary.main">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" fontWeight="500">
                {stat.label}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </MotionBox>
  );
};

/**
 * Trust Badges Component
 */
const TrustBadges = () => {
  const badges = [
    '🏆 Top Rated Platform',
    '✓ Verified Listings',
    '🔒 Secure Process',
    '⚡ Fast Approval',
  ];

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.6 }}
      sx={{ mt: 3 }}
    >
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {badges.map((badge, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1 + index * 0.1, type: 'spring', stiffness: 200 }}
          >
            <Chip
              label={badge}
              size="small"
              sx={{
                bgcolor: 'background.paper',
                fontWeight: 500,
                fontSize: '0.813rem',
                border: '1px solid',
                borderColor: 'divider',
              }}
            />
          </motion.div>
        ))}
      </Stack>
    </MotionBox>
  );
};

/**
 * Animated Background Component
 */
const AnimatedBackground = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      {/* Gradient Orbs */}
      {[...Array(3)].map((_, i) => (
        <MotionBox
          key={i}
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 2,
          }}
          sx={{
            position: 'absolute',
            top: `${20 + i * 30}%`,
            left: `${10 + i * 40}%`,
            width: { xs: 300, md: 500 },
            height: { xs: 300, md: 500 },
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(
              i % 2 === 0 ? theme.palette.primary.main : theme.palette.secondary.main,
              0.15
            )} 0%, transparent 70%)`,
            filter: 'blur(40px)',
          }}
        />
      ))}

      {/* Grid Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `linear-gradient(${alpha(theme.palette.divider, 0.05)} 1px, transparent 1px),
                           linear-gradient(90deg, ${alpha(theme.palette.divider, 0.05)} 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          opacity: 0.5,
        }}
      />
    </Box>
  );
};

/**
 * Feature Cards Component
 */
const FeatureCards = () => {
  const theme = useTheme();
  
  const features = [
    {
      icon: <TrendingUp fontSize="large" />,
      title: 'Proven ROI',
      description: 'Access franchises with verified track records',
      color: 'primary',
    },
    {
      icon: <Verified fontSize="large" />,
      title: 'Verified Brands',
      description: 'All franchise information thoroughly vetted',
      color: 'success',
    },
    {
      icon: <People fontSize="large" />,
      title: 'Expert Support',
      description: 'Get personalized guidance from specialists',
      color: 'secondary',
    },
    {
      icon: <BusinessCenter fontSize="large" />,
      title: 'Fast Process',
      description: 'Streamlined application and approval',
      color: 'info',
    },
  ];

  return (
    <Grid container spacing={2} justifyContent="center">
      {features.map((feature, index) => (
        <Grid item xs={6} sm={6} md={6} key={index}>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
            whileHover={{ y: -5 }}
            sx={{
              p: 3,
              height: '100%',
              borderRadius: 2,
              bgcolor: alpha(theme.palette[feature.color].main, 0.05),
              border: `1px solid ${alpha(theme.palette[feature.color].main, 0.1)}`,
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&:hover': {
                bgcolor: alpha(theme.palette[feature.color].main, 0.1),
                borderColor: alpha(theme.palette[feature.color].main, 0.3),
                boxShadow: `0 8px 24px ${alpha(theme.palette[feature.color].main, 0.2)}`,
              },
            }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                p: 1.5,
                borderRadius: 2,
                bgcolor: alpha(theme.palette[feature.color].main, 0.15),
                color: `${feature.color}.main`,
                mb: 2,
              }}
            >
              {feature.icon}
            </Box>
            <Typography variant="h6" fontWeight="700" gutterBottom>
              {feature.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {feature.description}
            </Typography>
          </MotionBox>
        </Grid>
      ))}
    </Grid>
  );
};

/**
 * Enhanced Hero Section
 */
const EnhancedHero = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { demoVideo } = useDemoVideo();
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);

  const handleWatchDemo = () => {
    if (demoVideo?.videoUrl) {
      setVideoDialogOpen(true);
    } else {
      console.log('No demo video configured');
    }
  };

  // Helper function to convert YouTube URL to embed URL
  const getEmbedUrl = (url) => {
    if (!url) return null;
    
    // YouTube patterns
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(youtubeRegex);
    
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
    }
    
    // Vimeo patterns
    const vimeoRegex = /vimeo\.com\/(?:.*\/)?(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    
    if (vimeoMatch && vimeoMatch[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
    }
    
    // Already an embed URL or regular video file
    return url;
  };

  const isEmbedVideo = (url) => {
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');
  };

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: { xs: '85vh', md: '90vh' },
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: theme.palette.mode === 'dark'
          ? `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${alpha(theme.palette.primary.dark, 0.2)} 100%)`
          : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${theme.palette.background.default} 50%, ${alpha(theme.palette.secondary.light, 0.1)} 100%)`,
      }}
    >
      {/* Animated Background */}
      <AnimatedBackground />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: { xs: 6, md: 8 } }}>
        <Grid container spacing={6} alignItems="center">
          {/* Left Content */}
          <Grid item xs={12} md={6}>
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge */}
              <MotionBox
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                sx={{ mb: 3 }}
              >
                <Chip
                  icon={<Verified />}
                  label="India's #1 Franchise Marketplace"
                  color="primary"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    py: 2.5,
                    boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.25)}`,
                  }}
                />
              </MotionBox>

              {/* Headline */}
              <MotionTypography
                variant="h1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem', lg: '5rem' },
                  fontWeight: 800,
                  lineHeight: 1.1,
                  mb: 3,
                  background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Discover Your Dream{' '}
                <Box
                  component="span"
                  sx={{
                    position: 'relative',
                    display: 'inline-block',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 8,
                      left: 0,
                      right: 0,
                      height: 12,
                      background: alpha(theme.palette.secondary.main, 0.3),
                      zIndex: -1,
                      borderRadius: 1,
                    },
                  }}
                >
                  Franchise
                </Box>
              </MotionTypography>

              {/* Subheadline */}
              <MotionTypography
                variant="h5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                sx={{
                  mb: 4,
                  color: 'text.secondary',
                  fontWeight: 400,
                  fontSize: { xs: '1.125rem', md: '1.375rem' },
                  lineHeight: 1.6,
                  maxWidth: 600,
                }}
              >
                Connect with <strong style={{ color: theme.palette.primary.main }}>1,200+ verified brands</strong> across 50+ industries. 
                Start your entrepreneurial journey with confidence.
              </MotionTypography>

              {/* CTA Buttons */}
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                sx={{ mb: 3 }}
              >
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    onClick={() => navigate('/brands')}
                    sx={{
                      px: 4,
                      py: 1.75,
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      textTransform: 'none',
                      boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.35)}`,
                      '&:hover': {
                        boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.45)}`,
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Explore Franchises
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<PlayArrow />}
                    onClick={handleWatchDemo}
                    disabled={!demoVideo?.videoUrl}
                    sx={{
                      px: 4,
                      py: 1.75,
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      textTransform: 'none',
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2,
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Watch Demo
                  </Button>
                </Stack>
              </MotionBox>

              {/* Trust Badges */}
              <TrustBadges />
            </MotionBox>
          </Grid>

          {/* Right Content - Feature Cards & Stats */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 4 }}>
              <FeatureCards />
            </Box>
            <StatsTicker />
          </Grid>
        </Grid>
      </Container>

      {/* Demo Video Dialog */}
      <Dialog
        open={videoDialogOpen}
        onClose={() => setVideoDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
          },
        }}
      >
        <IconButton
          onClick={() => setVideoDialogOpen(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            zIndex: 1,
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.7)',
            },
          }}
        >
          <Close />
        </IconButton>

        <DialogContent sx={{ p: 0 }}>
          {demoVideo && (
            <Box>
              {/* Video Title */}
              {demoVideo.title && (
                <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
                  <Typography variant="h6" fontWeight="bold">
                    {demoVideo.title}
                  </Typography>
                  {demoVideo.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {demoVideo.description}
                    </Typography>
                  )}
                </Box>
              )}

              {/* Video Player */}
              <Box sx={{ position: 'relative', paddingTop: '56.25%', bgcolor: 'black' }}>
                {isEmbedVideo(demoVideo.videoUrl) ? (
                  <iframe
                    src={getEmbedUrl(demoVideo.videoUrl)}
                    title={demoVideo.title || 'Demo Video'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 'none',
                    }}
                  />
                ) : (
                  <video
                    src={demoVideo.videoUrl}
                    poster={demoVideo.thumbnailUrl}
                    controls
                    autoPlay
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                    }}
                  />
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default EnhancedHero;
