import { format } from "date-fns";
import { useLeads } from "../../../hooks/useLeads";
import { useAuth } from "../../../context/AuthContext";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Skeleton,
  Alert,
} from "@mui/material";
import {
  LocationOn,
  Phone,
  Email,
  CheckCircle,
  Pending,
  Schedule,
} from "@mui/icons-material";

const Leads = () => {
  const { user } = useAuth();
  const { leads, loading, error } = useLeads(user);

  const getStatusIcon = (status) => {
    switch (status) {
      case "new":
        return <CheckCircle color="success" />;
      case "pending":
        return <Pending color="warning" />;
      case "contacted":
        return <Schedule color="info" />;
      default:
        return null;
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return format(date, "MMM dd, yyyy hh:mm a");
  };

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

  if (leads.length === 0 && !loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="textSecondary">
          No leads found.
        </Typography>
      </Box>
    );
  }

  return (
    <Card elevation={3} sx={{ mt: 3 }}>
      <CardHeader
        title="Your Leads"
        subheader={`Showing ${leads.length} leads`}
        titleTypographyProps={{ variant: "h6", fontWeight: "bold" }}
      />
      <CardContent sx={{ p: 0 }}>
        <TableContainer>
          <Table stickyHeader aria-label="leads table">
            <TableHead>
              <TableRow sx={{ bgcolor: "background.paper" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Lead</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Brand</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Contact</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Location</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Budget</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Timeline</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Received</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leads.map((lead) => (
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
                            lead.status === "new"
                              ? "success.main"
                              : lead.status === "pending"
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
      </CardContent>
    </Card>
  );
};

export default Leads;
