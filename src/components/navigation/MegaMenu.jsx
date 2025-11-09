/**
 * Enterprise Mega Menu Component
 * Categorized navigation with hover panels
 */

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Container,
  useTheme,
  alpha,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  Business as BusinessIcon,
  TrendingUp as InvestorIcon,
  School as ResourcesIcon,
  Dashboard as DashboardIcon,
  AppRegistration as RegisterIcon,
  Support as SupportIcon,
  Store as BrowseIcon,
  Compare as CompareIcon,
  Calculate as CalculatorIcon,
  Article as BlogIcon,
  Help as FAQIcon,
  MenuBook as GuideIcon,
  EmojiEvents as SuccessIcon,
  VideoLibrary as WebinarIcon,
  Assessment as ReportsIcon,
  Forum as CommunityIcon,
  Email as ContactIcon,
  ArrowForward,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const MotionPaper = motion(Paper);
const MotionBox = motion(Box);

/**
 * Menu configuration
 */
const megaMenuConfig = {
  franchisors: {
    title: 'For Franchisors',
    icon: <BusinessIcon />,
    description: 'List your franchise and connect with investors',
    color: 'primary',
    sections: [
      {
        title: 'Get Started',
        items: [
          { 
            label: 'Register Your Brand', 
            path: '/dashboard/register-brand', 
            icon: <RegisterIcon />,
            description: 'List your franchise opportunity'
          },
          { 
            label: 'Franchisor Dashboard', 
            path: '/dashboard', 
            icon: <DashboardIcon />,
            description: 'Manage your listings and leads'
          },
          { 
            label: 'Support & Training', 
            path: '/dashboard/help', 
            icon: <SupportIcon />,
            description: 'Get help from our team'
          },
        ],
      },
      {
        title: 'Resources',
        items: [
          { 
            label: 'Success Stories', 
            path: '/success-stories', 
            icon: <SuccessIcon />,
            description: 'Learn from other franchisors'
          },
          { 
            label: 'Marketing Tools', 
            path: '/marketing-tools', 
            icon: <ResourcesIcon />,
            description: 'Promote your franchise effectively'
          },
          { 
            label: 'Analytics & Reports', 
            path: '/dashboard/analytics', 
            icon: <ReportsIcon />,
            description: 'Track your performance'
          },
        ],
      },
    ],
    featured: {
      title: 'Why List With Us?',
      description: 'Join 1000+ successful franchise brands',
      cta: 'Get Started',
      ctaPath: '/dashboard/register-brand',
      stats: [
        { label: 'Active Brands', value: '1,234' },
        { label: 'Investors', value: '5,678' },
        { label: 'Connections', value: '₹890M' },
      ],
    },
  },
  
  investors: {
    title: 'For Investors',
    icon: <InvestorIcon />,
    description: 'Find and invest in verified franchises',
    color: 'secondary',
    sections: [
      {
        title: 'Discover',
        items: [
          { 
            label: 'Browse Franchises', 
            path: '/brands', 
            icon: <BrowseIcon />,
            description: 'Explore all opportunities'
          },
          { 
            label: 'Compare Brands', 
            path: '/compare', 
            icon: <CompareIcon />,
            description: 'Side-by-side comparison'
          },
          { 
            label: 'ROI Calculator', 
            path: '/calculator', 
            icon: <CalculatorIcon />,
            description: 'Calculate potential returns'
          },
        ],
      },
      {
        title: 'Learn',
        items: [
          { 
            label: 'How It Works', 
            path: '/how-it-works', 
            icon: <GuideIcon />,
            description: 'Step-by-step guide'
          },
          { 
            label: 'Webinars', 
            path: '/webinars', 
            icon: <WebinarIcon />,
            description: 'Free franchise education'
          },
          { 
            label: 'FAQs', 
            path: '/faq', 
            icon: <FAQIcon />,
            description: 'Get your questions answered'
          },
        ],
      },
    ],
    featured: {
      title: 'Investment Range',
      description: 'Find franchises matching your budget',
      cta: 'Browse All',
      ctaPath: '/brands',
      ranges: [
        { label: 'Under ₹50K', count: '45 brands' },
        { label: '₹50K - ₹1M', count: '123 brands' },
        { label: 'Over ₹1M', count: '67 brands' },
      ],
    },
  },
  
  resources: {
    title: 'Resources',
    icon: <ResourcesIcon />,
    description: 'Learn about franchising',
    color: 'info',
    sections: [
      {
        title: 'Knowledge Base',
        items: [
          { 
            label: 'Blog', 
            path: '/blogs', 
            icon: <BlogIcon />,
            description: 'Latest franchise insights'
          },
          { 
            label: 'Success Stories', 
            path: '/success-stories', 
            icon: <SuccessIcon />,
            description: 'Inspiring case studies'
          },
          { 
            label: 'Guides & eBooks', 
            path: '/guides', 
            icon: <GuideIcon />,
            description: 'Downloadable resources'
          },
        ],
      },
      {
        title: 'Support',
        items: [
          { 
            label: 'FAQs', 
            path: '/faq', 
            icon: <FAQIcon />,
            description: 'Common questions'
          },
          { 
            label: 'Community Forum', 
            path: '/community', 
            icon: <CommunityIcon />,
            description: 'Connect with others'
          },
          { 
            label: 'Contact Us', 
            path: '/contact', 
            icon: <ContactIcon />,
            description: 'Get in touch'
          },
        ],
      },
    ],
    featured: {
      title: 'Latest Articles',
      description: 'Stay updated with franchise trends',
      cta: 'View Blog',
      ctaPath: '/blogs',
      articles: [
        '10 Tips for First-Time Franchisees',
        'How to Evaluate Franchise ROI',
        'Top Industries for 2025',
      ],
    },
  },
};

