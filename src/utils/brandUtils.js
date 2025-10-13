// Utility functions for brand navigation and URL generation

/**
 * Generates a URL-friendly slug from a brand name
 * @param {string} brandName - The brand name to convert to slug
 * @returns {string} - URL-friendly slug
 */
export const generateBrandSlug = (brandName) => {
  if (!brandName) return '';
  
  return brandName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Converts a slug back to a brand name for database queries
 * @param {string} slug - The URL slug to convert back
 * @returns {string} - Brand name with proper capitalization
 */
export const slugToBrandName = (slug) => {
  if (!slug) return '';
  
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Generates a brand URL for navigation
 * @param {object} brand - Brand object with brandName and id
 * @returns {string} - Complete URL path for brand navigation
 */
export const getBrandUrl = (brand) => {
  if (!brand) return '/brands';
  
  const slug = generateBrandSlug(brand.brandName);
  return `/brands/${slug || brand.id}`;
};