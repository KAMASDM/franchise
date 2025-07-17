import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
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
  Avatar,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import {
  LocationOn,
  Search,
  FilterList,
  Sort,
  Clear,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";

const Brands = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "brandName",
    direction: "asc",
  });
  const [filters, setFilters] = useState({
    industry: "",
    franchiseModel: "",
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      try {
        if (!user || !user.uid) {
          setBrands([]);
          setLoading(false);
          return;
        }

        const brandsCollection = collection(db, "brands");
        const q = query(
          brandsCollection,
          where("status", "==", "active"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const brandsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBrands(brandsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching brands:", err);
        setError("Failed to load your brands. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBrands();
    } else {
      setLoading(false);
      setError("Please log in to view your brands.");
    }
  }, [user]);

  const filterOptions = {
    industry: [
      ...new Set(brands.flatMap((brand) => brand.industries || [])),
    ].filter(Boolean),
    franchiseModel: [
      ...new Set(brands.map((brand) => brand.franchiseModel)),
    ].filter(Boolean),
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
      industry: "",
      franchiseModel: "",
    });
    setSearchTerm("");
  };

  const filteredBrands = brands
    .filter((brand) => {
      const matchesSearch = Object.values(brand).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );

      const matchesFilters =
        (!filters.industry ||
          (brand.industries && brand.industries.includes(filters.industry))) &&
        (!filters.franchiseModel ||
          brand.franchiseModel === filters.franchiseModel);

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

  const handleLearnMore = (brandId) => {
    navigate(`/dashboard/brand-details/${brandId}`);
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
          Loading your brands...
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
      {filteredBrands.map((brand) => (
        <Grid item xs={12} key={brand.id}>
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
                  src={brand.brandImage}
                  alt={brand.brandName}
                  sx={{ width: 40, height: 40, mr: 2 }}
                />
                <Typography variant="h6" fontWeight="bold">
                  {brand.brandName}
                </Typography>
              </Box>

              <Box sx={{ mb: 1 }}>
                {brand.industries?.map((industry, index) => (
                  <Chip
                    key={index}
                    label={industry}
                    size="small"
                    color="primary"
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>

              <Box sx={{ mb: 1 }}>
                <Typography variant="body2">
                  <strong>Model:</strong> {brand.franchiseModel}
                </Typography>
                <Typography variant="body2">
                  <strong>Investment:</strong> {brand.investmentRange}
                </Typography>
                <Typography variant="body2">
                  <strong>Fee:</strong> ${brand.initialFranchiseFee} |{" "}
                  {brand.royaltyFee}% Royalty
                </Typography>
              </Box>

              <Box sx={{ mb: 1 }}>
                <Typography variant="body2">
                  <LocationOn
                    sx={{ fontSize: 16, mr: 0.5, color: "primary.main" }}
                  />
                  {brand.brandContactInformation?.city},{" "}
                  {brand.brandContactInformation?.state}
                </Typography>
              </Box>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => handleLearnMore(brand.id)}
                size="small"
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderDesktopView = () => (
    <TableContainer component={Paper} elevation={3} sx={{ mt: 3 }}>
      <Table stickyHeader aria-label="brands table">
        <TableHead>
          <TableRow sx={{ bgcolor: "primary.light" }}>
            <SortableHeader label="Brand" sortKey="brandName" />
            <SortableHeader label="Industry" sortKey="industries" />
            <SortableHeader label="Model" sortKey="franchiseModel" />
            <SortableHeader label="Investment" sortKey="investmentRange" />
            <SortableHeader label="Fees" sortKey="initialFranchiseFee" />
            <SortableHeader
              label="Location"
              sortKey="brandContactInformation.city"
            />
            <TableCell sx={{ fontWeight: "bold", color: "primary.main" }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredBrands.map((brand) => (
            <TableRow
              key={brand.id}
              sx={{
                "&:nth-of-type(odd)": {
                  backgroundColor: "background.default",
                },
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              <TableCell>
                <Box display="flex" alignItems="center">
                  <Avatar
                    src={brand.brandImage}
                    alt={brand.brandName}
                    sx={{ width: 40, height: 40, mr: 2 }}
                  />
                  <Typography variant="subtitle1" fontWeight="medium">
                    {brand.brandName}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {brand.industries?.map((industry, index) => (
                    <Chip
                      key={index}
                      label={industry}
                      size="small"
                      color="primary"
                    />
                  ))}
                </Box>
              </TableCell>
              <TableCell>{brand.franchiseModel}</TableCell>
              <TableCell>{brand.investmentRange}</TableCell>
              <TableCell>
                <Box>
                  <Typography variant="body2">
                    <strong>Fee:</strong> ${brand.initialFranchiseFee}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Royalty:</strong> {brand.royaltyFee}%
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                {brand.brandContactInformation ? (
                  <Box display="flex" alignItems="center">
                    <LocationOn
                      sx={{ fontSize: 18, mr: 0.5, color: "primary.main" }}
                    />
                    {brand.brandContactInformation.city},{" "}
                    {brand.brandContactInformation.state}
                  </Box>
                ) : (
                  "N/A"
                )}
              </TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleLearnMore(brand.id)}
                >
                  Details
                </Button>
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
          My Registered Brands
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
          View and manage all your registered franchise brands
        </Typography>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {brands.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              You haven't registered any brands yet.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Start your journey by registering your first brand!
            </Typography>
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
                    placeholder="Search brands..."
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
                          <IconButton onClick={() => setSearchTerm("")}>
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
                    onClick={() => navigate("/dashboard/register-brand")}
                    sx={{
                      bgcolor: "primary.main",
                      "&:hover": { bgcolor: "primary.dark" },
                    }}
                  >
                    + Add New Brand
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
                    sx={{ minWidth: isMobile ? "100%" : 150 }}
                  >
                    <InputLabel>Industry</InputLabel>
                    <Select
                      value={filters.industry}
                      onChange={(e) =>
                        handleFilterChange("industry", e.target.value)
                      }
                      label="Industry"
                    >
                      <MenuItem value="">All Industries</MenuItem>
                      {filterOptions.industry.map((industry) => (
                        <MenuItem key={industry} value={industry}>
                          {industry}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl
                    size="small"
                    sx={{ minWidth: isMobile ? "100%" : 180 }}
                  >
                    <InputLabel>Franchise Model</InputLabel>
                    <Select
                      value={filters.franchiseModel}
                      onChange={(e) =>
                        handleFilterChange("franchiseModel", e.target.value)
                      }
                      label="Franchise Model"
                    >
                      <MenuItem value="">All Models</MenuItem>
                      {filterOptions.franchiseModel.map((model) => (
                        <MenuItem key={model} value={model}>
                          {model}
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
                  {filters.industry && (
                    <Chip
                      label={`Industry: ${filters.industry}`}
                      onDelete={() => handleFilterChange("industry", "")}
                      color="primary"
                      size="small"
                    />
                  )}
                  {filters.franchiseModel && (
                    <Chip
                      label={`Model: ${filters.franchiseModel}`}
                      onDelete={() => handleFilterChange("franchiseModel", "")}
                      color="secondary"
                      size="small"
                    />
                  )}
                </Box>
              )}
            </Paper>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" color="text.secondary">
                Showing {filteredBrands.length} of {brands.length} brands
              </Typography>
            </Box>

            {isMobile ? renderMobileView() : renderDesktopView()}
          </motion.div>
        )}
      </Container>
    </>
  );
};

export default Brands;
