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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
  Checkbox,
  Stack,
  FormHelperText,
  FormGroup,
  FormLabel,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon,
  Check as CheckIcon,
  Help as HelpIcon,
  Business as BusinessIcon,
  AttachMoney as MoneyIcon,
  School as SchoolIcon,
  Gavel as GavelIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { db, storage } from "../../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const steps = [
  {
    label: "Basic Information",
    icon: <BusinessIcon />,
    description: "Brand story and company details",
  },
  {
    label: "Business Details",
    icon: <BusinessIcon />,
    description: "Products, services, and market position",
  },
  {
    label: "Investment & Fees",
    icon: <MoneyIcon />,
    description: "Financial requirements and fee structure",
  },
  {
    label: "Operations & Support",
    icon: <SchoolIcon />,
    description: "Training, support, and operations",
  },
  {
    label: "Legal Framework",
    icon: <GavelIcon />,
    description: "Terms, conditions, and legal documents",
  },
];

const businessModal = [
  "Company Owned - Company Operated",
  "Company Owned - Franchise Operated",
];

const industries = [
  "Food & Beverage",
  "Hospitality",
  "Retail",
  "Healthcare",
  "Education",
  "Fitness",
  "Beauty & Wellness",
  "Technology",
  "Automotive",
  "Real Estate",
  "Home Services",
  "Entertainment",
  "Travel & Hospitality",
  "Other",
];

const investmentRanges = [
  "Under ₹50K",
  "₹50K - ₹100K",
  "₹100K - ₹250K",
  "₹250K - ₹500K",
  "₹500K - ₹1M",
  "Over ₹1M",
];

const franchiseModelOptions = [
  "Unit",
  "Multicity",
  "Dealer/Distributor",
  "Master Franchise",
];

const areaUnit = ["Sq.ft", "Sq.mt", "Sq.yrd", "Acre"];

