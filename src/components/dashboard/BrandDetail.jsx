import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
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
  Link,
  Divider,
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
  BusinessCenter,
  SupportAgent,
  EmojiEvents,
  Email,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Person,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const BrandDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [brand, setBrand] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <MotionCard
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        sx={{ mb: 6, overflow: "hidden", boxShadow: 3 }}
      >
        <Box
          sx={{
            backgroundImage: brand.brandImage
              ? `url(${brand.brandImage})`
              : "linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.4))",
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
          </Box>

          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.4)",
              zIndex: 1,
            }}
          />
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
                <strong>Founded:</strong> {brand.brandfoundedYear} years ago
              </Typography>
              <Typography paragraph>
                <strong>Business Model:</strong> {brand.businessModel}
              </Typography>
              <Typography paragraph>
                <strong>Franchise Model:</strong> {brand.franchiseModel}
              </Typography>
              <Typography paragraph>
                <strong>Vision:</strong> {brand.brandVission}
              </Typography>
            </CardContent>
          </MotionCard>

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
                    <Business color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Initial Franchise Fee"
                    secondary={`$${brand.initialFranchiseFee}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Timeline color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Franchise Term"
                    secondary={`${brand.franchiseTermLength} years`}
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
                            bgcolor: "lightgray",
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
                        secondary={`$${brand.workingCapital}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Real Estate Costs"
                        secondary={`$${brand.realEstateCosts}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Equipment Costs"
                        secondary={`$${brand.equipmentCosts}`}
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
              <ListItem>
                <ListItemIcon>
                  <Person color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Name"
                  secondary={brand.brandOwnerInformation.name}
                />
              </ListItem>
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
            </CardContent>
          </MotionCard>
        </Box>
      </MotionBox>
    </Container>
  );
};

export default BrandDetail;
