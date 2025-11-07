import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'recentlyViewedBrands';
const MAX_RECENT_ITEMS = 10;

/**
 * Custom hook for tracking and retrieving recently viewed brands
 * Stores brand data in localStorage for persistence
 * 
 * @returns {Object} - { recentBrands, addRecentBrand, clearRecentBrands }
 */
export const useRecentlyViewed = () => {
  const [recentBrands, setRecentBrands] = useState([]);

  // Load recent brands from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setRecentBrands(parsed);
      }
    } catch (error) {
      console.error('Error loading recently viewed brands:', error);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Add a brand to recently viewed
  const addRecentBrand = useCallback((brand) => {
    if (!brand || !brand.id) return;

    setRecentBrands(prev => {
      // Remove if already exists (to move to front)
      const filtered = prev.filter(b => b.id !== brand.id);
      
      // Add to front of array
      const updated = [
        {
          id: brand.id,
          brandName: brand.brandName,
          brandLogo: brand.brandLogo,
          brandImage: brand.brandImage,
          category: brand.category,
          industries: brand.industries,
          slug: brand.slug,
          initialFranchiseFee: brand.initialFranchiseFee,
          viewedAt: new Date().toISOString(),
        },
        ...filtered,
      ].slice(0, MAX_RECENT_ITEMS); // Keep only the most recent items

      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving recently viewed brands:', error);
      }

      return updated;
    });
  }, []);

  // Clear all recently viewed brands
  const clearRecentBrands = useCallback(() => {
    setRecentBrands([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing recently viewed brands:', error);
    }
  }, []);

  return {
    recentBrands,
    addRecentBrand,
    clearRecentBrands,
  };
};

/**
 * Get recently viewed brands from localStorage (non-hook version)
 * Useful for server-side or non-component contexts
 * 
 * @returns {Array} - Array of recently viewed brands
 */
export const getRecentlyViewedBrands = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error getting recently viewed brands:', error);
    return [];
  }
};

/**
 * Add a brand to recently viewed (non-hook version)
 * @param {Object} brand - Brand object to add
 */
export const addToRecentlyViewed = (brand) => {
  if (!brand || !brand.id) return;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const current = stored ? JSON.parse(stored) : [];
    
    // Remove if already exists
    const filtered = current.filter(b => b.id !== brand.id);
    
    // Add to front
    const updated = [
      {
        id: brand.id,
        brandName: brand.brandName,
        brandLogo: brand.brandLogo,
        brandImage: brand.brandImage,
        category: brand.category,
        industries: brand.industries,
        slug: brand.slug,
        initialFranchiseFee: brand.initialFranchiseFee,
        viewedAt: new Date().toISOString(),
      },
      ...filtered,
    ].slice(0, MAX_RECENT_ITEMS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error adding to recently viewed:', error);
  }
};

export default useRecentlyViewed;