const BrandRegistration = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRefs = useRef({});
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});

  const [formData, setFormData] = useState({
    //Basic Information
    brandName: "",
    brandImage: null,
    brandVission: "",
    brandMission: "",
    brandfoundedYear: "",
    brandOwnerInformation: {
      name: "",
      email: "",
      bio: "",
      phone: "",
      linkedinURl: "",
    },
    brandContactInformation: {
      address: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
      phone: "",
      email: "",
      website: "",
      linkedinURl: "",
      instagramURl: "",
      facebookURl: "",
      twitterURl: "",
    },
    brandFranchiseImages: [],
    brandFranchiseLocations: [
      {
        address: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
        phone: "",
        googleMapsURl: "",
      },
    ],

    // Business Details
    businessModel: "",
    uniqueSellingProposition: false,
    targetMarket: false,
    competitiveAdvantage: false,

    // Investment & Fees
    initialFranchiseFee: "",
    royaltyFee: "",
    marketingFee: "",
    workingCapital: "",
    financingOptions: "",
    equipmentCosts: "",
    realEstateCosts: "",
    areaRequired: {
      min: "",
      max: "",
      unit: "",
    },

    // Operations & Support
    franchiseeObligations: false,
    franchisorSupport: false,
    territoryRights: false,
    trainingProgram: false,
    ongoingSupport: false,
    marketingSupport: false,
    operationalStandards: false,
    qualityControl: false,

    // Legal Framework
    franchiseTermLength: "",
    terminationConditions: false,
    transferConditions: false,
    disputeResolution: false,
    nonCompeteRestrictions: false,

    // Additional
    industries: [],
    investmentRange: "",
    franchiseModels: [],
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleNestedInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
    // Clear the specific nested error
    const errorKey = `${section}.${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: undefined }));
    }
  };

  const handleFranchiseModelChange = (event) => {
    const { value, checked } = event.target;
    const currentModels = formData.franchiseModels;

    let newModels;
    if (checked) {
      newModels = [...currentModels, value];
    } else {
      newModels = currentModels.filter((model) => model !== value);
    }
    handleInputChange("franchiseModels", newModels);
  };

  const validateStep = (step) => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    switch (step) {
      case 0:
        if (!formData.brandName.trim())
          newErrors.brandName = "Brand name is required.";
        if (!formData.brandfoundedYear)
          newErrors.brandfoundedYear = "Founded year is required.";
        else if (
          String(formData.brandfoundedYear).length !== 4 ||
          isNaN(formData.brandfoundedYear)
        )
          newErrors.brandfoundedYear = "Enter a valid 4-digit year.";
        if (!formData.brandImage)
          newErrors.brandImage = "Brand logo is required.";
        if (!formData.brandOwnerInformation.name.trim())
          newErrors["brandOwnerInformation.name"] = "Owner name is required.";
        if (!formData.brandOwnerInformation.email.trim())
          newErrors["brandOwnerInformation.email"] = "Owner email is required.";
        else if (!emailRegex.test(formData.brandOwnerInformation.email))
          newErrors["brandOwnerInformation.email"] = "Invalid email format.";
        if (!formData.brandContactInformation.email.trim())
          newErrors["brandContactInformation.email"] =
            "Contact email is required.";
        else if (!emailRegex.test(formData.brandContactInformation.email))
          newErrors["brandContactInformation.email"] = "Invalid email format.";
        if (!formData.brandContactInformation.phone.trim())
          newErrors["brandContactInformation.phone"] =
            "Contact phone is required.";
        break;
      case 1:
        if (formData.industries.length === 0)
          newErrors.industries = "Please select at least one industry.";
        if (formData.franchiseModels.length === 0)
          newErrors.franchiseModels =
            "Please select at least one franchise type.";
        if (!formData.businessModel)
          newErrors.businessModel = "Please select a business model.";
        break;
      case 2:
        if (!formData.initialFranchiseFee)
          newErrors.initialFranchiseFee = "Initial franchise fee is required.";
        else if (
          isNaN(formData.initialFranchiseFee) ||
          +formData.initialFranchiseFee <= 0
        )
          newErrors.initialFranchiseFee =
            "Please enter a valid positive number.";
        if (!formData.royaltyFee)
          newErrors.royaltyFee = "Royalty fee is required.";
        else if (isNaN(formData.royaltyFee) || +formData.royaltyFee < 0)
          newErrors.royaltyFee = "Please enter a valid fee percentage.";
        if (!formData.investmentRange)
          newErrors.investmentRange = "Total investment range is required.";
        if (!formData.areaRequired.min)
          newErrors["areaRequired.min"] = "Min area is required.";
        if (!formData.areaRequired.max)
          newErrors["areaRequired.max"] = "Max area is required.";
        if (+formData.areaRequired.max < +formData.areaRequired.min)
          newErrors["areaRequired.max"] =
            "Max area must be greater than or equal to min area.";
        if (!formData.areaRequired.unit)
          newErrors["areaRequired.unit"] = "Please select an area unit.";
        break;
      case 4:
        if (!formData.franchiseTermLength.trim())
          newErrors.franchiseTermLength = "Franchise term length is required.";
        break;
      default:
        break;
    }
    return newErrors;
  };

  const handleFileUpload = (field, event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (field === "brandImage") {
      handleInputChange("brandImage", files[0]);
      if (errors.brandImage) {
        setErrors((prev) => ({ ...prev, brandImage: undefined }));
      }
    } else if (field === "brandFranchiseImages") {
      // Convert FileList to array and combine with existing images
      const newFiles = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        brandFranchiseImages: [...prev.brandFranchiseImages, ...newFiles],
      }));
    } else {
      setUploadedFiles((prev) => ({
        ...prev,
        [field]: {
          name: files[0].name,
          size: files[0].size,
          type: files[0].type,
          file: files[0],
        },
      }));
    }
  };

  const removeFile = (field) => {
    if (field === "brandImage") {
      handleInputChange("brandImage", null);
    } else if (field === "brandFranchiseImages") {
      setFormData((prev) => ({
        ...prev,
        brandFranchiseImages: [],
      }));
    } else {
      setUploadedFiles((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const FileUploadSection = ({
    field,
    label,
    acceptedTypes = "image/*",
    helpText,
  }) => {
    // Determine if this is a single file upload (like brandImage) or multiple (like brandFranchiseImages)
    const isMultiple = field === "brandFranchiseImages";
    const fieldError = errors[field];

    return (
      <Card
        elevation={1}
        sx={{
          mb: 2,
          border: fieldError ? "1px solid" : "none",
          borderColor: "error.main",
        }}
      >
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
              {label}
            </Typography>
            {helpText && (
              <Tooltip title={helpText}>
                <IconButton size="small">
                  <HelpIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          {/* Single file upload preview (for brandImage) */}
          {!isMultiple && (formData[field] || uploadedFiles[field]) && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                backgroundColor: "success.light",
                borderRadius: 1,
                mb: 2,
              }}
            >
              <DescriptionIcon sx={{ mr: 2, color: "success.dark" }} />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" fontWeight="medium">
                  {field === "brandImage"
                    ? formData.brandImage?.name
                    : uploadedFiles[field]?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {field === "brandImage"
                    ? `${(formData.brandImage?.size / 1024).toFixed(1)} KB`
                    : `${(uploadedFiles[field]?.size / 1024).toFixed(1)} KB`}
                </Typography>
              </Box>
              <IconButton onClick={() => removeFile(field)} color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          )}

          {/* Multiple file upload preview (for brandFranchiseImages) */}
          {isMultiple && formData.brandFranchiseImages?.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {formData.brandFranchiseImages.length} images uploaded
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {formData.brandFranchiseImages.map((file, index) => (
                  <Box key={index} sx={{ position: "relative" }}>
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Franchise ${index + 1}`}
                      style={{
                        width: 100,
                        height: 100,
                        objectFit: "cover",
                        borderRadius: 4,
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => {
                        const updatedImages =
                          formData.brandFranchiseImages.filter(
                            (_, i) => i !== index
                          );
                        handleInputChange(
                          "brandFranchiseImages",
                          updatedImages
                        );
                      }}
                      sx={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        backgroundColor: "error.main",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "error.dark",
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {/* Upload area */}
          <Box
            sx={{
              border: "2px dashed",
              borderColor: fieldError ? "error.light" : "grey.300",
              borderRadius: 2,
              p: 3,
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": {
                borderColor: "primary.main",
                backgroundColor: "action.hover",
              },
            }}
            onClick={() => fileInputRefs.current[field]?.click()}
          >
            <CloudUploadIcon sx={{ fontSize: 48, color: "grey.400", mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Click to upload or drag and drop
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Supported formats: {acceptedTypes}
              {isMultiple && " (Multiple files allowed)"}
            </Typography>
            <input
              ref={(el) => (fileInputRefs.current[field] = el)}
              type="file"
              hidden
              accept={acceptedTypes}
              onChange={(e) => handleFileUpload(field, e)}
              multiple={isMultiple}
            />
          </Box>
          {fieldError && (
            <FormHelperText error sx={{ mt: 1, ml: 2 }}>
              {fieldError}
            </FormHelperText>
          )}

          {/* Add more button for multiple uploads */}
          {isMultiple && formData.brandFranchiseImages?.length > 0 && (
            <Button
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              onClick={() => fileInputRefs.current[field]?.click()}
              sx={{ mt: 2 }}
            >
              Add More Images
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  const handleNext = () => {
    const newErrors = validateStep(activeStep);
    if (Object.keys(newErrors).length === 0) {
      setErrors({}); // Clear errors before moving to the next step
      setActiveStep((prev) => prev + 1);
    } else {
      setErrors(newErrors);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    // Validate the final step before submission
    const newErrors = validateStep(activeStep);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setError("Please correct the errors before submitting.");
      return;
    }

    setErrors({});
    setLoading(true);
    setError("");

    try {
      const uploadFile = async (file, path) => {
        if (!file) return null;
        const storageRef = ref(storage, path);
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Upload is " + progress + "% done");
            },
            (error) => {
              console.error("Upload failed:", error);
              reject(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                resolve(downloadURL);
              });
            }
          );
        });
      };

      let brandImageUrl = null;
      if (formData.brandImage) {
        const imagePath = `brands/${user.uid}/${
          formData.brandName
        }/logo_${Date.now()}_${formData.brandImage.name}`;
        brandImageUrl = await uploadFile(formData.brandImage, imagePath);
      }

      const franchiseImageUrls = await Promise.all(
        formData.brandFranchiseImages.map((file, index) => {
          const imagePath = `brands/${user.uid}/${
            formData.brandName
          }/gallery_${Date.now()}_${index}_${file.name}`;
          return uploadFile(file, imagePath);
        })
      );

      const submissionData = {
        ...formData,
        brandImage: brandImageUrl,
        brandFranchiseImages: franchiseImageUrls.filter((url) => url),
        createdAt: serverTimestamp(),
        createdBy: user.uid,
        userId: user.uid,
        status: "pending",
      };

      // Add brand data to Firestore
      await addDoc(collection(db, "brands"), submissionData);

      setLoading(false);
      navigate("/brands");
    } catch (error) {
      console.log("error", error);
      setError(
        "Failed to submit application. Please check the console for details and try again."
      );
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            {/* Brand Information */}
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                boxShadow: 3,
                bgcolor: "#fff",
                mb: 4,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Brand Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Brand Name"
                    fullWidth
                    required
                    value={formData.brandName}
                    onChange={(e) =>
                      handleInputChange("brandName", e.target.value)
                    }
                    error={!!errors.brandName}
                    helperText={errors.brandName}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Founded Year"
                    type="number"
                    required
                    value={formData.brandfoundedYear}
                    onChange={(e) =>
                      handleInputChange("brandfoundedYear", e.target.value)
                    }
                    error={!!errors.brandfoundedYear}
                    helperText={errors.brandfoundedYear}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Vision"
                    fullWidth
                    multiline
                    rows={4}
                    value={formData.brandVission}
                    onChange={(e) =>
                      handleInputChange("brandVission", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Mission"
                    fullWidth
                    multiline
                    rows={4}
                    value={formData.brandMission}
                    onChange={(e) =>
                      handleInputChange("brandMission", e.target.value)
                    }
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 4 }}>
                <FileUploadSection
                  field="brandImage"
                  label="Brand Logo/Image (Required)"
                  acceptedTypes="image/*"
                />
              </Box>
            </Box>

            {/* Owner Information */}
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                boxShadow: 3,
                bgcolor: "#fff",
                mb: 4,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Brand Owner Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Owner Name"
                    fullWidth
                    required
                    value={formData.brandOwnerInformation.name}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "brandOwnerInformation",
                        "name",
                        e.target.value
                      )
                    }
                    error={!!errors["brandOwnerInformation.name"]}
                    helperText={errors["brandOwnerInformation.name"]}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Owner Email"
                    fullWidth
                    required
                    value={formData.brandOwnerInformation.email}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "brandOwnerInformation",
                        "email",
                        e.target.value
                      )
                    }
                    error={!!errors["brandOwnerInformation.email"]}
                    helperText={errors["brandOwnerInformation.email"]}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Owner Phone"
                    fullWidth
                    value={formData.brandOwnerInformation.phone}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "brandOwnerInformation",
                        "phone",
                        e.target.value
                      )
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="LinkedIn URL"
                    fullWidth
                    value={formData.brandOwnerInformation.linkedinURl}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "brandOwnerInformation",
                        "linkedinURl",
                        e.target.value
                      )
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Short Bio"
                    fullWidth
                    multiline
                    rows={3}
                    value={formData.brandOwnerInformation.bio}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "brandOwnerInformation",
                        "bio",
                        e.target.value
                      )
                    }
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Contact Information */}
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                boxShadow: 3,
                bgcolor: "#fff",
                mb: 4,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Contact Information
              </Typography>
              <Grid container spacing={3}>
                {Object.entries(formData.brandContactInformation).map(
                  ([field, value]) => {
                    const isRequired = field === "email" || field === "phone";
                    const errorKey = `brandContactInformation.${field}`;
                    return (
                      <Grid item xs={12} sm={6} md={4} key={field}>
                        <TextField
                          label={field
                            .replace(/URl/, " URL")
                            .replace(/([A-Z])/g, " $1")}
                          fullWidth
                          required={isRequired}
                          value={value}
                          onChange={(e) =>
                            handleNestedInputChange(
                              "brandContactInformation",
                              field,
                              e.target.value
                            )
                          }
                          error={!!errors[errorKey]}
                          helperText={errors[errorKey]}
                        />
                      </Grid>
                    );
                  }
                )}
              </Grid>
            </Box>

            {/* Franchise Locations */}
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                boxShadow: 3,
                bgcolor: "#fff",
                mb: 4,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Franchise Locations
              </Typography>

              {formData.brandFranchiseLocations.map((location, index) => (
                <Box
                  key={index}
                  sx={{
                    mb: 3,
                    p: 2,
                    border: "1px solid #ddd",
                    borderRadius: 2,
                  }}
                >
                  <Grid container spacing={3}>
                    {Object.entries(location).map(([field, value]) => (
                      <Grid item xs={12} sm={6} md={4} key={field}>
                        <TextField
                          label={field
                            .replace(/URl/, " URL")
                            .replace(/([A-Z])/g, " $1")}
                          fullWidth
                          value={value}
                          onChange={(e) => {
                            const updatedLocations = [
                              ...formData.brandFranchiseLocations,
                            ];
                            updatedLocations[index][field] = e.target.value;
                            handleInputChange(
                              "brandFranchiseLocations",
                              updatedLocations
                            );
                          }}
                        />
                      </Grid>
                    ))}
                    <Grid item xs={12}>
                      <Button
                        color="error"
                        variant="outlined"
                        onClick={() => {
                          const updatedLocations =
                            formData.brandFranchiseLocations.filter(
                              (_, i) => i !== index
                            );
                          handleInputChange(
                            "brandFranchiseLocations",
                            updatedLocations
                          );
                        }}
                      >
                        Remove This Location
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              ))}

              <Button
                variant="outlined"
                onClick={() =>
                  handleInputChange("brandFranchiseLocations", [
                    ...formData.brandFranchiseLocations,
                    {
                      address: "",
                      city: "",
                      state: "",
                      country: "",
                      zipCode: "",
                      phone: "",
                      googleMapsURl: "",
                    },
                  ])
                }
              >
                + Add Another Location
              </Button>
            </Box>

            {/* Franchise Gallery */}
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                boxShadow: 3,
                bgcolor: "#fff",
                mb: 4,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Franchise Gallery
              </Typography>
              <FileUploadSection
                field="brandFranchiseImages"
                label="Upload Franchise Images"
                acceptedTypes="image/*"
              />
            </Box>
          </>
        );

      case 1:
        return (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required error={!!errors.industries}>
                  <InputLabel>Select Industries</InputLabel>
                  <Select
                    multiple
                    value={formData.industries}
                    onChange={(e) =>
                      handleInputChange("industries", e.target.value)
                    }
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {industries.map((industry) => (
                      <MenuItem key={industry} value={industry}>
                        {industry}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.industries && (
                    <FormHelperText>{errors.industries}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required error={!!errors.businessModel}>
                  <InputLabel>Business Model</InputLabel>
                  <Select
                    value={formData.businessModel}
                    onChange={(e) =>
                      handleInputChange("businessModel", e.target.value)
                    }
                  >
                    {businessModal.map((model) => (
                      <MenuItem key={model} value={model}>
                        {model}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.businessModel && (
                    <FormHelperText>{errors.businessModel}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>

            <Grid item xs={12} md={6} mt={2}>
                <FormControl
                  component="fieldset"
                  fullWidth
                  required
                  error={!!errors.franchiseModels}
                >
                  <FormLabel component="legend">Franchise Type</FormLabel>
                  <FormGroup row>
                    {franchiseModelOptions.map((model) => (
                      <FormControlLabel
                        key={model}
                        control={
                          <Checkbox
                            checked={formData.franchiseModels.includes(model)}
                            onChange={handleFranchiseModelChange}
                            value={model}
                          />
                        }
                        label={model}
                      />
                    ))}
                  </FormGroup>
                  {errors.franchiseModels && (
                    <FormHelperText>{errors.franchiseModels}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.uniqueSellingProposition}
                      onChange={(e) =>
                        handleInputChange(
                          "uniqueSellingProposition",
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Unique Selling Proposition"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.targetMarket}
                      onChange={(e) =>
                        handleInputChange("targetMarket", e.target.checked)
                      }
                    />
                  }
                  label="Target Market"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.competitiveAdvantage}
                      onChange={(e) =>
                        handleInputChange(
                          "competitiveAdvantage",
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Competitive Advantage"
                />
              </Grid>
            </Grid>
          </>
        );

      case 2:
        return (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card elevation={1}>
                  <CardHeader
                    title="Initial Investment"
                    titleTypographyProps={{ variant: "subtitle1" }}
                  />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          required
                          label="Initial Franchise Fee (₹)"
                          type="number"
                          value={formData.initialFranchiseFee}
                          onChange={(e) =>
                            handleInputChange(
                              "initialFranchiseFee",
                              e.target.value
                            )
                          }
                          error={!!errors.initialFranchiseFee}
                          helperText={errors.initialFranchiseFee}
                          InputProps={{ startAdornment: "₹" }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl
                          fullWidth
                          required
                          error={!!errors.investmentRange}
                        >
                          <InputLabel>Total Investment Range</InputLabel>
                          <Select
                            value={formData.investmentRange}
                            onChange={(e) =>
                              handleInputChange(
                                "investmentRange",
                                e.target.value
                              )
                            }
                          >
                            {investmentRanges.map((range) => (
                              <MenuItem key={range} value={range}>
                                {range}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.investmentRange && (
                            <FormHelperText>
                              {errors.investmentRange}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card elevation={1}>
                  <CardHeader
                    title="Ongoing Fees"
                    titleTypographyProps={{ variant: "subtitle1" }}
                  />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          required
                          label="Royalty Fee (%)"
                          type="number"
                          value={formData.royaltyFee}
                          onChange={(e) =>
                            handleInputChange("royaltyFee", e.target.value)
                          }
                          error={!!errors.royaltyFee}
                          helperText={errors.royaltyFee}
                          inputProps={{ min: 0, max: 100, step: 0.5 }}
                          InputProps={{ endAdornment: "%" }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Marketing Fee (%)"
                          type="number"
                          value={formData.marketingFee}
                          onChange={(e) =>
                            handleInputChange("marketingFee", e.target.value)
                          }
                          inputProps={{ min: 0, max: 100, step: 0.5 }}
                          InputProps={{ endAdornment: "%" }}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card elevation={1}>
                  <CardHeader
                    title="Space Requirements"
                    titleTypographyProps={{ variant: "subtitle1" }}
                  />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          required
                          label="Min Area"
                          type="number"
                          value={formData.areaRequired.min}
                          onChange={(e) =>
                            handleNestedInputChange(
                              "areaRequired",
                              "min",
                              e.target.value
                            )
                          }
                          error={!!errors["areaRequired.min"]}
                          helperText={errors["areaRequired.min"]}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          required
                          label="Max Area"
                          type="number"
                          value={formData.areaRequired.max}
                          onChange={(e) =>
                            handleNestedInputChange(
                              "areaRequired",
                              "max",
                              e.target.value
                            )
                          }
                          error={!!errors["areaRequired.max"]}
                          helperText={errors["areaRequired.max"]}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FormControl
                          fullWidth
                          required
                          error={!!errors["areaRequired.unit"]}
                        >
                          <InputLabel>Unit</InputLabel>
                          <Select
                            value={formData.areaRequired.unit}
                            label="Unit"
                            onChange={(e) =>
                              handleNestedInputChange(
                                "areaRequired",
                                "unit",
                                e.target.value
                              )
                            }
                          >
                            {areaUnit.map((unit) => (
                              <MenuItem key={unit} value={unit}>
                                {unit}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors["areaRequired.unit"] && (
                            <FormHelperText>
                              {errors["areaRequired.unit"]}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mt: 4 }}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Equipment Costs (₹)"
                  type="number"
                  value={formData.equipmentCosts}
                  onChange={(e) =>
                    handleInputChange("equipmentCosts", e.target.value)
                  }
                  InputProps={{ startAdornment: "₹" }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Real Estate Costs (₹)"
                  type="number"
                  value={formData.realEstateCosts}
                  onChange={(e) =>
                    handleInputChange("realEstateCosts", e.target.value)
                  }
                  InputProps={{ startAdornment: "₹" }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Working Capital (₹)"
                  type="number"
                  value={formData.workingCapital}
                  onChange={(e) =>
                    handleInputChange("workingCapital", e.target.value)
                  }
                  InputProps={{ startAdornment: "₹" }}
                />
              </Grid>
            </Grid>

            <Grid item xs={12} sx={{ mt: 4 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Financing Options"
                value={formData.financingOptions}
                onChange={(e) =>
                  handleInputChange("financingOptions", e.target.value)
                }
                placeholder="Describe available financing options, partnerships with lenders, or any assistance you provide to help franchisees secure funding."
              />
            </Grid>
          </>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.trainingProgram}
                    onChange={(e) =>
                      handleInputChange("trainingProgram", e.target.checked)
                    }
                  />
                }
                label="Training Program"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.franchisorSupport}
                    onChange={(e) =>
                      handleInputChange("franchisorSupport", e.target.checked)
                    }
                  />
                }
                label="Franchisor Support Services"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.marketingSupport}
                    onChange={(e) =>
                      handleInputChange("marketingSupport", e.target.checked)
                    }
                  />
                }
                label="Marketing Support"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.territoryRights}
                    onChange={(e) =>
                      handleInputChange("territoryRights", e.target.checked)
                    }
                  />
                }
                label="Territory Rights & Exclusivity"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.operationalStandards}
                    onChange={(e) =>
                      handleInputChange(
                        "operationalStandards",
                        e.target.checked
                      )
                    }
                  />
                }
                label="Operational Standards"
              />
            </Grid>
          </Grid>
        );

      case 4:
        return (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card elevation={1}>
                  <CardHeader
                    title="Franchise Agreement Terms"
                    titleTypographyProps={{ variant: "subtitle1" }}
                  />
                  <CardContent>
                    <TextField
                      fullWidth
                      required
                      label="Franchise Term Length"
                      value={formData.franchiseTermLength}
                      onChange={(e) =>
                        handleInputChange("franchiseTermLength", e.target.value)
                      }
                      error={!!errors.franchiseTermLength}
                      helperText={
                        errors.franchiseTermLength ||
                        "e.g., 10 years with 5-year renewal options"
                      }
                      sx={{ mb: 2 }}
                    />
                    <FormControlLabel
                      control={<Switch />}
                      label="Renewal options available"
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!formData.nonCompeteRestrictions}
                      onChange={(e) =>
                        handleInputChange(
                          "nonCompeteRestrictions",
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Territory & Competition"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!formData.terminationConditions}
                      onChange={(e) =>
                        handleInputChange(
                          "terminationConditions",
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Termination Conditions & Procedures"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!formData.transferConditions}
                      onChange={(e) =>
                        handleInputChange(
                          "transferConditions",
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Transfer & Sale Conditions"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!formData.disputeResolution}
                      onChange={(e) =>
                        handleInputChange("disputeResolution", e.target.checked)
                      }
                    />
                  }
                  label="Dispute Resolution Process"
                />
              </Grid>
            </Grid>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          p: { xs: 2, sm: 3, md: 4 },
          textAlign: "center",
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          fontWeight="bold"
          sx={{
            fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3rem" },
            mb: { xs: 1, md: 2 },
          }}
        >
          Brand Registration
        </Typography>
        <Typography
          variant="h6"
          sx={{
            opacity: 0.9,
            fontSize: { xs: "1rem", sm: "1.2rem", md: "1.25rem" },
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          Share your franchise opportunity with serious investors
        </Typography>
      </Box>

      <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, pb: { xs: 1, sm: 2 } }}>
        <Stepper
          activeStep={activeStep}
          alternativeLabel={false}
          orientation={window.innerWidth < 600 ? "vertical" : "horizontal"}
          sx={{
            "& .MuiStepper-root": {
              flexDirection: { xs: "column", sm: "row" },
            },
          }}
        >
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                StepIconComponent={({ active, completed }) => (
                  <Box
                    sx={{
                      width: { xs: 40, sm: 45, md: 50 },
                      height: { xs: 40, sm: 45, md: 50 },
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: completed
                        ? "success.main"
                        : active
                        ? "primary.main"
                        : "grey.300",
                      color: "white",
                      mb: { xs: 0.5, md: 1 },
                      fontSize: { xs: "0.8rem", sm: "1rem" },
                    }}
                  >
                    {completed ? <CheckIcon fontSize="small" /> : step.icon}
                  </Box>
                )}
                sx={{
                  flexDirection: { xs: "row", sm: "column" },
                  alignItems: { xs: "flex-start", sm: "center" },
                  textAlign: { xs: "left", sm: "center" },
                  "& .MuiStepLabel-labelContainer": {
                    ml: { xs: 2, sm: 0 },
                    mt: { xs: 0, sm: 1 },
                  },
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight={activeStep === index ? "bold" : "normal"}
                  sx={{
                    fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                    lineHeight: { xs: 1.2, sm: 1.4 },
                  }}
                >
                  {step.label}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: "0.7rem", sm: "0.75rem" },
                    display: { xs: "block", sm: "block" },
                    mt: { xs: 0.5, sm: 0.5 },
                  }}
                >
                  {step.description}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Divider />

      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: { xs: 2, md: 3 },
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
            }}
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        <Box sx={{ mb: { xs: 2, md: 4 } }}>{renderStepContent(activeStep)}</Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: { xs: "center", sm: "space-between" },
            alignItems: { xs: "stretch", sm: "center" },
            pt: { xs: 2, md: 3 },
            borderTop: "1px solid",
            borderColor: "divider",
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
            size={window.innerWidth < 600 ? "medium" : "large"}
            sx={{
              minWidth: { xs: "100%", sm: 120 },
              order: { xs: 2, sm: 1 },
            }}
          >
            Back
          </Button>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              order: { xs: 1, sm: 2 },
              mb: { xs: 0, sm: 0 },
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: { xs: "0.8rem", sm: "0.875rem" },
              }}
            >
              Step {activeStep + 1} of {steps.length}
            </Typography>
          </Box>

          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              size={window.innerWidth < 600 ? "medium" : "large"}
              sx={{
                minWidth: { xs: "100%", sm: 120 },
                order: { xs: 3, sm: 3 },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Submit Application"
              )}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              size={window.innerWidth < 600 ? "medium" : "large"}
              sx={{
                minWidth: { xs: "100%", sm: 120 },
                order: { xs: 3, sm: 3 },
              }}
            >
              Next
            </Button>
          )}
        </Box>
      </Box>
    </>
  );
};

export default BrandRegistration;
