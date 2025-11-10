import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SEO, { generateBrandStructuredData, generateBreadcrumbStructuredData } from "../common/SEO";
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
  Dialog,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListItemIcon, // Import ListItemIcon
  Avatar, // Import Avatar
  useTheme,
  Link, // Import Link
  Stack,
  Tooltip,
} from "@mui/material";
import {
  LocationOn,
  Star,
  Phone,
  Email,
  Business as BusinessIcon,
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
  CropLandscape,
  QrCode2,
  EmojiEvents,
  CheckCircle,
  BusinessCenter,
  SupportAgent,
  Person,
  Timeline,
  Store as StoreIcon,
  LocalShipping as LocalShippingIcon,
  Handshake as HandshakeIcon,
  Inventory as InventoryIcon,
} from "@mui/icons-material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion";
import { useBrand } from "../../hooks/useBrand";
import { useRecentlyViewed } from "../../hooks/useRecentlyViewed";
import { useGamification } from "../../hooks/useGamification";
import FranchiseInquiryForm from "../forms/FranchiseInquiryForm";
import { slugToBrandName } from "../../utils/brandUtils";
import { 
  BUSINESS_MODEL_CONFIG, 
  REVENUE_MODELS, 
  SUPPORT_TYPES 
} from "../../constants/businessModels";
import { FIELD_OPTIONS } from "../../constants/businessModelFields";
import Breadcrumbs from "../common/Breadcrumbs";
import ShareButton from "../common/ShareButton";
import QRCodeGenerator from "../common/QRCodeGenerator";
import { ScrollToTop } from "../common/StickyCTA";
import RelatedBrands from "./RelatedBrands";
import ROICalculator from "./ROICalculator";
import FAQAccordion from "../common/FAQAccordion";
import LazyImage from "../common/LazyImage";
import { FavoriteButton } from "../favorites/FavoritesPage";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const iconMap = {
  Store: StoreIcon,
  Business: BusinessIcon,
  LocalShipping: LocalShippingIcon,
  Inventory: InventoryIcon,
  Handshake: HandshakeIcon,
};

