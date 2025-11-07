import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
  IconButton,
  Alert,
} from "@mui/material";
import { db } from "../../firebase/firebase";
import { Close, Send, LocationOn } from "@mui/icons-material";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import NotificationService from "../../utils/NotificationService";
import { INVESTMENT_RANGES, BUSINESS_EXPERIENCE_OPTIONS, TIMELINE_OPTIONS } from "../../constants";
import logger from "../../utils/logger";

const investmentRanges = INVESTMENT_RANGES;
const businessExperience = BUSINESS_EXPERIENCE_OPTIONS;
const timeline = TIMELINE_OPTIONS;

const FranchiseInquiryForm = ({ brand, onClose, onSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",

    // User Address
    userAddress: "",
    userCity: "",
    userState: "",
    userZipCode: "",
    userCountry: "", // Default value

    // Franchise Information
    brandFranchiseLocation: "",
    budget: "Under ₹50K",
    experience: "No Business Experience",
    timeline: "As soon as possible",
    comments: "",
    agreement: false,
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if brand has locations
  const hasLocations = brand?.brandFranchiseLocations && brand.brandFranchiseLocations.length > 0;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validate = () => {
    const newErrors = {};

    // Personal Info Validation
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    // Email Validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    // Phone Validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (
      !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(
        formData.phone
      )
    ) {
      newErrors.phone = "Invalid phone number";
    }

    // Address Validation
    if (!formData.userAddress.trim())
      newErrors.userAddress = "Address is required";
    if (!formData.userCity.trim()) newErrors.userCity = "City is required";
    if (!formData.userState) newErrors.userState = "State is required";

    // Franchise Info Validation - Only require location if brand has locations
    if (hasLocations && !formData.brandFranchiseLocation) {
      newErrors.brandFranchiseLocation = "Location is required";
    }
    
    if (!formData.budget) newErrors.budget = "Investment budget is required";
    if (!formData.agreement)
      newErrors.agreement = "You must agree to be contacted";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // Find selected location or create a default one
      let selectedLocation = null;
      if (hasLocations && formData.brandFranchiseLocation) {
        selectedLocation = brand.brandFranchiseLocations.find(
          (loc) => loc.city === formData.brandFranchiseLocation
        );
      }

      const inquiryData = {
        // Personal Information
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),

        // User Address
        userAddress: {
          street: formData.userAddress.trim(),
          city: formData.userCity.trim(),
          state: formData.userState,
          zipCode: formData.userZipCode.trim(),
          country: formData.userCountry,
        },

        // Franchise Information - Only include if location exists
        ...(selectedLocation && {
          brandFranchiseLocation: {
            city: selectedLocation.city,
            state: selectedLocation.state,
            country: selectedLocation.country,
            zipCode: selectedLocation.zipCode,
            address: selectedLocation.address,
            phone: selectedLocation.phone,
            googleMapsURl: selectedLocation.googleMapsURl,
          }
        }),

        budget: formData.budget,
        experience: formData.experience,
        timeline: formData.timeline,
        comments: formData.comments.trim(),

        // Brand Information
        brandId: brand.id,
        brandName: brand.brandName,
        brandImage: brand.brandImage || "",
        brandOwnerId: brand.userId,

        // Metadata
        status: "New",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(
        collection(db, "brandfranchiseInquiry"),
        inquiryData
      );

      // Send notification to brand owner
      await NotificationService.sendLeadNotification(
        brand.userId, 
        { ...inquiryData, id: docRef.id }
      );

      setSubmitted(true);
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Removed navigation for a smoother user experience
    } catch (error) {
      logger.error("Error submitting inquiry:", error);
      setErrors({ submit: "Failed to submit inquiry. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Card sx={{ m: 2 }}>
        <CardContent sx={{ p: 4, textAlign: "center" }}>
          <Alert severity="success" sx={{ mb: 3 }}>
            Thank you for your interest in {brand.brandName}!
          </Alert>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Your inquiry has been submitted successfully.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            A franchise specialist will contact you within 24 hours.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box sx={{ m: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          <LocationOn color="primary" sx={{ verticalAlign: "middle", mr: 1 }} />
          Request Information - {brand.brandName}
        </Typography>
        <IconButton onClick={onClose} aria-label="Close inquiry form">
          <Close />
        </IconButton>
      </Box>

      {/* Show warning if no locations */}
      {!hasLocations && (
        <Alert severity="info" sx={{ mb: 3 }}>
          This brand doesn't have specific locations listed yet. Your inquiry will be sent directly to the brand owner.
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 1 }}>
          Personal Information
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="firstName"
              label="First Name *"
              value={formData.firstName}
              onChange={handleChange}
              fullWidth
              error={!!errors.firstName}
              helperText={errors.firstName}
              aria-describedby={errors.firstName ? "firstName-error" : undefined}
              FormHelperTextProps={{ id: "firstName-error" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="lastName"
              label="Last Name *"
              value={formData.lastName}
              onChange={handleChange}
              fullWidth
              error={!!errors.lastName}
              helperText={errors.lastName}
              aria-describedby={errors.lastName ? "lastName-error" : undefined}
              FormHelperTextProps={{ id: "lastName-error" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="email"
              label="Email *"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              error={!!errors.email}
              helperText={errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              FormHelperTextProps={{ id: "email-error" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="phone"
              label="Phone Number *"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
              error={!!errors.phone}
              helperText={errors.phone}
              placeholder="e.g. 123-456-7890"
              aria-describedby={errors.phone ? "phone-error" : undefined}
              FormHelperTextProps={{ id: "phone-error" }}
            />
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 1 }}>
          Your Address
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <TextField
              name="userAddress"
              label="Street Address *"
              value={formData.userAddress}
              onChange={handleChange}
              fullWidth
              error={!!errors.userAddress}
              helperText={errors.userAddress}
              aria-describedby={errors.userAddress ? "userAddress-error" : undefined}
              FormHelperTextProps={{ id: "userAddress-error" }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              name="userCity"
              label="City *"
              value={formData.userCity}
              onChange={handleChange}
              fullWidth
              error={!!errors.userCity}
              helperText={errors.userCity}
              aria-describedby={errors.userCity ? "userCity-error" : undefined}
              FormHelperTextProps={{ id: "userCity-error" }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              name="userState"
              label="State *"
              value={formData.userState}
              onChange={handleChange}
              fullWidth
              error={!!errors.userState}
              helperText={errors.userState}
              aria-describedby={errors.userState ? "userState-error" : undefined}
              FormHelperTextProps={{ id: "userState-error" }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              name="userZipCode"
              label="ZIP Code *"
              value={formData.userZipCode}
              onChange={handleChange}
              fullWidth
              error={!!errors.userZipCode}
              helperText={errors.userZipCode}
              placeholder="e.g. 12345 or 12345-6789"
              aria-describedby={errors.userZipCode ? "userZipCode-error" : undefined}
              FormHelperTextProps={{ id: "userZipCode-error" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="userCountry"
              label="Country"
              value={formData.userCountry}
              onChange={handleChange}
              fullWidth
              error={!!errors.userCountry}
              helperText={errors.userCountry}
              placeholder="e.g. United States"
              aria-describedby={errors.userCountry ? "userCountry-error" : undefined}
              FormHelperTextProps={{ id: "userCountry-error" }}
            />
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 1 }}>
          Franchise Information
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {hasLocations && (
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.brandFranchiseLocation}>
                <InputLabel id="brandFranchiseLocation-label">Preferred Location (Optional)</InputLabel>
                <Select
                  name="brandFranchiseLocation"
                  value={formData.brandFranchiseLocation}
                  onChange={handleChange}
                  label="Preferred Location (Optional)"
                  labelId="brandFranchiseLocation-label"
                  aria-describedby={errors.brandFranchiseLocation ? "brandFranchiseLocation-error" : undefined}
                >
                  {brand.brandFranchiseLocations.map((loc, index) => (
                    <MenuItem key={index} value={loc.city}>
                      {loc.address}, {loc.city}, {loc.state} {loc.zipCode}
                    </MenuItem>
                  ))}
                </Select>
                {errors.brandFranchiseLocation && (
                  <Typography variant="caption" color="error" id="brandFranchiseLocation-error">
                    {errors.brandFranchiseLocation}
                  </Typography>
                )}
              </FormControl>
            </Grid>
          )}
          <Grid item xs={12} sm={6} md={hasLocations ? 3 : 6}>
            <FormControl fullWidth error={!!errors.budget}>
              <InputLabel id="budget-label">Investment Budget *</InputLabel>
              <Select
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                label="Investment Budget *"
                labelId="budget-label"
                aria-describedby={errors.budget ? "budget-error" : undefined}
              >
                {investmentRanges.map((range) => (
                  <MenuItem key={range} value={range}>
                    {range}
                  </MenuItem>
                ))}
              </Select>
              {errors.budget && (
                <Typography variant="caption" color="error" id="budget-error">
                  {errors.budget}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={hasLocations ? 3 : 6}>
            <FormControl fullWidth>
              <InputLabel>Business Experience</InputLabel>
              <Select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                label="Business Experience"
              >
                {businessExperience.map((exp) => (
                  <MenuItem key={exp} value={exp}>
                    {exp}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Timeline to Open</InputLabel>
              <Select
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
                label="Timeline to Open"
              >
                {timeline.map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 1 }}>
          Additional Information
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <TextField
              name="comments"
              label="Additional Comments"
              value={formData.comments}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              placeholder="Tell us more about your goals, experience, and any specific questions you have..."
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <FormControl error={!!errors.agreement} fullWidth>
              <FormControlLabel
                control={
                  <Checkbox
                    name="agreement"
                    checked={formData.agreement}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label="I agree to be contacted by FranchiseHub and the franchise brand regarding this opportunity *"
              />
              {errors.agreement && (
                <Typography variant="caption" color="error">
                  {errors.agreement}
                </Typography>
              )}
            </FormControl>
          </Grid>
        </Grid>

        {errors.submit && (
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12}>
              <Alert severity="error">{errors.submit}</Alert>
            </Grid>
          </Grid>
        )}

        <Box sx={{ mt: 4 }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            startIcon={<Send />}
            disabled={loading}
            sx={{
              borderRadius: 2,
              fontWeight: "bold",
              py: 1.5,
              fontSize: "1.1rem",
            }}
          >
            {loading ? "Submitting..." : "Submit Inquiry"}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default FranchiseInquiryForm;