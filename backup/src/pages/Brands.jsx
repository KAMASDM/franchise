// src/pages/Brands.jsx
import React, { useState } from 'react'
import { Container, Typography, Box } from '@mui/material'
import SearchFilters from '../components/common/SearchFilters'
import BrandGrid from '../components/brand/BrandGrid'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

const Brands = () => {
  const [filters, setFilters] = useState({})

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <MotionBox
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        sx={{ textAlign: 'center', mb: 6 }}
      >
        <Typography
          variant="h2"
          component="h1"
          fontWeight="bold"
          sx={{ mb: 3, color: 'text.primary' }}
        >
          Browse Franchise Opportunities
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}
        >
          Discover restaurant franchises that match your investment goals and entrepreneurial vision.
        </Typography>
      </MotionBox>

      <Box sx={{ mb: 6 }}>
        <SearchFilters onFilter={handleFilterChange} showResults={true} />
      </Box>

      <BrandGrid filters={filters} />
    </Container>
  )
}

export default Brands