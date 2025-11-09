import React from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { LocationOn, Sort, Visibility } from "@mui/icons-material";

const SortableHeader = ({ label, sortKey, sortConfig, onSort }) => (
  <TableCell
    sx={{
      fontWeight: "bold",
      color: "primary.main",
      cursor: "pointer",
    }}
    onClick={() => onSort(sortKey)}
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

const BrandTableView = ({ brands, sortConfig, onSort, onLearnMore }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      case 'draft':
        return 'default';
      default:
        return 'info';
    }
  };

  const getStatusLabel = (status) => {
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown';
  };

  return (
    <TableContainer component={Paper} elevation={3} sx={{ mt: 3 }}>
      <Table stickyHeader aria-label="brands table">
        <TableHead>
          <TableRow sx={{ bgcolor: "primary.light" }}>
            <SortableHeader
              label="Brand"
              sortKey="brandName"
              sortConfig={sortConfig}
              onSort={onSort}
            />
            <TableCell sx={{ fontWeight: "bold", color: "primary.main" }}>
              Status
            </TableCell>
            <SortableHeader
              label="Industry"
              sortKey="industries"
              sortConfig={sortConfig}
              onSort={onSort}
            />
            <SortableHeader
              label="Model"
              sortKey="franchiseModel"
              sortConfig={sortConfig}
              onSort={onSort}
            />
            <SortableHeader
              label="Investment"
              sortKey="investmentRange"
              sortConfig={sortConfig}
              onSort={onSort}
            />
            <TableCell sx={{ fontWeight: "bold", color: "primary.main" }}>
              Area Required
            </TableCell>
            <SortableHeader
              label="Fees"
              sortKey="initialFranchiseFee"
              sortConfig={sortConfig}
              onSort={onSort}
            />
            <SortableHeader
              label="Location"
              sortKey="brandContactInformation.city"
              sortConfig={sortConfig}
              onSort={onSort}
            />
            <SortableHeader
              label="Views"
              sortKey="totalViews"
              sortConfig={sortConfig}
              onSort={onSort}
            />
            <TableCell sx={{ fontWeight: "bold", color: "primary.main" }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {brands.map((brand) => (
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
                <Chip 
                  label={getStatusLabel(brand.status)} 
                  color={getStatusColor(brand.status)}
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
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
                {brand?.areaRequired?.min} - {brand?.areaRequired?.max}{" "}
                {brand?.areaRequired?.unit}
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="body2">
                    <strong>Fee:</strong> ₹{brand.initialFranchiseFee}
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
                <Box display="flex" alignItems="center">
                  <Visibility
                    sx={{ fontSize: 18, mr: 0.5, color: "primary.main" }}
                  />
                  {brand.totalViews}
                </Box>
              </TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => onLearnMore(brand.brandName)}
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
};

export default BrandTableView;
