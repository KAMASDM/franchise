import { useState, useEffect } from 'react';
import logger from '../utils/logger';

/**
 * Custom hook for managing brand comparison
 * Stores selected brands in localStorage for persistence
 */

const COMPARISON_KEY = 'brand_comparison';
const MAX_COMPARE = 4;

export const useComparison = () => {
  const [comparisonList, setComparisonList] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(COMPARISON_KEY);
      if (saved) {
        setComparisonList(JSON.parse(saved));
      }
    } catch (error) {
      logger.error('Failed to load comparison list:', error);
    }
  }, []);

  // Save to localStorage whenever list changes
  useEffect(() => {
    try {
      localStorage.setItem(COMPARISON_KEY, JSON.stringify(comparisonList));
    } catch (error) {
      logger.error('Failed to save comparison list:', error);
    }
  }, [comparisonList]);

  const addToComparison = (brand) => {
    if (comparisonList.length >= MAX_COMPARE) {
      return { success: false, message: `You can compare up to ${MAX_COMPARE} brands` };
    }

    if (comparisonList.some(b => b.id === brand.id)) {
      return { success: false, message: 'Brand already in comparison' };
    }

    setComparisonList(prev => [...prev, brand]);
    return { success: true, message: 'Added to comparison' };
  };

  const removeFromComparison = (brandId) => {
    setComparisonList(prev => prev.filter(b => b.id !== brandId));
  };

  const clearComparison = () => {
    setComparisonList([]);
  };

  const isInComparison = (brandId) => {
    return comparisonList.some(b => b.id === brandId);
  };

  const canAddMore = comparisonList.length < MAX_COMPARE;

  return {
    comparisonList,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    canAddMore,
    count: comparisonList.length,
    maxCompare: MAX_COMPARE,
  };
};

export default useComparison;
