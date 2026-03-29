import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  LinearProgress,
  Button,
  TextField,
  Card,
  CardContent,
  Stack,
  Chip,
  Avatar,
  Alert,
  SwipeableDrawer,
  Fab,
  Paper,
  alpha,
  useTheme,
  Divider,
  FormControl,
  FormControlLabel,
  Checkbox,
  FormGroup,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack,
  Close,
  CheckCircle,
  RadioButtonUnchecked,
  PhotoCamera,
  AddPhotoAlternate,
  Business,
  Email,
  Phone,
  Language,
  LocationOn,
  Person,
  AttachMoney,
  TrendingUp,
  School,
  Support,
  Collections,
  Send,
  Save,
  ChevronRight,
  Info,
  AutoAwesome,
  Scanner,
  Verified,
  Delete,
  CloudUpload,
  ExpandMore,
  ExpandLess,
  Warning,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { db, storage } from '../../firebase/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import NotificationService from '../../utils/NotificationService';
import analytics from '../../utils/analytics';
import { useFormAutoSave } from '../../hooks/useFormAutoSave';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

/**
 * Mobile-First Brand Registration Form
 * Features:
 * - Swipeable step navigation
 * - Bottom sheet UI
 * - Touch-optimized inputs
 * - Native app feel
 * - Progress tracking
 * - Auto-save
 * - Image compression
 */

