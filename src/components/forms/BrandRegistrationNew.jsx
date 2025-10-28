import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
  Stack,
  FormHelperText,
  Avatar,
  Chip,
  Slider,
  Container,
  useTheme,
  alpha,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Link,
  Checkbox
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Business as BusinessIcon,
  AttachMoney as MoneyIcon,
  School as SchoolIcon,
  Handshake as HandshakeIcon,
  Store as StoreIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Language as WebsiteIcon,
  Storefront as StorefrontIcon,
  LocalShipping as LocalShippingIcon,
  Inventory as InventoryIcon,
  VerifiedUser as VerifiedUserIcon,
  Warehouse as WarehouseIcon,
  Map as MapIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  PhotoCamera as PhotoCameraIcon
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { db, storage } from "../../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { compressImage } from "../../utils/imageUtils";
import NotificationService from "../../utils/NotificationService";
import logger from "../../utils/logger";

// Import our new components
import CardSelector from "./CardSelector";
import QuickValueSelector from "./QuickValueSelector";

// Import configurations
import { BUSINESS_MODEL_CONFIG, BUSINESS_MODEL_TYPES } from "../../constants/businessModels";
import { getBusinessModelFields, getFieldOptions } from "../../constants/businessModelFields";

  const steps = [
    {
      id: 0,
      label: 'Business Model',
      description: 'Select your business type',
      icon: <BusinessIcon />
    },
    {
      id: 1,
      label: 'Basic Information',
      description: 'Brand details and contact info',
      icon: <StoreIcon />
    },
    {
      id: 2,
      label: 'Partnership Details',
      description: 'Franchise terms and conditions',
      icon: <HandshakeIcon />
    },
    {
      id: 3,
      label: 'Investment Requirements',
      description: 'Financial details and costs',
      icon: <MoneyIcon />
    },
    {
      id: 4,
      label: 'Training & Support',
      description: 'Partner requirements and support',
      icon: <SchoolIcon />
    },
    {
      id: 5,
      label: 'Gallery & Final Details',
      description: 'Images and additional information',
      icon: <PhotoCameraIcon />
    },
  ];const BrandRegistrationNew = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const fileInputRefs = useRef({});
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});

  // Form data state
  const [formData, setFormData] = useState({
    // Step 1: Business Model Selection
    businessModelType: "",
    
    // Step 2: Basic Information
    brandName: "",
    brandLogo: null,
    brandBanner: null,
    brandVision: "",
    brandMission: "",
    industries: [],
    foundedYear: new Date().getFullYear(),
    brandStory: "",
    uniqueSellingProposition: "",
    targetMarket: "",
    competitiveAdvantage: "",
    
    // Contact Information
    contactInfo: {
      address: "",
      city: "",
      state: "",
      country: "India",
      zipCode: "",
      phone: "",
      email: "",
      website: "",
      linkedinUrl: "",
      instagramUrl: "",
      facebookUrl: "",
      twitterUrl: ""
    },

    // Owner Information
    ownerInfo: {
      name: "",
      email: "",
      phone: "",
      bio: "",
      linkedinUrl: ""
    },

    // Franchise Images and Locations
    franchiseImages: [],
    
    // Additional Information
    whyChooseUs: "",
    successStories: "",
    awards: "",
    mediaCoverage: "",
    agreeToTerms: false,
    franchiseLocations: [{
      address: "",
      city: "",
      state: "",
      country: "India",
      zipCode: "",
      phone: "",
      googleMapsUrl: ""
    }],

    // Step 3: Investment & Financial Details
    initialFranchiseFee: "",
    royaltyFee: "",
    marketingFee: "",
    investmentRange: "",
    workingCapital: "",
    financingOptions: "",
    equipmentCosts: "",
    realEstateCosts: "",
    areaRequired: { min: "", max: "", unit: "Sq.ft" },
    
    // Step 4: Operations & Support
    supportTypes: [],
    trainingProgram: "",
    trainingDuration: "",
    ongoingSupport: [],
    marketingSupport: [],
    operationalStandards: "",
    qualityControl: "",
    franchiseeObligations: "",
    franchisorSupport: "",
    
    // Step 5: Legal Framework & Territory
    territoryRights: "",
    franchiseTermLength: "",
    terminationConditions: "",
    transferConditions: "",
    disputeResolution: "",
    nonCompeteRestrictions: "",
    
    // Business Model & Revenue
    businessModel: [],
    revenueModel: "",
    franchiseModels: [],
    
    // Additional fields
    status: "pending"
  });

  // Get current business model configuration
  const currentModelConfig = formData.businessModelType ? 
    BUSINESS_MODEL_CONFIG[formData.businessModelType] : null;
  
  // Get field configuration for current business model
  const modelFields = formData.businessModelType ? 
    getBusinessModelFields(formData.businessModelType) : null;

  const handleInputChange = (field, value, section = null) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileUpload = async (field, file) => {
    if (!file) return;
    
    try {
      const compressedFile = await compressImage(file);
      setFormData(prev => ({ ...prev, [field]: compressedFile }));
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(compressedFile);
      setUploadedFiles(prev => ({ ...prev, [field]: previewUrl }));
    } catch (error) {
      console.error("File upload error:", error);
      setError("Failed to process file upload");
    }
  };

  // Franchise Location Management Functions
  const addFranchiseLocation = () => {
    setFormData(prev => ({
      ...prev,
      franchiseLocations: [
        ...prev.franchiseLocations,
        {
          address: "",
          city: "",
          state: "",
          country: "India",
          zipCode: "",
          phone: "",
          googleMapsUrl: ""
        }
      ]
    }));
  };

  const removeFranchiseLocation = (index) => {
    setFormData(prev => ({
      ...prev,
      franchiseLocations: prev.franchiseLocations.filter((_, i) => i !== index)
    }));
  };

  const handleFranchiseLocationChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      franchiseLocations: prev.franchiseLocations.map((location, i) =>
        i === index ? { ...location, [field]: value } : location
      )
    }));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const newImages = [];
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        newImages.push(file);
      }
    });

    setFormData(prev => ({
      ...prev,
      franchiseImages: [...prev.franchiseImages, ...newImages]
    }));

    // Reset the input
    event.target.value = '';
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      franchiseImages: prev.franchiseImages.filter((_, i) => i !== index)
    }));
  };

  const validateStep = (stepIndex) => {
    const newErrors = {};
    
    switch (stepIndex) {
      case 0: // Business Model Selection
        if (!formData.businessModelType) {
          newErrors.businessModelType = "Please select a partnership type";
        }
        break;
        
      case 1: // Basic Information
        if (!formData.brandName.trim()) {
          newErrors.brandName = "Brand name is required";
        }
        if (!formData.brandLogo) {
          newErrors.brandLogo = "Brand logo is required";
        }
        if (!formData.industries.length) {
          newErrors.industries = "Please select at least one industry";
        }
        if (!formData.contactInfo.phone.trim()) {
          newErrors.phone = "Phone number is required";
        }
        if (!formData.contactInfo.email.trim()) {
          newErrors.email = "Email is required";
        }
        break;
        
      case 2: // Partnership Details - Dynamic validation based on business model
        if (formData.businessModelType === 'franchise' || 
            formData.businessModelType === 'master_franchise' || 
            formData.businessModelType === 'area_franchise') {
          if (!formData.initialFranchiseFee) {
            newErrors.initialFranchiseFee = 'Initial franchise fee is required';
          }
          if (!formData.royaltyFee) {
            newErrors.royaltyFee = 'Royalty fee is required';
          }
        }
        if (!formData.revenueModel) {
          newErrors.revenueModel = 'Revenue model is required';
        }
        if (!formData.territoryRights) {
          newErrors.territoryRights = 'Territory rights selection is required';
        }
        if (!formData.franchiseTermLength) {
          newErrors.franchiseTermLength = 'Partnership term is required';
        }
        break;
        
      case 3: // Investment Requirements
        if (!formData.investmentRange) {
          newErrors.investmentRange = "Please select investment range";
        }
        break;
        
      case 4: // Training & Support
        if (!formData.supportTypes.length) {
          newErrors.supportTypes = "Please select support types";
        }
        if (!formData.experienceRequired || formData.experienceRequired.length === 0) {
          newErrors.experienceRequired = 'Experience requirements are needed';
        }
        if (!formData.qualification) {
          newErrors.qualification = 'Qualification requirements are needed';
        }
        if (!formData.trainingDuration) {
          newErrors.trainingDuration = 'Training duration is required';
        }
        break;
        
      case 5: // Gallery & Final Details
        if (!formData.agreeToTerms) {
          newErrors.agreeToTerms = 'You must agree to the terms and conditions';
        }
        if (!formData.brandStory || formData.brandStory.trim().length < 50) {
          newErrors.brandStory = 'Please provide a brand story (minimum 50 characters)';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return;
    
    setLoading(true);
    setError("");
    
    try {
      // Upload files to Firebase Storage
      let logoUrl = "";
      if (formData.brandLogo) {
        const logoRef = ref(storage, `brand-logos/${Date.now()}-${formData.brandLogo.name}`);
        const uploadTask = uploadBytesResumable(logoRef, formData.brandLogo);
        const snapshot = await uploadTask;
        logoUrl = await getDownloadURL(snapshot.ref);
      }

      // Prepare submission data
      const submissionData = {
        ...formData,
        brandLogo: logoUrl,
        businessModel: [formData.businessModelType], // Convert to array for compatibility
        createdAt: serverTimestamp(),
        createdBy: user.uid,
        userId: user.uid,
        status: "pending"
      };

      // Remove file objects
      delete submissionData.brandLogoFile;

      // Submit to Firestore
      const docRef = await addDoc(collection(db, "brands"), submissionData);
      
      // Send admin notification
      await NotificationService.sendAdminNotification(
        `New ${currentModelConfig?.label} submission: ${formData.brandName} by ${user.email}`,
        {
          type: "brand_submission",
          brandId: docRef.id,
          brandName: formData.brandName,
          businessModel: formData.businessModelType,
          submittedBy: user.email
        }
      );

      logger.log("Brand registration successful:", docRef.id);
      
      // Navigate to success page or dashboard
      navigate("/dashboard?tab=brands&success=registration");
      
    } catch (error) {
      console.error("Submission error:", error);
      setError("Failed to submit registration. Please try again.");
      logger.error("Brand registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to get icon component
  const getIconComponent = (iconName) => {
    const iconMap = {
      'Store': <StoreIcon />,
      'Business': <BusinessIcon />,
      'Map': <MapIcon />,
      'Storefront': <StorefrontIcon />,
      'VerifiedUser': <VerifiedUserIcon />,
      'LocalShipping': <LocalShippingIcon />,
      'Warehouse': <WarehouseIcon />,
      'Inventory': <InventoryIcon />,
      'Handshake': <HandshakeIcon />
    };
    return iconMap[iconName] || <StoreIcon />;
  };

  // Render Step 1: Business Model Selection
  const renderBusinessModelStep = () => {
    const businessModelOptions = Object.values(BUSINESS_MODEL_CONFIG).map(config => ({
      id: config.id,
      label: config.label,
      description: config.description,
      icon: getIconComponent(config.icon),
      color: config.color,
      features: config.features,
      investmentType: config.investmentType,
      commitmentLevel: config.commitmentLevel
    }));

    return (
      <CardSelector
        title="Choose Your Partnership Type"
        subtitle="Select the partnership model that best fits your business"
        options={businessModelOptions}
        value={formData.businessModelType}
        onChange={(value) => handleInputChange('businessModelType', value)}
        columns={{ xs: 1, sm: 1, md: 2 }}
        variant="detailed"
      />
    );
  };

  // Render Step 2: Basic Information
  const renderBasicInfoStep = () => (
    <Box>
      <Grid container spacing={3}>
        {/* Brand Name */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Brand Name"
            value={formData.brandName}
            onChange={(e) => handleInputChange('brandName', e.target.value)}
            error={!!errors.brandName}
            helperText={errors.brandName}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BusinessIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Founded Year */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="number"
            label="Founded Year"
            value={formData.foundedYear}
            onChange={(e) => handleInputChange('foundedYear', parseInt(e.target.value))}
            inputProps={{ min: 1900, max: new Date().getFullYear() }}
          />
        </Grid>

        {/* Brand Logo Upload */}
        <Grid item xs={12}>
          <Card sx={{ p: 2, border: `2px dashed ${theme.palette.grey[300]}` }}>
            <Box sx={{ textAlign: 'center' }}>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                ref={ref => fileInputRefs.current['brandLogo'] = ref}
                onChange={(e) => handleFileUpload('brandLogo', e.target.files[0])}
              />
              
              {uploadedFiles.brandLogo ? (
                <Box>
                  <Avatar
                    src={uploadedFiles.brandLogo}
                    sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, brandLogo: null }));
                      setUploadedFiles(prev => ({ ...prev, brandLogo: null }));
                    }}
                  >
                    Remove Logo
                  </Button>
                </Box>
              ) : (
                <Box>
                  <CloudUploadIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>Upload Brand Logo</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Drag & drop or click to select your brand logo
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => fileInputRefs.current['brandLogo']?.click()}
                  >
                    Choose File
                  </Button>
                </Box>
              )}
              
              {errors.brandLogo && (
                <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                  {errors.brandLogo}
                </Typography>
              )}
            </Box>
          </Card>
        </Grid>

        {/* Industries */}
        <Grid item xs={12}>
          <QuickValueSelector
            title="Industry Categories"
            subtitle="Select all industries your brand operates in"
            options={getFieldOptions('industries')}
            value={formData.industries}
            onChange={(value) => handleInputChange('industries', value)}
            multiSelect={true}
            columns={{ xs: 2, sm: 3, md: 4 }}
            size="medium"
          />
          {errors.industries && (
            <FormHelperText error>{errors.industries}</FormHelperText>
          )}
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 2 }}>
            Contact Information
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Phone Number"
            value={formData.contactInfo.phone}
            onChange={(e) => handleInputChange('phone', e.target.value, 'contactInfo')}
            error={!!errors.phone}
            helperText={errors.phone}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={formData.contactInfo.email}
            onChange={(e) => handleInputChange('email', e.target.value, 'contactInfo')}
            error={!!errors.email}
            helperText={errors.email}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Website (Optional)"
            value={formData.contactInfo.website}
            onChange={(e) => handleInputChange('website', e.target.value, 'contactInfo')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <WebsiteIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="City"
            value={formData.contactInfo.city}
            onChange={(e) => handleInputChange('city', e.target.value, 'contactInfo')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Brand Story */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Brand Story (Optional)"
            placeholder="Tell us about your brand's mission, vision, and what makes it unique..."
            value={formData.brandStory}
            onChange={(e) => handleInputChange('brandStory', e.target.value)}
          />
        </Grid>

        {/* Social Media Section */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2 }}>
            Social Media Presence
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Facebook Page URL (Optional)"
            value={formData.contactInfo.facebookUrl}
            onChange={(e) => handleInputChange('facebookUrl', e.target.value, 'contactInfo')}
            placeholder="https://facebook.com/yourpage"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FacebookIcon sx={{ color: '#1877F2' }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Instagram Profile URL (Optional)"
            value={formData.contactInfo.instagramUrl}
            onChange={(e) => handleInputChange('instagramUrl', e.target.value, 'contactInfo')}
            placeholder="https://instagram.com/yourprofile"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <InstagramIcon sx={{ color: '#E4405F' }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="LinkedIn Profile URL (Optional)"
            value={formData.contactInfo.linkedinUrl}
            onChange={(e) => handleInputChange('linkedinUrl', e.target.value, 'contactInfo')}
            placeholder="https://linkedin.com/company/yourcompany"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LinkedInIcon sx={{ color: '#0A66C2' }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Twitter Profile URL (Optional)"
            value={formData.contactInfo.twitterUrl}
            onChange={(e) => handleInputChange('twitterUrl', e.target.value, 'contactInfo')}
            placeholder="https://twitter.com/yourhandle"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TwitterIcon sx={{ color: '#1DA1F2' }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Franchise Locations Section */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2 }}>
            Existing Franchise Locations
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Add your current franchise locations to showcase your presence
          </Typography>
        </Grid>

        {formData.franchiseLocations.map((location, index) => (
          <Grid item xs={12} key={index}>
            <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1" fontWeight="medium">
                  Location {index + 1}
                </Typography>
                {formData.franchiseLocations.length > 1 && (
                  <Button
                    size="small"
                    startIcon={<RemoveIcon />}
                    onClick={() => removeFranchiseLocation(index)}
                    color="error"
                  >
                    Remove
                  </Button>
                )}
              </Stack>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    value={location.address}
                    onChange={(e) => handleFranchiseLocationChange(index, 'address', e.target.value)}
                    placeholder="Complete address of this location"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="City"
                    value={location.city}
                    onChange={(e) => handleFranchiseLocationChange(index, 'city', e.target.value)}
                    placeholder="City"
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="State"
                    value={location.state}
                    onChange={(e) => handleFranchiseLocationChange(index, 'state', e.target.value)}
                    placeholder="State"
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="ZIP Code"
                    value={location.zipCode}
                    onChange={(e) => handleFranchiseLocationChange(index, 'zipCode', e.target.value)}
                    placeholder="ZIP Code"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone (Optional)"
                    value={location.phone}
                    onChange={(e) => handleFranchiseLocationChange(index, 'phone', e.target.value)}
                    placeholder="Location contact number"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Google Maps URL (Optional)"
                    value={location.googleMapsUrl}
                    onChange={(e) => handleFranchiseLocationChange(index, 'googleMapsUrl', e.target.value)}
                    placeholder="https://maps.google.com/..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MapIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </Card>
          </Grid>
        ))}

        {/* Add Location Button */}
        <Grid item xs={12}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addFranchiseLocation}
            sx={{ mb: 2 }}
          >
            Add Another Location
          </Button>
        </Grid>
      </Grid>
    </Box>
  );

  // Render Step 3: Partnership Details (Business Model Specific)
  const renderPartnershipDetailsStep = () => {
    if (!currentModelConfig) return null;

    return (
      <Box>
        <Grid container spacing={3}>
          {/* Financial Details Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              Financial Terms
            </Typography>
          </Grid>

          {/* Franchise Fee (for franchise models) */}
          {(formData.businessModelType === 'franchise' || 
            formData.businessModelType === 'master_franchise' || 
            formData.businessModelType === 'area_franchise') && (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Initial Franchise Fee"
                value={formData.initialFranchiseFee}
                onChange={(e) => handleInputChange('initialFranchiseFee', e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>
                }}
                placeholder="e.g., 500000"
                helperText="One-time fee for franchise rights"
              />
            </Grid>
          )}

          {/* Royalty Fee */}
          {(formData.businessModelType === 'franchise' || 
            formData.businessModelType === 'master_franchise' || 
            formData.businessModelType === 'area_franchise') && (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Royalty Fee (%)"
                type="number"
                value={formData.royaltyFee}
                onChange={(e) => handleInputChange('royaltyFee', e.target.value)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>
                }}
                placeholder="e.g., 5"
                helperText="Ongoing royalty as % of revenue"
                inputProps={{ min: 0, max: 50, step: 0.5 }}
              />
            </Grid>
          )}

          {/* Marketing Fee */}
          {(formData.businessModelType === 'franchise' || 
            formData.businessModelType === 'master_franchise' || 
            formData.businessModelType === 'area_franchise') && (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Marketing Fee (%)"
                type="number"
                value={formData.marketingFee}
                onChange={(e) => handleInputChange('marketingFee', e.target.value)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>
                }}
                placeholder="e.g., 2"
                helperText="Marketing fund contribution %"
                inputProps={{ min: 0, max: 10, step: 0.5 }}
              />
            </Grid>
          )}

          {/* Dealer/Distributor Margin */}
          {(formData.businessModelType === 'dealership' || 
            formData.businessModelType === 'authorized_dealer' ||
            formData.businessModelType === 'distributorship' ||
            formData.businessModelType === 'stockist') && (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={`${currentModelConfig.label} Margin (%)`}
                type="number"
                value={formData.dealerMargin || ''}
                onChange={(e) => handleInputChange('dealerMargin', e.target.value)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>
                }}
                placeholder="e.g., 15"
                helperText={`Profit margin for ${currentModelConfig.label.toLowerCase()}s`}
                inputProps={{ min: 5, max: 50, step: 1 }}
              />
            </Grid>
          )}

          {/* Revenue Model */}
          <Grid item xs={12}>
            <QuickValueSelector
              title="Revenue Model"
              subtitle="How will partners earn from this opportunity?"
              options={getFieldOptions('revenueModels')}
              value={formData.revenueModel}
              onChange={(value) => handleInputChange('revenueModel', value)}
              columns={{ xs: 1, sm: 2, md: 3 }}
              size="large"
            />
          </Grid>

          {/* Territory Rights */}
          <Grid item xs={12}>
            <QuickValueSelector
              title="Territory Rights"
              subtitle="What type of territorial protection will you offer?"
              options={getFieldOptions('territoryRights')}
              value={formData.territoryRights}
              onChange={(value) => handleInputChange('territoryRights', value)}
              columns={{ xs: 2, sm: 2, md: 4 }}
            />
          </Grid>

          {/* Franchise Term Length */}
          <Grid item xs={12}>
            <QuickValueSelector
              title="Partnership Term"
              subtitle="Duration of the partnership agreement"
              options={getFieldOptions('franchiseTerms')}
              value={formData.franchiseTermLength}
              onChange={(value) => handleInputChange('franchiseTermLength', value)}
              columns={{ xs: 2, sm: 3, md: 6 }}
            />
          </Grid>
        </Grid>
      </Box>
    );
  };

  // Render Step 4: Investment Requirements
  const renderInvestmentStep = () => (
    <Box>
      <Grid container spacing={3}>
        {/* Investment Range */}
        <Grid item xs={12}>
          <QuickValueSelector
            title="Total Investment Range"
            subtitle="Select the total investment range for partners"
            options={getFieldOptions('investmentRanges')}
            value={formData.investmentRange}
            onChange={(value) => handleInputChange('investmentRange', value)}
            columns={{ xs: 1, sm: 2, md: 3 }}
            size="large"
          />
          {errors.investmentRange && (
            <FormHelperText error>{errors.investmentRange}</FormHelperText>
          )}
        </Grid>

        {/* Working Capital */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Working Capital Required"
            value={formData.workingCapital}
            onChange={(e) => handleInputChange('workingCapital', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₹</InputAdornment>
              ),
            }}
            placeholder="e.g., 500000"
            helperText="Additional capital for operations"
          />
        </Grid>

        {/* Equipment Costs */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Equipment Costs"
            value={formData.equipmentCosts}
            onChange={(e) => handleInputChange('equipmentCosts', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₹</InputAdornment>
              ),
            }}
            placeholder="e.g., 200000"
            helperText="Cost of required equipment"
          />
        </Grid>

        {/* Real Estate Costs */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Real Estate Costs"
            value={formData.realEstateCosts}
            onChange={(e) => handleInputChange('realEstateCosts', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₹</InputAdornment>
              ),
            }}
            placeholder="e.g., 1000000"
            helperText="Property/rental costs"
          />
        </Grid>

        {/* Area Required */}
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Space Required
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Min"
                  type="number"
                  value={formData.areaRequired.min}
                  onChange={(e) => handleInputChange('min', e.target.value, 'areaRequired')}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Max"
                  type="number"
                  value={formData.areaRequired.max}
                  onChange={(e) => handleInputChange('max', e.target.value, 'areaRequired')}
                />
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel>Unit</InputLabel>
                  <Select
                    value={formData.areaRequired.unit}
                    label="Unit"
                    onChange={(e) => handleInputChange('unit', e.target.value, 'areaRequired')}
                  >
                    <MenuItem value="Sq.ft">Sq.ft</MenuItem>
                    <MenuItem value="Sq.mt">Sq.mt</MenuItem>
                    <MenuItem value="Sq.yrd">Sq.yrd</MenuItem>
                    <MenuItem value="Acre">Acre</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {/* Financing Options */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Financing Options (Optional)"
            value={formData.financingOptions}
            onChange={(e) => handleInputChange('financingOptions', e.target.value)}
            placeholder="Describe any financing assistance you provide..."
            helperText="Bank partnerships, EMI options, etc."
          />
        </Grid>
      </Grid>
    </Box>
  );

  // Render Step 5: Training & Support
  const renderSupportStep = () => (
    <Box>
      <Grid container spacing={3}>
        {/* Partner Requirements Section */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Partner Requirements
          </Typography>
        </Grid>

        {/* Experience Required */}
        <Grid item xs={12}>
          <CardSelector
            title="Experience Required"
            subtitle="What type of experience should partners have?"
            options={getFieldOptions('experienceRequired')}
            value={formData.experienceRequired}
            onChange={(values) => handleInputChange('experienceRequired', values)}
            multiple
          />
        </Grid>

        {/* Qualification */}
        <Grid item xs={12}>
          <CardSelector
            title="Educational Qualification"
            subtitle="Minimum educational requirements"
            options={getFieldOptions('qualification')}
            value={formData.qualification}
            onChange={(value) => handleInputChange('qualification', value)}
          />
        </Grid>

        {/* Partner Criteria */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Minimum Age Requirement"
            type="number"
            value={formData.minAge}
            onChange={(e) => handleInputChange('minAge', e.target.value)}
            placeholder="e.g., 25"
            inputProps={{ min: 18, max: 65 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Maximum Age Limit"
            type="number"
            value={formData.maxAge}
            onChange={(e) => handleInputChange('maxAge', e.target.value)}
            placeholder="e.g., 55"
            inputProps={{ min: 20, max: 70 }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Additional Partner Criteria"
            value={formData.partnerCriteria}
            onChange={(e) => handleInputChange('partnerCriteria', e.target.value)}
            placeholder="Any specific requirements like local market knowledge, network, etc..."
          />
        </Grid>

        {/* Training & Support Section */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3, mb: 2 }}>
            Training & Support Program
          </Typography>
        </Grid>

        {/* Training Duration */}
        <Grid item xs={12}>
          <QuickValueSelector
            title="Training Duration"
            subtitle="How long is your training program?"
            options={getFieldOptions('trainingDuration')}
            value={formData.trainingDuration}
            onChange={(value) => handleInputChange('trainingDuration', value)}
            columns={{ xs: 2, sm: 3, md: 6 }}
          />
        </Grid>

        {/* Training Location */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Training Location</InputLabel>
            <Select
              value={formData.trainingLocation}
              label="Training Location"
              onChange={(e) => handleInputChange('trainingLocation', e.target.value)}
            >
              <MenuItem value="Head Office">Head Office</MenuItem>
              <MenuItem value="Regional Center">Regional Center</MenuItem>
              <MenuItem value="Online">Online</MenuItem>
              <MenuItem value="Partner Location">Partner Location</MenuItem>
              <MenuItem value="Hybrid">Hybrid (Online + Offline)</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Training Cost */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Training Cost</InputLabel>
            <Select
              value={formData.trainingCost}
              label="Training Cost"
              onChange={(e) => handleInputChange('trainingCost', e.target.value)}
            >
              <MenuItem value="Free">Free</MenuItem>
              <MenuItem value="Partially Paid">Partially Paid</MenuItem>
              <MenuItem value="Paid by Partner">Paid by Partner</MenuItem>
              <MenuItem value="Included in Fee">Included in Fee</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Training Details */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Training Program Details"
            value={formData.trainingDetails}
            onChange={(e) => handleInputChange('trainingDetails', e.target.value)}
            placeholder="Describe your comprehensive training program, modules covered, practical training, certification process..."
            helperText="Include details about product training, operations, marketing, sales, etc."
          />
        </Grid>

        {/* Support Services */}
        <Grid item xs={12}>
          <QuickValueSelector
            title="Ongoing Support Services"
            subtitle="Select the support services you will provide"
            options={getFieldOptions('ongoingSupport')}
            value={formData.supportTypes}
            onChange={(value) => handleInputChange('supportTypes', value)}
            multiSelect={true}
            columns={{ xs: 2, sm: 3, md: 4 }}
          />
          {errors.supportTypes && (
            <FormHelperText error>{errors.supportTypes}</FormHelperText>
          )}
        </Grid>

        {/* Marketing Support */}
        <Grid item xs={12}>
          <QuickValueSelector
            title="Marketing Support"
            subtitle="What marketing support will you provide?"
            options={getFieldOptions('marketingSupport')}
            value={formData.marketingSupport || []}
            onChange={(value) => handleInputChange('marketingSupport', value)}
            multiSelect={true}
            columns={{ xs: 2, sm: 3, md: 4 }}
            size="small"
          />
        </Grid>

        {/* Legal Framework */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3, mb: 2 }}>
            Legal Framework
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Agreement Type</InputLabel>
            <Select
              value={formData.agreementType}
              label="Agreement Type"
              onChange={(e) => handleInputChange('agreementType', e.target.value)}
            >
              <MenuItem value="Franchise Agreement">Franchise Agreement</MenuItem>
              <MenuItem value="Dealer Agreement">Dealer Agreement</MenuItem>
              <MenuItem value="Distribution Agreement">Distribution Agreement</MenuItem>
              <MenuItem value="Partnership Agreement">Partnership Agreement</MenuItem>
              <MenuItem value="License Agreement">License Agreement</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Renewal Terms</InputLabel>
            <Select
              value={formData.renewalTerms}
              label="Renewal Terms"
              onChange={(e) => handleInputChange('renewalTerms', e.target.value)}
            >
              <MenuItem value="Automatic Renewal">Automatic Renewal</MenuItem>
              <MenuItem value="Performance Based">Performance Based</MenuItem>
              <MenuItem value="Mutual Agreement">Mutual Agreement</MenuItem>
              <MenuItem value="No Renewal">No Renewal</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Legal & Compliance Details"
            value={formData.legalCompliance}
            onChange={(e) => handleInputChange('legalCompliance', e.target.value)}
            placeholder="Mention any legal requirements, licenses needed, compliance standards..."
            helperText="Include information about required licenses, permits, or certifications"
          />
        </Grid>
      </Grid>
    </Box>
  );

  // Render Step 5: Image Gallery & Additional Info
  const renderGalleryStep = () => (
    <Box>
      <Grid container spacing={3}>
        {/* Image Gallery Section */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Brand Image Gallery
          </Typography>
        </Grid>

        {/* Image Upload */}
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ p: 3, borderStyle: 'dashed' }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="franchise-images-upload"
              multiple
              type="file"
              onChange={handleImageUpload}
            />
            <label htmlFor="franchise-images-upload">
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 200,
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                <PhotoCameraIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Upload Brand Images
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Click here to upload images of your brand, outlets, products, or facilities.
                  You can select multiple images at once.
                </Typography>
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<PhotoCameraIcon />}
                  sx={{ mt: 2 }}
                >
                  Choose Images
                </Button>
              </Box>
            </label>
          </Card>
        </Grid>

        {/* Image Preview Gallery */}
        {formData.franchiseImages && formData.franchiseImages.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              Uploaded Images ({formData.franchiseImages.length})
            </Typography>
            <Grid container spacing={2}>
              {formData.franchiseImages.map((image, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <Card sx={{ position: 'relative', aspectRatio: '1' }}>
                    <Box
                      component="img"
                      src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                      alt={`Brand Image ${index + 1}`}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveImage(index)}
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'rgba(0,0,0,0.7)'
                        }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        )}

        {/* Additional Information */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3, mb: 2 }}>
            Additional Information
          </Typography>
        </Grid>

        {/* Brand Story */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Brand Story"
            value={formData.brandStory}
            onChange={(e) => handleInputChange('brandStory', e.target.value)}
            placeholder="Tell us about your brand's journey, mission, and what makes it unique..."
            helperText="Share your brand's story to help potential partners understand your vision and values"
          />
        </Grid>

        {/* Why Choose Us */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Why Choose Your Brand?"
            value={formData.whyChooseUs}
            onChange={(e) => handleInputChange('whyChooseUs', e.target.value)}
            placeholder="What advantages and benefits do you offer to franchise partners?"
          />
        </Grid>

        {/* Success Stories */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Success Stories (Optional)"
            value={formData.successStories}
            onChange={(e) => handleInputChange('successStories', e.target.value)}
            placeholder="Share any success stories or achievements of existing franchise partners..."
          />
        </Grid>

        {/* Awards & Recognition */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Awards & Recognition (Optional)"
            value={formData.awards}
            onChange={(e) => handleInputChange('awards', e.target.value)}
            placeholder="Any awards, certifications, or recognition received"
          />
        </Grid>

        {/* Media Coverage */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Media Coverage (Optional)"
            value={formData.mediaCoverage}
            onChange={(e) => handleInputChange('mediaCoverage', e.target.value)}
            placeholder="Links to news articles, press releases, etc."
          />
        </Grid>

        {/* Terms & Conditions Agreement */}
        <Grid item xs={12}>
          <Box sx={{ mt: 3, p: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.agreeToTerms || false}
                  onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                  name="agreeToTerms"
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  I agree to the{' '}
                  <Link href="#" onClick={(e) => e.preventDefault()} color="primary">
                    Terms & Conditions
                  </Link>
                  {' '}and{' '}
                  <Link href="#" onClick={(e) => e.preventDefault()} color="primary">
                    Privacy Policy
                  </Link>
                  . I understand that the information provided will be verified and used for franchise evaluation purposes.
                </Typography>
              }
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

  const renderCurrentStep = () => {
    switch (activeStep) {
      case 0:
        return renderBusinessModelStep();
      case 1:
        return renderBasicInfoStep();
      case 2:
        return renderPartnershipDetailsStep();
      case 3:
        return renderInvestmentStep();
      case 4:
        return renderSupportStep();
      case 5:
        return renderGalleryStep();
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">
          Please log in to register your brand.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
          Brand Registration
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Join our network and grow your business
        </Typography>
      </Box>

      {/* Stepper */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((step, index) => (
              <Step key={step.id}>
                <StepLabel
                  StepIconComponent={({ active, completed }) => (
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: completed
                          ? theme.palette.success.main
                          : active
                          ? theme.palette.primary.main
                          : theme.palette.grey[300],
                        color: 'white'
                      }}
                    >
                      {completed ? <CheckIcon /> : step.icon}
                    </Box>
                  )}
                >
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {step.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {step.description}
                    </Typography>
                  </Box>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {/* Current Business Model Info */}
      {currentModelConfig && activeStep > 0 && (
        <Card sx={{ mb: 3, backgroundColor: alpha(currentModelConfig.color, 0.1) }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ backgroundColor: currentModelConfig.color, mr: 2 }}>
                {currentModelConfig.icon}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {currentModelConfig.label} Registration
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentModelConfig.description}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Form Content */}
      <Card>
        <CardContent sx={{ p: 4 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderCurrentStep()}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          onClick={handleBack}
          disabled={activeStep === 0}
          startIcon={<ArrowBackIcon />}
          size="large"
        >
          Back
        </Button>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {activeStep < steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<ArrowForwardIcon />}
              size="large"
              sx={{ minWidth: 120 }}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              size="large"
              sx={{ minWidth: 160 }}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Submitting...' : 'Submit Registration'}
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default BrandRegistrationNew;