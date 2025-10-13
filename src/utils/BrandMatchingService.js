import { INVESTMENT_RANGES, INDUSTRIES } from "../constants";

/**
 * Smart Brand Matching Algorithm
 * Matches users with relevant franchise opportunities based on preferences and profile
 */

export class BrandMatchingService {

  static async matchBrands(userPreferences, availableBrands = []) {
    const matches = availableBrands
      .map(brand => ({
        brand,
        matchScore: this.calculateMatchScore(userPreferences, brand),
        matchFactors: this.getMatchFactors(userPreferences, brand)
      }))
      .filter(match => match.matchScore > 20) // Filter out very poor matches
      .sort((a, b) => b.matchScore - a.matchScore); // Sort by match score descending

    return matches;
  }

  static calculateMatchScore(user, brand) {
    let totalScore = 0;
    const weights = {
      budget: 0.3,      // 30% - Budget alignment is crucial
      location: 0.25,   // 25% - Geographic proximity matters
      industry: 0.2,    // 20% - Industry interest alignment
      experience: 0.15, // 15% - Experience requirements match
      timeline: 0.1     // 10% - Timeline compatibility
    };

    // Budget Match Score
    const budgetScore = this.calculateBudgetMatch(user.budget, brand.investmentRange);
    totalScore += budgetScore * weights.budget;

    // Location Match Score
    const locationScore = this.calculateLocationMatch(user.location, brand.brandFranchiseLocations);
    totalScore += locationScore * weights.location;

    // Industry Match Score
    const industryScore = this.calculateIndustryMatch(user.interests || [], brand.industries || []);
    totalScore += industryScore * weights.industry;

    // Experience Match Score
    const experienceScore = this.calculateExperienceMatch(user.experience, brand);
    totalScore += experienceScore * weights.experience;

    // Timeline Match Score
    const timelineScore = this.calculateTimelineMatch(user.timeline, brand);
    totalScore += timelineScore * weights.timeline;

    return Math.min(Math.round(totalScore), 100);
  }

  static calculateBudgetMatch(userBudget, brandInvestmentRange) {
    if (!userBudget || !brandInvestmentRange) return 30; // Default score

    const userBudgetIndex = INVESTMENT_RANGES.indexOf(userBudget);
    const brandBudgetIndex = INVESTMENT_RANGES.indexOf(brandInvestmentRange);

    if (userBudgetIndex === -1 || brandBudgetIndex === -1) return 30;

    // Perfect match if budgets align
    if (userBudgetIndex === brandBudgetIndex) return 100;

    // Good match if within 1 range
    const difference = Math.abs(userBudgetIndex - brandBudgetIndex);
    if (difference === 1) return 80;
    if (difference === 2) return 60;
    if (difference === 3) return 40;

    return 20; // Poor match for large differences
  }

  static calculateLocationMatch(userLocation, brandLocations = []) {
    if (!userLocation || brandLocations.length === 0) return 40;

    const userCity = userLocation.toLowerCase().trim();
    
    // Check for exact city match
    const exactMatch = brandLocations.some(location => 
      location.city?.toLowerCase().trim() === userCity
    );
    if (exactMatch) return 100;

    // Check for state match (approximate)
    const stateMatch = brandLocations.some(location => 
      location.state?.toLowerCase().includes(userCity) ||
      userCity.includes(location.state?.toLowerCase())
    );
    if (stateMatch) return 70;

    // Check for country match
    const countryMatch = brandLocations.some(location => 
      location.country?.toLowerCase() === 'india' && userLocation.toLowerCase().includes('india')
    );
    if (countryMatch) return 30;

    return 10; // No geographic alignment
  }

  static calculateIndustryMatch(userInterests, brandIndustries) {
    if (!userInterests.length || !brandIndustries.length) return 50;

    // Direct industry match
    const directMatches = userInterests.filter(interest => 
      brandIndustries.some(industry => 
        industry.toLowerCase().includes(interest.toLowerCase()) ||
        interest.toLowerCase().includes(industry.toLowerCase())
      )
    );

    if (directMatches.length > 0) {
      return Math.min(100, 60 + (directMatches.length * 20));
    }

    // Related industry match (basic matching)
    const relatedMatches = this.findRelatedIndustries(userInterests, brandIndustries);
    if (relatedMatches > 0) {
      return 40 + (relatedMatches * 10);
    }

    return 20; // No industry alignment
  }

