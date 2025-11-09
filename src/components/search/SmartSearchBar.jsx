/**
 * Smart Search Bar with Autocomplete
 * Features: Search history, trending searches, categorized results, voice search
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  TextField,
  Autocomplete,
  Box,
  Typography,
  Chip,
  InputAdornment,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Search as SearchIcon,
  Mic as MicIcon,
  History as HistoryIcon,
  TrendingUp as TrendingIcon,
  Clear as ClearIcon,
  Store as BrandIcon,
  Business as IndustryIcon,
  LocationOn as LocationIcon,
  AttachMoney as InvestmentIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { useDebounce } from '../../hooks/useDebounce';

const SEARCH_HISTORY_KEY = 'search_history';
const MAX_HISTORY = 5;

/**
 * Search result types
 */
const RESULT_TYPES = {
  BRAND: { icon: <BrandIcon />, color: 'primary', label: 'Brand' },
  INDUSTRY: { icon: <IndustryIcon />, color: 'secondary', label: 'Industry' },
  LOCATION: { icon: <LocationIcon />, color: 'success', label: 'Location' },
  INVESTMENT: { icon: <InvestmentIcon />, color: 'warning', label: 'Investment' },
};

/**
 * Trending searches (could be fetched from analytics)
 */
const TRENDING_SEARCHES = [
  'Food & Beverage',
  'Low Investment Franchises',
  'High ROI Opportunities',
  'Healthcare Franchises',
  'Education Franchises',
];

/**
 * Get search history from localStorage
 */
