import React, { useState, useEffect, useRef } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
  Chip,
  Typography,
  Divider,
  Popper,
  ClickAwayListener
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  History as HistoryIcon,
  TrendingUp,
  Business,
  LocationOn
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSimpleSearch } from '../../hooks/useSimpleSearch';

const AdvancedSearchBar = ({ 
  placeholder = "Search for franchise opportunities...",
  onSearch,
  showSuggestions = true,
  brands = [],
  fullWidth = true
}) => {
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm, debouncedSearchTerm } = useSimpleSearch('', 300);
  const [searchHistory, setSearchHistory] = useState([]);
  const [focused, setFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const anchorRef = useRef(null);

  // Load search history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('franchise_search_history');
      if (stored) {
        setSearchHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  }, []);

  // Filter suggestions based on search term
  useEffect(() => {
    if (!debouncedSearchTerm || !showSuggestions) {
      setFilteredSuggestions([]);
      return;
    }

    const searchLower = debouncedSearchTerm.toLowerCase();
    
    // Filter brands
    const matchingBrands = brands
      .filter(brand => 
        brand.brandName?.toLowerCase().includes(searchLower) ||
        brand.brandIndustry?.toLowerCase().includes(searchLower) ||
        brand.brandCategory?.toLowerCase().includes(searchLower)
      )
      .slice(0, 5)
      .map(brand => ({
        type: 'brand',
        text: brand.brandName,
        subtitle: brand.brandIndustry || brand.brandCategory,
        id: brand.id,
        slug: brand.slug
      }));

    // Combine with search history and suggestions
    const recentSearches = searchHistory
      .filter(term => term.toLowerCase().includes(searchLower))
      .slice(0, 3)
      .map(term => ({
        type: 'history',
        text: term
      }));

    setFilteredSuggestions([...matchingBrands, ...recentSearches]);
  }, [debouncedSearchTerm, brands, searchHistory, showSuggestions]);

  useEffect(() => {
    setShowDropdown(focused && filteredSuggestions.length > 0);
  }, [focused, filteredSuggestions]);

  const handleSearch = (value = searchTerm) => {
    if (value.trim()) {
      // Save to search history
      const newHistory = [
        value,
        ...searchHistory.filter(item => item !== value)
      ].slice(0, 10);
      
      setSearchHistory(newHistory);
      try {
        localStorage.setItem('franchise_search_history', JSON.stringify(newHistory));
      } catch (error) {
        console.error('Error saving search history:', error);
      }

      if (onSearch) {
        onSearch(value);
      }
      setShowDropdown(false);
      setFocused(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setFilteredSuggestions([]);
    setShowDropdown(false);
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'brand') {
      navigate(`/brands/${suggestion.slug || suggestion.id}`);
    } else {
      setSearchTerm(suggestion.text);
      handleSearch(suggestion.text);
    }
    setShowDropdown(false);
  };

  const getSuggestionIcon = (type) => {
    switch (type) {
      case 'brand':
        return <Business color="primary" />;
      case 'history':
        return <HistoryIcon color="action" />;
      case 'trending':
        return <TrendingUp color="secondary" />;
      default:
        return <SearchIcon color="action" />;
    }
  };

  return (
    <ClickAwayListener onClickAway={() => setShowDropdown(false)}>
      <Box ref={anchorRef} sx={{ position: 'relative', width: fullWidth ? '100%' : 'auto' }}>
        <TextField
          fullWidth={fullWidth}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          variant="outlined"
          size="medium"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton onClick={handleClear} size="small" aria-label="Clear search">
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              borderRadius: 3,
              bgcolor: 'background.paper',
              '&:hover': {
                boxShadow: 2
              },
              '&.Mui-focused': {
                boxShadow: 3
              }
            }
          }}
        />

        <Popper
          open={showDropdown}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          sx={{ zIndex: 1300, width: anchorRef.current?.offsetWidth }}
        >
          <Paper
            elevation={8}
            sx={{
              mt: 1,
              maxHeight: 400,
              overflow: 'auto',
              borderRadius: 2
            }}
          >
            <List sx={{ py: 0 }}>
              {filteredSuggestions.map((suggestion, index) => (
                <React.Fragment key={`${suggestion.type}-${index}`}>
                  {index === 0 && suggestion.type === 'brand' && (
                    <Box sx={{ px: 2, py: 1, bgcolor: 'grey.50' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                        BRANDS
                      </Typography>
                    </Box>
                  )}
                  {index > 0 && suggestion.type === 'history' && filteredSuggestions[index - 1].type !== 'history' && (
                    <>
                      <Divider />
                      <Box sx={{ px: 2, py: 1, bgcolor: 'grey.50' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                          RECENT SEARCHES
                        </Typography>
                      </Box>
                    </>
                  )}
                  <ListItem
                    button
                    onClick={() => handleSuggestionClick(suggestion)}
                    sx={{
                      '&:hover': {
                        bgcolor: 'action.hover'
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {getSuggestionIcon(suggestion.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={suggestion.text}
                      secondary={suggestion.subtitle}
                      primaryTypographyProps={{
                        sx: { fontWeight: suggestion.type === 'brand' ? 'bold' : 'normal' }
                      }}
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

export default AdvancedSearchBar;
