import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Stack,
  Avatar,
  Paper,
  useTheme,
  IconButton,
} from '@mui/material';
import {
  TrendingUp,
  Rocket,
  Analytics,
  Phone,
  Email,
  LinkedIn,
  GitHub,
  AttachMoney,
  People,
  Speed,
  Security,
  PhoneAndroid,
  Cloud,
  Psychology,
  Language,
  BusinessCenter,
  Timeline,
  CheckCircle,
  Star,
  Launch,
  EmojiEvents,
  Insights,
  LocationOn,
  Schedule,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const InvestorPitchDeck = () => {
  const theme = useTheme();

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const currentFeatures = [
    { icon: <Psychology />, title: "AI-Powered Chatbot", description: "Gemini AI integration for intelligent brand matching" },
    { icon: <Analytics />, title: "Real-Time Analytics", description: "Comprehensive dashboards with performance tracking" },
    { icon: <PhoneAndroid />, title: "Progressive Web App", description: "Mobile-optimized with offline capabilities" },
    { icon: <Speed />, title: "Advanced Search", description: "Fuzzy matching and intelligent suggestions" },
    { icon: <People />, title: "Multi-Role Platform", description: "Users, Brand Owners, and Admin interfaces" },
    { icon: <Security />, title: "Firebase Backend", description: "Scalable cloud infrastructure with security" },
    { icon: <BusinessCenter />, title: "11+ Business Models", description: "Beyond franchising: dealerships, distributorships" },
    { icon: <Language />, title: "Modern Tech Stack", description: "React 19, Vite, Material-UI, PWA capabilities" }
  ];

  const futureRoadmap = [
    {
      phase: "Q1 2024",
      title: "Enhanced Experience",
      features: ["Voice Search Integration", "Video Consultations", "Advanced AI Recommendations", "Multi-Language Support"]
    },
    {
      phase: "Q2-Q3 2024", 
      title: "Ecosystem Expansion",
      features: ["Financial Integration", "Professional Marketplace", "Training Platform", "Community Features"]
    },
    {
      phase: "Q4 2024",
      title: "Global Platform",
      features: ["White-Label Solutions", "API Marketplace", "Blockchain Integration", "Enterprise SaaS"]
    }
  ];

  const metrics = [
    { label: "Target MAU", value: "50K", subtitle: "By end of 2024" },
    { label: "Brand Listings", value: "2,000", subtitle: "Active opportunities" },
    { label: "Monthly Leads", value: "10K", subtitle: "Qualified prospects" },
    { label: "Target ARR", value: "$2M", subtitle: "Multiple revenue streams" }
  ];

  const revenueStreams = [
    { title: "Listing Fees", amount: "$500-2K/month", description: "Premium brand placement and features" },
    { title: "Lead Generation", amount: "$50-100/lead", description: "Qualified prospect delivery" },
    { title: "Subscriptions", amount: "$99-999/month", description: "Tiered access and analytics" },
    { title: "Transaction Fees", amount: "3-5%", description: "Facilitated franchise agreements" }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <MotionBox {...fadeInUp} sx={{ textAlign: 'center', mb: 8 }}>
        <Typography 
          variant="h2" 
          sx={{ 
            fontWeight: 'bold', 
            mb: 2,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Franchise Portal
        </Typography>
        <Typography variant="h4" color="text.secondary" gutterBottom>
          Revolutionizing the $50B Franchise Industry
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}>
          AI-powered marketplace connecting franchise seekers with opportunities through intelligent matching, 
          comprehensive analytics, and modern user experience.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            size="large" 
            startIcon={<Launch />}
            href="https://franchise-portal.netlify.app" 
            target="_blank"
            sx={{ borderRadius: 3, px: 4 }}
          >
            View Live Platform
          </Button>
          <Button 
            variant="outlined" 
            size="large" 
            startIcon={<GitHub />}
            href="https://github.com/KAMASDM/franchise" 
            target="_blank"
            sx={{ borderRadius: 3, px: 4 }}
          >
            View Code
          </Button>
        </Box>
      </MotionBox>

      {/* Market Opportunity */}
      <MotionCard {...fadeInUp} sx={{ mb: 6, overflow: 'hidden' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TrendingUp color="primary" />
            The Opportunity
          </Typography>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" color="primary" fontWeight="bold">$50+ Billion</Typography>
              <Typography variant="h6" gutterBottom>Global Franchise Industry</Typography>
              <Typography variant="body1" paragraph>
                The franchise industry is massive but lacks modern digital infrastructure. Most franchise 
                discovery happens through outdated websites and manual processes.
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>90%+ of franchise discovery</strong> still relies on traditional methods, creating 
                a massive opportunity for digital transformation.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Paper sx={{ p: 2, bgcolor: 'success.light', color: 'success.contrastText' }}>
                  <Typography variant="h6">Market Pain Points</Typography>
                  <Typography variant="body2">• Fragmented discovery process</Typography>
                  <Typography variant="body2">• Limited matching capabilities</Typography>
                  <Typography variant="body2">• Poor mobile experiences</Typography>
                  <Typography variant="body2">• Lack of real-time analytics</Typography>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </MotionCard>

      {/* Current Platform Features */}
      <MotionCard {...fadeInUp} sx={{ mb: 6 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Rocket color="primary" />
            Live Platform Features
          </Typography>
          <Typography variant="body1" paragraph>
            We've built a comprehensive, production-ready platform with modern architecture and AI integration.
          </Typography>
          <motion.div variants={staggerContainer} animate="animate">
            <Grid container spacing={3}>
              {currentFeatures.map((feature, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <MotionCard 
                    variants={fadeInUp}
                    sx={{ 
                      height: '100%', 
                      textAlign: 'center',
                      '&:hover': { 
                        transform: 'translateY(-8px)',
                        boxShadow: theme.shadows[8]
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <CardContent>
                      <Avatar 
                        sx={{ 
                          bgcolor: 'primary.main', 
                          mx: 'auto', 
                          mb: 2, 
                          width: 56, 
                          height: 56 
                        }}
                      >
                        {feature.icon}
                      </Avatar>
                      <Typography variant="h6" gutterBottom>{feature.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </MotionCard>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </CardContent>
      </MotionCard>

      {/* Key Metrics */}
      <MotionCard {...fadeInUp} sx={{ mb: 6 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Timeline color="primary" />
            Growth Targets & Metrics
          </Typography>
          <Grid container spacing={4}>
            {metrics.map((metric, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" color="primary" fontWeight="bold">
                    {metric.value}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {metric.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {metric.subtitle}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </MotionCard>

      {/* Revenue Streams */}
      <MotionCard {...fadeInUp} sx={{ mb: 6 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AttachMoney color="primary" />
            Revenue Streams
          </Typography>
          <Grid container spacing={3}>
            {revenueStreams.map((stream, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Paper sx={{ p: 3, height: '100%', bgcolor: 'grey.50' }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    {stream.title}
                  </Typography>
                  <Typography variant="h4" gutterBottom fontWeight="bold">
                    {stream.amount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stream.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </MotionCard>

      {/* Future Roadmap */}
      <MotionCard {...fadeInUp} sx={{ mb: 6 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Schedule color="primary" />
            Development Roadmap
          </Typography>
          <Grid container spacing={4}>
            {futureRoadmap.map((phase, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ height: '100%', bgcolor: index === 0 ? 'primary.light' : 'grey.50' }}>
                  <CardContent>
                    <Chip 
                      label={phase.phase} 
                      color={index === 0 ? 'primary' : 'default'} 
                      sx={{ mb: 2 }} 
                    />
                    <Typography variant="h6" gutterBottom>
                      {phase.title}
                    </Typography>
                    <List dense>
                      {phase.features.map((feature, featureIndex) => (
                        <ListItem key={featureIndex} sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <CheckCircle fontSize="small" color="success" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={feature}
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </MotionCard>

      {/* Competitive Advantages */}
      <MotionCard {...fadeInUp} sx={{ mb: 6 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <EmojiEvents color="primary" />
            Competitive Advantages
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom color="primary">
                Technology Leadership
              </Typography>
              <List>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon><Star color="warning" /></ListItemIcon>
                  <ListItemText primary="AI-first approach with Gemini integration" />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon><Star color="warning" /></ListItemIcon>
                  <ListItemText primary="Modern React 19 + Firebase architecture" />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon><Star color="warning" /></ListItemIcon>
                  <ListItemText primary="PWA with offline capabilities" />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom color="primary">
                User Experience Excellence
              </Typography>
              <List>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon><Star color="warning" /></ListItemIcon>
                  <ListItemText primary="Mobile-first design (70%+ mobile traffic)" />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon><Star color="warning" /></ListItemIcon>
                  <ListItemText primary="Real-time analytics and insights" />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon><Star color="warning" /></ListItemIcon>
                  <ListItemText primary="Personalized recommendations" />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom color="primary">
                Market Positioning
              </Typography>
              <List>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon><Star color="warning" /></ListItemIcon>
                  <ListItemText primary="First-mover in AI-powered franchise matching" />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon><Star color="warning" /></ListItemIcon>
                  <ListItemText primary="Multi-business model platform (11+ types)" />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon><Star color="warning" /></ListItemIcon>
                  <ListItemText primary="Scalable for global expansion" />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </MotionCard>

      {/* Investment Opportunity */}
      <MotionCard {...fadeInUp} sx={{ mb: 6, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Insights />
            Investment Opportunity
          </Typography>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                Join the Digital Transformation of Franchising
              </Typography>
              <Typography variant="body1" paragraph>
                We're seeking strategic investors to accelerate growth and capture market leadership 
                in the $50B+ franchise industry. With proven technology and clear revenue streams, 
                we're positioned for rapid scaling.
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Chip label="Seed Round: $500K" variant="outlined" sx={{ color: 'white', borderColor: 'white' }} />
                <Chip label="Series A: $2M" variant="outlined" sx={{ color: 'white', borderColor: 'white' }} />
                <Chip label="8-12x Revenue Multiple" variant="outlined" sx={{ color: 'white', borderColor: 'white' }} />
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Use of Funds
                </Typography>
                <Typography variant="body2" gutterBottom>60% Development</Typography>
                <Typography variant="body2" gutterBottom>25% Marketing</Typography>
                <Typography variant="body2" gutterBottom>15% Operations</Typography>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </MotionCard>

      {/* Call to Action */}
      <MotionCard {...fadeInUp}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Ready to Transform Franchising?
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            Schedule a demo to see our live platform in action and discuss partnership opportunities. 
            Join us in revolutionizing how franchises are discovered, evaluated, and launched.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap', mb: 4 }}>
            <Button 
              variant="contained" 
              size="large" 
              startIcon={<Phone />}
              sx={{ borderRadius: 3, px: 4 }}
            >
              Schedule Demo
            </Button>
            <Button 
              variant="outlined" 
              size="large" 
              startIcon={<Email />}
              href="mailto:investors@franchise-portal.com"
              sx={{ borderRadius: 3, px: 4 }}
            >
              Contact Team
            </Button>
          </Box>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" gutterBottom>
            Platform Details
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
            <Chip icon={<GitHub />} label="GitHub Repository" clickable />
            <Chip icon={<Launch />} label="Live Platform" clickable />
            <Chip icon={<Analytics />} label="Real-time Analytics" clickable />
            <Chip icon={<PhoneAndroid />} label="PWA Ready" clickable />
          </Stack>
        </CardContent>
      </MotionCard>
    </Container>
  );
};

export default InvestorPitchDeck;