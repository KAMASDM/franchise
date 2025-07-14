// src/components/layout/Footer.jsx
import React from 'react'
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider
} from '@mui/material'
import {
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  Email,
  Phone,
  LocationOn,
  Restaurant as RestaurantIcon
} from '@mui/icons-material'

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'grey.900',
        color: 'white',
        mt: 8,
        py: 6
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <RestaurantIcon sx={{ color: 'primary.light', mr: 1, fontSize: 30 }} />
              <Typography variant="h5" fontWeight="bold" color="primary.light">
                FranchiseHub
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.8 }}>
              Your trusted partner in finding the perfect restaurant franchise opportunity. 
              We connect aspiring entrepreneurs with proven franchise brands.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton sx={{ color: 'primary.light' }}>
                <Facebook />
              </IconButton>
              <IconButton sx={{ color: 'primary.light' }}>
                <Twitter />
              </IconButton>
              <IconButton sx={{ color: 'primary.light' }}>
                <LinkedIn />
              </IconButton>
              <IconButton sx={{ color: 'primary.light' }}>
                <Instagram />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={2}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/brands" color="inherit" underline="hover">Browse Brands</Link>
              <Link href="/about" color="inherit" underline="hover">About Us</Link>
              <Link href="/blogs" color="inherit" underline="hover">Blogs</Link>
              <Link href="/faq" color="inherit" underline="hover">FAQ</Link>
              <Link href="/contact" color="inherit" underline="hover">Contact</Link>
            </Box>
          </Grid>

          {/* Categories */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Popular Categories
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/brands?category=pizza" color="inherit" underline="hover">Pizza Franchises</Link>
              <Link href="/brands?category=burgers" color="inherit" underline="hover">Burger Franchises</Link>
              <Link href="/brands?category=mexican" color="inherit" underline="hover">Mexican Food</Link>
              <Link href="/brands?category=coffee" color="inherit" underline="hover">Coffee Shops</Link>
              <Link href="/brands?category=asian" color="inherit" underline="hover">Asian Cuisine</Link>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Contact Info
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ color: 'primary.light' }} />
                <Typography variant="body2">+1 (555) 123-4567</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ color: 'primary.light' }} />
                <Typography variant="body2">info@franchisehub.com</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <LocationOn sx={{ color: 'primary.light' }} />
                <Typography variant="body2">
                  123 Business Avenue<br />
                  Suite 100<br />
                  New York, NY 10001
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, backgroundColor: 'grey.700' }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Typography variant="body2" color="grey.400">
            © 2025 FranchiseHub. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link href="/privacy" color="grey.400" underline="hover">
              Privacy Policy
            </Link>
            <Link href="/terms" color="grey.400" underline="hover">
              Terms of Service
            </Link>
            <Link href="/sitemap" color="grey.400" underline="hover">
              Sitemap
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer