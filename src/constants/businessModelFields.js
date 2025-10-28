import { BUSINESS_MODEL_TYPES } from './businessModels';

/**
 * Field configurations for different business models
 * Each business model has specific fields relevant to that partnership type
 */

export const BUSINESS_MODEL_FIELDS = {
  [BUSINESS_MODEL_TYPES.FRANCHISE]: {
    steps: [
      {
        id: 'business_model',
        title: 'Partnership Type',
        subtitle: 'Choose your partnership model',
        required: true
      },
      {
        id: 'basic_info',
        title: 'Brand Information',
        subtitle: 'Tell us about your brand',
        fields: [
          { id: 'brandName', type: 'text', required: true },
          { id: 'brandLogo', type: 'image', required: true },
          { id: 'industries', type: 'multiselect', required: true },
          { id: 'foundedYear', type: 'year', required: true },
          { id: 'brandStory', type: 'textarea', required: false }
        ]
      },
      {
        id: 'franchise_details',
        title: 'Franchise Details',
        subtitle: 'Franchise-specific information',
        fields: [
          { id: 'franchiseFee', type: 'currency', required: true },
          { id: 'royaltyFee', type: 'percentage', required: true },
          { id: 'marketingFee', type: 'percentage', required: false },
          { id: 'territoryRights', type: 'select', options: ['Exclusive', 'Non-exclusive', 'Protected'], required: true },
          { id: 'franchiseTermLength', type: 'select', options: ['3 years', '5 years', '7 years', '10 years', '15 years'], required: true }
        ]
      },
      {
        id: 'investment',
        title: 'Investment Requirements',
        subtitle: 'Financial requirements and support',
        fields: [
          { id: 'investmentRange', type: 'cardselect', required: true },
          { id: 'workingCapital', type: 'currency', required: true },
          { id: 'areaRequired', type: 'area', required: true },
          { id: 'equipmentCosts', type: 'currency', required: false },
          { id: 'financingSupport', type: 'boolean', required: true }
        ]
      },
      {
        id: 'support_training',
        title: 'Support & Training',
        subtitle: 'What support will you provide?',
        fields: [
          { id: 'trainingDuration', type: 'select', options: ['1 week', '2 weeks', '1 month', '2 months', '3 months+'], required: true },
          { id: 'trainingLocation', type: 'select', options: ['Head Office', 'Regional Centers', 'On-site', 'Online'], required: true },
          { id: 'ongoingSupport', type: 'multiselect', required: true },
          { id: 'marketingSupport', type: 'multiselect', required: true },
          { id: 'operationalManuals', type: 'boolean', required: true }
        ]
      }
    ]
  },

  [BUSINESS_MODEL_TYPES.DEALERSHIP]: {
    steps: [
      {
        id: 'business_model',
        title: 'Partnership Type',
        subtitle: 'Choose your partnership model',
        required: true
      },
      {
        id: 'basic_info',
        title: 'Brand Information',
        subtitle: 'Tell us about your brand',
        fields: [
          { id: 'brandName', type: 'text', required: true },
          { id: 'brandLogo', type: 'image', required: true },
          { id: 'industries', type: 'multiselect', required: true },
          { id: 'foundedYear', type: 'year', required: true },
          { id: 'productCategories', type: 'multiselect', required: true }
        ]
      },
      {
        id: 'dealership_details',
        title: 'Dealership Terms',
        subtitle: 'Dealer-specific requirements',
        fields: [
          { id: 'dealerMargin', type: 'percentage', required: true },
          { id: 'minimumOrderValue', type: 'currency', required: true },
          { id: 'salesTargets', type: 'select', options: ['Monthly', 'Quarterly', 'Yearly', 'Flexible'], required: true },
          { id: 'territoryType', type: 'select', options: ['City', 'District', 'State', 'Multi-state'], required: true },
          { id: 'exclusivityLevel', type: 'select', options: ['Exclusive', 'Semi-exclusive', 'Non-exclusive'], required: true }
        ]
      },
      {
        id: 'investment',
        title: 'Investment & Infrastructure',
        subtitle: 'Financial and setup requirements',
        fields: [
          { id: 'investmentRange', type: 'cardselect', required: true },
          { id: 'showroomSize', type: 'area', required: true },
          { id: 'stockValue', type: 'currency', required: true },
          { id: 'displayRequirements', type: 'multiselect', required: true },
          { id: 'staffRequirements', type: 'number', required: true }
        ]
      },
      {
        id: 'support_training',
        title: 'Support & Training',
        subtitle: 'What support will you provide?',
        fields: [
          { id: 'productTraining', type: 'select', options: ['1 week', '2 weeks', '1 month', 'Ongoing'], required: true },
          { id: 'salesSupport', type: 'multiselect', required: true },
          { id: 'marketingSupport', type: 'multiselect', required: true },
          { id: 'technicalSupport', type: 'boolean', required: true },
          { id: 'afterSalesSupport', type: 'boolean', required: true }
        ]
      }
    ]
  },

  [BUSINESS_MODEL_TYPES.DISTRIBUTORSHIP]: {
    steps: [
      {
        id: 'business_model',
        title: 'Partnership Type',
        subtitle: 'Choose your partnership model',
        required: true
      },
      {
        id: 'basic_info',
        title: 'Brand Information',
        subtitle: 'Tell us about your brand',
        fields: [
          { id: 'brandName', type: 'text', required: true },
          { id: 'brandLogo', type: 'image', required: true },
          { id: 'industries', type: 'multiselect', required: true },
          { id: 'productLines', type: 'multiselect', required: true },
          { id: 'companySize', type: 'select', options: ['Startup', 'Small', 'Medium', 'Large', 'Enterprise'], required: true }
        ]
      },
      {
        id: 'distribution_details',
        title: 'Distribution Terms',
        subtitle: 'Distribution-specific requirements',
        fields: [
          { id: 'distributorMargin', type: 'percentage', required: true },
          { id: 'minimumPurchase', type: 'currency', required: true },
          { id: 'territorySize', type: 'select', options: ['City', 'District', 'State', 'Region', 'Zone'], required: true },
          { id: 'distributionNetwork', type: 'number', required: true },
          { id: 'logisticsSupport', type: 'select', options: ['Company provided', 'Distributor arranged', 'Shared'], required: true }
        ]
      },
      {
        id: 'investment',
        title: 'Investment & Infrastructure',
        subtitle: 'Warehousing and infrastructure needs',
        fields: [
          { id: 'investmentRange', type: 'cardselect', required: true },
          { id: 'warehouseSize', type: 'area', required: true },
          { id: 'inventoryValue', type: 'currency', required: true },
          { id: 'transportFleet', type: 'select', options: ['Own fleet', 'Third party', 'Mixed'], required: true },
          { id: 'staffSize', type: 'number', required: true }
        ]
      },
      {
        id: 'support_training',
        title: 'Support & Training',
        subtitle: 'Distribution support services',
        fields: [
          { id: 'productTraining', type: 'boolean', required: true },
          { id: 'salesTraining', type: 'boolean', required: true },
          { id: 'marketingSupport', type: 'multiselect', required: true },
          { id: 'inventoryManagement', type: 'boolean', required: true },
          { id: 'creditSupport', type: 'select', options: ['Yes', 'No', 'Case by case'], required: true }
        ]
      }
    ]
  },

  [BUSINESS_MODEL_TYPES.STOCKIST]: {
    steps: [
      {
        id: 'business_model',
        title: 'Partnership Type',
        subtitle: 'Choose your partnership model',
        required: true
      },
      {
        id: 'basic_info',
        title: 'Brand Information',
        subtitle: 'Tell us about your brand',
        fields: [
          { id: 'brandName', type: 'text', required: true },
          { id: 'brandLogo', type: 'image', required: true },
          { id: 'industries', type: 'multiselect', required: true },
          { id: 'productTypes', type: 'multiselect', required: true },
          { id: 'targetMarket', type: 'select', options: ['B2B', 'B2C', 'Both'], required: true }
        ]
      },
      {
        id: 'stockist_details',
        title: 'Stockist Terms',
        subtitle: 'Stock and supply requirements',
        fields: [
          { id: 'stockistMargin', type: 'percentage', required: true },
          { id: 'minimumStock', type: 'currency', required: true },
          { id: 'creditPeriod', type: 'select', options: ['Cash', '15 days', '30 days', '45 days', '60 days'], required: true },
          { id: 'serviceRadius', type: 'select', options: ['5 km', '10 km', '15 km', '20 km', 'City-wide'], required: true },
          { id: 'deliveryFrequency', type: 'select', options: ['Daily', 'Alternate days', 'Weekly', 'Bi-weekly'], required: true }
        ]
      },
      {
        id: 'investment',
        title: 'Investment Requirements',
        subtitle: 'Setup and working capital needs',
        fields: [
          { id: 'investmentRange', type: 'cardselect', required: true },
          { id: 'storageSpace', type: 'area', required: true },
          { id: 'workingCapital', type: 'currency', required: true },
          { id: 'vehicleRequired', type: 'select', options: ['Two wheeler', 'Three wheeler', 'Four wheeler', 'Not required'], required: false },
          { id: 'staffRequired', type: 'number', required: true }
        ]
      },
      {
        id: 'support_training',
        title: 'Support & Training',
        subtitle: 'What support will you provide?',
        fields: [
          { id: 'productKnowledge', type: 'boolean', required: true },
          { id: 'salesSupport', type: 'boolean', required: true },
          { id: 'inventoryGuidance', type: 'boolean', required: true },
          { id: 'promotionalSupport', type: 'multiselect', required: true },
          { id: 'orderManagement', type: 'select', options: ['Manual', 'App-based', 'ERP system'], required: true }
        ]
      }
    ]
  },

  [BUSINESS_MODEL_TYPES.CHANNEL_PARTNER]: {
    steps: [
      {
        id: 'business_model',
        title: 'Partnership Type',
        subtitle: 'Choose your partnership model',
        required: true
      },
      {
        id: 'basic_info',
        title: 'Partnership Information',
        subtitle: 'Tell us about your business',
        fields: [
          { id: 'brandName', type: 'text', required: true },
          { id: 'brandLogo', type: 'image', required: true },
          { id: 'industries', type: 'multiselect', required: true },
          { id: 'partnershipType', type: 'select', options: ['Sales Partner', 'Technology Partner', 'Service Partner', 'Marketing Partner'], required: true },
          { id: 'businessModel', type: 'select', options: ['B2B', 'B2C', 'B2B2C'], required: true }
        ]
      },
      {
        id: 'partnership_details',
        title: 'Partnership Terms',
        subtitle: 'Collaboration structure',
        fields: [
          { id: 'revenueModel', type: 'select', options: ['Commission', 'Revenue Share', 'Fixed Fee', 'Hybrid'], required: true },
          { id: 'commissionRate', type: 'percentage', required: true },
          { id: 'targetSegment', type: 'multiselect', required: true },
          { id: 'exclusivity', type: 'select', options: ['Exclusive', 'Non-exclusive', 'Preferred partner'], required: true },
          { id: 'partnershipDuration', type: 'select', options: ['1 year', '2 years', '3 years', '5 years', 'Open-ended'], required: true }
        ]
      },
      {
        id: 'investment',
        title: 'Investment & Resources',
        subtitle: 'Resource requirements',
        fields: [
          { id: 'investmentRange', type: 'cardselect', required: true },
          { id: 'teamSize', type: 'number', required: true },
          { id: 'infrastructureNeeds', type: 'multiselect', required: false },
          { id: 'technologyRequirements', type: 'multiselect', required: false },
          { id: 'marketingBudget', type: 'currency', required: false }
        ]
      },
      {
        id: 'support_training',
        title: 'Support & Enablement',
        subtitle: 'Partnership support services',
        fields: [
          { id: 'trainingProgram', type: 'multiselect', required: true },
          { id: 'salesSupport', type: 'multiselect', required: true },
          { id: 'marketingSupport', type: 'multiselect', required: true },
          { id: 'technicalSupport', type: 'boolean', required: true },
          { id: 'performanceTracking', type: 'boolean', required: true }
        ]
      }
    ]
  }
};

