import { useState, useEffect, useCallback } from 'react';

/**
 * Personalized Recommendations Engine
 * 
 * Uses browsing history, favorites, interactions, and brand similarity
 * to recommend relevant franchises to users.
 */

// Weight factors for recommendation scoring
const WEIGHTS = {
  recentlyViewed: 0.3,
  favorites: 0.4,
  sameCategory: 0.2,
  similarInvestment: 0.15,
  trending: 0.1,
  newBrands: 0.05,
};

/**
 * Calculate similarity score between two brands
 */
const calculateBrandSimilarity = (brand1, brand2) => {
  if (!brand1 || !brand2 || brand1.id === brand2.id) return 0;
  
  let score = 0;
  
  // Same category (high weight)
  if (brand1.category === brand2.category) {
    score += 40;
  }
  
  // Same industry
  if (brand1.industry === brand2.industry) {
    score += 25;
  }
  
  // Similar investment range (within 30%)
  const investment1 = brand1.initialInvestment || 0;
  const investment2 = brand2.initialInvestment || 0;
  
  if (investment1 > 0 && investment2 > 0) {
    const diff = Math.abs(investment1 - investment2);
    const avg = (investment1 + investment2) / 2;
    const percentDiff = (diff / avg) * 100;
    
    if (percentDiff < 30) {
      score += 20;
    } else if (percentDiff < 50) {
      score += 10;
    }
  }
  
  // Similar space requirements
  if (brand1.spaceRequired && brand2.spaceRequired) {
    const spaceDiff = Math.abs(
      parseInt(brand1.spaceRequired) - parseInt(brand2.spaceRequired)
    );
    if (spaceDiff < 500) score += 10;
  }
  
  // Same business model
  if (brand1.businessModel === brand2.businessModel) {
    score += 15;
  }
  
  return score;
};

/**
 * Get recommended brands based on user behavior
 */
export const getRecommendations = (allBrands, userHistory, options = {}) => {
  const {
    limit = 6,
    excludeBrandIds = [],
    includeReasons = true,
  } = options;
  
  if (!allBrands || allBrands.length === 0) return [];
  
  const {
    recentlyViewed = [],
    favorites = [],
    inquiries = [],
  } = userHistory || {};
  
  // Create a map to store brand scores and reasons
  const brandScores = new Map();
  
  allBrands.forEach(brand => {
    // Skip excluded brands
    if (excludeBrandIds.includes(brand.id)) return;
    
    let score = 0;
    const reasons = [];
    
    // Factor 1: Based on recently viewed brands
    recentlyViewed.forEach(viewedBrand => {
      const similarity = calculateBrandSimilarity(viewedBrand, brand);
      if (similarity > 0) {
        score += similarity * WEIGHTS.recentlyViewed;
        if (similarity > 40) {
          reasons.push(`Similar to ${viewedBrand.brandName}`);
        }
      }
    });
    
    // Factor 2: Based on favorite brands (higher weight)
    favorites.forEach(favBrand => {
      const similarity = calculateBrandSimilarity(favBrand, brand);
      if (similarity > 0) {
        score += similarity * WEIGHTS.favorites;
        if (similarity > 40) {
          reasons.push(`Matches your favorites`);
        }
      }
    });
    
    // Factor 3: Based on inquiries
    inquiries.forEach(inquiryBrand => {
      const similarity = calculateBrandSimilarity(inquiryBrand, brand);
      if (similarity > 0) {
        score += similarity * WEIGHTS.favorites; // Same weight as favorites
        if (similarity > 40) {
          reasons.push(`Similar to brands you inquired about`);
        }
      }
    });
    
    // Factor 4: Popular/trending brands (based on view count)
    if (brand.viewCount && brand.viewCount > 100) {
      score += (brand.viewCount / 10) * WEIGHTS.trending;
      if (brand.viewCount > 500) {
        reasons.push('Popular choice');
      }
    }
    
    // Factor 5: New brands (within last 30 days)
    if (brand.createdAt) {
      const daysSinceCreated = (Date.now() - new Date(brand.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceCreated < 30) {
        score += 20 * WEIGHTS.newBrands;
        reasons.push('Recently added');
      }
    }
    
    // Factor 6: High ROI potential
    if (brand.estimatedROI && parseFloat(brand.estimatedROI) > 20) {
      score += 15;
      reasons.push('High ROI potential');
    }
    
    // Factor 7: Low investment options
    if (brand.initialInvestment && brand.initialInvestment < 50000) {
      score += 10;
      reasons.push('Low investment');
    }
    
    if (score > 0) {
      brandScores.set(brand.id, {
        brand,
        score,
        reasons: includeReasons ? [...new Set(reasons)] : [],
      });
    }
  });
  
  // Convert to array and sort by score
  const recommendations = Array.from(brandScores.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  
  return recommendations;
};

/**
 * React hook for personalized recommendations
 */
export const useRecommendations = (allBrands = [], options = {}) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const {
    limit = 6,
    excludeBrandIds = [],
    autoRefresh = true,
  } = options;
  
  // Load user history from localStorage
  const getUserHistory = useCallback(() => {
    try {
      const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      const favorites = JSON.parse(localStorage.getItem('favoriteBrands') || '[]');
      const inquiries = JSON.parse(localStorage.getItem('brandInquiries') || '[]');
      
      return {
        recentlyViewed,
        favorites,
        inquiries: inquiries.map(inq => inq.brand).filter(Boolean),
      };
    } catch (error) {
      console.error('Error loading user history:', error);
      return {
        recentlyViewed: [],
        favorites: [],
        inquiries: [],
      };
    }
  }, []);
  
  const refreshRecommendations = useCallback(() => {
    setLoading(true);
    
    try {
      const userHistory = getUserHistory();
      const recs = getRecommendations(allBrands, userHistory, {
        limit,
        excludeBrandIds,
        includeReasons: true,
      });
      
      setRecommendations(recs);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }, [allBrands, limit, excludeBrandIds, getUserHistory]);
  
  // Initial load and auto-refresh
  useEffect(() => {
    refreshRecommendations();
    
    if (autoRefresh) {
      // Listen for localStorage changes
      const handleStorageChange = (e) => {
        if (
          e.key === 'recentlyViewed' ||
          e.key === 'favoriteBrands' ||
          e.key === 'brandInquiries'
        ) {
          refreshRecommendations();
        }
      };
      
      window.addEventListener('storage', handleStorageChange);
      
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, [refreshRecommendations, autoRefresh]);
  
  return {
    recommendations,
    loading,
    refresh: refreshRecommendations,
  };
};

/**
 * Get category-based recommendations
 */
export const getCategoryRecommendations = (allBrands, category, limit = 6) => {
  return allBrands
    .filter(brand => brand.category === category)
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, limit);
};

/**
 * Get investment range recommendations
 */
export const getInvestmentRangeRecommendations = (allBrands, minInvestment, maxInvestment, limit = 6) => {
  return allBrands
    .filter(brand => {
      const investment = brand.initialInvestment || 0;
      return investment >= minInvestment && investment <= maxInvestment;
    })
    .sort((a, b) => (a.initialInvestment || 0) - (b.initialInvestment || 0))
    .slice(0, limit);
};

export default useRecommendations;
