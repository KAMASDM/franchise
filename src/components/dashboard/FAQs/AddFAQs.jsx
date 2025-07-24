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
  Button,
  CircularProgress,
  Grid,
  FormHelperText,
  IconButton,
  Divider,
} from "@mui/material";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import { useAuth } from "../../../context/AuthContext";

const AddFAQs = ({ open, onClose, brands }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userName: user?.displayName || "",
    brand: brands.length > 0 ? brands[0].brandName : "",
    faqs: [{ question: "", answer: "" }],
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

  const handleFAQChange = (index, field, value) => {
    const updatedFAQs = [...formData.faqs];
    updatedFAQs[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      faqs: updatedFAQs,
    }));

    if (errors[`faq-${index}-${field}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`faq-${index}-${field}`];
        return newErrors;
      });
    }
  };

  const addFAQ = () => {
    setFormData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }],
    }));
  };

  const removeFAQ = (index) => {
    if (formData.faqs.length <= 1) return;

    setFormData((prev) => {
      const updatedFAQs = [...prev.faqs];
      updatedFAQs.splice(index, 1);
      return {
        ...prev,
        faqs: updatedFAQs,
      };
    });

    setErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach((key) => {
        if (key.startsWith(`faq-${index}`)) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.userName.trim()) {
      newErrors.userName = "Name is required";
    }

    if (!formData.brand) {
      newErrors.brand = "Please select a brand";
    }

    formData.faqs.forEach((faq, index) => {
      if (!faq.question.trim()) {
        newErrors[`faq-${index}-question`] = "Question is required";
      }
      if (!faq.answer.trim()) {
        newErrors[`faq-${index}-answer`] = "Answer is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      const batch = [];

      formData.faqs.forEach((faq) => {
        batch.push({
          userName: formData.userName,
          brand: formData.brand,
          question: faq.question,
          answer: faq.answer,
          userId: user?.uid,
          createdAt: new Date(),
        });
      });

      const collectionRef = collection(db, "faqs");
      const promises = batch.map((faq) => addDoc(collectionRef, faq));
      await Promise.all(promises);

      onClose();
      setFormData({
        userName: user?.displayName || "",
        brand: brands.length > 0 ? brands[0].brandName : "",
        faqs: [{ question: "", answer: "" }],
      });
      setErrors({});
    } catch (error) {
      console.error("Error adding FAQs: ", error);
      setErrors({ form: "Failed to submit FAQs. Please try again." });
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
          width: { xs: "95%", sm: "700px" },
          maxHeight: "90vh",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          outline: "none",
          overflowY: "auto",
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Add New FAQs
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

            {formData.faqs.map((faq, index) => (
              <React.Fragment key={index}>
                <Grid item xs={12}>
                  <Grid container spacing={2} alignItems="flex-start">
                    <Grid item xs={12} md={5.5}>
                      <TextField
                        fullWidth
                        label={`Question ${
                          formData.faqs.length > 1 ? `#${index + 1}` : ""
                        }`}
                        value={faq.question}
                        onChange={(e) =>
                          handleFAQChange(index, "question", e.target.value)
                        }
                        required
                        error={!!errors[`faq-${index}-question`]}
                        helperText={errors[`faq-${index}-question`]}
                        multiline
                        rows={2}
                      />
                    </Grid>

                    <Grid item xs={12} md={5.5}>
                      <TextField
                        fullWidth
                        label="Answer"
                        value={faq.answer}
                        onChange={(e) =>
                          handleFAQChange(index, "answer", e.target.value)
                        }
                        required
                        error={!!errors[`faq-${index}-answer`]}
                        helperText={errors[`faq-${index}-answer`]}
                        multiline
                        rows={2}
                      />
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      md={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        pt: 1,
                      }}
                    >
                      {formData.faqs.length > 1 && (
                        <IconButton
                          onClick={() => removeFAQ(index)}
                          color="error"
                          aria-label="Remove FAQ"
                        >
                          <RemoveIcon />
                        </IconButton>
                      )}
                    </Grid>
                  </Grid>
                </Grid>

                {index < formData.faqs.length - 1 && (
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                  </Grid>
                )}
              </React.Fragment>
            ))}

            <Grid item xs={12}>
              <Button
                startIcon={<AddIcon />}
                onClick={addFAQ}
                variant="outlined"
                fullWidth
              >
                Add Another FAQ
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button onClick={onClose} variant="outlined" disabled={loading}>
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
                    `Submit ${formData.faqs.length} FAQ${
                      formData.faqs.length > 1 ? "s" : ""
                    }`
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

export default AddFAQs;
