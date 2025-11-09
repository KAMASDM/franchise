import React, { useState } from "react";
import { motion } from "framer-motion";
import { db } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import logger from "../../utils/logger";
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
  TextField,
  InputAdornment,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  useMediaQuery,
  useTheme,
  Grid,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import {
  LocationOn,
  Map as MapIcon,
  Phone,
  Search,
  FilterList,
  Sort,
  Clear,
} from "@mui/icons-material";
import { useBrands } from "../../hooks/useBrands";
import { useAuth } from "../../context/AuthContext";
import AddFranchiseLocation from "../forms/AddFranchiseLocation";

const Locations = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { brands, loading, error } = useBrands(user);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "brandName",
    direction: "asc",
  });
  const [filters, setFilters] = useState({
    country: "",
    state: "",
    city: "",
  });
  const theme = useTheme();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const allFranchiseLocations = brands.flatMap((brand) =>
    brand.brandFranchiseLocations
      ? brand.brandFranchiseLocations.map((location) => ({
          brandName: brand.brandName,
          brandId: brand.id,
          brandImage: brand.brandImage,
          ...location,
        }))
      : []
  );

  const filterOptions = {
    country: [
      ...new Set(allFranchiseLocations.map((loc) => loc.country)),
    ].filter(Boolean),
    state: [...new Set(allFranchiseLocations.map((loc) => loc.state))].filter(
      Boolean
    ),
    city: [...new Set(allFranchiseLocations.map((loc) => loc.city))].filter(
      Boolean
    ),
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (filterName, value) => {
    setFilters({
      ...filters,
      [filterName]: value,
    });
  };

  const clearFilters = () => {
    setFilters({
      country: "",
      state: "",
      city: "",
    });
    setSearchTerm("");
  };

  const filteredLocations = allFranchiseLocations
    .filter((location) => {
      const matchesSearch = Object.values(location).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );

      const matchesFilters =
        (!filters.country || location.country === filters.country) &&
        (!filters.state || location.state === filters.state) &&
        (!filters.city || location.city === filters.city);

      return matchesSearch && matchesFilters;
    })
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

  const handleAddLocation = async (brandId, newLocation) => {
    try {
      const brandRef = doc(db, "brands", brandId);
      const brandDoc = await getDoc(brandRef);

      if (brandDoc.exists()) {
        const currentLocations = brandDoc.data().brandFranchiseLocations || [];
        const updatedLocations = [...currentLocations, newLocation];

        await updateDoc(brandRef, {
          brandFranchiseLocations: updatedLocations,
        });

        setBrands(
          brands.map((brand) =>
            brand.id === brandId
              ? { ...brand, brandFranchiseLocations: updatedLocations }
              : brand
          )
        );
      }
    } catch (error) {
      logger.error("Error adding location:", error);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress color="primary" />
        <Typography variant="h6" ml={2} color="text.secondary">
          Loading your franchise locations...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
        {!user && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/")}
            sx={{ mt: 2 }}
          >
            Go to Login
          </Button>
        )}
      </Container>
    );
  }

  const SortableHeader = ({ label, sortKey }) => (
    <TableCell
      sx={{
        fontWeight: "bold",
        color: "primary.main",
        cursor: "pointer",
        "&:hover": { backgroundColor: "action.hover" },
      }}
      onClick={() => handleSort(sortKey)}
    >
      <Box display="flex" alignItems="center">
        {label}
        <Sort
          sx={{
            ml: 1,
            opacity: sortConfig.key === sortKey ? 1 : 0.3,
            transform:
              sortConfig.key === sortKey && sortConfig.direction === "desc"
                ? "rotate(180deg)"
                : "none",
          }}
          fontSize="small"
        />
      </Box>
    </TableCell>
  );

  const renderMobileView = () => (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      {filteredLocations.map((location, index) => (
        <Grid item xs={12} key={`${location.brandId}-${index}`}>
          <Card
            sx={{
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 3,
              },
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <Avatar
                  src={location.brandImage}
                  alt={location.brandName}
                  sx={{ width: 40, height: 40, mr: 2 }}
                />
                <Typography variant="h6" fontWeight="bold">
                  {location.brandName}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" mb={1}>
                <LocationOn
                  sx={{ fontSize: 18, mr: 1, color: "primary.main" }}
                />
                <Typography>
                  {location.address}, {location.city}, {location.state},{" "}
                  {location.country} {location.zipCode}
                </Typography>
              </Box>

              {location.phone && (
                <Box display="flex" alignItems="center" mb={1}>
                  <Phone sx={{ fontSize: 18, mr: 1, color: "success.main" }} />
                  <Link
                    href={`tel:${location.phone}`}
                    color="inherit"
                    underline="hover"
                  >
                    {location.phone}
                  </Link>
                </Box>
              )}

              {location.googleMapsURl && (
                <Box display="flex" alignItems="center">
                  <MapIcon sx={{ fontSize: 18, mr: 1, color: "error.main" }} />
                  <Link
                    href={
                      location.googleMapsURl.startsWith("http")
                        ? location.googleMapsURl
                        : `https://${location.googleMapsURl}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                  >
                    View on Map
                  </Link>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderDesktopView = () => (
    <TableContainer component={Paper} elevation={3} sx={{ mt: 3 }}>
      <Table stickyHeader aria-label="franchise locations table">
        <TableHead>
          <TableRow sx={{ bgcolor: "primary.light" }}>
            <SortableHeader label="Brand Name" sortKey="brandName" />
            <SortableHeader label="Address" sortKey="address" />
            <SortableHeader label="City" sortKey="city" />
            <SortableHeader label="State" sortKey="state" />
            <SortableHeader label="Country" sortKey="country" />
            <SortableHeader label="Zip Code" sortKey="zipCode" />
            <TableCell sx={{ fontWeight: "bold", color: "primary.main" }}>
              Phone
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "primary.main" }}>
              Map
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredLocations.map((location, index) => (
            <TableRow
              key={`${location.brandId}-${index}`}
              sx={{
                "&:nth-of-type(odd)": {
                  backgroundColor: "background.default",
                },
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              <TableCell component="th" scope="row">
                <Box display="flex" alignItems="center">
                  <Avatar
                    src={location.brandImage}
                    alt={location.brandName}
                    sx={{ width: 30, height: 30, mr: 2 }}
                  />
                  <Typography variant="subtitle1" fontWeight="medium">
                    {location.brandName}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box display="flex" alignItems="center">
                  <LocationOn
                    sx={{ fontSize: 18, mr: 0.5, color: "primary.main" }}
                  />
                  {location.address}
                </Box>
              </TableCell>
              <TableCell>{location.city}</TableCell>
              <TableCell>{location.state}</TableCell>
              <TableCell>{location.country}</TableCell>
              <TableCell>{location.zipCode}</TableCell>
              <TableCell>
                {location.phone ? (
                  <Link
                    href={`tel:${location.phone}`}
                    color="inherit"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      textDecoration: "none",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    <Phone
                      sx={{ fontSize: 16, mr: 0.5, color: "success.main" }}
                    />
                    {location.phone}
                  </Link>
                ) : (
                  "N/A"
                )}
              </TableCell>
              <TableCell>
                {location.googleMapsURl ? (
                  <Link
                    href={
                      location.googleMapsURl.startsWith("http")
                        ? location.googleMapsURl
                        : `https://${location.googleMapsURl}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    <MapIcon
                      sx={{ fontSize: 18, mr: 0.5, color: "error.main" }}
                    />
                    View Map
                  </Link>
                ) : (
                  "N/A"
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

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
          My Franchise Locations
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
          Manage and explore all your franchise locations in one place
        </Typography>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {allFranchiseLocations.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No franchise locations registered yet.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {brands.length === 0 
                ? "Start by registering your first brand, then add locations to it."
                : "You have registered brands. Add locations to showcase where your franchise operates."}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              {brands.length === 0 ? (
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={() => navigate("/dashboard/register-brand")}
                  sx={{
                    bgcolor: "secondary.main",
                    "&:hover": { bgcolor: "secondary.dark" },
                  }}
                >
                  Register New Brand
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => setOpenAddDialog(true)}
                  sx={{
                    bgcolor: "primary.main",
                    "&:hover": { bgcolor: "primary.dark" },
                  }}
                >
                  + Add Location to Brand
                </Button>
              )}
            </Box>
          </Box>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              elevation={2}
              sx={{
                p: 3,
                mb: 3,
                bgcolor: "background.paper",
                borderRadius: 2,
              }}
            >
              <Box
                display="flex"
                flexDirection={isMobile ? "column" : "row"}
                alignItems={isMobile ? "stretch" : "center"}
                justifyContent="space-between"
                gap={2}
              >
                <Box
                  display="flex"
                  flexDirection={isMobile ? "column" : "row"}
                  gap={2}
                  width={isMobile ? "100%" : "auto"}
                >
                  <TextField
                    fullWidth={isMobile}
                    variant="outlined"
                    placeholder="Search locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: searchTerm && (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setSearchTerm("")} aria-label="Clear search">
                            <Clear fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      flex: isMobile ? "none" : 1,
                      maxWidth: isMobile ? "100%" : "400px",
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => setOpenAddDialog(true)}
                    sx={{
                      bgcolor: "primary.main",
                      "&:hover": { bgcolor: "primary.dark" },
                    }}
                  >
                    + Add Other Location
                  </Button>
                </Box>

                <Box
                  display="flex"
                  flexDirection={isMobile ? "column" : "row"}
                  gap={2}
                  width={isMobile ? "100%" : "auto"}
                >
                  <FormControl
                    size="small"
                    sx={{ minWidth: isMobile ? "100%" : 120 }}
                  >
                    <InputLabel>Country</InputLabel>
                    <Select
                      value={filters.country}
                      onChange={(e) =>
                        handleFilterChange("country", e.target.value)
                      }
                      label="Country"
                    >
                      <MenuItem value="">All Countries</MenuItem>
                      {filterOptions.country.map((country) => (
                        <MenuItem key={country} value={country}>
                          {country}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl
                    size="small"
                    sx={{ minWidth: isMobile ? "100%" : 120 }}
                  >
                    <InputLabel>State</InputLabel>
                    <Select
                      value={filters.state}
                      onChange={(e) =>
                        handleFilterChange("state", e.target.value)
                      }
                      label="State"
                    >
                      <MenuItem value="">All States</MenuItem>
                      {filterOptions.state.map((state) => (
                        <MenuItem key={state} value={state}>
                          {state}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl
                    size="small"
                    sx={{ minWidth: isMobile ? "100%" : 120 }}
                  >
                    <InputLabel>City</InputLabel>
                    <Select
                      value={filters.city}
                      onChange={(e) =>
                        handleFilterChange("city", e.target.value)
                      }
                      label="City"
                    >
                      <MenuItem value="">All Cities</MenuItem>
                      {filterOptions.city.map((city) => (
                        <MenuItem key={city} value={city}>
                          {city}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Button
                    variant="outlined"
                    startIcon={<FilterList />}
                    onClick={clearFilters}
                    sx={{
                      height: "40px",
                      alignSelf: isMobile ? "flex-start" : "center",
                    }}
                  >
                    Clear
                  </Button>
                </Box>
              </Box>

              {Object.values(filters).some(Boolean) && (
                <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {filters.country && (
                    <Chip
                      label={`Country: ${filters.country}`}
                      onDelete={() => handleFilterChange("country", "")}
                      color="primary"
                      size="small"
                    />
                  )}
                  {filters.state && (
                    <Chip
                      label={`State: ${filters.state}`}
                      onDelete={() => handleFilterChange("state", "")}
                      color="secondary"
                      size="small"
                    />
                  )}
                  {filters.city && (
                    <Chip
                      label={`City: ${filters.city}`}
                      onDelete={() => handleFilterChange("city", "")}
                      color="info"
                      size="small"
                    />
                  )}
                </Box>
              )}
            </Paper>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" color="text.secondary">
                Showing {filteredLocations.length} of{" "}
                {allFranchiseLocations.length} locations
              </Typography>
            </Box>

            {isMobile ? renderMobileView() : renderDesktopView()}
          </motion.div>
        )}
      </Container>
      <AddFranchiseLocation
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        brands={brands}
        onAddLocation={handleAddLocation}
      />
    </>
  );
};

export default Locations;
