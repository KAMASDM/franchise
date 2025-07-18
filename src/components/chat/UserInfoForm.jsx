import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Chip,
  FormControl,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import {
  ArrowBack,
  ArrowForward,
  Close,
  Person,
  Language,
  LocationOn,
  AttachMoney,
} from "@mui/icons-material";

const investmentRanges = [
  "Under ₹50K",
  "₹50K - ₹100K",
  "₹100K - ₹250K",
  "₹250K - ₹500K",
  "₹500K - ₹1M",
  "Over ₹1M",
];

// A list of major Indian cities for the location chips
const indianCities = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Ahmedabad",
  "Chennai",
  "Kolkata",
  "Surat",
  "Pune",
  "Jaipur",
  "Lucknow",
  "Kanpur",
  "Nagpur",
  "Indore",
  "Thane",
  "Bhopal",
  "Visakhapatnam",
  "Patna",
  "Vadodara",
  "Ghaziabad",
  "Ludhiana",
  "Agra",
  "Nashik",
  "Faridabad",
  "Meerut",
  "Rajkot",
  "Kalyan-Dombivali",
  "Vasai-Virar",
  "Varanasi",
  "Srinagar",
  "Guwahati",
  "Chandigarh",
  "Thiruvananthapuram",
  "Solapur",
  "Hubballi-Dharwad",
];

