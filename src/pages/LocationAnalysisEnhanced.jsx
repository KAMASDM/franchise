import React from 'react';
import { Box, Container, Typography, Paper, Button, Stack, Chip } from '@mui/material';
import { ArrowBack as ArrowBackIcon, AutoAwesome as AIIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import LocationFinderEnhanced from '../components/location/LocationFinder';
import { useAuth } from '../context/AuthContext';

const LocationAnalysisEnhanced = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header - Hidden on Mobile */}
      <Paper
        elevation={2}
        sx={{
          display: { xs: 'none', md: 'block' },
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
          <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/dashboard')}
                variant="outlined"
              >
                Back
              </Button>
              <Box>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="h5" fontWeight={700}>
                    Smart Location Finder
                  </Typography>
                  <Chip 
                    label="AI-POWERED" 
                    size="small" 
                    icon={<AIIcon />}
                    color="secondary"
                    sx={{ fontWeight: 700 }}
                  />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  AI-driven insights with advanced data visualization for optimal franchise locations
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Container>
      </Paper>

      {/* Location Finder Enhanced Component */}
      <LocationFinderEnhanced />
    </Box>
  );
};

export default LocationAnalysisEnhanced;
