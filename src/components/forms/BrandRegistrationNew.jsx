import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from 'react-i18next';
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
  LinearProgress,
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
  PhotoCamera as PhotoCameraIcon,
  People as PeopleIcon,
  SupportAgent as SupportIcon,
  Gavel as GavelIcon,
  Help as HelpIcon,
  HelpOutline as HelpOutlineIcon,
  AutoFixHigh
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
import { getEnhancedError, formatErrorMessage } from "../../utils/enhancedErrors";
import DocumentOCRDialog from "./DocumentOCRDialog";
import AIContentAssistant from "./AIContentAssistant";
import useFormAutoSave from "../../hooks/useFormAutoSave";
import { useFieldValidation, validators } from "../../hooks/useFieldValidation";
import ValidationIndicator from "../common/ValidationIndicator";
import FieldHelp from "../common/FieldHelp";
import WelcomeTour from "./WelcomeTour";
import DocumentChecklist from "./DocumentChecklist";
import DragDropUpload from "../common/DragDropUpload";
import GalleryManager from "../common/GalleryManager";
import ValidationSummaryModal from "./ValidationSummaryModal";
import StepPreviewSidebar from "../common/StepPreviewSidebar";
import HighContrastToggle from "../common/HighContrastToggle";
import DataExport from "../common/DataExport";
import ConditionalField from "../common/ConditionalField";

// Import our new components
import CardSelector from "./CardSelector";
import QuickValueSelector from "./QuickValueSelector";

// Import configurations
import { BUSINESS_MODEL_CONFIG, BUSINESS_MODEL_TYPES } from "../../constants/businessModels";
import { getBusinessModelFields, getFieldOptions } from "../../constants/businessModelFields";
import { isFieldVisible } from "../../utils/conditionalFields";
import * as analytics from "../../utils/analytics";