// Indian languages with their native names
const indianLanguages = [
  { code: "English", name: "English", native: "English" },
  { code: "Hindi", name: "Hindi", native: "हिंदी" },
  { code: "Gujarati", name: "Gujarati", native: "ગુજરાતી" },
  { code: "Marathi", name: "Marathi", native: "मराठी" },
  { code: "Tamil", name: "Tamil", native: "தமிழ்" },
  { code: "Telugu", name: "Telugu", native: "తెలుగు" },
  { code: "Kannada", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "Bengali", name: "Bengali", native: "বাংলা" },
  { code: "Malayalam", name: "Malayalam", native: "മലയാളം" },
  { code: "Punjabi", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
];

const steps = [
  { label: "Personal Info", icon: <Person /> },
  { label: "Language", icon: <Language /> },
  { label: "Location", icon: <LocationOn /> },
  { label: "Budget", icon: <AttachMoney /> },
];

const UserInfoForm = ({ onStartChat }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    language: "English",
    location: "",
    customLocation: "",
    budget: "",
  });
  const [errors, setErrors] = useState({});
  const [showCustomLocationDialog, setShowCustomLocationDialog] =
    useState(false);

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (activeStep === steps.length - 1) {
        // Final step - start chat
        const finalUserInfo = {
          ...userInfo,
          location:
            userInfo.location === "Other"
              ? userInfo.customLocation
              : userInfo.location,
        };
        onStartChat(finalUserInfo);
      } else {
        setActiveStep((prevStep) => prevStep + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleLanguageSelect = (languageCode) => {
    setUserInfo((prev) => ({ ...prev, language: languageCode }));
    if (errors.language) {
      setErrors((prev) => ({ ...prev, language: "" }));
    }
  };

  const handleLocationSelect = (city) => {
    if (city === "Other") {
      setShowCustomLocationDialog(true);
    } else {
      setUserInfo((prev) => ({ ...prev, location: city }));
      if (errors.location) {
        setErrors((prev) => ({ ...prev, location: "" }));
      }
    }
  };

  const handleBudgetSelect = (range) => {
    setUserInfo((prev) => ({ ...prev, budget: range }));
    if (errors.budget) {
      setErrors((prev) => ({ ...prev, budget: "" }));
    }
  };

  const handleCustomLocationSubmit = () => {
    if (userInfo.customLocation.trim()) {
      setUserInfo((prev) => ({ ...prev, location: "Other" }));
      setShowCustomLocationDialog(false);
      if (errors.location) {
        setErrors((prev) => ({ ...prev, location: "" }));
      }
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    // Indian mobile number: starts with 6,7,8,9 and total 10 digits
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validateCurrentStep = () => {
    let tempErrors = {};

    switch (activeStep) {
      case 0: // Personal Info
        if (!userInfo.name.trim()) tempErrors.name = "Name is required";
        if (!userInfo.email.trim()) {
          tempErrors.email = "Email is required";
        } else if (!validateEmail(userInfo.email)) {
          tempErrors.email = "Please enter a valid email address";
        }
        if (!userInfo.phone.trim()) {
          tempErrors.phone = "Phone number is required";
        } else if (!validatePhone(userInfo.phone)) {
          tempErrors.phone = "Enter a valid 10-digit Indian mobile number";
        }
        break;
      case 1: // Language
        if (!userInfo.language)
          tempErrors.language = "Please select a language";
        break;
      case 2: // Location
        if (!userInfo.location)
          tempErrors.location = "Please select a location";
        if (userInfo.location === "Other" && !userInfo.customLocation.trim()) {
          tempErrors.location = "Please specify your location";
        }
        break;
      case 3: // Budget
        if (!userInfo.budget) {
          tempErrors.budget = "Please select a budget range";
        }
        break;
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Box sx={{ textAlign: "center", mb: 2 }}>
              <Typography
                variant="h5"
                fontWeight="bold"
                color="primary"
                sx={{ mb: 1 }}
              >
                🎉 Welcome to FranchiseHub!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Let's start your journey to finding the perfect franchise
                opportunity. We'll help you discover options tailored just for
                you!
              </Typography>
            </Box>

            <TextField
              label="Full Name"
              name="name"
              value={userInfo.name}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              error={!!errors.name}
              helperText={errors.name}
              placeholder="Enter your full name"
            />

            <TextField
              label="Email Address"
              name="email"
              type="email"
              value={userInfo.email}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              error={!!errors.email}
              helperText={errors.email}
              placeholder="your.email@example.com"
            />

            <TextField
              label="Phone Number"
              name="phone"
              value={userInfo.phone}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              error={!!errors.phone}
              helperText={errors.phone}
              placeholder="9876543210"
              inputProps={{ maxLength: 10 }}
            />
          </Box>
        );

      case 1:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ textAlign: "center", mb: 2 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                Choose Your Preferred Language
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Select the language you're most comfortable with for our
                conversation
              </Typography>
            </Box>

            <FormControl error={!!errors.language}>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1.5,
                  justifyContent: "center",
                }}
              >
                {indianLanguages.map((language) => (
                  <Chip
                    key={language.code}
                    label={language.native}
                    onClick={() => handleLanguageSelect(language.code)}
                    color={
                      userInfo.language === language.code
                        ? "primary"
                        : "default"
                    }
                    variant={
                      userInfo.language === language.code
                        ? "filled"
                        : "outlined"
                    }
                    sx={{
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      py: 2.5,
                      px: 1,
                      "&:hover": {
                        backgroundColor:
                          userInfo.language === language.code
                            ? "primary.dark"
                            : "action.hover",
                      },
                    }}
                  />
                ))}
              </Box>
              {errors.language && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 1, textAlign: "center" }}
                >
                  {errors.language}
                </Typography>
              )}
            </FormControl>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ textAlign: "center", mb: 2 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                Where are you looking to invest?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Select your preferred city or location for the franchise
              </Typography>
            </Box>

            <FormControl error={!!errors.location}>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  maxHeight: 200,
                  overflowY: "auto",
                  border: errors.location ? "2px solid" : "1px solid",
                  borderColor: errors.location ? "error.main" : "divider",
                }}
              >
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {indianCities.sort().map((city) => (
                    <Chip
                      key={city}
                      label={city}
                      onClick={() => handleLocationSelect(city)}
                      color={userInfo.location === city ? "primary" : "default"}
                      variant={
                        userInfo.location === city ? "filled" : "outlined"
                      }
                      size="small"
                      sx={{
                        cursor: "pointer",
                        fontSize: "0.75rem",
                        "&:hover": {
                          backgroundColor:
                            userInfo.location === city
                              ? "primary.dark"
                              : "action.hover",
                        },
                      }}
                    />
                  ))}
                  <Chip
                    label="Other"
                    onClick={() => handleLocationSelect("Other")}
                    color={
                      userInfo.location === "Other" ? "secondary" : "default"
                    }
                    variant={
                      userInfo.location === "Other" ? "filled" : "outlined"
                    }
                    size="small"
                    sx={{
                      cursor: "pointer",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      "&:hover": {
                        backgroundColor:
                          userInfo.location === "Other"
                            ? "secondary.dark"
                            : "action.hover",
                      },
                    }}
                  />
                </Box>
              </Paper>
              {userInfo.location === "Other" && userInfo.customLocation && (
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ mt: 1, textAlign: "center" }}
                >
                  Selected: {userInfo.customLocation}
                </Typography>
              )}
              {errors.location && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 1, textAlign: "center" }}
                >
                  {errors.location}
                </Typography>
              )}
            </FormControl>
          </Box>
        );

      case 3:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Box sx={{ textAlign: "center", mb: 2 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                What's your investment budget?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Select your approximate budget for the franchise investment.
              </Typography>
            </Box>

            <FormControl error={!!errors.budget}>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1.5,
                  justifyContent: "center",
                }}
              >
                {investmentRanges.map((range) => (
                  <Chip
                    key={range}
                    label={range}
                    onClick={() => handleBudgetSelect(range)}
                    color={userInfo.budget === range ? "primary" : "default"}
                    variant={userInfo.budget === range ? "filled" : "outlined"}
                    sx={{
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      py: 2.5,
                      px: 1.5,
                      "&:hover": {
                        backgroundColor:
                          userInfo.budget === range
                            ? "primary.dark"
                            : "action.hover",
                      },
                    }}
                  />
                ))}
              </Box>
              {errors.budget && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 1, textAlign: "center" }}
                >
                  {errors.budget}
                </Typography>
              )}
            </FormControl>

            {userInfo.budget && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  backgroundColor: "success.light",
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="body2"
                  color="success.dark"
                  sx={{ textAlign: "center" }}
                >
                  🚀 You're all set! Click "Start Chat" to discover franchise
                  opportunities perfect for your budget and preferences.
                </Typography>
              </Box>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Box
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          pt: 2, // Fixed top padding
        }}
      >
        {/* Stepper */}
        <Stepper
          activeStep={activeStep}
          sx={{
            mb: 2,
            "& .MuiStepLabel-root": {
              padding: 0,
            },
            "& .MuiStepConnector-root": {
              marginLeft: "12px",
              marginRight: "12px",
            },
          }}
        >
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                icon={step.icon}
                sx={{
                  "& .MuiStepLabel-iconContainer": {
                    paddingRight: 0,
                  },
                }}
              >
                {/* Icons only for compact design */}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Content */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minHeight: 0,
          }}
        >
          {renderStepContent()}
        </Box>

        {/* Navigation Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 3,
            pt: 2,
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
            startIcon={<ArrowBack />}
            variant="outlined"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            variant="contained"
            endIcon={activeStep === steps.length - 1 ? null : <ArrowForward />}
            sx={{ minWidth: 120 }}
          >
            {activeStep === steps.length - 1 ? "Start Chat" : "Next"}
          </Button>
        </Box>
      </Box>

      {/* Custom Location Dialog */}
      <Dialog
        open={showCustomLocationDialog}
        onClose={() => setShowCustomLocationDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Specify Your Location
          <IconButton onClick={() => setShowCustomLocationDialog(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            label="City/Location"
            name="customLocation"
            value={userInfo.customLocation}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            placeholder="Enter your city or location"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCustomLocationDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCustomLocationSubmit}
            variant="contained"
            disabled={!userInfo.customLocation.trim()}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserInfoForm;
