import { getFunctions, httpsCallable } from 'firebase/functions';

/**
 * AI Content Generation Service
 * Uses Firebase Functions with Google Gemini API for intelligent content assistance
 */

// Initialize Firebase Functions
const functions = getFunctions();
const generateContentFunction = httpsCallable(functions, 'generateContent');

/**
 * Check if AI service is available
 */
export const isAIAvailable = () => {
  // Always available since we're using Firebase Functions
  return true;
};

/**
 * Generate content via Firebase Function
 * @private
 */
const callGenerateContent = async (contentType, brandInfo) => {
  try {
    const result = await generateContentFunction({
      contentType,
      brandInfo,
    });

    return {
      success: true,
      ...result.data,
    };
  } catch (error) {
    console.error('AI generation error:', error);
    return {
      success: false,
      error: error.message || 'Failed to generate content',
    };
  }
};

/**
 * Generate brand description
 * @param {Object} brandInfo - Basic brand information
 * @returns {Promise<Object>} Generated content
 */
export const generateBrandDescription = async (brandInfo) => {
  const result = await callGenerateContent('description', brandInfo);
  
  if (result.success) {
    return {
      success: true,
      content: result.content,
      wordCount: result.content.split(/\s+/).length,
    };
  }
  
  return result;
};

/**
 * Generate USP (Unique Selling Propositions)
 * @param {Object} brandInfo - Brand information
 * @returns {Promise<Object>} Generated USPs
 */
export const generateUSPs = async (brandInfo) => {
  const result = await callGenerateContent('usps', brandInfo);
  
  if (result.success) {
    // Parse USPs from response
    const usps = result.content
      .trim()
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .slice(0, 5);

    return {
      success: true,
      usps,
    };
  }
  
  return result;
};

/**
 * Generate marketing tagline
 * @param {Object} brandInfo - Brand information
 * @returns {Promise<Object>} Generated taglines
 */
export const generateTaglines = async (brandInfo) => {
  const result = await callGenerateContent('taglines', brandInfo);
  
  if (result.success) {
    // Parse taglines from response
    const taglines = result.content
      .trim()
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .slice(0, 5);

    return {
      success: true,
      taglines,
    };
  }
  
  return result;
};

/**
 * Improve/enhance existing content
 * @param {string} content - Original content
 * @param {string} purpose - Purpose of the content
 * @returns {Promise<Object>} Enhanced content
 */
export const enhanceContent = async (content, purpose = 'brand description') => {
  const result = await callGenerateContent('enhance', {
    content,
    purpose,
  });
  
  if (result.success) {
    return {
      success: true,
      content: result.content,
      original: content,
      improvement: calculateImprovement(content, result.content),
    };
  }
  
  return result;
};

/**
 * Generate industry-specific recommendations
 * @param {string} industry - Industry category
 * @returns {Promise<Object>} Industry insights
 */
export const getIndustryInsights = async (industry) => {
  const result = await callGenerateContent('insights', { industry });
  
  if (result.success) {
    return {
      success: true,
      insights: result.content,
      industry,
    };
  }
  
  return result;
};

/**
 * Generate franchise partner profile
 * @param {Object} brandInfo - Brand information
 * @returns {Promise<Object>} Ideal partner profile
 */
export const generatePartnerProfile = async (brandInfo) => {
  const result = await callGenerateContent('partnerProfile', brandInfo);
  
  if (result.success) {
    return {
      success: true,
      profile: result.content,
    };
  }
  
  return result;
};

/**
 * Generate training program outline
 * @param {Object} brandInfo - Brand information
 * @returns {Promise<Object>} Training outline
 */
export const generateTrainingOutline = async (brandInfo) => {
  // Note: This would need a new endpoint in Firebase Functions
  // For now, using insights endpoint as placeholder
  const result = await callGenerateContent('insights', {
    industry: brandInfo.industry,
    brandName: brandInfo.brandName,
  });
  
  return result;
};

/**
 * Calculate improvement score (simple heuristic)
 * @private
 */
const calculateImprovement = (original, enhanced) => {
  const metrics = {
    originalLength: original.split(/\s+/).length,
    enhancedLength: enhanced.split(/\s+/).length,
    readabilityScore: enhanced.split(/[.!?]/).length, // sentence count
  };

  return metrics;
};

/**
 * Generate multiple content suggestions at once
 * @param {Object} brandInfo - Complete brand information
 * @returns {Promise<Object>} All generated content
 */
export const generateCompleteBrandContent = async (brandInfo) => {
  try {
    // Generate all content in parallel for speed
    const [description, usps, taglines, insights, partnerProfile] = await Promise.all([
      generateBrandDescription(brandInfo),
      generateUSPs(brandInfo),
      generateTaglines(brandInfo),
      getIndustryInsights(brandInfo.industry || 'Retail'),
      generatePartnerProfile(brandInfo),
    ]);

    return {
      success: true,
      description,
      usps,
      taglines,
      insights,
      partnerProfile,
    };
  } catch (error) {
    console.error('AI generation error:', error);
    return {
      success: false,
      error: error.message || 'Failed to generate content',
    };
  }
};

export default {
  isAIAvailable,
  generateBrandDescription,
  generateUSPs,
  generateTaglines,
  enhanceContent,
  getIndustryInsights,
  generatePartnerProfile,
  generateTrainingOutline,
  generateCompleteBrandContent,
};
