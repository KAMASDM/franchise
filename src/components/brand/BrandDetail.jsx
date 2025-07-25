import React, { useState, useRef, useEffect } from "react";
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
  Avatar,
  LinearProgress,
  Tab,
  Tabs,
  Stepper,
  Step,
  StepLabel,
  useTheme,
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
  GetApp,
  Share,
  Favorite,
  FavoriteBorder,
  Bookmark,
  BookmarkBorder,
  Timeline,
  Assessment,
  Security,
  Verified,
  CheckCircle,
  LocalOffer,
  Storefront,
  Psychology,
  TrendingDown,
  ShowChart,
  MonetizationOn,
  AccountBalance,
  BusinessCenter,
  Description,
  CameraAlt,
  VideoCall,
  PersonAdd,
  Launch,
  CropLandscape,
  SupportAgent,
  ContactMail,
  Description as DescriptionIcon,
  MonetizationOn as MonetizationOnIcon,
  School as SchoolIcon,
  CalendarToday,
  AspectRatio,
} from "@mui/icons-material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion, AnimatePresence } from "framer-motion";
import { useBrand } from "../../hooks/useBrand";
import FranchiseInquiryForm from "../forms/FranchiseInquiryForm";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const StatCard = ({ icon, value, label, color = "primary", trend, theme }) => (
  <MotionCard
    whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(0,0,0,0.15)" }}
    transition={{ duration: 0.2 }}
    sx={{
      height: "100%",
      background: `linear-gradient(135deg, ${theme.palette[color].main}, ${theme.palette[color].dark})`,
      color: "white",
      overflow: "hidden",
      position: "relative",
    }}
  >
    <CardContent sx={{ position: "relative", zIndex: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>{icon}</Avatar>
        {trend && (
          <Chip
            icon={trend > 0 ? <TrendingUp /> : <TrendingDown />}
            label={`${Math.abs(trend)}%`}
            size="small"
            sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
          />
        )}
      </Box>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
        {value}
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.9 }}>
        {label}
      </Typography>
    </CardContent>
    <Box
      sx={{
        position: "absolute",
        top: -20,
        right: -20,
        width: 100,
        height: 100,
        borderRadius: "50%",
        bgcolor: "rgba(255,255,255,0.1)",
      }}
    />
  </MotionCard>
);

