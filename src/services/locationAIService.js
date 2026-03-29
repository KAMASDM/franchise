import { GoogleGenerativeAI } from '@google/generative-ai';
import logger from '../utils/logger';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  logger.warn('VITE_GEMINI_API_KEY is not set. Location AI features will be unavailable.');
}
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

/**
 * AI-Powered Location Analysis Service
 * Uses Gemini AI to provide intelligent insights for franchise locations
 */

export const locationAIService = {
  /**
   * Suggest best business category for a given area
   * @param {Object} areaData - Data about the area (demographics, existing businesses, etc.)
   * @returns {Promise<Object>} - Suggested categories with reasoning
   */
  async suggestBusinessCategory(areaData) {
    if (!genAI) return { recommendations: [], areaProfile: 'AI features are not configured.' };
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

      const prompt = `
You are an expert franchise consultant analyzing a location for business opportunities.

Area Analysis:
- Location: ${areaData.location || 'Unknown'}
- Residential Areas: ${areaData.residential || 0}
- Commercial Areas: ${areaData.commercial || 0}
- Existing Restaurants: ${areaData.restaurants || 0}
- Parking Availability: ${areaData.parking || 0}
- Transport Connectivity: ${areaData.transport || 'Unknown'}
- Estimated Demographics: ${areaData.demographics || 'Mixed'}

Based on this data, suggest the TOP 3 best franchise business categories for this location.

For each suggestion, provide:
1. Category name
2. Why it's suitable (2-3 sentences)
3. Success probability (High/Medium/Low)
4. Initial investment estimate
5. Key success factors

Format your response as JSON with this structure:
{
  "recommendations": [
    {
      "category": "Category name",
      "reasoning": "Why it's suitable",
      "successProbability": "High/Medium/Low",
      "investment": "Investment range",
      "successFactors": ["factor1", "factor2", "factor3"]
    }
  ],
  "areaProfile": "Brief 2-3 sentence summary of the area's characteristics"
}
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Failed to parse AI response');
    } catch (error) {
      logger.error('Error in suggestBusinessCategory:', error);
      return {
        recommendations: [],
        areaProfile: 'Unable to generate AI insights at this time.',
      };
    }
  },

  /**
   * Generate personalized insights for a specific location and business
   * @param {Object} locationData - Complete location analysis data
   * @param {string} businessCategory - Selected business category
   * @returns {Promise<Object>} - Detailed AI insights
   */
  async generatePersonalizedInsights(locationData, businessCategory) {
    if (!genAI) return {
      executiveSummary: 'AI features are not configured.',
      strengths: [], challenges: [], recommendations: [],
      marketingInsights: { targetAudience: 'N/A', positioning: 'N/A' },
      revenuePotential: 'N/A',
      riskAssessment: { level: 'Unknown', explanation: 'AI not configured' },
    };
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

      const prompt = `
You are a franchise location expert providing detailed analysis.

Business: ${businessCategory}
Location Scores:
- Customer Reach: ${locationData.scores.customerReach}/10
- Competition: ${locationData.scores.competition}/10
- Amenities: ${locationData.scores.amenities}/10
- Transport: ${locationData.scores.transport}/10
- Overall: ${locationData.scores.overall}/10

Details:
- Competitors: ${locationData.details.competitors?.length || 0}
- Restaurants nearby: ${locationData.details.restaurants || 0}
- Parking spots: ${locationData.details.parking || 0}
- Transport options: ${locationData.details.busStops + locationData.details.metroStations || 0}

Provide a comprehensive analysis with:
1. Executive Summary (2-3 sentences)
2. Strengths (3-4 bullet points)
3. Challenges (3-4 bullet points)
4. Strategic Recommendations (4-5 actionable steps)
5. Marketing Insights (target audience, positioning)
6. Revenue Potential (estimated monthly revenue range)
7. Risk Assessment (High/Medium/Low with explanation)

Format as JSON:
{
  "executiveSummary": "Summary text",
  "strengths": ["strength1", "strength2"],
  "challenges": ["challenge1", "challenge2"],
  "recommendations": ["rec1", "rec2"],
  "marketingInsights": {
    "targetAudience": "Description",
    "positioning": "Positioning strategy"
  },
  "revenuePotential": "Revenue estimate",
  "riskAssessment": {
    "level": "High/Medium/Low",
    "explanation": "Explanation"
  }
}
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Failed to parse AI response');
    } catch (error) {
      logger.error('Error in generatePersonalizedInsights:', error);
      return {
        executiveSummary: 'Unable to generate detailed insights at this time.',
        strengths: [],
        challenges: [],
        recommendations: [],
        marketingInsights: {
          targetAudience: 'N/A',
          positioning: 'N/A'
        },
        revenuePotential: 'N/A',
        riskAssessment: {
          level: 'Unknown',
          explanation: 'Unable to assess risk'
        }
      };
    }
  },

  /**
   * Compare multiple locations and provide AI-driven comparison
   * @param {Array} locations - Array of location data objects
   * @param {string} businessCategory - Selected business category
   * @returns {Promise<Object>} - Comparison insights
   */
  async compareLocations(locations, businessCategory) {
    if (!genAI) return { bestLocation: { index: 0, reasoning: 'N/A' }, runnerUp: { index: 1, reasoning: 'N/A' }, differentiators: [], finalRecommendation: 'AI features are not configured.' };
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

      const locationsData = locations.map((loc, idx) => `
Location ${idx + 1}:
- Overall Score: ${loc.scores.overall}/10
- Customer Reach: ${loc.scores.customerReach}/10
- Competition: ${loc.scores.competition}/10 (${loc.details.competitors?.length || 0} competitors)
- Amenities: ${loc.scores.amenities}/10
- Transport: ${loc.scores.transport}/10
- Coordinates: ${loc.location.lat.toFixed(4)}, ${loc.location.lng.toFixed(4)}
`).join('\n');

      const prompt = `
Compare these ${locations.length} locations for a ${businessCategory} franchise:

${locationsData}

Provide:
1. Best Location (with reasoning)
2. Runner-up (with reasoning)
3. Key Differentiators (what makes them different)
4. Final Recommendation

Format as JSON:
{
  "bestLocation": {
    "index": 0,
    "reasoning": "Why it's best"
  },
  "runnerUp": {
    "index": 1,
    "reasoning": "Why it's second"
  },
  "differentiators": ["diff1", "diff2", "diff3"],
  "finalRecommendation": "Overall recommendation"
}
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Failed to parse AI response');
    } catch (error) {
      logger.error('Error in compareLocations:', error);
      return {
        bestLocation: { index: 0, reasoning: 'Unable to determine' },
        runnerUp: { index: 1, reasoning: 'Unable to determine' },
        differentiators: [],
        finalRecommendation: 'Unable to generate comparison at this time.'
      };
    }
  },

  /**
   * Predict future performance trends
   * @param {Object} locationData - Location data with historical scores
   * @returns {Promise<Object>} - Trend predictions
   */
  async predictTrends(locationData) {
    if (!genAI) return { trend: 'Unknown', confidence: 'Low', factors: [], actions: [], saturationRisk: 'Unknown', summary: 'AI features are not configured.' };
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

      const prompt = `
Analyze this location's performance data and predict future trends:

Current Scores:
- Customer Reach: ${locationData.scores.customerReach}/10
- Competition: ${locationData.scores.competition}/10
- Overall: ${locationData.scores.overall}/10

Competitors: ${locationData.details.competitors?.length || 0}
Area Type: ${locationData.details.commercial > 5 ? 'Commercial' : 'Residential'}

Predict for next 12 months:
1. Score trend (Improving/Stable/Declining)
2. Key factors affecting trend
3. Recommended actions
4. Market saturation risk

Format as JSON:
{
  "trend": "Improving/Stable/Declining",
  "confidence": "High/Medium/Low",
  "factors": ["factor1", "factor2"],
  "actions": ["action1", "action2"],
  "saturationRisk": "High/Medium/Low",
  "summary": "2-3 sentence summary"
}
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Failed to parse AI response');
    } catch (error) {
      logger.error('Error in predictTrends:', error);
      return {
        trend: 'Unknown',
        confidence: 'Low',
        factors: [],
        actions: [],
        saturationRisk: 'Unknown',
        summary: 'Unable to predict trends at this time.'
      };
    }
  }
};

export default locationAIService;
