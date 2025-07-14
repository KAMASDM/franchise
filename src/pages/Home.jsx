// src/pages/Home.jsx
import React from 'react'
import { Box, Container, Typography, Grid, Card, CardContent, Button, Avatar } from '@mui/material'
import { Star, Business, TrendingUp, Support } from '@mui/icons-material'
import HeroSection from '../components/common/HeroSection'
import SearchFilters from '../components/common/SearchFilters'
import BrandGrid from '../components/brand/BrandGrid'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)
const MotionCard = motion(Card)

const Home = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      business: "Pizza Palace Franchisee",
      content: "FranchiseHub connected me with the perfect opportunity. The support throughout the process was exceptional.",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Mike Chen",
      business: "Burger Barn Owner",
      content: "Thanks to FranchiseHub, I found a franchise that exceeded my ROI expectations. Highly recommended!",
      rating: 5,
      avatar: "MC"
    },
    {
      name: "Lisa Rodriguez",
      business: "Taco Fiesta Franchisee",
      content: "The detailed information and expert guidance helped me make an informed decision. Great experience!",
      rating: 5,
      avatar: "LR"
    }
  ]

  const whyChooseUs = [
    {
      icon: <Business />,
      title: "Curated Opportunities",
      description: "Hand-picked franchise opportunities with proven track records and strong market presence."
    },
    {
      icon: <TrendingUp />,
      title: "Market Intelligence",
      description: "Access to comprehensive market data, trends, and financial projections for informed decisions."
    },
    {
      icon: <Support />,
      title: "End-to-End Support",
      description: "From initial consultation to grand opening, we're with you every step of the way."
    }
  ]

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection />

      {/* Search Section */}
      <Container maxWidth="xl" sx={{ mt: -8, position: 'relative', zIndex: 2 }}>
        <SearchFilters />
      </Container>

      {/* Featured Brands Section */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <MotionBox
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          sx={{ textAlign: 'center', mb: 6 }}
        >
          <Typography
            variant="h3"
            component="h2"
            fontWeight="bold"
            sx={{ mb: 3, color: 'text.primary' }}
          >
            Featured Franchise Opportunities
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}
          >
            Discover top-performing restaurant franchises with proven business models and strong support systems.
          </Typography>
        </MotionBox>

        <BrandGrid featured={true} limit={6} />

        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="contained"
            size="large"
            href="/brands"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 25,
              fontWeight: 'bold',
              fontSize: '1.1rem'
            }}
          >
            View All Franchises
          </Button>
        </Box>
      </Container>

      {/* Why Choose Us Section */}
      <Box sx={{ backgroundColor: 'grey.50', py: 8 }}>
        <Container maxWidth="xl">
          <MotionBox
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            sx={{ textAlign: 'center', mb: 6 }}
          >
            <Typography
              variant="h3"
              component="h2"
              fontWeight="bold"
              sx={{ mb: 3, color: 'text.primary' }}
            >
              Why Choose FranchiseHub?
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}
            >
              We're committed to helping you find the perfect franchise opportunity with comprehensive support and guidance.
            </Typography>
          </MotionBox>

          <Grid container spacing={4}>
            {whyChooseUs.map((item, index) => (
              <Grid item xs={12} md={4} key={index}>
                <MotionCard
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    p: 4,
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Avatar
                    sx={{
                      backgroundColor: 'primary.main',
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 3
                    }}
                  >
                    {item.icon}
                  </Avatar>
                  <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {item.description}
                  </Typography>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <MotionBox
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          sx={{ textAlign: 'center', mb: 6 }}
        >
          <Typography
            variant="h3"
            component="h2"
            fontWeight="bold"
            sx={{ mb: 3, color: 'text.primary' }}
          >
            Success Stories
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}
          >
            Hear from successful franchisees who found their perfect opportunity through FranchiseHub.
          </Typography>
        </MotionBox>

        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <MotionCard
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                sx={{
                  height: '100%',
                  p: 3,
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} sx={{ color: '#FFD700', fontSize: 20 }} />
                    ))}
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{ mb: 3, fontStyle: 'italic', lineHeight: 1.6 }}
                  >
                    "{testimonial.content}"
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2, backgroundColor: 'primary.main' }}>
                      {testimonial.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.business}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

export default Home