const BrandDetail = () => {
  const theme = useTheme();
  const { slug } = useParams();
  const brandName = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  const navigate = useNavigate();
  const { brand, loading, error } = useBrand(brandName);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // Refs for scrolling functionality
  const contentRef = useRef(null);
  const isInitialRender = useRef(true);

  const gallerySettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };
  
  // Effect to scroll to content when tab changes
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    if (contentRef.current) {
      contentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [activeTab]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading brand details...
        </Typography>
        <LinearProgress sx={{ width: 200, mt: 2 }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h4" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Container>
    );
  }

  if (!brand) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h4" color="text.secondary">
          Brand not found
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/brands")}
          sx={{ mt: 2 }}
        >
          Back to Brands
        </Button>
      </Container>
    );
  }

  const steps = [
    {
      label: "Initial Inquiry",
      description: "Submit your application and express interest",
      icon: <ContactMail />,
      action: "Fill out the inquiry form",
    },
    {
      label: "Discovery Call",
      description: "Discuss opportunity with franchise team",
      icon: <Phone />,
      action: "Schedule a call",
    },
    {
      label: "Review Process",
      description: "Our team reviews your qualifications",
      icon: <DescriptionIcon />,
      action: "Submit required documents",
    },
    {
      label: "Franchise Disclosure",
      description: "Receive and review FDD documents",
      icon: <Description />,
      action: "Review documents carefully",
    },
    {
      label: "Financial Verification",
      description: "Verify your financial qualifications",
      icon: <MonetizationOnIcon />,
      action: "Submit financial statements",
    },
    {
      label: "Site Approval",
      description: "Get your location approved",
      icon: <LocationOn />,
      action: "Submit location details",
    },
    {
      label: "Sign Agreement",
      description: "Sign the franchise agreement",
      icon: <Description />,
      action: "Review and sign contract",
    },
    {
      label: "Training & Launch",
      description: "Complete training and open your franchise",
      icon: <SchoolIcon />,
      action: "Attend training program",
    },
  ];

  return (
    <>
      <Box sx={{ position: "relative", overflow: "hidden", width: "100%" }}>
        <MotionBox
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2 }}
          sx={{
            minHeight: { xs: 400, md: 600 },
            background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.3)), url(${brand.brandBanner})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            display: "flex",
            alignItems: "center",
            color: "white",
            position: "relative",
            width: "100%",
          }}
        >
          <Box sx={{ position: "absolute", top: 20, right: 20, zIndex: 10 }}>
            <IconButton
              onClick={() => setIsFavorite(!isFavorite)}
              sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white", mr: 1 }}
            >
              {isFavorite ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
            <IconButton
              onClick={() => setIsBookmarked(!isBookmarked)}
              sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white", mr: 1 }}
            >
              {isBookmarked ? <Bookmark /> : <BookmarkBorder />}
            </IconButton>
            <IconButton
              sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
            >
              <Share />
            </IconButton>
          </Box>

          <Container maxWidth="xl" sx={{ width: "100%" }}>
            <Grid
              container
              spacing={4}
              alignItems="center"
              sx={{ width: "100%" }}
            >
              <Grid item xs={12} md={8}>
                <MotionBox
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Verified sx={{ mr: 2, color: "#4caf50" }} />
                    <Typography variant="body1">Verified Franchise</Typography>
                  </Box>

                  <Typography
                    variant="h2"
                    component="h1"
                    fontWeight="bold"
                    sx={{
                      fontSize: { xs: "2.5rem", md: "4rem" },
                      mb: 2,
                      textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                    }}
                  >
                    {brand.brandName}
                  </Typography>

                  <Typography
                    variant="h5"
                    sx={{ mb: 3, opacity: 0.9, fontWeight: 300 }}
                  >
                    {brand.brandMission}
                  </Typography>

                  <Box
                    sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}
                  >
                    {brand.industries?.map((industry, index) => (
                      <Chip
                        key={index}
                        label={industry}
                        sx={{
                          bgcolor: "rgba(255,255,255,0.2)",
                          color: "white",
                          backdropFilter: "blur(10px)",
                        }}
                      />
                    ))}
                  </Box>

                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<PersonAdd />}
                      onClick={() => setShowInquiryForm(true)}
                      sx={{
                        bgcolor: "#ff6b35",
                        "&:hover": { bgcolor: "#e55a2b" },
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                      }}
                    >
                      Apply Now
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<VideoCall />}
                      sx={{
                        borderColor: "white",
                        color: "white",
                        "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                      }}
                    >
                      Virtual Tour
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<GetApp />}
                      sx={{
                        borderColor: "white",
                        color: "white",
                        "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                      }}
                    >
                      Download Brochure
                    </Button>
                  </Box>
                </MotionBox>
              </Grid>
            </Grid>
          </Container>
        </MotionBox>
      </Box>

      <Container maxWidth="xl" sx={{ width: "100%", mt: 6 }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {[
            {
              icon: <CalendarToday />,
              value: brand.brandfoundedYear,
              label: "Established Year",
              color: "primary",
            },
            {
              icon: <Storefront />,
              value: brand.brandFranchiseLocations?.length,
              label: "Franchise Outlets",
              color: "success",
            },
            {
              icon: <MonetizationOn />,
              value: brand.investmentRange,
              label: "Investment Range",
              color: "warning",
            },
            {
              icon: <AspectRatio />,
              value: `${brand.areaRequired?.min}-${brand.areaRequired?.max} ${brand.areaRequired?.unit}`,
              label: "Area Requirement",
              color: "info",
            },
          ].map((stat, index) => (
            // Each stat card is wrapped in a Box that controls its width
            <Box
              key={index}
              sx={{
                flexGrow: 1, // Allows items to grow and fill space
                // Responsive width calculation
                width: {
                  xs: "100%",
                  sm: "calc(50% - 12px)", // For 2 columns (12px is half of gap)
                  md: "calc(25% - 18px)", // For 4 columns (18px is 3/4 of gap)
                },
              }}
            >
              <StatCard {...stat} theme={theme} />
            </Box>
          ))}
        </Box>
      </Container>

      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Paper
          elevation={4}
          sx={{ mb: 4, borderRadius: 3, overflow: "hidden" }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Franchise Details Navigation"
            indicatorSx={{
              height: 4,
              bgcolor: "white",
              borderRadius: "2px",
            }}
            sx={{
              bgcolor: "primary.main",
              "& .MuiTab-root": {
                color: "rgba(255, 255, 255, 0.7)",
                fontWeight: "bold",
                minHeight: 72,
                px: 3,
                "& .MuiTab-iconWrapper": {
                  marginRight: 1.5,
                },
                "&.Mui-selected": {
                  color: "white",
                },
                "&:hover": {
                  color: "white",
                  opacity: 0.9,
                },
              },
            }}
          >
            <Tab label="Overview" icon={<Description />} iconPosition="start" />
            <Tab
              label="Investment"
              icon={<MonetizationOn />}
              iconPosition="start"
            />
            <Tab label="Training" icon={<School />} iconPosition="start" />
            <Tab label="Locations" icon={<LocationOn />} iconPosition="start" />
            <Tab label="Gallery" icon={<CameraAlt />} iconPosition="start" />
            <Tab label="Process" icon={<Timeline />} iconPosition="start" />
          </Tabs>
        </Paper>

        <Grid container spacing={4} sx={{ width: "100%" }}>
          <Grid item xs={12} lg={8} ref={contentRef}>
            <AnimatePresence mode="wait">
              {activeTab === 0 && (
                <MotionBox
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <MotionCard
                    sx={{ mb: 4, borderRadius: 3, overflow: "hidden" }}
                  >
                    <Box
                      sx={{
                        p: 4,
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                      }}
                    >
                      <Typography variant="h4" fontWeight="bold" gutterBottom>
                        About {brand.brandName}
                      </Typography>
                      <Typography variant="h6" sx={{ opacity: 0.9 }}>
                        Your Gateway to Entrepreneurial Success
                      </Typography>
                    </Box>
                    <CardContent sx={{ p: 4 }}>
                      <Typography
                        paragraph
                        sx={{ fontSize: "1.1rem", lineHeight: 1.8, mb: 3 }}
                      >
                        <strong>{brand.brandName}</strong> represents more than
                        just a business opportunity - it's a pathway to
                        entrepreneurial freedom. Founded{" "}
                        {brand.brandfoundedYear} years ago, we've been
                        pioneering innovation in the {brand.businessModel}{" "}
                        sector, creating sustainable business models that
                        empower our franchise partners to achieve their dreams.
                      </Typography>

                      {/* Replaced Grid with a responsive Flexbox layout */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", md: "row" },
                          gap: 3,
                        }}
                      >
                        <Box
                          sx={{
                            flex: 1,
                            p: 3,
                            bgcolor: "grey.50",
                            borderRadius: 2,
                          }}
                        >
                          <Business sx={{ color: "primary.main", mb: 1 }} />
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            gutterBottom
                          >
                            Business Model
                          </Typography>
                          <Typography>{brand.businessModel}</Typography>
                        </Box>
                        <Box
                          sx={{
                            flex: 1,
                            p: 3,
                            bgcolor: "grey.50",
                            borderRadius: 2,
                          }}
                        >
                          <Psychology sx={{ color: "primary.main", mb: 1 }} />
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            gutterBottom
                          >
                            Our Vision
                          </Typography>
                          <Typography>{brand.brandVission}</Typography>
                        </Box>
                      </Box>

                      {brand?.franchiseModels?.length > 0 && (
                        <Box
                          sx={{
                            mt: 3,
                            p: 3,
                            bgcolor: "info.50",
                            borderRadius: 2,
                          }}
                        >
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            gutterBottom
                          >
                            Franchise Models Available
                          </Typography>
                          <Box
                            sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}
                          >
                            {brand.franchiseModels.map((model, index) => (
                              <Chip key={index} label={model} color="info" />
                            ))}
                          </Box>
                        </Box>
                      )}
                    </CardContent>
                  </MotionCard>

                  <MotionCard sx={{ mb: 4, borderRadius: 3 }}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        gutterBottom
                        sx={{ mb: 3 }}
                      >
                        Why Choose {brand.brandName}?
                      </Typography>
                      {/* Replaced Grid with a responsive Flexbox layout */}
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                        {[
                          {
                            icon: <Star />,
                            title: "Unique Selling Proposition",
                            desc: "Stand out in the market with our distinctive approach",
                            available: brand.uniqueSellingProposition,
                          },
                          {
                            icon: <TrendingUp />,
                            title: "Competitive Advantage",
                            desc: "Leverage our proven strategies for market dominance",
                            available: brand.competitiveAdvantage,
                          },
                          {
                            icon: <Security />,
                            title: "Exclusive Territory Rights",
                            desc: "Protected territory with guaranteed exclusivity",
                            available: brand.territoryRights,
                          },
                          {
                            icon: <Support />,
                            title: "Comprehensive Support",
                            desc: "End-to-end support from setup to operations",
                            available: brand.franchisorSupport,
                          },
                          {
                            icon: <Assessment />,
                            title: "Marketing Excellence",
                            desc: "Professional marketing support and campaigns",
                            available: brand.marketingSupport,
                          },
                          {
                            icon: <School />,
                            title: "Training Programs",
                            desc: "Comprehensive training for you and your team",
                            available: brand.trainingProgram,
                          },
                        ].map(
                          (feature, index) =>
                            feature.available && (
                              // Wrapper Box to control width for 1, 2, or 3 column layout
                              <Box
                                key={index}
                                sx={{
                                  display: "flex",
                                  width: {
                                    xs: "100%",
                                    sm: "calc(50% - 12px)", // 2 columns. 12px is half of gap (24px)
                                    md: "calc(33.333% - 16px)", // 3 columns. 16px is 2/3 of gap
                                  },
                                }}
                              >
                                <MotionCard
                                  whileHover={{ scale: 1.05 }}
                                  sx={{
                                    width: "100%", // Card fills the wrapper box
                                    cursor: "pointer",
                                    border: "2px solid transparent",
                                    "&:hover": { borderColor: "primary.main" },
                                  }}
                                >
                                  <CardContent
                                    sx={{ textAlign: "center", p: 3 }}
                                  >
                                    <Avatar
                                      sx={{
                                        bgcolor: "primary.main",
                                        mx: "auto",
                                        mb: 2,
                                        width: 60,
                                        height: 60,
                                      }}
                                    >
                                      {feature.icon}
                                    </Avatar>
                                    <Typography
                                      variant="h6"
                                      fontWeight="bold"
                                      gutterBottom
                                    >
                                      {feature.title}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      {feature.desc}
                                    </Typography>
                                  </CardContent>
                                </MotionCard>
                              </Box>
                            )
                        )}
                      </Box>
                    </CardContent>
                  </MotionCard>
                </MotionBox>
              )}

              {activeTab === 1 && (
                <MotionBox
                  key="investment"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {/* Main flex container to set the two primary cards side-by-side */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", lg: "row" },
                      gap: 4,
                    }}
                  >
                    {/* Left Card: Investment Breakdown */}
                    <MotionCard sx={{ flex: "2 1 0%", borderRadius: 3 }}>
                      <Box
                        sx={{
                          p: 4,
                          background:
                            "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
                          color: "white",
                        }}
                      >
                        <Typography variant="h4" fontWeight="bold">
                          Investment Breakdown
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9 }}>
                          Transparent pricing with no hidden costs
                        </Typography>
                      </Box>
                      <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
                        {/* Grid removed, TableContainer now fills the card */}
                        <TableContainer
                          component={Paper}
                          sx={{ boxShadow: 3, borderRadius: 2 }}
                        >
                          <Table>
                            <TableBody>
                              {[
                                {
                                  label: "Initial Franchise Fee",
                                  value: `₹${brand.initialFranchiseFee}`,
                                  icon: <LocalOffer />,
                                },
                                {
                                  label: "Total Investment Range",
                                  value: brand.investmentRange,
                                  icon: <AttachMoney />,
                                },
                                {
                                  label: "Working Capital",
                                  value: `₹${brand.workingCapital}`,
                                  icon: <AccountBalance />,
                                },
                                {
                                  label: "Equipment Costs",
                                  value: `₹${brand.equipmentCosts}`,
                                  icon: <BusinessCenter />,
                                },
                                {
                                  label: "Real Estate Costs",
                                  value: `₹${brand.realEstateCosts}`,
                                  icon: <Home />,
                                },
                                {
                                  label: "Royalty Fee",
                                  value: `${brand.royaltyFee}% of revenue`,
                                  icon: <ShowChart />,
                                },
                                {
                                  label: "Franchise Term",
                                  value: `${brand.franchiseTermLength} years`,
                                  icon: <Schedule />,
                                },
                              ].map((item, index) => (
                                <TableRow
                                  key={index}
                                  sx={{ "&:hover": { bgcolor: "grey.50" } }}
                                >
                                  <TableCell
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      fontWeight: "medium",
                                    }}
                                  >
                                    <Box sx={{ mr: 2, color: "primary.main" }}>
                                      {item.icon}
                                    </Box>
                                    {item.label}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      fontWeight: "bold",
                                      fontSize: "1.1rem",
                                    }}
                                  >
                                    {item.value}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </CardContent>
                    </MotionCard>

                    {/* Right Card: Space & Location Requirements */}
                    <MotionCard sx={{ flex: "1 1 0%", borderRadius: 3 }}>
                      <CardContent
                        sx={{
                          p: 4,
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                        }}
                      >
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                          Space & Location Requirements
                        </Typography>
                        {/* Replaced inner Grid with a responsive Flexbox layout */}
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            gap: 3,
                            flexGrow: 1,
                          }}
                        >
                          <Box
                            sx={{
                              flex: 1,
                              p: 3,
                              bgcolor: "primary.50",
                              borderRadius: 2,
                            }}
                          >
                            <CropLandscape
                              sx={{
                                color: "primary.main",
                                fontSize: 40,
                                mb: 2,
                              }}
                            />
                            <Typography
                              variant="h6"
                              fontWeight="bold"
                              gutterBottom
                            >
                              Space Requirement
                            </Typography>
                            <Typography
                              variant="h4"
                              color="primary.main"
                              fontWeight="bold"
                            >
                              {brand?.areaRequired?.min}-
                              {brand?.areaRequired?.max}
                            </Typography>
                            <Typography variant="h6" color="primary.main">
                              {brand?.areaRequired?.unit}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </MotionCard>
                  </Box>
                </MotionBox>
              )}

              {activeTab === 2 && (
                <MotionBox
                  key="training"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <MotionCard sx={{ borderRadius: 3 }}>
                    <Box
                      sx={{
                        p: 4,
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                      }}
                    >
                      <Typography variant="h4" fontWeight="bold">
                        Training & Support Program
                      </Typography>
                      <Typography variant="h6" sx={{ opacity: 0.9 }}>
                        Comprehensive support from day one
                      </Typography>
                    </Box>
                    <CardContent sx={{ p: 4 }}>
                      {/* Replaced Grid with a responsive Flexbox layout */}
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {[
                          {
                            title: "Initial Training",
                            icon: <School />,
                            available: brand.trainingProgram,
                            details:
                              "Comprehensive training program covering all aspects of operations",
                          },
                          {
                            title: "Ongoing Support",
                            icon: <SupportAgent />,
                            available: brand.ongoingSupport,
                            details:
                              "Continuous support through phone, email, and on-site visits",
                          },
                          {
                            title: "Marketing Support",
                            icon: <Assessment />,
                            available: brand.marketingSupport,
                            details:
                              "Professional marketing materials and campaign support",
                          },
                          {
                            title: "Operational Standards",
                            icon: <CheckCircle />,
                            available: brand.operationalStandards,
                            details:
                              "Detailed operational manuals and quality standards",
                          },
                        ].map((support, index) => (
                          // Each item is a flex item with responsive width
                          <Box
                            key={index}
                            sx={{
                              // On xs screens, 100% width. On md screens, 50% width minus half the gap
                              width: { xs: "100%", md: "calc(50% - 16px)" },
                              display: "flex",
                            }}
                          >
                            <MotionCard
                              whileHover={{ scale: 1.02 }}
                              sx={{
                                width: "100%", // Card fills the parent Box
                                opacity: support.available ? 1 : 0.5,
                                border: support.available
                                  ? "2px solid"
                                  : "2px dashed",
                                borderColor: support.available
                                  ? "success.main"
                                  : "grey.300",
                              }}
                            >
                              <CardContent sx={{ p: 3, textAlign: "center" }}>
                                <Avatar
                                  sx={{
                                    bgcolor: support.available
                                      ? "success.main"
                                      : "grey.300",
                                    mx: "auto",
                                    mb: 2,
                                    width: 60,
                                    height: 60,
                                  }}
                                >
                                  {support.icon}
                                </Avatar>
                                <Typography
                                  variant="h6"
                                  fontWeight="bold"
                                  gutterBottom
                                >
                                  {support.title}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {support.available
                                    ? support.details
                                    : "Contact for more details"}
                                </Typography>
                                {support.available && (
                                  <Chip
                                    label="Available"
                                    color="success"
                                    size="small"
                                    sx={{ mt: 2 }}
                                  />
                                )}
                              </CardContent>
                            </MotionCard>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </MotionCard>
                </MotionBox>
              )}

              {activeTab === 3 && (
                <MotionBox
                  key="locations"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <MotionCard sx={{ borderRadius: 3 }}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Our Presence Across India
                      </Typography>
                      {brand.brandFranchiseLocations &&
                      brand.brandFranchiseLocations.length > 0 ? (
                        <Grid container spacing={3}>
                          {brand.brandFranchiseLocations.map(
                            (location, index) => (
                              <Grid item xs={12} md={6} key={index}>
                                <MotionCard
                                  whileHover={{ scale: 1.02 }}
                                  sx={{
                                    border: "1px solid",
                                    borderColor: "divider",
                                    "&:hover": {
                                      borderColor: "primary.main",
                                      boxShadow: 3,
                                    },
                                  }}
                                >
                                  <CardContent>
                                    <Typography
                                      variant="h6"
                                      fontWeight="bold"
                                      gutterBottom
                                    >
                                      {location.city}, {location.state}
                                    </Typography>
                                    <Typography
                                      color="text.secondary"
                                      gutterBottom
                                    >
                                      {location.address}
                                    </Typography>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        mt: 2,
                                      }}
                                    >
                                      <Phone
                                        sx={{ mr: 1, color: "primary.main" }}
                                      />
                                      <Typography>{location.phone}</Typography>
                                    </Box>
                                    <Button
                                      variant="outlined"
                                      startIcon={<Launch />}
                                      href={location.googleMapsURl}
                                      target="_blank"
                                      sx={{ mt: 2 }}
                                      fullWidth
                                    >
                                      View on Maps
                                    </Button>
                                  </CardContent>
                                </MotionCard>
                              </Grid>
                            )
                          )}
                        </Grid>
                      ) : (
                        <Box sx={{ textAlign: "center", py: 4 }}>
                          <LocationOn
                            sx={{ fontSize: 80, color: "grey.300", mb: 2 }}
                          />
                          <Typography variant="h6" color="text.secondary">
                            Location information will be updated soon
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </MotionCard>
                </MotionBox>
              )}

              {activeTab === 4 && (
                <MotionBox
                  key="gallery"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <MotionCard sx={{ borderRadius: 3 }}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Brand Gallery
                      </Typography>
                      {brand.brandFranchiseImages &&
                      brand.brandFranchiseImages.length > 0 ? (
                        <Slider {...gallerySettings}>
                          {brand.brandFranchiseImages.map((image, index) => (
                            <Box key={index} sx={{ px: 1 }}>
                              <MotionBox
                                whileHover={{ scale: 1.05 }}
                                component="img"
                                src={image}
                                alt={`${brand.brandName} gallery image ${
                                  index + 1
                                }`}
                                sx={{
                                  width: "100%",
                                  height: 300,
                                  objectFit: "cover",
                                  borderRadius: 2,
                                  cursor: "pointer",
                                }}
                              />
                            </Box>
                          ))}
                        </Slider>
                      ) : (
                        <Box sx={{ textAlign: "center", py: 4 }}>
                          <CameraAlt
                            sx={{ fontSize: 80, color: "grey.300", mb: 2 }}
                          />
                          <Typography variant="h6" color="text.secondary">
                            Gallery images will be updated soon
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </MotionCard>
                </MotionBox>
              )}

              {activeTab === 5 && (
                <>
                  {/* Main container for the two-column layout */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", lg: "row" },
                      gap: 4,
                    }}
                  >
                    {/* Left Column (Main Content) */}
                    <Box
                      sx={{
                        flex: "2 1 0%",
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                      }}
                    >
                      <MotionBox
                        key="process"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <MotionCard sx={{ borderRadius: 3 }}>
                          <Box
                            sx={{
                              p: 4,
                              background:
                                "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)",
                              color: "white",
                            }}
                          >
                            <Typography variant="h4" fontWeight="bold">
                              Franchise Application Journey
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9 }}>
                              Step-by-step process to become a franchisee
                            </Typography>
                          </Box>
                          <CardContent sx={{ p: 4 }}>
                            <Stepper orientation="vertical">
                              {steps.map((step, index) => (
                                <Step key={step.label} active={true}>
                                  <StepLabel
                                    icon={
                                      <Avatar
                                        sx={{
                                          bgcolor: "primary.main",
                                          color: "white",
                                        }}
                                      >
                                        {step.icon}
                                      </Avatar>
                                    }
                                  >
                                    <Typography variant="h6" fontWeight="bold">
                                      {step.label}
                                    </Typography>
                                    <Typography color="text.secondary">
                                      {step.description}
                                    </Typography>
                                    <Button
                                      variant="text"
                                      size="small"
                                      sx={{ mt: 1 }}
                                      onClick={() => {
                                        if (index === 0) {
                                          setShowInquiryForm(true);
                                        }
                                      }}
                                    >
                                      {step.action}
                                    </Button>
                                  </StepLabel>
                                </Step>
                              ))}
                            </Stepper>
                          </CardContent>
                        </MotionCard>
                      </MotionBox>
                    </Box>

                    {/* Right Column (Sidebar) */}
                    <Box
                      sx={{
                        flex: "1 1 0%",
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                      }}
                    >
                      <MotionCard sx={{ borderRadius: 3, overflow: "hidden" }}>
                        <Box
                          sx={{
                            p: 3,
                            background:
                              "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)",
                            color: "white",
                          }}
                        >
                          <Typography
                            variant="h5"
                            fontWeight="bold"
                            gutterBottom
                          >
                            Get Started Today
                          </Typography>
                          <Typography sx={{ opacity: 0.9 }}>
                            Connect with our franchise team
                          </Typography>
                        </Box>
                        <CardContent sx={{ p: 3 }}>
                          <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            startIcon={<PersonAdd />}
                            onClick={() => setShowInquiryForm(true)}
                            sx={{ mb: 2, borderRadius: 3, py: 1.5 }}
                          >
                            Apply for Franchise
                          </Button>
                          <Button
                            variant="outlined"
                            fullWidth
                            size="large"
                            startIcon={<VideoCall />}
                            sx={{ mb: 2, borderRadius: 3, py: 1.5 }}
                          >
                            Schedule Video Call
                          </Button>
                          <Button
                            variant="outlined"
                            fullWidth
                            size="large"
                            startIcon={<GetApp />}
                            sx={{ mb: 3, borderRadius: 3, py: 1.5 }}
                          >
                            Download Info Pack
                          </Button>
                          <Divider sx={{ my: 3 }} />
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            gutterBottom
                          >
                            Contact Information
                          </Typography>
                          <List dense>
                            <ListItem disablePadding sx={{ mb: 1 }}>
                              <Phone sx={{ mr: 2, color: "primary.main" }} />
                              <ListItemText
                                primary={brand.brandContactInformation?.phone}
                              />
                            </ListItem>
                            <ListItem disablePadding sx={{ mb: 1 }}>
                              <Email sx={{ mr: 2, color: "primary.main" }} />
                              <ListItemText
                                primary={brand.brandContactInformation?.email}
                              />
                            </ListItem>
                            <ListItem disablePadding>
                              <LocationOn
                                sx={{ mr: 2, color: "primary.main" }}
                              />
                              <ListItemText
                                primary={`${brand.brandContactInformation?.city}, ${brand.brandContactInformation?.state}`}
                              />
                            </ListItem>
                          </List>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              mt: 3,
                              justifyContent: "center",
                            }}
                          >
                            {[
                              {
                                url: brand.brandContactInformation?.facebookURl,
                                icon: <Facebook />,
                              },
                              {
                                url: brand.brandContactInformation?.twitterURl,
                                icon: <Twitter />,
                              },
                              {
                                url: brand.brandContactInformation
                                  ?.instagramURl,
                                icon: <Instagram />,
                              },
                              {
                                url: brand.brandContactInformation?.linkedinURl,
                                icon: <LinkedIn />,
                              },
                            ].map(
                              (social, index) =>
                                social.url && (
                                  <IconButton
                                    key={index}
                                    href={social.url}
                                    target="_blank"
                                    sx={{
                                      bgcolor: "primary.main",
                                      color: "white",
                                      "&:hover": { bgcolor: "primary.dark" },
                                    }}
                                  >
                                    {social.icon}
                                  </IconButton>
                                )
                            )}
                          </Box>
                        </CardContent>
                      </MotionCard>

                      <MotionCard sx={{ borderRadius: 3 }}>
                        <CardContent sx={{ p: 3 }}>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            gutterBottom
                          >
                            Meet the Brand Owner
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 2,
                            }}
                          >
                            <Avatar
                              sx={{
                                width: 60,
                                height: 60,
                                mr: 2,
                                bgcolor: "primary.main",
                              }}
                            >
                              {brand.brandOwnerInformation?.name?.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="h6" fontWeight="bold">
                                {brand.brandOwnerInformation?.name}
                              </Typography>
                              <Typography color="text.secondary">
                                Founder & CEO
                              </Typography>
                            </Box>
                          </Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                          >
                            {brand.brandOwnerInformation?.email}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {brand.brandOwnerInformation?.phone}
                          </Typography>
                          {brand.brandOwnerInformation?.linkedinURl && (
                            <Button
                              variant="outlined"
                              startIcon={<LinkedIn />}
                              href={brand.brandOwnerInformation.linkedinURl}
                              target="_blank"
                              fullWidth
                              sx={{ mt: 2 }}
                            >
                              Connect on LinkedIn
                            </Button>
                          )}
                        </CardContent>
                      </MotionCard>
                    </Box>
                  </Box>
                </>
              )}
            </AnimatePresence>
          </Grid>
        </Grid>
      </Container>

      <Dialog
        open={showInquiryForm}
        onClose={() => setShowInquiryForm(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <FranchiseInquiryForm
          brand={brand}
          onClose={() => setShowInquiryForm(false)}
        />
      </Dialog>
    </>
  );
};

export default BrandDetail;