const getSearchHistory = () => {
  try {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch {
    return [];
  }
};

/**
 * Save search to history
 */
const saveToHistory = (searchTerm) => {
  if (!searchTerm || searchTerm.trim().length < 2) return;
  
  const history = getSearchHistory();
  const updated = [
    searchTerm,
    ...history.filter(item => item !== searchTerm)
  ].slice(0, MAX_HISTORY);
  
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
};

/**
 * Clear search history
 */
const clearHistory = () => {
  localStorage.removeItem(SEARCH_HISTORY_KEY);
};

/**
 * Smart Search Bar Component
 */
const SmartSearchBar = ({ 
  placeholder = 'Search franchises, industries, locations...',
  autoFocus = false,
  fullWidth = true,
  size = 'medium',
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [searchHistory, setSearchHistory] = useState(getSearchHistory());
  const recognitionRef = useRef(null);
  
  const debouncedSearch = useDebounce(inputValue, 300);
  
  /**
   * Search function
   */
  const performSearch = async (searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) {
      setOptions([]);
      return;
    }
    
    setLoading(true);
    
    try {
      const results = [];
      const searchLower = searchTerm.toLowerCase();
      
      // Search brands
      const brandsRef = collection(db, 'brands');
      const brandQuery = query(
        brandsRef,
        where('brandName', '>=', searchTerm),
        where('brandName', '<=', searchTerm + '\uf8ff'),
        limit(5)
      );
      
      const brandSnapshot = await getDocs(brandQuery);
      brandSnapshot.forEach(doc => {
        results.push({
          id: doc.id,
          label: doc.data().brandName,
          type: 'BRAND',
          data: doc.data(),
          path: `/brand/${doc.data().slug || doc.id}`,
        });
      });
      
      // Add industry suggestions
      const industries = [
        'Food & Beverage', 'Retail', 'Healthcare', 'Education',
        'Fitness', 'Beauty & Wellness', 'Technology', 'Automotive'
      ];
      
      industries
        .filter(industry => industry.toLowerCase().includes(searchLower))
        .forEach(industry => {
          results.push({
            id: `industry-${industry}`,
            label: industry,
            type: 'INDUSTRY',
            path: `/brands?industry=${encodeURIComponent(industry)}`,
          });
        });
      
      // Add investment range suggestions
      const investmentRanges = [
        { label: 'Under ₹50K', value: 'under-50k' },
        { label: '₹50K - ₹1M', value: '50k-1m' },
        { label: 'Over ₹1M', value: 'over-1m' },
      ];
      
      investmentRanges
        .filter(range => range.label.toLowerCase().includes(searchLower))
        .forEach(range => {
          results.push({
            id: `investment-${range.value}`,
            label: range.label,
            type: 'INVESTMENT',
            path: `/brands?investment=${range.value}`,
          });
        });
      
      setOptions(results);
    } catch (error) {
      console.error('Search error:', error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Effect: Perform search when debounced value changes
   */
  useEffect(() => {
    if (debouncedSearch) {
      performSearch(debouncedSearch);
    } else {
      setOptions([]);
    }
  }, [debouncedSearch]);
  
  /**
   * Voice search setup
   */
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    }
  }, []);
  
  /**
   * Handle voice search
   */
  const handleVoiceSearch = () => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.start();
        setIsListening(true);
      }
    }
  };
  
  /**
   * Handle selection
   */
  const handleSelect = (event, value) => {
    if (value) {
      saveToHistory(value.label);
      setSearchHistory(getSearchHistory());
      navigate(value.path);
    }
  };
  
  /**
   * Handle input change
   */
  const handleInputChange = (event, newValue) => {
    setInputValue(newValue);
  };
  
  /**
   * Custom option renderer
   */
  const renderOption = (props, option) => {
    const typeConfig = RESULT_TYPES[option.type];
    
    return (
      <ListItem {...props} key={option.id}>
        <ListItemIcon sx={{ minWidth: 40, color: `${typeConfig.color}.main` }}>
          {typeConfig.icon}
        </ListItemIcon>
        <ListItemText
          primary={option.label}
          secondary={
            <Chip 
              label={typeConfig.label} 
              size="small" 
              color={typeConfig.color}
              sx={{ height: 18, fontSize: '0.7rem' }}
            />
          }
        />
      </ListItem>
    );
  };
  
  /**
   * Render no options (show history and trending)
   */
  const renderNoOptions = () => (
    <Paper sx={{ p: 2 }}>
      {/* Search History */}
      {searchHistory.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <HistoryIcon fontSize="small" />
              Recent Searches
            </Typography>
            <Typography 
              variant="caption" 
              color="primary" 
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                clearHistory();
                setSearchHistory([]);
              }}
            >
              Clear
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {searchHistory.map((term, idx) => (
              <Chip
                key={idx}
                label={term}
                size="small"
                onClick={() => setInputValue(term)}
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>
        </Box>
      )}
      
      {/* Trending Searches */}
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
          <TrendingIcon fontSize="small" />
          Trending Searches
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {TRENDING_SEARCHES.map((term, idx) => (
            <Chip
              key={idx}
              label={term}
              size="small"
              color="secondary"
              variant="outlined"
              onClick={() => setInputValue(term)}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Box>
      </Box>
    </Paper>
  );
  
  return (
    <Autocomplete
      freeSolo
      fullWidth={fullWidth}
      options={options}
      loading={loading}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onChange={handleSelect}
      getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
      filterOptions={(x) => x} // We handle filtering ourselves
      renderOption={renderOption}
      noOptionsText={inputValue ? 'No results found' : null}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          autoFocus={autoFocus}
          size={size}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {loading && <CircularProgress size={20} />}
                {inputValue && (
                  <IconButton
                    size="small"
                    onClick={() => setInputValue('')}
                    edge="end"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                )}
                {'webkitSpeechRecognition' in window && (
                  <IconButton
                    size="small"
                    onClick={handleVoiceSearch}
                    color={isListening ? 'error' : 'default'}
                    edge="end"
                  >
                    <MicIcon fontSize="small" />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
        />
      )}
      PaperComponent={(props) => (
        <Paper {...props} elevation={8}>
          {!inputValue && props.children?.length === 0 ? renderNoOptions() : props.children}
        </Paper>
      )}
    />
  );
};

export default SmartSearchBar;
