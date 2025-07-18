import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
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
} from "@mui/material";

const steps = ["Brand Basics", "Investment Details", "Brand Story"];

const CreateBrandProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    brandName: "",
    category: "",
    logoUrl: "",
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
      console.error("Error saving brand data:", error);
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
            />
            <TextField
              label="Category (e.g., Fast Food, Cafe)"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
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
            <Typography variant="h6">Now, about the investment.</Typography>
            <TextField
              label="Investment Range (e.g., ₹50k - ₹100k)"
              name="investmentRange"
              value={formData.investmentRange}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Minimum Expected ROI (%)"
              name="minROI"
              value={formData.minROI}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
          </>
        );
      case 2:
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
