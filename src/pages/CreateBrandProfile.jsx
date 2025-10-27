import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import logger from "../utils/logger";
import {
  Button,
  Container,
  Typography,
  Paper,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip
} from "@mui/material";
import BusinessModelSelector from "../components/brand/BusinessModelSelector";
import { REVENUE_MODELS, SUPPORT_TYPES } from "../constants/businessModels";

const steps = ["Brand Basics", "Business Models", "Investment Details", "Brand Story"];

const CreateBrandProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    brandName: "",
    category: "",
    logoUrl: "",
    businessModels: [], // Array of selected business model types
    revenueModel: "",   // How the brand generates revenue
    supportTypes: [],   // Types of support provided
    investmentRange: "",
    minROI: "",
    story: "",
    status: "pending", // Default status
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        // If no user is logged in, redirect to sign-in
        navigate("/brand-signin");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBusinessModelsChange = (selectedModels) => {
    setFormData((prev) => ({ ...prev, businessModels: selectedModels }));
  };

  const handleSupportTypesChange = (event) => {
    const { value } = event.target;
    setFormData((prev) => ({
      ...prev,
      supportTypes: typeof value === 'string' ? value.split(',') : value
    }));
  };

  const handleSaveAndContinue = async () => {
    if (!user) {
      alert("You must be signed in to create a profile.");
      return;
    }

    try {
      await setDoc(doc(db, "brands", user.uid), formData, { merge: true });
      alert(`Section saved!`);
      if (activeStep < steps.length - 1) {
        setActiveStep((prev) => prev + 1);
      } else {
        alert("Profile created successfully! It will be reviewed by our team.");
        navigate("/");
      }
    } catch (error) {
      logger.error("Error saving brand data:", error);
      alert("Failed to save. Please try again.");
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <Typography variant="h6">Let's start with the basics.</Typography>
            <TextField
              label="Brand Name"
              name="brandName"
              value={formData.brandName}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Category (e.g., Fast Food, Cafe, Retail)"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Logo URL"
              name="logoUrl"
              value={formData.logoUrl}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
          </>
        );
      case 1:
        return (
          <>
            <BusinessModelSelector
              selectedModels={formData.businessModels}
              onChange={handleBusinessModelsChange}
              allowMultiple={true}
              industry={formData.category}
              showRecommendations={true}
              variant="cards"
            />
            <Box mt={3}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Revenue Model</InputLabel>
                <Select
                  name="revenueModel"
                  value={formData.revenueModel}
                  onChange={handleInputChange}
                  label="Revenue Model"
                >
                  {Object.entries(REVENUE_MODELS).map(([key, model]) => (
                    <MenuItem key={key} value={key}>
                      {model.label} - {model.description}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Support Types</InputLabel>
                <Select
                  name="supportTypes"
                  multiple
                  value={formData.supportTypes}
                  onChange={handleSupportTypesChange}
                  label="Support Types"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={SUPPORT_TYPES[value]?.label || value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {Object.entries(SUPPORT_TYPES).map(([key, support]) => (
                    <MenuItem key={key} value={key}>
                      {support.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </>
        );
      case 2:
        return (
          <>
            <Typography variant="h6">Now, about the investment.</Typography>
            <TextField
              label="Investment Range (e.g., ₹50k - ₹100k)"
              name="investmentRange"
              value={formData.investmentRange}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Minimum Expected ROI (%)"
              name="minROI"
              value={formData.minROI}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
          </>
        );
      case 3:
        return (
          <>
            <Typography variant="h6">Tell us your brand's story.</Typography>
            <TextField
              label="Your Story"
              name="story"
              value={formData.story}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              multiline
              rows={4}
            />
          </>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "5rem" }}>
      <Paper elevation={3} style={{ padding: "2rem" }}>
        <Typography variant="h4" gutterBottom align="center">
          Create Your Brand Profile
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box mt={4}>
          {renderStepContent(activeStep)}
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveAndContinue}
            >
              {activeStep === steps.length - 1 ? "Finish" : "Save and Continue"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateBrandProfile;
