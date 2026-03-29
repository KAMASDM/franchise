import React from 'react';
import { Box, Container, Typography, Paper, Button, Stack } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import LocationFinder from '../components/location/LocationFinder';
import { useAuth } from '../context/AuthContext';

const LocationAnalysis = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <Paper
        elevation={2}
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          borderRadius: 0,
          py: 2,
          px: 3,
          bgcolor: 'background.paper',
        }}
      >
        <Container maxWidth="xl">
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={2}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/dashboard')}
                variant="outlined"
              >
                Back to Dashboard
              </Button>
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  Smart Franchise Location Finder
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Data-driven insights to find the perfect location for your franchise
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Container>
      </Paper>

      {/* Location Finder Component */}
      <LocationFinder />
    </Box>
  );
};

export default LocationAnalysis;
