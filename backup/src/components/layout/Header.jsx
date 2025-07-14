// src/components/layout/Header.jsx
import React, { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  Container
} from '@mui/material'
import {
  Menu as MenuIcon,
  Restaurant as RestaurantIcon,
  Phone as PhoneIcon
} from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Browse Brands', path: '/brands' },
    { label: 'About Us', path: '/about' },
    { label: 'Blogs', path: '/blogs' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Contact', path: '/contact' }
  ]

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2, color: 'primary.main', fontWeight: 'bold' }}>
        FranchiseHub
      </Typography>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.label} component={Link} to={item.path}>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: 'white', color: 'text.primary', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <Container maxWidth="xl">
          <Toolbar>
            {/* Logo */}
            <Box 
              component={Link} 
              to="/" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none',
                color: 'inherit',
                flexGrow: { xs: 1, md: 0 }
              }}
            >
              <RestaurantIcon sx={{ color: 'primary.main', mr: 1, fontSize: 30 }} />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  color: 'primary.main',
                  display: { xs: 'block', md: 'block' }
                }}
              >
                FranchiseHub
              </Typography>
            </Box>

            {/* Desktop Menu */}
            {!isMobile && (
              <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', ml: 4 }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.label}
                    component={Link}
                    to={item.path}
                    sx={{
                      mx: 1,
                      color: 'text.primary',
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: 'primary.light',
                        color: 'white'
                      }
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}

            {/* Contact Button */}
            {!isMobile && (
              <Button
                variant="contained"
                startIcon={<PhoneIcon />}
                onClick={() => navigate('/contact')}
                sx={{
                  borderRadius: 25,
                  px: 3,
                  py: 1,
                  fontWeight: 'bold'
                }}
              >
                Get Started
              </Button>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 }
        }}
      >
        {drawer}
      </Drawer>
    </>
  )
}

export default Header