import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Slider,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  Tooltip,
  Avatar,
  LinearProgress,
  Divider,
  Stack,
  InputAdornment,
  Autocomplete,
  ToggleButton,
  ToggleButtonGroup,
  Fab,
  Badge
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Search as SearchIcon,
  MyLocation as MyLocationIcon,
  Place as PlaceIcon,
  TrendingUp as TrendingUpIcon,
  Store as StoreIcon,
  DirectionsBus as TransportIcon,
  Restaurant as AmenitiesIcon,
  People as PeopleIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  Close as CloseIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Map as MapIcon,
  List as ListIcon,
  Analytics as AnalyticsIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useLoadScript } from '@react-google-maps/api';
import logger from '../../utils/logger';

const libraries = ['places', 'geometry'];

const LocationFinder = ({ businessType = '', industry = '' }) => {
  // Google Maps API
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [businessCategory, setBusinessCategory] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'
  const [filters, setFilters] = useState({
    radius: 5000, // meters
    minFootfall: 3,
    maxCompetition: 5,
    amenitiesWeight: 0.7,
    transportWeight: 0.8,
    populationWeight: 0.9,
  });
  const [suggestions, setSuggestions] = useState([]);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentAnalysisStep, setCurrentAnalysisStep] = useState('');
  const [showSelectedDetails, setShowSelectedDetails] = useState(false);

  // Business categories with Google Places types
  const businessCategories = [
    { label: 'Restaurant / Cafe', types: ['restaurant', 'cafe', 'bakery'], icon: '🍽️' },
    { label: 'Fast Food', types: ['meal_takeaway', 'fast_food'], icon: '🍔' },
    { label: 'Retail Store', types: ['store', 'clothing_store', 'shoe_store'], icon: '🛍️' },
    { label: 'Grocery / Supermarket', types: ['supermarket', 'grocery_or_supermarket'], icon: '🛒' },
    { label: 'Gym / Fitness Center', types: ['gym', 'health'], icon: '💪' },
    { label: 'Salon / Spa', types: ['beauty_salon', 'spa', 'hair_care'], icon: '💇' },
    { label: 'Pharmacy / Medical', types: ['pharmacy', 'drugstore', 'health'], icon: '⚕️' },
    { label: 'Electronics Store', types: ['electronics_store', 'home_goods_store'], icon: '📱' },
    { label: 'Jewelry Store', types: ['jewelry_store'], icon: '💎' },
    { label: 'Book Store', types: ['book_store'], icon: '📚' },
    { label: 'Pet Store', types: ['pet_store'], icon: '🐾' },
    { label: 'Laundry / Dry Cleaning', types: ['laundry'], icon: '👔' },
    { label: 'Automobile Service', types: ['car_repair', 'car_wash'], icon: '🚗' },
    { label: 'Education / Coaching', types: ['school', 'university'], icon: '🎓' },
    { label: 'Hotel / Lodging', types: ['lodging', 'hotel'], icon: '🏨' },
    { label: 'Entertainment / Gaming', types: ['movie_theater', 'bowling_alley'], icon: '🎮' },
  ];

  // Refs
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const autocompleteServiceRef = useRef(null);

  // Initialize map
  useEffect(() => {
    if (isLoaded && mapRef.current && !mapInstanceRef.current) {
      const defaultCenter = { lat: 28.6139, lng: 77.2090 }; // Delhi
      
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: currentLocation || defaultCenter,
        zoom: 12,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          {
            featureType: 'poi.business',
            stylers: [{ visibility: 'off' }],
          },
        ],
      });

      autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();

      // Get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setCurrentLocation(pos);
            mapInstanceRef.current.setCenter(pos);
          },
          () => {
            logger.log('Geolocation service failed, using default location');
          }
        );
      }
    }
  }, [isLoaded, currentLocation]);

  // Autocomplete search suggestions
  const handleSearchChange = useCallback((event, value) => {
    setSearchQuery(value);
    
    if (value.length > 2 && autocompleteServiceRef.current) {
      autocompleteServiceRef.current.getPlacePredictions(
        {
          input: value,
          componentRestrictions: { country: 'in' },
        },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setSuggestions(predictions || []);
          }
        }
      );
    } else {
      setSuggestions([]);
    }
  }, []);

  // Reverse geocode a {lat, lng} point to a human-readable area name
  const reverseGeocode = useCallback((location) => {
    return new Promise((resolve) => {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location }, (results, status) => {
        if (status === 'OK' && results.length > 0) {
          // Prefer neighbourhood > sublocality > locality
          const priority = ['neighborhood', 'sublocality_level_1', 'sublocality', 'locality', 'administrative_area_level_2'];
          for (const type of priority) {
            const component = results[0].address_components.find(c => c.types.includes(type));
            if (component) {
              resolve(component.long_name);
              return;
            }
          }
          // Fallback: first word of formatted address
          resolve(results[0].formatted_address.split(',')[0]);
        } else {
          resolve(null);
        }
      });
    });
  }, []);

  // Analyze location scoring
  const analyzeLocation = useCallback(async (location) => {
    const placesService = new window.google.maps.places.PlacesService(mapInstanceRef.current);
    
    const scores = {
      customerReach: 0,
      competition: 0,
      amenities: 0,
      transport: 0,
      overall: 0,
    };

    try {
      // 1. Customer Reach Analysis (Population density estimate)
      const nearbySearch = (request) => {
        return new Promise((resolve) => {
          placesService.nearbySearch(request, (results, status) => {
            resolve(status === window.google.maps.places.PlacesServiceStatus.OK ? results : []);
          });
        });
      };

      // Analyze footfall indicators
      const residentialAreas = await nearbySearch({
        location,
        radius: filters.radius,
        type: 'neighborhood',
      });

      const commercialAreas = await nearbySearch({
        location,
        radius: filters.radius,
        type: 'shopping_mall',
      });

      // Customer reach score (0-10)
      scores.customerReach = Math.min(10, 
        (residentialAreas.length * 0.3 + commercialAreas.length * 0.7) / 2
      );

      // 2. Competition Analysis - Use selected business category
      let competitorTypes = ['store'];
      if (businessCategory) {
        const selectedCategory = businessCategories.find(cat => cat.label === businessCategory);
        if (selectedCategory) {
          competitorTypes = selectedCategory.types;
        }
      } else if (industry) {
        const industryMap = {
          'Food & Beverage': ['restaurant', 'cafe', 'bar'],
          'Retail': ['clothing_store', 'shoe_store', 'store'],
          'Health & Fitness': ['gym', 'spa'],
          'Education': ['school', 'university'],
        };
        competitorTypes = industryMap[industry] || ['store'];
      }

      // Search for all competitor types
      let allCompetitors = [];
      for (const type of competitorTypes) {
        const typeCompetitors = await nearbySearch({
          location,
          radius: filters.radius,
          type: type,
        });
        allCompetitors = [...allCompetitors, ...typeCompetitors];
      }
      
      // Remove duplicates based on place_id
      const competitors = allCompetitors.filter((competitor, index, self) =>
        index === self.findIndex((c) => c.place_id === competitor.place_id)
      );

      // Competition score (inverse - fewer competitors is better)
      scores.competition = Math.max(0, 10 - (competitors.length * 0.5));

      // 3. Amenities Score
      const restaurants = await nearbySearch({
        location,
        radius: 1000,
        type: 'restaurant',
      });

      const parking = await nearbySearch({
        location,
        radius: 500,
        type: 'parking',
      });

      const banks = await nearbySearch({
        location,
        radius: 1000,
        type: 'bank',
      });

      scores.amenities = Math.min(10,
        (restaurants.length * 0.4 + parking.length * 0.4 + banks.length * 0.2) / 3
      );

      // 4. Transport Accessibility
      const busStops = await nearbySearch({
        location,
        radius: 500,
        type: 'bus_station',
      });

      const metroStations = await nearbySearch({
        location,
        radius: 1000,
        type: 'subway_station',
      });

      scores.transport = Math.min(10,
        (busStops.length * 0.4 + metroStations.length * 0.6) / 2
      );

      // Calculate weighted overall score
      scores.overall = (
        scores.customerReach * filters.populationWeight +
        scores.competition * 0.5 +
        scores.amenities * filters.amenitiesWeight +
        scores.transport * filters.transportWeight
      ) / (filters.populationWeight + 0.5 + filters.amenitiesWeight + filters.transportWeight);

      // Generate insights based on scores
      const insights = {
        customerReach: getCustomerReachInsight(scores.customerReach, residentialAreas.length, commercialAreas.length),
        competition: getCompetitionInsight(scores.competition, competitors.length),
        amenities: getAmenitiesInsight(scores.amenities, restaurants.length, parking.length, banks.length),
        transport: getTransportInsight(scores.transport, busStops.length, metroStations.length),
        overall: getOverallInsight(scores.overall)
      };

      return {
        location,
        name: await reverseGeocode(location),
        scores,
        insights,
        competitors: competitors.length,
        nearbyAmenities: restaurants.length + parking.length + banks.length,
        transportOptions: busStops.length + metroStations.length,
        detailedStats: {
          residential: residentialAreas.length,
          commercial: commercialAreas.length,
          restaurants: restaurants.length,
          parking: parking.length,
          banks: banks.length,
          busStops: busStops.length,
          metroStations: metroStations.length,
        }
      };

    } catch (error) {
      logger.error('Error analyzing location:', error);
      return null;
    }
  }, [filters, industry]);

  // Search and analyze locations
  const handleSearch = useCallback(async () => {
    if (!searchQuery || !isLoaded) return;

    setLoading(true);
    setLocations([]);
    setAnalysisProgress(0);
    setCurrentAnalysisStep('Initializing search...');

    try {
      const geocoder = new window.google.maps.Geocoder();

      setCurrentAnalysisStep('Finding location coordinates...');
      setAnalysisProgress(10);

      // Wrap callback-based geocoder in a Promise so loading state persists correctly
      const geocodeResult = await new Promise((resolve) => {
        geocoder.geocode({ address: searchQuery + ', India' }, (results, status) => {
          resolve({ results, status });
        });
      });

      const { results, status } = geocodeResult;

      if (status === 'OK' && results[0]) {
        const searchCenter = results[0].geometry.location;
        mapInstanceRef.current.setCenter(searchCenter);

        setCurrentAnalysisStep('Generating analysis grid...');
        setAnalysisProgress(20);

        // Generate grid of points to analyze
        const points = generateSearchGrid(searchCenter, filters.radius, 9);

        setCurrentAnalysisStep('Analyzing locations...');

        // Analyze each point with progress updates
        const analyzedLocations = [];
        for (let i = 0; i < points.length; i++) {
          setCurrentAnalysisStep(`Analyzing location ${i + 1} of ${points.length}...`);
          setAnalysisProgress(20 + ((i / points.length) * 70));

          const analysis = await analyzeLocation(points[i]);
          if (analysis) {
            analyzedLocations.push(analysis);
          }
        }

        setCurrentAnalysisStep('Ranking locations...');
        setAnalysisProgress(95);

        // Sort by overall score
        analyzedLocations.sort((a, b) => b.scores.overall - a.scores.overall);

        setCurrentAnalysisStep('Finalizing results...');
        setAnalysisProgress(100);

        setLocations(analyzedLocations);
        updateMapMarkers(analyzedLocations);

        if (analyzedLocations.length > 0) {
          setSelectedLocation(analyzedLocations[0]);
          setDrawerOpen(true);
        }
      } else {
        setCurrentAnalysisStep('Location not found. Try a different search term.');
      }
    } catch (error) {
      logger.error('Search error:', error);
      setCurrentAnalysisStep('Error occurred during analysis');
    } finally {
      setLoading(false);
      setTimeout(() => {
        setAnalysisProgress(0);
        setCurrentAnalysisStep('');
      }, 1000);
    }
  }, [searchQuery, isLoaded, filters, analyzeLocation]);

  // Generate grid of points around center
  const generateSearchGrid = (center, radius, count) => {
    const points = [];
    const gridSize = Math.ceil(Math.sqrt(count));
    const step = (radius * 2) / (gridSize - 1);
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (points.length >= count) break;
        
        const offsetLat = (i - gridSize / 2) * (step / 111000); // meters to degrees
        const offsetLng = (j - gridSize / 2) * (step / (111000 * Math.cos(center.lat() * Math.PI / 180)));
        
        points.push({
          lat: center.lat() + offsetLat,
          lng: center.lng() + offsetLng,
        });
      }
    }
    
    return points;
  };

  // Update map markers
  const updateMapMarkers = useCallback((locations) => {
    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add new markers
    locations.forEach((loc, index) => {
      const score = loc.scores.overall;
      const color = score >= 7 ? '#4caf50' : score >= 5 ? '#ff9800' : '#f44336';
      
      const marker = new window.google.maps.Marker({
        position: loc.location,
        map: mapInstanceRef.current,
        label: {
          text: (index + 1).toString(),
          color: 'white',
          fontWeight: 'bold',
        },
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 15,
          fillColor: color,
          fillOpacity: 0.9,
          strokeColor: 'white',
          strokeWeight: 2,
        },
      });

      marker.addListener('click', () => {
        setSelectedLocation(loc);
      });

      markersRef.current.push(marker);
    });
  }, []);

  // Get score color
  const getScoreColor = (score) => {
    if (score >= 7) return '#4caf50';
    if (score >= 5) return '#ff9800';
    return '#f44336';
  };

  // Get rank badge
  const getRankBadge = (index) => {
    if (index === 0) return { color: '#FFD700', icon: '🥇' };
    if (index === 1) return { color: '#C0C0C0', icon: '🥈' };
    if (index === 2) return { color: '#CD7F32', icon: '🥉' };
    return { color: '#757575', icon: `#${index + 1}` };
  };

  // Insight generation functions
  const getCustomerReachInsight = (score, residential, commercial) => {
    if (score >= 8) return `Excellent footfall potential with ${residential} residential and ${commercial} commercial areas nearby. High customer density expected.`;
    if (score >= 6) return `Good customer reach with ${residential} residential and ${commercial} commercial zones. Moderate to high footfall.`;
    if (score >= 4) return `Average population density with ${residential} residential areas. Consider marketing efforts to attract customers.`;
    return `Low footfall area with limited residential zones. May require strong brand presence to succeed.`;
  };

  const getCompetitionInsight = (score, competitors) => {
    const categoryName = businessCategory || 'similar';
    if (competitors >= 15) return `⚠️ VERY HIGH COMPETITION: ${competitors} ${categoryName} businesses found! This location is heavily saturated. Strong brand differentiation and marketing budget essential.`;
    if (competitors >= 10) return `⚠️ HIGH COMPETITION: ${competitors} ${categoryName} businesses nearby. Market is crowded - ensure you have unique value proposition.`;
    if (score >= 8) return `✅ Low competition (${competitors} competitors). Excellent opportunity for market entry with good growth potential.`;
    if (score >= 6) return `Moderate competition with ${competitors} similar businesses. Room for differentiation with right strategy.`;
    if (score >= 4) return `Competitive market with ${competitors} existing players. Strong unique value proposition and marketing needed.`;
    return `Saturated market (${competitors}+ competitors). High risk - consider alternative locations or highly differentiated offering.`;
  };

  const getAmenitiesInsight = (score, restaurants, parking, banks) => {
    if (score >= 8) return `Excellent infrastructure with ${restaurants} restaurants, ${parking} parking spots, and ${banks} banks nearby. Customer convenience assured.`;
    if (score >= 6) return `Good amenities available including ${restaurants} dining options and ${parking} parking facilities.`;
    if (score >= 4) return `Basic amenities present. Some facilities like parking (${parking}) may need attention.`;
    return `Limited amenities in the area. May require additional investment in customer facilities.`;
  };

  const getTransportInsight = (score, busStops, metroStations) => {
    if (score >= 8) return `Excellent connectivity with ${metroStations} metro stations and ${busStops} bus stops. Easy accessibility for customers.`;
    if (score >= 6) return `Good public transport with ${busStops} bus stops nearby. Accessible for most customers.`;
    if (score >= 4) return `Moderate transport options available. Consider customer parking arrangements.`;
    return `Limited public transport. Target customers with personal vehicles or improve connectivity.`;
  };

  const getOverallInsight = (score) => {
    if (score >= 8.5) return `🌟 Prime Location: Exceptional potential across all metrics. Highly recommended for franchise expansion.`;
    if (score >= 7) return `✅ Strong Location: Very good fundamentals. Excellent choice with minor considerations.`;
    if (score >= 5.5) return `⚠️ Moderate Location: Decent potential but requires strategic planning in weaker areas.`;
    return `❌ Challenging Location: Multiple concerns. Explore alternatives or prepare for significant market development.`;
  };

  if (loadError) {
    return <Alert severity="error">Error loading Google Maps. Please check your API key.</Alert>;
  }

  if (!isLoaded) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', width: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* Map Container */}
      <Box ref={mapRef} sx={{ width: '100%', height: '100%' }} />

      {/* Floating Search Bar */}
      <Paper
        elevation={8}
        sx={{
          position: 'absolute',
          top: { xs: 10, sm: 20 },
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          p: { xs: 1.5, sm: 2 },
          width: { xs: '95%', sm: 600 },
          borderRadius: { xs: 2, sm: 3 },
        }}
      >
        <Stack spacing={{ xs: 1.5, sm: 2 }}>
          {/* Business Category Selector */}
          <Autocomplete
            value={businessCategory}
            onChange={(e, newValue) => setBusinessCategory(newValue)}
            options={businessCategories.map(cat => cat.label)}
            renderOption={(props, option) => {
              const category = businessCategories.find(cat => cat.label === option);
              return (
                <li {...props}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography>{category.icon}</Typography>
                    <Typography>{option}</Typography>
                  </Stack>
                </li>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select your business category *"
                variant="outlined"
                size="small"
                required
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <StoreIcon />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          {/* Location Search */}
          <Stack direction="row" spacing={{ xs: 1, sm: 2 }} alignItems="center">
            <Autocomplete
              freeSolo
              fullWidth
              options={suggestions}
              getOptionLabel={(option) => option.description || option}
              onInputChange={handleSearchChange}
              onChange={(e, value) => {
                if (value?.description) {
                  setSearchQuery(value.description);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search city or area..."
                  variant="outlined"
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={loading || !searchQuery || !businessCategory}
              startIcon={loading ? <CircularProgress size={16} /> : <AnalyticsIcon />}
              sx={{ 
                minWidth: { xs: 90, sm: 120 }, 
                height: { xs: 40, sm: 40 },
                fontSize: { xs: '0.8rem', sm: '0.875rem' }
              }}
            >
              {loading ? 'Analyzing' : 'Analyze'}
            </Button>
            <IconButton
              color="primary"
              size="small"
              sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
              onClick={() => {
                if (currentLocation) {
                  mapInstanceRef.current.setCenter(currentLocation);
                }
              }}
            >
              <MyLocationIcon />
            </IconButton>
          </Stack>
        </Stack>

        {/* Inline status strip — visible while system is working */}
        {(loading || currentAnalysisStep) && (
          <Box sx={{ px: 1, pb: 0.5 }}>
            <Stack direction="row" spacing={1} alignItems="center" mb={0.75}>
              {loading && <CircularProgress size={14} thickness={5} />}
              <Typography variant="caption" color="primary" fontWeight={600} noWrap sx={{ flex: 1 }}>
                {currentAnalysisStep || 'Preparing analysis…'}
              </Typography>
              {loading && (
                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                  {analysisProgress.toFixed(0)}%
                </Typography>
              )}
            </Stack>
            {loading && (
              <LinearProgress
                variant="determinate"
                value={analysisProgress}
                sx={{ height: 4, borderRadius: 2 }}
              />
            )}
          </Box>
        )}
      </Paper>

      {/* Progress Indicator - Enhanced Full Screen Overlay */}
      {loading && (
        <>
          {/* Backdrop */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: alpha('#000', 0.4),
              backdropFilter: 'blur(4px)',
              zIndex: 1500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Paper
              elevation={24}
              sx={{
                p: { xs: 3, sm: 4 },
                width: { xs: '85%', sm: 500 },
                maxWidth: 500,
                borderRadius: 4,
                textAlign: 'center',
              }}
            >
              <Stack spacing={3} alignItems="center">
                {/* Animated Icon */}
                <Box
                  sx={{
                    position: 'relative',
                    width: 80,
                    height: 80,
                  }}
                >
                  <CircularProgress 
                    size={80} 
                    thickness={4}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      color: 'primary.main',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      fontSize: 40,
                    }}
                  >
                    🎯
                  </Box>
                </Box>

                {/* Main Message */}
                <Box>
                  <Typography 
                    variant="h5" 
                    fontWeight={700}
                    gutterBottom
                    sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
                  >
                    Sit Tight! 🔍
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="primary"
                    fontWeight={600}
                    sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                  >
                    We're finding the best locations for you
                  </Typography>
                </Box>

                {/* Progress Details */}
                <Box sx={{ width: '100%' }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" fontWeight={600} color="text.secondary">
                      {currentAnalysisStep || 'Analyzing locations...'}
                    </Typography>
                    <Chip 
                      label={`${analysisProgress.toFixed(0)}%`}
                      size="small"
                      color="primary"
                      sx={{ fontWeight: 700 }}
                    />
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
                    value={analysisProgress} 
                    sx={{ 
                      height: 10, 
                      borderRadius: 2,
                      bgcolor: alpha('#000', 0.08),
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 2,
                      }
                    }}
                  />
                </Box>

                {/* Analysis Details */}
                <Stack spacing={1} sx={{ width: '100%' }}>
                  <Typography variant="caption" color="text.secondary" textAlign="center">
                    Analyzing factors:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
                    <Chip label="👥 Customer Reach" size="small" variant="outlined" />
                    <Chip label="🏪 Competition" size="small" variant="outlined" />
                    <Chip label="🏥 Amenities" size="small" variant="outlined" />
                    <Chip label="🚇 Transport" size="small" variant="outlined" />
                  </Box>
                </Stack>

                {/* Fun Tip */}
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ 
                    fontStyle: 'italic',
                    px: 2,
                    fontSize: { xs: '0.7rem', sm: '0.75rem' }
                  }}
                >
                  💡 This usually takes 10-15 seconds. We're analyzing multiple data points for accurate results!
                </Typography>
              </Stack>
            </Paper>
          </Box>
        </>
      )}

      {/* View Mode Toggle */}
      <Paper
        elevation={4}
        sx={{
          position: 'absolute',
          top: 100,
          right: 20,
          zIndex: 1000,
          borderRadius: 2,
        }}
      >
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(e, newMode) => newMode && setViewMode(newMode)}
          size="small"
        >
          <ToggleButton value="map">
            <MapIcon />
          </ToggleButton>
          <ToggleButton value="list">
            <ListIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Paper>

      {/* Filter FAB - Only show when no results */}
      {locations.length === 0 && (
        <Tooltip title="Analysis Filters" placement="left">
          <Fab
            color="primary"
            sx={{ position: 'absolute', bottom: 20, right: 20, zIndex: 1000 }}
            onClick={() => setDrawerOpen(!drawerOpen)}
          >
            <FilterIcon />
          </Fab>
        </Tooltip>
      )}
      
      {/* Results FAB - Only show when results exist and drawer is closed */}
      {locations.length > 0 && !drawerOpen && (
        <Tooltip title="View All Locations" placement="left">
          <Fab
            color="success"
            sx={{ 
              position: 'absolute', 
              bottom: { xs: 90, sm: 20 }, 
              right: 20, 
              zIndex: 1100,
              boxShadow: 6,
            }}
            onClick={() => {
              setDrawerOpen(true);
              setShowSelectedDetails(false);
            }}
          >
            <Badge badgeContent={locations.length} color="error" max={99}>
              <ListIcon />
            </Badge>
          </Fab>
        </Tooltip>
      )}

      {/* Results Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen && locations.length > 0}
        onClose={() => setDrawerOpen(false)}
        variant="temporary"
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 420, md: 480 },
            p: { xs: 2, sm: 3 },
            pt: { xs: 8, sm: 10 },
            maxHeight: '100vh',
            overflow: 'auto',
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            Top Locations
          </Typography>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Adjust Filters">
              <IconButton 
                onClick={() => {
                  setDrawerOpen(false);
                  setTimeout(() => {
                    setLocations([]);
                    setDrawerOpen(true);
                  }, 300);
                }} 
                size="small"
                color="primary"
              >
                <FilterIcon />
              </IconButton>
            </Tooltip>
            <IconButton onClick={() => setDrawerOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Stack>
        </Box>

        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip 
            size="small" 
            label={`Radius: ${filters.radius}m`} 
            icon={<LocationIcon />}
          />
          <Chip 
            size="small" 
            label={`${locations.length} locations`}
          />
        </Stack>

        <List sx={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
          {locations.slice(0, 10).map((loc, index) => {
            const rankBadge = getRankBadge(index);
            const isSelected = selectedLocation === loc;

            return (
              <Card
                key={index}
                sx={{
                  mb: 2,
                  cursor: 'pointer',
                  border: isSelected ? 2 : 0,
                  borderColor: 'primary.main',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4,
                  },
                }}
                onClick={() => {
                  setSelectedLocation(loc);
                  setShowSelectedDetails(true);
                  setDrawerOpen(false);
                  mapInstanceRef.current.setCenter(loc.location);
                  mapInstanceRef.current.setZoom(15);
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                    <Avatar sx={{ bgcolor: rankBadge.color, width: 40, height: 40 }}>
                      {rankBadge.icon}
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="h6" fontWeight={600}>
                        {loc.name || `Location ${index + 1}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {loc.location.lat.toFixed(4)}, {loc.location.lng.toFixed(4)}
                      </Typography>
                    </Box>
                    <Chip
                      label={`${loc.scores.overall.toFixed(1)}/10`}
                      size="small"
                      sx={{
                        bgcolor: getScoreColor(loc.scores.overall),
                        color: 'white',
                        fontWeight: 700,
                      }}
                    />
                  </Stack>

                  <Stack spacing={1}>
                    <Box>
                      <Stack direction="row" justifyContent="space-between" mb={0.5}>
                        <Typography variant="caption" color="text.secondary">
                          <PeopleIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                          Customer Reach
                        </Typography>
                        <Typography variant="caption" fontWeight={600}>
                          {loc.scores.customerReach.toFixed(1)}
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={loc.scores.customerReach * 10}
                        sx={{
                          height: 6,
                          borderRadius: 1,
                          bgcolor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: getScoreColor(loc.scores.customerReach),
                          },
                        }}
                      />
                    </Box>

                    <Box>
                      <Stack direction="row" justifyContent="space-between" mb={0.5}>
                        <Typography variant="caption" color="text.secondary">
                          <StoreIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                          Competition
                        </Typography>
                        <Typography variant="caption" fontWeight={600}>
                          {loc.scores.competition.toFixed(1)}
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={loc.scores.competition * 10}
                        sx={{
                          height: 6,
                          borderRadius: 1,
                          bgcolor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: getScoreColor(loc.scores.competition),
                          },
                        }}
                      />
                    </Box>

                    <Box>
                      <Stack direction="row" justifyContent="space-between" mb={0.5}>
                        <Typography variant="caption" color="text.secondary">
                          <AmenitiesIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                          Amenities
                        </Typography>
                        <Typography variant="caption" fontWeight={600}>
                          {loc.scores.amenities.toFixed(1)}
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={loc.scores.amenities * 10}
                        sx={{
                          height: 6,
                          borderRadius: 1,
                          bgcolor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: getScoreColor(loc.scores.amenities),
                          },
                        }}
                      />
                    </Box>

                    <Box>
                      <Stack direction="row" justifyContent="space-between" mb={0.5}>
                        <Typography variant="caption" color="text.secondary">
                          <TransportIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                          Transport
                        </Typography>
                        <Typography variant="caption" fontWeight={600}>
                          {loc.scores.transport.toFixed(1)}
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={loc.scores.transport * 10}
                        sx={{
                          height: 6,
                          borderRadius: 1,
                          bgcolor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: getScoreColor(loc.scores.transport),
                          },
                        }}
                      />
                    </Box>
                  </Stack>

                  {/* Overall Insight */}
                  {loc.insights && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Alert 
                        severity={
                          loc.scores.overall >= 8.5 ? 'success' : 
                          loc.scores.overall >= 7 ? 'info' : 
                          loc.scores.overall >= 5.5 ? 'warning' : 'error'
                        }
                        icon={false}
                        sx={{ fontSize: '0.75rem' }}
                      >
                        {loc.insights.overall}
                      </Alert>
                    </>
                  )}

                  <Divider sx={{ my: 2 }} />

                  <Stack direction="row" spacing={2} justifyContent="space-around">
                    <Box textAlign="center">
                      <Typography variant="h6" fontWeight={700}>
                        {loc.competitors}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Competitors
                      </Typography>
                    </Box>
                    <Box textAlign="center">
                      <Typography variant="h6" fontWeight={700}>
                        {loc.nearbyAmenities}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Amenities
                      </Typography>
                    </Box>
                    <Box textAlign="center">
                      <Typography variant="h6" fontWeight={700}>
                        {loc.transportOptions}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Transport
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </List>
      </Drawer>

      {/* Floating Button to Show Selected Location Details */}
      {selectedLocation && !drawerOpen && !showSelectedDetails && (
        <Fab
          variant="extended"
          color="primary"
          sx={{
            position: 'absolute',
            bottom: { xs: 16, sm: 24 },
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            px: 3,
            boxShadow: 6,
          }}
          onClick={() => setShowSelectedDetails(true)}
        >
          <InfoIcon sx={{ mr: 1 }} />
          View Location Details
        </Fab>
      )}

      {/* Selected Location Details */}
      {selectedLocation && !drawerOpen && showSelectedDetails && (
        <Paper
          elevation={8}
          sx={{
            position: 'absolute',
            bottom: { xs: 10, sm: 20 },
            left: { xs: 10, sm: 20 },
            right: { xs: 10, sm: 20 },
            maxWidth: { xs: '100%', md: 800 },
            mx: 'auto',
            p: { xs: 2, sm: 3 },
            zIndex: 1000,
            borderRadius: { xs: 2, sm: 3 },
            maxHeight: { xs: '60vh', sm: '70vh' },
            overflow: 'auto',
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box flex={1}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Selected Location Analysis
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lat: {selectedLocation.location.lat.toFixed(6)}, Lng: {selectedLocation.location.lng.toFixed(6)}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                icon={<StarIcon />}
                label={`Score: ${selectedLocation.scores.overall.toFixed(1)}/10`}
                sx={{
                  bgcolor: getScoreColor(selectedLocation.scores.overall),
                  color: 'white',
                  fontWeight: 700,
                }}
              />
              <IconButton 
                size="small" 
                onClick={() => setShowSelectedDetails(false)}
                sx={{ ml: 1 }}
              >
                <CloseIcon />
              </IconButton>
            </Stack>
          </Stack>

          {/* Back to List Button */}
          <Button
            variant="outlined"
            startIcon={<ListIcon />}
            fullWidth
            sx={{ mb: 2 }}
            onClick={() => {
              setDrawerOpen(true);
              setShowSelectedDetails(false);
            }}
          >
            Back to All Locations
          </Button>

          {/* Detailed Insights */}
          {selectedLocation.insights && (
            <Stack spacing={2} sx={{ mb: 3 }}>
              <Alert 
                severity={
                  selectedLocation.scores.overall >= 8.5 ? 'success' : 
                  selectedLocation.scores.overall >= 7 ? 'info' : 
                  selectedLocation.scores.overall >= 5.5 ? 'warning' : 'error'
                }
                sx={{ fontWeight: 500 }}
              >
                {selectedLocation.insights.overall}
              </Alert>

              <Box>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PeopleIcon fontSize="small" color="primary" />
                  Customer Reach Analysis
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ pl: 3 }}>
                  {selectedLocation.insights.customerReach}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StoreIcon fontSize="small" color="primary" />
                  Competition Assessment
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ pl: 3 }}>
                  {selectedLocation.insights.competition}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AmenitiesIcon fontSize="small" color="primary" />
                  Amenities & Infrastructure
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ pl: 3 }}>
                  {selectedLocation.insights.amenities}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TransportIcon fontSize="small" color="primary" />
                  Transport Connectivity
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ pl: 3 }}>
                  {selectedLocation.insights.transport}
                </Typography>
              </Box>
            </Stack>
          )}

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<CheckCircleIcon />}
              fullWidth
              onClick={() => {
                // Save selected location
                logger.log('Selected location:', selectedLocation);
                alert('Location saved successfully!');
              }}
            >
              Select This Location
            </Button>
            <Button
              variant="outlined"
              startIcon={<LocationIcon />}
              fullWidth
              onClick={() => {
                window.open(
                  `https://www.google.com/maps/search/?api=1&query=${selectedLocation.location.lat},${selectedLocation.location.lng}`,
                  '_blank'
                );
              }}
            >
              View on Maps
            </Button>
          </Stack>
        </Paper>
      )}

      {/* Filters Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen && locations.length === 0}
        onClose={() => setDrawerOpen(false)}
        variant="temporary"
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 380, md: 420 },
            p: { xs: 2, sm: 3 },
            pt: { xs: 8, sm: 10 },
            maxHeight: '100vh',
            overflow: 'auto',
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            Analysis Filters
          </Typography>
          <IconButton onClick={() => setDrawerOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Customize how locations are scored
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" fontWeight={600} gutterBottom>
            Search Radius: {filters.radius}m
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            The area around each location to analyze for competitors, amenities, and transport options
          </Typography>
          <Slider
            value={filters.radius}
            onChange={(e, value) => setFilters({ ...filters, radius: value })}
            min={1000}
            max={10000}
            step={500}
            marks={[
              { value: 1000, label: '1km' },
              { value: 5000, label: '5km' },
              { value: 10000, label: '10km' },
            ]}
          />
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" fontWeight={600} gutterBottom>
            Population Weight: {(filters.populationWeight * 100).toFixed(0)}%
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            How important customer reach and foot traffic are for your business. Higher values prioritize high-density areas
          </Typography>
          <Slider
            value={filters.populationWeight}
            onChange={(e, value) => setFilters({ ...filters, populationWeight: value })}
            min={0}
            max={1}
            step={0.1}
          />
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" fontWeight={600} gutterBottom>
            Amenities Weight: {(filters.amenitiesWeight * 100).toFixed(0)}%
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Importance of nearby facilities like restaurants, parking, and banks. Essential for retail and service businesses
          </Typography>
          <Slider
            value={filters.amenitiesWeight}
            onChange={(e, value) => setFilters({ ...filters, amenitiesWeight: value })}
            min={0}
            max={1}
            step={0.1}
          />
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" fontWeight={600} gutterBottom>
            Transport Weight: {(filters.transportWeight * 100).toFixed(0)}%
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            How crucial public transport accessibility is. Higher for locations targeting commuters and daily visitors
          </Typography>
          <Slider
            value={filters.transportWeight}
            onChange={(e, value) => setFilters({ ...filters, transportWeight: value })}
            min={0}
            max={1}
            step={0.1}
          />
        </Box>

        <Button
          variant="outlined"
          fullWidth
          startIcon={<RefreshIcon />}
          sx={{ mt: 3 }}
          onClick={() => {
            setFilters({
              radius: 5000,
              minFootfall: 3,
              maxCompetition: 5,
              amenitiesWeight: 0.7,
              transportWeight: 0.8,
              populationWeight: 0.9,
            });
          }}
        >
          Reset to Defaults
        </Button>
      </Drawer>

      {/* Welcome Message / No Results */}
      {!loading && locations.length === 0 && !searchQuery && (
        <Paper
          elevation={4}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            p: { xs: 3, sm: 4 },
            textAlign: 'center',
            maxWidth: { xs: '90%', sm: 500 },
            zIndex: 10,
          }}
        >
          <LocationIcon sx={{ fontSize: 72, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Find Your Perfect Franchise Location
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Search any city or area to discover top-ranked locations based on customer reach, competition, amenities, and transport.
          </Typography>
          <Box 
            sx={{ 
              mt: 3, 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 1, 
              justifyContent: 'center' 
            }}
          >
            <Chip icon={<PeopleIcon />} label="Customer Reach" color="primary" variant="outlined" size="small" />
            <Chip icon={<StoreIcon />} label="Competition" color="primary" variant="outlined" size="small" />
            <Chip icon={<AmenitiesIcon />} label="Amenities" color="primary" variant="outlined" size="small" />
            <Chip icon={<TransportIcon />} label="Transport" color="primary" variant="outlined" size="small" />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 3 }}>
            💡 Tip: Use the filter button to customize scoring weights before searching
          </Typography>
        </Paper>
      )}
      
      {!loading && locations.length === 0 && searchQuery && (
        <Paper
          elevation={4}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            p: 4,
            textAlign: 'center',
            maxWidth: 400,
            zIndex: 10,
          }}
        >
          <SearchIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No results found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try a different city or area name. Make sure to search for locations in India.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default LocationFinder;
