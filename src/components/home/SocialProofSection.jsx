/**
 * Social Proof Section
 * Features: Media mentions carousel, video testimonials, real-time activity
 */

import React, { useState, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Rating,
  IconButton,
  Chip,
  Paper,
  useTheme,
  alpha,
  Stack,
} from '@mui/material';
import {
  FormatQuote,
  PlayCircle,
  ChevronLeft,
  ChevronRight,
  Verified,
  TrendingUp,
  Business,
  EmojiEvents,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const MotionCard = motion(Card);
const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

/**
 * Media Mentions Carousel
 */
const MediaMentionsCarousel = () => {
  const theme = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);

  const mentions = [
    {
      outlet: 'Economic Times',
      logo: '📰',
      quote: 'Leading platform revolutionizing franchise discovery in India',
      date: 'Nov 2025',
      link: '#',
    },
    {
      outlet: 'Business Standard',
      logo: '📊',
      quote: 'Connecting investors with verified franchise opportunities',
      date: 'Oct 2025',
      link: '#',
    },
    {
      outlet: 'YourStory',
      logo: '🚀',
      quote: 'Simplifying the franchise investment journey',
      date: 'Sep 2025',
      link: '#',
    },
    {
      outlet: 'Franchise India',
      logo: '💼',
      quote: 'Most comprehensive franchise marketplace in the country',
      date: 'Aug 2025',
      link: '#',
    },
  ];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? mentions.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === mentions.length - 1 ? 0 : prev + 1));
  };

  return (
    <Box sx={{ position: 'relative', mb: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="overline" color="primary" fontWeight="700" sx={{ fontSize: '0.875rem' }}>
          As Featured In
        </Typography>
      </Box>

      <Box sx={{ position: 'relative', overflow: 'hidden', py: 2 }}>
        <AnimatePresence mode="wait">
          <MotionBox
            key={activeIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: 'center',
                bgcolor: alpha(theme.palette.primary.main, 0.03),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                borderRadius: 3,
                minHeight: 150,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h2" sx={{ mb: 2, opacity: 0.3 }}>
                {mentions[activeIndex].logo}
              </Typography>
              <Typography variant="h6" fontWeight="700" gutterBottom>
                {mentions[activeIndex].outlet}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontStyle: 'italic', mb: 1, maxWidth: 600, mx: 'auto' }}
              >
                "{mentions[activeIndex].quote}"
              </Typography>
              <Typography variant="caption" color="text.disabled">
                {mentions[activeIndex].date}
              </Typography>
            </Paper>
          </MotionBox>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <IconButton
          onClick={handlePrev}
          sx={{
            position: 'absolute',
            left: -20,
            top: '50%',
            transform: 'translateY(-50%)',
            bgcolor: 'background.paper',
            boxShadow: 2,
            '&:hover': { bgcolor: 'background.paper' },
          }}
        >
          <ChevronLeft />
        </IconButton>
        <IconButton
          onClick={handleNext}
          sx={{
            position: 'absolute',
            right: -20,
            top: '50%',
            transform: 'translateY(-50%)',
            bgcolor: 'background.paper',
            boxShadow: 2,
            '&:hover': { bgcolor: 'background.paper' },
          }}
        >
          <ChevronRight />
        </IconButton>

        {/* Indicators */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 3 }}>
          {mentions.map((_, index) => (
            <Box
              key={index}
              onClick={() => setActiveIndex(index)}
              sx={{
                width: activeIndex === index ? 24 : 8,
                height: 8,
                borderRadius: 4,
                bgcolor: activeIndex === index ? 'primary.main' : 'action.disabled',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

/**
 * Video Testimonial Card
 */
const VideoTestimonialCard = ({ name, role, brand, thumbnail, quote, verified, delay }) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <MotionCard
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: theme.shadows[8],
        },
        transition: 'all 0.3s',
      }}
    >
      {/* Video Thumbnail */}
      <Box
        sx={{
          position: 'relative',
          paddingTop: '56.25%', // 16:9 aspect ratio
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.3)}, ${alpha(
            theme.palette.secondary.main,
            0.3
          )})`,
        }}
      >
        <motion.div
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <PlayCircle
            sx={{
              fontSize: 80,
              color: 'white',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
            }}
          />
        </motion.div>

        {verified && (
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
      </Box>

      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: 'primary.main',
              fontSize: '1.5rem',
            }}
          >
            {name.charAt(0)}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight="700" gutterBottom>
              {name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {role}
            </Typography>
            <Typography variant="caption" color="primary.main" fontWeight="600">
              {brand}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ position: 'relative', pl: 2, borderLeft: `3px solid ${theme.palette.primary.main}` }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', lineHeight: 1.6 }}>
            "{quote}"
          </Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Rating value={5} readOnly size="small" />
        </Box>
      </CardContent>
    </MotionCard>
  );
};

/**
 * Real-time Stats/Activity
 */
const RealTimeStats = () => {
  const theme = useTheme();
  const [stats] = useState([
    {
      value: '1,234',
      label: 'Active Franchises',
      icon: <Business />,
      trend: '+12%',
      color: 'primary',
    },
    {
      value: '94%',
      label: 'Success Rate',
      icon: <TrendingUp />,
      trend: '+3%',
      color: 'success',
    },
    {
      value: '5,678',
      label: 'Happy Investors',
      icon: <EmojiEvents />,
      trend: '+25%',
      color: 'secondary',
    },
  ]);

  return (
    <Grid container spacing={3} sx={{ mb: 6 }} justifyContent="center">
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <MotionPaper
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            elevation={0}
            sx={{
              p: 3,
              textAlign: 'center',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: `linear-gradient(90deg, ${theme.palette[stat.color].main}, ${theme.palette[stat.color].light})`,
              },
            }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                p: 2,
                borderRadius: 2,
                bgcolor: alpha(theme.palette[stat.color].main, 0.1),
                color: `${stat.color}.main`,
                mb: 2,
              }}
            >
              {stat.icon}
            </Box>
            <Typography variant="h3" fontWeight="700" gutterBottom>
              {stat.value}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {stat.label}
            </Typography>
            <Chip
              label={stat.trend}
              size="small"
              color={stat.color}
              sx={{ fontWeight: 600, mt: 1 }}
            />
          </MotionPaper>
        </Grid>
      ))}
    </Grid>
  );
};

/**
 * Main Social Proof Section
 */
const SocialProofSection = () => {
  const theme = useTheme();

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Franchise Owner',
      brand: "McDonald's Delhi",
      quote:
        'The platform made it incredibly easy to find and connect with the right franchise. The entire process was smooth and transparent.',
      verified: true,
    },
    {
      name: 'Priya Sharma',
      role: 'Multi-Unit Operator',
      brand: 'Subway Mumbai',
      quote:
        'Thanks to ikama - Franchise Hub, I expanded my portfolio with 3 new outlets. The support team was outstanding throughout.',
      verified: true,
    },
    {
      name: 'Amit Patel',
      role: 'First-time Investor',
      brand: 'Café Coffee Day Bangalore',
      quote:
        'As a first-time franchise investor, I was nervous. But the guidance and tools provided gave me confidence to take the leap.',
      verified: true,
    },
  ];

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: theme.palette.mode === 'dark' ? 'background.default' : 'grey.50',
      }}
    >
      <Container maxWidth="xl">
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h2" fontWeight="700" gutterBottom>
              Trusted by Thousands
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 700, mx: 'auto', mb: 2 }}
            >
              Join India's fastest-growing franchise community
            </Typography>
          </MotionBox>
        </Box>

        {/* Real-time Stats */}
        <RealTimeStats />

        {/* Media Mentions */}
        <MediaMentionsCarousel />

        {/* Video Testimonials */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="700" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
            Success Stories
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <VideoTestimonialCard {...testimonial} delay={index * 0.2} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Trust Indicators */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          sx={{ mt: 8, textAlign: 'center' }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              bgcolor: alpha(theme.palette.success.main, 0.05),
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
              borderRadius: 3,
            }}
          >
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={4}
              divider={<Box sx={{ width: 1, height: 40, bgcolor: 'divider' }} />}
              justifyContent="center"
              alignItems="center"
            >
              <Box>
                <Typography variant="h5" fontWeight="700" color="success.main" gutterBottom>
                  100% Verified
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  All franchises verified
                </Typography>
              </Box>
              <Box>
                <Typography variant="h5" fontWeight="700" color="success.main" gutterBottom>
                  24/7 Support
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Expert guidance available
                </Typography>
              </Box>
              <Box>
                <Typography variant="h5" fontWeight="700" color="success.main" gutterBottom>
                  Money-back Guarantee
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Risk-free investment
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default SocialProofSection;
