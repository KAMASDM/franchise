import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Dialog,
  LinearProgress,
  Breadcrumbs,
  Link,
  Rating,
  Tabs,
  Tab
} from '@mui/material'
import {
  ArrowBack,
  LocationOn,
  TrendingUp,
  Star,
  CheckCircle,
  ExpandMore,
  Phone,
  Email,
  Business,
  Timeline,
  AttachMoney,
  Support,
  School,
  Groups,
  Verified,
  Home,
  Store,
  Article,
  AccessTime,
  Person,
  ChevronRight,
  BusinessCenter,
  SupportAgent,
  EmojiEvents,
  Assignment
} from '@mui/icons-material'
import { brandsData } from '../../data/brandsData'
import { brandFAQs } from '../../data/faqData'
import { franchiseBlogData } from '../../data/franchiseBlogData'
import FranchiseInquiryForm from '../forms/FranchiseInquiryForm'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)
const MotionCard = motion(Card)

const BrandDetail = () => {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [brand, setBrand] = useState(null)
  const [showInquiryForm, setShowInquiryForm] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [brandBlogs, setBrandBlogs] = useState([])

  useEffect(() => {
    const brandData = brandsData.find(b => b.id === parseInt(id))
    setBrand(brandData)

    if (brandData) {
      // Filter blogs related to this brand
      const relatedBlogs = franchiseBlogData.filter(blog => 
        blog.tags.some(tag => 
          brandData.name.toLowerCase().includes(tag.toLowerCase()) ||
          brandData.category.toLowerCase().includes(tag.toLowerCase()) ||
          tag.toLowerCase().includes(brandData.category.toLowerCase())
        )
      ).slice(0, 6)
      setBrandBlogs(relatedBlogs)
    }

    // Check if inquiry parameter is in URL
    if (searchParams.get('inquiry') === 'true') {
      setShowInquiryForm(true)
    }

    // Scroll to top
    window.scrollTo(0, 0)
  }, [id, searchParams])

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  if (!brand) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" color="text.secondary">Brand not found</Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/brands')}
          sx={{ mt: 2, borderRadius: 25 }}
        >
          Back to Brands
        </Button>
      </Container>
    )
  }

  const faqs = brandFAQs[brand.id] || []

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          underline="hover"
          color="inherit"
          href="/"
          onClick={(e) => {
            e.preventDefault()
            navigate('/')
          }}
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          <Home fontSize="small" />
          Home
        </Link>
        <Link
          underline="hover"
          color="inherit"
          href="/brands"
          onClick={(e) => {
            e.preventDefault()
            navigate('/brands')
          }}
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          <Store fontSize="small" />
          Brands
        </Link>
        <Typography color="text.primary">{brand.name}</Typography>
      </Breadcrumbs>

      {/* Hero Section */}
      <MotionCard
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        sx={{ mb: 6, borderRadius: 4, overflow: 'hidden', boxShadow: 3 }}
      >
        <Box
          sx={{
            height: { xs: 300, md: 400 },
            backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url(${brand.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            color: 'white',
            p: { xs: 3, md: 6 },
            position: 'relative'
          }}
        >
          <Box sx={{ maxWidth: 800, zIndex: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mr: 3,
                  backgroundColor: 'white',
                  color: 'primary.main',
                  fontSize: '2rem',
                  fontWeight: 'bold'
                }}
              >
                {brand.name.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h2" fontWeight="bold" sx={{ mb: 1, fontSize: { xs: '2rem', md: '3rem' } }}>
                  {brand.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                  <Chip
                    label={brand.category}
                    sx={{ backgroundColor: 'primary.main', color: 'white', fontWeight: 'bold' }}
                  />
                  <Chip
                    label={`${brand.locations} Locations`}
                    sx={{ backgroundColor: 'secondary.main', color: 'white', fontWeight: 'bold' }}
                  />
                  <Chip
                    icon={<Star />}
                    label="4.5 Rating"
                    sx={{ backgroundColor: 'warning.main', color: 'white', fontWeight: 'bold' }}
                  />
                </Box>
              </Box>
            </Box>
            <Typography variant="h6" sx={{ maxWidth: 600, lineHeight: 1.6, mb: 4 }}>
              {brand.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => setShowInquiryForm(true)}
                sx={{
                  backgroundColor: '#FFD700',
                  color: 'black',
                  fontWeight: 'bold',
                  borderRadius: 25,
                  px: 4,
                  '&:hover': { backgroundColor: '#FFC107' }
                }}
              >
                Request Information
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<Phone />}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  borderRadius: 25,
                  px: 4,
                  '&:hover': { borderColor: '#FFD700', backgroundColor: 'rgba(255,215,0,0.1)' }
                }}
              >
                Call Now
              </Button>
            </Box>
          </Box>
          
          {/* Decorative Elements */}
          <Box
            sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              zIndex: 1
            }}
          />
        </Box>
      </MotionCard>

      {/* Key Metrics - Centered Cards */}
      <MotionBox
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        sx={{ mb: 6 }}
      >
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, textAlign: 'center' }}>
          Investment Overview
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {[
            { icon: <AttachMoney />, value: brand.investment, label: 'Total Investment', color: 'primary' },
            { icon: <TrendingUp />, value: brand.roi, label: 'Expected ROI', color: 'secondary' },
            { icon: <Timeline />, value: brand.paybackPeriod, label: 'Payback Period', color: 'success' },
            { icon: <Star />, value: brand.franchiseFee, label: 'Franchise Fee', color: 'warning' }
          ].map((metric, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <MotionCard
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                sx={{ 
                  textAlign: 'center', 
                  p: 3, 
                  borderRadius: 3,
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 4
                  }
                }}
              >
                <Avatar sx={{ 
                  mx: 'auto', 
                  mb: 2, 
                  backgroundColor: `${metric.color}.main`, 
                  width: 70, 
                  height: 70 
                }}>
                  {metric.icon}
                </Avatar>
                <Typography variant="h5" fontWeight="bold" color={`${metric.color}.main`} sx={{ mb: 1 }}>
                  {metric.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {metric.label}
                </Typography>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      </MotionBox>

      {/* Main Content with Tabs */}
      <Box sx={{ mb: 6 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            mb: 3,
            '& .MuiTab-root': {
              fontWeight: 'bold',
              minHeight: 60,
              borderRadius: 25,
              mx: 1,
              '&.Mui-selected': {
                backgroundColor: 'primary.light',
                color: 'white'
              }
            }
          }}
        >
          <Tab label="Overview" icon={<Business />} />
          <Tab label="Training & Support" icon={<Support />} />
          <Tab label="Success Stories" icon={<EmojiEvents />} />
          <Tab label="Locations" icon={<LocationOn />} />
          <Tab label="Resources" icon={<Article />} />
        </Tabs>

        {/* Tab Content */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={4}>
            {/* About Section */}
            <Grid item xs={12} lg={8}>
              <MotionCard
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                sx={{ mb: 4, borderRadius: 3 }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                    About {brand.name}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8, fontSize: '1.1rem' }}>
                    {brand.details.about}
                  </Typography>

                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                    Why Choose {brand.name}?
                  </Typography>
                  <Grid container spacing={2}>
                    {brand.details.highlights.map((highlight, index) => (
                      <Grid item xs={12} md={6} key={index}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <CheckCircle sx={{ color: 'success.main', mr: 2 }} />
                          <Typography variant="body1">{highlight}</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </MotionCard>
            </Grid>

            {/* Requirements Sidebar */}
            <Grid item xs={12} lg={4}>
              <MotionCard
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                sx={{ borderRadius: 3, position: 'sticky', top: 100 }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                    Investment Requirements
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {[
                      { label: 'Total Investment', value: brand.details.requirements.totalInvestment, color: 'primary' },
                      { label: 'Liquid Capital', value: brand.details.requirements.liquidCapital, color: 'secondary' },
                      { label: 'Experience Required', value: brand.details.requirements.experience, color: 'success' }
                    ].map((req, index) => (
                      <Paper key={index} sx={{ p: 2, backgroundColor: `${req.color}.light`, color: 'white' }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>{req.label}</Typography>
                        <Typography variant="h6" fontWeight="bold">{req.value}</Typography>
                      </Paper>
                    ))}
                  </Box>
                </CardContent>
              </MotionCard>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Grid container spacing={4} justifyContent="center">
            {[
              {
                icon: <School />,
                title: 'Comprehensive Training',
                description: 'Complete 6-week training program covering all aspects of operations, marketing, and management.',
                features: ['Initial Training Program', 'Operations Manual', 'Marketing Materials', 'Ongoing Support']
              },
              {
                icon: <SupportAgent />,
                title: 'Ongoing Support',
                description: 'Dedicated support team available 24/7 to help with any challenges or questions.',
                features: ['24/7 Help Desk', 'Regular Check-ins', 'Performance Reviews', 'Growth Strategies']
              },
              {
                icon: <BusinessCenter />,
                title: 'Business Development',
                description: 'Strategic guidance to help you grow your business and maximize profitability.',
                features: ['Site Selection', 'Grand Opening Support', 'Marketing Campaigns', 'Vendor Relations']
              }
            ].map((support, index) => (
              <Grid item xs={12} md={4} key={index}>
                <MotionCard
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  sx={{ 
                    textAlign: 'center', 
                    p: 4, 
                    borderRadius: 3, 
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <Avatar sx={{ 
                    mx: 'auto', 
                    mb: 3, 
                    backgroundColor: 'primary.main', 
                    width: 80, 
                    height: 80 
                  }}>
                    {support.icon}
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    {support.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {support.description}
                  </Typography>
                  <List dense>
                    {support.features.map((feature, fIndex) => (
                      <ListItem key={fIndex} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <CheckCircle sx={{ color: 'success.main', fontSize: 18 }} />
                        </ListItemIcon>
                        <ListItemText primary={feature} />
                      </ListItem>
                    ))}
                  </List>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Grid container spacing={4} justifyContent="center">
            {[
              {
                name: 'John Smith',
                location: 'Dallas, TX',
                story: 'Started with one location and now owns 5 successful franchises across Texas.',
                revenue: '$2.5M Annual Revenue',
                timeframe: '3 Years'
              },
              {
                name: 'Sarah Johnson',
                location: 'Miami, FL',
                story: 'Transitioned from corporate life to franchise ownership and never looked back.',
                revenue: '$1.8M Annual Revenue',
                timeframe: '2 Years'
              },
              {
                name: 'Michael Chen',
                location: 'Seattle, WA',
                story: 'Built a thriving business while maintaining work-life balance.',
                revenue: '$3.2M Annual Revenue',
                timeframe: '4 Years'
              }
            ].map((story, index) => (
              <Grid item xs={12} md={4} key={index}>
                <MotionCard
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  sx={{ 
                    p: 4, 
                    borderRadius: 3, 
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ mr: 2, backgroundColor: 'primary.main' }}>
                      {story.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">{story.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{story.location}</Typography>
                    </Box>
                  </Box>
                  <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic' }}>
                    "{story.story}"
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="primary.main" fontWeight="bold">
                      {story.revenue}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {story.timeframe}
                    </Typography>
                  </Box>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          <Grid container spacing={3} justifyContent="center">
            {brand.currentLocations.map((location, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <MotionCard
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  sx={{ 
                    p: 3, 
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOn sx={{ color: 'primary.main', mr: 2 }} />
                    <Typography variant="h6" fontWeight="bold">
                      {location.city}, {location.state}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {location.address}
                  </Typography>
                  <Typography variant="body2" color="primary.main" fontWeight="bold">
                    {location.phone}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ mt: 2 }}
                    fullWidth
                  >
                    View Details
                  </Button>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={4}>
          {/* Brand-Related Blogs */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, textAlign: 'center' }}>
              {brand.name} Insights & Resources
            </Typography>
            <Grid container spacing={4} justifyContent="center">
              {brandBlogs.map((blog, index) => (
                <Grid item xs={12} md={6} lg={4} key={blog.id}>
                  <MotionCard
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    sx={{ 
                      borderRadius: 3, 
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 4
                      }
                    }}
                    onClick={() => navigate(`/blog/${blog.id}`)}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={blog.image}
                      alt={blog.title}
                    />
                    <CardContent sx={{ p: 3 }}>
                      <Chip
                        label={blog.category}
                        size="small"
                        color="primary"
                        sx={{ mb: 2 }}
                      />
                      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                        {blog.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        {blog.excerpt}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Person sx={{ fontSize: 16 }} />
                          <Typography variant="caption">{blog.author}</Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {blog.readTime}
                        </Typography>
                      </Box>
                    </CardContent>
                  </MotionCard>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* FAQs */}
          {faqs.length > 0 && (
            <Box>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 4, textAlign: 'center' }}>
                Frequently Asked Questions
              </Typography>
              <Grid container justifyContent="center">
                <Grid item xs={12} lg={8}>
                  {faqs.map((faq, index) => (
                    <Accordion key={index} sx={{ mb: 1, borderRadius: 2 }}>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography fontWeight="bold">{faq.question}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography>{faq.answer}</Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Grid>
              </Grid>
            </Box>
          )}
        </TabPanel>
      </Box>

      {/* Final CTA Section */}
      <MotionCard
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        sx={{
          borderRadius: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <CardContent sx={{ p: 6, textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
            Ready to Join the {brand.name} Family?
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.9, fontSize: '1.1rem' }}>
            Take the first step towards owning your own {brand.name} franchise. 
            Get detailed information and speak with our franchise experts today.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => setShowInquiryForm(true)}
              sx={{
                backgroundColor: '#FFD700',
                color: 'black',
                fontWeight: 'bold',
                borderRadius: 25,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': { backgroundColor: '#FFC107' }
              }}
            >
              Get Franchise Information
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<Phone />}
              sx={{
                borderColor: 'white',
                color: 'white',
                borderRadius: 25,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': { 
                  borderColor: '#FFD700',
                  backgroundColor: 'rgba(255, 215, 0, 0.1)'
                }
              }}
            >
              Call (555) 123-4567
            </Button>
          </Box>
        </CardContent>
        
        {/* Decorative Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 200,
            height: 200,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            zIndex: 1
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -50,
            left: -50,
            width: 100,
            height: 100,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            zIndex: 1
          }}
        />
      </MotionCard>

      {/* Inquiry Form Dialog */}
      <Dialog
        open={showInquiryForm}
        onClose={() => setShowInquiryForm(false)}
        maxWidth="md"
        fullWidth
      >
        <FranchiseInquiryForm
          brand={brand}
          onClose={() => setShowInquiryForm(false)}
        />
      </Dialog>
    </Container>
  )
}

export default BrandDetail