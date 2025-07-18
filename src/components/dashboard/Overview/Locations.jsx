import { useBrands } from "../../../hooks/useBrands";
import { useAuth } from "../../../context/AuthContext";
import {
  Box,
  Typography,
  Avatar,
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
  Link,
} from "@mui/material";
import { LocationOn, Map as MapIcon, Phone } from "@mui/icons-material";

const Locations = () => {
  const { user } = useAuth();
  const { brands, loading, error } = useBrands(user);

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

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="rectangular" width="100%" height={400} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (allFranchiseLocations.length === 0 && !loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="textSecondary">
          No franchise locations found. Please add some.
        </Typography>
      </Box>
    );
  }

  return (
    <Card elevation={3} sx={{ mt: 3 }}>
      <CardHeader
        title="Your Franchise Locations"
        subheader={`Showing ${allFranchiseLocations.length} active franchise locations`}
        titleTypographyProps={{ variant: "h6", fontWeight: "bold" }}
      />
      <CardContent sx={{ p: 0 }}>
        <TableContainer>
          <Table stickyHeader aria-label="franchise locations table">
            <TableHead>
              <TableRow sx={{ bgcolor: "background.paper" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Brand Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Address</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>City</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>State</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Country</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Zip Code</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Map</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allFranchiseLocations.map((location, index) => (
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
      </CardContent>
    </Card>
  );
};

export default Locations;
