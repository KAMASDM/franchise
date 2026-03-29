import React from "react";
import { Typography, Box, Card, CardContent, Button, Stack, Chip } from "@mui/material";
import { TravelExplore as LocationAnalysisIcon, ArrowForward as ArrowForwardIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Leads from "./Overview/Leads";
import Brands from "./Overview/Brands";
import Locations from "./Overview/Locations";

const Overview = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        Dashboard Overview
      </Typography>

      <Typography variant="body1" paragraph sx={{ mb: 3 }}>
        Welcome to your dashboard! Here you can manage your brands and view
        important information.
      </Typography>

      {/* Location Finder Promo Card */}
      <Card 
        sx={{ 
          mb: 4, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '50%',
            height: '100%',
            background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 0L30 60M0 30L60 30\' stroke=\'rgba(255,255,255,0.1)\' stroke-width=\'1\'/%3E%3C/svg%3E")',
            opacity: 0.3,
          }
        }}
      >
        <CardContent sx={{ position: 'relative', zIndex: 1 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center">
            <Box sx={{ 
              p: 2, 
              bgcolor: 'rgba(255,255,255,0.2)', 
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <LocationAnalysisIcon sx={{ fontSize: 48 }} />
            </Box>
            <Box flex={1}>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <Typography variant="h5" fontWeight={700}>
                  Smart Location Finder
                </Typography>
                <Chip 
                  label="NEW" 
                  size="small" 
                  sx={{ 
                    bgcolor: '#FFD700', 
                    color: '#000',
                    fontWeight: 700 
                  }} 
                />
              </Stack>
              <Typography variant="body1" sx={{ opacity: 0.95, mb: 2 }}>
                Find the perfect location for your next franchise using AI-powered analysis. 
                Get insights on customer reach, competition, amenities, and transport accessibility.
              </Typography>
              <Button 
                variant="contained" 
                size="large"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/location-analysis-enhanced')}
                sx={{ 
                  bgcolor: 'white', 
                  color: '#667eea',
                  fontWeight: 700,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                    transform: 'translateX(4px)',
                  },
                  transition: 'all 0.3s'
                }}
              >
                Launch AI-Powered Finder
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Leads />
      <Brands />
      <Locations />
    </Box>
  );
};

export default Overview;
