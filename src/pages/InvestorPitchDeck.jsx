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
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from 'recharts';
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

  // Chart Colors
  const colors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.info.main,
  ];

  // Market Size Data (in Billions INR)
  const marketSizeData = [
    { year: '2020', size: 3500, growth: 3.2 },
    { year: '2021', size: 3750, growth: 7.1 },
    { year: '2022', size: 4000, growth: 6.7 },
    { year: '2023', size: 4250, growth: 6.3 },
    { year: '2024', size: 4500, growth: 5.9 },
    { year: '2025', size: 4850, growth: 7.4 },
  ];

  // Revenue Projection Data (in Thousands INR)
  const revenueProjectionData = [
    { month: 'Jan', revenue: 0, users: 0 },
    { month: 'Mar', revenue: 0, users: 1200 }, // Free period
    { month: 'Jun', revenue: 120, users: 3800 }, // ₹100/month starts
    { month: 'Sep', revenue: 750, users: 7500 },
    { month: 'Dec', revenue: 1200, users: 12000 },
    { month: '2025 Q2', revenue: 2200, users: 22000 },
    { month: '2025 Q4', revenue: 3800, users: 38000 },
  ];

  // Revenue Streams Pie Chart Data
  const revenueStreamsData = [
    { name: 'Listing Fees', value: 35, amount: 58000 }, // ₹58,000
    { name: 'Lead Generation', value: 30, amount: 50000 }, // ₹50,000
    { name: 'Subscriptions', value: 20, amount: 33000 }, // ₹33,000 (₹100/month model)
    { name: 'Transaction Fees', value: 15, amount: 25000 }, // ₹25,000
  ];

  // User Acquisition Data
  const userAcquisitionData = [
    { channel: 'Organic Search', users: 45, cost: 12 },
    { channel: 'Social Media', users: 25, cost: 28 },
    { channel: 'Referrals', users: 15, cost: 8 },
    { channel: 'Paid Ads', users: 10, cost: 45 },
    { channel: 'Partnerships', users: 5, cost: 15 },
  ];

  // Feature Adoption Data
  const featureAdoptionData = [
    { feature: 'AI Chatbot', adoption: 78 },
    { feature: 'Advanced Search', adoption: 92 },
    { feature: 'Analytics Dashboard', adoption: 65 },
    { feature: 'Mobile PWA', adoption: 88 },
    { feature: 'Real-time Chat', adoption: 54 },
    { feature: 'Multi-language', adoption: 42 },
  ];

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
    { label: "Target ARR", value: "₹1.5Cr", subtitle: "₹100/month + other streams" }
  ];

  const revenueStreams = [
    { title: "Listing Fees", amount: "₹5,000-15K/month", description: "Premium brand placement and features" },
    { title: "Lead Generation", amount: "₹500-1K/lead", description: "Qualified prospect delivery" },
    { title: "Subscriptions", amount: "₹100/month", description: "Premium access after free period" },
    { title: "Transaction Fees", amount: "2-3%", description: "Facilitated franchise agreements" }
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
          Revolutionizing the ₹4.5T+ Indian Franchise Industry
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}>
          AI-powered marketplace connecting franchise seekers with opportunities through intelligent matching, 
          comprehensive analytics, and modern user experience.
        </Typography>
      </MotionBox>

      {/* Market Opportunity */}
      <MotionCard {...fadeInUp} sx={{ mb: 6, overflow: 'hidden', background: `linear-gradient(135deg, ${theme.palette.primary.light}15, ${theme.palette.secondary.light}15)` }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <TrendingUp color="primary" />
            Market Opportunity & Growth
          </Typography>
          
          <Grid container spacing={4}>
            {/* Market Size Visualization */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: 400 }}>
                <Typography variant="h6" gutterBottom textAlign="center">
                  Indian Franchise Market Size (Billions INR)
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={marketSizeData}>
                    <defs>
                      <linearGradient id="colorSize" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value}B`, 'Market Size']} />
                    <Area 
                      type="monotone" 
                      dataKey="size" 
                      stroke={theme.palette.primary.main}
                      fillOpacity={1}
                      fill="url(#colorSize)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Key Statistics */}
            <Grid item xs={12} md={6}>
              <Stack spacing={3} height="100%">
                <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                  <Typography variant="h3" fontWeight="bold">₹4.5T+</Typography>
                  <Typography variant="h6">Current Market Size</Typography>
                  <Typography variant="body2">Growing at 6-8% annually</Typography>
                </Paper>
                
                <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'success.main', color: 'success.contrastText' }}>
                  <Typography variant="h3" fontWeight="bold">780K+</Typography>
                  <Typography variant="h6">Franchise Units Globally</Typography>
                  <Typography variant="body2">Across 120+ countries</Typography>
                </Paper>
                
                <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'warning.main', color: 'warning.contrastText' }}>
                  <Typography variant="h3" fontWeight="bold">90%</Typography>
                  <Typography variant="h6">Traditional Discovery</Typography>
                  <Typography variant="body2">Digital transformation opportunity</Typography>
                </Paper>
              </Stack>
            </Grid>

            {/* Pain Points Visualization */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, mt: 2 }}>
                <Typography variant="h6" gutterBottom textAlign="center">
                  Market Pain Points & Our Solutions
                </Typography>
                <Grid container spacing={3}>
                  {[
                    { problem: "Fragmented Discovery", solution: "Unified AI-Powered Platform", impact: 85 },
                    { problem: "Poor Mobile Experience", solution: "PWA with Offline Support", impact: 92 },
                    { problem: "Limited Analytics", solution: "Real-time Dashboard & Insights", impact: 78 },
                    { problem: "Manual Matching", solution: "AI-Powered Brand Matching", impact: 88 }
                  ].map((item, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                          <CircularProgress
                            variant="determinate"
                            value={item.impact}
                            size={80}
                            thickness={4}
                            sx={{ color: colors[index % colors.length] }}
                          />
                          <Box sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: 'absolute',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            <Typography variant="h6" component="div" color="text.secondary">
                              {`${item.impact}%`}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="subtitle2" color="error.main" gutterBottom>
                          {item.problem}
                        </Typography>
                        <Typography variant="body2" color="success.main">
                          {item.solution}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
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

      {/* Pricing Strategy */}
      <MotionCard {...fadeInUp} sx={{ mb: 6, background: `linear-gradient(135deg, ${theme.palette.success.light}15, ${theme.palette.info.light}15)` }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <AttachMoney color="primary" />
            Pricing Strategy & Model
          </Typography>
          
          <Grid container spacing={4} alignItems="center">
            {/* Pricing Timeline */}
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom color="primary">
                Freemium to Subscription Model
              </Typography>
              <Typography variant="body1" paragraph>
                Our strategic pricing approach focuses on user acquisition through a generous free period, 
                followed by affordable subscription pricing that's accessible to the Indian market.
              </Typography>
              
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    background: `linear-gradient(135deg, ${theme.palette.success.main}20, ${theme.palette.success.main}05)`,
                    border: `2px solid ${theme.palette.success.main}30`
                  }}>
                    <Typography variant="h6" color="success.main" gutterBottom>
                      Phase 1: Free Access
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" gutterBottom>
                      ₹0
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Complete platform access
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Build user base & gather feedback
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.primary.main}05)`,
                    border: `2px solid ${theme.palette.primary.main}`
                  }}>
                    <Typography variant="h6" color="primary.main" gutterBottom>
                      Phase 2: Premium Features
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" gutterBottom>
                      ₹100/mo
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Advanced analytics & priority support
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Affordable for Indian market
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>

            {/* Value Proposition */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom textAlign="center">
                  Why ₹100/month?
                </Typography>
                <List>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                    <ListItemText primary="Affordable for Indian businesses" />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                    <ListItemText primary="Lower than competition (₹500-2000)" />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                    <ListItemText primary="High volume, low friction model" />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                    <ListItemText primary="Strong user retention expected" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </MotionCard>

      {/* Key Metrics & User Acquisition */}
      <MotionCard {...fadeInUp} sx={{ mb: 6, background: `linear-gradient(135deg, ${theme.palette.info.light}15, ${theme.palette.warning.light}15)` }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <Timeline color="primary" />
            Growth Targets & User Acquisition
          </Typography>
          
          <Grid container spacing={4}>
            {/* Key Metrics Cards */}
            <Grid item xs={12}>
              <Grid container spacing={3}>
                {metrics.map((metric, index) => (
                  <Grid item xs={6} md={3} key={index}>
                    <Paper sx={{ 
                      p: 3, 
                      textAlign: 'center',
                      height: 180,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      background: `linear-gradient(135deg, ${colors[index]}, ${colors[index]}80)`,
                      color: 'white',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: theme.shadows[12]
                      },
                      transition: 'all 0.3s ease'
                    }}>
                      <Typography variant="h3" fontWeight="bold" gutterBottom>
                        {metric.value}
                      </Typography>
                      <Typography variant="h6" gutterBottom>
                        {metric.label}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        {metric.subtitle}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* User Acquisition Channels */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: 400 }}>
                <Typography variant="h6" gutterBottom textAlign="center">
                  User Acquisition by Channel (%)
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={userAcquisitionData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="channel" type="category" width={100} />
                    <Tooltip formatter={(value, name) => [`${value}%`, 'Users']} />
                    <Bar dataKey="users" fill={theme.palette.primary.main} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Feature Adoption */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: 400 }}>
                <Typography variant="h6" gutterBottom textAlign="center">
                  Platform Feature Adoption (%)
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {featureAdoptionData.map((feature, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">{feature.feature}</Typography>
                        <Typography variant="body2" fontWeight="bold">{feature.adoption}%</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={feature.adoption} 
                        sx={{ 
                          height: 12, 
                          borderRadius: 6,
                          backgroundColor: `${colors[index % colors.length]}20`,
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: colors[index % colors.length],
                            borderRadius: 6
                          }
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>

            {/* User Growth Timeline */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom textAlign="center">
                  Projected User Growth & Revenue Timeline
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueProjectionData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={theme.palette.success.main} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={theme.palette.success.main} stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={theme.palette.info.main} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={theme.palette.info.main} stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      stackId="1"
                      stroke={theme.palette.success.main}
                      fill="url(#colorRevenue)"
                      name="Revenue (K USD)"
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="users"
                      stackId="2"
                      stroke={theme.palette.info.main}
                      fill="url(#colorUsers)"
                      name="Active Users"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </MotionCard>

      {/* Revenue Streams with Visualization */}
      <MotionCard {...fadeInUp} sx={{ mb: 6, background: `linear-gradient(135deg, ${theme.palette.success.light}15, ${theme.palette.primary.light}15)` }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <AttachMoney color="primary" />
            Revenue Streams & Projections
          </Typography>
          
          <Grid container spacing={4}>
            {/* Revenue Distribution Pie Chart */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: 400 }}>
                <Typography variant="h6" gutterBottom textAlign="center">
                  Revenue Distribution by Stream
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={revenueStreamsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {revenueStreamsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Revenue Growth Projection */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: 400 }}>
                <Typography variant="h6" gutterBottom textAlign="center">
                  Monthly Revenue Projection (K INR)
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueProjectionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke={theme.palette.success.main}
                      strokeWidth={3}
                      dot={{ fill: theme.palette.success.main, strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Revenue Stream Details */}
            <Grid item xs={12}>
              <Grid container spacing={3}>
                {revenueStreams.map((stream, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Paper sx={{ 
                      p: 3, 
                      height: '100%', 
                      textAlign: 'center',
                      background: `linear-gradient(135deg, ${colors[index]}20, ${colors[index]}05)`,
                      border: `2px solid ${colors[index]}`,
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[8]
                      },
                      transition: 'all 0.3s ease'
                    }}>
                      <Typography variant="h6" gutterBottom color={colors[index]} fontWeight="bold">
                        {stream.title}
                      </Typography>
                      <Typography variant="h4" gutterBottom fontWeight="bold">
                        {stream.amount}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stream.description}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={revenueStreamsData[index]?.value || 0} 
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            backgroundColor: `${colors[index]}20`,
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: colors[index]
                            }
                          }}
                        />
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
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

      {/* Competitive Advantages with Visual Comparison */}
      <MotionCard {...fadeInUp} sx={{ mb: 6, background: `linear-gradient(135deg, ${theme.palette.warning.light}15, ${theme.palette.error.light}15)` }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <EmojiEvents color="primary" />
            Competitive Advantages & Market Position
          </Typography>
          
          <Grid container spacing={4}>
            {/* Competitive Comparison Radar Chart */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: 400 }}>
                <Typography variant="h6" gutterBottom textAlign="center">
                  Competitive Analysis Score
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" barSize={10} data={[
                    { name: 'AI Integration', us: 95, competitor: 25, fullMark: 100 },
                    { name: 'Mobile Experience', us: 92, competitor: 45, fullMark: 100 },
                    { name: 'Analytics', us: 88, competitor: 30, fullMark: 100 },
                    { name: 'User Experience', us: 90, competitor: 55, fullMark: 100 },
                    { name: 'Technology Stack', us: 94, competitor: 40, fullMark: 100 },
                  ]}>
                    <RadialBar dataKey="us" cornerRadius={10} fill={theme.palette.primary.main} />
                    <RadialBar dataKey="competitor" cornerRadius={10} fill={theme.palette.grey[400]} />
                    <Tooltip />
                  </RadialBarChart>
                </ResponsiveContainer>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 16, height: 16, bgcolor: 'primary.main', borderRadius: 1 }} />
                    <Typography variant="body2">Our Platform</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 16, height: 16, bgcolor: 'grey.400', borderRadius: 1 }} />
                    <Typography variant="body2">Competitors</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Key Differentiators */}
            <Grid item xs={12} md={6}>
              <Stack spacing={2} height="100%">
                {[
                  { 
                    title: "AI-First Approach", 
                    description: "Gemini AI integration for intelligent matching", 
                    score: 95,
                    icon: <Psychology />
                  },
                  { 
                    title: "Modern Architecture", 
                    description: "React 19 + Firebase + PWA capabilities", 
                    score: 92,
                    icon: <Cloud />
                  },
                  { 
                    title: "Multi-Model Platform", 
                    description: "11+ business models beyond franchising", 
                    score: 88,
                    icon: <BusinessCenter />
                  },
                  { 
                    title: "Real-time Analytics", 
                    description: "Comprehensive insights and reporting", 
                    score: 90,
                    icon: <Analytics />
                  }
                ].map((advantage, index) => (
                  <Paper key={index} sx={{ 
                    p: 2, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    background: `linear-gradient(90deg, ${colors[index]}10, transparent)`
                  }}>
                    <Avatar sx={{ bgcolor: colors[index], width: 48, height: 48 }}>
                      {advantage.icon}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {advantage.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {advantage.description}
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={advantage.score} 
                        sx={{ 
                          height: 6, 
                          borderRadius: 3,
                          backgroundColor: `${colors[index]}20`,
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: colors[index]
                          }
                        }}
                      />
                    </Box>
                    <Typography variant="h6" fontWeight="bold" color={colors[index]}>
                      {advantage.score}%
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            </Grid>

            {/* Technology Stack Showcase */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom textAlign="center">
                  Technology Stack & Architecture
                </Typography>
                <Grid container spacing={3} justifyContent="center">
                  {[
                    { name: 'React 19', category: 'Frontend', color: colors[0] },
                    { name: 'Firebase', category: 'Backend', color: colors[1] },
                    { name: 'Material-UI', category: 'UI Framework', color: colors[2] },
                    { name: 'Gemini AI', category: 'AI/ML', color: colors[3] },
                    { name: 'PWA', category: 'Mobile', color: colors[4] },
                    { name: 'Netlify', category: 'Deployment', color: colors[5] }
                  ].map((tech, index) => (
                    <Grid item xs={6} sm={4} md={2} key={index}>
                      <Paper sx={{
                        p: 2,
                        textAlign: 'center',
                        height: 120,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        background: `linear-gradient(135deg, ${tech.color}20, ${tech.color}05)`,
                        border: `2px solid ${tech.color}30`,
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: theme.shadows[4]
                        },
                        transition: 'all 0.3s ease'
                      }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ color: tech.color }}>
                          {tech.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {tech.category}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </MotionCard>

      {/* Investment Opportunity */}
      <MotionCard {...fadeInUp} sx={{ 
        mb: 6, 
        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        color: 'primary.contrastText',
        overflow: 'hidden'
      }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'white', mb: 4 }}>
            <Insights />
            Investment Opportunity & Funding
          </Typography>
          
          <Grid container spacing={4}>
            {/* Investment Highlights */}
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                Join the Digital Transformation of Franchising
              </Typography>
              <Typography variant="body1" paragraph sx={{ color: 'white', opacity: 0.9 }}>
                We're seeking strategic investors to accelerate growth and capture market leadership 
                in the $50B+ franchise industry. With proven technology and clear revenue streams, 
                we're positioned for rapid scaling.
              </Typography>
              
              {/* Funding Rounds */}
              <Stack spacing={2} sx={{ mt: 3 }}>
                {[
                  { round: 'Seed Round', amount: '₹4Cr', equity: '15%', milestone: 'MVP & Market Validation' },
                  { round: 'Series A', amount: '₹17Cr', equity: '20%', milestone: 'Scale & Expansion' },
                  { round: 'Series B', amount: '₹42Cr', equity: '15%', milestone: 'Global Platform' }
                ].map((funding, index) => (
                  <Paper key={index} sx={{ 
                    p: 2, 
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}>
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item xs={3}>
                        <Typography variant="h6" sx={{ color: 'white' }}>{funding.round}</Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="h5" fontWeight="bold" sx={{ color: 'white' }}>{funding.amount}</Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="body1" sx={{ color: 'white' }}>Equity: {funding.equity}</Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="body2" sx={{ color: 'white', opacity: 0.8 }}>{funding.milestone}</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
              </Stack>
            </Grid>

            {/* Use of Funds Visualization */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" color="primary" gutterBottom textAlign="center">
                  Use of Funds Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Development', value: 60, amount: '₹10Cr' },
                        { name: 'Marketing', value: 25, amount: '₹4Cr' },
                        { name: 'Operations', value: 15, amount: '₹2.5Cr' }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {[0,1,2].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                  </PieChart>
                </ResponsiveContainer>
                <Stack spacing={1} sx={{ mt: 2 }}>
                  {[
                    { label: 'Development', percent: 60, color: colors[0] },
                    { label: 'Marketing', percent: 25, color: colors[1] },
                    { label: 'Operations', percent: 15, color: colors[2] }
                  ].map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 12, height: 12, bgcolor: item.color, borderRadius: 1 }} />
                      <Typography variant="body2" sx={{ flex: 1 }}>{item.label}</Typography>
                      <Typography variant="body2" fontWeight="bold">{item.percent}%</Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Grid>

            {/* Investment Returns Projection */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, mt: 2 }}>
                <Typography variant="h6" gutterBottom textAlign="center">
                  Projected Returns & Valuation Timeline
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={[
                    { year: '2024', valuation: 17, revenue: 1200, users: 12000 },
                    { year: '2025', valuation: 67, revenue: 3800, users: 38000 },
                    { year: '2026', valuation: 210, revenue: 10000, users: 85000 },
                    { year: '2027', valuation: 500, revenue: 20000, users: 150000 },
                    { year: '2028', valuation: 1000, revenue: 35000, users: 250000 }
                  ]}>
                    <defs>
                      <linearGradient id="colorValuation" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={theme.palette.success.main} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={theme.palette.success.main} stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="valuation" 
                      stroke={theme.palette.success.main}
                      fill="url(#colorValuation)" 
                      name="Valuation (₹Cr)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
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