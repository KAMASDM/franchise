import React from 'react';
import { Breadcrumbs as MuiBreadcrumbs, Link, Typography, Box } from '@mui/material';
import { NavigateNext, Home } from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

/**
 * Breadcrumb navigation component
 * Automatically generates breadcrumbs based on current route
 */

const routeNameMap = {
  '': 'Home',
  'about': 'About Us',
  'brands': 'Brands',
  'brand': 'Brand Details',
  'blogs': 'Blog',
  'blog': 'Blog Post',
  'contact': 'Contact',
  'faq': 'FAQs',
  'privacy-policy': 'Privacy Policy',
  'terms-and-conditions': 'Terms & Conditions',
  'investors': 'For Investors',
  'dashboard': 'Dashboard',
  'admin': 'Admin',
  'register-brand': 'Register Brand',
  'my-brands': 'My Brands',
  'leads': 'Leads',
  'locations': 'Locations',
  'reviews': 'Reviews',
  'faqs': 'FAQs',
  'settings': 'Settings',
  'help': 'Help & Support',
  'users': 'Users',
  'notifications': 'Notifications',
  'messages': 'Messages',
  'analytics': 'Analytics',
  'chat-leads': 'Chat Leads',
};

const Breadcrumbs = ({ customPaths = {} }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Merge custom paths with default
  const nameMap = { ...routeNameMap, ...customPaths };

  // Don't show breadcrumbs on home page
  if (pathnames.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 3, mt: 2 }}>
      <MuiBreadcrumbs
        separator={<NavigateNext fontSize="small" />}
        aria-label="breadcrumb"
        sx={{
          '& .MuiBreadcrumbs-separator': {
            mx: 0.5,
          },
        }}
      >
        {/* Home link */}
        <Link
          component={RouterLink}
          to="/"
          underline="hover"
          color="inherit"
          sx={{
            display: 'flex',
            alignItems: 'center',
            '&:hover': {
              color: 'primary.main',
            },
          }}
        >
          <Home sx={{ mr: 0.5, fontSize: 18 }} />
          Home
        </Link>

        {/* Dynamic breadcrumbs */}
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          let to = `/${pathnames.slice(0, index + 1).join('/')}`;
          
          // Special handling: if current segment is "brand" (singular), link to "brands" (plural) instead
          if (value === 'brand' && !last) {
            to = '/brands';
          }

          // Get display name
          const displayName = nameMap[value] || decodeURIComponent(value)
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

          return last ? (
            <Typography
              key={to}
              color="text.primary"
              sx={{
                fontWeight: 600,
                maxWidth: 300,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {displayName}
            </Typography>
          ) : (
            <Link
              component={RouterLink}
              key={to}
              to={to}
              underline="hover"
              color="inherit"
              sx={{
                '&:hover': {
                  color: 'primary.main',
                },
                maxWidth: 200,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {displayName}
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs;