  static findRelatedIndustries(userInterests, brandIndustries) {
    const industryRelations = {
      'Food & Beverage': ['Hospitality', 'Retail'],
      'Hospitality': ['Food & Beverage', 'Travel & Hospitality'], 
      'Healthcare': ['Beauty & Wellness', 'Fitness'],
      'Technology': ['Education'],
      'Retail': ['Food & Beverage', 'Beauty & Wellness'],
      'Education': ['Technology'],
      'Fitness': ['Healthcare', 'Beauty & Wellness'],
      'Beauty & Wellness': ['Healthcare', 'Fitness', 'Retail']
    };

    let relatedCount = 0;
    userInterests.forEach(interest => {
      const related = industryRelations[interest] || [];
      brandIndustries.forEach(brandIndustry => {
        if (related.includes(brandIndustry)) {
          relatedCount++;
        }
      });
    });

    return relatedCount;
  }

  static calculateExperienceMatch(userExperience, brand) {
    if (!userExperience) return 50;

    // Brand franchise experience requirements (would come from brand data)
    const experienceRequirement = brand.experienceRequired || 'Any';

    const experienceScores = {
      'Franchise experience': { 'High': 100, 'Medium': 90, 'Low': 80, 'Any': 100 },
      'Restaurant experience': { 'High': 90, 'Medium': 100, 'Low': 80, 'Any': 90 },
      'Corporate executive': { 'High': 80, 'Medium': 90, 'Low': 100, 'Any': 85 },
      'Some business experience': { 'High': 60, 'Medium': 80, 'Low': 90, 'Any': 70 },
      'No Business Experience': { 'High': 30, 'Medium': 50, 'Low': 80, 'Any': 60 }
    };

    return experienceScores[userExperience]?.[experienceRequirement] || 50;
  }

  static calculateTimelineMatch(userTimeline, brand) {
    if (!userTimeline) return 50;

    // Faster timelines generally match better with most franchises
    const timelineScores = {
      "As soon as possible": 100,
      "Within 3 months": 90,
      "Within 6 months": 80, 
      "Within 1 year": 70,
      "Just exploring": 40
    };

    return timelineScores[userTimeline] || 50;
  }

  static getMatchFactors(user, brand) {
    return {
      budget: {
        score: this.calculateBudgetMatch(user.budget, brand.investmentRange),
        details: `User budget: ${user.budget}, Brand range: ${brand.investmentRange}`
      },
      location: {
        score: this.calculateLocationMatch(user.location, brand.brandFranchiseLocations),
        details: `User location: ${user.location}, Brand locations: ${brand.brandFranchiseLocations?.length || 0} locations`
      },
      industry: {
        score: this.calculateIndustryMatch(user.interests || [], brand.industries || []),
        details: `Matching industries: ${brand.industries?.join(', ') || 'None specified'}`
      },
      experience: {
        score: this.calculateExperienceMatch(user.experience, brand),
        details: `User experience: ${user.experience || 'Not specified'}`
      },
      timeline: {
        score: this.calculateTimelineMatch(user.timeline, brand),
        details: `User timeline: ${user.timeline || 'Not specified'}`
      }
    };
  }

  static getMatchRecommendations(matchScore, matchFactors) {
    const recommendations = [];

    if (matchScore >= 80) {
      recommendations.push({
        type: 'success',
        message: 'Excellent match! This franchise aligns very well with your profile.'
      });
    } else if (matchScore >= 60) {
      recommendations.push({
        type: 'info', 
        message: 'Good match. Consider researching this opportunity further.'
      });
    } else if (matchScore >= 40) {
      recommendations.push({
        type: 'warning',
        message: 'Moderate match. Review details carefully before proceeding.'
      });
    }

    // Specific factor recommendations
    if (matchFactors.budget.score < 50) {
      recommendations.push({
        type: 'warning',
        message: 'Budget mismatch detected. Consider if financing options are available.'
      });
    }

    if (matchFactors.location.score < 40) {
      recommendations.push({
        type: 'info',
        message: 'No nearby locations found. Remote management or relocation may be required.'
      });
    }

    if (matchFactors.experience.score < 50) {
      recommendations.push({
        type: 'info',
        message: 'Consider additional training or mentorship for this franchise type.'
      });
    }

    return recommendations;
  }

  static createMatchSummary(match) {
    const { brand, matchScore, matchFactors } = match;
    
    return {
      brandId: brand.id,
      brandName: brand.brandName,
      matchScore,
      matchGrade: matchScore >= 80 ? 'A' : matchScore >= 60 ? 'B' : matchScore >= 40 ? 'C' : 'D',
      strengths: Object.entries(matchFactors)
        .filter(([key, factor]) => factor.score >= 70)
        .map(([key, factor]) => ({
          factor: key,
          score: factor.score,
          details: factor.details
        })),
      weaknesses: Object.entries(matchFactors)
        .filter(([key, factor]) => factor.score < 50)
        .map(([key, factor]) => ({
          factor: key,
          score: factor.score,
          details: factor.details
        })),
      recommendations: this.getMatchRecommendations(matchScore, matchFactors)
    };
  }
}

export default BrandMatchingService;