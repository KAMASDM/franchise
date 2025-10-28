import React, { useState, useCallback } from "react";
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
  Paper,
  CircularProgress,
  Divider,
  Avatar,
  useTheme,
  Stack,
  Breadcrumbs,
  Link,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  IconButton,
  Tooltip,
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
  ArrowBack,
  AccountBalance,
  Person,
  Place,
  Assignment,
  MonetizationOn,
  ContactPhone,
  Facebook,
  Instagram,
  Twitter,
  LinkedIn,
  Map,
  Store,
  Launch,
  Info,
  Timeline,
  Gavel,
  VerifiedUser,
  LocalOffer,
  Handshake,
  WorkOutline,
  GroupWork,
  Security,
  CheckCircle,
  Language,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { BUSINESS_MODEL_TYPES, BUSINESS_MODEL_CONFIG } from "../../constants/businessModels";
import { useBrand } from "../../hooks/useBrand";
import FranchiseInquiryForm from "../forms/FranchiseInquiryForm";

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`brand-tabpanel-${index}`}
    aria-labelledby={`brand-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const BrandDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { brand, loading, error } = useBrand({ slug });
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();

  const handleTabChange = useCallback((event, newValue) => {
    setActiveTab(newValue);
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !brand) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Brand not found or error loading data
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate("/brands")}
        >
          Back to Brands
        </Button>
      </Container>
    );
  }

  // Get business model configuration
  const businessModelConfig = BUSINESS_MODEL_CONFIG[brand.businessModelType] || {};

  // Helper function to format currency
  const formatCurrency = (amount) => {
    if (!amount) return 'Not specified';
    return `₹${Number(amount).toLocaleString('en-IN')}`;
  };

  // Helper function to format percentage
  const formatPercentage = (value) => {
    if (!value) return 'Not specified';
    return `${value}%`;
  };

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate("/")}
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "text.secondary",
              "&:hover": { color: "primary.main" },
            }}
          >
            <Home sx={{ mr: 0.5, fontSize: 18 }} />
            Home
          </Link>
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate("/brands")}
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "text.secondary",
              "&:hover": { color: "primary.main" },
            }}
          >
            <Business sx={{ mr: 0.5, fontSize: 18 }} />
            Brands
          </Link>
          <Typography variant="body2" color="text.primary" sx={{ fontWeight: "medium" }}>
            {brand.brandName}
          </Typography>
        </Breadcrumbs>

        {/* Back Button */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/brands")}
          variant="text"
          sx={{ mb: 3, color: 'text.secondary' }}
        >
          Back to All Brands
        </Button>

        {/* Hero Section */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          elevation={0}
          sx={{ 
            mb: 3,
            borderRadius: 3,
            overflow: "hidden",
            border: `1px solid ${theme.palette.grey[200]}`
          }}
        >
          <Box
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
              p: { xs: 3, md: 4 }
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={2}>
                <Avatar
                  src={brand.brandLogo}
                  alt={brand.brandName}
                  sx={{ 
                    width: { xs: 80, md: 100 }, 
                    height: { xs: 80, md: 100 }, 
                    mx: { xs: 'auto', md: 0 },
                    boxShadow: theme.shadows[4],
                    border: `3px solid ${theme.palette.background.paper}`
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={7}>
                <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '2rem', md: '2.5rem' } }}>
                  {brand.brandName}
                </Typography>
                
                <Stack direction="row" spacing={1} mb={2} flexWrap="wrap" useFlexGap>
                  <Chip 
                    label={businessModelConfig.label || brand.businessModelType} 
                    color="primary" 
                    size="medium"
                  />
                  <Chip 
                    label={brand.industry || Array.isArray(brand.industries) ? brand.industries[0] : 'Business'} 
                    color="secondary" 
                    variant="outlined"
                    size="medium"
                  />
                  {brand.establishedYear && (
                    <Chip 
                      label={`Est. ${brand.establishedYear}`} 
                      variant="outlined"
                      size="medium"
                    />
                  )}
                </Stack>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                  {typeof (brand.description || brand.brandStory) === 'string' 
                    ? (brand.description || brand.brandStory) 
                    : 'A leading business opportunity in the industry'}
                </Typography>

                <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap" useFlexGap>
                  {brand.rating && (
                    <Box display="flex" alignItems="center">
                      <Star sx={{ color: '#ffc107', mr: 0.5 }} />
                      <Typography variant="subtitle1" fontWeight="medium">
                        {brand.rating} Rating
                      </Typography>
                    </Box>
                  )}
                  
                  {(brand.location || brand.contactInfo?.city) && (
                    <Box display="flex" alignItems="center">
                      <LocationOn sx={{ color: 'text.secondary', mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {brand.location || brand.contactInfo?.city}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Paper
                  elevation={3}
                  sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                    color: 'white',
                    borderRadius: 2
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="medium" mb={1} sx={{ opacity: 0.9 }}>
                    Total Investment
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
                    sx={{ 
                      fontWeight: 'bold',
                      boxShadow: theme.shadows[4]
                    }}
                  >
                    Get Details
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </MotionCard>

        {/* Tabs Section */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          elevation={0}
          sx={{ 
            borderRadius: 3,
            border: `1px solid ${theme.palette.grey[200]}`
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              variant="scrollable"
              scrollButtons="auto"
              sx={{ px: 2 }}
            >
              <Tab icon={<Info />} label="Overview" iconPosition="start" />
              <Tab icon={<AttachMoney />} label="Investment" iconPosition="start" />
              <Tab icon={<Person />} label="Requirements" iconPosition="start" />
              <Tab icon={<Support />} label="Training & Support" iconPosition="start" />
              <Tab icon={<Store />} label="Locations" iconPosition="start" />
              <Tab icon={<ContactPhone />} label="Contact" iconPosition="start" />
            </Tabs>
          </Box>

          {/* Tab Panel 0: Overview */}
          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                    Business Overview
                  </Typography>
                  
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="h6" fontWeight="medium" gutterBottom>
                        Business Model: {businessModelConfig.label || brand.businessModelType}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {businessModelConfig.description || 'Business model information not available'}
                      </Typography>
                    </Box>

                    {brand.industries && Array.isArray(brand.industries) && brand.industries.length > 0 && (
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                          Industries
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {brand.industries.map((industry, index) => (
                            <Chip key={index} label={industry} size="small" variant="outlined" />
                          ))}
                        </Stack>
                      </Box>
                    )}

                    {typeof brand.businessHighlights === 'string' && brand.businessHighlights && (
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                          Key Highlights
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {brand.businessHighlights}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ p: 3, borderRadius: 2, height: 'fit-content' }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                    Quick Facts
                  </Typography>
                  
                  <List dense>
                    {brand.revenueModel && (
                      <ListItem disableGutters>
                        <ListItemIcon><MonetizationOn color="primary" fontSize="small" /></ListItemIcon>
                        <ListItemText 
                          primary="Revenue Model" 
                          secondary={brand.revenueModel}
                        />
                      </ListItem>
                    )}
                    
                    {brand.territoryRights && (
                      <ListItem disableGutters>
                        <ListItemIcon><Security color="primary" fontSize="small" /></ListItemIcon>
                        <ListItemText 
                          primary="Territory Rights" 
                          secondary={brand.territoryRights}
                        />
                      </ListItem>
                    )}
                    
                    {brand.franchiseTermLength && (
                      <ListItem disableGutters>
                        <ListItemIcon><Schedule color="primary" fontSize="small" /></ListItemIcon>
                        <ListItemText 
                          primary="Term Length" 
                          secondary={brand.franchiseTermLength}
                        />
                      </ListItem>
                    )}
                  </List>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Tab Panel 1: Investment */}
          <TabPanel value={activeTab} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom color="success.main">
                    <AttachMoney sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Investment Breakdown
                  </Typography>
                  
                  <Stack spacing={2}>
                    <Box 
                      display="flex" 
                      justifyContent="space-between" 
                      alignItems="center"
                      sx={{ p: 2, bgcolor: 'success.lighter', borderRadius: 1 }}
                    >
                      <Typography variant="h6" fontWeight="bold">
                        Total Investment:
                      </Typography>
                      <Typography variant="h5" fontWeight="bold" color="success.dark">
                        {formatCurrency(brand.brandInvestment || brand.investmentRange)}
                      </Typography>
                    </Box>
                    
                    {[
                      { label: 'Initial Franchise Fee', value: brand.initialFranchiseFee },
                      { label: 'Working Capital', value: brand.workingCapital },
                      { label: 'Equipment Costs', value: brand.equipmentCosts },
                      { label: 'Real Estate Costs', value: brand.realEstateCosts },
                      { label: 'Security Deposit', value: brand.securityDeposit }
                    ].map((item, index) => (
                      item.value && (
                        <Box key={index} display="flex" justifyContent="space-between" py={1}>
                          <Typography variant="body1">{item.label}:</Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {formatCurrency(item.value)}
                          </Typography>
                        </Box>
                      )
                    ))}
                  </Stack>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                    <TrendingUp sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Revenue & Returns
                  </Typography>
                  
                  <Stack spacing={2}>
                    {brand.royaltyFee && (
                      <Box 
                        display="flex" 
                        justifyContent="space-between" 
                        alignItems="center"
                        sx={{ p: 2, bgcolor: 'primary.lighter', borderRadius: 1 }}
                      >
                        <Typography variant="subtitle1" fontWeight="bold">
                          Royalty Fee:
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" color="primary.dark">
                          {formatPercentage(brand.royaltyFee)}
                        </Typography>
                      </Box>
                    )}
                    
                    {[
                      { label: 'Marketing Fee', value: brand.marketingFee, format: 'percentage' },
                      { label: 'Partner Margin', value: brand.dealerMargin, format: 'percentage' },
                      { label: 'Payback Period', value: brand.payBackPeriod, format: 'text' },
                      { label: 'Average Revenue', value: brand.averageRevenue, format: 'currency' }
                    ].map((item, index) => (
                      item.value && (
                        <Box key={index} display="flex" justifyContent="space-between" py={1}>
                          <Typography variant="body1">{item.label}:</Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {item.format === 'percentage' ? formatPercentage(item.value) :
                             item.format === 'currency' ? formatCurrency(item.value) : item.value}
                          </Typography>
                        </Box>
                      )
                    ))}

                    {typeof brand.financingOptions === 'string' && brand.financingOptions && (
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                          Financing Options:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {brand.financingOptions}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Tab Panel 2: Requirements */}
          <TabPanel value={activeTab} index={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom color="warning.main">
                    <Person sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Partner Requirements
                  </Typography>
                  
                  <Stack spacing={3}>
                    {brand.qualification && (
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                          Education Required:
                        </Typography>
                        <Chip label={brand.qualification} color="primary" />
                      </Box>
                    )}
                    
                    {brand.experienceRequired && Array.isArray(brand.experienceRequired) && (
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                          Experience Required:
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {brand.experienceRequired.map((exp, index) => (
                            <Chip key={index} label={exp} size="small" variant="outlined" />
                          ))}
                        </Stack>
                      </Box>
                    )}

                    {(brand.minAge || brand.maxAge) && (
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                          Age Requirements:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {brand.minAge && brand.maxAge 
                            ? `${brand.minAge} - ${brand.maxAge} years`
                            : brand.minAge 
                              ? `Minimum ${brand.minAge} years`
                              : brand.maxAge 
                                ? `Maximum ${brand.maxAge} years`
                                : 'No specific age requirement'
                          }
                        </Typography>
                      </Box>
                    )}

                    {typeof brand.partnerCriteria === 'string' && brand.partnerCriteria && (
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                          Additional Requirements:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {brand.partnerCriteria}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom color="info.main">
                    <Place sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Space & Location
                  </Typography>
                  
                  <Stack spacing={2}>
                    {brand.areaRequired && (brand.areaRequired.min || brand.areaRequired.max) && (
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                          Space Required:
                        </Typography>
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
                        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                          Location Preference:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {brand.locationPreference}
                        </Typography>
                      </Box>
                    )}

                    {brand.displayRequirements && Array.isArray(brand.displayRequirements) && (
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                          Display Requirements:
                        </Typography>
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
          </TabPanel>

          {/* Tab Panel 3: Training & Support */}
          <TabPanel value={activeTab} index={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom color="success.main">
                    <School sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Training Program
                  </Typography>
                  
                  <Stack spacing={2}>
                    <List dense>
                      {brand.trainingDuration && (
                        <ListItem disableGutters>
                          <ListItemIcon><Schedule color="primary" fontSize="small" /></ListItemIcon>
                          <ListItemText primary="Duration" secondary={brand.trainingDuration} />
                        </ListItem>
                      )}
                      
                      {brand.trainingLocation && (
                        <ListItem disableGutters>
                          <ListItemIcon><Place color="primary" fontSize="small" /></ListItemIcon>
                          <ListItemText primary="Location" secondary={brand.trainingLocation} />
                        </ListItem>
                      )}
                      
                      {brand.trainingCost && (
                        <ListItem disableGutters>
                          <ListItemIcon>
                            <AttachMoney 
                              color={brand.trainingCost === 'Free' ? 'success' : 'warning'} 
                              fontSize="small" 
                            />
                          </ListItemIcon>
                          <ListItemText primary="Cost" secondary={brand.trainingCost} />
                        </ListItem>
                      )}
                    </List>

                    {typeof brand.trainingDetails === 'string' && brand.trainingDetails && (
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                          Program Details:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {brand.trainingDetails}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                    <Support sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Ongoing Support
                  </Typography>
                  
                  <Stack spacing={3}>
                    {brand.supportTypes && Array.isArray(brand.supportTypes) && (
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                          Support Services:
                        </Typography>
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
                        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                          Marketing Support:
                        </Typography>
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

                    {typeof brand.ongoingAssistance === 'string' && brand.ongoingAssistance && (
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                          Additional Assistance:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {brand.ongoingAssistance}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Tab Panel 4: Locations */}
          <TabPanel value={activeTab} index={4}>
            {brand.franchiseLocations && brand.franchiseLocations.length > 0 ? (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    <Store sx={{ verticalAlign: 'middle', mr: 1, color: 'primary.main' }} />
                    Franchise Locations ({brand.franchiseLocations.length})
                  </Typography>
                </Grid>
                
                {brand.franchiseLocations.map((location, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
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
                            <Typography variant="body2">
                              {location.phone}
                            </Typography>
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
            ) : (
              <Box textAlign="center" py={6}>
                <Store sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Locations Listed
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Location information will be provided upon inquiry
                </Typography>
              </Box>
            )}
          </TabPanel>

          {/* Tab Panel 5: Contact */}
          <TabPanel value={activeTab} index={5}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom color="info.main">
                    <ContactPhone sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Contact Information
                  </Typography>
                  
                  <Stack spacing={3}>
                    {brand.contactInfo?.phone && (
                      <Box display="flex" alignItems="center">
                        <Phone sx={{ mr: 2, color: 'primary.main' }} />
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {brand.contactInfo.phone}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                    
                    {brand.contactInfo?.email && (
                      <Box display="flex" alignItems="center">
                        <Email sx={{ mr: 2, color: 'primary.main' }} />
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {brand.contactInfo.email}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                    
                    {(brand.contactInfo?.address || brand.contactInfo?.city) && (
                      <Box display="flex" alignItems="flex-start">
                        <LocationOn sx={{ mr: 2, color: 'primary.main', mt: 0.5 }} />
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {brand.contactInfo?.address || ''}
                            {brand.contactInfo?.city && (brand.contactInfo?.address ? `, ${brand.contactInfo.city}` : brand.contactInfo.city)}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                    
                    {brand.contactInfo?.website && (
                      <Box display="flex" alignItems="center">
                        <Language sx={{ mr: 2, color: 'primary.main' }} />
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">Website</Typography>
                          <Link href={brand.contactInfo.website} target="_blank" rel="noopener" sx={{ fontWeight: 'medium' }}>
                            {brand.contactInfo.website}
                          </Link>
                        </Box>
                      </Box>
                    )}

                    {/* Social Media Links */}
                    {(brand.contactInfo?.facebookUrl || 
                      brand.contactInfo?.instagramUrl || 
                      brand.contactInfo?.linkedinUrl || 
                      brand.contactInfo?.twitterUrl) && (
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                          Follow Us:
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {brand.contactInfo?.facebookUrl && (
                            <Tooltip title="Facebook">
                              <IconButton
                                href={brand.contactInfo.facebookUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ color: '#1877F2' }}
                              >
                                <Facebook />
                              </IconButton>
                            </Tooltip>
                          )}
                          
                          {brand.contactInfo?.instagramUrl && (
                            <Tooltip title="Instagram">
                              <IconButton
                                href={brand.contactInfo.instagramUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ color: '#E4405F' }}
                              >
                                <Instagram />
                              </IconButton>
                            </Tooltip>
                          )}
                          
                          {brand.contactInfo?.linkedinUrl && (
                            <Tooltip title="LinkedIn">
                              <IconButton
                                href={brand.contactInfo.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ color: '#0A66C2' }}
                              >
                                <LinkedIn />
                              </IconButton>
                            </Tooltip>
                          )}
                          
                          {brand.contactInfo?.twitterUrl && (
                            <Tooltip title="Twitter">
                              <IconButton
                                href={brand.contactInfo.twitterUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ color: '#1DA1F2' }}
                              >
                                <Twitter />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      </Box>
                    )}
                  </Stack>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ p: 4, borderRadius: 2, textAlign: 'center', height: 'fit-content' }}>
                  <ContactPhone sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Ready to Start?
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    Take the next step towards your business opportunity. Get detailed information and connect with us.
                  </Typography>
                  <Stack spacing={2}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<Assignment />}
                      onClick={() => setShowInquiryForm(true)}
                      fullWidth
                    >
                      Send Inquiry
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<Schedule />}
                      fullWidth
                    >
                      Schedule Call
                    </Button>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
        </MotionCard>
      </Container>

      {/* Inquiry Form Dialog */}
      <FranchiseInquiryForm
        open={showInquiryForm}
        onClose={() => setShowInquiryForm(false)}
        brand={brand}
      />
    </Box>
  );
};

export default BrandDetail;