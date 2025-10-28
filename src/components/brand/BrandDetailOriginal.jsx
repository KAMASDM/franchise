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
  Dialog,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListItemIcon,
  Avatar,
  useTheme,
  Link,
  Stack,
  Tooltip,
  Breadcrumbs,
  Tabs,
  Tab,
} from "@mui/material";
import {
  LocationOn,
  Star,
  Phone,
  Email,
  Business,
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
  NavigateNext,
  ArrowBack,
  ContactPhone,
  ExpandMore,
  Timer,
  Info,
  PhotoLibrary,
  AccountBalance,
  Description,
} from "@mui/icons-material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion";
import { useBrand } from "../../hooks/useBrand";
import { useDevice } from "../../hooks/useDevice";
import FranchiseInquiryForm from "../forms/FranchiseInquiryForm";
import {
  BUSINESS_MODEL_CONFIG,
  REVENUE_MODELS,
  SUPPORT_TYPES,
} from "../../constants/businessModels";

// Lazy load mobile version for better code splitting
const BrandDetailMobile = lazy(() => import('./BrandDetailMobile'));

const MotionBox = motion(Box);
const MotionCard = motion(Card);

// Icon mapping for business models
const iconMap = {
  Store: StoreIcon,
  LocalShipping: LocalShippingIcon,
  Handshake: HandshakeIcon,
  Inventory: InventoryIcon,
};

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
  const theme = useTheme();

  // Memoized tab change handler to prevent infinite re-renders
  const handleTabChange = useCallback((event, newValue) => {
    setActiveTab(newValue);
  }, []);

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 960,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
      },
    ],
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
            position: "relative",
            minHeight: { xs: 250, md: 350 },
            backgroundImage: `url(${
              brand.brandBanner ||
              brand.brandLogo ||
              brand.brandImage ||
              "/api/placeholder/1200/400"
            })`,
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
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              p: { xs: 2, md: 4 },
              width: "100%",
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              fontWeight="bold"
              sx={{ fontSize: { xs: "2.5rem", md: "3.5rem" } }}
            >
              {brand.brandName}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: "60ch", mb: 3 }}>
              {brand.brandMission}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap", mb: 3 }}>
              {brand.industries?.map((industry, index) => (
                <Chip
                  key={index}
                  label={industry}
                  color="secondary"
                  size="small"
                />
              ))}
            </Box>

            {/* CTA Buttons */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                variant="contained"
                size="large"
                startIcon={<ContactPhone />}
                onClick={() => setShowInquiryForm(true)}
                sx={{
                  bgcolor: "primary.main",
                  "&:hover": { bgcolor: "primary.dark" },
                  fontWeight: "bold",
                  px: 3,
                }}
              >
                Request Information
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<Phone />}
                onClick={() => setShowInquiryForm(true)}
                sx={{
                  borderColor: "white",
                  color: "white",
                  "&:hover": {
                    borderColor: "primary.light",
                    bgcolor: "rgba(255,255,255,0.1)",
                  },
                  fontWeight: "bold",
                  px: 3,
                }}
              >
                Schedule a Call
              </Button>
            </Stack>
          </Box>
        </Box>
      </MotionCard>

      {/* Modern Tabbed Interface */}
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              bgcolor: 'primary.main',
              '& .MuiTab-root': {
                color: 'rgba(255,255,255,0.7)',
                fontWeight: 'bold',
                minHeight: 64,
                '&.Mui-selected': {
                  color: 'white',
                },
              },
              '& .MuiTabs-indicator': {
                bgcolor: 'white',
                height: 3,
              },
            }}
          >
            <Tab icon={<Info />} label="Overview" iconPosition="start" />
            <Tab icon={<AttachMoney />} label="Investment" iconPosition="start" />
            <Tab icon={<BusinessCenter />} label="Business Model" iconPosition="start" />
            <Tab icon={<Description />} label="Requirements" iconPosition="start" />
            <Tab icon={<PhotoLibrary />} label="Gallery" iconPosition="start" />
            <Tab icon={<ContactPhone />} label="Contact" iconPosition="start" />
          </Tabs>
        </Paper>

        {/* Tab Panel 0: Overview */}
        {activeTab === 0 && (
          <Box sx={{ py: 4 }}>
            <Grid container spacing={3}>
              {/* Company Info Card */}
              <Grid item xs={12} md={8}>
                <Card sx={{ boxShadow: 3, height: '100%' }}>
                  <CardContent>
                    <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                      About {brand.brandName}
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Founded Year</Typography>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          {brand.brandfoundedYear}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Total Outlets</Typography>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          {brand.brandTotalOutlets || 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Business Model</Typography>
                        <Typography variant="body1" gutterBottom>
                          {brand.businessModel}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Franchise Models</Typography>
                        <Typography variant="body1" gutterBottom>
                          {brand?.franchiseModels?.join(", ") || 'N/A'}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 3 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>Industries</Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                        {brand.industries?.map((industry, idx) => (
                          <Chip key={idx} label={industry} color="primary" size="small" />
                        ))}
                      </Stack>
                    </Box>

                    {brand.locations && brand.locations.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>Locations</Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                          {brand.locations.map((location, idx) => (
                            <Chip key={idx} label={location} icon={<LocationOn />} size="small" variant="outlined" />
                          ))}
                        </Stack>
                      </Box>
                    )}

                    <Divider sx={{ my: 3 }} />
                    
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Vision</Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {brand.brandVision || brand.brandVission}
                    </Typography>

                    {brand.brandMission && (
                      <>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Mission</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {brand.brandMission}
                        </Typography>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Quick Stats Sidebar */}
              <Grid item xs={12} md={4}>
                <Stack spacing={2}>
                  <Card sx={{ bgcolor: 'success.lighter', boxShadow: 3 }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <AttachMoney color="success" />
                        <Typography variant="subtitle2" color="success.dark">Total Investment</Typography>
                      </Box>
                      <Typography variant="h4" fontWeight="bold" color="success.dark">
                        ₹{Number(brand.brandInvestment || 0).toLocaleString('en-IN')}
                      </Typography>
                    </CardContent>
                  </Card>

                  <Card sx={{ bgcolor: 'primary.lighter', boxShadow: 3 }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Timer color="primary" />
                        <Typography variant="subtitle2" color="primary.dark">Payback Period</Typography>
                      </Box>
                      <Typography variant="h4" fontWeight="bold" color="primary.dark">
                        {brand.payBackPeriod || 'N/A'}
                      </Typography>
                    </CardContent>
                  </Card>

                  <Card sx={{ bgcolor: 'warning.lighter', boxShadow: 3 }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <CropLandscape color="warning" />
                        <Typography variant="subtitle2" color="warning.dark">Space Required</Typography>
                      </Box>
                      <Typography variant="h4" fontWeight="bold" color="warning.dark">
                        {brand.spaceRequired} sq ft
                      </Typography>
                    </CardContent>
                  </Card>

                  <Card sx={{ boxShadow: 3 }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Star color="warning" />
                        <Typography variant="subtitle2">Brand Rating</Typography>
                      </Box>
                      <Typography variant="h4" fontWeight="bold">
                        {brand.brandRating || 'N/A'} / 5
                      </Typography>
                    </CardContent>
                  </Card>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Tab Panel 1: Investment & Financials */}
        {activeTab === 1 && (
          <Box sx={{ py: 4 }}>
            <Grid container spacing={3}>
              {/* Investment Breakdown */}
              <Grid item xs={12} md={6}>
                <Card sx={{ boxShadow: 3, height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom color="success.dark">
                      <AttachMoney sx={{ verticalAlign: 'middle' }} /> Investment Breakdown
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <TableContainer>
                      <Table size="small">
                        <TableBody>
                          <TableRow sx={{ bgcolor: 'success.lighter' }}>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Total Investment</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'success.dark' }}>
                              ₹{Number(brand.brandInvestment || 0).toLocaleString('en-IN')}
                            </TableCell>
                          </TableRow>
                          {brand.franchiseFee && (
                            <TableRow>
                              <TableCell>Franchise Fee</TableCell>
                              <TableCell align="right">₹{Number(brand.franchiseFee).toLocaleString('en-IN')}</TableCell>
                            </TableRow>
                          )}
                          {brand.securityDeposit && (
                            <TableRow>
                              <TableCell>Security Deposit</TableCell>
                              <TableCell align="right">₹{Number(brand.securityDeposit).toLocaleString('en-IN')}</TableCell>
                            </TableRow>
                          )}
                          {brand.workingCapital && (
                            <TableRow>
                              <TableCell>Working Capital</TableCell>
                              <TableCell align="right">₹{Number(brand.workingCapital).toLocaleString('en-IN')}</TableCell>
                            </TableRow>
                          )}
                          {brand.equipmentCosts && (
                            <TableRow>
                              <TableCell>Equipment Costs</TableCell>
                              <TableCell align="right">₹{Number(brand.equipmentCosts).toLocaleString('en-IN')}</TableCell>
                            </TableRow>
                          )}
                          {brand.realEstateCosts && (
                            <TableRow>
                              <TableCell>Real Estate Costs</TableCell>
                              <TableCell align="right">₹{Number(brand.realEstateCosts).toLocaleString('en-IN')}</TableCell>
                            </TableRow>
                          )}
                          {brand.royaltyFee && (
                            <TableRow>
                              <TableCell>Royalty Fee</TableCell>
                              <TableCell align="right">{brand.royaltyFee}</TableCell>
                            </TableRow>
                          )}
                          {brand.brandFee && (
                            <TableRow>
                              <TableCell>Brand Fee</TableCell>
                              <TableCell align="right">{brand.brandFee}</TableCell>
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
                <Card sx={{ boxShadow: 3, height: '100%', bgcolor: 'success.lighter' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom color="success.dark">
                      <TrendingUp sx={{ verticalAlign: 'middle' }} /> Expected Returns
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    
                    <Stack spacing={3}>
                      {brand.payBackPeriod && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">Payback Period</Typography>
                          <Typography variant="h4" fontWeight="bold" color="success.dark">
                            {brand.payBackPeriod}
                          </Typography>
                        </Box>
                      )}
                      
                      {brand.expectedRevenue && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">Expected Revenue (Annual)</Typography>
                          <Typography variant="h4" fontWeight="bold" color="success.dark">
                            ₹{Number(brand.expectedRevenue).toLocaleString('en-IN')}
                          </Typography>
                        </Box>
                      )}
                      
                      {brand.ebitdaMargin && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">EBITDA Margin</Typography>
                          <Typography variant="h4" fontWeight="bold" color="success.dark">
                            {brand.ebitdaMargin}
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

        {/* Tab Panel 2: Business Model */}
        {activeTab === 2 && (
          <Box sx={{ py: 4 }}>
            {brand.businessModels && brand.businessModels.length > 0 && (
              <Card sx={{ mb: 3, boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom color="info.dark">
                    Partnership Opportunities
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    We offer multiple partnership models to suit different investment profiles:
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Stack spacing={2}>
                    {brand.businessModels.map((modelId) => {
                      const config = BUSINESS_MODEL_CONFIG[modelId];
                      if (!config) return null;

                      const IconComponent = iconMap[config.icon] || StoreIcon;

                      return (
                        <Paper
                          key={modelId}
                          elevation={2}
                          sx={{
                            p: 3,
                            border: `2px solid ${config.color}15`,
                            borderLeft: `5px solid ${config.color}`,
                            transition: 'all 0.3s',
                            '&:hover': {
                              boxShadow: 6,
                              transform: 'translateY(-2px)',
                            },
                          }}
                        >
                          <Box display="flex" alignItems="flex-start" gap={2}>
                            <IconComponent
                              sx={{
                                fontSize: 48,
                                color: config.color,
                              }}
                            />
                            <Box flex={1}>
                              <Typography variant="h6" fontWeight="bold" color={config.color} gutterBottom>
                                {config.label}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" paragraph>
                                {config.description}
                              </Typography>

                              <Box sx={{ mt: 2 }}>
                                <Typography variant="caption" fontWeight="bold" display="block" gutterBottom>
                                  Key Features:
                                </Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                                  {config.features.map((feature, idx) => (
                                    <Chip
                                      key={idx}
                                      label={feature}
                                      size="small"
                                      variant="outlined"
                                      sx={{
                                        borderColor: config.color,
                                        color: config.color,
                                      }}
                                    />
                                  ))}
                                </Stack>
                              </Box>

                              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                                <Chip
                                  label={`${config.investmentType} Investment`}
                                  size="small"
                                  color="primary"
                                />
                                <Chip
                                  label={`${config.commitmentLevel} Term`}
                                  size="small"
                                  color="secondary"
                                />
                              </Box>
                            </Box>
                          </Box>
                        </Paper>
                      );
                    })}
                  </Stack>

                  {brand.revenueModel && REVENUE_MODELS[brand.revenueModel] && (
                    <Box sx={{ mt: 3, p: 3, bgcolor: 'info.lighter', borderRadius: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Revenue Model: {REVENUE_MODELS[brand.revenueModel].label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {REVENUE_MODELS[brand.revenueModel].description}
                      </Typography>
                    </Box>
                  )}

                  {brand.supportTypes && brand.supportTypes.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
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
              </Card>
            )}

            {/* Additional Business Info */}
            <Grid container spacing={3}>
              {brand.uniqueSellingProposition && (
                <Grid item xs={12} md={6}>
                  <Card sx={{ boxShadow: 3, height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                        Unique Selling Proposition
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {brand.uniqueSellingProposition}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {brand.competitiveAdvantage && (
                <Grid item xs={12} md={6}>
                  <Card sx={{ boxShadow: 3, height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                        Competitive Advantage
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {brand.competitiveAdvantage}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          </Box>
        )}

        {/* Tab Panel 3: Requirements */}
        {activeTab === 3 && (
          <Box sx={{ py: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ boxShadow: 3, height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom color="warning.dark">
                      Space & Infrastructure
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <List>
                      {brand.spaceRequired && (
                        <ListItem>
                          <ListItemIcon>
                            <CropLandscape color="warning" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Space Required"
                            secondary={`${brand.spaceRequired} sq ft`}
                          />
                        </ListItem>
                      )}
                      {brand.locations && brand.locations.length > 0 && (
                        <ListItem>
                          <ListItemIcon>
                            <LocationOn color="warning" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Preferred Locations"
                            secondary={brand.locations.join(', ')}
                          />
                        </ListItem>
                      )}
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ boxShadow: 3, height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom color="warning.dark">
                      Training & Support
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <List>
                      {brand.franchisorSupport && (
                        <ListItem>
                          <ListItemIcon>
                            <SupportAgent color="warning" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Franchisor Support"
                            secondary={brand.franchisorSupport}
                          />
                        </ListItem>
                      )}
                      {brand.marketingSupport && (
                        <ListItem>
                          <ListItemIcon>
                            <School color="warning" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Marketing Support"
                            secondary={brand.marketingSupport}
                          />
                        </ListItem>
                      )}
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              {brand.franchiseTermLength && (
                <Grid item xs={12}>
                  <Card sx={{ boxShadow: 3, bgcolor: 'info.lighter' }}>
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <Typography variant="body2" color="text.secondary">Franchise Term Length</Typography>
                          <Typography variant="h6" fontWeight="bold">{brand.franchiseTermLength}</Typography>
                        </Grid>
                        {brand.territoryRights && (
                          <Grid item xs={12} md={4}>
                            <Typography variant="body2" color="text.secondary">Territory Rights</Typography>
                            <Typography variant="body1">{brand.territoryRights}</Typography>
                          </Grid>
                        )}
                        {brand.nonCompeteRestrictions && (
                          <Grid item xs={12} md={4}>
                            <Typography variant="body2" color="text.secondary">Non-Compete Restrictions</Typography>
                            <Typography variant="body1">{brand.nonCompeteRestrictions}</Typography>
                          </Grid>
                        )}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          </Box>
        )}

        {/* Tab Panel 4: Gallery */}
        {activeTab === 4 && (
          <Box sx={{ py: 4 }}>
            {brand.brandFranchiseImages && brand.brandFranchiseImages.length > 0 ? (
              <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                  <Slider {...sliderSettings}>
                    {brand.brandFranchiseImages.map((image, index) => (
                      <Box key={index} sx={{ px: 1 }}>
                        <Box
                          component="img"
                          src={image}
                          alt={`${brand.brandName} - Image ${index + 1}`}
                          sx={{
                            width: '100%',
                            height: 300,
                            objectFit: 'cover',
                            borderRadius: 2,
                          }}
                        />
                      </Box>
                    ))}
                  </Slider>
                </CardContent>
              </Card>
            ) : (
              <Card sx={{ boxShadow: 3 }}>
                <CardContent sx={{ textAlign: 'center', py: 6 }}>
                  <PhotoLibrary sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No images available for this brand
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        )}

        {/* Tab Panel 5: Contact */}
        {activeTab === 5 && (
          <Box sx={{ py: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ boxShadow: 3, height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom color="error.dark">
                      Contact Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <List>
                      {brand.brandOwnerInformation?.ownerName && (
                        <ListItem>
                          <ListItemIcon>
                            <Person color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Contact Person"
                            secondary={brand.brandOwnerInformation.ownerName}
                          />
                        </ListItem>
                      )}
                      {brand.brandOwnerInformation?.ownerEmail && (
                        <ListItem>
                          <ListItemIcon>
                            <Email color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Email"
                            secondary={brand.brandOwnerInformation.ownerEmail}
                          />
                        </ListItem>
                      )}
                      {brand.brandOwnerInformation?.contactNumber && (
                        <ListItem>
                          <ListItemIcon>
                            <Phone color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Phone"
                            secondary={brand.brandOwnerInformation.contactNumber}
                          />
                        </ListItem>
                      )}
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ boxShadow: 3, height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Connect on Social Media
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    <Stack direction="row" spacing={2} justifyContent="center">
                      {(brand.brandOwnerInformation?.facebookUrl || brand.brandOwnerInformation?.facebookURl) && (
                        <IconButton
                          component="a"
                          href={brand.brandOwnerInformation.facebookUrl || brand.brandOwnerInformation.facebookURl}
                          target="_blank"
                          rel="noopener noreferrer"
                          color="primary"
                          sx={{ bgcolor: 'primary.lighter', '&:hover': { bgcolor: 'primary.light' } }}
                        >
                          <Facebook />
                        </IconButton>
                      )}
                      {brand.brandOwnerInformation?.twitterUrl && (
                        <IconButton
                          component="a"
                          href={brand.brandOwnerInformation.twitterUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          color="primary"
                          sx={{ bgcolor: 'primary.lighter', '&:hover': { bgcolor: 'primary.light' } }}
                        >
                          <Twitter />
                        </IconButton>
                      )}
                      {brand.brandOwnerInformation?.instagramUrl && (
                        <IconButton
                          component="a"
                          href={brand.brandOwnerInformation.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          color="primary"
                          sx={{ bgcolor: 'primary.lighter', '&:hover': { bgcolor: 'primary.light' } }}
                        >
                          <Instagram />
                        </IconButton>
                      )}
                      {(brand.brandOwnerInformation?.linkedinUrl || brand.brandOwnerInformation?.linkedinURl) && (
                        <IconButton
                          component="a"
                          href={brand.brandOwnerInformation.linkedinUrl || brand.brandOwnerInformation.linkedinURl}
                          target="_blank"
                          rel="noopener noreferrer"
                          color="primary"
                          sx={{ bgcolor: 'primary.lighter', '&:hover': { bgcolor: 'primary.light' } }}
                        >
                          <LinkedIn />
                        </IconButton>
                      )}
                    </Stack>

                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<ContactPhone />}
                        onClick={() => setShowInquiryForm(true)}
                        fullWidth
                        sx={{ fontWeight: 'bold' }}
                      >
                        Request Information
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>

      {/* Final CTA Section - Removed, now in Contact tab */}

      {/* Sticky Floating CTA Button */}
      <Box
        sx={{
          position: "fixed",
          bottom: 24,
          right: 100,
          zIndex: 1200,
          display: { xs: "none", md: "block" },
        }}
      >
        <Button
          variant="contained"
          size="large"
          startIcon={<ContactPhone />}
          onClick={() => setShowInquiryForm(true)}
          sx={{
            bgcolor: "error.main",
            "&:hover": { bgcolor: "error.dark" },
            fontWeight: "bold",
            boxShadow: 6,
            animation: "pulse 2s infinite",
            "@keyframes pulse": {
              "0%": { boxShadow: "0 0 0 0 rgba(244, 67, 54, 0.7)" },
              "70%": { boxShadow: "0 0 0 10px rgba(244, 67, 54, 0)" },
              "100%": { boxShadow: "0 0 0 0 rgba(244, 67, 54, 0)" },
            },
          }}
        >
          Inquire Now
        </Button>
      </Box>

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
  );
};

export default BrandDetail;
