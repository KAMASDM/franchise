import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@mui/material";
import { Close, TrendingUp } from "@mui/icons-material";
import Gift from "@mui/icons-material/CardGiftcard";
import { useForm, Controller } from "react-hook-form";

const investmentRanges = [
  "Under ₹50K",
  "₹50K - ₹100K",
  "₹100K - ₹250K",
  "₹250K - ₹500K",
  "₹500K - ₹1M",
  "Over ₹1M",
];

const LeadCaptureModal = ({ open, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Lead captured:", data);
    localStorage.setItem("userCaptured", "true");
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    localStorage.setItem("userCaptured", "true");
    onClose();
  };

  if (submitted) {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogContent sx={{ textAlign: "center", p: 4 }}>
          <Gift sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
            Thank You!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your free franchise guide is being prepared and will be sent to your
            email shortly.
          </Typography>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        },
      }}
    >
      <Box sx={{ position: "relative" }}>
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "white",
            zIndex: 1,
          }}
        >
          <Close />
        </IconButton>

        <DialogContent sx={{ p: 0 }}>
          <Grid container>
            {/* Left Side - Value Proposition */}
            <Grid item xs={12} md={6} sx={{ p: 4 }}>
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <TrendingUp sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
                  Unlock Your Franchise Success
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
                  Get our FREE comprehensive guide to restaurant franchising and
                  discover:
                </Typography>
              </Box>

              <Box sx={{ textAlign: "left" }}>
                {[
                  "Top-performing franchise opportunities",
                  "Investment requirements and ROI projections",
                  "Financing options and strategies",
                  "Step-by-step franchise selection process",
                  "Expert tips from successful franchisees",
                ].map((benefit, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", alignItems: "center", mb: 2 }}
                  >
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        backgroundColor: "#FFD700",
                        color: "black",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 2,
                        fontWeight: "bold",
                        fontSize: "0.8rem",
                      }}
                    >
                      ✓
                    </Box>
                    <Typography variant="body1">{benefit}</Typography>
                  </Box>
                ))}
              </Box>
            </Grid>

            {/* Right Side - Form */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%", borderRadius: 0 }}>
                <CardContent
                  sx={{
                    p: 4,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{ mb: 3, color: "text.primary" }}
                  >
                    Get Your FREE Guide Now
                  </Typography>

                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    style={{ flexGrow: 1 }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Controller
                          name="firstName"
                          control={control}
                          rules={{ required: "First name is required" }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="First Name"
                              error={!!errors.firstName}
                              helperText={errors.firstName?.message}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Controller
                          name="lastName"
                          control={control}
                          rules={{ required: "Last name is required" }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Last Name"
                              error={!!errors.lastName}
                              helperText={errors.lastName?.message}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Controller
                          name="email"
                          control={control}
                          rules={{
                            required: "Email is required",
                            pattern: {
                              value: /^\S+@\S+$/i,
                              message: "Invalid email address",
                            },
                          }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Email Address"
                              type="email"
                              error={!!errors.email}
                              helperText={errors.email?.message}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Controller
                          name="phone"
                          control={control}
                          rules={{ required: "Phone number is required" }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Phone Number"
                              error={!!errors.phone}
                              helperText={errors.phone?.message}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Controller
                          name="budget"
                          control={control}
                          rules={{ required: "Investment budget is required" }}
                          render={({ field }) => (
                            <FormControl fullWidth error={!!errors.budget}>
                              <InputLabel>Investment Budget</InputLabel>
                              <Select {...field} label="Investment Budget">
                                {investmentRanges.map((range) => (
                                  <MenuItem key={range} value={range}>
                                    {range}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          )}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          fullWidth
                          sx={{
                            mt: 2,
                            borderRadius: 25,
                            fontWeight: "bold",
                            py: 1.5,
                            fontSize: "1.1rem",
                          }}
                        >
                          Get My FREE Guide
                        </Button>
                      </Grid>
                    </Grid>
                  </form>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 2, textAlign: "center" }}
                  >
                    By submitting this form, you agree to receive communications
                    from FranchiseHub about franchise opportunities.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default LeadCaptureModal;
