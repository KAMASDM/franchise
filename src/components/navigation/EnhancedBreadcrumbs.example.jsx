/**
 * Enhanced Breadcrumbs Usage Examples
 * Demonstrates how to integrate breadcrumbs across different pages
 */

import React from 'react';
import { Container, Box } from '@mui/material';
import EnhancedBreadcrumbs from '../components/navigation/EnhancedBreadcrumbs';
import {
  Business as BrandIcon,
  Category as CategoryIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';

/**
 * Example 1: Simple Breadcrumbs (Brand Detail Page)
 */
const BrandDetailPage = () => {
  const breadcrumbItems = [
    {
      label: 'Home',
      path: '/',
    },
    {
      label: 'Brands',
      path: '/brands',
      siblings: [
        { 
          label: 'All Brands', 
          path: '/brands',
          description: 'Browse all franchise opportunities',
        },
        { 
          label: 'Food & Beverage', 
          path: '/brands/food',
          description: 'Restaurant and cafe franchises',
        },
        { 
          label: 'Retail', 
          path: '/brands/retail',
          description: 'Shop and store franchises',
        },
      ],
    },
    {
      label: 'McDonald\'s',
      path: '/brands/mcdonalds',
      icon: <BrandIcon fontSize="small" />,
      // No siblings on current page
    },
  ];

  return (
    <Container maxWidth="xl">
      <EnhancedBreadcrumbs 
        items={breadcrumbItems}
        showBackButton={true}
      />
      {/* Rest of page content */}
    </Container>
  );
};

/**
 * Example 2: Deep Navigation with Sibling Pages
 */
const BrandAnalyticsPage = () => {
  const breadcrumbItems = [
    {
      label: 'Home',
      path: '/',
    },
    {
      label: 'Dashboard',
      path: '/dashboard',
      siblings: [
        { label: 'Overview', path: '/dashboard' },
        { label: 'My Brands', path: '/dashboard/brands' },
        { label: 'Messages', path: '/dashboard/messages' },
        { label: 'Settings', path: '/dashboard/settings' },
      ],
    },
    {
      label: 'My Brands',
      path: '/dashboard/brands',
      siblings: [
        { label: 'Starbucks Coffee', path: '/dashboard/brands/starbucks' },
        { label: 'Subway', path: '/dashboard/brands/subway' },
        { label: 'Domino\'s Pizza', path: '/dashboard/brands/dominos' },
      ],
    },
    {
      label: 'Starbucks Coffee',
      path: '/dashboard/brands/starbucks',
      icon: <BrandIcon fontSize="small" />,
      siblings: [
        { label: 'Overview', path: '/dashboard/brands/starbucks' },
        { label: 'Analytics', path: '/dashboard/brands/starbucks/analytics' },
        { label: 'Leads', path: '/dashboard/brands/starbucks/leads' },
        { label: 'Documents', path: '/dashboard/brands/starbucks/documents' },
      ],
    },
    {
      label: 'Analytics',
      path: '/dashboard/brands/starbucks/analytics',
    },
  ];

  return (
    <Container maxWidth="xl">
      <EnhancedBreadcrumbs 
        items={breadcrumbItems}
        showBackButton={true}
        maxItems={4}
      />
      {/* Analytics content */}
    </Container>
  );
};

/**
 * Example 3: Category Browsing with Siblings
 */
const CategoryBrandsPage = ({ category }) => {
  const breadcrumbItems = [
    {
      label: 'Home',
      path: '/',
    },
    {
      label: 'Browse',
      path: '/browse',
      siblings: [
        { label: 'All Categories', path: '/browse' },
        { label: 'By Investment', path: '/browse/investment' },
        { label: 'By Location', path: '/browse/location' },
        { label: 'Top Rated', path: '/browse/top-rated' },
      ],
    },
    {
      label: category,
      path: `/browse/${category.toLowerCase().replace(/\s+/g, '-')}`,
      icon: <CategoryIcon fontSize="small" />,
      siblings: [
        { label: 'Food & Beverage', path: '/browse/food-beverage' },
        { label: 'Retail', path: '/browse/retail' },
        { label: 'Services', path: '/browse/services' },
        { label: 'Education', path: '/browse/education' },
        { label: 'Healthcare', path: '/browse/healthcare' },
      ],
    },
  ];

  return (
    <Container maxWidth="xl">
      <EnhancedBreadcrumbs 
        items={breadcrumbItems}
        showBackButton={false}
      />
      {/* Category listing */}
    </Container>
  );
};

/**
 * Example 4: Mobile-Optimized Breadcrumbs
 */
const MobileExample = () => {
  const longBreadcrumbPath = [
    { label: 'Home', path: '/' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'My Brands', path: '/dashboard/brands' },
    { label: 'Food & Beverage', path: '/dashboard/brands/food' },
    { label: 'Fast Food', path: '/dashboard/brands/food/fast-food' },
    { label: 'Burger Chains', path: '/dashboard/brands/food/fast-food/burgers' },
    { label: 'McDonald\'s', path: '/dashboard/brands/mcdonalds' },
    { label: 'Analytics', path: '/dashboard/brands/mcdonalds/analytics' },
  ];

  return (
    <Container maxWidth="xl">
      {/* Will automatically collapse on mobile */}
      <EnhancedBreadcrumbs 
        items={longBreadcrumbPath}
        showBackButton={true}
        maxItems={4}
      />
    </Container>
  );
};

/**
 * Utility: Generate breadcrumbs from route
 */
export const generateBreadcrumbs = (pathname, brandsData = {}) => {
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs = [{ label: 'Home', path: '/' }];

  let currentPath = '';
  
  paths.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Capitalize and format segment
    let label = segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
    
    // Override with custom labels if available
    const customLabels = {
      'brands': 'Brands',
      'dashboard': 'Dashboard',
      'browse': 'Browse',
    };
    
    if (customLabels[segment]) {
      label = customLabels[segment];
    }
    
    // Add siblings for specific routes
    let siblings = [];
    if (segment === 'brands' && index === paths.length - 2) {
      // Get other brands in same category
      siblings = brandsData.sameCategoryBrands?.map(brand => ({
        label: brand.name,
        path: `/brands/${brand.slug}`,
      })) || [];
    }
    
    breadcrumbs.push({
      label,
      path: currentPath,
      siblings,
    });
  });

  return breadcrumbs;
};

