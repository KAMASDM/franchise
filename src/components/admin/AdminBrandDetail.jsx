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
  Grid,
  CircularProgress,
  Alert,
  TextField,
  Divider,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  ArrowBack,
  Edit,
  Save,
  Cancel,
  CheckCircle,
  Block,
  Delete,
  ExpandMore,
} from "@mui/icons-material";
import { db } from "../../firebase/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import logger from "../../utils/logger";
import NotificationService from "../../utils/NotificationService";
import BrandBrochureManager from "../brand/BrandBrochureManager";
import AutoBrochureService from "../../services/AutoBrochureService";

const AdminBrandDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editedBrand, setEditedBrand] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchBrand = async () => {
      setLoading(true);
      setError(null);

      try {
        const docRef = doc(db, "brands", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const brandData = { id: docSnap.id, ...docSnap.data() };
          setBrand(brandData);
          setEditedBrand(brandData);
        } else {
          setError("Brand not found.");
        }
      } catch (err) {
        logger.error("Error fetching brand:", err);
        setError("Failed to load brand data.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBrand();
    }
  }, [id]);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditedBrand(brand);
  };

  const handleChange = (field, value) => {
    setEditedBrand((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedChange = (parent, field, value) => {
    setEditedBrand((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const brandRef = doc(db, "brands", id);
      const { id: _, ...updateData } = editedBrand;
      
      await updateDoc(brandRef, {
        ...updateData,
        updatedAt: new Date().toISOString(),
      });

      setBrand(editedBrand);
      setEditMode(false);
      alert("Brand updated successfully!");
    } catch (err) {
      logger.error("Error updating brand:", err);
      alert("Failed to update brand. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const brandRef = doc(db, "brands", id);
      await updateDoc(brandRef, { 
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });

      // Send notification to brand owner
      if (brand.userId) {
        await NotificationService.sendBrandApprovalNotification(
          brand.userId,
          brand,
          newStatus === "active"
        );
      }

      setBrand((prev) => ({ ...prev, status: newStatus }));
      setEditedBrand((prev) => ({ ...prev, status: newStatus }));
      alert(`Brand ${newStatus === "active" ? "approved" : "deactivated"} successfully!`);
    } catch (err) {
      logger.error("Error updating status:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "brands", id));
      alert("Brand deleted successfully!");
      navigate("/admin/brands");
    } catch (err) {
      logger.error("Error deleting brand:", err);
      alert("Failed to delete brand. Please try again.");
    }
    setDeleteDialogOpen(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !brand) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || "Brand not found"}
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/admin/brands")}
        >
          Back to Brand Management
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate("/admin/brands")}
            sx={{ mb: 2 }}
          >
            Back to Brand Management
          </Button>
          <Typography variant="h4" fontWeight="bold">
            {brand.brandName}
          </Typography>
        </Box>
        <Box>
          {!editMode ? (
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={handleEdit}
            >
              Edit Brand
            </Button>
          ) : (
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="success"
                startIcon={<Save />}
                onClick={handleSave}
                disabled={saving}
              >
                Save Changes
              </Button>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </Button>
            </Stack>
          )}
        </Box>
      </Box>

      {/* Status Management */}
      <Card sx={{ mb: 3, bgcolor: "primary.lighter" }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Status Management
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Chip
              label={`Status: ${brand.status || "pending"}`}
              color={
                brand.status === "active"
                  ? "success"
                  : brand.status === "pending"
                  ? "warning"
                  : "default"
              }
              size="large"
            />
            {(brand.status === "pending" || brand.status === "inactive") && (
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircle />}
                onClick={() => handleStatusChange("active")}
              >
                Approve & Activate
              </Button>
            )}
            {brand.status === "active" && (
              <Button
                variant="contained"
                color="error"
                startIcon={<Block />}
                onClick={() => handleStatusChange("inactive")}
              >
                Deactivate
              </Button>
            )}
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={() => setDeleteDialogOpen(true)}
              sx={{ ml: "auto" }}
            >
              Delete Brand
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Brand Information */}
      <Stack spacing={2}>
        {/* Basic Information */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6" fontWeight="bold">
              Basic Information
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Brand Name *"
                  fullWidth
                  value={editedBrand.brandName || ""}
                  onChange={(e) => handleChange("brandName", e.target.value)}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="URL Slug (auto-generated) *"
                  fullWidth
                  value={editedBrand.slug || ""}
                  onChange={(e) => handleChange("slug", e.target.value)}
                  disabled={!editMode}
                  helperText="Unique URL identifier for the brand"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Founded Year *"
                  fullWidth
                  value={editedBrand.brandfoundedYear || ""}
                  onChange={(e) => handleChange("brandfoundedYear", e.target.value)}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Total Outlets"
                  type="number"
                  fullWidth
                  value={editedBrand.brandTotalOutlets || ""}
                  onChange={(e) => handleChange("brandTotalOutlets", e.target.value)}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Brand Rating"
                  type="number"
                  fullWidth
                  value={editedBrand.brandRating || ""}
                  onChange={(e) => handleChange("brandRating", e.target.value)}
                  disabled={!editMode}
                  inputProps={{ min: 0, max: 5, step: 0.1 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Business Model"
                  fullWidth
                  value={editedBrand.businessModel || ""}
                  onChange={(e) => handleChange("businessModel", e.target.value)}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Franchise Models (comma-separated)"
                  fullWidth
                  value={editedBrand.franchiseModels?.join(", ") || ""}
                  onChange={(e) =>
                    handleChange("franchiseModels", e.target.value.split(",").map((i) => i.trim()))
                  }
                  disabled={!editMode}
                  helperText="Unit Franchise, Multi-City Franchise, Dealer/Distributor, Master Franchise"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Industries (comma-separated) *"
                  fullWidth
                  value={editedBrand.industries?.join(", ") || ""}
                  onChange={(e) =>
                    handleChange("industries", e.target.value.split(",").map((i) => i.trim()))
                  }
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Business Models (comma-separated)"
                  fullWidth
                  value={editedBrand.businessModels?.join(", ") || ""}
                  onChange={(e) =>
                    handleChange("businessModels", e.target.value.split(",").map((i) => i.trim()))
                  }
                  disabled={!editMode}
                  helperText="e.g., B2B, B2C, Hybrid"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Revenue Model"
                  fullWidth
                  value={editedBrand.revenueModel || ""}
                  onChange={(e) => handleChange("revenueModel", e.target.value)}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Support Types (comma-separated)"
                  fullWidth
                  value={editedBrand.supportTypes?.join(", ") || ""}
                  onChange={(e) =>
                    handleChange("supportTypes", e.target.value.split(",").map((i) => i.trim()))
                  }
                  disabled={!editMode}
                  helperText="e.g., Training, Marketing, Operations, Technical"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Brand Vision *"
                  fullWidth
                  multiline
                  rows={3}
                  value={editedBrand.brandVision || editedBrand.brandVission || ""}
                  onChange={(e) => handleChange("brandVision", e.target.value)}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Brand Mission"
                  fullWidth
                  multiline
                  rows={3}
                  value={editedBrand.brandMission || ""}
                  onChange={(e) => handleChange("brandMission", e.target.value)}
                  disabled={!editMode}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Investment & Financials */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6" fontWeight="bold">
              Investment & Financial Information
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Total Investment Required (₹) *"
                  type="number"
                  fullWidth
                  value={editedBrand.brandInvestment || ""}
                  onChange={(e) => handleChange("brandInvestment", e.target.value)}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Franchise Fee (₹) *"
                  type="number"
                  fullWidth
                  value={editedBrand.franchiseFee || ""}
                  onChange={(e) => handleChange("franchiseFee", e.target.value)}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Security Deposit (₹)"
                  type="number"
                  fullWidth
                  value={editedBrand.securityDeposit || ""}
                  onChange={(e) => handleChange("securityDeposit", e.target.value)}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Working Capital (₹)"
                  type="number"
                  fullWidth
                  value={editedBrand.workingCapital || ""}
                  onChange={(e) => handleChange("workingCapital", e.target.value)}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Equipment Costs (₹)"
                  type="number"
                  fullWidth
                  value={editedBrand.equipmentCosts || ""}
                  onChange={(e) => handleChange("equipmentCosts", e.target.value)}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Real Estate Costs (₹)"
                  type="number"
                  fullWidth
                  value={editedBrand.realEstateCosts || ""}
                  onChange={(e) => handleChange("realEstateCosts", e.target.value)}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Royalty Fee"
                  fullWidth
                  value={editedBrand.royaltyFee || ""}
                  onChange={(e) => handleChange("royaltyFee", e.target.value)}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Brand/Marketing Fee"
                  fullWidth
                  value={editedBrand.brandFee || ""}
                  onChange={(e) => handleChange("brandFee", e.target.value)}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Payback Period *"
                  fullWidth
                  value={editedBrand.payBackPeriod || ""}
                  onChange={(e) => handleChange("payBackPeriod", e.target.value)}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Expected Annual Revenue (₹)"
                  type="number"
                  fullWidth
                  value={editedBrand.expectedRevenue || ""}
                  onChange={(e) => handleChange("expectedRevenue", e.target.value)}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="EBITDA Margin"
                  fullWidth
                  value={editedBrand.ebitdaMargin || ""}
                  onChange={(e) => handleChange("ebitdaMargin", e.target.value)}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Investment Range"
                  fullWidth
                  value={editedBrand.investmentRange || ""}
                  onChange={(e) => handleChange("investmentRange", e.target.value)}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Minimum Expected ROI"
                  fullWidth
                  value={editedBrand.minROI || ""}
                  onChange={(e) => handleChange("minROI", e.target.value)}
                  disabled={!editMode}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Business Details */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6" fontWeight="bold">
              Business Details
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Unique Selling Proposition (USP) *"
                  fullWidth
                  multiline
                  rows={4}
                  value={editedBrand.uniqueSellingProposition || ""}
                  onChange={(e) => handleChange("uniqueSellingProposition", e.target.value)}
                  disabled={!editMode}
                  inputProps={{ maxLength: 500 }}
                  helperText={`${editedBrand.uniqueSellingProposition?.length || 0}/500 characters`}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Target Market"
                  fullWidth
                  multiline
                  rows={4}
                  value={editedBrand.targetMarket || ""}
                  onChange={(e) => handleChange("targetMarket", e.target.value)}
                  disabled={!editMode}
                  inputProps={{ maxLength: 500 }}
                  helperText={`${editedBrand.targetMarket?.length || 0}/500 characters - Describe your ideal customer demographics and market segment`}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Competitive Advantage"
                  fullWidth
                  multiline
                  rows={4}
                  value={editedBrand.competitiveAdvantage || ""}
                  onChange={(e) => handleChange("competitiveAdvantage", e.target.value)}
                  disabled={!editMode}
                  inputProps={{ maxLength: 500 }}
                  helperText={`${editedBrand.competitiveAdvantage?.length || 0}/500 characters`}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Franchise Term Length *"
                  fullWidth
                  value={editedBrand.franchiseTermLength || ""}
                  onChange={(e) => handleChange("franchiseTermLength", e.target.value)}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Territory Rights"
                  fullWidth
                  value={editedBrand.territoryRights || ""}
                  onChange={(e) => handleChange("territoryRights", e.target.value)}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Franchisor Support *"
                  fullWidth
                  multiline
                  rows={3}
                  value={editedBrand.franchisorSupport || ""}
                  onChange={(e) => handleChange("franchisorSupport", e.target.value)}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Marketing Support"
                  fullWidth
                  multiline
                  rows={2}
                  value={editedBrand.marketingSupport || ""}
                  onChange={(e) => handleChange("marketingSupport", e.target.value)}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Non-Compete Restrictions"
                  fullWidth
                  multiline
                  rows={2}
                  value={editedBrand.nonCompeteRestrictions || ""}
                  onChange={(e) => handleChange("nonCompeteRestrictions", e.target.value)}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Transfer Conditions"
                  fullWidth
                  multiline
                  rows={2}
                  value={editedBrand.transferConditions || ""}
                  onChange={(e) => handleChange("transferConditions", e.target.value)}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Termination Conditions"
                  fullWidth
                  multiline
                  rows={2}
                  value={editedBrand.terminationConditions || ""}
                  onChange={(e) => handleChange("terminationConditions", e.target.value)}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Dispute Resolution"
                  fullWidth
                  multiline
                  rows={2}
                  value={editedBrand.disputeResolution || ""}
                  onChange={(e) => handleChange("disputeResolution", e.target.value)}
                  disabled={!editMode}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Locations & Requirements */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6" fontWeight="bold">
              Locations & Requirements
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Preferred Locations (comma-separated) *"
                  fullWidth
                  value={editedBrand.locations?.join(", ") || ""}
                  onChange={(e) =>
                    handleChange("locations", e.target.value.split(",").map((i) => i.trim()))
                  }
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Space Required (sq ft) *"
                  type="number"
                  fullWidth
                  value={editedBrand.spaceRequired || ""}
                  onChange={(e) => handleChange("spaceRequired", e.target.value)}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Current Franchise Locations (comma-separated)"
                  fullWidth
                  value={editedBrand.brandFranchiseLocations?.join(", ") || ""}
                  onChange={(e) =>
                    handleChange("brandFranchiseLocations", e.target.value.split(",").map((i) => i.trim()))
                  }
                  disabled={!editMode}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Contact & Social */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6" fontWeight="bold">
              Contact & Social Media
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Owner Name *"
                  fullWidth
                  value={editedBrand.brandOwnerInformation?.ownerName || ""}
                  onChange={(e) =>
                    handleNestedChange("brandOwnerInformation", "ownerName", e.target.value)
                  }
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Owner Email *"
                  type="email"
                  fullWidth
                  value={editedBrand.brandOwnerInformation?.ownerEmail || ""}
                  onChange={(e) =>
                    handleNestedChange("brandOwnerInformation", "ownerEmail", e.target.value)
                  }
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Contact Number *"
                  fullWidth
                  value={editedBrand.brandOwnerInformation?.contactNumber || ""}
                  onChange={(e) =>
                    handleNestedChange("brandOwnerInformation", "contactNumber", e.target.value)
                  }
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Facebook URL"
                  fullWidth
                  value={editedBrand.brandOwnerInformation?.facebookUrl || editedBrand.brandOwnerInformation?.facebookURl || ""}
                  onChange={(e) =>
                    handleNestedChange("brandOwnerInformation", "facebookUrl", e.target.value)
                  }
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Instagram URL"
                  fullWidth
                  value={editedBrand.brandOwnerInformation?.instagramUrl || ""}
                  onChange={(e) =>
                    handleNestedChange("brandOwnerInformation", "instagramUrl", e.target.value)
                  }
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Twitter URL"
                  fullWidth
                  value={editedBrand.brandOwnerInformation?.twitterUrl || ""}
                  onChange={(e) =>
                    handleNestedChange("brandOwnerInformation", "twitterUrl", e.target.value)
                  }
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="LinkedIn URL"
                  fullWidth
                  value={editedBrand.brandOwnerInformation?.linkedinUrl || editedBrand.brandOwnerInformation?.linkedinURl || ""}
                  onChange={(e) =>
                    handleNestedChange("brandOwnerInformation", "linkedinUrl", e.target.value)
                  }
                  disabled={!editMode}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Images & Gallery */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6" fontWeight="bold">
              Images & Gallery
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Brand Logo URL *"
                  fullWidth
                  value={editedBrand.brandLogo || ""}
                  onChange={(e) => handleChange("brandLogo", e.target.value)}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Brand Banner URL"
                  fullWidth
                  value={editedBrand.brandBanner || ""}
                  onChange={(e) => handleChange("brandBanner", e.target.value)}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Brand Main Image URL"
                  fullWidth
                  value={editedBrand.brandImage || ""}
                  onChange={(e) => handleChange("brandImage", e.target.value)}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Gallery Images (comma-separated URLs)"
                  fullWidth
                  multiline
                  rows={2}
                  value={editedBrand.brandFranchiseImages?.join(", ") || ""}
                  onChange={(e) =>
                    handleChange("brandFranchiseImages", e.target.value.split(",").map((i) => i.trim()))
                  }
                  disabled={!editMode}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* System Information */}
        <Card sx={{ bgcolor: "grey.100" }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              System Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Brand ID
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {brand.id}
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary">
                  User ID
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {brand.userId || "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Created At
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {brand.createdAt
                    ? new Date(brand.createdAt).toLocaleString()
                    : "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Last Updated
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {brand.updatedAt
                    ? new Date(brand.updatedAt).toLocaleString()
                    : "N/A"}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Stack>

      {/* Brand Brochure Manager */}
      {brand && brand.status === 'active' && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Brand Marketing Materials
          </Typography>
          <BrandBrochureManager 
            brand={{...brand, id}} 
            onSuccess={() => {
              // Optionally reload brand data to show updated brochure info
              console.log('Brochure generated successfully');
            }}
          />
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Brand?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{brand.brandName}</strong>? This
            action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminBrandDetail;
