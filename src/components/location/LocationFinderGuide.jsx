import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  TravelExplore as LocationIcon,
  People as PeopleIcon,
  Store as StoreIcon,
  DirectionsBus as TransportIcon,
  Restaurant as AmenitiesIcon,
  CheckCircle as CheckIcon,
  TrendingUp as TrendingIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';

const LocationFinderGuide = () => {
  const features = [
    {
      icon: <PeopleIcon />,
      title: 'Customer Reach Analysis',
      description: 'Analyzes population density, residential areas, and commercial zones',
      color: '#2196f3',
    },
    {
      icon: <StoreIcon />,
      title: 'Competition Mapping',
      description: 'Identifies competitors by industry type within search radius',
      color: '#f44336',
    },
    {
      icon: <AmenitiesIcon />,
      title: 'Amenities Score',
      description: 'Evaluates nearby restaurants, parking, banks, and facilities',
      color: '#ff9800',
    },
    {
      icon: <TransportIcon />,
      title: 'Transport Access',
      description: 'Measures proximity to bus stops and metro stations',
      color: '#4caf50',
    },
  ];

  const steps = [
    'Enter city or neighborhood name in search bar',
    'Click "Analyze" to process location data',
    'Review top 10 ranked locations on map',
    'Click markers or cards for detailed insights',
    'Adjust filters to customize scoring weights',
    'Select optimal location for your franchise',
  ];

  const sampleScores = [
    { location: 'Connaught Place, Delhi', overall: 9.2, rank: '🥇' },
    { location: 'MG Road, Bangalore', overall: 8.7, rank: '🥈' },
    { location: 'Bandra West, Mumbai', overall: 8.3, rank: '🥉' },
  ];

  return (
    <Box sx={{ p: 4, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4, bgcolor: 'primary.main', color: 'white' }}>
        <Stack direction="row" spacing={3} alignItems="center">
          <Avatar sx={{ width: 80, height: 80, bgcolor: 'white', color: 'primary.main' }}>
            <LocationIcon sx={{ fontSize: 48 }} />
          </Avatar>
          <Box>
            <Typography variant="h3" fontWeight={700} gutterBottom>
              Smart Franchise Location Finder
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Data-driven insights to find the perfect location for your franchise
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Key Features */}
      <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
        Key Features
      </Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-8px)' } }}>
              <CardContent>
                <Avatar sx={{ bgcolor: feature.color, mb: 2, width: 56, height: 56 }}>
                  {feature.icon}
                </Avatar>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* How It Works */}
      <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
        How It Works
      </Typography>
      <Paper elevation={2} sx={{ p: 4, mb: 6 }}>
        <List>
          {steps.map((step, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, fontSize: 14 }}>
                  {index + 1}
                </Avatar>
              </ListItemIcon>
              <ListItemText
                primary={step}
                primaryTypographyProps={{ variant: 'body1', fontWeight: 500 }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Sample Results */}
      <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
        Sample Analysis Results
      </Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {sampleScores.map((sample, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                  <Typography variant="h2">{sample.rank}</Typography>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {sample.location}
                    </Typography>
                    <Chip
                      label={`Overall Score: ${sample.overall}/10`}
                      color="success"
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      <PeopleIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                      Customer Reach
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {(sample.overall - 0.5).toFixed(1)}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      <StoreIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                      Competition
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {(sample.overall - 0.8).toFixed(1)}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      <AmenitiesIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                      Amenities
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {(sample.overall - 0.3).toFixed(1)}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      <TransportIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                      Transport
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {(sample.overall - 0.6).toFixed(1)}
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Benefits */}
      <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
        Why Use Location Finder?
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <TrendingIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Data-Driven Decisions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Make informed location choices based on real Google Maps data including footfall,
                competition, and infrastructure metrics rather than guesswork.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <FilterIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Customizable Analysis
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Adjust importance weights for different factors based on your specific business
                needs and industry requirements.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Setup Required */}
      <Paper elevation={2} sx={{ p: 4, mt: 6, bgcolor: 'info.main', color: 'white' }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          ⚙️ Setup Required
        </Typography>
        <Typography variant="body1" paragraph>
          To use the Location Finder, you need to set up a Google Maps API key:
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <CheckIcon sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Get API key from Google Cloud Console" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckIcon sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Enable Maps JavaScript API, Places API, and Geocoding API" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckIcon sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Add VITE_GOOGLE_MAPS_API_KEY to your .env file" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckIcon sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="See docs/LOCATION_FINDER_GUIDE.md for detailed instructions" />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default LocationFinderGuide;
