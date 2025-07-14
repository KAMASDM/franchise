// src/components/common/SearchFilters.jsx
import React, { useState } from 'react'
import {
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Box,
  Typography,
  Chip
} from '@mui/material'
import { Search, FilterList, Clear } from '@mui/icons-material'
import { categories, investmentRanges } from '../../data/brandsData'
import { useNavigate } from 'react-router-dom'

const SearchFilters = ({ onFilter, showResults = false }) => {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({
    keyword: '',
    category: 'All Categories',
    investment: 'All Ranges',
    location: '',
    minROI: ''
  })

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value }
    setFilters(newFilters)
    if (onFilter) {
      onFilter(newFilters)
    }
  }

  const handleSearch = () => {
    const queryParams = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'All Categories' && value !== 'All Ranges') {
        queryParams.append(key, value)
      }
    })
    navigate(`/brands?${queryParams.toString()}`)
  }

  const clearFilters = () => {
    const clearedFilters = {
      keyword: '',
      category: 'All Categories',
      investment: 'All Ranges',
      location: '',
      minROI: ''
    }
    setFilters(clearedFilters)
    if (onFilter) {
      onFilter(clearedFilters)
    }
  }

  const hasActiveFilters = Object.values(filters).some(
    (value, index) => {
      if (index === 1 || index === 2) return value !== 'All Categories' && value !== 'All Ranges'
      return value !== ''
    }
  )

  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255,255,255,0.2)',
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <CardContent sx={{ p: 4 }}>
        {!showResults && (
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
              Find Your Perfect Franchise
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Use our advanced filters to discover franchises that match your criteria
            </Typography>
          </Box>
        )}

        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Search Keywords"
              placeholder="Pizza, Burger, Mexican..."
              value={filters.keyword}
              onChange={(e) => handleFilterChange('keyword', e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />
              }}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                label="Category"
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Investment Range</InputLabel>
              <Select
                value={filters.investment}
                label="Investment Range"
                onChange={(e) => handleFilterChange('investment', e.target.value)}
              >
                {investmentRanges.map((range) => (
                  <MenuItem key={range} value={range}>
                    {range}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Preferred Location"
              placeholder="City, State"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={1}>
            <TextField
              fullWidth
              label="Min ROI %"
              type="number"
              placeholder="25"
              value={filters.minROI}
              onChange={(e) => handleFilterChange('minROI', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleSearch}
                startIcon={<FilterList />}
                sx={{
                  borderRadius: 25,
                  fontWeight: 'bold',
                  py: 1.5
                }}
              >
                Search
              </Button>
              {hasActiveFilters && (
                <Button
                  variant="outlined"
                  size="large"
                  onClick={clearFilters}
                  sx={{ minWidth: 'auto', borderRadius: 25 }}
                >
                  <Clear />
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>

        {showResults && hasActiveFilters && (
          <Box sx={{ mt: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="body2" sx={{ mr: 2, alignSelf: 'center' }}>
              Active Filters:
            </Typography>
            {Object.entries(filters).map(([key, value]) => {
              if (!value || value === 'All Categories' || value === 'All Ranges') return null
              return (
                <Chip
                  key={key}
                  label={`${key}: ${value}`}
                  onDelete={() => handleFilterChange(key, key === 'category' ? 'All Categories' : key === 'investment' ? 'All Ranges' : '')}
                  color="primary"
                  variant="outlined"
                />
              )
            })}
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default SearchFilters