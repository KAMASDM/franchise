import React, { useState } from "react";
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
  CropLandscape,
  EmojiEvents, // Import missing icons
  CheckCircle, // Import missing icons
  BusinessCenter, // Import missing icons
  SupportAgent, // Import missing icons
  Person, // Import missing icons
  Timeline, // Import missing icons
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
import FranchiseInquiryForm from "../forms/FranchiseInquiryForm";
import { slugToBrandName } from "../../utils/brandUtils";
import { 
  BUSINESS_MODEL_CONFIG, 
  REVENUE_MODELS, 
  SUPPORT_TYPES 
} from "../../constants/businessModels";

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
  const brandName = slugToBrandName(slug);
  const navigate = useNavigate();
  // Update the call to useBrand with the new object structure
  const { brand, loading, error } = useBrand({ brandName });
  const [showInquiryForm, setShowInquiryForm] = useState(false);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 1,
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

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
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
            backgroundImage: `url(${brand.brandImage})`,
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
              {brand.brandName}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: "60ch" }}>
              {brand.brandMission}
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
                About Us
              </Typography>
              <Typography paragraph>
                <strong>Founded:</strong> {brand.brandfoundedYear}
              </Typography>
              <Typography paragraph>
                <strong>Business Model:</strong> {brand.businessModel}
              </Typography>
              <Typography paragraph>
                <strong>Franchise Model:</strong>{" "}
                {brand?.franchiseModels?.join(", ")}
              </Typography>
              <Typography paragraph>
                <strong>Vision:</strong> {brand.brandVission}
              </Typography>
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
                      Revenue Model: {REVENUE_MODELS[brand.revenueModel].label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {REVENUE_MODELS[brand.revenueModel].description}
                    </Typography>
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
                    secondary={brand.investmentRange}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CropLandscape color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Area Required"
                    secondary={`${brand?.areaRequired?.min} - ${brand?.areaRequired?.max} ${brand?.areaRequired?.unit}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Business color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Initial Franchise Fee"
                    secondary={`₹${brand.initialFranchiseFee}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Timeline color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Franchise Term"
                    secondary={`${brand.franchiseTermLength}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Support color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Royalty Fee"
                    secondary={`${brand.royaltyFee}%`}
                  />
                </ListItem>
              </List>
            </CardContent>
          </MotionCard>

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
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Phone color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Phone"
                    secondary={brand.brandContactInformation.phone}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Email color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email"
                    secondary={brand.brandContactInformation.email}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LocationOn color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Address"
                    secondary={`${brand.brandContactInformation.address}, ${brand.brandContactInformation.city}, ${brand.brandContactInformation.state} ${brand.brandContactInformation.zipCode}`}
                  />
                </ListItem>
              </List>
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                {brand.brandContactInformation.facebookURl && (
                  <IconButton
                    href={brand.brandContactInformation.facebookURl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit Facebook page"
                  >
                    <Facebook color="primary" />
                  </IconButton>
                )}
                {brand.brandContactInformation.twitterURl && (
                  <IconButton
                    href={brand.brandContactInformation.twitterURl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit Twitter page"
                  >
                    <Twitter color="primary" />
                  </IconButton>
                )}
                {brand.brandContactInformation.instagramURl && (
                  <IconButton
                    href={brand.brandContactInformation.instagramURl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit Instagram page"
                  >
                    <Instagram color="primary" />
                  </IconButton>
                )}
                {brand.brandContactInformation.linkedinURl && (
                  <IconButton
                    href={brand.brandContactInformation.linkedinURl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit LinkedIn page"
                  >
                    <LinkedIn color="primary" />
                  </IconButton>
                )}
              </Box>
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
              {brand.brandFranchiseLocations.map((location, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {location.address}
                  </Typography>
                  <Typography color="text.secondary">
                    {location.city}, {location.state} {location.zipCode}
                  </Typography>
                  <Typography sx={{ mt: 1 }}>
                    <Phone fontSize="small" sx={{ mr: 1 }} />
                    {location.phone}
                  </Typography>
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
                  {index < brand.brandFranchiseLocations.length - 1 && (
                    <Divider sx={{ my: 2 }} />
                  )}
                </Box>
              ))}
            </CardContent>
          </MotionCard>
        </Box>

        {/* Right Side */}
        <Box sx={{ flex: 2, minWidth: 0 }}>
          {/* Key Advantages Card */}
          <MotionCard
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            sx={{ mb: 4, boxShadow: 3 }}
          >
            <CardContent>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Key Advantages
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                {[
                  {
                    condition: brand.uniqueSellingProposition,
                    icon: <EmojiEvents color="primary" />,
                    text: "Unique Selling Proposition",
                  },
                  {
                    condition: brand.competitiveAdvantage,
                    icon: <Star color="primary" />,
                    text: "Competitive Advantage",
                  },
                  {
                    condition: brand.territoryRights,
                    icon: <CheckCircle color="primary" />,
                    text: "Exclusive Territory Rights",
                  },
                  {
                    condition: brand.nonCompeteRestrictions,
                    icon: <BusinessCenter color="primary" />,
                    text: "Non-Compete Restrictions",
                  },
                  {
                    condition: brand.franchisorSupport,
                    icon: <SupportAgent color="primary" />,
                    text: "Franchisor Support",
                  },
                  {
                    condition: brand.marketingSupport,
                    icon: <Business color="primary" />,
                    text: "Marketing Support",
                  },
                ].map(
                  (item, index) =>
                    item.condition && (
                      <Box
                        key={index}
                        sx={{
                          flex: "1 1 calc(50% - 16px)",
                          minWidth: 200,
                          display: "flex",
                          alignItems: "center",
                          p: 2,
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 2,
                        }}
                      >
                        <Avatar
                          sx={{
                            mr: 2,
                            bgcolor: "primary.50",
                            width: 40,
                            height: 40,
                          }}
                        >
                          {item.icon}
                        </Avatar>
                        <Typography variant="body1">{item.text}</Typography>
                      </Box>
                    )
                )}
              </Box>
            </CardContent>
          </MotionCard>
          {brand.brandFranchiseImages?.length > 0 && (
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
                <Slider {...sliderSettings}>
                  {brand.brandFranchiseImages.map((image, index) => (
                    <Box key={index} sx={{ px: 1.5 }}>
                      <Box
                        component="img"
                        src={image}
                        alt={`Franchise gallery image ${index + 1}`}
                        sx={{
                          width: "100%",
                          objectFit: "cover",
                          borderRadius: 2,
                        }}
                      />
                    </Box>
                  ))}
                </Slider>
              </CardContent>
            </MotionCard>
          )}
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
                    <ListItem>
                      <ListItemText
                        primary="Working Capital"
                        secondary={`₹${brand.workingCapital}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Real Estate Costs"
                        secondary={`₹${brand.realEstateCosts}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Equipment Costs"
                        secondary={`₹${brand.equipmentCosts}`}
                      />
                    </ListItem>
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
                        <Business color="primary" />
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

          {/* Brand Owner Card */}
          <MotionCard
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            sx={{ boxShadow: 3 }}
          >
            <CardContent>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Brand Owner
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                <Box sx={{ flex: 1, minWidth: 300 }}>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Person color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Name"
                        secondary={brand.brandOwnerInformation.name}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Email color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Email"
                        secondary={brand.brandOwnerInformation.email}
                      />
                    </ListItem>
                  </List>
                </Box>
                <Box sx={{ flex: 1, minWidth: 300 }}>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Phone color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Phone"
                        secondary={brand.brandOwnerInformation.phone}
                      />
                    </ListItem>
                    {brand.brandOwnerInformation.linkedinURl && (
                      <ListItem>
                        <ListItemIcon>
                          <LinkedIn color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="LinkedIn"
                          secondary={
                            <Link
                              href={brand.brandOwnerInformation.linkedinURl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Profile
                            </Link>
                          }
                        />
                      </ListItem>
                    )}
                  </List>
                </Box>
              </Box>
            </CardContent>
          </MotionCard>
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