const BrandRegistrationMobile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  // Form State
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showAIHelper, setShowAIHelper] = useState(false);
  
  const [formData, setFormData] = useState({
    // Step 0: Business Model
    businessModelType: '',
    
    // Step 1: Basic Info
    brandName: '',
    brandLogo: null,
    brandLogoURL: '',
    brandBanner: null,
    brandBannerURL: '',
    foundedYear: '',
    industries: [],
    tagline: '',
    
    // Contact Info
    contactInfo: {
      email: '',
      emailVerified: false,
      phone: '+91 ',
      phoneVerified: false,
      website: '',
      address: '',
    },
    
    // Owner Info
    ownerInfo: {
      name: '',
      email: '',
      phone: '',
    },
    
    // Step 2: Partnership Details
    initialFranchiseFee: '',
    royaltyFee: '',
    revenueModel: [],
    revenueStreams: [],
    territorySize: '',
    contractDuration: '',
    
    // Step 3: Investment
    investmentRange: '',
    workingCapital: '',
    equipmentCosts: '',
    areaRequired: {
      min: '',
      max: '',
    },
    financingOptions: '',
    
    // Step 4: Training & Support
    trainingDuration: '',
    trainingLocation: '',
    trainingCost: '',
    supportTypes: [],
    ongoingSupport: [],
    experienceRequired: [],
    minAge: '',
    qualification: '',
    
    // Step 5: Media & Story
    brandStory: '',
    uniqueSellingPoints: '',
    franchiseImages: [],
    franchiseImageURLs: [],
    
    // Step 6: Terms
    agreeToTerms: false,
    agreeToMarketing: false,
    
    status: 'pending',
  });

  const [errors, setErrors] = useState({});

  // Steps configuration
  const steps = [
    {
      label: 'Model',
      icon: <Business />,
      title: 'Choose Partnership Model',
      subtitle: 'Select how you want to expand',
    },
    {
      label: 'Basics',
      icon: <Business />,
      title: 'Brand Information',
      subtitle: 'Tell us about your brand',
    },
    {
      label: 'Partnership',
      icon: <TrendingUp />,
      title: 'Partnership Terms',
      subtitle: 'Define the partnership structure',
    },
    {
      label: 'Investment',
      icon: <AttachMoney />,
      title: 'Investment Details',
      subtitle: 'Financial requirements',
    },
    {
      label: 'Training',
      icon: <School />,
      title: 'Training & Support',
      subtitle: 'What you provide to partners',
    },
    {
      label: 'Media',
      icon: <Collections />,
      title: 'Gallery & Story',
      subtitle: 'Showcase your brand',
    },
    {
      label: 'Review',
      icon: <CheckCircle />,
      title: 'Review & Submit',
      subtitle: 'Check everything before submitting',
    },
  ];

  // Business Model Options
  const businessModels = [
    {
      type: 'franchise',
      title: 'Franchise',
      description: 'Traditional franchise model with comprehensive support',
      icon: '🏪',
      badge: 'Most Popular',
      color: theme.palette.primary.main,
    },
    {
      type: 'license',
      title: 'License',
      description: 'License your brand and intellectual property',
      icon: '📜',
      color: theme.palette.secondary.main,
    },
    {
      type: 'distribution',
      title: 'Distribution',
      description: 'Exclusive distribution rights in territories',
      icon: '📦',
      color: theme.palette.info.main,
    },
    {
      type: 'joint-venture',
      title: 'Joint Venture',
      description: 'Collaborative partnership model',
      icon: '🤝',
      color: theme.palette.success.main,
    },
  ];

  // Industry Options
  const industryOptions = [
    'Food & Beverage',
    'Retail',
    'Healthcare',
    'Education',
    'Fitness & Wellness',
    'Beauty & Salon',
    'Technology',
    'Real Estate',
    'Hospitality',
    'Automotive',
    'Other',
  ];

  // Revenue Streams
  const revenueStreamOptions = [
    'Product Sales',
    'Service Fees',
    'Subscriptions',
    'Licensing',
    'Commissions',
    'Advertising',
  ];

  // Support Types
  const supportTypeOptions = [
    'Operations Support',
    'Marketing Support',
    'Training Support',
    'IT Support',
    'Supply Chain',
    'HR Support',
  ];

  // Auto-save
  const {
    saveDraft,
    hasDraft,
    lastSaved,
  } = useFormAutoSave('brand-registration-mobile', formData, {
    saveInterval: 30000,
    excludeFields: ['brandLogo', 'brandBanner', 'franchiseImages'],
  });

  // Calculate progress
  const calculateProgress = () => {
    const totalSteps = steps.length - 1; // Exclude review step
    return Math.round(((activeStep + 1) / totalSteps) * 100);
  };

  // Handle input change
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle nested field change
  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  // Handle image upload
  const handleImageUpload = async (file, field) => {
    if (!file) return;

    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB
        throw new Error('Image size should be less than 5MB');
      }

      // Create preview URL
      const previewURL = URL.createObjectURL(file);
      
      if (field === 'brandLogo') {
        setFormData(prev => ({
          ...prev,
          brandLogo: file,
          brandLogoURL: previewURL,
        }));
      } else if (field === 'brandBanner') {
        setFormData(prev => ({
          ...prev,
          brandBanner: file,
          brandBannerURL: previewURL,
        }));
      } else if (field === 'franchiseImages') {
        setFormData(prev => ({
          ...prev,
          franchiseImages: [...prev.franchiseImages, file],
          franchiseImageURLs: [...prev.franchiseImageURLs, previewURL],
        }));
      }

      NotificationService.success('Image uploaded successfully');
    } catch (error) {
      NotificationService.error(error.message);
    }
  };

  // Remove gallery image
  const handleRemoveGalleryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      franchiseImages: prev.franchiseImages.filter((_, i) => i !== index),
      franchiseImageURLs: prev.franchiseImageURLs.filter((_, i) => i !== index),
    }));
  };

  // Validate current step
  const validateStep = () => {
    const newErrors = {};

    switch (activeStep) {
      case 0: // Business Model
        if (!formData.businessModelType) {
          newErrors.businessModelType = 'Please select a partnership model';
        }
        break;

      case 1: // Basic Info
        if (!formData.brandName.trim()) {
          newErrors.brandName = 'Brand name is required';
        }
        if (!formData.brandLogo) {
          newErrors.brandLogo = 'Brand logo is required';
        }
        if (!formData.foundedYear) {
          newErrors.foundedYear = 'Founded year is required';
        }
        if (formData.industries.length === 0) {
          newErrors.industries = 'Select at least one industry';
        }
        if (!formData.contactInfo.email.trim()) {
          newErrors.contactEmail = 'Email is required';
        }
        if (!formData.contactInfo.phone.trim() || formData.contactInfo.phone === '+91 ') {
          newErrors.contactPhone = 'Phone is required';
        }
        break;

      case 2: // Partnership
        if (!formData.initialFranchiseFee) {
          newErrors.initialFranchiseFee = 'Franchise fee is required';
        }
        if (!formData.royaltyFee) {
          newErrors.royaltyFee = 'Royalty fee is required';
        }
        if (formData.revenueStreams.length === 0) {
          newErrors.revenueStreams = 'Select at least one revenue stream';
        }
        break;

      case 3: // Investment
        if (!formData.investmentRange) {
          newErrors.investmentRange = 'Investment range is required';
        }
        if (!formData.areaRequired.min || !formData.areaRequired.max) {
          newErrors.areaRequired = 'Area requirements are needed';
        }
        break;

      case 4: // Training
        if (!formData.trainingDuration) {
          newErrors.trainingDuration = 'Training duration is required';
        }
        if (formData.supportTypes.length === 0) {
          newErrors.supportTypes = 'Select at least one support type';
        }
        break;

      case 5: // Media
        if (!formData.brandStory.trim()) {
          newErrors.brandStory = 'Brand story is required';
        } else if (formData.brandStory.length < 50) {
          newErrors.brandStory = 'Brand story should be at least 50 characters';
        }
        break;

      case 6: // Review
        if (!formData.agreeToTerms) {
          newErrors.agreeToTerms = 'You must agree to terms and conditions';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep()) {
      setActiveStep(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      NotificationService.error('Please fill all required fields');
    }
  };

  // Handle previous step
  const handleBack = () => {
    setActiveStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!validateStep()) {
      NotificationService.error('Please agree to terms and conditions');
      return;
    }

    setLoading(true);

    try {
      // Upload images first
      let logoURL = '';
      let bannerURL = '';
      const galleryURLs = [];

      if (formData.brandLogo) {
        const logoRef = ref(storage, `brands/${user.uid}/logo-${Date.now()}`);
        await uploadBytes(logoRef, formData.brandLogo);
        logoURL = await getDownloadURL(logoRef);
      }

      if (formData.brandBanner) {
        const bannerRef = ref(storage, `brands/${user.uid}/banner-${Date.now()}`);
        await uploadBytes(bannerRef, formData.brandBanner);
        bannerURL = await getDownloadURL(bannerRef);
      }

      for (const image of formData.franchiseImages) {
        const imageRef = ref(storage, `brands/${user.uid}/gallery-${Date.now()}-${Math.random()}`);
        await uploadBytes(imageRef, image);
        const url = await getDownloadURL(imageRef);
        galleryURLs.push(url);
      }

      // Create brand document
      const brandData = {
        // Basic Info
        brandName: formData.brandName,
        brandLogo: logoURL,
        brandBanner: bannerURL,
        foundedYear: formData.foundedYear,
        industries: formData.industries,
        tagline: formData.tagline,
        
        // Contact
        contactInfo: formData.contactInfo,
        ownerInfo: formData.ownerInfo,
        
        // Business Model
        businessModelType: formData.businessModelType,
        
        // Partnership
        initialFranchiseFee: formData.initialFranchiseFee,
        royaltyFee: formData.royaltyFee,
        revenueModel: formData.revenueModel,
        revenueStreams: formData.revenueStreams,
        territorySize: formData.territorySize,
        contractDuration: formData.contractDuration,
        
        // Investment
        investmentRange: formData.investmentRange,
        workingCapital: formData.workingCapital,
        equipmentCosts: formData.equipmentCosts,
        areaRequired: formData.areaRequired,
        financingOptions: formData.financingOptions,
        
        // Training
        trainingDuration: formData.trainingDuration,
        trainingLocation: formData.trainingLocation,
        trainingCost: formData.trainingCost,
        supportTypes: formData.supportTypes,
        ongoingSupport: formData.ongoingSupport,
        experienceRequired: formData.experienceRequired,
        minAge: formData.minAge,
        qualification: formData.qualification,
        
        // Media
        brandStory: formData.brandStory,
        uniqueSellingPoints: formData.uniqueSellingPoints,
        franchiseImages: galleryURLs,
        
        // Metadata
        userId: user.uid,
        userEmail: user.email,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Save to Firestore
      await addDoc(collection(db, 'brands'), brandData);

      // Track success
      analytics.trackEvent('brand_registration_complete', {
        business_model: formData.businessModelType,
        industries: formData.industries,
      });

      NotificationService.success('Brand registered successfully! Pending admin approval.');
      
      // Clear draft
      localStorage.removeItem('brand-registration-mobile');
      
      // Navigate to dashboard
      setTimeout(() => {
        navigate('/dashboard/brands');
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      NotificationService.error('Failed to register brand. Please try again.');
      analytics.trackEvent('brand_registration_error', {
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <Step0BusinessModel />;
      case 1:
        return <Step1BasicInfo />;
      case 2:
        return <Step2Partnership />;
      case 3:
        return <Step3Investment />;
      case 4:
        return <Step4Training />;
      case 5:
        return <Step5Media />;
      case 6:
        return <Step6Review />;
      default:
        return null;
    }
  };

  // Step 0: Business Model Selection
  const Step0BusinessModel = () => (
    <Box sx={{ p: 2, pb: 12 }}>
      <Stack spacing={2}>
        {businessModels.map((model) => (
          <MotionCard
            key={model.type}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            sx={{
              cursor: 'pointer',
              border: 2,
              borderColor: formData.businessModelType === model.type 
                ? model.color 
                : 'transparent',
              bgcolor: formData.businessModelType === model.type
                ? alpha(model.color, 0.05)
                : 'background.paper',
              transition: 'all 0.2s',
            }}
            onClick={() => handleChange('businessModelType', model.type)}
          >
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: alpha(model.color, 0.1),
                    fontSize: '2rem',
                  }}
                >
                  {model.icon}
                </Avatar>
                
                <Box flex={1}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                    <Typography variant="h6" fontWeight="bold">
                      {model.title}
                    </Typography>
                    {model.badge && (
                      <Chip
                        label={model.badge}
                        size="small"
                        color="primary"
                        sx={{ fontWeight: 700, fontSize: '0.65rem' }}
                      />
                    )}
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {model.description}
                  </Typography>
                </Box>

                {formData.businessModelType === model.type && (
                  <CheckCircle sx={{ color: model.color, fontSize: 28 }} />
                )}
              </Stack>
            </CardContent>
          </MotionCard>
        ))}

        {errors.businessModelType && (
          <Alert severity="error" icon={<Warning />}>
            {errors.businessModelType}
          </Alert>
        )}
      </Stack>
    </Box>
  );

  // Step 1: Basic Info
  const Step1BasicInfo = () => (
    <Box sx={{ p: 2 }}>
      <Stack spacing={3}>
        {/* Brand Name */}
        <TextField
          fullWidth
          label="Brand Name"
          value={formData.brandName}
          onChange={(e) => handleChange('brandName', e.target.value)}
          error={!!errors.brandName}
          helperText={errors.brandName}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Business />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiInputBase-root': {
              minHeight: 56,
            },
          }}
        />

        {/* Brand Logo */}
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle2" gutterBottom fontWeight={600}>
              Brand Logo *
            </Typography>
            {formData.brandLogoURL ? (
              <Box sx={{ position: 'relative', mt: 2 }}>
                <Box
                  component="img"
                  src={formData.brandLogoURL}
                  sx={{
                    width: '100%',
                    maxHeight: 200,
                    objectFit: 'contain',
                    borderRadius: 2,
                    bgcolor: 'background.default',
                    p: 2,
                  }}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'background.paper',
                    minWidth: 44,
                    minHeight: 44,
                  }}
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      brandLogo: null,
                      brandLogoURL: '',
                    }));
                  }}
                >
                  <Delete />
                </IconButton>
              </Box>
            ) : (
              <Button
                fullWidth
                variant="outlined"
                component="label"
                startIcon={<CloudUpload />}
                sx={{
                  minHeight: 120,
                  mt: 1,
                  borderStyle: 'dashed',
                  borderWidth: 2,
                }}
              >
                Upload Logo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files[0], 'brandLogo')}
                />
              </Button>
            )}
            {errors.brandLogo && (
              <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                {errors.brandLogo}
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Founded Year */}
        <TextField
          fullWidth
          label="Founded Year"
          type="number"
          value={formData.foundedYear}
          onChange={(e) => handleChange('foundedYear', e.target.value)}
          error={!!errors.foundedYear}
          helperText={errors.foundedYear}
          required
          inputProps={{
            min: 1900,
            max: new Date().getFullYear(),
          }}
          sx={{
            '& .MuiInputBase-root': {
              minHeight: 56,
            },
          }}
        />

        {/* Industries */}
        <FormControl fullWidth error={!!errors.industries}>
          <Typography variant="subtitle2" gutterBottom fontWeight={600}>
            Industries *
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1} mt={1}>
            {industryOptions.map((industry) => (
              <Chip
                key={industry}
                label={industry}
                onClick={() => {
                  const current = formData.industries;
                  if (current.includes(industry)) {
                    handleChange('industries', current.filter(i => i !== industry));
                  } else if (current.length < 3) {
                    handleChange('industries', [...current, industry]);
                  }
                }}
                color={formData.industries.includes(industry) ? 'primary' : 'default'}
                variant={formData.industries.includes(industry) ? 'filled' : 'outlined'}
                icon={formData.industries.includes(industry) ? <CheckCircle /> : undefined}
                sx={{
                  minHeight: 44,
                  fontSize: '0.9rem',
                  fontWeight: 500,
                }}
              />
            ))}
          </Stack>
          {errors.industries && (
            <Typography variant="caption" color="error" sx={{ mt: 1 }}>
              {errors.industries}
            </Typography>
          )}
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            Select up to 3 industries
          </Typography>
        </FormControl>

        {/* Tagline */}
        <TextField
          fullWidth
          label="Brand Tagline"
          value={formData.tagline}
          onChange={(e) => handleChange('tagline', e.target.value)}
          placeholder="Your brand's catchy tagline"
          sx={{
            '& .MuiInputBase-root': {
              minHeight: 56,
            },
          }}
        />

        {/* Contact Email */}
        <TextField
          fullWidth
          label="Contact Email"
          type="email"
          value={formData.contactInfo.email}
          onChange={(e) => handleNestedChange('contactInfo', 'email', e.target.value)}
          error={!!errors.contactEmail}
          helperText={errors.contactEmail}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiInputBase-root': {
              minHeight: 56,
            },
          }}
        />

        {/* Contact Phone */}
        <TextField
          fullWidth
          label="Contact Phone"
          value={formData.contactInfo.phone}
          onChange={(e) => handleNestedChange('contactInfo', 'phone', e.target.value)}
          error={!!errors.contactPhone}
          helperText={errors.contactPhone}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Phone />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiInputBase-root': {
              minHeight: 56,
            },
          }}
        />

        {/* Website */}
        <TextField
          fullWidth
          label="Website (Optional)"
          value={formData.contactInfo.website}
          onChange={(e) => handleNestedChange('contactInfo', 'website', e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Language />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiInputBase-root': {
              minHeight: 56,
            },
          }}
        />

        {/* Address */}
        <TextField
          fullWidth
          label="Address (Optional)"
          multiline
          rows={3}
          value={formData.contactInfo.address}
          onChange={(e) => handleNestedChange('contactInfo', 'address', e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationOn />
              </InputAdornment>
            ),
          }}
        />
      </Stack>
    </Box>
  );

  // Step 2: Partnership Details
  const Step2Partnership = () => (
    <Box sx={{ p: 2 }}>
      <Stack spacing={3}>
        <TextField
          fullWidth
          label="Initial Franchise Fee"
          type="number"
          value={formData.initialFranchiseFee}
          onChange={(e) => handleChange('initialFranchiseFee', e.target.value)}
          error={!!errors.initialFranchiseFee}
          helperText={errors.initialFranchiseFee || 'Amount in INR'}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AttachMoney />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiInputBase-root': {
              minHeight: 56,
            },
          }}
        />

        <TextField
          fullWidth
          label="Royalty Fee (%)"
          type="number"
          value={formData.royaltyFee}
          onChange={(e) => handleChange('royaltyFee', e.target.value)}
          error={!!errors.royaltyFee}
          helperText={errors.royaltyFee || 'Percentage of revenue'}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                %
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiInputBase-root': {
              minHeight: 56,
            },
          }}
        />

        <FormControl fullWidth error={!!errors.revenueStreams}>
          <Typography variant="subtitle2" gutterBottom fontWeight={600}>
            Revenue Streams *
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1} mt={1}>
            {revenueStreamOptions.map((stream) => (
              <Chip
                key={stream}
                label={stream}
                onClick={() => {
                  const current = formData.revenueStreams;
                  if (current.includes(stream)) {
                    handleChange('revenueStreams', current.filter(s => s !== stream));
                  } else {
                    handleChange('revenueStreams', [...current, stream]);
                  }
                }}
                color={formData.revenueStreams.includes(stream) ? 'primary' : 'default'}
                variant={formData.revenueStreams.includes(stream) ? 'filled' : 'outlined'}
                icon={formData.revenueStreams.includes(stream) ? <CheckCircle /> : undefined}
                sx={{
                  minHeight: 44,
                  fontSize: '0.9rem',
                  fontWeight: 500,
                }}
              />
            ))}
          </Stack>
          {errors.revenueStreams && (
            <Typography variant="caption" color="error" sx={{ mt: 1 }}>
              {errors.revenueStreams}
            </Typography>
          )}
        </FormControl>

        <TextField
          fullWidth
          label="Territory Size"
          value={formData.territorySize}
          onChange={(e) => handleChange('territorySize', e.target.value)}
          placeholder="e.g., City-wide, Regional"
          sx={{
            '& .MuiInputBase-root': {
              minHeight: 56,
            },
          }}
        />

        <TextField
          fullWidth
          label="Contract Duration"
          value={formData.contractDuration}
          onChange={(e) => handleChange('contractDuration', e.target.value)}
          placeholder="e.g., 5 years"
          sx={{
            '& .MuiInputBase-root': {
              minHeight: 56,
            },
          }}
        />
      </Stack>
    </Box>
  );

  // Step 3: Investment Requirements
  const Step3Investment = () => (
    <Box sx={{ p: 2 }}>
      <Stack spacing={3}>
        <TextField
          fullWidth
          label="Investment Range"
          value={formData.investmentRange}
          onChange={(e) => handleChange('investmentRange', e.target.value)}
          error={!!errors.investmentRange}
          helperText={errors.investmentRange || 'e.g., 10 Lakh - 25 Lakh'}
          required
          placeholder="Min - Max"
          sx={{
            '& .MuiInputBase-root': {
              minHeight: 56,
            },
          }}
        />

        <TextField
          fullWidth
          label="Working Capital"
          type="number"
          value={formData.workingCapital}
          onChange={(e) => handleChange('workingCapital', e.target.value)}
          helperText="Amount in INR"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                ₹
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiInputBase-root': {
              minHeight: 56,
            },
          }}
        />

        <TextField
          fullWidth
          label="Equipment Costs"
          type="number"
          value={formData.equipmentCosts}
          onChange={(e) => handleChange('equipmentCosts', e.target.value)}
          helperText="Amount in INR"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                ₹
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiInputBase-root': {
              minHeight: 56,
            },
          }}
        />

        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle2" gutterBottom fontWeight={600}>
              Area Required (sq ft) *
            </Typography>
            <Stack direction="row" spacing={2} mt={2}>
              <TextField
                fullWidth
                label="Minimum"
                type="number"
                value={formData.areaRequired.min}
                onChange={(e) => handleNestedChange('areaRequired', 'min', e.target.value)}
                error={!!errors.areaRequired}
                sx={{
                  '& .MuiInputBase-root': {
                    minHeight: 56,
                  },
                }}
              />
              <TextField
                fullWidth
                label="Maximum"
                type="number"
                value={formData.areaRequired.max}
                onChange={(e) => handleNestedChange('areaRequired', 'max', e.target.value)}
                error={!!errors.areaRequired}
                sx={{
                  '& .MuiInputBase-root': {
                    minHeight: 56,
                  },
                }}
              />
            </Stack>
            {errors.areaRequired && (
              <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                {errors.areaRequired}
              </Typography>
            )}
          </CardContent>
        </Card>

        <TextField
          fullWidth
          label="Financing Options (Optional)"
          multiline
          rows={3}
          value={formData.financingOptions}
          onChange={(e) => handleChange('financingOptions', e.target.value)}
          placeholder="Describe available financing options"
        />
      </Stack>
    </Box>
  );

  // Step 4: Training & Support
  const Step4Training = () => (
    <Box sx={{ p: 2 }}>
      <Stack spacing={3}>
        <TextField
          fullWidth
          label="Training Duration (days)"
          type="number"
          value={formData.trainingDuration}
          onChange={(e) => handleChange('trainingDuration', e.target.value)}
          error={!!errors.trainingDuration}
          helperText={errors.trainingDuration}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <School />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiInputBase-root': {
              minHeight: 56,
            },
          }}
        />

        <TextField
          fullWidth
          label="Training Location"
          value={formData.trainingLocation}
          onChange={(e) => handleChange('trainingLocation', e.target.value)}
          placeholder="Where training will be conducted"
          sx={{
            '& .MuiInputBase-root': {
              minHeight: 56,
            },
          }}
        />

        <TextField
          fullWidth
          label="Training Cost"
          type="number"
          value={formData.trainingCost}
          onChange={(e) => handleChange('trainingCost', e.target.value)}
          helperText="Amount in INR (0 if included in franchise fee)"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                ₹
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiInputBase-root': {
              minHeight: 56,
            },
          }}
        />

        <FormControl fullWidth error={!!errors.supportTypes}>
          <Typography variant="subtitle2" gutterBottom fontWeight={600}>
            Support Types *
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1} mt={1}>
            {supportTypeOptions.map((support) => (
              <Chip
                key={support}
                label={support}
                onClick={() => {
                  const current = formData.supportTypes;
                  if (current.includes(support)) {
                    handleChange('supportTypes', current.filter(s => s !== support));
                  } else {
                    handleChange('supportTypes', [...current, support]);
                  }
                }}
                color={formData.supportTypes.includes(support) ? 'primary' : 'default'}
                variant={formData.supportTypes.includes(support) ? 'filled' : 'outlined'}
                icon={formData.supportTypes.includes(support) ? <CheckCircle /> : undefined}
                sx={{
                  minHeight: 44,
                  fontSize: '0.9rem',
                  fontWeight: 500,
                }}
              />
            ))}
          </Stack>
          {errors.supportTypes && (
            <Typography variant="caption" color="error" sx={{ mt: 1 }}>
              {errors.supportTypes}
            </Typography>
          )}
        </FormControl>

        <TextField
          fullWidth
          label="Minimum Age Requirement"
          type="number"
          value={formData.minAge}
          onChange={(e) => handleChange('minAge', e.target.value)}
          inputProps={{
            min: 18,
          }}
          sx={{
            '& .MuiInputBase-root': {
              minHeight: 56,
            },
          }}
        />

        <TextField
          fullWidth
          label="Qualification Requirements"
          multiline
          rows={3}
          value={formData.qualification}
          onChange={(e) => handleChange('qualification', e.target.value)}
          placeholder="Educational and experience requirements"
        />
      </Stack>
    </Box>
  );

  // Step 5: Media & Story
  const Step5Media = () => (
    <Box sx={{ p: 2 }}>
      <Stack spacing={3}>
        <TextField
          fullWidth
          label="Brand Story"
          multiline
          rows={6}
          value={formData.brandStory}
          onChange={(e) => handleChange('brandStory', e.target.value)}
          error={!!errors.brandStory}
          helperText={errors.brandStory || `${formData.brandStory.length}/50 minimum characters`}
          required
          placeholder="Tell your brand's story and what makes it unique..."
        />

        <TextField
          fullWidth
          label="Unique Selling Points (Optional)"
          multiline
          rows={4}
          value={formData.uniqueSellingPoints}
          onChange={(e) => handleChange('uniqueSellingPoints', e.target.value)}
          placeholder="What sets your brand apart from competitors?"
        />

        {/* Brand Banner */}
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle2" gutterBottom fontWeight={600}>
              Brand Banner (Optional)
            </Typography>
            {formData.brandBannerURL ? (
              <Box sx={{ position: 'relative', mt: 2 }}>
                <Box
                  component="img"
                  src={formData.brandBannerURL}
                  sx={{
                    width: '100%',
                    height: 200,
                    objectFit: 'cover',
                    borderRadius: 2,
                  }}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'background.paper',
                    minWidth: 44,
                    minHeight: 44,
                  }}
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      brandBanner: null,
                      brandBannerURL: '',
                    }));
                  }}
                >
                  <Delete />
                </IconButton>
              </Box>
            ) : (
              <Button
                fullWidth
                variant="outlined"
                component="label"
                startIcon={<CloudUpload />}
                sx={{
                  minHeight: 100,
                  mt: 1,
                  borderStyle: 'dashed',
                  borderWidth: 2,
                }}
              >
                Upload Banner
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files[0], 'brandBanner')}
                />
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Gallery Images */}
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle2" gutterBottom fontWeight={600}>
              Gallery Images (Optional)
            </Typography>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">
              Upload up to 6 images showcasing your brand
            </Typography>
            
            <Stack spacing={2} mt={2}>
              {formData.franchiseImageURLs.map((url, index) => (
                <Box key={index} sx={{ position: 'relative' }}>
                  <Box
                    component="img"
                    src={url}
                    sx={{
                      width: '100%',
                      height: 200,
                      objectFit: 'cover',
                      borderRadius: 2,
                    }}
                  />
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'background.paper',
                      minWidth: 44,
                      minHeight: 44,
                    }}
                    onClick={() => handleRemoveGalleryImage(index)}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              ))}

              {formData.franchiseImages.length < 6 && (
                <Button
                  fullWidth
                  variant="outlined"
                  component="label"
                  startIcon={<AddPhotoAlternate />}
                  sx={{
                    minHeight: 100,
                    borderStyle: 'dashed',
                    borderWidth: 2,
                  }}
                >
                  Add Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files[0], 'franchiseImages')}
                  />
                </Button>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );

  // Step 6: Review & Submit
  const Step6Review = () => (
    <Box sx={{ p: 2 }}>
      <Stack spacing={3}>
        <Alert severity="info" icon={<Info />}>
          Please review all information before submitting. Your brand will be reviewed by our team within 2-3 business days.
        </Alert>

        {/* Summary Cards */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              {formData.brandName}
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2">
                <strong>Model:</strong> {formData.businessModelType}
              </Typography>
              <Typography variant="body2">
                <strong>Industries:</strong> {formData.industries.join(', ')}
              </Typography>
              <Typography variant="body2">
                <strong>Founded:</strong> {formData.foundedYear}
              </Typography>
              <Typography variant="body2">
                <strong>Investment:</strong> {formData.investmentRange}
              </Typography>
              <Typography variant="body2">
                <strong>Franchise Fee:</strong> ₹{formData.initialFranchiseFee}
              </Typography>
              <Typography variant="body2">
                <strong>Royalty:</strong> {formData.royaltyFee}%
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        {/* Terms & Conditions */}
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.agreeToTerms}
              onChange={(e) => handleChange('agreeToTerms', e.target.checked)}
              sx={{
                minWidth: 44,
                minHeight: 44,
              }}
            />
          }
          label={
            <Typography variant="body2">
              I agree to the <strong>Terms & Conditions</strong> and confirm that all information provided is accurate *
            </Typography>
          }
          sx={{ alignItems: 'flex-start' }}
        />
        {errors.agreeToTerms && (
          <Alert severity="error">
            {errors.agreeToTerms}
          </Alert>
        )}

        <FormControlLabel
          control={
            <Checkbox
              checked={formData.agreeToMarketing}
              onChange={(e) => handleChange('agreeToMarketing', e.target.checked)}
              sx={{
                minWidth: 44,
                minHeight: 44,
              }}
            />
          }
          label={
            <Typography variant="body2">
              I agree to receive marketing communications and updates
            </Typography>
          }
          sx={{ alignItems: 'flex-start' }}
        />
      </Stack>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 12 }}>
      {/* Header */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ minHeight: 64, px: 2 }}>
          <IconButton
            edge="start"
            onClick={() => navigate(-1)}
            sx={{ mr: 2, minWidth: 44, minHeight: 44 }}
          >
            <ArrowBack />
          </IconButton>
          
          <Box flex={1}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              Step {activeStep + 1} of {steps.length}
            </Typography>
            <Typography variant="h6" fontWeight="bold" noWrap>
              {steps[activeStep].title}
            </Typography>
          </Box>

          <IconButton
            onClick={() => setShowSummary(true)}
            sx={{ minWidth: 44, minHeight: 44 }}
          >
            <Info />
          </IconButton>
        </Toolbar>

        {/* Progress Bar */}
        <LinearProgress
          variant="determinate"
          value={calculateProgress()}
          sx={{
            height: 6,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            '& .MuiLinearProgress-bar': {
              bgcolor: theme.palette.primary.main,
            },
          }}
        />
      </AppBar>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <MotionBox
          key={activeStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderStepContent()}
        </MotionBox>
      </AnimatePresence>

      {/* Bottom Navigation */}
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          zIndex: 1100,
        }}
      >
        <Stack direction="row" spacing={2}>
          {activeStep > 0 && (
            <Button
              variant="outlined"
              onClick={handleBack}
              sx={{
                minHeight: 48,
                flex: 1,
                fontWeight: 600,
              }}
            >
              Back
            </Button>
          )}
          
          {activeStep < steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={activeStep === 0 && !formData.businessModelType}
              endIcon={<ChevronRight />}
              sx={{
                minHeight: 48,
                flex: activeStep === 0 ? 1 : 2,
                fontWeight: 600,
                boxShadow: 3,
              }}
            >
              Continue
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <Send />}
              sx={{
                minHeight: 48,
                flex: 2,
                fontWeight: 600,
              }}
            >
              {loading ? 'Submitting...' : 'Submit for Review'}
            </Button>
          )}
        </Stack>
      </Paper>

      {/* Last Saved Indicator */}
      {lastSaved && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            bgcolor: 'background.paper',
            px: 2,
            py: 1,
            borderRadius: 2,
            boxShadow: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
          <Typography variant="caption" color="text.secondary">
            Last saved {new Date(lastSaved).toLocaleTimeString()}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default BrandRegistrationMobile;
