import React, { useState, useCallback, lazy, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  useTheme,
  Link,
  Stack,
  Tooltip,
  Breadcrumbs,
  Tabs,
  Tab,
  ImageList,
  ImageListItem,
  Dialog,
  DialogContent,
  IconButton,
  Badge,
  Rating,
} from "@mui/material";
import {
  LocationOn,
  Star,
  Phone,
  Email,
  Business,
  AttachMoney,
  TrendingUp,
  Schedule,
  Home,
  School,
  Support,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Language,
  Map,
  Store,
  Launch,
  NavigateNext,
  ArrowBack,
  ContactPhone,
  Info,
  Description,
  PhotoLibrary,
  Close,
  Verified,
  Timeline,
  GroupWork,
  AccountBalance,
  Security,
  LocalOffer,
  CheckCircle,
  WorkOutline,
  BusinessCenter,
  Person,
  Handshake,
  MonetizationOn,
  Assignment,
  VerifiedUser,
} from "@mui/icons-material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion";
import { useBrand } from "../../hooks/useBrand";
import { useDevice } from "../../hooks/useDevice";
import FranchiseInquiryForm from "../forms/FranchiseInquiryForm";
import { BUSINESS_MODEL_CONFIG } from "../../constants/businessModels";

// Lazy load mobile version for better code splitting
const BrandDetailMobile = lazy(() => import('./BrandDetailMobile'));

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const BrandDetail = () => {
  const { isMobile } = useDevice();
  
  // Render mobile-optimized version for mobile devices
  if (isMobile) {
    return (
      <Suspense fallback={
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <CircularProgress />
        </Box>
      }>
        <BrandDetailMobile />
      </Suspense>
    );
  }
  
  // Render desktop version for tablets and desktops
  return <BrandDetailDesktop />;
};

