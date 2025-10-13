import { INVESTMENT_RANGES, BUSINESS_EXPERIENCE_OPTIONS, TIMELINE_OPTIONS } from "../constants";

/**
 * Lead Scoring System
 * Calculates a lead score based on various factors to help prioritize leads
 */

export class LeadScoringService {
  
  static calculateLeadScore(leadData) {
    let score = 0;
    const factors = {};

    // Budget Score (30% weight) - Higher budget = higher score
    const budgetScore = this.calculateBudgetScore(leadData.budget);
    score += budgetScore * 0.3;
    factors.budget = { score: budgetScore, weight: 0.3 };

    // Timeline Score (25% weight) - Faster timeline = higher score  
    const timelineScore = this.calculateTimelineScore(leadData.timeline);
    score += timelineScore * 0.25;
    factors.timeline = { score: timelineScore, weight: 0.25 };

    // Experience Score (20% weight) - More experience = higher score
    const experienceScore = this.calculateExperienceScore(leadData.experience);
    score += experienceScore * 0.2;
    factors.experience = { score: experienceScore, weight: 0.2 };

    // Location Match Score (15% weight) - Location match with brand = higher score
    const locationScore = this.calculateLocationScore(leadData, leadData.brandData);
    score += locationScore * 0.15;
    factors.location = { score: locationScore, weight: 0.15 };

    // Completeness Score (10% weight) - More complete profile = higher score
    const completenessScore = this.calculateCompletenessScore(leadData);
    score += completenessScore * 0.1;
    factors.completeness = { score: completenessScore, weight: 0.1 };

    return {
      totalScore: Math.min(Math.round(score), 100), // Cap at 100
      factors,
      grade: this.getLeadGrade(score),
      priority: this.getLeadPriority(score)
    };
  }

  static calculateBudgetScore(budget) {
    if (!budget) return 0;
    
    const budgetIndex = INVESTMENT_RANGES.indexOf(budget);
    if (budgetIndex === -1) return 50; // Default score for unknown budget
    
    // Higher budget ranges get higher scores
    return Math.round((budgetIndex + 1) / INVESTMENT_RANGES.length * 100);
  }

  static calculateTimelineScore(timeline) {
    if (!timeline) return 0;
    
    const timelineScores = {
      "As soon as possible": 100,
      "Within 3 months": 80,
      "Within 6 months": 60,
      "Within 1 year": 40,
      "Just exploring": 20
    };
    
    return timelineScores[timeline] || 30;
  }

  static calculateExperienceScore(experience) {
    if (!experience) return 50;
    
    const experienceScores = {
      "Franchise experience": 100,
      "Restaurant experience": 90,
      "Corporate executive": 80,
      "Some business experience": 60,
      "No Business Experience": 40
    };
    
    return experienceScores[experience] || 50;
  }

  static calculateLocationScore(leadData, brandData) {
    if (!leadData.userAddress || !brandData?.brandFranchiseLocations) return 50;
    
    const leadCity = leadData.userAddress.city?.toLowerCase();
    const brandLocations = brandData.brandFranchiseLocations || [];
    
    // Check if lead is in same city as any brand location
    const hasLocationMatch = brandLocations.some(location => 
      location.city?.toLowerCase() === leadCity
    );
    
    return hasLocationMatch ? 100 : 30;
  }

  static calculateCompletenessScore(leadData) {
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 
      'userAddress', 'budget', 'timeline'
    ];
    
    const optionalFields = [
      'experience', 'comments', 'brandFranchiseLocation'
    ];
    
    let filledRequired = 0;
    let filledOptional = 0;
    
    requiredFields.forEach(field => {
      if (this.isFieldFilled(leadData, field)) filledRequired++;
    });
    
    optionalFields.forEach(field => {
      if (this.isFieldFilled(leadData, field)) filledOptional++;
    });
    
    // Required fields are worth more
    const requiredScore = (filledRequired / requiredFields.length) * 70;
    const optionalScore = (filledOptional / optionalFields.length) * 30;
    
    return Math.round(requiredScore + optionalScore);
  }

  static isFieldFilled(data, field) {
    const value = data[field];
    if (!value) return false;
    
    if (typeof value === 'string') return value.trim().length > 0;
    if (typeof value === 'object') return Object.keys(value).length > 0;
    
    return true;
  }

  static getLeadGrade(score) {
    if (score >= 80) return 'A'; // Hot lead
    if (score >= 60) return 'B'; // Warm lead  
    if (score >= 40) return 'C'; // Cold lead
    return 'D'; // Poor lead
  }

  static getLeadPriority(score) {
    if (score >= 80) return 'High';
    if (score >= 60) return 'Medium';
    if (score >= 40) return 'Low';
    return 'Very Low';
  }

  static getLeadInsights(leadScore) {
    const insights = [];
    const { factors, totalScore } = leadScore;
    
    // Budget insights
    if (factors.budget.score < 50) {
      insights.push({
        type: 'warning',
        message: 'Low investment budget may indicate price sensitivity'
      });
    } else if (factors.budget.score > 80) {
      insights.push({
        type: 'success', 
        message: 'High investment budget indicates strong financial capacity'
      });
    }
    
    // Timeline insights
    if (factors.timeline.score > 80) {
      insights.push({
        type: 'success',
        message: 'Immediate timeline suggests urgent buying intent'
      });
    } else if (factors.timeline.score < 30) {
      insights.push({
        type: 'info',
        message: 'Long timeline suggests early-stage consideration'
      });
    }
    
    // Experience insights
    if (factors.experience.score > 80) {
      insights.push({
        type: 'success',
        message: 'Strong business background reduces investment risk'
      });
    } else if (factors.experience.score < 50) {
      insights.push({
        type: 'warning',
        message: 'Limited experience may require additional support'
      });
    }
    
    // Overall score insights
    if (totalScore > 80) {
      insights.push({
        type: 'success',
        message: 'High-quality lead with strong conversion potential'
      });
    } else if (totalScore < 40) {
      insights.push({
        type: 'warning', 
        message: 'Lead may require nurturing before conversion'
      });
    }
    
    return insights;
  }

  static getFollowUpRecommendations(leadScore) {
    const { totalScore, priority } = leadScore;
    
    const recommendations = {
      'High': {
        timeframe: 'Within 2 hours',
        method: 'Phone call',
        message: 'Priority lead - immediate personal contact recommended'
      },
      'Medium': {
        timeframe: 'Within 24 hours', 
        method: 'Email + Phone call',
        message: 'Good potential - prompt follow-up recommended'
      },
      'Low': {
        timeframe: 'Within 3 days',
        method: 'Email',
        message: 'Standard follow-up with nurturing sequence'
      },
      'Very Low': {
        timeframe: 'Within 1 week',
        method: 'Automated email',
        message: 'Add to nurturing campaign for future consideration'
      }
    };
    
    return recommendations[priority] || recommendations['Low'];
  }
}

export default LeadScoringService;