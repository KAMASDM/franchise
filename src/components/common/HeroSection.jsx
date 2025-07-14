// src/components/common/HeroSection.jsx
import React from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  useTheme,
  useMediaQuery
} from '@mui/material'
import {
  TrendingUp,
  Security,
  Support,
  Speed,
  ArrowForward
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const MotionBox = motion(Box)
const MotionCard = motion(Card)

const HeroSection = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()

  const features = [
    {
      icon: <TrendingUp />,
      title: 'Proven ROI',
      description: 'Access franchises with verified track records and strong returns'
    },
    {
      icon: <Security />,
      title: 'Verified Brands',
      description: 'All franchise information is thoroughly vetted and up-to-date'
    },
    {
      icon: <Support />,
      title: 'Expert Support',
      description: 'Get personalized guidance from franchise specialists'
    },
    {
      icon: <Speed />,
      title: 'Fast Process',
      description: 'Streamlined application and approval process'
    }
  ]

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.3
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center">
          {/* Main Content */}
          <Grid item xs={12} md={6}>
            <MotionBox
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  lineHeight: 1.2,
                  mb: 3
                }}
              >
                Find Your Perfect
                <Box component="span" sx={{ color: '#FFD700' }}>
                  {' '}Restaurant Franchise
                </Box>
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  opacity: 0.9,
                  fontWeight: 300,
                  lineHeight: 1.5
                }}
              >
                Connect with proven restaurant franchises that match your budget, 
                goals, and vision. Start your entrepreneurial journey today.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, mb: 6, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/brands')}
                  sx={{
                    backgroundColor: '#FFD700',
                    color: 'black',
                    fontWeight: 'bold',
                    px: 4,
                    py: 1.5,
                    borderRadius: 30,
                    fontSize: '1.1rem',
                    '&:hover': {
                      backgroundColor: '#FFC107',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(255, 215, 0, 0.3)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Browse Franchises
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/contact')}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    fontWeight: 'bold',
                    px: 4,
                    py: 1.5,
                    borderRadius: 30,
                    fontSize: '1.1rem',
                    '&:hover': {
                      backgroundColor: 'white',
                      color: theme.palette.primary.main,
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Get Expert Help
                </Button>
              </Box>

              {/* Stats */}
              <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: '#FFD700' }}>
                    500+
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Franchise Brands
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: '#FFD700' }}>
                    95%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Success Rate
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: '#FFD700' }}>
                    $10M+
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Investments Facilitated
                  </Typography>
                </Box>
              </Box>
            </MotionBox>
          </Grid>

          {/* Feature Cards */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={3}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <MotionCard
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    whileHover={{ y: -10 }}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 3,
                      height: '100%'
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Avatar
                        sx={{
                          backgroundColor: '#FFD700',
                          color: theme.palette.primary.main,
                          width: 60,
                          height: 60,
                          mx: 'auto',
                          mb: 2
                        }}
                      >
                        {feature.icon}
                      </Avatar>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ mb: 1, color: 'white' }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.5 }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </MotionCard>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default HeroSection