/**
 * Interactive Homepage Elements
 * Features: Investment Calculator, Find Your Match Quiz, Live Activity Feed
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Slider,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Paper,
  LinearProgress,
  Stack,
  useTheme,
  alpha,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Calculate,
  Quiz,
  TrendingUp,
  AttachMoney,
  Schedule,
  CheckCircle,
  Store,
  Restaurant,
  School,
  LocalHospital,
  FitnessCenter,
  Navigation,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistance } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useLiveActivity } from '../../hooks/useLiveActivity';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

/**
 * Investment Calculator Widget
 */
const InvestmentCalculator = () => {
  const theme = useTheme();
  const [investment, setInvestment] = useState(500000);
  const [timeline, setTimeline] = useState(3);
  const [industry, setIndustry] = useState('food');
  const [results, setResults] = useState(null);

  const industries = [
    { value: 'food', label: 'Food & Beverage', roi: 25, icon: <Restaurant /> },
    { value: 'retail', label: 'Retail', roi: 20, icon: <Store /> },
    { value: 'education', label: 'Education', roi: 30, icon: <School /> },
    { value: 'fitness', label: 'Fitness', roi: 22, icon: <FitnessCenter /> },
    { value: 'healthcare', label: 'Healthcare', roi: 28, icon: <LocalHospital /> },
  ];

  const calculateROI = () => {
    const selectedIndustry = industries.find(i => i.value === industry);
    const annualReturn = investment * (selectedIndustry.roi / 100);
    const totalReturn = annualReturn * timeline;
    const breakEvenMonths = Math.ceil((investment / annualReturn) * 12);

    setResults({
      annualReturn,
      totalReturn,
      breakEvenMonths,
      roi: selectedIndustry.roi,
    });
  };

  return (
    <MotionCard
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${theme.palette.background.paper} 100%)`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Calculate color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h5" fontWeight="700">
            Investment Calculator
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Initial Investment
          </Typography>
          <Typography variant="h4" fontWeight="700" color="primary.main" gutterBottom>
            ₹{investment.toLocaleString()}
          </Typography>
          <Slider
            value={investment}
            onChange={(e, val) => setInvestment(val)}
            min={50000}
            max={5000000}
            step={50000}
            sx={{ mb: 3 }}
          />

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Industry</InputLabel>
            <Select value={industry} onChange={(e) => setIndustry(e.target.value)} label="Industry">
              {industries.map((ind) => (
                <MenuItem key={ind.value} value={ind.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {ind.icon}
                    {ind.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            Timeline (Years)
          </Typography>
          <Slider
            value={timeline}
            onChange={(e, val) => setTimeline(val)}
            min={1}
            max={10}
            marks
            step={1}
            valueLabelDisplay="on"
            sx={{ mb: 3 }}
          />

          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={calculateROI}
            sx={{ mb: 3, py: 1.5 }}
          >
            Calculate Returns
          </Button>

          <AnimatePresence>
            {results && (
              <MotionBox
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                    borderRadius: 2,
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Annual Return
                      </Typography>
                      <Typography variant="h6" fontWeight="700" color="success.main">
                        ₹{results.annualReturn.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Total Return ({timeline}y)
                      </Typography>
                      <Typography variant="h6" fontWeight="700" color="success.main">
                        ₹{results.totalReturn.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Break-Even
                      </Typography>
                      <Typography variant="h6" fontWeight="700">
                        {results.breakEvenMonths} months
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Expected ROI
                      </Typography>
                      <Typography variant="h6" fontWeight="700">
                        {results.roi}%
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </MotionBox>
            )}
          </AnimatePresence>
        </Box>
      </CardContent>
    </MotionCard>
  );
};

/**
 * Find Your Match Quiz
 */
const FindYourMatchQuiz = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  const questions = [
    {
      id: 'budget',
      question: 'What is your investment budget?',
      options: [
        { value: 'low', label: 'Under ₹5L', weight: { food: 1, retail: 2, services: 3 } },
        { value: 'medium', label: '₹5L - ₹20L', weight: { food: 2, retail: 3, services: 2 } },
        { value: 'high', label: 'Above ₹20L', weight: { food: 3, retail: 3, services: 1 } },
      ],
    },
    {
      id: 'experience',
      question: 'Your business experience level?',
      options: [
        { value: 'beginner', label: 'First-time entrepreneur', weight: { food: 3, retail: 2, services: 1 } },
        { value: 'intermediate', label: '1-3 years experience', weight: { food: 2, retail: 3, services: 2 } },
        { value: 'expert', label: '3+ years experience', weight: { food: 1, retail: 2, services: 3 } },
      ],
    },
    {
      id: 'involvement',
      question: 'Preferred involvement level?',
      options: [
        { value: 'passive', label: 'Passive investor', weight: { food: 1, retail: 2, services: 3 } },
        { value: 'parttime', label: 'Part-time management', weight: { food: 2, retail: 3, services: 2 } },
        { value: 'fulltime', label: 'Full-time operation', weight: { food: 3, retail: 2, services: 1 } },
      ],
    },
  ];

  const handleAnswer = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
    if (activeStep < questions.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      calculateMatch();
    }
  };

  const calculateMatch = () => {
    const scores = { food: 0, retail: 0, services: 0 };
    
    Object.entries(answers).forEach(([questionId, answerValue]) => {
      const question = questions.find(q => q.id === questionId);
      const option = question?.options.find(o => o.value === answerValue);
      
      if (option?.weight) {
        Object.entries(option.weight).forEach(([industry, weight]) => {
          scores[industry] += weight;
        });
      }
    });

    const topMatch = Object.entries(scores).sort(([, a], [, b]) => b - a)[0];
    const industries = {
      food: { 
        name: 'Food & Beverage', 
        icon: '🍔', 
        description: 'Restaurants, cafes, and food services',
        brands: [
          { name: 'McDonald\'s', investment: '₹2Cr - ₹5Cr', roi: '25-30%', logo: '🍔' },
          { name: 'Subway', investment: '₹80L - ₹1.5Cr', roi: '22-28%', logo: '🥪' },
          { name: 'Café Coffee Day', investment: '₹1Cr - ₹2Cr', roi: '20-25%', logo: '☕' },
        ]
      },
      retail: { 
        name: 'Retail', 
        icon: '🏪', 
        description: 'Stores and retail outlets',
        brands: [
          { name: 'Reliance Smart', investment: '₹50L - ₹1Cr', roi: '18-22%', logo: '🛒' },
          { name: 'Big Bazaar', investment: '₹1Cr - ₹3Cr', roi: '20-25%', logo: '🏬' },
          { name: 'D-Mart', investment: '₹2Cr - ₹5Cr', roi: '22-28%', logo: '🏪' },
        ]
      },
      services: { 
        name: 'Professional Services', 
        icon: '💼', 
        description: 'B2B and professional services',
        brands: [
          { name: 'DTDC Courier', investment: '₹3L - ₹8L', roi: '30-35%', logo: '📦' },
          { name: 'Dr. Lal PathLabs', investment: '₹50L - ₹1Cr', roi: '28-32%', logo: '🏥' },
          { name: 'Kumon Education', investment: '₹10L - ₹25L', roi: '25-30%', logo: '📚' },
        ]
      },
    };

    const matchedIndustry = industries[topMatch[0]];
    setResult(matchedIndustry);
    setRecommendations(matchedIndustry.brands);
  };

  const handleReset = () => {
    setActiveStep(0);
    setAnswers({});
    setResult(null);
    setRecommendations([]);
  };

  const handleViewAll = () => {
    // Navigate to brands page with filter
    navigate('/brands');
  };

  return (
    <MotionCard
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.05)} 0%, ${theme.palette.background.paper} 100%)`,
        border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Quiz color="secondary" sx={{ fontSize: 32 }} />
          <Typography variant="h5" fontWeight="700">
            Find Your Match
          </Typography>
        </Box>

        {!result ? (
          <Box>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {questions.map((q, index) => (
                <Step key={q.id}>
                  <StepLabel>{index + 1}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="600">
                {questions[activeStep].question}
              </Typography>
              <RadioGroup
                value={answers[questions[activeStep].id] || ''}
                onChange={(e) => handleAnswer(questions[activeStep].id, e.target.value)}
              >
                {questions[activeStep].options.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio />}
                    label={option.label}
                    sx={{
                      mb: 1,
                      p: 2,
                      borderRadius: 2,
                      border: `1px solid ${theme.palette.divider}`,
                      '&:hover': {
                        bgcolor: alpha(theme.palette.secondary.main, 0.05),
                      },
                    }}
                  />
                ))}
              </RadioGroup>
            </Box>

            {activeStep > 0 && (
              <Button onClick={() => setActiveStep(activeStep - 1)}>
                Back
              </Button>
            )}
          </Box>
        ) : (
          <MotionBox
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 3,
                textAlign: 'center',
                bgcolor: alpha(theme.palette.secondary.main, 0.1),
                border: `1px solid ${alpha(theme.palette.secondary.main, 0.3)}`,
                borderRadius: 2,
                mb: 3,
              }}
            >
              <Typography variant="h2" sx={{ mb: 2 }}>
                {result.icon}
              </Typography>
              <Typography variant="h5" fontWeight="700" gutterBottom>
                {result.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {result.description}
              </Typography>
            </Paper>

            {/* Recommended Brands */}
            <Typography variant="h6" fontWeight="700" gutterBottom sx={{ mb: 2 }}>
              Top Matches for You
            </Typography>
            <Box sx={{ mb: 3 }}>
              {recommendations.map((brand, index) => (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.secondary.main, 0.05),
                      borderColor: theme.palette.secondary.main,
                    },
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate('/brands')}
                >
                  <Typography variant="h4">{brand.logo}</Typography>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight="700">
                      {brand.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Investment: {brand.investment} • ROI: {brand.roi}
                    </Typography>
                  </Box>
                  <Navigation fontSize="small" color="action" />
                </MotionBox>
              ))}
            </Box>

            <Stack direction="row" spacing={2}>
              <Button variant="contained" color="secondary" fullWidth onClick={handleViewAll}>
                View All Matches
              </Button>
              <Button variant="outlined" onClick={handleReset}>
                Retake
              </Button>
            </Stack>
          </MotionBox>
        )}
      </CardContent>
    </MotionCard>
  );
};

