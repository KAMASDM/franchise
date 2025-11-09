import { BUSINESS_MODEL_TYPES } from '../constants/businessModels';

/**
 * Utility functions for conditional field logic
 */

/**
 * Check if a field should be visible based on business model
 */
export const isFieldVisible = (fieldName, businessModelType) => {
  if (!businessModelType) return true; // Show all if no model selected
  
  const conditionalRules = {
    // Franchise-specific fields
    initialFranchiseFee: [
      BUSINESS_MODEL_TYPES.FRANCHISE,
      BUSINESS_MODEL_TYPES.MASTER_FRANCHISE,
      BUSINESS_MODEL_TYPES.AREA_FRANCHISE
    ],
    royaltyFee: [
      BUSINESS_MODEL_TYPES.FRANCHISE,
      BUSINESS_MODEL_TYPES.MASTER_FRANCHISE,
      BUSINESS_MODEL_TYPES.AREA_FRANCHISE
    ],
    marketingFee: [
      BUSINESS_MODEL_TYPES.FRANCHISE,
      BUSINESS_MODEL_TYPES.MASTER_FRANCHISE,
      BUSINESS_MODEL_TYPES.AREA_FRANCHISE
    ],
    territoryRights: [
      BUSINESS_MODEL_TYPES.FRANCHISE,
      BUSINESS_MODEL_TYPES.MASTER_FRANCHISE,
      BUSINESS_MODEL_TYPES.AREA_FRANCHISE
    ],
    franchiseTermLength: [
      BUSINESS_MODEL_TYPES.FRANCHISE,
      BUSINESS_MODEL_TYPES.MASTER_FRANCHISE,
      BUSINESS_MODEL_TYPES.AREA_FRANCHISE
    ],
    
    // Dealership-specific fields
    dealershipFee: [
      BUSINESS_MODEL_TYPES.DEALERSHIP,
      BUSINESS_MODEL_TYPES.AUTHORIZED_DISTRIBUTOR
    ],
    commissionRate: [
      BUSINESS_MODEL_TYPES.DEALERSHIP,
      BUSINESS_MODEL_TYPES.AUTHORIZED_DISTRIBUTOR,
      BUSINESS_MODEL_TYPES.BUSINESS_OPPORTUNITY
    ],
    inventoryRequirement: [
      BUSINESS_MODEL_TYPES.DEALERSHIP,
      BUSINESS_MODEL_TYPES.AUTHORIZED_DISTRIBUTOR
    ],
    
    // License-specific fields
    licenseFee: [
      BUSINESS_MODEL_TYPES.LICENSE,
      BUSINESS_MODEL_TYPES.TRADEMARK_LICENSE
    ],
    licenseDuration: [
      BUSINESS_MODEL_TYPES.LICENSE,
      BUSINESS_MODEL_TYPES.TRADEMARK_LICENSE
    ],
    
    // Master Franchise specific
    subFranchiseRights: [
      BUSINESS_MODEL_TYPES.MASTER_FRANCHISE,
      BUSINESS_MODEL_TYPES.AREA_FRANCHISE
    ],
    developmentFee: [
      BUSINESS_MODEL_TYPES.MASTER_FRANCHISE,
      BUSINESS_MODEL_TYPES.AREA_FRANCHISE
    ],
    
    // Investment/JV specific
    equityShare: [
      BUSINESS_MODEL_TYPES.JOINT_VENTURE,
      BUSINESS_MODEL_TYPES.INVESTMENT_OPPORTUNITY
    ],
    profitSharingRatio: [
      BUSINESS_MODEL_TYPES.JOINT_VENTURE,
      BUSINESS_MODEL_TYPES.PARTNERSHIP
    ],
    
    // FOCO specific
    managementFee: [BUSINESS_MODEL_TYPES.FOCO],
    operatingModel: [BUSINESS_MODEL_TYPES.FOCO]
  };
  
  // If field has no conditional rules, it's always visible
  if (!conditionalRules[fieldName]) return true;
  
  // Check if current business model is in the allowed list
  return conditionalRules[fieldName].includes(businessModelType);
};

/**
 * Get list of all visible field names for a business model
 */
export const getVisibleFields = (businessModelType) => {
  const allFields = [
    'businessModelType',
    'brandName', 'brandLogo', 'industries', 'brandEmail', 'brandPhone', 
    'brandWebsite', 'brandDescription', 'foundedYear',
    'initialFranchiseFee', 'royaltyFee', 'marketingFee', 'securityDeposit',
    'dealershipFee', 'commissionRate', 'inventoryRequirement',
    'licenseFee', 'licenseDuration',
    'subFranchiseRights', 'developmentFee',
    'equityShare', 'profitSharingRatio',
    'managementFee', 'operatingModel',
    'investmentRange', 'areaMin', 'areaMax', 'staffRequired', 'breakEvenTime',
    'trainingDuration', 'trainingLocation', 'ongoingSupport', 
    'franchiseAgreementLength', 'minAge', 'educationRequired', 'experienceRequired',
    'franchiseImages', 'brandStory', 'keyDifferentiators', 'companyHistory',
    'revenueStreams', 'revenueModel', 'territoryRights', 'franchiseTermLength',
    'supportTypes', 'qualification', 'agreeToTerms'
  ];
  
  return allFields.filter(field => isFieldVisible(field, businessModelType));
};

/**
 * Get required fields for a specific business model
 */
export const getRequiredFields = (businessModelType) => {
  const baseRequired = [
    'businessModelType',
    'brandName',
    'brandLogo',
    'industries',
    'investmentRange',
    'brandStory'
  ];
  
  const modelSpecificRequired = {
    [BUSINESS_MODEL_TYPES.FRANCHISE]: [
      'initialFranchiseFee',
      'royaltyFee',
      'territoryRights'
    ],
    [BUSINESS_MODEL_TYPES.DEALERSHIP]: [
      'dealershipFee',
      'commissionRate'
    ],
    [BUSINESS_MODEL_TYPES.LICENSE]: [
      'licenseFee',
      'licenseDuration'
    ],
    [BUSINESS_MODEL_TYPES.MASTER_FRANCHISE]: [
      'initialFranchiseFee',
      'royaltyFee',
      'subFranchiseRights'
    ],
    [BUSINESS_MODEL_TYPES.JOINT_VENTURE]: [
      'equityShare',
      'profitSharingRatio'
    ]
  };
  
  const specific = modelSpecificRequired[businessModelType] || [];
  return [...baseRequired, ...specific];
};

/**
 * Get field label based on business model context
 */
export const getContextualLabel = (fieldName, businessModelType) => {
  const contextualLabels = {
    initialFranchiseFee: {
      [BUSINESS_MODEL_TYPES.FRANCHISE]: 'Initial Franchise Fee',
      [BUSINESS_MODEL_TYPES.MASTER_FRANCHISE]: 'Master Franchise Fee',
      [BUSINESS_MODEL_TYPES.AREA_FRANCHISE]: 'Area Development Fee',
      default: 'Initial Fee'
    },
    royaltyFee: {
      [BUSINESS_MODEL_TYPES.FRANCHISE]: 'Ongoing Royalty Fee',
      [BUSINESS_MODEL_TYPES.MASTER_FRANCHISE]: 'Master Royalty Fee',
      default: 'Royalty Percentage'
    }
  };
  
  if (contextualLabels[fieldName]) {
    return contextualLabels[fieldName][businessModelType] || 
           contextualLabels[fieldName].default;
  }
  
  // Return field name in title case as fallback
  return fieldName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

export default {
  isFieldVisible,
  getVisibleFields,
  getRequiredFields,
  getContextualLabel
};
