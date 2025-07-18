import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db } from "../firebase/firebase";
import BrandCard from "../components/brand/BrandCard";
import SearchFilters from "../components/home/SearchFilters";
import { collection, query, where, getDocs } from "firebase/firestore";
import {
  Container,
  Typography,
  Grid,
  CircularProgress,
  Box,
  useTheme,
} from "@mui/material";

const industries = [
  "Food & Beverage",
  "Retail",
  "Healthcare",
  "Education",
  "Fitness",
  "Beauty & Wellness",
  "Technology",
  "Automotive",
  "Real Estate",
  "Home Services",
  "Entertainment",
  "Travel & Hospitality",
  "Other",
];

const investmentRanges = [
  "Under ₹50K",
  "₹50K - ₹100K",
  "₹100K - ₹250K",
  "₹250K - ₹500K",
  "₹500K - ₹1M",
  "Over ₹1M",
];

const franchiseModels = [
  "Single-Unit Franchise",
  "Multi-Unit Development",
  "Area Development",
  "Master Franchise",
  "Conversion Franchise",
];

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
};

const Brands = () => {
  const theme = useTheme();
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      try {
        setLoading(true);
        const brandsCollection = collection(db, "brands");
        const q = query(brandsCollection, where("status", "==", "active"));
        const querySnapshot = await getDocs(q);
        const brandsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBrands(brandsData);
        setFilteredBrands(brandsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching brands:", err);
        setError("Failed to load brands. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const handleFilterChange = (filters) => {
    let tempBrands = [...brands];
    if (filters.keyword) {
      const lowercasedKeyword = filters.keyword.toLowerCase();
      tempBrands = tempBrands.filter(
        (brand) =>
          brand.brandName?.toLowerCase().includes(lowercasedKeyword) ||
          (brand.industries &&
            brand.industries.some((industry) =>
              industry.toLowerCase().includes(lowercasedKeyword)
            )) ||
          brand.businessModel?.toLowerCase().includes(lowercasedKeyword) ||
          brand.brandStory?.toLowerCase().includes(lowercasedKeyword)
      );
    }

    if (filters.industry) {
      tempBrands = tempBrands.filter(
        (brand) =>
          brand.industries && brand.industries.includes(filters.industry)
      );
    }

    if (filters.investmentRange) {
      tempBrands = tempBrands.filter(
        (brand) => brand.investmentRange === filters.investmentRange
      );
    }

    if (filters.franchiseModel) {
      tempBrands = tempBrands.filter(
        (brand) => brand.franchiseModel === filters.franchiseModel
      );
    }

    setFilteredBrands(tempBrands);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        background: `linear-gradient(to bottom, ${theme.palette.primary[50]}, ${theme.palette.background.paper} 50%, ${theme.palette.secondary[50]})`,
      }}
    >
      <Container maxWidth="xl" sx={{ py: { xs: 5, md: 10 } }}>
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <Typography
            component="h1"
            variant="h2"
            sx={{
              textAlign: "center",
              mb: 2,
              fontSize: { xs: "2.25rem", md: "3rem" },
            }}
          >
            Featured Franchise Opportunities
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              maxWidth: 800,
              mx: "auto",
              textAlign: "center",
              mb: { xs: 8, md: 10 },
            }}
          >
            Discover top-performing restaurant franchises with proven business
            models and strong support systems.
          </Typography>
        </motion.div>

        <SearchFilters
          onFilterChange={handleFilterChange}
          industries={industries}
          investmentRanges={investmentRanges}
          franchiseModels={franchiseModels}
        />

        <Grid container spacing={4} sx={{ mt: 4 }}>
          {filteredBrands.length > 0 ? (
            filteredBrands.map((brand) => (
              <Grid item key={brand.id} xs={12} sm={6} md={4}>
                <BrandCard brand={brand} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                No brands found matching your criteria.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default Brands;
