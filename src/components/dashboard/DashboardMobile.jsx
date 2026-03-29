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
  Card,
  CardContent,
  Grid,
  Stack,
  Fab,
  alpha,
  useTheme,
  LinearProgress,
  Chip,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Close as CloseIcon,
  TrendingUp,
  AttachMoney,
  People,
  Store,
  Home as HomeIcon,
  AppRegistration,
  Leaderboard,
  PictureAsPdf,
  TravelExplore,
  Reviews,
  Quiz,
  HelpOutline,
  AddCircle,
  ChevronRight,
  Star,
  CheckCircle,
  ArrowForward,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { Routes, Route } from 'react-router-dom';

// Import dashboard components
import Overview from './Overview';
import Brands from './Brands';
import Locations from './Locations';
import Leads from './Leads';
import Settings from './Settings';
import Help from './Help';
import Review from './Review';
import FAQs from './FAQs';
import MarketingMaterials from './MarketingMaterials';
import BrandDetail from './BrandDetail';
import BrandRegistrationMobile from '../forms/BrandRegistrationMobile';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

/**
 * Native App-like Dashboard for Mobile
 * Features:
 * - iOS/Android native feel
 * - Smooth animations
 * - Card-based interface
 * - Bottom navigation
 * - Swipeable drawer
 * - Quick actions
 */
const DashboardMobile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const mainNavItems = [
    { 
      label: 'Overview', 
      icon: <DashboardIcon />, 
      path: '/dashboard',
      value: 'overview',
    },
    { 
      label: 'Brands', 
      icon: <BusinessIcon />, 
      path: '/dashboard/brands',
      value: 'brands',
    },
    { 
      label: 'Leads', 
      icon: <Leaderboard />, 
      path: '/dashboard/leads',
      value: 'leads',
    },
    { 
      label: 'Marketing', 
      icon: <PictureAsPdf />, 
      path: '/dashboard/marketing',
      value: 'marketing',
    },
    { 
      label: 'More', 
      icon: <MenuIcon />, 
      action: () => setDrawerOpen(true),
      value: 'more',
    },
  ];

  const menuItems = [
    { label: 'Home', icon: <HomeIcon />, path: '/' },
    { label: 'Locations', icon: <LocationIcon />, path: '/dashboard/locations' },
    { label: 'Location Finder', icon: <TravelExplore />, path: '/location-analysis-enhanced', badge: 'AI' },
    { label: 'Reviews', icon: <Reviews />, path: '/dashboard/reviews' },
    { label: 'FAQs', icon: <Quiz />, path: '/dashboard/faqs' },
    { label: 'Settings', icon: <SettingsIcon />, path: '/dashboard/settings' },
    { label: 'Help & Support', icon: <HelpOutline />, path: '/dashboard/help' },
  ];

  const getCurrentNavValue = () => {
    const currentPath = location.pathname;
    const found = mainNavItems.find(item => item.path && currentPath.startsWith(item.path));
    return found?.value || -1;
  };

  const handleNavChange = (event, newValue) => {
    const item = mainNavItems.find(i => i.value === newValue);
    if (item?.action) {
      item.action();
    } else if (item?.path) {
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

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        bgcolor: 'background.default',
        pb: 9, // Space for bottom nav + FAB
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
        <Toolbar sx={{ minHeight: 64, px: 2 }}>
          <Box flex={1}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              Welcome back,
            </Typography>
            <Typography variant="h6" fontWeight="bold" noWrap>
              {user?.displayName || 'Dashboard'}
            </Typography>
          </Box>

          <IconButton 
            onClick={() => setNotificationsOpen(true)}
            sx={{ mr: 1, minWidth: 44, minHeight: 44 }}
          >
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Avatar 
            src={user?.photoURL} 
            alt={user?.displayName || 'User'}
            sx={{ 
              width: 40, 
              height: 40,
              bgcolor: 'primary.main',
              cursor: 'pointer',
            }}
            onClick={() => setDrawerOpen(true)}
          >
            {user?.displayName?.[0] || user?.email?.[0] || 'U'}
          </Avatar>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <MotionBox
          key={location.pathname}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/register-brand" element={<BrandRegistrationMobile />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/brand-details/:id" element={<BrandDetail />} />
            <Route path="/marketing" element={<MarketingMaterials />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/reviews" element={<Review />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
          </Routes>
        </MotionBox>
      </AnimatePresence>

      {/* Floating Action Button */}
      {!location.pathname.includes('/register-brand') && (
        <Fab
          color="primary"
          aria-label="register brand"
          onClick={() => navigate('/dashboard/register-brand')}
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 16,
            zIndex: 1100,
            width: 64,
            height: 64,
            boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
          }}
        >
          <AddCircle sx={{ fontSize: 32 }} />
        </Fab>
      )}

      {/* Bottom Navigation */}
      {!location.pathname.includes('/register-brand') && (
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
              minHeight: 48,
              padding: '6px 12px 8px',
              color: 'text.secondary',
              '&.Mui-selected': {
                color: 'primary.main',
                fontSize: '0.75rem',
              },
            },
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.7rem',
              marginTop: '4px',
              '&.Mui-selected': {
                fontSize: '0.75rem',
                fontWeight: 600,
              },
            },
          }}
        >
          {mainNavItems.map((item) => (
            <BottomNavigationAction
              key={item.value}
              label={item.label}
              value={item.value}
              icon={item.icon}
            />
          ))}
        </BottomNavigation>
      </Paper>
      )}

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
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              color: 'white',
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h6" fontWeight="bold">
                Menu
              </Typography>
              <IconButton
                onClick={() => setDrawerOpen(false)}
                sx={{ 
                  color: 'white',
                  minWidth: 44,
                  minHeight: 44,
                }}
              >
                <CloseIcon />
              </IconButton>
            </Stack>
            
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar 
                src={user?.photoURL} 
                sx={{ width: 56, height: 56 }}
              >
                {user?.displayName?.[0] || 'U'}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {user?.displayName || 'User'}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  {user?.email}
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Menu Items */}
          <List sx={{ flex: 1, px: 1, py: 2 }}>
            {menuItems.map((item, index) => (
              <ListItemButton
                key={index}
                onClick={() => {
                  navigate(item.path);
                  setDrawerOpen(false);
                }}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  minHeight: 48,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: 500,
                    fontSize: '0.9rem',
                  }}
                />
                {item.badge && (
                  <Chip 
                    label={item.badge} 
                    size="small" 
                    color="secondary"
                    sx={{ fontWeight: 700, fontSize: '0.65rem' }}
                  />
                )}
              </ListItemButton>
            ))}
          </List>

          <Divider />

          {/* Logout */}
          <Box sx={{ p: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ 
                minHeight: 48,
                borderRadius: 2,
                fontWeight: 600,
              }}
            >
              Logout
            </Button>
          </Box>
        </Box>
      </SwipeableDrawer>

      {/* Notifications Drawer */}
      <SwipeableDrawer
        anchor="right"
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        onOpen={() => setNotificationsOpen(true)}
        sx={{
          '& .MuiDrawer-paper': {
            width: '100%',
            maxWidth: 400,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
            <Typography variant="h6" fontWeight="bold">
              Notifications
            </Typography>
            <IconButton 
              onClick={() => setNotificationsOpen(false)}
              sx={{ minWidth: 44, minHeight: 44 }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
          
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 8 }}>
            No new notifications
          </Typography>
        </Box>
      </SwipeableDrawer>
    </Box>
  );
};

export default DashboardMobile;
