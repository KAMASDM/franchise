/**
 * Enhanced Breadcrumbs Component
 * Features: Sibling page dropdown, visual hierarchy, mobile-friendly collapsed view
 */

import React, { useState } from 'react';
import {
  Breadcrumbs,
  Link,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import {
  NavigateNext as NextIcon,
  Home as HomeIcon,
  ExpandMore as ExpandIcon,
  ArrowBack as BackIcon,
  MoreHoriz as MoreIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const MotionBox = motion(Box);

/**
 * Enhanced Breadcrumb Item with optional sibling navigation
 */
const BreadcrumbItem = ({ 
  path, 
  label, 
  siblings = [], 
  isLast = false, 
  icon = null,
  isMobile = false,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const hasSiblings = siblings.length > 0;

  const handleClick = (e) => {
    if (hasSiblings && !isLast) {
      e.preventDefault();
      setAnchorEl(e.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSiblingClick = (siblingPath) => {
    navigate(siblingPath);
    handleClose();
  };

  if (isLast) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {icon && <Box sx={{ display: 'flex', color: 'primary.main' }}>{icon}</Box>}
        <Typography
          color="text.primary"
          fontWeight={600}
          sx={{
            fontSize: isMobile ? '0.875rem' : '0.95rem',
            maxWidth: isMobile ? 150 : 'none',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Link
        component={RouterLink}
        to={path}
        underline="hover"
        color="inherit"
        onClick={handleClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          fontSize: isMobile ? '0.813rem' : '0.875rem',
          color: 'text.secondary',
          cursor: hasSiblings ? 'pointer' : 'default',
          transition: 'all 0.2s',
          '&:hover': {
            color: hasSiblings ? 'primary.main' : 'text.primary',
            transform: hasSiblings ? 'translateY(-1px)' : 'none',
          },
        }}
      >
        {icon && <Box sx={{ display: 'flex' }}>{icon}</Box>}
        <span>{label}</span>
        {hasSiblings && (
          <ExpandIcon 
            fontSize="small" 
            sx={{ 
              ml: -0.5,
              transition: 'transform 0.2s',
              transform: anchorEl ? 'rotate(180deg)' : 'rotate(0deg)',
            }} 
          />
        )}
      </Link>

      {/* Sibling Pages Menu */}
      {hasSiblings && (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          PaperProps={{
            elevation: 8,
            sx: {
              mt: 1,
              minWidth: 200,
              maxWidth: 300,
              maxHeight: 400,
              overflow: 'auto',
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
            },
          }}
        >
          <MenuItem disabled>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              Related Pages
            </Typography>
          </MenuItem>
          {siblings.map((sibling, index) => (
            <MenuItem
              key={index}
              onClick={() => handleSiblingClick(sibling.path)}
              sx={{
                py: 1,
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  {sibling.label}
                </Typography>
                {sibling.description && (
                  <Typography variant="caption" color="text.secondary">
                    {sibling.description}
                  </Typography>
                )}
              </Box>
            </MenuItem>
          ))}
        </Menu>
      )}
    </>
  );
};

/**
 * Enhanced Breadcrumbs Component
 */
const EnhancedBreadcrumbs = ({ 
  items = [], 
  showBackButton = false,
  maxItems = 4,
  className,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [showAll, setShowAll] = useState(false);

  // Determine if breadcrumbs should be collapsed
  const shouldCollapse = items.length > maxItems && !showAll;
  
  // Get displayed items
  const displayedItems = shouldCollapse
    ? [
        items[0], // Home
        { label: '...', path: '#', isEllipsis: true },
        ...items.slice(-2), // Last 2 items
      ]
    : items;

  const handleBack = () => {
    navigate(-1);
  };

  const handleEllipsisClick = (e) => {
    e.preventDefault();
    setShowAll(true);
  };

  if (items.length === 0) return null;

  return (
    <MotionBox
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        py: isMobile ? 1.5 : 2,
        px: isMobile ? 0 : 0,
        borderRadius: 1,
      }}
    >
      {/* Back Button */}
      {showBackButton && (
        <IconButton
          onClick={handleBack}
          size="small"
          sx={{
            color: 'text.secondary',
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              color: 'primary.main',
            },
          }}
        >
          <BackIcon fontSize="small" />
        </IconButton>
      )}

      {/* Breadcrumbs */}
      <Breadcrumbs
        separator={
          <NextIcon 
            fontSize="small" 
            sx={{ 
              color: 'text.disabled',
              mx: isMobile ? -0.5 : 0,
            }} 
          />
        }
        aria-label="breadcrumb"
        maxItems={isMobile ? 3 : isTablet ? 4 : undefined}
        sx={{
          '& .MuiBreadcrumbs-ol': {
            flexWrap: isMobile ? 'nowrap' : 'wrap',
          },
          '& .MuiBreadcrumbs-separator': {
            mx: isMobile ? 0.5 : 1,
          },
        }}
      >
        {displayedItems.map((item, index) => {
          const isLast = index === displayedItems.length - 1;
          
          // Handle ellipsis
          if (item.isEllipsis) {
            return (
              <IconButton
                key="ellipsis"
                size="small"
                onClick={handleEllipsisClick}
                sx={{
                  color: 'text.secondary',
                  p: 0.5,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    color: 'primary.main',
                  },
                }}
              >
                <MoreIcon fontSize="small" />
              </IconButton>
            );
          }

          return (
            <BreadcrumbItem
              key={item.path || index}
              path={item.path}
              label={item.label}
              siblings={item.siblings || []}
              isLast={isLast}
              icon={index === 0 ? <HomeIcon fontSize="small" /> : item.icon}
              isMobile={isMobile}
            />
          );
        })}
      </Breadcrumbs>

      {/* Optional: Current Page Badge (for mobile) */}
      {isMobile && items.length > 2 && (
        <Chip
          label={`${items.length} levels`}
          size="small"
          sx={{
            height: 20,
            fontSize: '0.7rem',
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: 'primary.main',
            fontWeight: 600,
          }}
        />
      )}
    </MotionBox>
  );
};

export default EnhancedBreadcrumbs;
