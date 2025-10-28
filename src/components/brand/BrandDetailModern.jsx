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
  Badge,
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
  ExpandMore,
  AccountBalance,
  GroupWork,
  Timeline,
  Security,
  EmojiEvents,
  Handshake,
  Business as BusinessIcon,
  Person,
  AccessTime,
  Place,
  Gavel,
  Assignment,
  MonetizationOn,
  VerifiedUser,
  LocalOffer,
  ContactPhone,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useBrand } from "../../hooks/useBrand";
import { BUSINESS_MODEL_TYPES } from "../../constants/businessModels";
import InquiryForm from "../forms/InquiryForm";

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const BrandDetailModern = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { brand, loading, error } = useBrand({ slug });
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [expandedSection, setExpandedSection] = useState('overview');
  const theme = useTheme();

  const handleSectionChange = useCallback((panel) => (event, isExpanded) => {
    setExpandedSection(isExpanded ? panel : false);
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
        <Typography variant="h4" color="error" textAlign="center">
          Brand not found or error loading data
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate("/brands")}
          sx={{ mt: 2, display: "block", mx: "auto" }}
        >
          Back to Brands
        </Button>
      </Container>
    );
  }

  // Get business model configuration
  const businessModelConfig = BUSINESS_MODEL_TYPES[brand.businessModelType] || {};

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
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
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
        <Typography color="text.primary" sx={{ fontWeight: "medium" }}>
          {brand.brandName}
        </Typography>
      </Breadcrumbs>

      {/* Back Button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate("/brands")}
        variant="outlined"
        sx={{ mb: 3 }}
      >
        Back to All Brands
      </Button>

      {/* Hero Section */}
      <MotionCard
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        sx={{ 
          mb: 4, 
          background: `linear-gradient(135deg, ${theme.palette.primary.main}20 0%, ${theme.palette.secondary.main}20 100%)`,
          borderRadius: 4,
          overflow: "hidden"
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={3}>
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
            <Grid item xs={12} md={6}>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                {brand.brandName}
              </Typography>
              <Stack direction="row" spacing={1} mb={2}>
                <Chip 
                  label={businessModelConfig.label || brand.businessModelType} 
                  color="primary" 
                  variant="filled"
                />
                <Chip 
                  label={brand.industry || 'Business'} 
                  color="secondary" 
                  variant="outlined"
                />
                {brand.establishedYear && (
                  <Chip 
                    label={`Est. ${brand.establishedYear}`} 
                    variant="outlined"
                  />
                )}
              </Stack>
              <Typography variant="body1" color="text.secondary" mb={2}>
                {brand.description || brand.brandStory || 'No description available'}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                {brand.rating && (
                  <Box display="flex" alignItems="center">
                    <Star sx={{ color: '#ffc107', mr: 0.5 }} />
                    <Typography variant="h6" fontWeight="bold">
                      {brand.rating}
                    </Typography>
                  </Box>
                )}
                {brand.location && (
                  <Box display="flex" alignItems="center">
                    <LocationOn sx={{ color: 'text.secondary', mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {brand.location}
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
                  background: `linear-gradient(135deg, ${theme.palette.success.light} 0%, ${theme.palette.success.main} 100%)`,
                  color: 'white'
                }}
              >
                <Typography variant="h6" fontWeight="bold" mb={1}>
                  Total Investment
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {formatCurrency(brand.brandInvestment || brand.investmentRange)}
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  startIcon={<ContactPhone />}
                  onClick={() => setShowInquiryForm(true)}
                  sx={{ mt: 2 }}
                >
                  Get Details
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </MotionCard>

      {/* Content Sections */}
      <Grid container spacing={4}>
        <Grid item xs={12}>
          {/* Business Overview */}
          <Accordion 
            expanded={expandedSection === 'overview'} 
            onChange={handleSectionChange('overview')}
            sx={{ mb: 2 }}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display="flex" alignItems="center">
                <BusinessIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6" fontWeight="bold">
                  Business Overview
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Business Model: {businessModelConfig.label || brand.businessModelType}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {businessModelConfig.description}
                    </Typography>
                    
                    {brand.industries && Array.isArray(brand.industries) && (
                      <Box mb={2}>
                        <Typography variant="subtitle2" gutterBottom>
                          Industries:
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {brand.industries.map((industry, index) => (
                            <Chip key={index} label={industry} size="small" variant="outlined" />
                          ))}
                        </Stack>
                      </Box>
                    )}

                    {brand.businessHighlights && (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Key Highlights:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {brand.businessHighlights}
                        </Typography>
                      </Box>
                    )}
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Partnership Terms
                    </Typography>
                    
                    {brand.revenueModel && (
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">Revenue Model:</Typography>
                        <Chip label={brand.revenueModel} size="small" color="primary" />
                      </Box>
                    )}
                    
                    {brand.territoryRights && (
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">Territory Rights:</Typography>
                        <Chip label={brand.territoryRights} size="small" color="secondary" />
                      </Box>
                    )}
                    
                    {brand.franchiseTermLength && (
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">Partnership Term:</Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {brand.franchiseTermLength}
                        </Typography>
                      </Box>
                    )}
                    
                    {brand.agreementType && (
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">Agreement Type:</Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {brand.agreementType}
                        </Typography>
                      </Box>
                    )}

                    {brand.renewalTerms && (
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">Renewal Terms:</Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {brand.renewalTerms}
                        </Typography>
                      </Box>
                    )}
                  </Card>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Financial Details */}
          <Accordion 
            expanded={expandedSection === 'financials'} 
            onChange={handleSectionChange('financials')}
            sx={{ mb: 2 }}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display="flex" alignItems="center">
                <MonetizationOn sx={{ mr: 2, color: 'success.main' }} />
                <Typography variant="h6" fontWeight="bold">
                  Financial Details
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom color="success.main">
                      <AttachMoney sx={{ verticalAlign: 'middle', mr: 1 }} />
                      Investment Breakdown
                    </Typography>
                    <Stack spacing={2}>
                      <Box display="flex" justifyContent="space-between" sx={{ p: 1, bgcolor: 'success.lighter', borderRadius: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Total Investment:
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" color="success.dark">
                          {formatCurrency(brand.brandInvestment || brand.investmentRange)}
                        </Typography>
                      </Box>
                      
                      {brand.initialFranchiseFee && (
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2">Initial Franchise Fee:</Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {formatCurrency(brand.initialFranchiseFee)}
                          </Typography>
                        </Box>
                      )}
                      
                      {brand.workingCapital && (
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2">Working Capital:</Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {formatCurrency(brand.workingCapital)}
                          </Typography>
                        </Box>
                      )}
                      
                      {brand.equipmentCosts && (
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2">Equipment Costs:</Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {formatCurrency(brand.equipmentCosts)}
                          </Typography>
                        </Box>
                      )}
                      
                      {brand.realEstateCosts && (
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2">Real Estate Costs:</Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {formatCurrency(brand.realEstateCosts)}
                          </Typography>
                        </Box>
                      )}
                      
                      {brand.securityDeposit && (
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2">Security Deposit:</Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {formatCurrency(brand.securityDeposit)}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom color="primary">
                      <TrendingUp sx={{ verticalAlign: 'middle', mr: 1 }} />
                      Revenue & Returns
                    </Typography>
                    <Stack spacing={2}>
                      {brand.royaltyFee && (
                        <Box display="flex" justifyContent="space-between" sx={{ p: 1, bgcolor: 'primary.lighter', borderRadius: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Royalty Fee:
                          </Typography>
                          <Typography variant="h6" fontWeight="bold" color="primary.dark">
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
                      
                      {brand.averageRevenue && (
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2">Average Revenue:</Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {formatCurrency(brand.averageRevenue)}
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
                  </Card>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Partner Requirements */}
          <Accordion 
            expanded={expandedSection === 'requirements'} 
            onChange={handleSectionChange('requirements')}
            sx={{ mb: 2 }}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display="flex" alignItems="center">
                <Person sx={{ mr: 2, color: 'warning.main' }} />
                <Typography variant="h6" fontWeight="bold">
                  Partner Requirements
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom color="warning.main">
                      <School sx={{ verticalAlign: 'middle', mr: 1 }} />
                      Qualifications & Experience
                    </Typography>
                    
                    {brand.qualification && (
                      <Box mb={2}>
                        <Typography variant="subtitle2" gutterBottom>
                          Education Required:
                        </Typography>
                        <Chip label={brand.qualification} color="primary" variant="outlined" />
                      </Box>
                    )}
                    
                    {brand.experienceRequired && Array.isArray(brand.experienceRequired) && (
                      <Box mb={2}>
                        <Typography variant="subtitle2" gutterBottom>
                          Experience Required:
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {brand.experienceRequired.map((exp, index) => (
                            <Chip key={index} label={exp} size="small" variant="outlined" />
                          ))}
                        </Stack>
                      </Box>
                    )}

                    {(brand.minAge || brand.maxAge) && (
                      <Box mb={2}>
                        <Typography variant="subtitle2" gutterBottom>
                          Age Requirements:
                        </Typography>
                        <Typography variant="body2">
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

                    {brand.partnerCriteria && (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Additional Requirements:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {brand.partnerCriteria}
                        </Typography>
                      </Box>
                    )}
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom color="info.main">
                      <Place sx={{ verticalAlign: 'middle', mr: 1 }} />
                      Space & Location
                    </Typography>
                    
                    {brand.areaRequired && (
                      <Box mb={2}>
                        <Typography variant="subtitle2" gutterBottom>
                          Space Required:
                        </Typography>
                        <Typography variant="body2">
                          {brand.areaRequired.min && brand.areaRequired.max
                            ? `${brand.areaRequired.min} - ${brand.areaRequired.max} ${brand.areaRequired.unit || 'Sq.ft'}`
                            : 'As per business needs'
                          }
                        </Typography>
                      </Box>
                    )}
                    
                    {brand.locationPreference && (
                      <Box mb={2}>
                        <Typography variant="subtitle2" gutterBottom>
                          Location Preference:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {brand.locationPreference}
                        </Typography>
                      </Box>
                    )}

                    {brand.displayRequirements && Array.isArray(brand.displayRequirements) && (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Display Requirements:
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {brand.displayRequirements.map((req, index) => (
                            <Chip key={index} label={req} size="small" color="info" variant="outlined" />
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </Card>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Training & Support */}
          <Accordion 
            expanded={expandedSection === 'training'} 
            onChange={handleSectionChange('training')}
            sx={{ mb: 2 }}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display="flex" alignItems="center">
                <Support sx={{ mr: 2, color: 'success.main' }} />
                <Typography variant="h6" fontWeight="bold">
                  Training & Support
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom color="success.main">
                      <School sx={{ verticalAlign: 'middle', mr: 1 }} />
                      Training Program
                    </Typography>
                    
                    {brand.trainingDuration && (
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">Duration:</Typography>
                        <Chip label={brand.trainingDuration} size="small" color="primary" />
                      </Box>
                    )}
                    
                    {brand.trainingLocation && (
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">Location:</Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {brand.trainingLocation}
                        </Typography>
                      </Box>
                    )}
                    
                    {brand.trainingCost && (
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">Cost:</Typography>
                        <Chip 
                          label={brand.trainingCost} 
                          size="small" 
                          color={brand.trainingCost === 'Free' ? 'success' : 'warning'} 
                        />
                      </Box>
                    )}

                    {brand.trainingDetails && (
                      <Box mt={2}>
                        <Typography variant="subtitle2" gutterBottom>
                          Program Details:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {brand.trainingDetails}
                        </Typography>
                      </Box>
                    )}
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom color="primary">
                      <Support sx={{ verticalAlign: 'middle', mr: 1 }} />
                      Ongoing Support
                    </Typography>
                    
                    {brand.supportTypes && Array.isArray(brand.supportTypes) && (
                      <Box mb={2}>
                        <Typography variant="subtitle2" gutterBottom>
                          Support Services:
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
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
                      <Box mb={2}>
                        <Typography variant="subtitle2" gutterBottom>
                          Marketing Support:
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
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
                        <Typography variant="subtitle2" gutterBottom>
                          Additional Assistance:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {brand.ongoingAssistance}
                        </Typography>
                      </Box>
                    )}
                  </Card>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Legal & Compliance */}
          {(brand.legalCompliance || brand.agreementType || brand.renewalTerms) && (
            <Accordion 
              expanded={expandedSection === 'legal'} 
              onChange={handleSectionChange('legal')}
              sx={{ mb: 2 }}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box display="flex" alignItems="center">
                  <Gavel sx={{ mr: 2, color: 'error.main' }} />
                  <Typography variant="h6" fontWeight="bold">
                    Legal & Compliance
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Card variant="outlined" sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      {brand.agreementType && (
                        <Box mb={2}>
                          <Typography variant="subtitle2" gutterBottom>
                            Agreement Type:
                          </Typography>
                          <Chip label={brand.agreementType} color="primary" />
                        </Box>
                      )}
                      
                      {brand.renewalTerms && (
                        <Box mb={2}>
                          <Typography variant="subtitle2" gutterBottom>
                            Renewal Terms:
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {brand.renewalTerms}
                          </Typography>
                        </Box>
                      )}
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      {brand.legalCompliance && (
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>
                            Legal Requirements:
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {brand.legalCompliance}
                          </Typography>
                        </Box>
                      )}
                    </Grid>
                  </Grid>
                </Card>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Contact Information */}
          <Accordion 
            expanded={expandedSection === 'contact'} 
            onChange={handleSectionChange('contact')}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display="flex" alignItems="center">
                <ContactPhone sx={{ mr: 2, color: 'info.main' }} />
                <Typography variant="h6" fontWeight="bold">
                  Contact Information
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom color="info.main">
                      Get in Touch
                    </Typography>
                    
                    <Stack spacing={2}>
                      {brand.contactInfo?.phone && (
                        <Box display="flex" alignItems="center">
                          <Phone sx={{ mr: 2, color: 'text.secondary' }} />
                          <Typography variant="body1">
                            {brand.contactInfo.phone}
                          </Typography>
                        </Box>
                      )}
                      
                      {brand.contactInfo?.email && (
                        <Box display="flex" alignItems="center">
                          <Email sx={{ mr: 2, color: 'text.secondary' }} />
                          <Typography variant="body1">
                            {brand.contactInfo.email}
                          </Typography>
                        </Box>
                      )}
                      
                      {brand.contactInfo?.address && (
                        <Box display="flex" alignItems="flex-start">
                          <LocationOn sx={{ mr: 2, color: 'text.secondary', mt: 0.5 }} />
                          <Typography variant="body1">
                            {brand.contactInfo.address}
                          </Typography>
                        </Box>
                      )}
                      
                      {brand.website && (
                        <Box display="flex" alignItems="center">
                          <Business sx={{ mr: 2, color: 'text.secondary' }} />
                          <Link href={brand.website} target="_blank" rel="noopener">
                            {brand.website}
                          </Link>
                        </Box>
                      )}
                    </Stack>

                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      startIcon={<ContactPhone />}
                      onClick={() => setShowInquiryForm(true)}
                      sx={{ mt: 3 }}
                    >
                      Send Inquiry
                    </Button>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  {/* You can add a map or additional contact methods here */}
                  <Card variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                      Ready to Start?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={3}>
                      Take the next step towards your business opportunity
                    </Typography>
                    <Stack spacing={2}>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<Assignment />}
                        onClick={() => setShowInquiryForm(true)}
                      >
                        Request Information
                      </Button>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<Schedule />}
                      >
                        Schedule Call
                      </Button>
                    </Stack>
                  </Card>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>

      {/* Inquiry Form Dialog */}
      <InquiryForm
        open={showInquiryForm}
        onClose={() => setShowInquiryForm(false)}
        brand={brand}
      />
    </Container>
  );
};

export default BrandDetailModern;