const BrandDetail = () => {
  const theme = useTheme();
  const { slug } = useParams();
  const navigate = useNavigate();
  // Use slug directly instead of converting to brandName for better matching
  const { brand, loading, error } = useBrand({ slug });
  const { addRecentBrand } = useRecentlyViewed();
  const { trackBrandView, trackInquiry } = useGamification();
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [hasSubmittedInquiry, setHasSubmittedInquiry] = useState(() => {
    // Check localStorage for this specific brand
    if (brand?.id) {
      const inquiryKey = `inquiry_submitted_${brand.id}`;
      return localStorage.getItem(inquiryKey) === 'true';
    }
    return false;
  });

  // Track recently viewed brand and gamification
  useEffect(() => {
    if (brand && !loading) {
      addRecentBrand(brand);
      trackBrandView(brand.id);
      
      // Check if inquiry was submitted for this brand
      const inquiryKey = `inquiry_submitted_${brand.id}`;
      const hasSubmitted = localStorage.getItem(inquiryKey) === 'true';
      setHasSubmittedInquiry(hasSubmitted);
    }
  }, [brand, loading, addRecentBrand, trackBrandView]);
  
  // Save inquiry submission to localStorage
  const handleInquirySuccess = () => {
    if (brand?.id) {
      const inquiryKey = `inquiry_submitted_${brand.id}`;
      localStorage.setItem(inquiryKey, 'true');
      setHasSubmittedInquiry(true);
    }
  };

  // Debug logging
  console.log('BrandDetail Debug:', {
    slug,
    loading,
    error,
    brand: brand ? { brandName: brand.brandName, id: brand.id } : null
  });

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
        },
      },
    ],
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h4" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Looking for slug: "{slug}"
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Retry
          </Button>
          <Button variant="outlined" onClick={() => navigate("/brands")}>
            View All Brands
          </Button>
        </Box>
      </Container>
    );
  }

  if (!brand) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h4" color="text.secondary">
          Brand not found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2, mb: 3 }}>
          Slug: "{slug}" | Error: {error || "No error"} | Loading: {loading ? "Yes" : "No"}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            onClick={() => navigate("/brands")}
          >
            Back to Brands
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/debug-brands")}
          >
            Debug Brands
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <>
      <SEO
        title={`${brand.brandName} | Franchise Opportunity - ikama`}
        description={brand.brandDescription || brand.description || `Explore ${brand.brandName} franchise opportunity. ${brand.businessModelType} business model with investment range ${brand.investmentRange}.`}
        keywords={`${brand.brandName}, franchise, ${brand.businessModelType}, ${brand.industries?.join(', ')}, franchise opportunity, business opportunity`}
        image={brand.logo || brand.logoUrl}
        url={window.location.href}
        type="product"
        structuredData={generateBrandStructuredData({
          ...brand,
          url: window.location.href,
          slug: slug
        })}
        canonicalUrl={`${window.location.origin}/brand/${slug}`}
      />
      <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs />

      {/* Header with Share and QR Code */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            {brand.brandName}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <FavoriteButton brand={brand} />
          <ShareButton 
            url={window.location.href}
            title={`Check out ${brand.brandName} franchise opportunity`}
            description={brand.description}
          />
          <Button
            variant="outlined"
            onClick={() => setShowQRCode(true)}
            startIcon={<QrCode2 />}
          >
            QR Code
          </Button>
        </Stack>
      </Box>

      {/* Original breadcrumb kept for compatibility - can be removed later */}
      <Box sx={{ mb: 3, display: 'none' }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 1, sm: 1.5 },
            py: { xs: 1.5, sm: 2 },
            px: { xs: 2, sm: 3 },
            background: theme.palette.background.paper,
            borderRadius: 2,
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            border: `1px solid ${theme.palette.divider}`,
            flexWrap: 'wrap'
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5,
              cursor: 'pointer',
              '&:hover': { color: theme.palette.primary.main }
            }}
            onClick={() => navigate('/')}
          >
            <Home sx={{ fontSize: 18 }} />
            <Typography variant="body2" color="text.secondary">
              Home
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary">•</Typography>
          
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5,
              cursor: 'pointer',
              '&:hover': { color: theme.palette.primary.main }
            }}
            onClick={() => navigate('/brands')}
          >
            <BusinessIcon sx={{ fontSize: 18 }} />
            <Typography variant="body2" color="text.secondary">
              Brands
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary">•</Typography>
          
          <Typography 
            variant="body2" 
            color="primary.main" 
            fontWeight="medium"
            sx={{ 
              maxWidth: { xs: '200px', sm: 'none' },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {brand?.brandName || 'Brand Details'}
          </Typography>
        </Box>
      </Box>

      <MotionCard
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        sx={{ mb: 4, boxShadow: 5, borderRadius: 3, overflow: "hidden" }}
      >
        <Box
          sx={{
            position: "relative",
            minHeight: { xs: 250, md: 350 },
            backgroundImage: (brand?.brandImage || brand?.brandLogo)
              ? `url(${brand.brandImage || brand.brandLogo})` 
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            display: "flex",
            alignItems: "center",
            color: "white",
            width: "100%",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.8) 20%, rgba(0,0,0,0) 80%)",
            }}
          />
          <Box sx={{ position: "relative", zIndex: 1, p: { xs: 2, md: 4 } }}>
            <Typography
              variant="h2"
              component="h1"
              fontWeight="bold"
              sx={{ fontSize: { xs: "2.5rem", md: "3.5rem" } }}
            >
              {brand?.brandName || 'Brand Name Not Available'}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: "60ch" }}>
              {brand?.brandMission || brand?.brandStory || 'Mission statement not available'}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
              {brand.industries?.map((industry, index) => (
                <Chip
                  key={index}
                  label={industry}
                  color="secondary"
                  size="small"
                />
              ))}
            </Box>
          </Box>
        </Box>
      </MotionCard>

      {/* Main Content - Flex Layout */}
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
        }}
      >
        {/* Left Side */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* About Us Card */}
          <MotionCard
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            sx={{ mb: 4, boxShadow: 3 }}
          >
            <CardContent>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                About {brand?.brandName || 'This Brand'}
              </Typography>
              
              {(brand.brandDescription || brand.brandStory) && (
                <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                  {brand.brandDescription || brand.brandStory}
                </Typography>
              )}

              <Box sx={{ mt: 3 }}>
                <Stack spacing={2}>
                  {(brand.brandfoundedYear || brand.foundedYear) && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Schedule color="primary" />
                      <Typography variant="body1">
                        <strong>Founded:</strong> {brand.brandfoundedYear || brand.foundedYear}
                      </Typography>
                    </Box>
                  )}
                  
                  {brand.businessModel && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BusinessIcon color="primary" />
                      <Typography variant="body1">
                        <strong>Business Model:</strong> {brand.businessModel}
                      </Typography>
                    </Box>
                  )}
                  
                  {brand.franchiseModels && brand.franchiseModels.length > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <HandshakeIcon color="primary" />
                      <Typography variant="body1">
                        <strong>Franchise Models:</strong> {brand.franchiseModels.join(", ")}
                      </Typography>
                    </Box>
                  )}
                  
                  {brand.brandVission && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.50', borderRadius: 2, borderLeft: '4px solid', borderColor: 'primary.main' }}>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="primary.main">
                        Our Vision
                      </Typography>
                      <Typography variant="body2" sx={{ fontStyle: 'italic', lineHeight: 1.6 }}>
                        {brand.brandVission}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Box>
            </CardContent>
          </MotionCard>

          {/* Partnership Models Card (NEW) */}
          {brand.businessModels && brand.businessModels.length > 0 && (
            <MotionCard
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              sx={{ mb: 4, boxShadow: 3 }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Partnership Opportunities
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  We offer multiple partnership models to suit different investment profiles and expertise levels:
                </Typography>
                
                <Stack spacing={2} sx={{ mt: 2 }}>
                  {brand.businessModels.map((modelId) => {
                    const config = BUSINESS_MODEL_CONFIG[modelId];
                    if (!config) return null;
                    
                    const IconComponent = iconMap[config.icon] || StoreIcon;
                    
                    return (
                      <Paper 
                        key={modelId} 
                        elevation={1}
                        sx={{ 
                          p: 2, 
                          border: `2px solid ${config.color}15`,
                          borderLeft: `4px solid ${config.color}`,
                          transition: 'all 0.3s',
                          '&:hover': {
                            boxShadow: 3,
                            transform: 'translateX(4px)'
                          }
                        }}
                      >
                        <Box display="flex" alignItems="flex-start" gap={2}>
                          <IconComponent 
                            sx={{ 
                              fontSize: 40, 
                              color: config.color,
                              mt: 0.5
                            }} 
                          />
                          <Box flex={1}>
                            <Typography variant="h6" fontWeight="bold" color={config.color}>
                              {config.label}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                              {config.description}
                            </Typography>
                            
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="caption" fontWeight="bold" display="block" gutterBottom>
                                Key Features:
                              </Typography>
                              <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                                {config.features.slice(0, 4).map((feature, idx) => (
                                  <Chip 
                                    key={idx}
                                    label={feature}
                                    size="small"
                                    variant="outlined"
                                    sx={{ 
                                      borderColor: config.color,
                                      color: config.color,
                                      fontSize: '0.7rem'
                                    }}
                                  />
                                ))}
                              </Stack>
                            </Box>
                            
                            <Box sx={{ mt: 1, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                              <Chip 
                                label={`${config.investmentType} Investment`}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                              <Chip 
                                label={`${config.commitmentLevel} Term`}
                                size="small"
                                color="secondary"
                                variant="outlined"
                              />
                            </Box>
                          </Box>
                        </Box>
                      </Paper>
                    );
                  })}
                </Stack>

                {/* Revenue Model */}
                {brand.revenueModel && REVENUE_MODELS[brand.revenueModel] && (
                  <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.light', borderRadius: 2 }}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      Payment Structure: {REVENUE_MODELS[brand.revenueModel].label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {REVENUE_MODELS[brand.revenueModel].description}
                    </Typography>
                  </Box>
                )}

                {/* Revenue Streams - Partner Income Sources */}
                {brand.revenueStreams && brand.revenueStreams.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      💰 Revenue Streams for Partners
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                      How you can earn from this opportunity:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1.5}>
                      {brand.revenueStreams.map((stream, index) => {
                        // Try to find the stream details from FIELD_OPTIONS
                        const industry = brand.industries?.[0];
                        const allStreams = industry ? FIELD_OPTIONS.revenueStreams?.[industry] : null;
                        const streamDetails = allStreams?.find(s => s.value === stream);
                        
                        return (
                          <Chip
                            key={index}
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {streamDetails?.icon && <span>{streamDetails.icon}</span>}
                                <span>{streamDetails?.label || stream}</span>
                              </Box>
                            }
                            variant="outlined"
                            color="success"
                            size="small"
                            sx={{ 
                              borderRadius: 1,
                              fontWeight: 500,
                              '& .MuiChip-label': {
                                px: 1.5,
                                py: 0.5
                              }
                            }}
                          />
                        );
                      })}
                    </Stack>
                  </Box>
                )}

                {/* Support Types */}
                {brand.supportTypes && brand.supportTypes.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      Support Provided:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                      {brand.supportTypes.map((supportId) => {
                        const support = SUPPORT_TYPES[supportId];
                        if (!support) return null;
                        return (
                          <Tooltip key={supportId} title={support.description || ''} arrow>
                            <Chip 
                              label={support.label}
                              size="small"
                              color="success"
                              icon={<CheckCircle />}
                            />
                          </Tooltip>
                        );
                      })}
                    </Stack>
                  </Box>
                )}
              </CardContent>
            </MotionCard>
          )}

          {/* Business Details Card */}
          <MotionCard
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            sx={{ mb: 4, boxShadow: 3 }}
          >
            <CardContent>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Business Details
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <AttachMoney color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Investment Range"
                    secondary={brand.investmentRange || "Investment range not specified"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CropLandscape color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Area Required"
                    secondary={
                      brand?.areaRequired?.min && brand?.areaRequired?.max && brand?.areaRequired?.unit
                        ? `${brand.areaRequired.min} - ${brand.areaRequired.max} ${brand.areaRequired.unit}`
                        : "Area requirements not specified"
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <BusinessIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Initial Franchise Fee"
                    secondary={
                      brand.initialFranchiseFee 
                        ? `₹${brand.initialFranchiseFee.toLocaleString()}`
                        : "Contact for franchise fee details"
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Timeline color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Franchise Term"
                    secondary={brand.franchiseTermLength || "Franchise term not specified"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Support color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Royalty Fee"
                    secondary={brand.royaltyFee ? `${brand.royaltyFee}%` : "Royalty fee not specified"}
                  />
                </ListItem>
                {brand.marketingFee && (
                  <ListItem>
                    <ListItemIcon>
                      <TrendingUp color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Marketing Fee"
                      secondary={`${brand.marketingFee}%`}
                    />
                  </ListItem>
                )}
                {brand.territorySize && (
                  <ListItem>
                    <ListItemIcon>
                      <LocationOn color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Territory Size"
                      secondary={brand.territorySize}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </MotionCard>

          {/* Space & Location Requirements */}
          {(brand.spaceRequired || (brand.brandFranchiseLocations && brand.brandFranchiseLocations.length > 0)) && (
            <MotionCard
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
              sx={{ mb: 4, boxShadow: 3 }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Space & Locations
                </Typography>
                
                <Stack spacing={2} sx={{ mt: 2 }}>
                  {brand.spaceRequired && (
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <CropLandscape sx={{ color: 'primary.main' }} />
                        <Typography variant="subtitle1" fontWeight="600">
                          Space Required
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ pl: 4 }}>
                        {brand.spaceRequired} sq ft
                      </Typography>
                    </Box>
                  )}

                  {brand.brandFranchiseLocations && brand.brandFranchiseLocations.length > 0 && (
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <LocationOn sx={{ color: 'success.main' }} />
                        <Typography variant="subtitle1" fontWeight="600">
                          Current Franchise Locations ({brand.brandFranchiseLocations.length})
                        </Typography>
                      </Box>
                      <Box sx={{ pl: 4, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {brand.brandFranchiseLocations.map((location, index) => (
                          <Chip 
                            key={index}
                            label={location}
                            size="small"
                            variant="outlined"
                            color="success"
                            icon={<LocationOn />}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </MotionCard>
          )}

          {/* Legal & Terms */}
          {(brand.transferConditions || brand.terminationConditions || brand.disputeResolution) && (
            <MotionCard
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              sx={{ mb: 4, boxShadow: 3 }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Legal Terms & Conditions
                </Typography>
                
                <Stack spacing={2.5} sx={{ mt: 2 }}>
                  {brand.transferConditions && (
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <BusinessIcon sx={{ color: 'primary.main' }} />
                        <Typography variant="subtitle1" fontWeight="600">
                          Transfer Conditions
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ pl: 4 }}>
                        {brand.transferConditions}
                      </Typography>
                    </Box>
                  )}

                  {brand.terminationConditions && (
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <BusinessCenter sx={{ color: 'error.main' }} />
                        <Typography variant="subtitle1" fontWeight="600">
                          Termination Conditions
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ pl: 4 }}>
                        {brand.terminationConditions}
                      </Typography>
                    </Box>
                  )}

                  {brand.disputeResolution && (
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Support sx={{ color: 'info.main' }} />
                        <Typography variant="subtitle1" fontWeight="600">
                          Dispute Resolution
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ pl: 4 }}>
                        {brand.disputeResolution}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </MotionCard>
          )}

          {/* Contact Information Card */}
          <MotionCard
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            sx={{ mb: 4, boxShadow: 3 }}
          >
            <CardContent>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Contact Information
              </Typography>
              
              {!hasSubmittedInquiry ? (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 6,
                    px: 3,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}08, ${theme.palette.secondary.main}08)`,
                    borderRadius: 2,
                    border: `2px dashed ${theme.palette.primary.main}40`,
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                    }}
                  >
                    <Phone sx={{ fontSize: 40, color: 'white' }} />
                  </Box>
                  <Typography variant="h6" gutterBottom fontWeight="600">
                    Contact Details Protected
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                    To protect our franchise partners and ensure quality leads, contact information is revealed only after submitting an inquiry form.
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => setShowInquiryForm(true)}
                    sx={{
                      px: 4,
                      py: 1.5,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
                      '&:hover': {
                        boxShadow: `0 6px 16px ${theme.palette.primary.main}60`,
                      }
                    }}
                  >
                    Fill Inquiry Form to Unlock
                  </Button>
                </Box>
              ) : (
                <>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Phone color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Phone"
                        secondary={
                          (brand.brandContactInformation?.phone || brand.contactInfo?.phone) || 
                          "Contact information not available"
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Email color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Email"
                        secondary={
                          (brand.brandContactInformation?.email || brand.contactInfo?.email) || 
                          "Email not provided"
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <LocationOn color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Address"
                        secondary={
                          (() => {
                            const contactInfo = brand.brandContactInformation || brand.contactInfo;
                            if (contactInfo) {
                              const addressParts = [
                                contactInfo.address,
                                contactInfo.city,
                                contactInfo.state,
                                contactInfo.zipCode
                              ].filter(Boolean);
                              return addressParts.length > 0 ? addressParts.join(', ') : "Address not provided";
                            }
                            return "Address not available";
                          })()
                        }
                      />
                    </ListItem>
                  </List>
                  <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                    {(() => {
                      const contactInfo = brand.brandContactInformation || brand.contactInfo;
                      return (
                        <>
                          {(contactInfo?.facebookURl || contactInfo?.facebook) && (
                            <IconButton
                              href={contactInfo.facebookURl || contactInfo.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="Visit Facebook page"
                            >
                              <Facebook color="primary" />
                            </IconButton>
                          )}
                          {(contactInfo?.twitterURl || contactInfo?.twitter) && (
                            <IconButton
                              href={contactInfo.twitterURl || contactInfo.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="Visit Twitter page"
                            >
                              <Twitter color="primary" />
                            </IconButton>
                          )}
                          {(contactInfo?.instagramURl || contactInfo?.instagram) && (
                            <IconButton
                              href={contactInfo.instagramURl || contactInfo.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="Visit Instagram page"
                            >
                              <Instagram color="primary" />
                            </IconButton>
                          )}
                          {(contactInfo?.linkedinURl || contactInfo?.linkedin) && (
                            <IconButton
                              href={contactInfo.linkedinURl || contactInfo.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="Visit LinkedIn page"
                            >
                              <LinkedIn color="primary" />
                            </IconButton>
                          )}
                        </>
                      );
                    })()}
                  </Box>
                </>
              )}
            </CardContent>
          </MotionCard>

          {/* Locations Card */}
          <MotionCard
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            sx={{ boxShadow: 3 }}
          >
            <CardContent>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Locations
              </Typography>
              {(() => {
                const locations = brand.brandFranchiseLocations || brand.locations || brand.franchiseLocations || [];
                return locations.length > 0 ? (
                  locations.map((location, index) => (
                    <Box key={index} sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {location.address || 'Address not provided'}
                      </Typography>
                      <Typography color="text.secondary">
                        {[location.city, location.state, location.zipCode].filter(Boolean).join(', ') || 'Location details not provided'}
                      </Typography>
                      {location.googleMapsURl && (
                        <Button
                          variant="outlined"
                          startIcon={<LocationOn />}
                          href={location.googleMapsURl}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ mt: 1 }}
                        >
                          View on Map
                        </Button>
                      )}
                      {index < locations.length - 1 && (
                        <Divider sx={{ my: 2 }} />
                      )}
                    </Box>
                  ))
                ) : (
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      py: 4,
                      bgcolor: 'grey.50',
                      borderRadius: 2,
                      textAlign: 'center'
                    }}
                  >
                    <LocationOn sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                    <Typography variant="body1" color="text.secondary">
                      No franchise locations available
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Location information will be displayed here once provided
                    </Typography>
                  </Box>
                );
              })()}
            </CardContent>
          </MotionCard>
        </Box>

        {/* Right Side */}
        <Box sx={{ flex: 2, minWidth: 0 }}>
          {/* Why Choose Us - Detailed Content */}
          {(brand.uniqueSellingProposition || brand.competitiveAdvantage || brand.targetMarket) && (
            <MotionCard
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              sx={{ mb: 4, boxShadow: 3 }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Why Choose {brand.brandName}?
                </Typography>
                
                <Stack spacing={3} sx={{ mt: 2 }}>
                  {brand.uniqueSellingProposition && (
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <EmojiEvents sx={{ color: 'primary.main' }} />
                        <Typography variant="h6" fontWeight="600" color="primary">
                          Unique Selling Proposition
                        </Typography>
                      </Box>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2, 
                          bgcolor: 'primary.50',
                          borderLeft: '4px solid',
                          borderColor: 'primary.main'
                        }}
                      >
                        <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                          {brand.uniqueSellingProposition}
                        </Typography>
                      </Paper>
                    </Box>
                  )}

                  {brand.competitiveAdvantage && (
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Star sx={{ color: 'secondary.main' }} />
                        <Typography variant="h6" fontWeight="600" color="secondary">
                          Competitive Advantage
                        </Typography>
                      </Box>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2, 
                          bgcolor: 'secondary.50',
                          borderLeft: '4px solid',
                          borderColor: 'secondary.main'
                        }}
                      >
                        <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                          {brand.competitiveAdvantage}
                        </Typography>
                      </Paper>
                    </Box>
                  )}

                  {brand.targetMarket && (
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Person sx={{ color: 'success.main' }} />
                        <Typography variant="h6" fontWeight="600" color="success.main">
                          Target Market
                        </Typography>
                      </Box>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2, 
                          bgcolor: 'success.50',
                          borderLeft: '4px solid',
                          borderColor: 'success.main'
                        }}
                      >
                        <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                          {brand.targetMarket}
                        </Typography>
                      </Paper>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </MotionCard>
          )}

          {/* Support & Benefits */}
          {(brand.franchisorSupport || brand.marketingSupport || brand.territoryRights || brand.nonCompeteRestrictions) && (
            <MotionCard
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              sx={{ mb: 4, boxShadow: 3 }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Support & Benefits
                </Typography>
                
                <Stack spacing={2.5} sx={{ mt: 2 }}>
                  {brand.franchisorSupport && (
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <SupportAgent sx={{ color: 'primary.main' }} />
                        <Typography variant="subtitle1" fontWeight="600">
                          Franchisor Support
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ pl: 4 }}>
                        {brand.franchisorSupport}
                      </Typography>
                    </Box>
                  )}

                  {brand.marketingSupport && (
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <TrendingUp sx={{ color: 'primary.main' }} />
                        <Typography variant="subtitle1" fontWeight="600">
                          Marketing Support
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ pl: 4 }}>
                        {brand.marketingSupport}
                      </Typography>
                    </Box>
                  )}

                  {brand.territoryRights && (
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <LocationOn sx={{ color: 'primary.main' }} />
                        <Typography variant="subtitle1" fontWeight="600">
                          Territory Rights
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ pl: 4 }}>
                        {brand.territoryRights}
                      </Typography>
                    </Box>
                  )}

                  {brand.nonCompeteRestrictions && (
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <BusinessCenter sx={{ color: 'warning.main' }} />
                        <Typography variant="subtitle1" fontWeight="600">
                          Non-Compete Clause
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ pl: 4 }}>
                        {brand.nonCompeteRestrictions}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </MotionCard>
          )}
          <MotionCard
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            sx={{ mb: 4, boxShadow: 3 }}
          >
            <CardContent>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Gallery
              </Typography>
              {(() => {
                const images = brand.brandFranchiseImages || brand.gallery || brand.images || brand.franchiseImages || [];
                return images.length > 0 ? (
                  <Slider {...sliderSettings}>
                    {images.map((image, index) => (
                      <Box key={index} sx={{ px: 1.5 }}>
                        <Box
                          sx={{
                            position: "relative",
                            paddingBottom: "60%", // 5:3 aspect ratio
                            overflow: "hidden",
                            borderRadius: 2,
                            boxShadow: 2,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              boxShadow: 4,
                              transform: "scale(1.02)",
                            },
                          }}
                        >
                          <Box
                            component="img"
                            src={image}
                            alt={`${brand.brandName} franchise image ${index + 1}`}
                            loading="lazy"
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </Box>
                      </Box>
                    ))}
                  </Slider>
                ) : (
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      py: 6,
                      bgcolor: 'grey.50',
                      borderRadius: 2,
                      textAlign: 'center'
                    }}
                  >
                    <CropLandscape sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      No images available
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Gallery images will be displayed here once uploaded
                    </Typography>
                  </Box>
                );
              })()}
            </CardContent>
          </MotionCard>
          {/* Franchise Details Card */}
          <MotionCard
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            sx={{ mb: 4, boxShadow: 3 }}
          >
            <CardContent>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Franchise Details
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                <Box sx={{ flex: 1, minWidth: 300 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    Financial Requirements
                  </Typography>
                  <List>
                    {brand.workingCapital && (
                      <ListItem>
                        <ListItemIcon>
                          <AttachMoney color="success" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Working Capital"
                          secondary={`₹${typeof brand.workingCapital === 'number' ? brand.workingCapital.toLocaleString() : brand.workingCapital}`}
                        />
                      </ListItem>
                    )}
                    {brand.realEstateCosts && (
                      <ListItem>
                        <ListItemIcon>
                          <Home color="success" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Real Estate Costs"
                          secondary={`₹${typeof brand.realEstateCosts === 'number' ? brand.realEstateCosts.toLocaleString() : brand.realEstateCosts}`}
                        />
                      </ListItem>
                    )}
                    {brand.equipmentCosts && (
                      <ListItem>
                        <ListItemIcon>
                          <BusinessCenter color="success" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Equipment Costs"
                          secondary={`₹${typeof brand.equipmentCosts === 'number' ? brand.equipmentCosts.toLocaleString() : brand.equipmentCosts}`}
                        />
                      </ListItem>
                    )}
                    {brand.inventoryCosts && (
                      <ListItem>
                        <ListItemIcon>
                          <Inventory color="success" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Inventory Costs"
                          secondary={`₹${typeof brand.inventoryCosts === 'number' ? brand.inventoryCosts.toLocaleString() : brand.inventoryCosts}`}
                        />
                      </ListItem>
                    )}
                  </List>
                </Box>
                <Box sx={{ flex: 1, minWidth: 300 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    Franchise Terms
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Transfer Conditions"
                        secondary={brand.transferConditions ? "Yes" : "No"}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Termination Conditions"
                        secondary={brand.terminationConditions ? "Yes" : "No"}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Dispute Resolution"
                        secondary={brand.disputeResolution ? "Yes" : "No"}
                      />
                    </ListItem>
                  </List>
                </Box>
              </Box>
            </CardContent>
          </MotionCard>

          {/* Training & Support Card */}
          <MotionCard
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            sx={{ mb: 4, boxShadow: 3 }}
          >
            <CardContent>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Training & Support
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                <Box sx={{ flex: 1, minWidth: 300 }}>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <School color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Training Program"
                        secondary={
                          brand.trainingProgram ? "Available" : "Not Available"
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <SupportAgent color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Ongoing Support"
                        secondary={
                          brand.ongoingSupport ? "Available" : "Not Available"
                        }
                      />
                    </ListItem>
                  </List>
                </Box>
                <Box sx={{ flex: 1, minWidth: 300 }}>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Operational Standards"
                        secondary={
                          brand.operationalStandards
                            ? "Available"
                            : "Not Available"
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <BusinessIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Marketing Support"
                        secondary={
                          brand.marketingSupport ? "Available" : "Not Available"
                        }
                      />
                    </ListItem>
                  </List>
                </Box>
              </Box>
            </CardContent>
          </MotionCard>

          {/* Financial Breakdown - Detailed */}
          {(brand.securityDeposit || brand.workingCapital || brand.equipmentCosts || brand.realEstateCosts || 
            brand.ebitdaMargin || brand.expectedRevenue || brand.minROI || brand.payBackPeriod) && (
            <MotionCard
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.22 }}
              sx={{ mb: 4, boxShadow: 3 }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Detailed Financial Breakdown
                </Typography>
                
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {brand.securityDeposit && (
                    <Grid item xs={12} sm={6}>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2, 
                          bgcolor: 'background.default',
                          border: '1px solid',
                          borderColor: 'divider'
                        }}
                      >
                        <Typography variant="caption" color="text.secondary" display="block">
                          Security Deposit
                        </Typography>
                        <Typography variant="h6" fontWeight="600" color="primary">
                          ₹{Number(brand.securityDeposit).toLocaleString()}
                        </Typography>
                      </Paper>
                    </Grid>
                  )}

                  {brand.workingCapital && (
                    <Grid item xs={12} sm={6}>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2, 
                          bgcolor: 'background.default',
                          border: '1px solid',
                          borderColor: 'divider'
                        }}
                      >
                        <Typography variant="caption" color="text.secondary" display="block">
                          Working Capital
                        </Typography>
                        <Typography variant="h6" fontWeight="600" color="primary">
                          ₹{Number(brand.workingCapital).toLocaleString()}
                        </Typography>
                      </Paper>
                    </Grid>
                  )}

                  {brand.equipmentCosts && (
                    <Grid item xs={12} sm={6}>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2, 
                          bgcolor: 'background.default',
                          border: '1px solid',
                          borderColor: 'divider'
                        }}
                      >
                        <Typography variant="caption" color="text.secondary" display="block">
                          Equipment Costs
                        </Typography>
                        <Typography variant="h6" fontWeight="600" color="primary">
                          ₹{Number(brand.equipmentCosts).toLocaleString()}
                        </Typography>
                      </Paper>
                    </Grid>
                  )}

                  {brand.realEstateCosts && (
                    <Grid item xs={12} sm={6}>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2, 
                          bgcolor: 'background.default',
                          border: '1px solid',
                          borderColor: 'divider'
                        }}
                      >
                        <Typography variant="caption" color="text.secondary" display="block">
                          Real Estate Costs
                        </Typography>
                        <Typography variant="h6" fontWeight="600" color="primary">
                          ₹{Number(brand.realEstateCosts).toLocaleString()}
                        </Typography>
                      </Paper>
                    </Grid>
                  )}

                  {brand.expectedRevenue && (
                    <Grid item xs={12} sm={6}>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2, 
                          bgcolor: 'success.50',
                          border: '1px solid',
                          borderColor: 'success.main'
                        }}
                      >
                        <Typography variant="caption" color="text.secondary" display="block">
                          Expected Annual Revenue
                        </Typography>
                        <Typography variant="h6" fontWeight="600" color="success.dark">
                          ₹{Number(brand.expectedRevenue).toLocaleString()}
                        </Typography>
                      </Paper>
                    </Grid>
                  )}

                  {brand.ebitdaMargin && (
                    <Grid item xs={12} sm={6}>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2, 
                          bgcolor: 'info.50',
                          border: '1px solid',
                          borderColor: 'info.main'
                        }}
                      >
                        <Typography variant="caption" color="text.secondary" display="block">
                          EBITDA Margin
                        </Typography>
                        <Typography variant="h6" fontWeight="600" color="info.dark">
                          {brand.ebitdaMargin}
                        </Typography>
                      </Paper>
                    </Grid>
                  )}

                  {brand.minROI && (
                    <Grid item xs={12} sm={6}>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2, 
                          bgcolor: 'warning.50',
                          border: '1px solid',
                          borderColor: 'warning.main'
                        }}
                      >
                        <Typography variant="caption" color="text.secondary" display="block">
                          Minimum ROI
                        </Typography>
                        <Typography variant="h6" fontWeight="600" color="warning.dark">
                          {brand.minROI}
                        </Typography>
                      </Paper>
                    </Grid>
                  )}

                  {brand.payBackPeriod && (
                    <Grid item xs={12} sm={6}>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2, 
                          bgcolor: 'secondary.50',
                          border: '1px solid',
                          borderColor: 'secondary.main'
                        }}
                      >
                        <Typography variant="caption" color="text.secondary" display="block">
                          Payback Period
                        </Typography>
                        <Typography variant="h6" fontWeight="600" color="secondary.dark">
                          {brand.payBackPeriod}
                        </Typography>
                      </Paper>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </MotionCard>
          )}

          {/* Financial Performance Card */}
          {(brand.expectedROI || brand.paybackPeriod || brand.avgMonthlyRevenue || brand.profitMargins) && (
            <MotionCard
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              sx={{ mb: 4, boxShadow: 3 }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Financial Performance
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  <Box sx={{ flex: 1, minWidth: 300 }}>
                    <List>
                      {brand.expectedROI && (
                        <ListItem>
                          <ListItemIcon>
                            <TrendingUp color="success" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Expected ROI"
                            secondary={`${brand.expectedROI}%`}
                          />
                        </ListItem>
                      )}
                      {brand.paybackPeriod && (
                        <ListItem>
                          <ListItemIcon>
                            <Schedule color="success" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Payback Period"
                            secondary={brand.paybackPeriod}
                          />
                        </ListItem>
                      )}
                    </List>
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 300 }}>
                    <List>
                      {brand.avgMonthlyRevenue && (
                        <ListItem>
                          <ListItemIcon>
                            <AttachMoney color="success" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Avg. Monthly Revenue"
                            secondary={`₹${typeof brand.avgMonthlyRevenue === 'number' ? brand.avgMonthlyRevenue.toLocaleString() : brand.avgMonthlyRevenue}`}
                          />
                        </ListItem>
                      )}
                      {brand.profitMargins && (
                        <ListItem>
                          <ListItemIcon>
                            <EmojiEvents color="success" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Profit Margins"
                            secondary={`${brand.profitMargins}%`}
                          />
                        </ListItem>
                      )}
                    </List>
                  </Box>
                </Box>
              </CardContent>
            </MotionCard>
          )}
        </Box>
      </MotionBox>

      {/* Call to Action */}
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        sx={{
          backgroundColor: "primary.main",
          color: "white",
          borderRadius: 1,
          p: 6,
          mt: 4,
          textAlign: "center",
        }}
      >
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
          Ready to Join the {brand.brandName} Family?
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, maxWidth: 800, mx: "auto" }}>
          Take the first step towards owning your own {brand.brandName}{" "}
          franchise today.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => setShowInquiryForm(true)}
          sx={{
            bgcolor: "background.paper",
            color: "primary.main",
            "&:hover": { bgcolor: "primary.50" },
          }}
        >
          Request Franchise Information
        </Button>
      </MotionBox>

      {/* ROI Calculator */}
      <Box sx={{ mt: 4 }}>
        <ROICalculator 
          brandName={brand.brandName}
          initialInvestment={brand.initialInvestment}
          estimatedROI={brand.estimatedROI}
        />
      </Box>

      {/* FAQ Accordion */}
      <Box sx={{ mt: 4 }}>
        <FAQAccordion brandName={brand.brandName} />
      </Box>

      {/* Related Brands */}
      <Box sx={{ mt: 4 }}>
        <RelatedBrands 
          currentBrand={brand}
          category={brand.category}
        />
      </Box>

      {/* Scroll to Top */}
      <ScrollToTop />

      {/* Dialogs */}
      <Dialog
        open={showInquiryForm}
        onClose={() => setShowInquiryForm(false)}
        maxWidth="md"
        fullWidth
      >
        <FranchiseInquiryForm
          brand={brand}
          onClose={() => {
            setShowInquiryForm(false);
            trackInquiry();
          }}
          onSuccess={handleInquirySuccess}
        />
      </Dialog>

      <QRCodeGenerator 
        open={showQRCode}
        onClose={() => setShowQRCode(false)}
        url={window.location.href}
        brandName={brand.brandName}
        brandLogo={brand.brandImage || brand.logo}
        showButton={false}
      />
    </Container>
    </>
  );
};

export default BrandDetail;