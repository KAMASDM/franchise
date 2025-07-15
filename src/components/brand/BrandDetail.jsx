import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  Breadcrumbs,
  Link,
  Tabs,
  Tab,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  LocationOn,
  Star,
  CheckCircle,
  Phone,
  Business,
  Timeline,
  AttachMoney,
  Support,
  School,
  Home,
  Store,
  BusinessCenter,
  SupportAgent,
  EmojiEvents,
  ArrowBack,
  Email,
  Language,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import FranchiseInquiryForm from "../forms/FranchiseInquiryForm";

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionGrid = motion(Grid);

const BrandDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [brand, setBrand] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [showInquiryForm, setShowInquiryForm] = useState(false);

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      try {
        const brandsCollection = collection(db, "brands");
        const q = query(brandsCollection, where("status", "==", "active"));
        const querySnapshot = await getDocs(q);
        const brandsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBrand(brandsData.find((brand) => brand.id === id));
        setError(null);
      } catch (err) {
        console.error("Error fetching brands:", err);
        setError("Failed to load brands. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [id]);

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
        <Button
          variant="contained"
          onClick={() => window.location.reload()}
          sx={{ mt: 2, borderRadius: 25 }}
        >
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
          sx={{ mt: 2, borderRadius: 25 }}
        >
          Back to Brands
        </Button>
      </Container>
    );
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Breadcrumbs>
          <Link
            underline="hover"
            color="inherit"
            onClick={() => navigate("/")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              cursor: "pointer",
            }}
          >
            <Home fontSize="small" />
            Home
          </Link>
          <Link
            underline="hover"
            color="inherit"
            onClick={() => navigate("/brands")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              cursor: "pointer",
            }}
          >
            <Store fontSize="small" />
            Brands
          </Link>
          <Typography color="text.primary">{brand.brandName}</Typography>
        </Breadcrumbs>
      </Box>

      {/* Hero Section */}
      <MotionCard
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        sx={{ mb: 6, borderRadius: 4, overflow: "hidden", boxShadow: 3 }}
      >
        <Box
          sx={{
            height: { xs: 300, md: 400 },
            backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.4))`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "center",
            color: "white",
            p: { xs: 3, md: 6 },
            position: "relative",
            backgroundColor: "primary.main",
          }}
        >
          <Box sx={{ maxWidth: 800, zIndex: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mr: 3,
                  backgroundColor: "white",
                  color: "primary.main",
                  fontSize: "2rem",
                  fontWeight: "bold",
                }}
              >
                {brand.brandName.charAt(0)}
              </Avatar>
              <Box>
                <Typography
                  variant="h2"
                  fontWeight="bold"
                  sx={{ mb: 1, fontSize: { xs: "2rem", md: "3rem" } }}
                >
                  {brand.brandName}
                </Typography>
                <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
                  {brand.industries.map((industry, index) => (
                    <Chip
                      key={index}
                      label={industry}
                      sx={{
                        backgroundColor: "secondary.main",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    />
                  ))}
                  <Chip
                    icon={<Star />}
                    label="4.5 Rating"
                    sx={{
                      backgroundColor: "warning.main",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  />
                </Box>
              </Box>
            </Box>
            <Typography
              variant="h6"
              sx={{ maxWidth: 600, lineHeight: 1.6, mb: 4 }}
            >
              {brand.brandMission}
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => setShowInquiryForm(true)}
                sx={{
                  backgroundColor: "#FFD700",
                  color: "black",
                  fontWeight: "bold",
                  borderRadius: 25,
                  px: 4,
                  "&:hover": { backgroundColor: "#FFC107" },
                }}
              >
                Request Information
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<Phone />}
                href={`tel:${brand.brandContactInformation.phone}`}
                sx={{
                  borderColor: "white",
                  color: "white",
                  borderRadius: 25,
                  px: 4,
                  "&:hover": {
                    borderColor: "#FFD700",
                    backgroundColor: "rgba(255,215,0,0.1)",
                  },
                }}
              >
                Call Now
              </Button>
            </Box>
          </Box>

          {/* Decorative Elements */}
          <Box
            sx={{
              position: "absolute",
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: "50%",
              zIndex: 1,
            }}
          />
        </Box>
      </MotionCard>

      {/* Investment Overview */}
      <MotionBox
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        sx={{ mb: 6 }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ mb: 4, textAlign: "center" }}
        >
          Investment Overview
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {[
            {
              icon: <AttachMoney />,
              value: brand.investmentRange,
              label: "Total Investment",
              color: "primary",
            },
            {
              icon: <Business />,
              value: `$${brand.initialFranchiseFee}`,
              label: "Initial Franchise Fee",
              color: "secondary",
            },
            {
              icon: <Timeline />,
              value: `${brand.franchiseTermLength} years`,
              label: "Franchise Term",
              color: "success",
            },
            {
              icon: <Support />,
              value: `${brand.royaltyFee}%`,
              label: "Royalty Fee",
              color: "warning",
            },
          ].map((metric, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <MotionCard
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                sx={{
                  textAlign: "center",
                  p: 3,
                  borderRadius: 3,
                  height: "100%",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 4,
                  },
                }}
              >
                <Avatar
                  sx={{
                    mx: "auto",
                    mb: 2,
                    backgroundColor: `${metric.color}.main`,
                    width: 70,
                    height: 70,
                  }}
                >
                  {metric.icon}
                </Avatar>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color={`${metric.color}.main`}
                  sx={{ mb: 1 }}
                >
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

      {/* Tabs Section */}
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        sx={{ mb: 6 }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 4 }}
        >
          <Tab label="About" />
          <Tab label="Franchise Details" />
          <Tab label="Support & Training" />
          <Tab label="Locations" />
          <Tab label="Contact" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            <MotionGrid
              container
              spacing={4}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  About {brand.brandName}
                </Typography>
                <Typography paragraph>
                  <strong>Founded:</strong> {brand.brandfoundedYear} years ago
                </Typography>
                <Typography paragraph>
                  <strong>Business Model:</strong> {brand.businessModel}
                </Typography>
                <Typography paragraph>
                  <strong>Franchise Model:</strong> {brand.franchiseModel}
                </Typography>
                <Typography paragraph>
                  <strong>Mission:</strong> {brand.brandMission}
                </Typography>
                <Typography paragraph>
                  <strong>Vision:</strong> {brand.brandVission}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Key Advantages
                </Typography>
                <List>
                  {brand.uniqueSellingProposition && (
                    <ListItem>
                      <ListItemIcon>
                        <EmojiEvents color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Unique Selling Proposition" />
                    </ListItem>
                  )}
                  {brand.competitiveAdvantage && (
                    <ListItem>
                      <ListItemIcon>
                        <Star color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Competitive Advantage" />
                    </ListItem>
                  )}
                  {brand.territoryRights && (
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Exclusive Territory Rights" />
                    </ListItem>
                  )}
                  {brand.nonCompeteRestrictions && (
                    <ListItem>
                      <ListItemIcon>
                        <BusinessCenter color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Non-Compete Restrictions" />
                    </ListItem>
                  )}
                </List>
              </Grid>
            </MotionGrid>
          )}

          {tabValue === 1 && (
            <MotionGrid
              container
              spacing={4}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Financial Details
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Initial Franchise Fee"
                      secondary={`$${brand.initialFranchiseFee}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Total Investment Range"
                      secondary={brand.investmentRange}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Royalty Fee"
                      secondary={`${brand.royaltyFee}%`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Marketing Fee"
                      secondary={`${brand.marketingFee}%`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Financing Options"
                      secondary={brand.financingOptions}
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Franchise Terms
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Franchise Term Length"
                      secondary={`${brand.franchiseTermLength} years`}
                    />
                  </ListItem>
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
              </Grid>
            </MotionGrid>
          )}

          {tabValue === 2 && (
            <MotionGrid
              container
              spacing={4}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Training & Support
                </Typography>
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
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Franchisee Requirements
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <AttachMoney color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Working Capital"
                      secondary={`$${brand.workingCapital}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <BusinessCenter color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Franchisee Obligations"
                      secondary={brand.franchiseeObligations ? "Yes" : "No"}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Home color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Real Estate Costs"
                      secondary={`$${brand.realEstateCosts}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Business color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Equipment Costs"
                      secondary={`$${brand.equipmentCosts}`}
                    />
                  </ListItem>
                </List>
              </Grid>
            </MotionGrid>
          )}

          {tabValue === 3 && (
            <MotionBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Franchise Locations
              </Typography>
              <Grid container spacing={3}>
                {brand.brandFranchiseLocations.map((location, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Card sx={{ height: "100%" }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {location.address}
                        </Typography>
                        <Typography color="text.secondary" gutterBottom>
                          {location.city}, {location.state} {location.zipCode}
                        </Typography>
                        <Typography paragraph>
                          <Phone fontSize="small" sx={{ mr: 1 }} />
                          {location.phone}
                        </Typography>
                        <Button
                          variant="outlined"
                          startIcon={<LocationOn />}
                          href={location.googleMapsURl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View on Map
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </MotionBox>
          )}

          {tabValue === 4 && (
            <MotionGrid
              container
              spacing={4}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Grid item xs={12} md={6}>
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
                  <ListItem>
                    <ListItemIcon>
                      <Language color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Website"
                      secondary={
                        <Link
                          href={brand.brandContactInformation.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {brand.brandContactInformation.website}
                        </Link>
                      }
                    />
                  </ListItem>
                </List>
                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                  {brand.brandContactInformation.facebookURl && (
                    <IconButton
                      href={brand.brandContactInformation.facebookURl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Facebook color="primary" />
                    </IconButton>
                  )}
                  {brand.brandContactInformation.twitterURl && (
                    <IconButton
                      href={brand.brandContactInformation.twitterURl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Twitter color="primary" />
                    </IconButton>
                  )}
                  {brand.brandContactInformation.instagramURl && (
                    <IconButton
                      href={brand.brandContactInformation.instagramURl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Instagram color="primary" />
                    </IconButton>
                  )}
                  {brand.brandContactInformation.linkedinURl && (
                    <IconButton
                      href={brand.brandContactInformation.linkedinURl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LinkedIn color="primary" />
                    </IconButton>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Brand Owner
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mr: 3,
                      backgroundColor: "primary.main",
                      color: "white",
                      fontSize: "2rem",
                      fontWeight: "bold",
                    }}
                  >
                    {brand.brandOwnerInformation.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {brand.brandOwnerInformation.name}
                    </Typography>
                    <Typography color="text.secondary">
                      {brand.brandOwnerInformation.bio}
                    </Typography>
                  </Box>
                </Box>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Email color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email"
                      secondary={brand.brandOwnerInformation.email}
                    />
                  </ListItem>
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
              </Grid>
            </MotionGrid>
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
          borderRadius: 4,
          p: 6,
          textAlign: "center",
          mb: 6,
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
            backgroundColor: "#FFD700",
            color: "black",
            fontWeight: "bold",
            borderRadius: 25,
            px: 6,
            py: 2,
            fontSize: "1.1rem",
            "&:hover": { backgroundColor: "#FFC107" },
          }}
        >
          Request Franchise Information
        </Button>
      </MotionBox>

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