const BrandDetailDesktop = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { brand, loading, error } = useBrand({ slug });
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const theme = useTheme();

  // Memoized tab change handler to prevent infinite re-renders
  const handleTabChange = useCallback((event, newValue) => {
    setActiveTab(newValue);
  }, []);

  // Image carousel settings
  const imageSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    adaptiveHeight: true,
  };

  if (loading) {
    return (
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (error || !brand) {
    return (
      <Container maxWidth="xl" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h4" color="error" gutterBottom>
          Brand Not Found
        </Typography>
        <Typography color="text.secondary" paragraph>
          {error || "The brand you're looking for doesn't exist."}
        </Typography>
        <Button variant="contained" onClick={() => navigate("/brands")}>
          Browse All Brands
        </Button>
      </Container>
    );
  }

  // Get business model configuration
  const businessModelConfig = BUSINESS_MODEL_CONFIG[brand.businessModelType] || {};

  // Helper functions
  const formatCurrency = (amount) => {
    if (!amount) return 'Contact for details';
    return `₹${Number(amount).toLocaleString('en-IN')}`;
  };

  const formatPercentage = (value) => {
    if (!value) return 'Contact for details';
    return `${value}%`;
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Breadcrumb Navigation */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs
          separator={<NavigateNext fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ mb: 2 }}
        >
          <Link
            component="button"
            variant="body1"
            onClick={() => navigate("/")}
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "text.secondary",
              "&:hover": { color: "primary.main" },
            }}
          >
            <Home sx={{ mr: 0.5, fontSize: 20 }} />
            Home
          </Link>
          <Link
            component="button"
            variant="body1"
            onClick={() => navigate("/brands")}
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "text.secondary",
              "&:hover": { color: "primary.main" },
            }}
          >
            <Business sx={{ mr: 0.5, fontSize: 20 }} />
            Brands
          </Link>
          <Typography
            color="text.primary"
            sx={{ display: "flex", alignItems: "center", fontWeight: "medium" }}
          >
            {brand.brandName}
          </Typography>
        </Breadcrumbs>

        {/* Back Button */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/brands")}
          sx={{ mb: 2 }}
        >
          Back to All Brands
        </Button>
      </Box>

      {/* Hero Banner */}
      <MotionCard
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        sx={{ mb: 4, boxShadow: 5, borderRadius: 3, overflow: "hidden" }}
      >
        <Box
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main}20 0%, ${theme.palette.secondary.main}20 100%)`,
            p: 4
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={2}>
              <Avatar
                src={brand.brandLogo}
                alt={brand.brandName}
                sx={{
                  width: 120,
                  height: 120,
                  mx: "auto",
                  boxShadow: theme.shadows[8],
                  border: `4px solid ${theme.palette.background.paper}`
                }}
              />
            </Grid>
            <Grid item xs={12} md={7}>
              <Box>
                <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                  <Typography variant="h3" fontWeight="bold">
                    {brand.brandName}
                  </Typography>
                  {brand.verified && (
                    <Tooltip title="Verified Brand">
                      <Verified color="primary" sx={{ fontSize: 32 }} />
                    </Tooltip>
                  )}
                </Stack>

                <Stack direction="row" spacing={1} mb={2} flexWrap="wrap" useFlexGap>
                  <Chip
                    label={businessModelConfig.label || brand.businessModelType}
                    color="primary"
                    variant="filled"
                  />
                  {Array.isArray(brand.industries) ? (
                    brand.industries.slice(0, 2).map((industry, index) => (
                      <Chip
                        key={index}
                        label={industry}
                        color="secondary"
                        variant="outlined"
                      />
                    ))
                  ) : (
                    <Chip
                      label={brand.industry || 'Business'}
                      color="secondary"
                      variant="outlined"
                    />
                  )}
                  {brand.foundedYear && (
                    <Chip
                      label={`Est. ${brand.foundedYear}`}
                      variant="outlined"
                    />
                  )}
                </Stack>

                <Typography variant="body1" color="text.secondary" mb={2} sx={{ lineHeight: 1.6 }}>
                  {brand.description || brand.brandStory || 'A leading business opportunity in the industry'}
                </Typography>

                <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap" useFlexGap>
                  {brand.rating && (
                    <Box display="flex" alignItems="center">
                      <Rating value={brand.rating} readOnly size="small" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        ({brand.rating})
                      </Typography>
                    </Box>
                  )}
                  {(brand.location || brand.contactInfo?.city) && (
                    <Box display="flex" alignItems="center">
                      <LocationOn sx={{ color: 'text.secondary', mr: 0.5, fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        {brand.location || brand.contactInfo?.city}
                      </Typography>
                    </Box>
                  )}
                  {brand.establishedYear && (
                    <Box display="flex" alignItems="center">
                      <Schedule sx={{ color: 'text.secondary', mr: 0.5, fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        {new Date().getFullYear() - brand.establishedYear} years in business
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  background: `linear-gradient(135deg, ${theme.palette.success.light} 0%, ${theme.palette.success.main} 100%)`,
                  color: 'white',
                  borderRadius: 2
                }}
              >
                <Typography variant="h6" fontWeight="bold" mb={1}>
                  Investment Range
                </Typography>
                <Typography variant="h4" fontWeight="bold" mb={2}>
                  {formatCurrency(brand.brandInvestment || brand.investmentRange)}
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  size="large"
                  startIcon={<ContactPhone />}
                  onClick={() => setShowInquiryForm(true)}
                  sx={{ fontWeight: 'bold', boxShadow: theme.shadows[4] }}
                >
                  Get Details
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </MotionCard>

      {/* Image Gallery */}
      {brand.franchiseImages && brand.franchiseImages.length > 0 && (
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          sx={{ mb: 4, boxShadow: 3, borderRadius: 3, overflow: "hidden" }}
        >
          <CardContent>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              <PhotoLibrary sx={{ verticalAlign: 'middle', mr: 1 }} />
              Gallery
            </Typography>
            <Box sx={{ maxWidth: '100%', height: 400 }}>
              <Slider {...imageSliderSettings}>
                {brand.franchiseImages.map((image, index) => (
                  <Box
                    key={index}
                    sx={{
                      height: 400,
                      cursor: 'pointer',
                      '& img': {
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 2
                      }
                    }}
                    onClick={() => setSelectedImage(image)}
                  >
                    <img src={image} alt={`${brand.brandName} - Image ${index + 1}`} />
                  </Box>
                ))}
              </Slider>
            </Box>
          </CardContent>
        </MotionCard>
      )}

      {/* Main Content Tabs */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        sx={{ boxShadow: 3, borderRadius: 3, overflow: "hidden" }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minHeight: 72,
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '1rem'
              }
            }}
          >
            <Tab icon={<Info />} label="Overview" iconPosition="start" />
            <Tab icon={<AttachMoney />} label="Investment" iconPosition="start" />
            <Tab icon={<Person />} label="Requirements" iconPosition="start" />
            <Tab icon={<Support />} label="Training & Support" iconPosition="start" />
            {brand.franchiseLocations && brand.franchiseLocations.length > 0 && (
              <Tab icon={<Store />} label="Locations" iconPosition="start" />
            )}
            <Tab icon={<ContactPhone />} label="Contact" iconPosition="start" />
          </Tabs>
        </Box>

        {/* Tab Panel 0: Overview */}
        {activeTab === 0 && (
          <Box sx={{ p: 4 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} lg={8}>
                {/* Business Model Details */}
                <Card variant="outlined" sx={{ mb: 3, p: 3 }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                    Business Model: {businessModelConfig.label || brand.businessModelType}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {businessModelConfig.description || 'Business model information available on inquiry'}
                  </Typography>
                  
                  {businessModelConfig.features && (
                    <Box>
                      <Typography variant="h6" fontWeight="medium" gutterBottom>
                        Key Features:
                      </Typography>
                      <Grid container spacing={1}>
                        {businessModelConfig.features.map((feature, index) => (
                          <Grid item key={index}>
                            <Chip
                              icon={<CheckCircle />}
                              label={feature}
                              variant="outlined"
                              color="success"
                              size="small"
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}
                </Card>

                {/* Industries & Categories */}
                {brand.industries && Array.isArray(brand.industries) && brand.industries.length > 0 && (
                  <Card variant="outlined" sx={{ mb: 3, p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Industries & Categories
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {brand.industries.map((industry, index) => (
                        <Chip key={index} label={industry} variant="outlined" />
                      ))}
                    </Stack>
                  </Card>
                )}

                {/* Brand Story */}
                {brand.brandStory && (
                  <Card variant="outlined" sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Our Story
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                      {brand.brandStory}
                    </Typography>
                  </Card>
                )}
              </Grid>

              <Grid item xs={12} lg={4}>
                {/* Quick Stats */}
                <Card variant="outlined" sx={{ mb: 3, p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                    Quick Facts
                  </Typography>
                  <List dense>
                    {brand.revenueModel && (
                      <ListItem disableGutters>
                        <ListItemIcon><MonetizationOn color="primary" /></ListItemIcon>
                        <ListItemText primary="Revenue Model" secondary={brand.revenueModel} />
                      </ListItem>
                    )}
                    {brand.territoryRights && (
                      <ListItem disableGutters>
                        <ListItemIcon><Security color="primary" /></ListItemIcon>
                        <ListItemText primary="Territory Rights" secondary={brand.territoryRights} />
                      </ListItem>
                    )}
                    {brand.franchiseTermLength && (
                      <ListItem disableGutters>
                        <ListItemIcon><Schedule color="primary" /></ListItemIcon>
                        <ListItemText primary="Term Length" secondary={brand.franchiseTermLength} />
                      </ListItem>
                    )}
                    {brand.agreementType && (
                      <ListItem disableGutters>
                        <ListItemIcon><Assignment color="primary" /></ListItemIcon>
                        <ListItemText primary="Agreement Type" secondary={brand.agreementType} />
                      </ListItem>
                    )}
                  </List>
                </Card>

                {/* Social Media */}
                {(brand.contactInfo?.facebookUrl || brand.contactInfo?.instagramUrl || 
                  brand.contactInfo?.linkedinUrl || brand.contactInfo?.twitterUrl) && (
                  <Card variant="outlined" sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Follow Us
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      {brand.contactInfo?.facebookUrl && (
                        <IconButton
                          href={brand.contactInfo.facebookUrl}
                          target="_blank"
                          sx={{ color: '#1877F2' }}
                        >
                          <Facebook />
                        </IconButton>
                      )}
                      {brand.contactInfo?.instagramUrl && (
                        <IconButton
                          href={brand.contactInfo.instagramUrl}
                          target="_blank"
                          sx={{ color: '#E4405F' }}
                        >
                          <Instagram />
                        </IconButton>
                      )}
                      {brand.contactInfo?.linkedinUrl && (
                        <IconButton
                          href={brand.contactInfo.linkedinUrl}
                          target="_blank"
                          sx={{ color: '#0A66C2' }}
                        >
                          <LinkedIn />
                        </IconButton>
                      )}
                      {brand.contactInfo?.twitterUrl && (
                        <IconButton
                          href={brand.contactInfo.twitterUrl}
                          target="_blank"
                          sx={{ color: '#1DA1F2' }}
                        >
                          <Twitter />
                        </IconButton>
                      )}
                    </Stack>
                  </Card>
                )}
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Tab Panel 1: Investment & Financials */}
        {activeTab === 1 && (
          <Box sx={{ p: 4 }}>
            <Grid container spacing={4}>
              {/* Investment Breakdown */}
              <Grid item xs={12} md={6}>
                <Card sx={{ boxShadow: 3, height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom color="success.dark">
                      <AttachMoney sx={{ verticalAlign: 'middle' }} /> Investment Breakdown
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    
                    <TableContainer>
                      <Table size="small">
                        <TableBody>
                          <TableRow sx={{ bgcolor: 'success.lighter' }}>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Total Investment</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'success.dark' }}>
                              {formatCurrency(brand.brandInvestment || brand.investmentRange)}
                            </TableCell>
                          </TableRow>
                          {brand.initialFranchiseFee && (
                            <TableRow>
                              <TableCell>Initial Franchise Fee</TableCell>
                              <TableCell align="right">{formatCurrency(brand.initialFranchiseFee)}</TableCell>
                            </TableRow>
                          )}
                          {brand.securityDeposit && (
                            <TableRow>
                              <TableCell>Security Deposit</TableCell>
                              <TableCell align="right">{formatCurrency(brand.securityDeposit)}</TableCell>
                            </TableRow>
                          )}
                          {brand.workingCapital && (
                            <TableRow>
                              <TableCell>Working Capital</TableCell>
                              <TableCell align="right">{formatCurrency(brand.workingCapital)}</TableCell>
                            </TableRow>
                          )}
                          {brand.equipmentCosts && (
                            <TableRow>
                              <TableCell>Equipment Costs</TableCell>
                              <TableCell align="right">{formatCurrency(brand.equipmentCosts)}</TableCell>
                            </TableRow>
                          )}
                          {brand.realEstateCosts && (
                            <TableRow>
                              <TableCell>Real Estate Costs</TableCell>
                              <TableCell align="right">{formatCurrency(brand.realEstateCosts)}</TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>

              {/* Returns & ROI */}
              <Grid item xs={12} md={6}>
                <Card sx={{ boxShadow: 3, height: '100%', bgcolor: 'primary.lighter' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom color="primary.dark">
                      <TrendingUp sx={{ verticalAlign: 'middle' }} /> Revenue & Returns
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    
                    <Stack spacing={2}>
                      {brand.royaltyFee && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">Royalty Fee</Typography>
                          <Typography variant="h4" fontWeight="bold" color="primary.dark">
                            {formatPercentage(brand.royaltyFee)}
                          </Typography>
                        </Box>
                      )}
                      
                      {brand.marketingFee && (
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2">Marketing Fee:</Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {formatPercentage(brand.marketingFee)}
                          </Typography>
                        </Box>
                      )}
                      
                      {brand.dealerMargin && (
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2">Partner Margin:</Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {formatPercentage(brand.dealerMargin)}
                          </Typography>
                        </Box>
                      )}

                      {brand.payBackPeriod && (
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2">Payback Period:</Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {brand.payBackPeriod}
                          </Typography>
                        </Box>
                      )}

                      {brand.financingOptions && (
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>
                            Financing Options:
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {brand.financingOptions}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Tab Panel 2: Requirements */}
        {activeTab === 2 && (
          <Box sx={{ p: 4 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom color="warning.main">
                    <Person sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Partner Requirements
                  </Typography>
                  
                  <Stack spacing={3}>
                    {brand.qualification && (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>Education Required:</Typography>
                        <Chip label={brand.qualification} color="primary" />
                      </Box>
                    )}
                    
                    {brand.experienceRequired && Array.isArray(brand.experienceRequired) && (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>Experience Required:</Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {brand.experienceRequired.map((exp, index) => (
                            <Chip key={index} label={exp} size="small" variant="outlined" />
                          ))}
                        </Stack>
                      </Box>
                    )}

                    {(brand.minAge || brand.maxAge) && (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>Age Requirements:</Typography>
                        <Typography variant="body2">
                          {brand.minAge && brand.maxAge 
                            ? `${brand.minAge} - ${brand.maxAge} years`
                            : brand.minAge 
                              ? `Minimum ${brand.minAge} years`
                              : `Maximum ${brand.maxAge} years`
                          }
                        </Typography>
                      </Box>
                    )}

                    {brand.partnerCriteria && (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>Additional Requirements:</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {brand.partnerCriteria}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom color="info.main">
                    <Store sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Space & Location Requirements
                  </Typography>
                  
                  <Stack spacing={2}>
                    {brand.areaRequired && (brand.areaRequired.min || brand.areaRequired.max) && (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>Space Required:</Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {brand.areaRequired.min && brand.areaRequired.max
                            ? `${brand.areaRequired.min} - ${brand.areaRequired.max} ${brand.areaRequired.unit || 'Sq.ft'}`
                            : brand.areaRequired.min
                              ? `Minimum ${brand.areaRequired.min} ${brand.areaRequired.unit || 'Sq.ft'}`
                              : `Maximum ${brand.areaRequired.max} ${brand.areaRequired.unit || 'Sq.ft'}`
                          }
                        </Typography>
                      </Box>
                    )}
                    
                    {brand.locationPreference && (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>Location Preference:</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {brand.locationPreference}
                        </Typography>
                      </Box>
                    )}

                    {brand.displayRequirements && Array.isArray(brand.displayRequirements) && (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>Display Requirements:</Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {brand.displayRequirements.map((req, index) => (
                            <Chip key={index} label={req} size="small" color="info" variant="outlined" />
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Tab Panel 3: Training & Support */}
        {activeTab === 3 && (
          <Box sx={{ p: 4 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom color="success.main">
                    <School sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Training Program
                  </Typography>
                  
                  <Stack spacing={2}>
                    <List dense>
                      {brand.trainingDuration && (
                        <ListItem disableGutters>
                          <ListItemIcon><Schedule color="primary" /></ListItemIcon>
                          <ListItemText primary="Duration" secondary={brand.trainingDuration} />
                        </ListItem>
                      )}
                      
                      {brand.trainingLocation && (
                        <ListItem disableGutters>
                          <ListItemIcon><LocationOn color="primary" /></ListItemIcon>
                          <ListItemText primary="Location" secondary={brand.trainingLocation} />
                        </ListItem>
                      )}
                      
                      {brand.trainingCost && (
                        <ListItem disableGutters>
                          <ListItemIcon>
                            <AttachMoney color={brand.trainingCost === 'Free' ? 'success' : 'warning'} />
                          </ListItemIcon>
                          <ListItemText primary="Cost" secondary={brand.trainingCost} />
                        </ListItem>
                      )}
                    </List>

                    {brand.trainingDetails && (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>Program Details:</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {brand.trainingDetails}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                    <Support sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Ongoing Support
                  </Typography>
                  
                  <Stack spacing={3}>
                    {brand.supportTypes && Array.isArray(brand.supportTypes) && (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>Support Services:</Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {brand.supportTypes.map((support, index) => (
                            <Chip 
                              key={index} 
                              label={support} 
                              size="small" 
                              color="primary" 
                              variant="outlined" 
                            />
                          ))}
                        </Stack>
                      </Box>
                    )}

                    {brand.marketingSupport && Array.isArray(brand.marketingSupport) && (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>Marketing Support:</Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {brand.marketingSupport.map((marketing, index) => (
                            <Chip 
                              key={index} 
                              label={marketing} 
                              size="small" 
                              color="secondary" 
                              variant="outlined" 
                            />
                          ))}
                        </Stack>
                      </Box>
                    )}

                    {brand.ongoingAssistance && (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>Additional Assistance:</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {brand.ongoingAssistance}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Tab Panel: Locations */}
        {brand.franchiseLocations && brand.franchiseLocations.length > 0 && activeTab === (brand.franchiseLocations.length > 0 ? 4 : -1) && (
          <Box sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              <Store sx={{ verticalAlign: 'middle', mr: 1, color: 'primary.main' }} />
              Franchise Locations ({brand.franchiseLocations.length})
            </Typography>
            
            <Grid container spacing={3}>
              {brand.franchiseLocations.map((location, index) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <Card variant="outlined" sx={{ p: 3, height: '100%' }}>
                    <Stack spacing={2}>
                      <Box display="flex" alignItems="center">
                        <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h6" fontWeight="medium">
                          Location {index + 1}
                        </Typography>
                      </Box>
                      
                      {location.address && (
                        <Typography variant="body2" color="text.secondary">
                          {location.address}
                          {location.city && `, ${location.city}`}
                          {location.state && `, ${location.state}`}
                          {location.zipCode && ` - ${location.zipCode}`}
                        </Typography>
                      )}
                      
                      {location.phone && (
                        <Box display="flex" alignItems="center">
                          <Phone sx={{ mr: 1, color: 'text.secondary', fontSize: 18 }} />
                          <Typography variant="body2">{location.phone}</Typography>
                        </Box>
                      )}
                      
                      {location.googleMapsUrl && (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Map />}
                          endIcon={<Launch />}
                          href={location.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ alignSelf: 'flex-start' }}
                        >
                          View on Map
                        </Button>
                      )}
                    </Stack>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Tab Panel: Contact */}
        {activeTab === (brand.franchiseLocations && brand.franchiseLocations.length > 0 ? 5 : 4) && (
          <Box sx={{ p: 4 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Card variant="outlined" sx={{ p: 4 }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom color="info.main">
                    <ContactPhone sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Contact Information
                  </Typography>
                  
                  <Grid container spacing={3}>
                    {brand.contactInfo?.phone && (
                      <Grid item xs={12} sm={6}>
                        <Box display="flex" alignItems="center">
                          <Phone sx={{ mr: 2, color: 'primary.main' }} />
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                            <Typography variant="h6" fontWeight="medium">
                              {brand.contactInfo.phone}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    )}
                    
                    {brand.contactInfo?.email && (
                      <Grid item xs={12} sm={6}>
                        <Box display="flex" alignItems="center">
                          <Email sx={{ mr: 2, color: 'primary.main' }} />
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                            <Typography variant="h6" fontWeight="medium">
                              {brand.contactInfo.email}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    )}
                    
                    {(brand.contactInfo?.address || brand.contactInfo?.city) && (
                      <Grid item xs={12}>
                        <Box display="flex" alignItems="flex-start">
                          <LocationOn sx={{ mr: 2, color: 'primary.main', mt: 0.5 }} />
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {brand.contactInfo?.address}
                              {brand.contactInfo?.city && (brand.contactInfo?.address ? `, ${brand.contactInfo.city}` : brand.contactInfo.city)}
                              {brand.contactInfo?.state && `, ${brand.contactInfo.state}`}
                              {brand.contactInfo?.zipCode && ` - ${brand.contactInfo.zipCode}`}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    )}
                    
                    {brand.contactInfo?.website && (
                      <Grid item xs={12}>
                        <Box display="flex" alignItems="center">
                          <Language sx={{ mr: 2, color: 'primary.main' }} />
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">Website</Typography>
                            <Link href={brand.contactInfo.website} target="_blank" rel="noopener" variant="h6" sx={{ fontWeight: 'medium' }}>
                              {brand.contactInfo.website}
                            </Link>
                          </Box>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ p: 4, textAlign: 'center', height: 'fit-content' }}>
                  <ContactPhone sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Ready to Start?
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    Get detailed information and connect with us to explore this opportunity.
                  </Typography>
                  <Stack spacing={2}>
                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      startIcon={<Assignment />}
                      onClick={() => setShowInquiryForm(true)}
                    >
                      Send Inquiry
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      fullWidth
                      startIcon={<Schedule />}
                    >
                      Schedule Call
                    </Button>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </MotionCard>

      {/* Image Dialog */}
      <Dialog
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            onClick={() => setSelectedImage(null)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.5)',
              zIndex: 1,
              '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
            }}
          >
            <Close />
          </IconButton>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Brand Image"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block'
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Inquiry Form Dialog */}
      <FranchiseInquiryForm
        open={showInquiryForm}
        onClose={() => setShowInquiryForm(false)}
        brand={brand}
      />
    </Container>
  );
};

export default BrandDetail;