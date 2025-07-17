import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Avatar,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import {
  LocationOn,
  Phone,
  Map as MapIcon,
  Business,
  Close,
} from "@mui/icons-material";

const AddFranchiseLocation = ({ open, onClose, brands, onAddLocation }) => {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [newLocation, setNewLocation] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    phone: "",
    googleMapsURl: "",
  });

  const handleBrandChange = (event) => {
    setSelectedBrand(event.target.value);
  };

  const handleLocationChange = (field) => (event) => {
    setNewLocation({
      ...newLocation,
      [field]: event.target.value,
    });
  };

  const resetForm = () => {
    setSelectedBrand("");
    setNewLocation({
      address: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
      phone: "",
      googleMapsURl: "",
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    if (!selectedBrand) return;
    onAddLocation(selectedBrand, newLocation);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, display: "flex", alignItems: "center" }}>
        <Business sx={{ mr: 1 }} />
        Add New Franchise Location
        <Box sx={{ flexGrow: 1 }} />
        <IconButton aria-label="close" onClick={handleClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="select-brand-label">Select Brand</InputLabel>
          <Select
            labelId="select-brand-label"
            value={selectedBrand}
            onChange={handleBrandChange}
            label="Select Brand"
          >
            {brands.map((brand) => (
              <MenuItem key={brand.id} value={brand.id}>
                <Box display="flex" alignItems="center">
                  <Avatar
                    src={brand.brandImage}
                    alt={brand.brandName}
                    sx={{ width: 30, height: 30, mr: 1.5 }}
                  />
                  <Typography>{brand.brandName}</Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedBrand && (
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={newLocation.address}
                  onChange={handleLocationChange("address")}
                  InputProps={{
                    startAdornment: (
                      <LocationOn color="action" sx={{ mr: 1 }} />
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  value={newLocation.city}
                  onChange={handleLocationChange("city")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State"
                  value={newLocation.state}
                  onChange={handleLocationChange("state")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Country"
                  value={newLocation.country}
                  onChange={handleLocationChange("country")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Zip Code"
                  value={newLocation.zipCode}
                  onChange={handleLocationChange("zipCode")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={newLocation.phone}
                  onChange={handleLocationChange("phone")}
                  InputProps={{
                    startAdornment: <Phone color="action" sx={{ mr: 1 }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Google Maps URL"
                  value={newLocation.googleMapsURl}
                  onChange={handleLocationChange("googleMapsURl")}
                  InputProps={{
                    startAdornment: <MapIcon color="action" sx={{ mr: 1 }} />,
                  }}
                  placeholder="https://maps.google.com/..."
                />
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: "16px 24px" }}>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={!selectedBrand || !newLocation.address}
          sx={{ borderRadius: "20px", px: 3 }}
        >
          Add Location
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddFranchiseLocation;