const BrandRegistrationNew = () => {
  const { t } = useTranslation(['form', 'common']);
  
  const steps = [
    {
      id: 0,
      label: t('steps.businessModel'),
      description: t('businessModel.description'),
      icon: <BusinessIcon />
    },
    {
      id: 1,
      label: t('steps.basicInfo'),
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
      label: t('steps.investment'),
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
      label: t('steps.media'),
      description: 'Images and additional information',
      icon: <PhotoCameraIcon />
    },
    {
      id: 6,
      label: t('steps.review'),
      description: t('review.subtitle'),
      icon: <CheckIcon />
    },
  ];

  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const fileInputRefs = useRef({});
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [showDraftRecovery, setShowDraftRecovery] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    logo: 0,
    banner: 0,
    gallery: []
  });
  const [showWelcomeTour, setShowWelcomeTour] = useState(false);
  const [showDocumentChecklist, setShowDocumentChecklist] = useState(false);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
  const [showValidationSummary, setShowValidationSummary] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showOCRDialog, setShowOCRDialog] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

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
    trainingLocation: "Hybrid",
    trainingCost: "Included in Fee",
    trainingDetails: "",
    ongoingSupport: [],
    marketingSupport: [],
    operationalStandards: "",
    qualityControl: "",
    franchiseeObligations: "",
    franchisorSupport: "",
    experienceRequired: [],
    educationRequirement: "",
    qualification: "",
    minAge: "",
    maxAge: "",
    backgroundCheckRequired: false,
    partnerCriteria: "",
    
    // Step 5: Legal Framework & Territory
    territoryRights: "",
    franchiseTermLength: "",
    contractDuration: "",
    terminationConditions: "",
    transferConditions: "",
    disputeResolution: "",
    nonCompeteRestrictions: "",
    agreementType: "",
    renewalTerms: "",
    exclusivityClause: "",
    legalCompliance: "",
    
    // Business Model & Revenue
    businessModel: [],
    revenueModel: "",
    revenueStreams: [], // Industry-specific revenue sources
    franchiseModels: [],
    
    // Additional fields
    status: "pending"
  });

  // Auto-save functionality - memoize excludeFields and onRecover to prevent recreation
  const excludeFieldsForAutoSave = useMemo(
    () => ['brandLogo', 'brandBanner', 'franchiseImages'],
    []
  );
  
  const handleRecoverDraft = useCallback((recoveredData) => {
    setFormData(prev => ({ ...prev, ...recoveredData }));
    setShowDraftRecovery(false);
  }, []);
  
  const {
    saveDraft,
    recoverDraft,
    clearDraft,
    hasDraft,
    lastSaved,
  } = useFormAutoSave('brand-registration', formData, {
    saveInterval: 30000, // Save every 30 seconds
    excludeFields: excludeFieldsForAutoSave,
    showNotifications: true,
    onRecover: handleRecoverDraft
  });

  // Analytics: Track form start
  useEffect(() => {
    analytics.trackFormStart(formData.businessModelType || 'not_selected');
    analytics.resetStepTimer();
    analytics.trackPageView('Brand Registration Form');
    
    // Track session recovery if applicable
    if (hasDraft) {
      analytics.trackSessionRecovery();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Analytics: Track step changes
  useEffect(() => {
    if (activeStep > 0) { // Don't track initial load
      const timeSpent = analytics.getStepTimeSpent();
      analytics.trackStepNavigation(activeStep, steps[activeStep].label, timeSpent);
      analytics.resetStepTimer();
    }
  }, [activeStep]); // eslint-disable-line react-hooks/exhaustive-deps

  // Analytics: Track business model selection
  useEffect(() => {
    if (formData.businessModelType) {
      analytics.trackBusinessModelSelection(formData.businessModelType);
    }
  }, [formData.businessModelType]);

  // Check for draft on mount
  useEffect(() => {
    if (hasDraft && !formData.brandName) {
      setShowDraftRecovery(true);
    }
  }, [hasDraft, formData.brandName]);

  // Session management - Browser close warning
  React.useEffect(() => {
    const hasUnsavedChanges = formData.brandName || 
      formData.contactInfo.email || 
      formData.contactInfo.phone ||
      formData.industries.length > 0;

    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges && !loading) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [formData, loading]);

  // Session timeout warning
  React.useEffect(() => {
    let inactivityTimer;
    let warningTimer;
    const INACTIVITY_TIME = 30 * 60 * 1000; // 30 minutes
    const WARNING_TIME = 28 * 60 * 1000; // 28 minutes (warn 2 min before timeout)

    const resetTimers = () => {
      clearTimeout(inactivityTimer);
      clearTimeout(warningTimer);

      // Show warning before timeout
      warningTimer = setTimeout(() => {
        if (formData.brandName && !loading) {
          const proceed = window.confirm(
            'You\'ve been inactive for 28 minutes. Your session will expire in 2 minutes. ' +
            'Click OK to continue working (your draft has been auto-saved).'
          );
          if (proceed) {
            resetTimers();
          }
        }
      }, WARNING_TIME);

      // Auto-save and show final warning on timeout
      inactivityTimer = setTimeout(() => {
        if (formData.brandName && !loading) {
          saveDraft(); // Save one last time
          alert(
            'Your session has expired due to inactivity. ' +
            'Your progress has been saved as a draft. Please refresh the page to continue.'
          );
        }
      }, INACTIVITY_TIME);
    };

    // Track user activity
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    activityEvents.forEach(event => {
      window.addEventListener(event, resetTimers);
    });

    resetTimers();

    return () => {
      clearTimeout(inactivityTimer);
      clearTimeout(warningTimer);
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetTimers);
      });
    };
  }, [formData.brandName, loading, saveDraft]);

  // Real-time validation hooks - memoized to prevent recreation
  const brandNameValidators = useMemo(
    () => [validators.required('Brand name'), validators.minLength(2)],
    []
  );
  const brandNameValidation = useFieldValidation(
    formData.brandName,
    brandNameValidators,
    500
  );

  const emailValidators = useMemo(
    () => [validators.required('Email'), validators.email],
    []
  );
  const emailValidation = useFieldValidation(
    formData.contactInfo.email,
    emailValidators,
    500
  );

  const phoneValidators = useMemo(
    () => [validators.required('Phone'), validators.phone],
    []
  );
  const phoneValidation = useFieldValidation(
    formData.contactInfo.phone,
    phoneValidators,
    500
  );

  const websiteValidators = useMemo(
    () => formData.contactInfo.website ? [validators.url] : [],
    [formData.contactInfo.website]
  );
  const websiteValidation = useFieldValidation(
    formData.contactInfo.website,
    websiteValidators,
    500
  );

  const ownerEmailValidators = useMemo(
    () => [validators.required('Owner email'), validators.email],
    []
  );
  const ownerEmailValidation = useFieldValidation(
    formData.ownerInfo.email,
    ownerEmailValidators,
    500
  );

  const foundedYearValidators = useMemo(
    () => [validators.required('Founded year'), validators.year],
    []
  );
  const foundedYearValidation = useFieldValidation(
    formData.foundedYear,
    foundedYearValidators,
    500
  );

  // Partnership/Investment validations
  const franchiseFeeValidators = useMemo(
    () => formData.initialFranchiseFee ? [validators.number] : [],
    [formData.initialFranchiseFee]
  );
  const franchiseFeeValidation = useFieldValidation(
    formData.initialFranchiseFee,
    franchiseFeeValidators,
    500
  );

  const royaltyFeeValidators = useMemo(
    () => formData.royaltyFee ? [validators.number] : [],
    [formData.royaltyFee]
  );
  const royaltyFeeValidation = useFieldValidation(
    formData.royaltyFee,
    royaltyFeeValidators,
    500
  );

  const investmentMinValidators = useMemo(
    () => formData.investmentRange ? [validators.number] : [],
    [formData.investmentRange]
  );
  const investmentMinValidation = useFieldValidation(
    formData.investmentRange.split('-')[0]?.trim(),
    investmentMinValidators,
    500
  );

  const areaMinValidators = useMemo(
    () => formData.areaRequired.min ? [validators.number] : [],
    [formData.areaRequired.min]
  );
  const areaMinValidation = useFieldValidation(
    formData.areaRequired.min,
    areaMinValidators,
    500
  );

  const areaMaxValidators = useMemo(
    () => formData.areaRequired.max ? [validators.number] : [],
    [formData.areaRequired.max]
  );
  const areaMaxValidation = useFieldValidation(
    formData.areaRequired.max,
    areaMaxValidators,
    500
  );

  // Training validations
  const trainingDurationValidators = useMemo(
    () => formData.trainingDuration ? [validators.number] : [],
    [formData.trainingDuration]
  );
  const trainingDurationValidation = useFieldValidation(
    formData.trainingDuration,
    trainingDurationValidators,
    500
  );

  const minAgeValidators = useMemo(
    () => formData.minAge ? [validators.number, validators.min(18, 'Minimum age')] : [],
    [formData.minAge]
  );
  const minAgeValidation = useFieldValidation(
    formData.minAge,
    minAgeValidators,
    500
  );

  // Owner info validations
  const ownerPhoneValidators = useMemo(
    () => formData.ownerInfo.phone ? [validators.phone] : [],
    [formData.ownerInfo.phone]
  );
  const ownerPhoneValidation = useFieldValidation(
    formData.ownerInfo.phone,
    ownerPhoneValidators,
    500
  );

  const linkedinValidators = useMemo(
    () => formData.ownerInfo.linkedinUrl ? [validators.url] : [],
    [formData.ownerInfo.linkedinUrl]
  );
  const linkedinValidation = useFieldValidation(
    formData.ownerInfo.linkedinUrl,
    linkedinValidators,
    500
  );

  // Brand story validation
  const brandStoryValidators = useMemo(
    () => formData.brandStory ? [validators.minLength(50)] : [],
    [formData.brandStory]
  );
  const brandStoryValidation = useFieldValidation(
    formData.brandStory,
    brandStoryValidators,
    500
  );

  // Get current business model configuration
  const currentModelConfig = formData.businessModelType ? 
    BUSINESS_MODEL_CONFIG[formData.businessModelType] : null;
  
  // Get field configuration for current business model
  const modelFields = formData.businessModelType ? 
    getBusinessModelFields(formData.businessModelType) : null;

  // Show welcome tour on first visit
  React.useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenBrandRegistrationTour');
    const hasSeenChecklist = localStorage.getItem('hasSeenDocumentChecklist');
    
    // Show document checklist first if not seen
    if (!hasSeenChecklist && !hasDraft) {
      setShowDocumentChecklist(true);
    } 
    // Then show welcome tour if not seen
    else if (!hasSeenTour && !hasDraft) {
      setShowWelcomeTour(true);
    }
  }, [hasDraft]);

  // Keyboard navigation support
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in input fields
      const activeElement = document.activeElement;
      const isTyping = activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.isContentEditable
      );

      // Arrow key navigation for steps (when not typing)
      if (!isTyping) {
        if (e.key === 'ArrowRight' && activeStep < steps.length - 1) {
          e.preventDefault();
          handleNext();
        } else if (e.key === 'ArrowLeft' && activeStep > 0) {
          e.preventDefault();
          handleBack();
        }
      }

      // Enter to submit on last step (when not in textarea)
      if (e.key === 'Enter' && !e.shiftKey && activeElement?.tagName !== 'TEXTAREA') {
        if (activeStep === steps.length - 1) {
          e.preventDefault();
          handleSubmit();
        }
      }

      // Escape to close modals
      if (e.key === 'Escape') {
        if (showValidationSummary) {
          setShowValidationSummary(false);
        }
        if (showDocumentChecklist) {
          setShowDocumentChecklist(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeStep, steps.length, showValidationSummary, showDocumentChecklist]);

  // Focus management - auto-focus first field on step change
  React.useEffect(() => {
    // Small delay to ensure DOM is updated
    const timer = setTimeout(() => {
      // Find first input/select/textarea in the current step
      const firstInput = document.querySelector(
        'input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled])'
      );
      
      if (firstInput && !showValidationSummary && !showDocumentChecklist) {
        firstInput.focus();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [activeStep, showValidationSummary, showDocumentChecklist]);

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
      
      // Track file upload
      analytics.trackFileUpload(file.type, file.size, activeStep);
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

  // OCR Data Handler
  const handleOCRDataExtracted = (extractedData) => {
    // Map OCR data to form fields
    const updates = {};

    // Business License mapping
    if (extractedData.licenseNumber) {
      updates.businessLicense = extractedData.licenseNumber;
    }
    if (extractedData.businessName && !formData.brandName) {
      updates.brandName = extractedData.businessName;
    }
    if (extractedData.ownerName && !formData.ownerName) {
      updates.ownerName = extractedData.ownerName;
    }
    if (extractedData.issueDate) {
      updates.establishedYear = new Date(extractedData.issueDate).getFullYear().toString();
    }
    if (extractedData.address) {
      updates.address = extractedData.address;
    }

    // Tax ID mapping
    if (extractedData.taxId) {
      updates.taxId = extractedData.taxId;
    }

    // Trademark mapping
    if (extractedData.trademarkName && !formData.brandName) {
      updates.brandName = extractedData.trademarkName;
    }
    if (extractedData.registrationNumber) {
      updates.trademarkRegistration = extractedData.registrationNumber;
    }

    // Incorporation Certificate mapping
    if (extractedData.companyName && !formData.brandName) {
      updates.brandName = extractedData.companyName;
    }
    if (extractedData.incorporationDate) {
      updates.establishedYear = new Date(extractedData.incorporationDate).getFullYear().toString();
    }
    if (extractedData.registrationNumber && !updates.businessLicense) {
      updates.businessRegistration = extractedData.registrationNumber;
    }

    // Update form data
    setFormData(prev => ({ ...prev, ...updates }));

    // Show success notification
    NotificationService.success(`Auto-filled ${Object.keys(updates).length} fields from document`);
    
    // Track OCR usage
    analytics.trackEvent('ocr_autofill', {
      fields_filled: Object.keys(updates).length,
      document_type: extractedData.documentType || 'unknown'
    });
  };

  // AI Content Handler
  const handleAIContentSelect = ({ content, type }) => {
    const updates = {};

    switch (type) {
      case 'description':
        updates.brandDescription = content;
        break;
      case 'usps':
        updates.uniqueSellingPoints = content;
        break;
      case 'tagline':
        updates.tagline = content;
        break;
      case 'partnerProfile':
        updates.idealPartnerProfile = content;
        break;
      default:
        break;
    }

    setFormData(prev => ({ ...prev, ...updates }));

    // Track AI usage
    analytics.trackEvent('ai_content_used', {
      content_type: type,
      content_length: content.length
    });
  };

  // Calculate step completion percentage
  const calculateStepCompletion = (stepIndex) => {
    let total = 0;
    let filled = 0;

    switch (stepIndex) {
      case 0: // Business Model Selection
        total = 1;
        if (formData.businessModelType) filled++;
        break;

      case 1: // Basic Information
        total = 8;
        if (formData.brandName?.trim()) filled++;
        if (formData.brandLogo) filled++;
        if (formData.foundedYear) filled++;
        if (formData.industries?.length > 0) filled++;
        if (formData.contactInfo?.email?.trim()) filled++;
        if (formData.contactInfo?.phone?.trim()) filled++;
        if (formData.contactInfo?.website?.trim()) filled++;
        if (formData.contactInfo?.address?.trim()) filled++;
        break;

      case 2: // Partnership Details
        total = 6;
        // Only count visible fields for this business model
        if (isFieldVisible('initialFranchiseFee', formData.businessModelType) && formData.initialFranchiseFee) filled++;
        if (isFieldVisible('royaltyFee', formData.businessModelType) && formData.royaltyFee) filled++;
        if (formData.revenueModel?.length > 0) filled++;
        if (formData.territorySize) filled++;
        if (formData.contractDuration) filled++;
        if (formData.renewalTerms?.trim()) filled++;
        break;

      case 3: // Investment Requirements
        total = 6;
        if (formData.investmentRange?.trim()) filled++;
        if (formData.workingCapital) filled++;
        if (formData.equipmentCosts) filled++;
        if (formData.areaRequired?.min) filled++;
        if (formData.areaRequired?.max) filled++;
        if (formData.financingOptions?.trim()) filled++;
        break;

      case 4: // Training & Support
        total = 7;
        if (formData.trainingDuration) filled++;
        if (formData.trainingLocation?.trim()) filled++;
        if (formData.trainingCost) filled++;
        if (formData.supportTypes?.length > 0) filled++;
        if (formData.ongoingSupport?.length > 0) filled++;
        if (formData.experienceRequired?.length > 0) filled++;
        if (formData.minAge) filled++;
        break;

      case 5: // Gallery & Final Details
        total = 3;
        if (formData.brandStory?.trim()?.length >= 50) filled++;
        if (formData.franchiseImages?.length > 0) filled++;
        if (formData.agreeToTerms) filled++;
        break;

      case 6: // Review
        return 100; // Review step is always 100% once reached

      default:
        return 0;
    }

    return total > 0 ? Math.round((filled / total) * 100) : 0;
  };

  // Calculate overall form completion
  const calculateOverallCompletion = () => {
    let totalCompletion = 0;
    for (let i = 0; i <= 5; i++) { // Only count actual form steps, not review
      totalCompletion += calculateStepCompletion(i);
    }
    return Math.round(totalCompletion / 6);
  };

  const validateStep = (stepIndex, returnErrors = false) => {
    const newErrors = {};
    
    switch (stepIndex) {
      case 0: // Business Model Selection
        if (!formData.businessModelType) {
          newErrors.businessModelType = "Please select a partnership type";
        }
        break;
        
      case 1: // Basic Information
        if (!formData.brandName.trim()) {
          const error = getEnhancedError('brandName', 'required');
          newErrors.brandName = formatErrorMessage(error);
        } else if (formData.brandName.trim().length < 2) {
          const error = getEnhancedError('brandName', 'tooShort');
          newErrors.brandName = formatErrorMessage(error);
        }
        
        if (!formData.brandLogo) {
          const error = getEnhancedError('logo', 'required');
          newErrors.brandLogo = formatErrorMessage(error);
        }
        
        if (!formData.industries.length) {
          const error = getEnhancedError('industries', 'required');
          newErrors.industries = formatErrorMessage(error);
        } else if (formData.industries.length > 3) {
          const error = getEnhancedError('industries', 'tooMany');
          newErrors.industries = formatErrorMessage(error);
        }
        
        if (!formData.contactInfo.phone.trim()) {
          const error = getEnhancedError('phone', 'required');
          newErrors.phone = formatErrorMessage(error);
        } else if (formData.contactInfo.phone.length < 10) {
          const error = getEnhancedError('phone', 'tooShort');
          newErrors.phone = formatErrorMessage(error);
        }
        
        if (!formData.contactInfo.email.trim()) {
          const error = getEnhancedError('email', 'required');
          newErrors.email = formatErrorMessage(error);
        }
        
        if (formData.foundedYear) {
          const year = parseInt(formData.foundedYear);
          const currentYear = new Date().getFullYear();
          if (year > currentYear) {
            const error = getEnhancedError('foundedYear', 'future');
            newErrors.foundedYear = formatErrorMessage(error);
          } else if (year < 1900) {
            const error = getEnhancedError('foundedYear', 'tooOld');
            newErrors.foundedYear = formatErrorMessage(error);
          }
        }
        break;
        
      case 2: // Partnership Details - Dynamic validation based on business model
        // Only validate franchise fees if they're visible for this business model
        if (isFieldVisible('initialFranchiseFee', formData.businessModelType)) {
          if (!formData.initialFranchiseFee) {
            const error = getEnhancedError('franchiseFee', 'required');
            newErrors.initialFranchiseFee = formatErrorMessage(error);
          } else {
            const fee = parseFloat(formData.initialFranchiseFee);
            if (isNaN(fee)) {
              const error = getEnhancedError('franchiseFee', 'notANumber');
              newErrors.initialFranchiseFee = formatErrorMessage(error);
            } else if (fee < 100000) {
              const error = getEnhancedError('franchiseFee', 'tooLow');
              newErrors.initialFranchiseFee = formatErrorMessage(error);
            } else if (fee > 50000000) {
              const error = getEnhancedError('franchiseFee', 'tooHigh');
              newErrors.initialFranchiseFee = formatErrorMessage(error);
            }
          }
        }
        
        if (isFieldVisible('royaltyFee', formData.businessModelType)) {
          if (!formData.royaltyFee) {
            const error = getEnhancedError('royaltyFee', 'required');
            newErrors.royaltyFee = formatErrorMessage(error);
          } else {
            const royalty = parseFloat(formData.royaltyFee);
            if (royalty < 2) {
              const error = getEnhancedError('royaltyFee', 'tooLow');
              newErrors.royaltyFee = formatErrorMessage(error);
            } else if (royalty > 15) {
              const error = getEnhancedError('royaltyFee', 'tooHigh');
              newErrors.royaltyFee = formatErrorMessage(error);
            }
          }
        }
        
        if (!formData.revenueStreams || formData.revenueStreams.length === 0) {
          newErrors.revenueStreams = 'Please select at least one revenue stream';
        }
        if (!formData.revenueModel) {
          newErrors.revenueModel = 'Payment structure is required';
        }
        
        if (isFieldVisible('territoryRights', formData.businessModelType)) {
          if (!formData.territoryRights) {
            newErrors.territoryRights = 'Territory rights selection is required';
          }
        }
        
        if (isFieldVisible('franchiseTermLength', formData.businessModelType)) {
          if (!formData.franchiseTermLength) {
            newErrors.franchiseTermLength = 'Partnership term is required';
          }
        }
        break;
        
      case 3: // Investment Requirements
        if (!formData.investmentRange) {
          const error = getEnhancedError('investmentRange', 'required');
          newErrors.investmentRange = formatErrorMessage(error);
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
          const error = getEnhancedError('trainingDuration', 'required');
          newErrors.trainingDuration = formatErrorMessage(error);
        }
        
        if (formData.minAge) {
          const age = parseInt(formData.minAge);
          if (age < 18) {
            const error = getEnhancedError('minAge', 'tooLow');
            newErrors.minAge = formatErrorMessage(error);
          } else if (age > 60) {
            const error = getEnhancedError('minAge', 'tooHigh');
            newErrors.minAge = formatErrorMessage(error);
          }
        }
        break;
        
      case 5: // Gallery & Final Details
        if (!formData.agreeToTerms) {
          const error = getEnhancedError('agreeToTerms', 'required');
          newErrors.agreeToTerms = formatErrorMessage(error);
        }
        if (!formData.brandStory || formData.brandStory.trim().length < 50) {
          if (!formData.brandStory) {
            const error = getEnhancedError('brandStory', 'required');
            newErrors.brandStory = formatErrorMessage(error);
          } else {
            const error = getEnhancedError('brandStory', 'tooShort', formData.brandStory.trim().length, 50);
            newErrors.brandStory = formatErrorMessage(error(formData.brandStory.trim().length, 50));
          }
        }
        break;

      case 6: // Review Step - No validation needed
        break;
    }
    
    if (returnErrors) {
      return newErrors;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      // Scroll to top when moving to next step
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveStep(prev => prev + 1);
    } else {
      // Scroll to top to show errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Focus on first field with error after a brief delay
      setTimeout(() => {
        const firstErrorField = document.querySelector(
          '.Mui-error input, .Mui-error textarea, .Mui-error select, [aria-invalid="true"]'
        );
        
        if (firstErrorField) {
          firstErrorField.focus();
          // Scroll the field into view if needed
          firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  // Helper function to format time since last save
  const formatTimeSince = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 hour ago';
    return `${hours} hours ago`;
  };

  const handleSubmit = async () => {
    const startTime = Date.now();
    
    // Validate all steps before submission
    const allErrors = {};
    for (let i = 0; i <= 5; i++) {
      const stepErrors = validateStep(i, true); // true = return errors instead of setting state
      if (stepErrors && Object.keys(stepErrors).length > 0) {
        Object.assign(allErrors, stepErrors);
      }
    }
    
    // If there are errors, show validation summary
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      setShowValidationSummary(true);
      setError("Please fix all validation errors before submitting.");
      
      // Track validation errors
      Object.keys(allErrors).forEach(fieldName => {
        analytics.trackValidationError(fieldName, 'required', activeStep);
      });
      
      return;
    }
    
    if (!validateStep(activeStep)) {
      // Scroll to top to show errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setError("Please fill in all required fields correctly before submitting.");
      return;
    }
    
    setLoading(true);
    setError("");
    setUploadProgress({ logo: 0, banner: 0, gallery: [] });
    
    try {
      // Upload brand logo to Firebase Storage
      let logoUrl = "";
      if (formData.brandLogo) {
        const logoRef = ref(storage, `brand-logos/${Date.now()}-${formData.brandLogo.name}`);
        const uploadTask = uploadBytesResumable(logoRef, formData.brandLogo);
        
        // Track upload progress
        await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(prev => ({ ...prev, logo: progress }));
            },
            (error) => reject(error),
            async () => {
              logoUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      }

      // Upload brand banner if exists
      let bannerUrl = "";
      if (formData.brandBanner) {
        const bannerRef = ref(storage, `brand-banners/${Date.now()}-${formData.brandBanner.name}`);
        const uploadTask = uploadBytesResumable(bannerRef, formData.brandBanner);
        
        // Track upload progress
        await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(prev => ({ ...prev, banner: progress }));
            },
            (error) => reject(error),
            async () => {
              bannerUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      }

      // Upload franchise images to Firebase Storage
      const imageUrls = [];
      if (formData.franchiseImages && formData.franchiseImages.length > 0) {
        for (let i = 0; i < formData.franchiseImages.length; i++) {
          const image = formData.franchiseImages[i];
          if (image instanceof File) {
            const imageRef = ref(storage, `franchise-images/${Date.now()}-${image.name}`);
            const uploadTask = uploadBytesResumable(imageRef, image);
            
            // Track each image upload progress
            await new Promise((resolve, reject) => {
              uploadTask.on(
                'state_changed',
                (snapshot) => {
                  const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  setUploadProgress(prev => {
                    const newGallery = [...prev.gallery];
                    newGallery[i] = progress;
                    return { ...prev, gallery: newGallery };
                  });
                },
                (error) => reject(error),
                async () => {
                  const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
                  imageUrls.push(imageUrl);
                  resolve();
                }
              );
            });
          }
        }
      }

      // Prepare submission data - create clean copy without file objects
      const submissionData = {
        // Step 1: Business Model
        businessModelType: formData.businessModelType,
        businessModel: [formData.businessModelType], // Convert to array for compatibility
        franchiseModel: currentModelConfig?.label || formData.businessModelType,
        
        // Step 2: Basic Information
        brandName: formData.brandName,
        brandLogo: logoUrl, // Use uploaded URL
        brandBanner: bannerUrl, // Use uploaded URL
        brandVision: formData.brandVision,
        brandMission: formData.brandMission,
        industries: formData.industries,
        foundedYear: formData.foundedYear,
        brandStory: formData.brandStory,
        uniqueSellingProposition: formData.uniqueSellingProposition,
        targetMarket: formData.targetMarket,
        competitiveAdvantage: formData.competitiveAdvantage,
        
        // Contact Information
        contactInfo: formData.contactInfo,
        
        // Owner Information
        ownerInfo: formData.ownerInfo,
        
        // Franchise Images - Use uploaded URLs only
        franchiseImages: imageUrls,
        
        // Additional Information
        whyChooseUs: formData.whyChooseUs,
        successStories: formData.successStories,
        awards: formData.awards,
        mediaCoverage: formData.mediaCoverage,
        agreeToTerms: formData.agreeToTerms,
        franchiseLocations: formData.franchiseLocations,
        
        // Step 3: Investment & Financial Details
        initialFranchiseFee: formData.initialFranchiseFee,
        royaltyFee: formData.royaltyFee,
        marketingFee: formData.marketingFee,
        investmentRange: formData.investmentRange,
        workingCapital: formData.workingCapital,
        financingOptions: formData.financingOptions,
        equipmentCosts: formData.equipmentCosts,
        realEstateCosts: formData.realEstateCosts,
        areaRequired: formData.areaRequired,
        
        // Step 4: Operations & Support
        supportTypes: formData.supportTypes,
        trainingProgram: formData.trainingProgram,
        trainingDuration: formData.trainingDuration,
        trainingLocation: formData.trainingLocation,
        trainingCost: formData.trainingCost,
        trainingDetails: formData.trainingDetails,
        ongoingSupport: formData.ongoingSupport,
        
        // Step 5: Requirements & Terms
        minAge: formData.minAge,
        educationRequirement: formData.educationRequirement,
        experienceRequired: formData.experienceRequired,
        backgroundCheckRequired: formData.backgroundCheckRequired,
        contractDuration: formData.contractDuration,
        renewalTerms: formData.renewalTerms,
        exclusivityClause: formData.exclusivityClause,
        territorialRights: formData.territorialRights,
        
        // Additional fields that might exist
        paybackPeriod: formData.paybackPeriod || "",
        profitMargin: formData.profitMargin || "",
        franchiseTerm: formData.franchiseTerm || "",
        financingAvailable: formData.financingAvailable || false,
        
        // Metadata
        createdAt: serverTimestamp(),
        createdBy: user.uid,
        userId: user.uid,
        status: "pending"
      };

      // Remove undefined and null values to prevent Firestore errors
      Object.keys(submissionData).forEach(key => {
        if (submissionData[key] === undefined || submissionData[key] === null) {
          delete submissionData[key];
        }
        // Also remove empty nested objects
        if (typeof submissionData[key] === 'object' && submissionData[key] !== null && !Array.isArray(submissionData[key])) {
          Object.keys(submissionData[key]).forEach(nestedKey => {
            if (submissionData[key][nestedKey] === undefined || submissionData[key][nestedKey] === null) {
              delete submissionData[key][nestedKey];
            }
          });
        }
      });

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
          submittedBy: user.email,
          userId: user.uid,
          industries: formData.industries,
          investmentRange: formData.investmentRange,
        }
      );

      logger.log("Brand registration successful:", docRef.id);
      
      // Track successful submission
      const totalTimeSpent = (Date.now() - startTime) / 1000;
      analytics.trackFormSubmission(true, totalTimeSpent, formData.businessModelType);
      
      // Clear draft after successful submission
      clearDraft();
      
      // Navigate to success page or dashboard
      navigate("/dashboard?tab=brands&success=registration");
      
    } catch (error) {
      console.error("Submission error:", error);
      setError("Failed to submit registration. Please try again.");
      logger.error("Brand registration error:", error);
      
      // Track failed submission
      const totalTimeSpent = (Date.now() - startTime) / 1000;
      analytics.trackFormSubmission(false, totalTimeSpent, formData.businessModelType);
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
        {/* Basic Brand Information Card */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <BusinessIcon sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
                <Typography variant="h6" fontWeight={600}>
                  Basic Brand Information
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                {/* Brand Name */}
                <Grid item xs={12} md={6}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" component="label" sx={{ mb: 0.5 }}>
                        Brand Name *
                      </Typography>
                      <FieldHelp
                        title="Brand Name"
                        why="We need your official brand name to create your profile and verify your business identity."
                        example="Starbucks, McDonald's, Subway"
                        tip="Use your registered business name exactly as it appears on legal documents."
                      />
                    </Box>
                    <TextField
                      fullWidth
                      value={formData.brandName}
                      onChange={(e) => handleInputChange('brandName', e.target.value)}
                      error={!!errors.brandName || !!brandNameValidation.error}
                      helperText={errors.brandName || brandNameValidation.error}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BusinessIcon />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <ValidationIndicator
                              isValid={brandNameValidation.isValid}
                              isValidating={brandNameValidation.isValidating}
                              error={brandNameValidation.error}
                              showWhen="touched"
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Grid>

                {/* Founded Year */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Founded Year"
                    value={formData.foundedYear}
                    onChange={(e) => handleInputChange('foundedYear', parseInt(e.target.value))}
                    error={!!foundedYearValidation.error}
                    helperText={foundedYearValidation.error}
                    inputProps={{ min: 1900, max: new Date().getFullYear() }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <ValidationIndicator
                            isValid={foundedYearValidation.isValid}
                            isValidating={foundedYearValidation.isValidating}
                            error={foundedYearValidation.error}
                            showWhen="touched"
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Brand Logo Upload */}
                <Grid item xs={12}>
                  <DragDropUpload
                    label="Brand Logo"
                    helperText="Upload your official brand logo - crop to square after upload"
                    accept="image/png,image/jpeg,image/jpg"
                    maxSize={2 * 1024 * 1024} // 2MB
                    onFileSelect={(file) => handleFileUpload('brandLogo', file)}
                    onFileRemove={() => {
                      setFormData(prev => ({ ...prev, brandLogo: null }));
                      setUploadedFiles(prev => ({ ...prev, brandLogo: null }));
                    }}
                    currentFile={uploadedFiles.brandLogo || formData.brandLogo}
                    uploadProgress={uploadProgress.logo}
                    error={errors.brandLogo}
                    requirements={{
                      recommended: '512x512 pixels (square)',
                      minDimensions: '200x200 pixels',
                      maxSize: '2 MB',
                      formats: 'PNG, JPG, JPEG',
                      aspectRatio: '1:1 (Square preferred)'
                    }}
                    showPreview={true}
                    enableCrop={true}
                    cropAspectRatio={1}
                    enableCamera={true}
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
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Industry Categories Card */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
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
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Information Card */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PhoneIcon sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
                <Typography variant="h6" fontWeight={600}>
                  Contact Information
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={formData.contactInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value, 'contactInfo')}
                    error={!!errors.phone || !!phoneValidation.error}
                    helperText={errors.phone || phoneValidation.error || 'Format: +91-XXXXXXXXXX'}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <ValidationIndicator
                            isValid={phoneValidation.isValid}
                            isValidating={phoneValidation.isValidating}
                            error={phoneValidation.error}
                            showWhen="touched"
                          />
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
                    error={!!errors.email || !!emailValidation.error}
                    helperText={errors.email || emailValidation.error}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <ValidationIndicator
                            isValid={emailValidation.isValid}
                            isValidating={emailValidation.isValidating}
                            error={emailValidation.error}
                            showWhen="touched"
                          />
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
                    error={!!websiteValidation.error}
                    helperText={websiteValidation.error || 'Example: https://yourbrand.com'}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <WebsiteIcon />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <ValidationIndicator
                            isValid={websiteValidation.isValid}
                            isValidating={websiteValidation.isValidating}
                            error={websiteValidation.error}
                            showWhen="touched"
                          />
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
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Social Media Presence Card */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <InstagramIcon sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
                <Typography variant="h6" fontWeight={600}>
                  Social Media Presence
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
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
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Franchise Locations Card */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationIcon sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Existing Franchise Locations
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Add your current franchise locations to showcase your presence
                  </Typography>
                </Box>
              </Box>
              
              <Grid container spacing={3}>
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
                    fullWidth
                  >
                    Add Another Location
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
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
          {/* Financial Terms Card */}
          {(formData.businessModelType === 'franchise' || 
            formData.businessModelType === 'master_franchise' || 
            formData.businessModelType === 'area_franchise' ||
            formData.businessModelType === 'dealership' || 
            formData.businessModelType === 'authorized_dealer' ||
            formData.businessModelType === 'distributorship' ||
            formData.businessModelType === 'stockist') && (
            <Grid item xs={12}>
              <Card elevation={2}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <MoneyIcon sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
                    <Typography variant="h6" fontWeight={600}>
                      Financial Terms
                    </Typography>
                  </Box>
                  
                  <Grid container spacing={3}>
                    {/* Franchise Fee (for franchise models) */}
                    <ConditionalField 
                      show={isFieldVisible('initialFranchiseFee', formData.businessModelType)}
                      showBadge={true}
                      badgeText="Franchise Model Only"
                    >
                      <Grid item xs={12} md={6}>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" component="label" sx={{ mb: 0.5 }}>
                              Initial Franchise Fee *
                            </Typography>
                            <FieldHelp
                              title="Initial Franchise Fee"
                              why="This one-time fee helps us understand your business model's pricing structure and ensures partners know the upfront investment required."
                              example="₹5,00,000 - ₹50,00,000"
                              tip="Include only the franchise rights fee. Equipment and setup costs should be listed separately in the investment section."
                            />
                          </Box>
                          <TextField
                            fullWidth
                            value={formData.initialFranchiseFee}
                            onChange={(e) => handleInputChange('initialFranchiseFee', e.target.value)}
                            error={!!errors.initialFranchiseFee || !!franchiseFeeValidation.error}
                            helperText={errors.initialFranchiseFee || franchiseFeeValidation.error || "One-time fee for franchise rights"}
                            InputProps={{
                              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                              endAdornment: (
                                <InputAdornment position="end">
                                  <ValidationIndicator
                                    isValid={franchiseFeeValidation.isValid}
                                    isValidating={franchiseFeeValidation.isValidating}
                                    error={franchiseFeeValidation.error}
                                    showWhen="touched"
                                  />
                                </InputAdornment>
                              ),
                            }}
                            placeholder="e.g., 500000"
                          />
                        </Box>
                      </Grid>
                    </ConditionalField>

                    {/* Royalty Fee */}
                    <ConditionalField 
                      show={isFieldVisible('royaltyFee', formData.businessModelType)}
                      showBadge={true}
                      badgeText="Franchise Model Only"
                    >
                      <Grid item xs={12} md={6}>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" component="label" sx={{ mb: 0.5 }}>
                              Royalty Fee (%) *
                            </Typography>
                            <FieldHelp
                              title="Royalty Fee"
                              why="This ongoing percentage helps maintain brand standards, provide continuous support, and fund marketing efforts."
                              example="3% - 8% of monthly revenue"
                              tip="Most successful franchises charge between 4-6%. Consider what support and services you'll provide in return."
                            />
                          </Box>
                          <TextField
                            fullWidth
                            type="number"
                            value={formData.royaltyFee}
                            onChange={(e) => handleInputChange('royaltyFee', e.target.value)}
                            error={!!errors.royaltyFee || !!royaltyFeeValidation.error}
                            helperText={errors.royaltyFee || royaltyFeeValidation.error || "Ongoing royalty as % of revenue"}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  %
                                  <ValidationIndicator
                                    isValid={royaltyFeeValidation.isValid}
                                    isValidating={royaltyFeeValidation.isValidating}
                                    error={royaltyFeeValidation.error}
                                    showWhen="touched"
                                  />
                                </InputAdornment>
                              ),
                            }}
                            placeholder="e.g., 5"
                            inputProps={{ min: 0, max: 50, step: 0.5 }}
                          />
                        </Box>
                      </Grid>
                    </ConditionalField>

                    {/* Marketing Fee */}
                    <ConditionalField 
                      show={isFieldVisible('marketingFee', formData.businessModelType)}
                      showBadge={true}
                      badgeText="Franchise Model Only"
                    >
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
                    </ConditionalField>

                    {/* Dealer/Distributor Margin */}
                    <ConditionalField 
                      show={isFieldVisible('dealerMargin', formData.businessModelType)}
                      showBadge={true}
                      badgeText="Dealership/Distribution Model"
                    >
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
                    </ConditionalField>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Revenue Streams Card */}
          <Grid item xs={12}>
            <Card elevation={2}>
              <CardContent>
                <QuickValueSelector
                  title="Revenue Streams for Partners"
                  subtitle={`How will ${currentModelConfig?.label.toLowerCase() || 'partners'} generate income? (Select all that apply)`}
                  options={(() => {
                    // Get revenue streams based on the first selected industry
                    const primaryIndustry = formData.industries?.[0];
                    if (!primaryIndustry) {
                      return getFieldOptions('revenueModels'); // Fallback to generic if no industry selected
                    }
                    const streams = getFieldOptions('revenueStreams')?.[primaryIndustry];
                    return streams || getFieldOptions('revenueModels'); // Fallback if industry not found
                  })()}
                  value={formData.revenueStreams}
                  onChange={(value) => handleInputChange('revenueStreams', value)}
                  multiSelect={true}
                  columns={{ xs: 1, sm: 2, md: 3 }}
                  size="medium"
                />
                {!formData.industries?.length && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', ml: 2 }}>
                    💡 Please select an industry in Step 2 to see relevant revenue streams
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Payment Structure Card */}
          <Grid item xs={12}>
            <Card elevation={2}>
              <CardContent>
                <QuickValueSelector
                  title="Payment Structure"
                  subtitle="How will partners pay you for this opportunity?"
                  options={getFieldOptions('revenueModels')}
                  value={formData.revenueModel}
                  onChange={(value) => handleInputChange('revenueModel', value)}
                  columns={{ xs: 1, sm: 2, md: 3 }}
                  size="large"
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Territory & Terms Card */}
          <ConditionalField 
            show={isFieldVisible('territoryRights', formData.businessModelType) || 
                  isFieldVisible('franchiseTermLength', formData.businessModelType)}
            showBadge={false}
          >
            <Grid item xs={12}>
              <Card elevation={2}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <MapIcon sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
                    <Typography variant="h6" fontWeight={600}>
                      Territory & Terms
                    </Typography>
                  </Box>
                  
                  <Grid container spacing={3}>
                    {/* Territory Rights */}
                    <ConditionalField 
                      show={isFieldVisible('territoryRights', formData.businessModelType)}
                      showBadge={true}
                      badgeText="Requires Territory Protection"
                    >
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
                    </ConditionalField>

                    {/* Franchise Term Length */}
                    <ConditionalField 
                      show={isFieldVisible('franchiseTermLength', formData.businessModelType)}
                      showBadge={true}
                      badgeText="Partnership Duration"
                    >
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
                    </ConditionalField>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </ConditionalField>
        </Grid>
      </Box>
    );
  };

  // Render Step 4: Investment Requirements
  const renderInvestmentStep = () => (
    <Box>
      <Grid container spacing={3}>
        {/* Investment Range Card */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
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
            </CardContent>
          </Card>
        </Grid>

        {/* Investment Breakdown Card */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <MoneyIcon sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
                <Typography variant="h6" fontWeight={600}>
                  Investment Breakdown
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
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
                          error={!!areaMinValidation.error}
                          helperText={areaMinValidation.error}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <ValidationIndicator
                                  isValid={areaMinValidation.isValid}
                                  isValidating={areaMinValidation.isValidating}
                                  error={areaMinValidation.error}
                                  showWhen="touched"
                                />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          label="Max"
                          type="number"
                          value={formData.areaRequired.max}
                          onChange={(e) => handleInputChange('max', e.target.value, 'areaRequired')}
                          error={!!areaMaxValidation.error}
                          helperText={areaMaxValidation.error}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <ValidationIndicator
                                  isValid={areaMaxValidation.isValid}
                                  isValidating={areaMaxValidation.isValidating}
                                  error={areaMaxValidation.error}
                                  showWhen="touched"
                                />
                              </InputAdornment>
                            ),
                          }}
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
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Financing Options Card */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <HandshakeIcon sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
                <Typography variant="h6" fontWeight={600}>
                  Financing Assistance
                </Typography>
              </Box>
              
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
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  // Render Step 5: Training & Support
  const renderSupportStep = () => (
    <Box>
      <Grid container spacing={3}>
        {/* Partner Requirements Card */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PeopleIcon sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
                <Typography variant="h6" fontWeight={600}>
                  Partner Requirements
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                {/* Experience Required */}
                <Grid item xs={12}>
                  <QuickValueSelector
                    title="Experience Required"
                    subtitle="What type of experience should partners have?"
                    options={getFieldOptions('experienceRequired')}
                    value={formData.experienceRequired}
                    onChange={(values) => handleInputChange('experienceRequired', values)}
                    multiSelect={true}
                    columns={{ xs: 1, sm: 2, md: 3 }}
                    size="medium"
                  />
                  {errors.experienceRequired && (
                    <FormHelperText error>{errors.experienceRequired}</FormHelperText>
                  )}
                </Grid>

                {/* Qualification */}
                <Grid item xs={12}>
                  <QuickValueSelector
                    title="Educational Qualification"
                    subtitle="Minimum educational requirements"
                    options={getFieldOptions('qualification')}
                    value={formData.qualification}
                    onChange={(value) => handleInputChange('qualification', value)}
                    columns={{ xs: 1, sm: 2, md: 3 }}
                    size="medium"
                  />
                  {errors.qualification && (
                    <FormHelperText error>{errors.qualification}</FormHelperText>
                  )}
                </Grid>

                {/* Age Requirements Section */}
                <Grid item xs={12}>
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        Age Requirements
                      </Typography>
                      <FieldHelp
                        title="Age Requirements"
                        why="Age requirements help ensure partners have the maturity and experience needed to run your business successfully."
                        example="Minimum: 25-30 years, Maximum: 50-55 years"
                        tip="Setting reasonable age limits protects both you and your partners while ensuring they can commit long-term."
                      />
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Minimum Age"
                          type="number"
                          value={formData.minAge}
                          onChange={(e) => handleInputChange('minAge', e.target.value)}
                          error={!!minAgeValidation.error}
                          helperText={minAgeValidation.error || "Minimum age requirement"}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <ValidationIndicator
                                  isValid={minAgeValidation.isValid}
                                  isValidating={minAgeValidation.isValidating}
                                  error={minAgeValidation.error}
                                  showWhen="touched"
                                />
                              </InputAdornment>
                            ),
                          }}
                          placeholder="e.g., 25"
                          inputProps={{ min: 18, max: 65 }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Maximum Age"
                          type="number"
                          value={formData.maxAge}
                          onChange={(e) => handleInputChange('maxAge', e.target.value)}
                          placeholder="e.g., 55"
                          inputProps={{ min: 20, max: 70 }}
                          helperText="Maximum age limit"
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                {/* Additional Partner Criteria */}
                {/* Additional Partner Criteria */}
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
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Training Program Card */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <SchoolIcon sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
                <Typography variant="h6" fontWeight={600}>
                  Training Program
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
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
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
                      <Typography variant="body2" fontWeight={600} component="label">
                        Training Location *
                      </Typography>
                      <FieldHelp
                        title="Training Location"
                        why="Specifies where partners will receive their training, helping them plan travel and accommodation."
                        example="Hybrid (Online + Offline) training combines flexibility with hands-on experience"
                        tip="Hybrid training is most popular as it reduces travel costs while providing practical experience."
                      />
                    </Box>
                    <FormControl fullWidth variant="outlined">
                      <Select
                        value={formData.trainingLocation}
                        onChange={(e) => handleInputChange('trainingLocation', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            py: 1.75,
                            display: 'flex',
                            alignItems: 'center'
                          }
                        }}
                      >
                        <MenuItem value="Head Office">🏢 Head Office</MenuItem>
                        <MenuItem value="Regional Center">🌍 Regional Center</MenuItem>
                        <MenuItem value="Online">💻 Online</MenuItem>
                        <MenuItem value="Partner Location">📍 Partner Location</MenuItem>
                        <MenuItem value="Hybrid">🔄 Hybrid (Online + Offline)</MenuItem>
                      </Select>
                      <FormHelperText>Where will training be conducted?</FormHelperText>
                    </FormControl>
                  </Box>
                </Grid>

                {/* Training Cost */}
                <Grid item xs={12} md={6}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <MoneyIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
                      <Typography variant="body2" fontWeight={600} component="label">
                        Training Cost *
                      </Typography>
                      <FieldHelp
                        title="Training Cost"
                        why="Clarifies if partners need to budget separately for training or if it's included in the franchise fee."
                        example="Most franchises include training in the initial fee to simplify onboarding"
                        tip="Including training costs in the fee makes your offering more attractive and transparent."
                      />
                    </Box>
                    <FormControl fullWidth variant="outlined">
                      <Select
                        value={formData.trainingCost}
                        onChange={(e) => handleInputChange('trainingCost', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            py: 1.75,
                            display: 'flex',
                            alignItems: 'center'
                          }
                        }}
                      >
                        <MenuItem value="Free">🎁 Free</MenuItem>
                        <MenuItem value="Partially Paid">💰 Partially Paid</MenuItem>
                        <MenuItem value="Paid by Partner">💳 Paid by Partner</MenuItem>
                        <MenuItem value="Included in Fee">✅ Included in Fee</MenuItem>
                      </Select>
                      <FormHelperText>Who bears the training cost?</FormHelperText>
                    </FormControl>
                  </Box>
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
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Support Services Card */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <SupportIcon sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
                <Typography variant="h6" fontWeight={600}>
                  Support Services
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                {/* Ongoing Support Services */}
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
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Legal Framework Card */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <GavelIcon sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
                <Typography variant="h6" fontWeight={600}>
                  Legal Framework
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
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
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  // Render Step 5: Image Gallery & Additional Info
  const renderGalleryStep = () => (
    <Box>
      <Grid container spacing={3}>
        {/* Image Gallery Card */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PhotoCameraIcon sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
                <Typography variant="h6" fontWeight={600}>
                  Brand Image Gallery
                </Typography>
              </Box>

              {/* Image Upload with Drag & Drop */}
              <DragDropUpload
                label="Gallery Images"
                helperText="Upload 3-10 high-quality images showcasing your brand, outlets, products, or facilities"
                accept="image/png,image/jpeg,image/jpg"
                maxSize={5 * 1024 * 1024} // 5MB per image
                onFileSelect={(files) => {
                  // Handle both single file and array of files
                  const fileArray = Array.isArray(files) ? files : [files];
                  const currentImages = formData.franchiseImages || [];
                  setFormData(prev => ({
                    ...prev,
                    franchiseImages: [...currentImages, ...fileArray]
                  }));
                }}
                onFileRemove={() => {
                  // This will be handled by individual image removal in the gallery
                }}
                currentFile={null} // Don't show preview in upload area since we have gallery below
                error={errors.franchiseImages}
                requirements={{
                  recommended: '1920x1080 pixels (landscape)',
                  minDimensions: '800x600 pixels',
                  maxSize: '5 MB per image',
                  formats: 'PNG, JPG, JPEG',
                  aspectRatio: '16:9 preferred'
                }}
                multiple={true}
                showPreview={false} // We'll show preview in the gallery grid below
                enableCamera={true}
              />

              {/* Gallery Manager with Drag & Drop Reordering */}
              {formData.franchiseImages && formData.franchiseImages.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <GalleryManager
                    images={formData.franchiseImages}
                    primaryImageIndex={primaryImageIndex}
                    onReorder={(sourceIndex, destIndex) => {
                      const newImages = [...formData.franchiseImages];
                      const [removed] = newImages.splice(sourceIndex, 1);
                      newImages.splice(destIndex, 0, removed);
                      setFormData(prev => ({
                        ...prev,
                        franchiseImages: newImages
                      }));
                      // Adjust primary index if needed
                      if (sourceIndex === primaryImageIndex) {
                        setPrimaryImageIndex(destIndex);
                      } else if (sourceIndex < primaryImageIndex && destIndex >= primaryImageIndex) {
                        setPrimaryImageIndex(primaryImageIndex - 1);
                      } else if (sourceIndex > primaryImageIndex && destIndex <= primaryImageIndex) {
                        setPrimaryImageIndex(primaryImageIndex + 1);
                      }
                    }}
                    onDelete={(index) => {
                      const newImages = formData.franchiseImages.filter((_, i) => i !== index);
                      setFormData(prev => ({
                        ...prev,
                        franchiseImages: newImages
                      }));
                      // Adjust primary index if needed
                      if (index === primaryImageIndex) {
                        setPrimaryImageIndex(0);
                      } else if (index < primaryImageIndex) {
                        setPrimaryImageIndex(primaryImageIndex - 1);
                      }
                    }}
                    onSetPrimary={(index) => {
                      setPrimaryImageIndex(index);
                    }}
                    maxImages={10}
                    minImages={3}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Brand Story Card */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <BusinessIcon sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
                <Typography variant="h6" fontWeight={600}>
                  Brand Story & Value Proposition
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
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
                    error={!!errors.brandStory || !!brandStoryValidation.error}
                    helperText={
                      errors.brandStory || 
                      brandStoryValidation.error || 
                      `Share your brand's story to help potential partners understand your vision and values (minimum 50 characters). ${formData.brandStory?.length || 0}/500`
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                          <ValidationIndicator
                            isValid={brandStoryValidation.isValid}
                            isValidating={brandStoryValidation.isValidating}
                            error={brandStoryValidation.error}
                            showWhen="touched"
                          />
                        </InputAdornment>
                      ),
                    }}
                    required
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
                    helperText="Highlight unique selling points and competitive advantages"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Success & Recognition Card */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <VerifiedUserIcon sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
                <Typography variant="h6" fontWeight={600}>
                  Success Stories & Recognition
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
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
                    helperText="Showcase partner success to build credibility"
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
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Terms & Conditions Card */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <GavelIcon sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
                <Typography variant="h6" fontWeight={600}>
                  Agreement & Confirmation
                </Typography>
              </Box>
              
              <Box sx={{ p: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
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
                {errors.agreeToTerms && (
                  <FormHelperText error sx={{ ml: 4 }}>
                    {errors.agreeToTerms}
                  </FormHelperText>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  // Render Review Step
  const renderReviewStep = () => {
    const ReviewSection = ({ title, icon, onEdit, children }) => (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {icon}
              <Typography variant="h6" fontWeight={600}>{title}</Typography>
            </Box>
            <Button
              size="small"
              startIcon={<BusinessIcon fontSize="small" />}
              onClick={onEdit}
            >
              Edit
            </Button>
          </Box>
          {children}
        </CardContent>
      </Card>
    );

    const InfoRow = ({ label, value }) => value ? (
      <Box sx={{ display: 'flex', py: 0.5 }}>
        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 150 }}>
          {label}:
        </Typography>
        <Typography variant="body2" fontWeight={500}>
          {value}
        </Typography>
      </Box>
    ) : null;

    return (
      <Box>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Review Your Submission
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          Please review all information before submitting. You can edit any section by clicking the "Edit" button.
        </Alert>

        {/* Business Model */}
        <ReviewSection 
          title="Business Model" 
          icon={<BusinessIcon color="primary" />}
          onEdit={() => setActiveStep(0)}
        >
          <InfoRow label="Partnership Type" value={currentModelConfig?.label} />
          <InfoRow label="Description" value={currentModelConfig?.description} />
        </ReviewSection>

        {/* Basic Information */}
        <ReviewSection 
          title="Basic Information" 
          icon={<StoreIcon color="primary" />}
          onEdit={() => setActiveStep(1)}
        >
          <InfoRow label="Brand Name" value={formData.brandName} />
          <InfoRow label="Founded Year" value={formData.foundedYear} />
          <InfoRow label="Industries" value={formData.industries.join(', ')} />
          {uploadedFiles.brandLogo && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>Brand Logo:</Typography>
              <Avatar src={uploadedFiles.brandLogo} sx={{ width: 60, height: 60 }} />
            </Box>
          )}
          <InfoRow label="Phone" value={formData.contactInfo.phone} />
          <InfoRow label="Email" value={formData.contactInfo.email} />
          <InfoRow label="Website" value={formData.contactInfo.website} />
        </ReviewSection>

        {/* Partnership Details */}
        <ReviewSection 
          title="Partnership Details" 
          icon={<HandshakeIcon color="primary" />}
          onEdit={() => setActiveStep(2)}
        >
          <InfoRow label="Initial Fee" value={formData.initialFranchiseFee} />
          <InfoRow label="Royalty Fee" value={formData.royaltyFee} />
          <InfoRow label="Revenue Model" value={formData.revenueModel} />
          <InfoRow label="Territory Rights" value={formData.territoryRights} />
          <InfoRow label="Partnership Term" value={formData.franchiseTermLength} />
        </ReviewSection>

        {/* Investment */}
        <ReviewSection 
          title="Investment Requirements" 
          icon={<MoneyIcon color="primary" />}
          onEdit={() => setActiveStep(3)}
        >
          <InfoRow label="Investment Range" value={formData.investmentRange} />
          <InfoRow label="Working Capital" value={formData.workingCapital} />
          <InfoRow label="Equipment Costs" value={formData.equipmentCosts} />
          <InfoRow label="Area Required" value={
            formData.areaRequired.min && formData.areaRequired.max 
              ? `${formData.areaRequired.min} - ${formData.areaRequired.max} ${formData.areaRequired.unit}`
              : 'Not specified'
          } />
        </ReviewSection>

        {/* Training & Support */}
        <ReviewSection 
          title="Training & Support" 
          icon={<SchoolIcon color="primary" />}
          onEdit={() => setActiveStep(4)}
        >
          <InfoRow label="Support Types" value={formData.supportTypes.join(', ')} />
          <InfoRow label="Training Duration" value={formData.trainingDuration} />
          <InfoRow label="Training Location" value={formData.trainingLocation} />
          <InfoRow label="Experience Required" value={formData.experienceRequired.join(', ')} />
        </ReviewSection>

        {/* Gallery */}
        <ReviewSection 
          title="Gallery & Details" 
          icon={<PhotoCameraIcon color="primary" />}
          onEdit={() => setActiveStep(5)}
        >
          {formData.franchiseImages.length > 0 && (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Gallery Images ({formData.franchiseImages.length}):
              </Typography>
              <Grid container spacing={1} sx={{ mt: 1 }}>
                {formData.franchiseImages.slice(0, 4).map((img, index) => (
                  <Grid item xs={3} key={index}>
                    <Box
                      component="img"
                      src={img instanceof File ? URL.createObjectURL(img) : img}
                      sx={{
                        width: '100%',
                        height: 80,
                        objectFit: 'cover',
                        borderRadius: 1
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
              {formData.franchiseImages.length > 4 && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  +{formData.franchiseImages.length - 4} more images
                </Typography>
              )}
            </Box>
          )}
          <InfoRow label="Brand Story Length" value={`${formData.brandStory?.length || 0} characters`} />
        </ReviewSection>

        <Alert severity="warning" sx={{ mt: 3 }}>
          <strong>Important:</strong> Once submitted, your brand registration will be reviewed by our team. 
          You will receive an email notification within 24-48 hours regarding the status of your application.
        </Alert>
      </Box>
    );
  };

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
      case 6:
        return renderReviewStep();
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
    <Box sx={{ display: 'flex' }} role="main" aria-label="Brand registration form">
      {/* Main Content */}
      <Box sx={{ flex: 1, minWidth: 0 }} component="main">
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Header with Title and Accessibility Controls */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 3 
          }}>
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Brand Registration
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('subtitle')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Tooltip title="AI writing assistant">
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AutoFixHigh />}
                  onClick={() => setShowAIAssistant(true)}
                  sx={{ textTransform: 'none' }}
                  color="secondary"
                >
                  AI Assistant
                </Button>
              </Tooltip>
              <Tooltip title="Scan document to auto-fill form">
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<PhotoCameraIcon />}
                  onClick={() => setShowOCRDialog(true)}
                  sx={{ textTransform: 'none' }}
                >
                  Scan Document
                </Button>
              </Tooltip>
              <DataExport 
                formData={formData} 
                fileName="brand-registration"
                disabled={activeStep === 0 && !formData.brandName}
              />
              <HighContrastToggle />
            </Box>
          </Box>

          {/* Document Preparation Checklist */}
          <DocumentChecklist
            open={showDocumentChecklist}
            onClose={() => setShowDocumentChecklist(false)}
            onContinue={() => {
              setShowDocumentChecklist(false);
              localStorage.setItem('hasSeenDocumentChecklist', 'true');
            }}
          />

          {/* Validation Summary Modal */}
          <ValidationSummaryModal
            open={showValidationSummary}
            onClose={() => setShowValidationSummary(false)}
            errors={errors}
            steps={steps}
            currentStep={activeStep}
            onJumpToStep={(stepIndex) => {
              setActiveStep(stepIndex);
              setShowValidationSummary(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onFixErrors={() => {
              setShowValidationSummary(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />

      {/* Welcome Tour */}
      <WelcomeTour
        open={showWelcomeTour}
        onClose={() => {
          setShowWelcomeTour(false);
          localStorage.setItem('hasSeenBrandRegistrationTour', 'true');
        }}
        onStart={() => {
          localStorage.setItem('hasSeenBrandRegistrationTour', 'true');
        }}
      />

      {/* Draft Recovery Banner */}
      {showDraftRecovery && (
        <Alert 
          severity="info" 
          sx={{ mb: 3 }}
          action={
            <Box>
              <Button 
                color="inherit" 
                size="small"
                onClick={() => {
                  recoverDraft();
                }}
                sx={{ mr: 1 }}
              >
                Recover
              </Button>
              <Button 
                color="inherit" 
                size="small"
                onClick={() => {
                  clearDraft();
                  setShowDraftRecovery(false);
                }}
              >
                Dismiss
              </Button>
            </Box>
          }
        >
          <strong>Found a saved draft!</strong> Would you like to continue from where you left off?
        </Alert>
      )}

      {/* Auto-Save Indicator */}
      {lastSaved && (
        <Box sx={{ 
          position: 'fixed', 
          bottom: 20, 
          right: 20, 
          zIndex: 1000,
          bgcolor: alpha(theme.palette.success.main, 0.1),
          border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
          borderRadius: 2,
          px: 2,
          py: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <CheckIcon fontSize="small" color="success" />
          <Typography variant="caption" color="text.secondary">
            Draft saved {formatTimeSince(lastSaved)}
          </Typography>
          <IconButton size="small" onClick={saveDraft} title="Save now">
            <CloudUploadIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
          Brand Registration
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Join our network and grow your business
        </Typography>
        
        {/* Helpful Actions */}
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 3 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<CheckIcon />}
            onClick={() => setShowDocumentChecklist(true)}
          >
            Document Checklist
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<HelpOutlineIcon />}
            onClick={() => setShowWelcomeTour(true)}
          >
            Show Tour
          </Button>
        </Box>
        
        {/* Overall Progress Indicator */}
        <Box sx={{ maxWidth: 600, mx: 'auto', mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" fontWeight={600}>
              Overall Progress
            </Typography>
            <Typography variant="body2" color="primary.main" fontWeight={600}>
              {calculateOverallCompletion()}% Complete
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={calculateOverallCompletion()}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.success.main})`
              }
            }}
          />
          {calculateOverallCompletion() >= 25 && calculateOverallCompletion() < 50 && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              🌟 Great start! Keep going!
            </Typography>
          )}
          {calculateOverallCompletion() >= 50 && calculateOverallCompletion() < 75 && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              🚀 You're halfway there!
            </Typography>
          )}
          {calculateOverallCompletion() >= 75 && calculateOverallCompletion() < 100 && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              🎯 Almost done! Just a bit more!
            </Typography>
          )}
          {calculateOverallCompletion() === 100 && (
            <Typography variant="caption" color="success.main" sx={{ display: 'block', mt: 1, fontWeight: 600 }}>
              ✨ Excellent! Ready to submit!
            </Typography>
          )}
        </Box>
        
        <Button
          variant="outlined"
          size="small"
          onClick={() => setShowWelcomeTour(true)}
          startIcon={<HelpIcon />}
        >
          Show Guide
        </Button>
      </Box>

      {/* Stepper */}
      <Card sx={{ mb: 4 }} component="nav" aria-label="Registration progress">
        <CardContent>
          <Stepper activeStep={activeStep} alternativeLabel role="navigation" aria-label="Form steps">
            {steps.map((step, index) => {
              const completion = calculateStepCompletion(index);
              const isCompleted = index < activeStep;
              const isActive = index === activeStep;
              
              return (
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
                          color: 'white',
                          position: 'relative'
                        }}
                      >
                        {completed ? <CheckIcon /> : step.icon}
                        {/* Completion ring for active step */}
                        {isActive && !completed && completion > 0 && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: -4,
                              left: -4,
                              width: 48,
                              height: 48,
                              borderRadius: '50%',
                              border: '3px solid',
                              borderColor: theme.palette.primary.main,
                              borderTopColor: 'transparent',
                              transform: `rotate(${(completion / 100) * 360}deg)`,
                              transition: 'transform 0.3s ease'
                            }}
                          />
                        )}
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
                      {/* Show completion percentage */}
                      {isActive && !isCompleted && (
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            color: completion === 100 ? 'success.main' : 'primary.main',
                            fontWeight: 600,
                            mt: 0.5
                          }}
                        >
                          {completion}% complete
                        </Typography>
                      )}
                      {isCompleted && (
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            color: 'success.main',
                            fontWeight: 600,
                            mt: 0.5
                          }}
                        >
                          ✓ Completed
                        </Typography>
                      )}
                    </Box>
                  </StepLabel>
                </Step>
              );
            })}
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
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          role="alert"
          aria-live="assertive"
        >
          {error}
        </Alert>
      )}

      {/* Upload Progress Indicator */}
      {loading && (uploadProgress.logo > 0 || uploadProgress.banner > 0 || uploadProgress.gallery.length > 0) && (
        <Card 
          sx={{ mb: 3 }}
          role="status"
          aria-live="polite"
          aria-label="File upload progress"
        >
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} />
              Uploading Files...
            </Typography>
            
            {formData.brandLogo && (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">Brand Logo</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {Math.round(uploadProgress.logo)}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={uploadProgress.logo} 
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Box>
            )}
            
            {formData.brandBanner && (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">Brand Banner</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {Math.round(uploadProgress.banner)}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={uploadProgress.banner} 
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Box>
            )}
            
            {formData.franchiseImages.length > 0 && (
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Gallery Images ({uploadProgress.gallery.filter(p => p === 100).length}/{formData.franchiseImages.length})
                </Typography>
                {formData.franchiseImages.map((_, index) => (
                  <Box key={index} sx={{ mb: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption">Image {index + 1}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {Math.round(uploadProgress.gallery[index] || 0)}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={uploadProgress.gallery[index] || 0} 
                      sx={{ height: 4, borderRadius: 2 }}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Form Content */}
      <Card component="section" aria-labelledby="current-step-heading">
        <CardContent sx={{ p: 4 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              role="region"
              aria-live="polite"
              aria-atomic="true"
              aria-label={`Step ${activeStep + 1}: ${steps[activeStep].label}`}
            >
              {renderCurrentStep()}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <Box 
        sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }} 
        role="navigation" 
        aria-label="Form navigation buttons"
      >
        <Button
          onClick={handleBack}
          disabled={activeStep === 0}
          startIcon={<ArrowBackIcon />}
          size="large"
          aria-label={`Go back to ${activeStep > 0 ? steps[activeStep - 1].label : 'previous step'}`}
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
              aria-label={`Continue to ${steps[activeStep + 1].label}`}
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
              aria-label="Submit brand registration form"
              aria-busy={loading}
            >
              {loading ? 'Submitting...' : 'Submit Registration'}
            </Button>
          )}
        </Box>
      </Box>
        </Container>
      </Box>

      {/* Step Preview Sidebar */}
      <StepPreviewSidebar
        steps={steps}
        currentStep={activeStep}
        formData={formData}
        onStepClick={(stepIndex) => {
          setActiveStep(stepIndex);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* OCR Dialog */}
      <DocumentOCRDialog
        open={showOCRDialog}
        onClose={() => setShowOCRDialog(false)}
        onDataExtracted={handleOCRDataExtracted}
      />

      {/* AI Content Assistant */}
      <AIContentAssistant
        open={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        brandInfo={{
          brandName: formData.brandName,
          industry: formData.industry,
          businessModel: formData.businessModelType,
          targetAudience: formData.targetMarket,
          uniqueFeatures: formData.uniqueSellingPoints,
          targetMarket: formData.targetMarket,
          competitiveAdvantage: formData.competitiveAdvantage,
          brandPersonality: formData.brandPersonality,
          investmentRange: `${formData.initialInvestment} - ${formData.totalInvestment}`,
        }}
        onContentSelect={handleAIContentSelect}
      />
    </Box>
  );
};

export default BrandRegistrationNew;