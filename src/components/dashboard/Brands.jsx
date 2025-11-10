import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  Button,
  Paper,
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
  Alert,
  AlertTitle,
} from "@mui/material";
import { useBrands } from "../../hooks/useBrands";
import { useAuth } from "../../context/AuthContext";
import { useBrandViews } from "../../hooks/useBrandViews";
import BrandCardView from "./Brands/BrandCardView";
import BrandTableView from "./Brands/BrandTableView";
import { Search, FilterList, Clear } from "@mui/icons-material";

const franchiseModelOptions = [
  "Unit",
  "Multicity",
  "Dealer/Distributor",
  "Master Franchise",
];

const Brands = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Debug logging
  React.useEffect(() => {
    if (user) {
      console.log("Dashboard Brands - Current user UID:", user.uid);
      console.log("Dashboard Brands - Current user email:", user.email);
    }
  }, [user]);
  
  const { brands, loading, error } = useBrands(user);
  const {
    brandViews,
    loading: isViewsLoading,
    error: viewError,
  } = useBrandViews(user);
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

  const brandsWithViews = useMemo(() => {
    const viewsMap = new Map(
      brandViews.map((view) => [view.brandId, view.totalViews])
    );

    return brands.map((brand) => ({
      ...brand,
      totalViews: viewsMap.get(brand.id),
    }));
  }, [brands, brandViews]);

  const filterOptions = useMemo(() => {
    const industries = [
      ...new Set(brands.flatMap((brand) => brand.industries || [])),
    ].filter(Boolean);

    const usedFranchiseModels = [
      ...new Set(
        brands.flatMap((brand) =>
          Array.isArray(brand.franchiseModels)
            ? brand.franchiseModels
            : brand.franchiseModel
            ? [brand.franchiseModel]
            : []
        )
      ),
    ].filter(Boolean);

    return {
      industry: industries,
      franchiseModel: usedFranchiseModels,
    };
  }, [brands]);

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

  const filteredBrands = useMemo(() => {
    return brandsWithViews
      .filter((brand) => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          brand.brandName?.toLowerCase().includes(searchLower) ||
          brand.industries?.some((industry) =>
            industry.toLowerCase().includes(searchLower)
          ) ||
          brand.brandContactInformation?.city
            ?.toLowerCase()
            .includes(searchLower) ||
          brand.investmentRange?.toLowerCase().includes(searchLower) ||
          brand.totalViews?.toString().includes(searchLower);

        const matchesIndustry =
          !filters.industry ||
          (brand.industries && brand.industries.includes(filters.industry));

        const matchesFranchiseModel =
          !filters.franchiseModel ||
          (Array.isArray(brand.franchiseModels)
            ? brand.franchiseModels.includes(filters.franchiseModel)
            : brand.franchiseModel === filters.franchiseModel);

        return matchesSearch && matchesIndustry && matchesFranchiseModel;
      })
      .sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }

        // Ensure values are strings before comparing to avoid errors with null/undefined
        const valA = String(aValue || "");
        const valB = String(bValue || "");

        if (valA < valB) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
  }, [brandsWithViews, searchTerm, filters, sortConfig]);

  const handleLearnMore = (brandName) => {
    navigate(
      `/dashboard/brand-details/${brandName.replace(/\s+/g, "-").toLowerCase()}`
    );
  };

  if (loading || isViewsLoading) {
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

  if (error || viewError) {
    return (
      <Container sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          {error || viewError}
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
        {/* Status Info Alert - Show if user has pending brands */}
        {brands.some(brand => brand.status === 'pending') && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <AlertTitle>Brand Approval Process</AlertTitle>
            Your newly registered brands are marked as <strong>Pending</strong> and are under review. 
            Once approved by our team, they will be marked as <strong>Active</strong> and visible to potential franchise partners.
          </Alert>
        )}

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
                      {franchiseModelOptions
                        .filter((model) =>
                          filterOptions.franchiseModel.includes(model)
                        )
                        .map((model) => (
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

            {isMobile ? (
              <BrandCardView
                brands={filteredBrands}
                onLearnMore={handleLearnMore}
              />
            ) : (
              <BrandTableView
                brands={filteredBrands}
                sortConfig={sortConfig}
                onSort={handleSort}
                onLearnMore={handleLearnMore}
              />
            )}
          </motion.div>
        )}
      </Container>
    </>
  );
};

export default Brands;
