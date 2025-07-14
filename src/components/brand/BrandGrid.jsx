// src/components/brand/BrandGrid.jsx
import React, { useState, useEffect } from 'react'
import { Grid, Box, Typography, Button, Container } from '@mui/material'
import BrandCard from './BrandCard'
import { brandsData } from '../../data/brandsData'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

const BrandGrid = ({ featured = false, limit = null, filters = null }) => {
  const [displayBrands, setDisplayBrands] = useState([])
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    let filteredBrands = [...brandsData]

    // Apply filters if provided
    if (filters) {
      if (filters.keyword) {
        filteredBrands = filteredBrands.filter(brand =>
          brand.name.toLowerCase().includes(filters.keyword.toLowerCase()) ||
          brand.category.toLowerCase().includes(filters.keyword.toLowerCase()) ||
          brand.description.toLowerCase().includes(filters.keyword.toLowerCase())
        )
      }

      if (filters.category && filters.category !== 'All Categories') {
        filteredBrands = filteredBrands.filter(brand =>
          brand.category.toLowerCase() === filters.category.toLowerCase()
        )
      }

      if (filters.investment && filters.investment !== 'All Ranges') {
        // Parse investment range and filter
        const parseInvestment = (investmentString) => {
          const matches = investmentString.match(/\$(\d+(?:,\d+)*(?:K|,\d+)*)/g)
          if (matches) {
            return parseInt(matches[0].replace(/[$,K]/g, '')) * (matches[0].includes('K') ? 1000 : 1)
          }
          return 0
        }

        filteredBrands = filteredBrands.filter(brand => {
          const brandMin = parseInvestment(brand.investment)
          switch (filters.investment) {
            case 'Under $100K':
              return brandMin < 100000
            case '$100K - $200K':
              return brandMin >= 100000 && brandMin <= 200000
            case '$200K - $300K':
              return brandMin >= 200000 && brandMin <= 300000
            case '$300K - $500K':
              return brandMin >= 300000 && brandMin <= 500000
            case 'Over $500K':
              return brandMin > 500000
            default:
              return true
          }
        })
      }

      if (filters.minROI) {
        filteredBrands = filteredBrands.filter(brand => {
          const roiValue = parseInt(brand.roi.split('-')[0])
          return roiValue >= parseInt(filters.minROI)
        })
      }
    }

    // Apply featured filter
    if (featured) {
      filteredBrands = filteredBrands.filter(brand => brand.locations > 75)
    }

    // Apply limit
    if (limit && !showAll) {
      filteredBrands = filteredBrands.slice(0, limit)
    }

    setDisplayBrands(filteredBrands)
  }, [featured, limit, filters, showAll])

  if (displayBrands.length === 0) {
    return (
      <Container maxWidth="md" sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
          No franchises found matching your criteria
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Try adjusting your filters or search terms to see more results.
        </Typography>
      </Container>
    )
  }

  return (
    <Box>
      <Grid container spacing={4}>
        {displayBrands.map((brand, index) => (
          <Grid item xs={12} sm={6} lg={4} key={brand.id}>
            <BrandCard brand={brand} index={index} />
          </Grid>
        ))}
      </Grid>

      {limit && displayBrands.length >= limit && !showAll && (
        <MotionBox
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          sx={{ textAlign: 'center', mt: 6 }}
        >
          <Button
            variant="outlined"
            size="large"
            onClick={() => setShowAll(true)}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 25,
              fontWeight: 'bold',
              fontSize: '1.1rem'
            }}
          >
            Show More Franchises
          </Button>
        </MotionBox>
      )}
    </Box>
  )
}

export default BrandGrid