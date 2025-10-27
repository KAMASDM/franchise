import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
  Phone,
  Search,
  FilterList,
  Sort,
  Clear,
  Email,
  CalendarToday,
  AttachMoney,
  Person,
  Business,
  CheckCircle,
  Pending,
  Schedule,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { format } from "date-fns";
import { useLeads } from "../../hooks/useLeads";

const Leads = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { leads, loading, error } = useLeads(user);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });
  const [filters, setFilters] = useState({
    status: "",
    budget: "",
    timeline: "",
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const filterOptions = {
    status: ["New", "Pending", "Contacted", "Converted", "Rejected"],
    budget: [
      "Under ₹50K",
      "₹50K - ₹100K",
      "₹100K - ₹250K",
      "₹250K - ₹500K",
      "₹500K - ₹1M",
      "Over ₹1M",
    ],
    timeline: [
      "As soon as possible",
      "Within 3 months",
      "Within 6 months",
      "Within 1 year",
      "Just exploring",
    ],
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
      status: "",
      budget: "",
      timeline: "",
    });
    setSearchTerm("");
  };

  const filteredLeads = leads
    .filter((lead) => {
      const matchesSearch =
        lead.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.brandFranchiseLocation?.city
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesFilters =
        (!filters.status || lead.status === filters.status) &&
        (!filters.budget || lead.budget === filters.budget) &&
        (!filters.timeline || lead.timeline === filters.timeline);

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

      const getStatusIcon = (status) => {
    switch (status) {
      case "New":
        return <CheckCircle color="success" />;
      case "Pending":
        return <Pending color="warning" />;
      case "Contacted":
        return <Schedule color="info" />;
      default:
        return null;
    }
  };  const formatDate = (date) => {
    if (!date) return "N/A";
    return format(date, "MMM dd, yyyy hh:mm a");
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
          Loading your leads...
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

  const SortableHeader = ({ label, sortKey, icon }) => (
    <TableCell
      sx={{
        fontWeight: "bold",
        color: "primary.main",
        cursor: "pointer",
      }}
      onClick={() => handleSort(sortKey)}
    >
      <Box display="flex" alignItems="center">
        {icon && React.cloneElement(icon, { sx: { mr: 1, fontSize: 18 } })}
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
      {filteredLeads.map((lead) => (
        <Grid item xs={12} key={lead.id}>
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
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="h6" fontWeight="bold">
                  {lead.firstName} {lead.lastName}
                </Typography>
                <Box display="flex" alignItems="center">
                  {getStatusIcon(lead.status)}
                  <Typography
                    variant="caption"
                    color={
                      lead.status === "New"
                        ? "success.main"
                        : lead.status === "Pending"
                        ? "warning.main"
                        : "text.secondary"
                    }
                    sx={{ ml: 0.5 }}
                  >
                    {lead.status}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" mb={1}>
                <Avatar
                  src={lead.brandImage}
                  alt={lead.brandName}
                  sx={{ width: 20, height: 20, mr: 2 }}
                />
                <Typography>{lead.brandName}</Typography>
              </Box>

              <Box display="flex" alignItems="center" mb={1}>
                <Email sx={{ fontSize: 18, mr: 1, color: "info.main" }} />
                <Link href={`mailto:${lead.email}`} underline="hover">
                  {lead.email}
                </Link>
              </Box>

              {lead.phone && (
                <Box display="flex" alignItems="center" mb={1}>
                  <Phone sx={{ fontSize: 18, mr: 1, color: "success.main" }} />
                  <Link href={`tel:${lead.phone}`} underline="hover">
                    {lead.phone}
                  </Link>
                </Box>
              )}

              {lead.brandFranchiseLocation && (
                <Box display="flex" alignItems="flex-start" mb={1}>
                  <LocationOn
                    sx={{ fontSize: 18, mr: 1, color: "error.main", mt: 0.5 }}
                  />
                  <Box>
                    <Typography variant="body2">
                      {lead.brandFranchiseLocation.address}
                    </Typography>
                    <Typography variant="body2">
                      {lead.brandFranchiseLocation.city},{" "}
                      {lead.brandFranchiseLocation.state},{" "}
                      {lead.brandFranchiseLocation.country}
                    </Typography>
                  </Box>
                </Box>
              )}

              <Box display="flex" justifyContent="space-between" mt={2}>
                <Box display="flex" alignItems="center">
                  <AttachMoney
                    sx={{ fontSize: 18, mr: 1, color: "success.dark" }}
                  />
                  <Typography variant="body2">{lead.budget}</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <CalendarToday
                    sx={{ fontSize: 18, mr: 1, color: "primary.main" }}
                  />
                  <Typography variant="body2">{lead.timeline}</Typography>
                </Box>
              </Box>

              <Typography variant="caption" color="text.secondary" mt={1}>
                Received: {formatDate(lead.createdAt)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderDesktopView = () => (
    <TableContainer component={Paper} elevation={3} sx={{ mt: 3 }}>
      <Table stickyHeader aria-label="leads table">
        <TableHead>
          <TableRow sx={{ bgcolor: "primary.light" }}>
            <SortableHeader
              label="Lead"
              sortKey="firstName"
              icon={<Person />}
            />
            <SortableHeader
              label="Brand"
              sortKey="brandName"
              icon={<Business />}
            />
            <SortableHeader label="Contact" sortKey="email" icon={<Email />} />
            <SortableHeader
              label="Location"
              sortKey="brandFranchiseLocation.city"
              icon={<LocationOn />}
            />
            <SortableHeader
              label="Budget"
              sortKey="budget"
              icon={<AttachMoney />}
            />
            <SortableHeader
              label="Timeline"
              sortKey="timeline"
              icon={<CalendarToday />}
            />
            <SortableHeader
              label="Status"
              sortKey="status"
              icon={<FilterList />}
            />
            <SortableHeader
              label="Received"
              sortKey="createdAt"
              icon={<CalendarToday />}
            />
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredLeads.map((lead) => (
            <TableRow
              key={lead.id}
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
                    sx={{
                      bgcolor: "primary.main",
                      width: 32,
                      height: 32,
                      mr: 2,
                    }}
                  >
                    {lead.firstName?.charAt(0)}
                    {lead.lastName?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography fontWeight="medium">
                      {lead.firstName} {lead.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {lead.experience}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Box display="flex" alignItems="center" mb={1}>
                  <Avatar
                    src={lead.brandImage}
                    alt={lead.brandName}
                    sx={{ width: 40, height: 40, mr: 2 }}
                  />
                  <Typography>{lead.brandName}</Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box display="flex" flexDirection="column">
                  <Box display="flex" alignItems="center">
                    <Email
                      fontSize="small"
                      sx={{ mr: 1, color: "info.main" }}
                    />
                    <Link
                      href={`mailto:${lead.email}`}
                      underline="hover"
                      color="inherit"
                    >
                      {lead.email}
                    </Link>
                  </Box>
                  {lead.phone && (
                    <Box display="flex" alignItems="center" mt={1}>
                      <Phone
                        fontSize="small"
                        sx={{ mr: 1, color: "success.main" }}
                      />
                      <Link
                        href={`tel:${lead.phone}`}
                        underline="hover"
                        color="inherit"
                      >
                        {lead.phone}
                      </Link>
                    </Box>
                  )}
                </Box>
              </TableCell>
              <TableCell>
                {lead.brandFranchiseLocation ? (
                  <Box>
                    <Typography variant="body2">
                      {lead.brandFranchiseLocation.city},{" "}
                      {lead.brandFranchiseLocation.state}
                    </Typography>
                    <Typography variant="body2">
                      {lead.brandFranchiseLocation.country}
                    </Typography>
                    {lead.brandFranchiseLocation.googleMapsURl && (
                      <Link
                        href={
                          lead.brandFranchiseLocation.googleMapsURl.startsWith(
                            "http"
                          )
                            ? lead.brandFranchiseLocation.googleMapsURl
                            : `https://${lead.brandFranchiseLocation.googleMapsURl}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="caption"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mt: 0.5,
                        }}
                      >
                        <LocationOn
                          fontSize="small"
                          sx={{ mr: 0.5, color: "error.main" }}
                        />
                        View Map
                      </Link>
                    )}
                  </Box>
                ) : (
                  "N/A"
                )}
              </TableCell>
              <TableCell>
                <Typography>{lead.budget}</Typography>
              </TableCell>
              <TableCell>
                <Typography>{lead.timeline}</Typography>
              </TableCell>
              <TableCell>
                <Box display="flex" alignItems="center">
                  {getStatusIcon(lead.status)}
                  <Typography
                    sx={{
                      ml: 1,
                      color:
                        lead.status === "New"
                          ? "success.main"
                          : lead.status === "Pending"
                          ? "warning.main"
                          : "inherit",
                    }}
                  >
                    {lead.status}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {formatDate(lead.createdAt)}
                </Typography>
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
          Franchise Leads
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
          Manage and track all your franchise inquiries in one place
        </Typography>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {leads.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No franchise leads yet.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Your leads will appear here when potential franchisees inquire
              about your brands.
            </Typography>
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
                <TextField
                  fullWidth={isMobile}
                  variant="outlined"
                  placeholder="Search leads..."
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
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={filters.status}
                      onChange={(e) =>
                        handleFilterChange("status", e.target.value)
                      }
                      label="Status"
                    >
                      <MenuItem value="">All Statuses</MenuItem>
                      {filterOptions.status.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl
                    size="small"
                    sx={{ minWidth: isMobile ? "100%" : 140 }}
                  >
                    <InputLabel>Budget</InputLabel>
                    <Select
                      value={filters.budget}
                      onChange={(e) =>
                        handleFilterChange("budget", e.target.value)
                      }
                      label="Budget"
                    >
                      <MenuItem value="">All Budgets</MenuItem>
                      {filterOptions.budget.map((budget) => (
                        <MenuItem key={budget} value={budget}>
                          {budget}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl
                    size="small"
                    sx={{ minWidth: isMobile ? "100%" : 160 }}
                  >
                    <InputLabel>Timeline</InputLabel>
                    <Select
                      value={filters.timeline}
                      onChange={(e) =>
                        handleFilterChange("timeline", e.target.value)
                      }
                      label="Timeline"
                    >
                      <MenuItem value="">All Timelines</MenuItem>
                      {filterOptions.timeline.map((timeline) => (
                        <MenuItem key={timeline} value={timeline}>
                          {timeline}
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
                  {filters.status && (
                    <Chip
                      label={`Status: ${filters.status}`}
                      onDelete={() => handleFilterChange("status", "")}
                      color="primary"
                      size="small"
                    />
                  )}
                  {filters.budget && (
                    <Chip
                      label={`Budget: ${filters.budget}`}
                      onDelete={() => handleFilterChange("budget", "")}
                      color="secondary"
                      size="small"
                    />
                  )}
                  {filters.timeline && (
                    <Chip
                      label={`Timeline: ${filters.timeline}`}
                      onDelete={() => handleFilterChange("timeline", "")}
                      color="info"
                      size="small"
                    />
                  )}
                </Box>
              )}
            </Paper>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" color="text.secondary">
                Showing {filteredLeads.length} of {leads.length} leads
              </Typography>
            </Box>

            {isMobile ? renderMobileView() : renderDesktopView()}
          </motion.div>
        )}
      </Container>
    </>
  );
};

export default Leads;
