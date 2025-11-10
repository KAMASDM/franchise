import React, { useState, useEffect } from "react"; // Added useEffect
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
  CircularProgress,
  Grid,
  Alert,
  CardHeader,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
} from "@mui/material";
import {
  LocationOn,
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
  CropLandscape,
  AdminPanelSettings,
  ThumbUp,
  ThumbDown,
  Language,
  Info,
  Gavel,
  Storefront,
  Edit,
  Save,
  Cancel,
  ExpandMore,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { db } from "../../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useBrand } from "../../hooks/useBrand";
import logger from "../../utils/logger";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useAdminStatus } from "../../hooks/useAdminStatus";
import { useAuth } from "../../context/AuthContext";

const MotionCard = motion(Card);

const InfoItem = ({ icon, primary, secondary, isLink = false }) => (
    <ListItem dense>
        <ListItemIcon sx={{minWidth: '40px'}}>{icon}</ListItemIcon>
        {isLink && secondary ? (
             <Link href={secondary.startsWith('http') ? secondary : `https://${secondary}`} target="_blank" rel="noopener noreferrer">{primary}</Link>
        ) : (
            <ListItemText primary={primary} secondary={secondary || "Not Provided"} />
        )}
    </ListItem>
);

const AdminActions = ({ brand, setBrandLocally }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleStatusChange = async (newStatus) => {
        setIsSubmitting(true);
        try {
            const brandRef = doc(db, 'brands', brand.id);
            await updateDoc(brandRef, { status: newStatus });
            // Correctly update the brand state via the passed function
            setBrandLocally(prevBrand => ({ ...prevBrand, status: newStatus }));
        } catch (error) {
            logger.error("Error updating status:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card sx={{ mb: 4, bgcolor: 'secondary.light', border: '1px solid', borderColor: 'secondary.main' }}>
            <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                    <AdminPanelSettings sx={{ mr: 1 }} />
                    <Typography variant="h6" fontWeight="bold">Admin Actions</Typography>
                </Box>
                <Chip
                    label={`Current Status: ${brand.status}`}
                    color={brand.status === 'active' ? 'success' : brand.status === 'pending' ? 'warning' : 'error'}
                    sx={{ mb: 2 }}
                />
                <Box display="flex" gap={2}>
                    {(brand.status === 'pending' || brand.status === 'inactive') && (
                        <Button variant="contained" color="success" startIcon={<ThumbUp />} onClick={() => handleStatusChange('active')} disabled={isSubmitting}>
                            Approve & Activate
                        </Button>
                    )}
                    {brand.status === 'active' && (
                         <Button variant="contained" color="error" startIcon={<ThumbDown />} onClick={() => handleStatusChange('inactive')} disabled={isSubmitting}>
                            Deactivate
                        </Button>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

const BrandDetail = () => {
  // Get the id parameter (which could be either a Firestore ID or a slug)
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isAdmin } = useAdminStatus();

  // Edit mode states
  const [editMode, setEditMode] = useState(false);
  const [editedBrand, setEditedBrand] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Determine if the id parameter is a Firestore ID or a slug
  // Firestore IDs are typically 20+ characters of alphanumeric
  // Slugs contain hyphens and are lowercase brand names
  const isFirestoreId = id && id.length > 15 && !id.includes("-");
  
  // If it's a slug (contains hyphens), use it as a slug
  // Otherwise, it's either a Firestore ID or a simple brand name
  const slug = !isFirestoreId && id && id.includes("-") ? id : null;

  // Use the updated hook with either the slug or Firestore id
  const { brand, setBrand: setBrandLocally, loading, error } = useBrand(
    { slug, id: isFirestoreId ? id : null }, 
    user
  );

  // Initialize editedBrand when brand loads
  useEffect(() => {
    if (brand) {
      setEditedBrand(brand);
    }
  }, [brand]);

  // Check if current user is the brand owner
  const isBrandOwner = user && brand && user.uid === brand.userId;

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    adaptiveHeight: true,
  };

  // Handle simple field changes
  const handleChange = (field, value) => {
    setEditedBrand(prev => ({ ...prev, [field]: value }));
  };

  // Handle nested field changes (e.g., brandOwnerInformation)
  const handleNestedChange = (parent, field, value) => {
    setEditedBrand(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  // Handle array changes
  const handleArrayChange = (field, value) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(item => item);
    setEditedBrand(prev => ({ ...prev, [field]: arrayValue }));
  };

  // Save changes
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const brandRef = doc(db, 'brands', brand.id);
      await updateDoc(brandRef, {
        ...editedBrand,
        updatedAt: new Date().toISOString()
      });
      setBrandLocally(editedBrand);
      setEditMode(false);
      alert('Brand updated successfully!');
    } catch (error) {
      logger.error("Error updating brand:", error);
      alert('Error updating brand. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditedBrand(brand);
    setEditMode(false);
  };

  if (loading) {
    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh"><CircularProgress /></Box>;
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button variant="contained" onClick={() => navigate('/dashboard/admin-verify')}>Back to Verification List</Button>
      </Container>
    );
  }

  if (!brand) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h4" color="text.secondary">Brand not found</Typography>
        <Button variant="contained" onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {isAdmin && <AdminActions brand={brand} setBrandLocally={setBrandLocally} />}

      {/* Edit Mode Controls - Only show for brand owner */}
      {isBrandOwner && !editMode && (
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => setEditMode(true)}
            color="primary"
          >
            Edit Brand
          </Button>
        </Box>
      )}

      {isBrandOwner && editMode && (
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
            color="success"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<Cancel />}
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
        </Box>
      )}

      {/* === HEADER CARD === */}
      <MotionCard sx={{ mb: 3 }} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <CardHeader
            avatar={<Avatar src={editedBrand.brandImage || editedBrand.brandLogo} sx={{ width: 60, height: 60 }} variant="rounded" />}
            title={editMode ? (
              <TextField
                value={editedBrand.brandName || ''}
                onChange={(e) => handleChange('brandName', e.target.value)}
                fullWidth
                label="Brand Name"
              />
            ) : editedBrand.brandName}
            titleTypographyProps={!editMode && {variant: 'h4', fontWeight: 'bold'}}
            subheader={editMode ? (
              <Box sx={{ mt: 1 }}>
                <TextField
                  type="number"
                  value={editedBrand.foundedYear || editedBrand.brandfoundedYear || ''}
                  onChange={(e) => handleChange('foundedYear', e.target.value)}
                  label="Founded Year"
                  sx={{ mr: 2 }}
                />
                <TextField
                  value={editedBrand.brandOwnerInformation?.name || editedBrand.ownerInfo?.name || ''}
                  onChange={(e) => handleNestedChange('brandOwnerInformation', 'name', e.target.value)}
                  label="Owner Name"
                />
              </Box>
            ) : `Founded in ${editedBrand.foundedYear || editedBrand.brandfoundedYear} | Owner: ${editedBrand.brandOwnerInformation?.name || editedBrand.ownerInfo?.name}`}
          />
        <CardContent>
          {editMode ? (
            <>
              <TextField
                fullWidth
                multiline
                rows={2}
                value={editedBrand.brandMission || ''}
                onChange={(e) => handleChange('brandMission', e.target.value)}
                label="Brand Mission"
                sx={{ mb: 2 }}
              />
              <Divider sx={{ my: 2 }} />
              <TextField
                fullWidth
                multiline
                rows={3}
                value={editedBrand.brandVision || editedBrand.brandVission || ''}
                onChange={(e) => handleChange('brandVision', e.target.value)}
                label="Brand Vision"
              />
            </>
          ) : (
            <>
              <Typography variant="h6" color="text.secondary">{editedBrand.brandMission}</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" fontWeight="bold">Brand Vision</Typography>
              <Typography paragraph>{editedBrand.brandVision || editedBrand.brandVission || "Not Provided"}</Typography>
            </>
          )}
        </CardContent>
      </MotionCard>

      {/* === EDIT MODE: COMPREHENSIVE FORM === */}
      {editMode && (
        <Box sx={{ mb: 3 }}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6" fontWeight="bold">Basic Information</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Brand Name"
                    value={editedBrand.brandName || ''}
                    onChange={(e) => handleChange('brandName', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="URL Slug"
                    value={editedBrand.slug || ''}
                    onChange={(e) => handleChange('slug', e.target.value)}
                    helperText="Unique URL identifier"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Number of Outlets"
                    type="number"
                    value={editedBrand.brandTotalOutlets || editedBrand.numberOfOutlets || ''}
                    onChange={(e) => handleChange('brandTotalOutlets', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Brand Rating"
                    type="number"
                    inputProps={{ step: 0.1, min: 0, max: 5 }}
                    value={editedBrand.brandRating || ''}
                    onChange={(e) => handleChange('brandRating', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Business Model"
                    value={editedBrand.businessModel || ''}
                    onChange={(e) => handleChange('businessModel', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Franchise Models (comma-separated)"
                    value={editedBrand.franchiseModels?.join(', ') || ''}
                    onChange={(e) => handleArrayChange('franchiseModels', e.target.value)}
                    helperText="e.g., Unit Franchise, Master Franchise"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Industries (comma-separated)"
                    value={editedBrand.industries?.join(', ') || ''}
                    onChange={(e) => handleArrayChange('industries', e.target.value)}
                    helperText="e.g., Food & Beverage, Retail"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Business Models (comma-separated)"
                    value={editedBrand.businessModels?.join(', ') || ''}
                    onChange={(e) => handleArrayChange('businessModels', e.target.value)}
                    helperText="e.g., B2B, B2C, Hybrid"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Revenue Model"
                    value={editedBrand.revenueModel || ''}
                    onChange={(e) => handleChange('revenueModel', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Support Types (comma-separated)"
                    value={editedBrand.supportTypes?.join(', ') || ''}
                    onChange={(e) => handleArrayChange('supportTypes', e.target.value)}
                    helperText="e.g., Training, Marketing, Operations"
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6" fontWeight="bold">Investment & Financials</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Total Investment (₹)"
                    type="number"
                    value={editedBrand.totalInvestment || editedBrand.brandInvestment || ''}
                    onChange={(e) => handleChange('totalInvestment', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Franchise Fee (₹)"
                    type="number"
                    value={editedBrand.initialFranchiseFee || editedBrand.franchiseFee || ''}
                    onChange={(e) => handleChange('initialFranchiseFee', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Security Deposit (₹)"
                    type="number"
                    value={editedBrand.securityDeposit || ''}
                    onChange={(e) => handleChange('securityDeposit', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Working Capital (₹)"
                    type="number"
                    value={editedBrand.workingCapital || ''}
                    onChange={(e) => handleChange('workingCapital', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Equipment Costs (₹)"
                    type="number"
                    value={editedBrand.equipmentCosts || ''}
                    onChange={(e) => handleChange('equipmentCosts', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Real Estate Costs (₹)"
                    type="number"
                    value={editedBrand.realEstateCosts || ''}
                    onChange={(e) => handleChange('realEstateCosts', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Royalty Fee"
                    value={editedBrand.royaltyFee || ''}
                    onChange={(e) => handleChange('royaltyFee', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Brand/Marketing Fee"
                    value={editedBrand.brandFee || ''}
                    onChange={(e) => handleChange('brandFee', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Payback Period"
                    value={editedBrand.payBackPeriod || ''}
                    onChange={(e) => handleChange('payBackPeriod', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Expected Annual Revenue (₹)"
                    type="number"
                    value={editedBrand.expectedRevenue || ''}
                    onChange={(e) => handleChange('expectedRevenue', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="EBITDA Margin"
                    value={editedBrand.ebitdaMargin || editedBrand.expectedEBITDA || ''}
                    onChange={(e) => handleChange('ebitdaMargin', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Investment Range"
                    value={editedBrand.investmentRange || ''}
                    onChange={(e) => handleChange('investmentRange', e.target.value)}
                    helperText="e.g., 10L - 50L"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Minimum Expected ROI"
                    value={editedBrand.minROI || ''}
                    onChange={(e) => handleChange('minROI', e.target.value)}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6" fontWeight="bold">Business Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Unique Selling Proposition (USP)"
                    value={editedBrand.uniqueSellingProposition || ''}
                    onChange={(e) => handleChange('uniqueSellingProposition', e.target.value)}
                    inputProps={{ maxLength: 500 }}
                    helperText={`${editedBrand.uniqueSellingProposition?.length || 0}/500 characters`}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Target Market"
                    value={editedBrand.targetMarket || ''}
                    onChange={(e) => handleChange('targetMarket', e.target.value)}
                    inputProps={{ maxLength: 500 }}
                    helperText={`${editedBrand.targetMarket?.length || 0}/500 characters - Describe ideal customer demographics`}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Competitive Advantage"
                    value={editedBrand.competitiveAdvantage || ''}
                    onChange={(e) => handleChange('competitiveAdvantage', e.target.value)}
                    inputProps={{ maxLength: 500 }}
                    helperText={`${editedBrand.competitiveAdvantage?.length || 0}/500 characters`}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Territory Rights"
                    value={editedBrand.territoryRights || ''}
                    onChange={(e) => handleChange('territoryRights', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Franchise Term Length"
                    value={editedBrand.franchiseTermLength || editedBrand.franchiseTerm || ''}
                    onChange={(e) => handleChange('franchiseTermLength', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Franchisor Support"
                    value={editedBrand.franchisorSupport || ''}
                    onChange={(e) => handleChange('franchisorSupport', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Marketing Support"
                    value={editedBrand.marketingSupport || ''}
                    onChange={(e) => handleChange('marketingSupport', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Non-Compete Restrictions"
                    value={editedBrand.nonCompeteRestrictions || ''}
                    onChange={(e) => handleChange('nonCompeteRestrictions', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Transfer Conditions"
                    value={editedBrand.transferConditions || ''}
                    onChange={(e) => handleChange('transferConditions', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Termination Conditions"
                    value={editedBrand.terminationConditions || ''}
                    onChange={(e) => handleChange('terminationConditions', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Dispute Resolution"
                    value={editedBrand.disputeResolution || ''}
                    onChange={(e) => handleChange('disputeResolution', e.target.value)}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6" fontWeight="bold">Locations & Requirements</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Preferred Locations (comma-separated)"
                    value={editedBrand.locations?.join(', ') || ''}
                    onChange={(e) => handleArrayChange('locations', e.target.value)}
                    helperText="Enter cities/regions where franchise is available"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Space Required (sq ft)"
                    type="number"
                    value={editedBrand.spaceRequired || ''}
                    onChange={(e) => handleChange('spaceRequired', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Current Franchise Locations (comma-separated)"
                    value={editedBrand.brandFranchiseLocations?.join(', ') || ''}
                    onChange={(e) => handleArrayChange('brandFranchiseLocations', e.target.value)}
                    helperText="Existing operational franchise locations"
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6" fontWeight="bold">Contact Information</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Owner Name"
                    value={editedBrand.ownerInfo?.name || editedBrand.brandOwnerInformation?.ownerName || editedBrand.brandOwnerInformation?.name || ''}
                    onChange={(e) => handleNestedChange('ownerInfo', 'name', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Owner Email"
                    type="email"
                    value={editedBrand.ownerInfo?.email || editedBrand.brandOwnerInformation?.ownerEmail || editedBrand.brandOwnerInformation?.email || ''}
                    onChange={(e) => handleNestedChange('ownerInfo', 'email', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Contact Number"
                    value={editedBrand.contactInfo?.phone || editedBrand.brandOwnerInformation?.contactNumber || editedBrand.brandOwnerInformation?.phone || ''}
                    onChange={(e) => handleNestedChange('contactInfo', 'phone', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Facebook URL"
                    value={editedBrand.contactInfo?.socialMedia?.facebook || editedBrand.brandOwnerInformation?.facebookUrl || editedBrand.facebookUrl || ''}
                    onChange={(e) => handleNestedChange('contactInfo', 'facebook', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Instagram URL"
                    value={editedBrand.contactInfo?.socialMedia?.instagram || editedBrand.brandOwnerInformation?.instagramUrl || editedBrand.instagramUrl || ''}
                    onChange={(e) => handleNestedChange('contactInfo', 'instagram', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Twitter URL"
                    value={editedBrand.contactInfo?.socialMedia?.twitter || editedBrand.brandOwnerInformation?.twitterUrl || editedBrand.twitterUrl || ''}
                    onChange={(e) => handleNestedChange('contactInfo', 'twitter', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="LinkedIn URL"
                    value={editedBrand.contactInfo?.socialMedia?.linkedin || editedBrand.brandOwnerInformation?.linkedinUrl || editedBrand.linkedinUrl || ''}
                    onChange={(e) => handleNestedChange('contactInfo', 'linkedin', e.target.value)}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}

      {/* === VIEW MODE: INFO CARDS === */}
      {!editMode && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <MotionCard sx={{ height: '100%' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{delay: 0.1}}>
              <CardHeader title="Investment & Fees" />
              <CardContent>
                <List>
                  <InfoItem icon={<AttachMoney />} primary="Investment Range" secondary={editedBrand.investmentRange} />
                  <InfoItem icon={<AttachMoney />} primary="Initial Fee" secondary={`₹${editedBrand.initialFranchiseFee}`} />
                  <InfoItem icon={<Timeline />} primary="Royalty Fee" secondary={`${editedBrand.royaltyFee}%`} />
                  <InfoItem icon={<CropLandscape />} primary="Area Required" secondary={`${editedBrand.areaRequired?.min} - ${editedBrand.areaRequired?.max} ${editedBrand.areaRequired?.unit}`} />
                </List>
              </CardContent>
            </MotionCard>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <MotionCard sx={{ height: '100%' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{delay: 0.2}}>
              <CardHeader title="Business Model" />
              <CardContent>
                <List>
                  <InfoItem icon={<Business />} primary="Model" secondary={editedBrand.businessModel} />
                  <InfoItem icon={<Storefront />} primary="Franchise Types" secondary={editedBrand.franchiseModels?.join(', ')} />
                  <InfoItem icon={<EmojiEvents />} primary="USP Claimed" secondary={editedBrand.uniqueSellingProposition ? "Yes" : "No"} />
                  <InfoItem icon={<CheckCircle />} primary="Advantage Claimed" secondary={editedBrand.competitiveAdvantage ? "Yes" : "No"} />
                </List>
              </CardContent>
            </MotionCard>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <MotionCard sx={{ height: '100%' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{delay: 0.3}}>
              <CardHeader title="Owner & Contact Info" />
              <CardContent>
                <List>
                  <InfoItem icon={<Person />} primary="Owner Name" secondary={editedBrand.brandOwnerInformation?.name} />
                  <InfoItem icon={<Email />} primary="Owner Email" secondary={editedBrand.brandOwnerInformation?.email} />
                  <InfoItem icon={<Phone />} primary="Contact Phone" secondary={editedBrand.brandContactInformation?.phone} />
                  <InfoItem icon={<Language />} primary="Website" secondary={editedBrand.brandContactInformation?.website} isLink={true} />
                </List>
              </CardContent>
            </MotionCard>
          </Grid>

          {editedBrand.brandFranchiseImages && editedBrand.brandFranchiseImages.length > 0 && (
            <Grid item xs={12} md={6} lg={4}>
              <MotionCard sx={{ height: '100%' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{delay: 0.4}}>
                <CardHeader title="Brand Gallery" />
                <CardContent>
                  <Slider {...sliderSettings}>
                    {editedBrand.brandFranchiseImages.map((image, index) => (
                      <Box key={index} component="img" src={image} alt={`Gallery image ${index + 1}`} sx={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 2 }} />
                    ))}
                  </Slider>
                </CardContent>
              </MotionCard>
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default BrandDetail;