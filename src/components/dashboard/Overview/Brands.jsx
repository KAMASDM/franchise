import { useNavigate } from "react-router-dom";
import { LocationOn, Visibility } from "@mui/icons-material";
import { useAuth } from "../../../context/AuthContext";
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
  Skeleton,
  Alert,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";
import { useBrands } from "../../../hooks/useBrands";
import { useBrandViews } from "../../../hooks/useBrandViews";

const Brands = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { brands, loading, error } = useBrands(user);
  const {
    brandViews,
    loading: isViewsLoading,
    error: viewError,
  } = useBrandViews(user);

  const brandViewsMap = brandViews.reduce((acc, view) => {
    acc[view.brandId] = view.totalViews || 0;
    return acc;
  }, {});

  const onLearnMore = (brandId) => {
    navigate(`/dashboard/brand-details/${brandId}`);
  };

  if (loading || isViewsLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="rectangular" width="100%" height={400} />
      </Box>
    );
  }

  if (error || viewError) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error || viewError}
      </Alert>
    );
  }

  if (brands.length === 0 && !loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="textSecondary">
          No brands found. Create your first brand to get started.
        </Typography>
      </Box>
    );
  }

  return (
    <Card elevation={3} sx={{ mt: 3 }}>
      <CardHeader
        title="Your Brands"
        subheader={`Showing ${brands.length} active brands`}
        titleTypographyProps={{ variant: "h6", fontWeight: "bold" }}
      />
      <CardContent sx={{ p: 0 }}>
        <TableContainer>
          <Table stickyHeader aria-label="brands table">
            <TableHead>
              <TableRow sx={{ bgcolor: "background.paper" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Brand</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Industries</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Model</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Investment</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Area Required</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Fees</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Location</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Views</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
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
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {brand.industries?.map((industry, index) => (
                        <Chip
                          key={index}
                          label={industry}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>{brand.franchiseModel || "N/A"}</TableCell>
                  <TableCell>{brand.investmentRange || "N/A"}</TableCell>
                  <TableCell>
                    {brand?.areaRequired?.min} - {brand?.areaRequired?.max}{" "}
                    {brand?.areaRequired?.unit}
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        <strong>Fee:</strong> ₹
                        {brand.initialFranchiseFee || "0"}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Royalty:</strong> {brand.royaltyFee || "0"}%
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
                      {brandViewsMap[brand.id]}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => onLearnMore(brand.id)}
                      sx={{ textTransform: "none" }}
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default Brands;
