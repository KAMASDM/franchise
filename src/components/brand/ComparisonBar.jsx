import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Avatar,
  Chip,
  Slide,
  useTheme,
} from '@mui/material';
import { Close, CompareArrows } from '@mui/icons-material';
import { useComparison } from '../../hooks/useComparison';
import BrandComparisonModal from './BrandComparisonModal';

/**
 * Floating comparison bar that sticks to bottom of screen
 * Shows selected brands and triggers comparison modal
 */

const ComparisonBar = () => {
  const theme = useTheme();
  const { comparisonList, removeFromComparison, clearComparison, count } = useComparison();
  const [showModal, setShowModal] = useState(false);

  if (count === 0) {
    return null;
  }

  return (
    <>
      <Slide direction="up" in={count > 0}>
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1100,
            p: 2,
            backgroundColor: 'background.paper',
            borderTop: `3px solid ${theme.palette.primary.main}`,
          }}
        >
          <Box
            sx={{
              maxWidth: 1200,
              mx: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CompareArrows color="primary" />
              <Typography variant="subtitle1" fontWeight="bold">
                Compare ({count})
              </Typography>
            </Box>

            {/* Brand Avatars */}
            <Box sx={{ display: 'flex', gap: 1, flex: 1, overflow: 'auto' }}>
              {comparisonList.map((brand) => (
                <Chip
                  key={brand.id}
                  avatar={<Avatar src={brand.brandLogo} alt={brand.brandName} />}
                  label={brand.brandName}
                  onDelete={() => removeFromComparison(brand.id)}
                  sx={{ maxWidth: 200 }}
                />
              ))}
            </Box>

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={clearComparison}
              >
                Clear All
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={() => setShowModal(true)}
                disabled={count < 2}
              >
                Compare Now
              </Button>
            </Box>
          </Box>
        </Paper>
      </Slide>

      {/* Comparison Modal */}
      <BrandComparisonModal
        open={showModal}
        onClose={() => setShowModal(false)}
        brands={comparisonList}
        onRemove={removeFromComparison}
      />
    </>
  );
};

export default ComparisonBar;
