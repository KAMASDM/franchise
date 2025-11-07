import React, { useState, useEffect } from 'react';
import { Fab, Zoom, useScrollTrigger, Box } from '@mui/material';
import { Send, KeyboardArrowUp } from '@mui/icons-material';

/**
 * Sticky floating action buttons that appear on scroll
 */

export const StickyInquiryCTA = ({ onClick, label = "Inquire Now" }) => {
  const trigger = useScrollTrigger({
    threshold: 300,
    disableHysteresis: true,
  });

  return (
    <Zoom in={trigger}>
      <Fab
        color="primary"
        variant="extended"
        onClick={onClick}
        sx={{
          position: 'fixed',
          bottom: { xs: 80, md: 32 },
          right: { xs: 16, md: 32 },
          zIndex: 1000,
          boxShadow: 6,
          '&:hover': {
            transform: 'scale(1.05)',
          },
          transition: 'all 0.3s ease',
        }}
        aria-label={label}
      >
        <Send sx={{ mr: 1 }} />
        {label}
      </Fab>
    </Zoom>
  );
};

export const ScrollToTop = () => {
  const trigger = useScrollTrigger({
    threshold: 400,
    disableHysteresis: true,
  });

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Zoom in={trigger}>
      <Fab
        size="medium"
        color="secondary"
        onClick={handleClick}
        sx={{
          position: 'fixed',
          bottom: { xs: 16, md: 32 },
          right: { xs: 16, md: 32 },
          zIndex: 999,
          boxShadow: 4,
        }}
        aria-label="scroll to top"
      >
        <KeyboardArrowUp />
      </Fab>
    </Zoom>
  );
};

export const StickyQuickFacts = ({ brand, onInquire }) => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsSticky(offset > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isSticky) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: { xs: 'auto', md: 80 },
        bottom: { xs: 0, md: 'auto' },
        right: 0,
        width: { xs: '100%', md: 300 },
        backgroundColor: 'background.paper',
        boxShadow: { xs: 6, md: 4 },
        zIndex: 998,
        p: 2,
        borderRadius: { xs: '16px 16px 0 0', md: '12px 0 0 12px' },
        borderLeft: { md: '4px solid' },
        borderTop: { xs: '4px solid', md: 'none' },
        borderColor: 'primary.main',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {brand.brandLogo && (
          <img
            src={brand.brandLogo}
            alt={brand.brandName}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              objectFit: 'cover',
              marginRight: 12,
            }}
          />
        )}
        <Box>
          <Box sx={{ fontWeight: 'bold', fontSize: '14px' }}>
            {brand.brandName}
          </Box>
          <Box sx={{ fontSize: '12px', color: 'text.secondary' }}>
            {brand.industries?.[0] || 'Franchise'}
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          fontSize: '13px',
          color: 'text.secondary',
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>Investment:</span>
        <strong>{brand.franchiseDetails?.investmentRange || 'Contact for details'}</strong>
      </Box>

      <Box
        onClick={onInquire}
        sx={{
          backgroundColor: 'primary.main',
          color: 'white',
          textAlign: 'center',
          py: 1.5,
          borderRadius: 2,
          fontWeight: 'bold',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
          transition: 'all 0.2s',
        }}
      >
        Inquire Now
      </Box>
    </Box>
  );
};

export default StickyInquiryCTA;
