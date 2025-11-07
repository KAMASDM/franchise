import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Close, Share, Download, CheckCircle, Cancel } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getBrandUrl } from '../../utils/brandUtils';

/**
 * Brand Comparison Modal Component
 * Shows side-by-side comparison of selected brands
 */

const ComparisonRow = ({ label, values, type = 'text' }) => {
  const renderValue = (value) => {
    if (type === 'boolean') {
      return value ? (
        <CheckCircle color="success" />
      ) : (
        <Cancel color="error" />
      );
    }
    if (type === 'chip') {
      return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {Array.isArray(value) ? (
            value.map((item, i) => (
              <Chip key={i} label={item} size="small" />
            ))
          ) : (
            <Chip label={value || 'N/A'} size="small" />
          )}
        </Box>
      );
    }
    return value || 'N/A';
  };

  return (
    <TableRow>
      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', bgcolor: 'action.hover' }}>
        {label}
      </TableCell>
      {values.map((value, index) => (
        <TableCell key={index} align="center">
          {renderValue(value)}
        </TableCell>
      ))}
    </TableRow>
  );
};

const BrandComparisonModal = ({ open, onClose, brands, onRemove }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleBrandClick = (brand) => {
    navigate(getBrandUrl(brand));
    onClose();
  };

  const handleExport = () => {
    // TODO: Implement PDF export
    console.log('Export comparison');
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: 'Brand Comparison',
        text: `Compare ${brands.map(b => b.brandName).join(', ')}`,
      });
    }
  };

  if (!brands || brands.length === 0) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Compare Franchises</Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '200px', fontWeight: 'bold' }}>Features</TableCell>
                {brands.map((brand) => (
                  <TableCell key={brand.id} align="center">
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                      <Avatar
                        src={brand.brandLogo}
                        alt={brand.brandName}
                        sx={{ width: 60, height: 60, cursor: 'pointer' }}
                        onClick={() => handleBrandClick(brand)}
                      />
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 'bold', cursor: 'pointer' }}
                        onClick={() => handleBrandClick(brand)}
                      >
                        {brand.brandName}
                      </Typography>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => onRemove(brand.id)}
                      >
                        Remove
                      </Button>
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {/* Basic Info */}
              <ComparisonRow
                label="Industry"
                values={brands.map(b => b.industries?.[0] || 'N/A')}
              />
              
              <ComparisonRow
                label="Business Model"
                values={brands.map(b => b.businessModelType || 'N/A')}
                type="chip"
              />

              {/* Investment */}
              <ComparisonRow
                label="Investment Range"
                values={brands.map(b => b.franchiseDetails?.investmentRange || 'N/A')}
              />

              <ComparisonRow
                label="Franchise Fee"
                values={brands.map(b => b.franchiseDetails?.franchiseFee || 'N/A')}
              />

              <ComparisonRow
                label="Royalty"
                values={brands.map(b => b.franchiseDetails?.royalty || 'N/A')}
              />

              {/* Support */}
              <ComparisonRow
                label="Training Provided"
                values={brands.map(b => b.trainingAndSupport?.trainingProvided || false)}
                type="boolean"
              />

              <ComparisonRow
                label="Marketing Support"
                values={brands.map(b => b.trainingAndSupport?.marketingSupport || false)}
                type="boolean"
              />

              {/* Locations */}
              <ComparisonRow
                label="Available Locations"
                values={brands.map(b => b.brandFranchiseLocations?.length || 0)}
              />

              {/* Timeline */}
              <ComparisonRow
                label="Setup Time"
                values={brands.map(b => b.franchiseDetails?.setupTime || 'N/A')}
              />

              <ComparisonRow
                label="ROI Timeline"
                values={brands.map(b => b.franchiseDetails?.roiTimeline || 'N/A')}
              />

              {/* Space Requirements */}
              <ComparisonRow
                label="Space Required"
                values={brands.map(b => b.franchiseDetails?.spaceRequired || 'N/A')}
              />

              {/* Founded */}
              <ComparisonRow
                label="Founded Year"
                values={brands.map(b => b.foundedYear || 'N/A')}
              />
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 3, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Click on brand name or logo to view full details
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleExport} startIcon={<Download />}>
          Export as PDF
        </Button>
        <Button onClick={handleShare} startIcon={<Share />}>
          Share
        </Button>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BrandComparisonModal;
