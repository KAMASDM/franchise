import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Button,
  CircularProgress,
  Grid,
  FormHelperText,
} from "@mui/material";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import { useAuth } from "../../../context/AuthContext";
import logger from "../../../utils/logger";

const AddReview = ({ open, onClose, brands }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userName: user?.displayName || "",
    brand: brands.length > 0 ? brands[0].brandName : "",
    content: "",
    rating: 5,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleRatingChange = (event, newValue) => {
    setFormData((prev) => ({
      ...prev,
      rating: newValue,
    }));
    if (errors.rating) {
      setErrors((prev) => ({ ...prev, rating: null }));
    }
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.userName.trim()) tempErrors.userName = "Name is required.";
    if (!formData.content.trim())
      tempErrors.content = "Review content cannot be empty.";
    if (!formData.brand) tempErrors.brand = "Please select a brand.";
    if (formData.rating === null || formData.rating === 0)
      tempErrors.rating = "Rating is required.";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "testimonials"), {
        ...formData,
        userId: user?.uid,
        createdAt: new Date(),
      });
      onClose();
      setFormData({
        userName: user?.displayName || "",
        brand: brands.length > 0 ? brands[0].brandName : "",
        content: "",
        rating: 5,
      });
      setErrors({});
    } catch (error) {
      logger.error("Error adding review: ", error);
      setErrors({ form: "Failed to submit review. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: "600px" },
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          outline: "none",
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
          Add New Review
        </Typography>
        <form onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Your Name"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                required
                error={!!errors.userName}
                helperText={errors.userName}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required error={!!errors.brand}>
                <InputLabel>Brand</InputLabel>
                <Select
                  name="brand"
                  value={formData.brand}
                  label="Brand"
                  onChange={handleChange}
                >
                  {brands.map((brand) => (
                    <MenuItem key={brand.id} value={brand.brandName}>
                      {brand.brandName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.brand && (
                  <FormHelperText>{errors.brand}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Your Review"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                error={!!errors.content}
                helperText={errors.content}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl error={!!errors.rating}>
                <Typography component="legend">Rating</Typography>
                <Rating
                  name="rating"
                  value={Number(formData.rating)}
                  onChange={handleRatingChange}
                  precision={0.5}
                />
                {errors.rating && (
                  <FormHelperText>{errors.rating}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button onClick={onClose} sx={{ mr: 2 }} disabled={loading}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Submit Review"
                  )}
                </Button>
              </Box>
              {errors.form && (
                <Typography color="error" sx={{ textAlign: "right", mt: 1 }}>
                  {errors.form}
                </Typography>
              )}
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
};

export default AddReview;