/**
 * Live Activity Feed - Dynamic from Firestore
 */
const LiveActivityFeed = () => {
  const theme = useTheme();
  const { activities, loading, error } = useLiveActivity();

  // Activity type to icon and text mapping
  const getActivityDisplay = (activity) => {
    if (activity.type === 'registration') {
      return {
        icon: <CheckCircle />,
        text: `${activity.user} showed interest in ${activity.brand}`,
      };
    } else if (activity.type === 'listing') {
      return {
        icon: <TrendingUp />,
        text: `${activity.brand} listed as a new franchise opportunity`,
      };
    } else if (activity.type === 'investment') {
      return {
        icon: <AttachMoney />,
        text: `New investment in ${activity.brand}`,
      };
    }
    return {
      icon: <Store />,
      text: activity.brand,
    };
  };

  if (loading) {
    return (
      <MotionCard
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        sx={{
          height: '100%',
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <CardContent sx={{ p: 3, textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Loading live activity...
          </Typography>
        </CardContent>
      </MotionCard>
    );
  }

  return (
    <MotionCard
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.4 }}
      sx={{
        height: '100%',
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Schedule color="action" sx={{ fontSize: 28 }} />
          <Typography variant="h6" fontWeight="700">
            Live Activity
          </Typography>
          <Chip label="Live" size="small" color="error" sx={{ ml: 'auto' }} />
        </Box>

        {error && (
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {activities.length === 0 && !error && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No recent activity yet. Be the first to show interest!
          </Typography>
        )}

        {activities.length > 0 && (
          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            <AnimatePresence>
              {activities.map((activity, index) => {
                const display = getActivityDisplay(activity);
                return (
                  <MotionBox
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: `${activity.color}.main` }}>
                          {display.icon}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body2" fontWeight="600">
                            {display.text}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            {activity.location && `${activity.location} • `}
                            {formatDistance(activity.timestamp, new Date(), { addSuffix: true })}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < activities.length - 1 && <Divider variant="inset" component="li" />}
                  </MotionBox>
                );
              })}
            </AnimatePresence>
          </List>
        )}
      </CardContent>
    </MotionCard>
  );
};

/**
 * Main Interactive Elements Section
 */
const InteractiveHomepageElements = () => {
  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default' }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" fontWeight="700" gutterBottom>
            Smart Tools for Smarter Decisions
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            Use our interactive tools to find the perfect franchise match and calculate your potential returns
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {/* Investment Calculator - Full Width on Top */}
          <Grid item xs={12} lg={10}>
            <InvestmentCalculator />
          </Grid>
          
          {/* Quiz and Live Feed - Side by Side */}
          <Grid item xs={12} md={6} lg={5}>
            <FindYourMatchQuiz />
          </Grid>
          <Grid item xs={12} md={6} lg={5}>
            <LiveActivityFeed />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default InteractiveHomepageElements;
