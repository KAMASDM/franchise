/**
 * Advanced Search Service with Fuzzy Matching
 * Provides intelligent search capabilities for brands and content
 */

export class SearchService {
  
  // Calculate Levenshtein distance for fuzzy matching
  static levenshteinDistance(str1, str2) {
    const matrix = [];
    
    // Create matrix
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    // Fill matrix
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }
  
  // Calculate similarity score (0-1)
  static calculateSimilarity(str1, str2) {
    if (!str1 || !str2) return 0;
    
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }
  
  // Normalize text for searching
  static normalizeText(text) {
    if (!text || typeof text !== 'string') return '';
    
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, '') // Remove special characters
      .replace(/\s+/g, ' '); // Replace multiple spaces with single space
  }
  
  // Extract searchable keywords from text
  static extractKeywords(text, minLength = 2) {
    if (!text) return [];
    
    const normalized = this.normalizeText(text);
    const words = normalized.split(' ').filter(word => word.length >= minLength);
    
    // Remove common stop words
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 
      'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 
      'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
      'may', 'might', 'can', 'cannot', 'this', 'that', 'these', 'those'
    ]);
    
    return words.filter(word => !stopWords.has(word));
  }
  
  // Fuzzy search brands
  static searchBrands(brands, query, options = {}) {
    const {
      threshold = 0.3,        // Minimum similarity score
      maxResults = 50,        // Maximum results to return
      includePartialMatches = true,
      fields = [
        'brandName', 
        'industries', 
        'businessModel', 
        'businessModels',  // NEW: Support for new businessModels array
        'brandOwnerInformation.name'
      ]
    } = options;
    
    if (!query || query.trim().length === 0) {
      return brands.slice(0, maxResults);
    }
    
    const normalizedQuery = this.normalizeText(query);
    const queryKeywords = this.extractKeywords(normalizedQuery);
    
    const results = brands.map(brand => {
      let maxScore = 0;
      let matchedFields = [];
      
      // Search in specified fields
      fields.forEach(field => {
        const fieldValue = this.getNestedProperty(brand, field);
        if (!fieldValue) return;
        
        let fieldScore = 0;
        let fieldMatches = [];
        
        // Handle array fields (like industries)
        if (Array.isArray(fieldValue)) {
          fieldValue.forEach(item => {
            const itemScore = this.calculateFieldScore(item, normalizedQuery, queryKeywords, includePartialMatches);
            if (itemScore.score > fieldScore) {
              fieldScore = itemScore.score;
              fieldMatches = itemScore.matches;
            }
          });
        } else {
          const scoreResult = this.calculateFieldScore(fieldValue, normalizedQuery, queryKeywords, includePartialMatches);
          fieldScore = scoreResult.score;
          fieldMatches = scoreResult.matches;
        }
        
        if (fieldScore > maxScore) {
          maxScore = fieldScore;
        }
        
        if (fieldScore > threshold) {
          matchedFields.push({
            field,
            score: fieldScore,
            matches: fieldMatches
          });
        }
      });
      
      return {
        brand,
        score: maxScore,
        matchedFields,
        relevance: this.calculateRelevance(maxScore, matchedFields.length)
      };
    })
    .filter(result => result.score >= threshold)
    .sort((a, b) => {
      // Sort by relevance first, then by score
      if (a.relevance !== b.relevance) {
        return b.relevance - a.relevance;
      }
      return b.score - a.score;
    })
    .slice(0, maxResults);
    
    return results;
  }
  
  // Get nested property value
  static getNestedProperty(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  }
  
  // Calculate field score
  static calculateFieldScore(fieldValue, normalizedQuery, queryKeywords, includePartialMatches) {
    if (!fieldValue) return { score: 0, matches: [] };
    
    const normalizedField = this.normalizeText(fieldValue.toString());
    const fieldKeywords = this.extractKeywords(normalizedField);
    
    let score = 0;
    let matches = [];
    
    // Exact match gets highest score
    if (normalizedField.includes(normalizedQuery)) {
      score = Math.max(score, 1.0);
      matches.push({ type: 'exact', text: fieldValue, score: 1.0 });
    }
    
    // Fuzzy matching on whole field
    const fieldSimilarity = this.calculateSimilarity(normalizedField, normalizedQuery);
    if (fieldSimilarity > 0.7) {
      score = Math.max(score, fieldSimilarity);
      matches.push({ type: 'fuzzy_field', text: fieldValue, score: fieldSimilarity });
    }
    
    // Keyword matching
    queryKeywords.forEach(queryKeyword => {
      fieldKeywords.forEach(fieldKeyword => {
        const keywordSimilarity = this.calculateSimilarity(fieldKeyword, queryKeyword);
        
        if (keywordSimilarity === 1.0) {
          // Exact keyword match
          score = Math.max(score, 0.9);
          matches.push({ type: 'exact_keyword', text: fieldKeyword, score: 0.9 });
        } else if (keywordSimilarity > 0.8) {
          // Close keyword match
          score = Math.max(score, keywordSimilarity * 0.8);
          matches.push({ type: 'fuzzy_keyword', text: fieldKeyword, score: keywordSimilarity * 0.8 });
        }
      });
    });
    
    // Partial matches within field
    if (includePartialMatches) {
      queryKeywords.forEach(queryKeyword => {
        if (normalizedField.includes(queryKeyword)) {
          score = Math.max(score, 0.6);
          matches.push({ type: 'partial', text: queryKeyword, score: 0.6 });
        }
      });
    }
    
    return { score, matches };
  }
  
  // Calculate overall relevance
  static calculateRelevance(score, matchedFieldsCount) {
    // Boost relevance for multiple field matches
    const fieldBonus = Math.min(matchedFieldsCount * 0.1, 0.3);
    return Math.min(score + fieldBonus, 1.0);
  }
  
  // Search suggestions/autocomplete
  static generateSuggestions(brands, query, maxSuggestions = 5) {
    if (!query || query.trim().length < 2) return [];
    
    const suggestions = new Set();
    const normalizedQuery = this.normalizeText(query);
    
    brands.forEach(brand => {
      // Suggest brand names
      if (brand.brandName) {
        const normalizedName = this.normalizeText(brand.brandName);
        if (normalizedName.includes(normalizedQuery) || 
            this.calculateSimilarity(normalizedName, normalizedQuery) > 0.6) {
          suggestions.add(brand.brandName);
        }
      }
      
      // Suggest industries
      if (brand.industries) {
        brand.industries.forEach(industry => {
          const normalizedIndustry = this.normalizeText(industry);
          if (normalizedIndustry.includes(normalizedQuery) || 
              this.calculateSimilarity(normalizedIndustry, normalizedQuery) > 0.7) {
            suggestions.add(industry);
          }
        });
      }
      
      // Suggest business models (old field)
      if (brand.businessModel) {
        const normalizedModel = this.normalizeText(brand.businessModel);
        if (normalizedModel.includes(normalizedQuery)) {
          suggestions.add(brand.businessModel);
        }
      }
      
      // Suggest business models (new array field)
      if (brand.businessModels && Array.isArray(brand.businessModels)) {
        brand.businessModels.forEach(modelId => {
          // Import would be needed here, but we'll use a simple label mapping
          const modelLabels = {
            'franchise': 'Franchise',
            'master_franchise': 'Master Franchise',
            'area_franchise': 'Area Franchise',
            'dealership': 'Dealership',
            'authorized_dealer': 'Authorized Dealer',
            'distributorship': 'Distributorship',
            'wholesale_distributor': 'Wholesale Distributor',
            'stockist': 'Stockist',
            'super_stockist': 'Super Stockist',
            'c_and_f_agent': 'C&F Agent',
            'channel_partner': 'Channel Partner'
          };
          
          const label = modelLabels[modelId] || modelId;
          const normalizedModel = this.normalizeText(label);
          if (normalizedModel.includes(normalizedQuery) || 
              this.calculateSimilarity(normalizedModel, normalizedQuery) > 0.6) {
            suggestions.add(label);
          }
        });
      }
    });
    
    return Array.from(suggestions).slice(0, maxSuggestions);
  }
  
  // Highlight search terms in text
  static highlightMatches(text, query) {
    if (!text || !query) return text;
    
    const normalizedQuery = this.normalizeText(query);
    const queryKeywords = this.extractKeywords(normalizedQuery);
    
    let highlightedText = text;
    
    // Highlight exact query match
    const regex = new RegExp(`(${normalizedQuery})`, 'gi');
    highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
    
    // Highlight individual keywords
    queryKeywords.forEach(keyword => {
      const keywordRegex = new RegExp(`\\b(${keyword})\\b`, 'gi');
      highlightedText = highlightedText.replace(keywordRegex, '<mark>$1</mark>');
    });
    
    return highlightedText;
  }
  
  // Get search analytics
  static getSearchAnalytics(searchResults, query) {
    return {
      query,
      totalResults: searchResults.length,
      hasExactMatch: searchResults.some(r => r.score === 1.0),
      averageScore: searchResults.length > 0 
        ? searchResults.reduce((sum, r) => sum + r.score, 0) / searchResults.length 
        : 0,
      topScore: searchResults.length > 0 ? searchResults[0].score : 0,
      matchedFields: [...new Set(
        searchResults.flatMap(r => r.matchedFields.map(f => f.field))
      )],
      searchTime: Date.now()
    };
  }
}

export default SearchService;