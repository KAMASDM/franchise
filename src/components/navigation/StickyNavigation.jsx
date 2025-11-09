/**
 * Sticky Navigation with Scroll Trigger
 * Compact header on scroll
 */

import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  useTheme,
  alpha,
  Slide,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Login as LoginIcon, Dashboard as DashboardIcon } from '@mui/icons-material';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import FranchiseHubLogo from '../common/FranchiseHubLogo';
import MegaMenu from './MegaMenu';
import DarkModeToggle from '../common/DarkModeToggle';
import LanguageSelector from '../common/LanguageSelector';

const MotionAppBar = motion(AppBar);

const StickyNavigation = ({ onSignIn }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const { scrollY } = useScroll();
  
  // Logo width animation based on scroll
  const logoWidth = useTransform(scrollY, [0, 100], [200, 150]);
  const logoHeight = useTransform(scrollY, [0, 100], [60, 45]);
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine if scrolled past threshold
      setIsScrolled(currentScrollY > 50);
      
      // Show/hide on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);
  
  return (
    <Slide in={isVisible} direction="down">
      <MotionAppBar
        position="sticky"
        elevation={isScrolled ? 4 : 0}
        sx={{
          bgcolor: isScrolled 
            ? alpha(theme.palette.background.paper, 0.95)
            : 'background.paper',
          backdropFilter: isScrolled ? 'blur(10px)' : 'none',
          borderBottom: `1px solid ${theme.palette.divider}`,
          transition: theme.transitions.create(['background-color', 'padding', 'box-shadow'], {
            duration: 300,
          }),
        }}
      >
        <Toolbar 
          sx={{ 
            py: isScrolled ? 0.5 : 1.5,
            transition: theme.transitions.create('padding'),
          }}
        >
          {/* Logo */}
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              mr: 4,
            }}
          >
            <motion.div
              style={{
                width: logoWidth,
                height: logoHeight,
              }}
            >
              <FranchiseHubLogo variant="full" width={200} height={60} />
            </motion.div>
          </Box>
          
          {/* Mega Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <MegaMenu />
          </Box>
          
          {/* Right Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DarkModeToggle />
            <LanguageSelector />
            
            {user ? (
              <Button
                component={RouterLink}
                to="/dashboard"
                variant="contained"
                color="primary"
                startIcon={<DashboardIcon />}
                sx={{ ml: 1 }}
              >
                Dashboard
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                startIcon={<LoginIcon />}
                onClick={onSignIn}
                sx={{ ml: 1 }}
              >
                Sign In
              </Button>
            )}
          </Box>
        </Toolbar>
      </MotionAppBar>
    </Slide>
  );
};

export default StickyNavigation;