/**
 * Common field options across business models
 */
export const FIELD_OPTIONS = {
  industries: [
    { label: 'Food & Beverage', value: 'food_beverage', icon: '🍔' },
    { label: 'Retail', value: 'retail', icon: '🛍️' },
    { label: 'Healthcare', value: 'healthcare', icon: '🏥' },
    { label: 'Education', value: 'education', icon: '🎓' },
    { label: 'Technology', value: 'technology', icon: '💻' },
    { label: 'Automotive', value: 'automotive', icon: '🚗' },
    { label: 'Real Estate', value: 'real_estate', icon: '🏢' },
    { label: 'Fitness & Wellness', value: 'fitness', icon: '💪' },
    { label: 'Beauty & Cosmetics', value: 'beauty', icon: '💄' },
    { label: 'Travel & Tourism', value: 'travel', icon: '✈️' },
    { label: 'Entertainment', value: 'entertainment', icon: '🎬' },
    { label: 'Home Services', value: 'home_services', icon: '🏠' }
  ],

  investmentRanges: [
    { label: 'Under ₹1 Lakh', value: 'under_1L', color: '#4caf50', subtitle: 'Low Investment' },
    { label: '₹1-5 Lakhs', value: '1L_5L', color: '#8bc34a', subtitle: 'Moderate Investment' },
    { label: '₹5-20 Lakhs', value: '5L_20L', color: '#ff9800', subtitle: 'Medium Investment' },
    { label: '₹20L-1 Crore', value: '20L_1Cr', color: '#f44336', subtitle: 'High Investment' },
    { label: '₹1-5 Crores', value: '1Cr_5Cr', color: '#9c27b0', subtitle: 'Very High Investment' },
    { label: 'Above ₹5 Crores', value: 'above_5Cr', color: '#673ab7', subtitle: 'Ultra High Investment' }
  ],

  territoryRights: [
    { label: 'Exclusive Territory', value: 'exclusive' },
    { label: 'Non-Exclusive Territory', value: 'non_exclusive' },
    { label: 'Protected Territory', value: 'protected' },
    { label: 'No Territory Protection', value: 'none' }
  ],

  franchiseTerms: [
    { label: '3 Years', value: '3_years' },
    { label: '5 Years', value: '5_years' },
    { label: '7 Years', value: '7_years' },
    { label: '10 Years', value: '10_years' },
    { label: '15 Years', value: '15_years' },
    { label: '20+ Years', value: '20_plus_years' }
  ],

  trainingDuration: [
    { label: '1 Week', value: '1_week' },
    { label: '2 Weeks', value: '2_weeks' },
    { label: '1 Month', value: '1_month' },
    { label: '2 Months', value: '2_months' },
    { label: '3 Months', value: '3_months' },
    { label: '6+ Months', value: '6_plus_months' }
  ],

  revenueModels: [
    { label: 'Royalty Based', value: 'royalty', subtitle: '% of revenue', color: '#1976d2' },
    { label: 'Flat Fee', value: 'flat_fee', subtitle: 'Fixed monthly/yearly', color: '#388e3c' },
    { label: 'Margin Based', value: 'margin', subtitle: '% of profit', color: '#f57c00' },
    { label: 'Commission Based', value: 'commission', subtitle: '% of sales', color: '#7b1fa2' },
    { label: 'Hybrid Model', value: 'hybrid', subtitle: 'Multiple components', color: '#d32f2f' }
  ],

  ongoingSupport: [
    { label: 'Operations Support', value: 'operations' },
    { label: 'Marketing Support', value: 'marketing' },
    { label: 'Technical Support', value: 'technical' },
    { label: 'Training Support', value: 'training' },
    { label: 'Financial Guidance', value: 'financial' },
    { label: 'Legal Support', value: 'legal' },
    { label: 'HR Support', value: 'hr' },
    { label: 'Quality Control', value: 'quality' }
  ],

  marketingSupport: [
    { label: 'Digital Marketing', value: 'digital' },
    { label: 'Print Advertising', value: 'print' },
    { label: 'Radio/TV Ads', value: 'broadcast' },
    { label: 'Social Media', value: 'social' },
    { label: 'Local Events', value: 'events' },
    { label: 'Promotional Materials', value: 'materials' },
    { label: 'Grand Opening Support', value: 'opening' },
    { label: 'Seasonal Campaigns', value: 'seasonal' }
  ],

  displayRequirements: [
    { label: 'Brand Signage', value: 'signage' },
    { label: 'Product Display', value: 'display' },
    { label: 'Interior Design', value: 'interior' },
    { label: 'Uniform Guidelines', value: 'uniform' },
    { label: 'Marketing Materials', value: 'marketing' },
    { label: 'POS Materials', value: 'pos' }
  ],

  experienceRequired: [
    { label: 'No Experience Required', value: 'none', icon: '👋' },
    { label: 'Business Experience', value: 'business', icon: '💼' },
    { label: 'Industry Experience', value: 'industry', icon: '🏭' },
    { label: 'Retail Experience', value: 'retail', icon: '🛍️' },
    { label: 'Management Experience', value: 'management', icon: '👔' },
    { label: 'Sales Experience', value: 'sales', icon: '💰' },
    { label: 'Customer Service', value: 'customer_service', icon: '🤝' },
    { label: 'Technical Skills', value: 'technical', icon: '⚙️' }
  ],

  qualification: [
    { label: 'No Specific Requirement', value: 'none', icon: '✨' },
    { label: '10th Pass', value: '10th', icon: '📚' },
    { label: '12th Pass', value: '12th', icon: '🎓' },
    { label: 'Graduate', value: 'graduate', icon: '🎓' },
    { label: 'Post Graduate', value: 'post_graduate', icon: '👨‍🎓' },
    { label: 'Professional Degree', value: 'professional', icon: '👩‍⚕️' },
    { label: 'Technical Diploma', value: 'diploma', icon: '🔧' },
    { label: 'MBA/Business', value: 'mba', icon: '💼' }
  ],

  salesSupport: [
    { label: 'Sales Training', value: 'training' },
    { label: 'Lead Generation', value: 'leads' },
    { label: 'Sales Tools', value: 'tools' },
    { label: 'CRM Access', value: 'crm' },
    { label: 'Sales Incentives', value: 'incentives' },
    { label: 'Territory Planning', value: 'planning' }
  ],

  promotionalSupport: [
    { label: 'Launch Support', value: 'launch' },
    { label: 'Seasonal Offers', value: 'seasonal' },
    { label: 'Festive Campaigns', value: 'festive' },
    { label: 'Trade Promotions', value: 'trade' },
    { label: 'Consumer Schemes', value: 'consumer' },
    { label: 'Loyalty Programs', value: 'loyalty' }
  ],

  trainingProgram: [
    { label: 'Product Training', value: 'product' },
    { label: 'Sales Training', value: 'sales' },
    { label: 'Technical Training', value: 'technical' },
    { label: 'Customer Service', value: 'service' },
    { label: 'Digital Tools', value: 'digital' },
    { label: 'Compliance Training', value: 'compliance' }
  ],

  targetSegment: [
    { label: 'SME Businesses', value: 'sme' },
    { label: 'Enterprise Clients', value: 'enterprise' },
    { label: 'Individual Consumers', value: 'consumers' },
    { label: 'Government Sector', value: 'government' },
    { label: 'Educational Institutions', value: 'education' },
    { label: 'Healthcare Sector', value: 'healthcare' }
  ]
};

/**
 * Get field configuration for a specific business model
 */
export const getBusinessModelFields = (businessModelType) => {
  return BUSINESS_MODEL_FIELDS[businessModelType] || BUSINESS_MODEL_FIELDS[BUSINESS_MODEL_TYPES.FRANCHISE];
};

/**
 * Get field options for a specific field type
 */
export const getFieldOptions = (fieldType) => {
  return FIELD_OPTIONS[fieldType] || [];
};