/**
 * Usage with React Router
 */
const RouteBasedBreadcrumbs = () => {
  const location = useLocation();
  const breadcrumbs = generateBreadcrumbs(location.pathname);

  return (
    <EnhancedBreadcrumbs 
      items={breadcrumbs}
      showBackButton={true}
    />
  );
};

/**
 * Integration Tips:
 * 
 * 1. Route-Based Generation:
 *    - Use generateBreadcrumbs() to auto-create from URL
 *    - Override labels with custom mapping
 *    - Add siblings dynamically based on context
 * 
 * 2. Sibling Pages:
 *    - Add related pages at each level
 *    - Use descriptions for clarity
 *    - Limit to 5-10 siblings for usability
 * 
 * 3. Mobile Optimization:
 *    - Component auto-collapses on mobile
 *    - Shows ellipsis for long paths
 *    - Back button for easy navigation
 * 
 * 4. Icons:
 *    - Add icons to important items
 *    - Home icon automatically added to first item
 *    - Use sparingly for visual clarity
 * 
 * 5. Performance:
 *    - Memoize breadcrumb generation
 *    - Use React.memo for BreadcrumbItem
 *    - Keep sibling lists reasonable
 */

export { 
  BrandDetailPage, 
  BrandAnalyticsPage, 
  CategoryBrandsPage,
  RouteBasedBreadcrumbs,
  generateBreadcrumbs,
};
