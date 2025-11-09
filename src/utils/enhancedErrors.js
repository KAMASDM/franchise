/**
 * Enhanced Error Messages with Recovery Suggestions
 * Provides specific, helpful error messages instead of generic ones
 */

export const enhancedErrors = {
  // Brand Name Errors
  brandName: {
    required: {
      message: "Please enter your brand name",
      suggestion: "Use your official registered business name",
      example: "e.g., 'Starbucks Coffee' or 'McDonald's'"
    },
    tooShort: {
      message: "Brand name is too short",
      suggestion: "Brand names should be at least 2 characters",
      example: "Try using your full brand name instead of initials"
    },
    invalid: {
      message: "Brand name contains invalid characters",
      suggestion: "Use only letters, numbers, spaces, and common symbols (&, -, ')",
      example: "Valid: 'Ben & Jerry's', Invalid: 'Brand@#$'"
    }
  },

  // Email Errors
  email: {
    required: {
      message: "Email address is required",
      suggestion: "Provide a business email for better credibility",
      example: "contact@yourbrand.com"
    },
    invalid: {
      message: "Please enter a valid email address",
      suggestion: "Check for typos - email should have @ and domain",
      example: "Valid: john@example.com, Invalid: john@example"
    },
    suggested: (email) => {
      const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
      const parts = email.split('@');
      if (parts.length === 2) {
        const domain = parts[1].toLowerCase();
        const suggestions = commonDomains
          .filter(d => d.startsWith(domain.charAt(0)))
          .slice(0, 2);
        
        if (suggestions.length > 0) {
          return {
            message: "Did you mean one of these?",
            suggestions: suggestions.map(d => `${parts[0]}@${d}`)
          };
        }
      }
      return null;
    }
  },

  // Phone Number Errors
  phone: {
    required: {
      message: "Phone number is required",
      suggestion: "Provide a number where partners can reach you",
      example: "+91 98765 43210 or 022-12345678"
    },
    invalid: {
      message: "Please enter a valid phone number",
      suggestion: "Include country code and area code",
      example: "India: +91 98765 43210, USA: +1 (555) 123-4567"
    },
    tooShort: {
      message: "Phone number seems incomplete",
      suggestion: "Indian mobile: 10 digits, Landline: include STD code",
      example: "Mobile: 9876543210, Landline: 022-12345678"
    }
  },

  // Website/URL Errors
  website: {
    required: {
      message: "Website URL is required",
      suggestion: "Enter your brand's official website",
      example: "https://www.yourbrand.com"
    },
    invalid: {
      message: "Please enter a valid website URL",
      suggestion: "URL should start with http:// or https://",
      example: "Correct: https://example.com, Wrong: example.com"
    },
    missingProtocol: (url) => ({
      message: "URL is missing http:// or https://",
      suggestion: `Did you mean: https://${url}?`,
      fix: `https://${url}`
    })
  },

  // Financial Errors
  franchiseFee: {
    required: {
      message: "Initial franchise fee is required",
      suggestion: "Enter the one-time fee for franchise rights",
      example: "Typical range: ₹5,00,000 - ₹50,00,000"
    },
    tooLow: {
      message: "Franchise fee seems unusually low",
      suggestion: "Ensure you've entered the correct amount",
      example: "Most franchises charge ₹5 lakhs or more"
    },
    tooHigh: {
      message: "Franchise fee seems very high",
      suggestion: "Double-check the amount - is this in rupees?",
      example: "Premium franchises: ₹50 lakhs - ₹2 crores"
    },
    notANumber: {
      message: "Please enter a valid number",
      suggestion: "Use only digits, no currency symbols",
      example: "Correct: 500000, Wrong: ₹5,00,000"
    }
  },

  royaltyFee: {
    required: {
      message: "Royalty fee percentage is required",
      suggestion: "Enter the ongoing fee as % of revenue",
      example: "Typical range: 3% - 8%"
    },
    tooLow: {
      message: "Royalty fee seems low (below 2%)",
      suggestion: "Verify this covers your support costs",
      example: "Industry standard: 4% - 6%"
    },
    tooHigh: {
      message: "Royalty fee is very high (above 15%)",
      suggestion: "High fees may discourage potential partners",
      example: "Most successful franchises: 4% - 8%"
    }
  },

  // Investment Range Errors
  investmentRange: {
    required: {
      message: "Please select an investment range",
      suggestion: "Choose the total investment needed to start",
      example: "Include setup, equipment, and working capital"
    },
    mismatch: {
      message: "Investment details don't match the selected range",
      suggestion: "Sum of all costs should fall within the range",
      example: "If range is ₹10-20L, total costs should be 10-20L"
    }
  },

  // File Upload Errors
  logo: {
    required: {
      message: "Brand logo is required",
      suggestion: "Upload a clear, professional logo image",
      example: "Recommended: 512x512px, PNG or JPG, max 2MB"
    },
    tooLarge: (size) => ({
      message: `File is too large (${(size / 1024 / 1024).toFixed(1)}MB)`,
      suggestion: "Please compress the image or use a smaller file",
      example: "Maximum allowed: 2MB"
    }),
    wrongFormat: (format) => ({
      message: `Invalid file format: ${format}`,
      suggestion: "Please upload a PNG, JPG, or JPEG image",
      example: "Accepted: .png, .jpg, .jpeg"
    }),
    dimensionsTooSmall: (width, height) => ({
      message: `Image is too small (${width}x${height}px)`,
      suggestion: "Logo should be at least 200x200 pixels",
      example: "Recommended: 512x512px for best quality"
    })
  },

  // Age Requirement Errors
  minAge: {
    required: {
      message: "Minimum age requirement is needed",
      suggestion: "Set a reasonable age for business ownership",
      example: "Typical: 25-30 years"
    },
    tooLow: {
      message: "Minimum age is below legal limit (18)",
      suggestion: "Partners must be at least 18 years old",
      example: "Recommended minimum: 25 years"
    },
    tooHigh: {
      message: "Minimum age seems very high",
      suggestion: "High age limits may reduce partner pool",
      example: "Most franchises: 25-35 years minimum"
    }
  },

  // Founded Year Errors
  foundedYear: {
    required: {
      message: "Year established is required",
      suggestion: "When was your brand officially founded?",
      example: "e.g., 2015, 2020"
    },
    tooOld: {
      message: "Founded year seems very old",
      suggestion: "Please verify the year is correct",
      example: "Did you mean a more recent year?"
    },
    future: {
      message: "Founded year cannot be in the future",
      suggestion: "Enter the year your brand was established",
      example: `Current year: ${new Date().getFullYear()}`
    },
    invalid: {
      message: "Please enter a valid 4-digit year",
      suggestion: "Year should be between 1900 and current year",
      example: "e.g., 2015, 2020, 2024"
    }
  },

  // Text Content Errors
  brandStory: {
    required: {
      message: "Brand story is required",
      suggestion: "Share your brand's journey and mission",
      example: "Tell partners why your brand is unique"
    },
    tooShort: (current, min) => ({
      message: `Brand story is too brief (${current}/${min} characters)`,
      suggestion: `Add ${min - current} more characters to tell your full story`,
      example: "Include: Origin, mission, what makes you unique, achievements"
    }),
    generic: {
      message: "Brand story seems generic",
      suggestion: "Make it personal - what's YOUR unique story?",
      example: "Share specific challenges you overcame or milestones"
    }
  },

  // Industry Selection Errors
  industries: {
    required: {
      message: "Please select at least one industry",
      suggestion: "Choose categories that best describe your business",
      example: "Food & Beverage, Retail, Services, etc."
    },
    tooMany: {
      message: "Too many industries selected (max 3)",
      suggestion: "Focus on your primary business categories",
      example: "Choose the 2-3 most relevant industries"
    }
  },

  // Training Duration Errors
  trainingDuration: {
    required: {
      message: "Training duration is required",
      suggestion: "How long will you train new partners?",
      example: "e.g., 1 week, 2 weeks, 1 month"
    },
    tooShort: {
      message: "Training duration seems very short",
      suggestion: "Ensure partners have adequate training",
      example: "Most franchises: 1-4 weeks minimum"
    }
  },

  // Terms & Conditions
  agreeToTerms: {
    required: {
      message: "You must agree to terms and conditions",
      suggestion: "Please read and accept to continue",
      example: "Check the box to confirm you've read the terms"
    }
  }
};

/**
 * Get enhanced error message with suggestions
 * @param {string} field - Field name
 * @param {string} errorType - Type of error
 * @param {*} context - Additional context (value, size, etc.)
 * @returns {object} Error message with suggestion
 */
export const getEnhancedError = (field, errorType, context = null) => {
  const fieldErrors = enhancedErrors[field];
  
  if (!fieldErrors) {
    return {
      message: `Invalid ${field}`,
      suggestion: "Please check this field and try again"
    };
  }

  const error = fieldErrors[errorType];
  
  if (typeof error === 'function') {
    return error(context);
  }
  
  return error || {
    message: `Invalid ${field}`,
    suggestion: "Please check this field"
  };
};

/**
 * Format error message for display
 * @param {object} error - Error object with message and suggestion
 * @returns {string} Formatted error message
 */
export const formatErrorMessage = (error) => {
  if (!error) return '';
  
  let message = error.message;
  
  if (error.suggestion) {
    message += ` • ${error.suggestion}`;
  }
  
  if (error.example) {
    message += ` (${error.example})`;
  }
  
  return message;
};

export default {
  enhancedErrors,
  getEnhancedError,
  formatErrorMessage
};
