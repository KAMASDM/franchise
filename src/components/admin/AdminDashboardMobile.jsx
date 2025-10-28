import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Badge,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Chat as ChatIcon,
  Notifications as NotificationsIcon,
  BarChart as AnalyticsIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Close as CloseIcon,
  ContactMail as LeadsIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { useDevice } from '../../hooks/useDevice';

/**
 * Mobile-optimized Admin Dashboard Layout
 * Features:
 * - Bottom navigation for quick access
 * - Swipeable drawer for full menu
 * - Compact top bar with notifications
 * - Touch-friendly interface
 */
const AdminDashboardMobile = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { spacing } = useDevice();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const mainNavItems = [
    { 
      label: 'Overview', 
      icon: <DashboardIcon />, 
      path: '/admin',
      badge: null,
    },
    { 
      label: 'Brands', 
      icon: <BusinessIcon />, 
      path: '/admin/brands',
      badge: null,
    },
    { 
      label: 'Leads', 
      icon: <LeadsIcon />, 
      path: '/admin/leads',
      badge: null,
    },
    { 
      label: 'Users', 
      icon: <PeopleIcon />, 
      path: '/admin/users',
      badge: null,
    },
    { 
      label: 'More', 
      icon: <MenuIcon />, 
      action: () => setDrawerOpen(true),
      badge: null,
    },
  ];

  const secondaryNavItems = [
    { 
      label: 'Analytics', 
      icon: <AnalyticsIcon />, 
      path: '/admin/analytics' 
    },
    { 
      label: 'Chat Leads', 
      icon: <ChatIcon />, 
      path: '/admin/chat-leads' 
    },
    { 
      label: 'Messages', 
      icon: <EmailIcon />, 
      path: '/admin/messages' 
    },
    { 
      label: 'Notifications', 
      icon: <NotificationsIcon />, 
      path: '/admin/notifications' 
    },
  ];

  const getCurrentNavValue = () => {
    const currentPath = location.pathname;
    const index = mainNavItems.findIndex(item => item.path && item.path === currentPath);
    return index >= 0 ? index : -1; // Return -1 if no match (like when on More pages)
  };

  const handleNavChange = (event, newValue) => {
    const item = mainNavItems[newValue];
    if (item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        bgcolor: 'background.default',
        pb: 8, // Space for bottom nav (64px)
      }}
    >
      {/* Top App Bar */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ minHeight: 64 }}>
          <IconButton
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2,
              bgcolor: 'action.hover',
              '&:hover': {
                bgcolor: 'action.selected',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box flex={1}>
            <Typography variant="h6" fontWeight="bold" color="primary">
              Admin Portal
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email || 'Administrator'}
            </Typography>
          </Box>

          <IconButton sx={{ mr: 1 }}>
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Avatar 
            src={user?.photoURL} 
            alt={user?.displayName || 'Admin'}
            sx={{ 
              width: 36, 
              height: 36,
              bgcolor: 'primary.main',
            }}
          >
            {user?.displayName?.[0] || user?.email?.[0] || 'A'}
          </Avatar>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
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
          borderTop: 1,
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
              padding: '6px 0 8px',
              color: 'text.secondary',
              '&.Mui-selected': {
                color: 'primary.main',
              },
            },
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.7rem',
              '&.Mui-selected': {
                fontSize: '0.75rem',
                fontWeight: 600,
              },
            },
          }}
        >
          {mainNavItems.map((item) => (
            <BottomNavigationAction
              key={item.path}
              label={item.label}
              icon={
                item.badge ? (
                  <Badge badgeContent={item.badge} color="error">
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )
              }
            />
          ))}
        </BottomNavigation>
      </Paper>

      {/* Side Drawer Menu */}
      <SwipeableDrawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onOpen={() => setDrawerOpen(true)}
        sx={{
          '& .MuiDrawer-paper': {
            width: '85%',
            maxWidth: 340,
            bgcolor: 'background.default',
          },
        }}
      >
        <Box sx={{ overflow: 'auto' }}>
          {/* Drawer Header */}
          <Box
            sx={{
              p: 3,
              background: 'linear-gradient(135deg, #5a76a9 0%, #3a5483 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minHeight: 100,
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar 
                src={user?.photoURL}
                sx={{ 
                  width: 48, 
                  height: 48,
                  border: '2px solid rgba(255,255,255,0.3)',
                }}
              >
                {user?.displayName?.[0] || user?.email?.[0] || 'A'}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {user?.displayName || 'Administrator'}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.85rem' }}>
                  {user?.email}
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={() => setDrawerOpen(false)}
              sx={{ 
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.1)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.2)',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Main Navigation */}
          <List sx={{ px: 2, py: 2 }}>
            <Typography 
              variant="overline" 
              color="text.secondary" 
              sx={{ px: 2, pb: 1, display: 'block', fontWeight: 600 }}
            >
              Main Menu
            </Typography>
            {mainNavItems.filter(item => item.path).map((item) => (
              <ListItemButton
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setDrawerOpen(false);
                }}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  py: 1.5,
                  '&.Mui-selected': {
                    bgcolor: 'primary.lighter',
                    color: 'primary.main',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.main',
                    },
                  },
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
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
                {item.badge && (
                  <Chip
                    label={item.badge}
                    size="small"
                    color="error"
                    sx={{ height: 22, minWidth: 22, fontSize: '0.75rem' }}
                  />
                )}
              </ListItemButton>
            ))}
          </List>

          <Divider />

          {/* Secondary Navigation */}
          <List sx={{ px: 2, py: 2 }}>
            <Typography 
              variant="overline" 
              color="text.secondary" 
              sx={{ px: 2, pb: 1, display: 'block', fontWeight: 600 }}
            >
              More Options
            </Typography>
            {secondaryNavItems.map((item) => (
              <ListItemButton
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setDrawerOpen(false);
                }}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  py: 1.5,
                  '&.Mui-selected': {
                    bgcolor: 'primary.lighter',
                    color: 'primary.main',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.main',
                    },
                  },
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
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </ListItemButton>
            ))}
          </List>

          <Divider />

          {/* Logout */}
          <List sx={{ px: 2, py: 2 }}>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                py: 1.5,
                color: 'error.main',
                '&:hover': {
                  bgcolor: 'error.lighter',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Logout"
                primaryTypographyProps={{ fontWeight: 600 }}
              />
            </ListItemButton>
          </List>
        </Box>
      </SwipeableDrawer>
    </Box>
  );
};

export default AdminDashboardMobile;