/**
 * Menu Section Component
 */
const MenuSection = ({ section }) => {
  const theme = useTheme();
  
  return (
    <Box>
      <Typography 
        variant="overline" 
        sx={{ 
          color: 'text.secondary', 
          fontWeight: 600,
          display: 'block',
          mb: 1.5,
        }}
      >
        {section.title}
      </Typography>
      <List disablePadding>
        {section.items.map((item, idx) => (
          <ListItem
            key={idx}
            component={RouterLink}
            to={item.path}
            sx={{
              borderRadius: 1.5,
              mb: 0.5,
              transition: theme.transitions.create(['background-color', 'transform']),
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                transform: 'translateX(4px)',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              secondary={item.description}
              primaryTypographyProps={{ 
                variant: 'body2', 
                fontWeight: 500,
              }}
              secondaryTypographyProps={{ 
                variant: 'caption',
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

/**
 * Featured Section Component
 */
const FeaturedSection = ({ featured, color }) => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        bgcolor: alpha(theme.palette[color].main, 0.05),
        borderRadius: 2,
        p: 3,
        height: '100%',
      }}
    >
      <Typography variant="h6" fontWeight="600" gutterBottom>
        {featured.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {featured.description}
      </Typography>
      
      {/* Stats */}
      {featured.stats && (
        <Box sx={{ mb: 2 }}>
          {featured.stats.map((stat, idx) => (
            <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {stat.label}
              </Typography>
              <Typography variant="body2" fontWeight="600">
                {stat.value}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
      
      {/* Investment Ranges */}
      {featured.ranges && (
        <Box sx={{ mb: 2 }}>
          {featured.ranges.map((range, idx) => (
            <Box key={idx} sx={{ mb: 1.5 }}>
              <Typography variant="body2" fontWeight="500">
                {range.label}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {range.count}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
      
      {/* Articles */}
      {featured.articles && (
        <List dense disablePadding sx={{ mb: 2 }}>
          {featured.articles.map((article, idx) => (
            <ListItem key={idx} sx={{ px: 0 }}>
              <Typography variant="body2" color="text.secondary">
                • {article}
              </Typography>
            </ListItem>
          ))}
        </List>
      )}
      
      <Button
        component={RouterLink}
        to={featured.ctaPath}
        variant="contained"
        color={color}
        endIcon={<ArrowForward />}
        fullWidth
        sx={{ mt: 'auto' }}
      >
        {featured.cta}
      </Button>
    </Box>
  );
};

/**
 * Mega Menu Panel Component
 */
const MegaMenuPanel = ({ menuKey, onClose }) => {
  const theme = useTheme();
  const config = megaMenuConfig[menuKey];
  
  if (!config) return null;
  
  return (
    <MotionPaper
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      elevation={8}
      sx={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        mt: 0.5,
        borderRadius: 2,
        overflow: 'hidden',
        zIndex: theme.zIndex.modal,
      }}
    >
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Menu Sections */}
          {config.sections.map((section, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <MenuSection section={section} />
            </Grid>
          ))}
          
          {/* Featured Section */}
          <Grid item xs={12} md={6}>
            <FeaturedSection featured={config.featured} color={config.color} />
          </Grid>
        </Grid>
      </Container>
    </MotionPaper>
  );
};

/**
 * Main Mega Menu Component
 */
const MegaMenu = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const theme = useTheme();
  
  const handleMenuEnter = (menuKey) => {
    setActiveMenu(menuKey);
  };
  
  const handleMenuLeave = () => {
    setActiveMenu(null);
  };
  
  return (
    <Box
      sx={{ position: 'relative' }}
      onMouseLeave={handleMenuLeave}
    >
      {/* Menu Triggers */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        {Object.entries(megaMenuConfig).map(([key, config]) => (
          <Button
            key={key}
            onMouseEnter={() => handleMenuEnter(key)}
            color="inherit"
            startIcon={config.icon}
            sx={{
              fontWeight: 500,
              px: 2,
              borderBottom: activeMenu === key ? `2px solid ${theme.palette[config.color].main}` : '2px solid transparent',
              borderRadius: 0,
              transition: theme.transitions.create(['border-color', 'background-color']),
              '&:hover': {
                bgcolor: alpha(theme.palette[config.color].main, 0.08),
              },
            }}
          >
            {config.title}
          </Button>
        ))}
      </Box>
      
      {/* Menu Panels */}
      <AnimatePresence>
        {activeMenu && (
          <MegaMenuPanel 
            menuKey={activeMenu} 
            onClose={handleMenuLeave}
          />
        )}
      </AnimatePresence>
    </Box>
  );
};

export default MegaMenu;
