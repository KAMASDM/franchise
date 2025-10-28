import { useMediaQuery, useTheme } from '@mui/material';
import { useMemo } from 'react';

/**
 * Custom hook to detect device type and provide responsive utilities
 * @returns {Object} Device information and utilities
 */
export const useDevice = () => {
  const theme = useTheme();
  
  // Breakpoint queries
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  const isMd = useMediaQuery(theme.breakpoints.only('md'));
  const isLg = useMediaQuery(theme.breakpoints.only('lg'));
  const isXl = useMediaQuery(theme.breakpoints.only('xl'));
  
  // Range queries
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // xs only
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md')); // sm-md
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg')); // lg+
  
  // Specific checks
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery('(max-width:375px)');
  const isTouchDevice = useMemo(() => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);
  
  // Orientation
  const isPortrait = useMediaQuery('(orientation: portrait)');
  const isLandscape = useMediaQuery('(orientation: landscape)');
  
  // PWA detection
  const isPWA = useMemo(() => {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true;
  }, []);
  
  // Device type
  const deviceType = useMemo(() => {
    if (isMobile) return 'mobile';
    if (isTablet) return 'tablet';
    return 'desktop';
  }, [isMobile, isTablet]);
  
  // Responsive spacing helper
  const spacing = useMemo(() => ({
    xs: isMobile ? 1 : 2,
    sm: isMobile ? 2 : 3,
    md: isMobile ? 3 : 4,
    lg: isMobile ? 4 : 6,
    xl: isMobile ? 6 : 8,
  }), [isMobile]);
  
  // Responsive typography
  const fontSize = useMemo(() => ({
    h1: isMobile ? '2rem' : isTablet ? '2.5rem' : '3rem',
    h2: isMobile ? '1.75rem' : isTablet ? '2rem' : '2.5rem',
    h3: isMobile ? '1.5rem' : isTablet ? '1.75rem' : '2rem',
    h4: isMobile ? '1.25rem' : isTablet ? '1.5rem' : '1.75rem',
    h5: isMobile ? '1.125rem' : isTablet ? '1.25rem' : '1.5rem',
    h6: isMobile ? '1rem' : isTablet ? '1.125rem' : '1.25rem',
    body1: isMobile ? '0.875rem' : '1rem',
    body2: isMobile ? '0.75rem' : '0.875rem',
  }), [isMobile, isTablet]);
  
  // Responsive container
  const containerMaxWidth = useMemo(() => {
    if (isMobile) return 'xs';
    if (isTablet) return 'md';
    if (isDesktop) return 'xl';
    return 'xl';
  }, [isMobile, isTablet, isDesktop]);
  
  // Grid columns
  const gridColumns = useMemo(() => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    if (isLg) return 3;
    return 4;
  }, [isMobile, isTablet, isLg]);
  
  return {
    // Breakpoint booleans
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    
    // Range booleans
    isMobile,
    isTablet,
    isDesktop,
    isMobileOrTablet,
    isSmallMobile,
    
    // Device characteristics
    isTouchDevice,
    isPWA,
    isPortrait,
    isLandscape,
    deviceType,
    
    // Helpers
    spacing,
    fontSize,
    containerMaxWidth,
    gridColumns,
    
    // Responsive values helper
    getValue: (mobileValue, tabletValue, desktopValue) => {
      if (isMobile) return mobileValue;
      if (isTablet) return tabletValue ?? mobileValue;
      return desktopValue ?? tabletValue ?? mobileValue;
    },
  };
};

export default useDevice;
