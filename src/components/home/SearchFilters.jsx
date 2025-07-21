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

  const handleClearFilters = () => {
    setKeyword("");
    setSelectedIndustry("");
    setSelectedInvestmentRange("");
    setSelectedFranchiseModel("");
  };

  const isAnyFilterActive =
    keyword !== "" ||
    selectedIndustry !== "" ||
    selectedInvestmentRange !== "" ||
    selectedFranchiseModel !== "";

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
            onChange={(e) => setKeyword(e.target.value)}
            sx={{ borderRadius: 1 }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth variant="outlined" sx={{ borderRadius: 1 }}>
            <InputLabel>Industry</InputLabel>
            <Select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              label="Industry"
            >
              <MenuItem value="">
                <em>All Industries</em>
              </MenuItem>
              {industries?.map((industry) => (
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
              onChange={(e) => setSelectedInvestmentRange(e.target.value)}
              label="Investment Range"
            >
              <MenuItem value="">
                <em>All Ranges</em>
              </MenuItem>
              {investmentRanges?.map((range) => (
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
              onChange={(e) => setSelectedFranchiseModel(e.target.value)}
              label="Franchise Model"
            >
              <MenuItem value="">
                <em>All Models</em>
              </MenuItem>
              {franchiseModels?.map((model) => (
                <MenuItem key={model} value={model}>
                  {model}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {isAnyFilterActive && (
          <Grid
            item
            xs={12}
            sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleClearFilters}
              startIcon={<Clear />}
            >
              Clear Filters
            </Button>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default SearchFilters;
