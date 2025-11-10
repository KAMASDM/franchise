import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  SwipeableDrawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Home as HomeIcon,
  Store as BrandsIcon,
  Article as BlogIcon,
  ContactMail as ContactIcon,
  Menu as MenuIcon,
  Chat as ChatIcon,
  Info as InfoIcon,
  HelpOutline as FaqIcon,
  Login as LoginIcon,
  Business as BusinessIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useDevice } from '../../hooks/useDevice';
import FranchiseHubLogo from '../common/FranchiseHubLogo';

/**
 * Mobile App Layout - Native app feeling for public pages
 * Features:
 * - Sticky header with branding
 * - Bottom navigation (5 main tabs including Chat)
 * - Swipeable side drawer
 * - Smooth page transitions
 */
const MobileAppLayout = ({ children, currentPage = 'home' }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile } = useDevice();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Function to trigger chatbot
  const openChatbot = () => {
    if (window.openChatbot) {
      window.openChatbot();
    }
  };

  // Main bottom navigation items
  const mainNavItems = [
    { label: 'Home', icon: <HomeIcon />, path: '/', value: 'home' },
    { label: 'Brands', icon: <BrandsIcon />, path: '/brands', value: 'brands' },
    { label: 'Blog', icon: <BlogIcon />, path: '/blogs', value: 'blogs' },
    { label: 'Chat', icon: <ChatIcon />, value: 'chat', action: openChatbot },
    { label: 'More', icon: <MenuIcon />, value: 'more', action: () => setDrawerOpen(true) },
  ];

  // Drawer menu items
  const drawerMenuItems = [
    { label: 'About Us', icon: <InfoIcon />, path: '/about' },
    { label: 'Contact Us', icon: <ContactIcon />, path: '/contact' },
    { label: 'FAQs', icon: <FaqIcon />, path: '/faq' },
    { label: 'Privacy Policy', icon: <InfoIcon />, path: '/privacy-policy' },
    { label: 'Terms & Conditions', icon: <InfoIcon />, path: '/terms-and-conditions' },
  ];

  const getCurrentNavValue = () => {
    const path = location.pathname;
    if (path === '/') return 0;
    if (path.startsWith('/brands')) return 1;
    if (path.startsWith('/blogs') || path.startsWith('/blog')) return 2;
    // Chat is index 3 but it's an action, not a route
    // More is index 4
    return -1; // No active tab for other routes
  };

  const handleNavChange = (event, newValue) => {
    const item = mainNavItems[newValue];
    if (item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const handleDrawerItemClick = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  if (!isMobile) {
    // Return children wrapped in minimal container for desktop
    return <Box>{children}</Box>;
  }

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        bgcolor: 'background.default',
        pb: 8, // Space for bottom nav
        position: 'relative',
      }}
    >
      {/* Top App Bar */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          borderBottom: '1px solid',
          borderColor: 'primary.dark',
        }}
      >
        <Toolbar sx={{ minHeight: 56, px: 1.5 }}>
          <Box 
            display="flex" 
            alignItems="center" 
            flex={1}
            onClick={() => navigate('/')}
            sx={{ cursor: 'pointer' }}
          >
            <FranchiseHubLogo 
              width={140} 
              height={40} 
              variant="full"
              color="white"
            />
          </Box>

          {user ? (
            <IconButton
              onClick={() => navigate('/dashboard')}
              sx={{ color: 'inherit', ml: 1, minWidth: 44, minHeight: 44 }}
              aria-label="Go to dashboard"
            >
              <Avatar 
                src={user?.photoURL} 
                alt={user?.displayName}
                sx={{ width: 32, height: 32 }}
              />
            </IconButton>
          ) : (
            <IconButton
              onClick={() => navigate('/login')}
              sx={{ 
                color: 'inherit', 
                ml: 1, 
                minWidth: 44, 
                minHeight: 44,
                bgcolor: 'rgba(255,255,255,0.1)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.2)',
                }
              }}
              aria-label="Sign in"
            >
              <LoginIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Main Content with Page Transitions */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </Box>

      {/* Bottom Navigation */}
      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
        elevation={8}
      >
        <BottomNavigation
          value={getCurrentNavValue()}
          onChange={handleNavChange}
          showLabels
          sx={{
            height: 64,
            bgcolor: 'background.paper',
            '& .MuiBottomNavigationAction-root': {
              minWidth: 0,
              minHeight: 48, // WCAG touch target minimum
              padding: '6px 12px 8px',
              color: 'text.secondary',
              '&.Mui-selected': {
                color: 'primary.main',
                fontSize: '0.75rem',
              },
            },
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.75rem', // Improved readability
              marginTop: '4px',
              '&.Mui-selected': {
                fontSize: '0.8rem',
                fontWeight: 600,
              },
            },
          }}
        >
          {mainNavItems.map((item, index) => (
            <BottomNavigationAction
              key={item.value}
              label={item.label}
              icon={item.icon}
            />
          ))}
        </BottomNavigation>
      </Paper>

      {/* Side Drawer */}
      <SwipeableDrawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onOpen={() => setDrawerOpen(true)}
        sx={{
          '& .MuiDrawer-paper': {
            width: '85%',
            maxWidth: 320,
          },
        }}
      >
        <Box sx={{ overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Drawer Header */}
          <Box
            sx={{
              p: 3,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Menu
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {user ? user.displayName || user.email : 'Explore More'}
              </Typography>
            </Box>
            <IconButton
              onClick={() => setDrawerOpen(false)}
              sx={{ 
                color: 'inherit',
                minWidth: 44,
                minHeight: 44, // WCAG touch target minimum
              }}
              aria-label="Close menu"
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* User Section */}
          {user ? (
            <>
              <List sx={{ px: 1, py: 2 }}>
                <ListItemButton
                  onClick={() => handleDrawerItemClick('/dashboard')}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    minHeight: 48, // WCAG touch target minimum
                    bgcolor: 'primary.lighter',
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <BusinessIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="My Dashboard"
                    primaryTypographyProps={{ fontSize: '0.95rem' }}
                  />
                </ListItemButton>
              </List>
              <Divider />
            </>
          ) : (
            <>
              <List sx={{ px: 1, py: 2 }}>
                <ListItemButton
                  onClick={() => handleDrawerItemClick('/login')}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    minHeight: 48, // WCAG touch target minimum
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <LoginIcon sx={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Sign In" 
                    primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 600 }}
                  />
                </ListItemButton>
              </List>
              <Divider />
            </>
          )}

          {/* Menu Items */}
          <List sx={{ px: 1, py: 2, flex: 1 }}>
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ px: 2, pb: 1, display: 'block', fontWeight: 600 }}
            >
              EXPLORE
            </Typography>
            {drawerMenuItems.map((item) => (
              <ListItemButton
                key={item.path}
                onClick={() => handleDrawerItemClick(item.path)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  minHeight: 48, // WCAG touch target minimum
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: '0.95rem' }}
                />
              </ListItemButton>
            ))}
          </List>

          {/* Footer */}
          <Box sx={{ p: 2, bgcolor: 'background.default', borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary" align="center" display="block">
              FranchiseHub © 2025
            </Typography>
            <Typography variant="caption" color="text.secondary" align="center" display="block">
              All Rights Reserved
            </Typography>
          </Box>
        </Box>
      </SwipeableDrawer>
    </Box>
  );
};

export default MobileAppLayout;
