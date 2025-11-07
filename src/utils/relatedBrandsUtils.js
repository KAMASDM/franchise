/**
 * Related Brands Utility
 * Finds and ranks related/similar brands based on various criteria
 */

/**
 * Calculate similarity score between two brands
 * @param {Object} brand1 - First brand to compare
 * @param {Object} brand2 - Second brand to compare
 * @returns {number} - Similarity score (0-100)
 */
export const calculateSimilarity = (brand1, brand2) => {
  let score = 0;

  // Same category (40 points)
  if (brand1.category === brand2.category) {
    score += 40;
  }

  // Same business model (20 points)
  if (brand1.businessModel === brand2.businessModel) {
    score += 20;
  }

  // Similar investment range (20 points)
  if (brand1.minInvestment && brand2.minInvestment) {
    const diff = Math.abs(brand1.minInvestment - brand2.minInvestment);
    const avg = (brand1.minInvestment + brand2.minInvestment) / 2;
    const similarityPercent = Math.max(0, 100 - (diff / avg) * 100);
    score += (similarityPercent / 100) * 20;
  }

  // Same industry tags (10 points)
  if (brand1.industryType === brand2.industryType) {
    score += 10;
  }

  // Geographic overlap (10 points)
  if (brand1.headquarters && brand2.headquarters) {
    if (brand1.headquarters === brand2.headquarters) {
      score += 10;
    }
  }

  return Math.round(score);
};

/**
 * Get related brands based on similarity
 * @param {Object} currentBrand - The current brand to find related brands for
 * @param {Array} allBrands - All available brands
 * @param {number} limit - Maximum number of related brands to return
 * @returns {Array} - Array of related brands sorted by similarity
 */
export const getRelatedBrands = (currentBrand, allBrands, limit = 6) => {
  if (!currentBrand || !allBrands || allBrands.length === 0) {
    return [];
  }

  // Calculate similarity scores for all brands
  const brandsWithScores = allBrands
    .filter(brand => brand.id !== currentBrand.id) // Exclude current brand
    .map(brand => ({
      ...brand,
      similarityScore: calculateSimilarity(currentBrand, brand),
    }))
    .filter(brand => brand.similarityScore > 0) // Only include brands with some similarity
    .sort((a, b) => b.similarityScore - a.similarityScore); // Sort by similarity (highest first)

  return brandsWithScores.slice(0, limit);
};

/**
 * Get brands by category
 * @param {string} category - Category to filter by
 * @param {Array} allBrands - All available brands
 * @param {string} excludeId - Brand ID to exclude (usually current brand)
 * @param {number} limit - Maximum number of brands to return
 * @returns {Array} - Array of brands in the same category
 */
export const getBrandsByCategory = (category, allBrands, excludeId = null, limit = 6) => {
  return allBrands
    .filter(brand => 
      brand.category === category && 
      brand.id !== excludeId
    )
    .slice(0, limit);
};

/**
 * Get brands by investment range
 * @param {number} minInvestment - Minimum investment amount
 * @param {number} maxInvestment - Maximum investment amount
 * @param {Array} allBrands - All available brands
 * @param {string} excludeId - Brand ID to exclude
 * @param {number} limit - Maximum number of brands to return
 * @returns {Array} - Array of brands in the same investment range
 */
export const getBrandsByInvestmentRange = (
  minInvestment,
  maxInvestment,
  allBrands,
  excludeId = null,
  limit = 6
) => {
  const range = maxInvestment - minInvestment;
  const buffer = range * 0.3; // 30% buffer on either side

  return allBrands
    .filter(brand => {
      if (brand.id === excludeId) return false;
      if (!brand.minInvestment) return false;

      return (
        brand.minInvestment >= minInvestment - buffer &&
        brand.minInvestment <= maxInvestment + buffer
      );
    })
    .slice(0, limit);
};

/**
 * Get trending/popular brands
 * @param {Array} allBrands - All available brands
 * @param {string} excludeId - Brand ID to exclude
 * @param {number} limit - Maximum number of brands to return
 * @returns {Array} - Array of popular/featured brands
 */
export const getTrendingBrands = (allBrands, excludeId = null, limit = 6) => {
  return allBrands
    .filter(brand => brand.id !== excludeId)
    .filter(brand => brand.featured || brand.trending || brand.verified)
    .sort((a, b) => {
      // Prioritize featured > trending > verified
      const scoreA = (a.featured ? 3 : 0) + (a.trending ? 2 : 0) + (a.verified ? 1 : 0);
      const scoreB = (b.featured ? 3 : 0) + (b.trending ? 2 : 0) + (b.verified ? 1 : 0);
      return scoreB - scoreA;
    })
    .slice(0, limit);
};

/**
 * Get recently added brands
 * @param {Array} allBrands - All available brands
 * @param {string} excludeId - Brand ID to exclude
 * @param {number} limit - Maximum number of brands to return
 * @param {number} daysRecent - Number of days to consider as "recent" (default 30)
 * @returns {Array} - Array of recently added brands
 */
export const getRecentBrands = (allBrands, excludeId = null, limit = 6, daysRecent = 30) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysRecent);

  return allBrands
    .filter(brand => {
      if (brand.id === excludeId) return false;
      if (!brand.createdAt) return false;

      const brandDate = brand.createdAt.toDate ? brand.createdAt.toDate() : new Date(brand.createdAt);
      return brandDate >= cutoffDate;
    })
    .sort((a, b) => {
      const dateA = a.createdAt.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
      const dateB = b.createdAt.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
      return dateB - dateA;
    })
    .slice(0, limit);
};

export default {
  calculateSimilarity,
  getRelatedBrands,
  getBrandsByCategory,
  getBrandsByInvestmentRange,
  getTrendingBrands,
  getRecentBrands,
};
