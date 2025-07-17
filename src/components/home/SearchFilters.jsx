import React, { useState, useEffect } from "react";
import {
  TextField,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { Clear } from "@mui/icons-material";

const SearchFilters = ({
  onFilterChange,
  industries,
  investmentRanges,
  franchiseModels,
}) => {
  const [keyword, setKeyword] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedInvestmentRange, setSelectedInvestmentRange] = useState("");
  const [selectedFranchiseModel, setSelectedFranchiseModel] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      onFilterChange({
        keyword,
        industry: selectedIndustry,
        investmentRange: selectedInvestmentRange,
        franchiseModel: selectedFranchiseModel,
      });
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [
    keyword,
    selectedIndustry,
    selectedInvestmentRange,
    selectedFranchiseModel,
    onFilterChange,
  ]);

  const handleKeywordChange = (event) => {
    setKeyword(event.target.value);
  };

  const handleIndustryChange = (event) => {
    setSelectedIndustry(event.target.value);
  };

  const handleInvestmentRangeChange = (event) => {
    setSelectedInvestmentRange(event.target.value);
  };

  const handleFranchiseModelChange = (event) => {
    setSelectedFranchiseModel(event.target.value);
  };

  const handleClearFilters = () => {
    setKeyword("");
    setSelectedIndustry("");
    setSelectedInvestmentRange("");
    setSelectedFranchiseModel("");
    onFilterChange({
      keyword: "",
      industry: "",
      investmentRange: "",
      franchiseModel: "",
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Filter Brands
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Search by Keyword"
            variant="outlined"
            fullWidth
            value={keyword}
            onChange={handleKeywordChange}
            sx={{ borderRadius: 1 }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth variant="outlined" sx={{ borderRadius: 1 }}>
            <InputLabel>Industry</InputLabel>
            <Select
              value={selectedIndustry}
              onChange={handleIndustryChange}
              label="Industry"
            >
              <MenuItem value="">
                <em>All Industries</em>
              </MenuItem>
              {industries.map((industry) => (
                <MenuItem key={industry} value={industry}>
                  {industry}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth variant="outlined" sx={{ borderRadius: 1 }}>
            <InputLabel>Investment Range</InputLabel>
            <Select
              value={selectedInvestmentRange}
              onChange={handleInvestmentRangeChange}
              label="Investment Range"
            >
              <MenuItem value="">
                <em>All Ranges</em>
              </MenuItem>
              {investmentRanges.map((range) => (
                <MenuItem key={range} value={range}>
                  {range}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth variant="outlined" sx={{ borderRadius: 1 }}>
            <InputLabel>Franchise Model</InputLabel>
            <Select
              value={selectedFranchiseModel}
              onChange={handleFranchiseModelChange}
              label="Franchise Model"
            >
              <MenuItem value="">
                <em>All Models</em>
              </MenuItem>
              {franchiseModels.map((model) => (
                <MenuItem key={model} value={model}>
                  {model}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClearFilters}
            startIcon={<Clear />}
            sx={{ borderRadius: 25, px: 3, py: 1 }}
          >
            Clear Filters
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SearchFilters;
