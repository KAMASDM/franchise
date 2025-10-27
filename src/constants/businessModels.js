/**
 * Business Model Types and Configurations
 * Supports multiple partnership models: Franchise, Dealership, Distributorship, etc.
 */

export const BUSINESS_MODEL_TYPES = {
  FRANCHISE: 'franchise',
  DEALERSHIP: 'dealership',
  DISTRIBUTORSHIP: 'distributorship',
  STOCKIST: 'stockist',
  CHANNEL_PARTNER: 'channel_partner',
  MASTER_FRANCHISE: 'master_franchise',
  AREA_FRANCHISE: 'area_franchise',
  AUTHORIZED_DEALER: 'authorized_dealer',
  SUPER_STOCKIST: 'super_stockist',
  C_AND_F_AGENT: 'c_and_f_agent', // Carry & Forward Agent
  WHOLESALE_DISTRIBUTOR: 'wholesale_distributor'
};

export const BUSINESS_MODEL_CONFIG = {
  [BUSINESS_MODEL_TYPES.FRANCHISE]: {
    id: BUSINESS_MODEL_TYPES.FRANCHISE,
    label: 'Franchise',
    pluralLabel: 'Franchises',
    description: 'Complete business format with brand licensing, operational support, and ongoing royalties',
    icon: 'Store',
    color: '#1976d2',
    features: [
      'Brand licensing',
      'Complete operational manual',
      'Training & support',
      'Marketing assistance',
      'Ongoing royalty payments'
    ],
    investmentType: 'High to Very High',
    commitmentLevel: 'Long-term (5-10 years)',
    controlLevel: 'High brand control',
    keywords: ['franchise', 'franchisee', 'outlet', 'store']
  },
  [BUSINESS_MODEL_TYPES.MASTER_FRANCHISE]: {
    id: BUSINESS_MODEL_TYPES.MASTER_FRANCHISE,
    label: 'Master Franchise',
    pluralLabel: 'Master Franchises',
    description: 'Exclusive rights to develop and sub-franchise in a specific territory or region',
    icon: 'Business',
    color: '#0d47a1',
    features: [
      'Territory exclusivity',
      'Sub-franchising rights',
      'Regional brand development',
      'Higher investment',
      'Revenue from sub-franchisees'
    ],
    investmentType: 'Very High',
    commitmentLevel: 'Long-term (10-20 years)',
    controlLevel: 'Regional control',
    keywords: ['master franchise', 'territory', 'regional', 'sub-franchise']
  },
  [BUSINESS_MODEL_TYPES.AREA_FRANCHISE]: {
    id: BUSINESS_MODEL_TYPES.AREA_FRANCHISE,
    label: 'Area Franchise',
    pluralLabel: 'Area Franchises',
    description: 'Rights to open multiple units in a specific geographic area',
    icon: 'Map',
    color: '#1565c0',
    features: [
      'Multiple unit rights',
      'Area exclusivity',
      'Development schedule',
      'Bulk discounts',
      'Regional support'
    ],
    investmentType: 'High',
    commitmentLevel: 'Long-term (7-15 years)',
    controlLevel: 'Area control',
    keywords: ['area franchise', 'multi-unit', 'territory']
  },
  [BUSINESS_MODEL_TYPES.DEALERSHIP]: {
    id: BUSINESS_MODEL_TYPES.DEALERSHIP,
    label: 'Dealership',
    pluralLabel: 'Dealerships',
    description: 'Authorized to sell products/services with sales targets and territory rights',
    icon: 'Storefront',
    color: '#f57c00',
    features: [
      'Product sales authorization',
      'Territory exclusivity (optional)',
      'Sales targets',
      'Marketing support',
      'Dealer margins'
    ],
    investmentType: 'Medium to High',
    commitmentLevel: 'Medium-term (3-5 years)',
    controlLevel: 'Moderate brand control',
    keywords: ['dealer', 'dealership', 'authorized dealer', 'showroom']
  },
  [BUSINESS_MODEL_TYPES.AUTHORIZED_DEALER]: {
    id: BUSINESS_MODEL_TYPES.AUTHORIZED_DEALER,
    label: 'Authorized Dealer',
    pluralLabel: 'Authorized Dealers',
    description: 'Official dealer with brand authorization and quality standards',
    icon: 'VerifiedUser',
    color: '#ff6f00',
    features: [
      'Brand authorization',
      'Quality standards',
      'After-sales service',
      'Display requirements',
      'Technical training'
    ],
    investmentType: 'Medium',
    commitmentLevel: 'Medium-term (2-5 years)',
    controlLevel: 'Brand standards compliance',
    keywords: ['authorized', 'dealer', 'certified', 'official']
  },
  [BUSINESS_MODEL_TYPES.DISTRIBUTORSHIP]: {
    id: BUSINESS_MODEL_TYPES.DISTRIBUTORSHIP,
    label: 'Distributorship',
    pluralLabel: 'Distributorships',
    description: 'Bulk purchasing and distribution to retailers with territory coverage',
    icon: 'LocalShipping',
    color: '#388e3c',
    features: [
      'Bulk purchasing',
      'Warehousing',
      'Logistics management',
      'Retailer network',
      'Territory coverage'
    ],
    investmentType: 'High',
    commitmentLevel: 'Medium to Long-term (3-7 years)',
    controlLevel: 'Distribution control',
    keywords: ['distributor', 'distribution', 'wholesale', 'bulk']
  },
  [BUSINESS_MODEL_TYPES.WHOLESALE_DISTRIBUTOR]: {
    id: BUSINESS_MODEL_TYPES.WHOLESALE_DISTRIBUTOR,
    label: 'Wholesale Distributor',
    pluralLabel: 'Wholesale Distributors',
    description: 'Large-scale distribution with warehousing and logistics infrastructure',
    icon: 'Warehouse',
    color: '#2e7d32',
    features: [
      'Large warehouse facility',
      'Extensive logistics network',
      'Volume discounts',
      'Multi-tier distribution',
      'Territory exclusivity'
    ],
    investmentType: 'Very High',
    commitmentLevel: 'Long-term (5-10 years)',
    controlLevel: 'Regional distribution',
    keywords: ['wholesale', 'distributor', 'warehouse', 'logistics']
  },
  [BUSINESS_MODEL_TYPES.STOCKIST]: {
    id: BUSINESS_MODEL_TYPES.STOCKIST,
    label: 'Stockist',
    pluralLabel: 'Stockists',
    description: 'Stock and supply products to local retailers with inventory management',
    icon: 'Inventory',
    color: '#00796b',
    features: [
      'Inventory stocking',
      'Local supply',
      'Retailer servicing',
      'Stock maintenance',
      'Quick delivery'
    ],
    investmentType: 'Low to Medium',
    commitmentLevel: 'Short to Medium-term (1-3 years)',
    controlLevel: 'Inventory management',
    keywords: ['stockist', 'stock', 'inventory', 'supply']
  },
  [BUSINESS_MODEL_TYPES.SUPER_STOCKIST]: {
    id: BUSINESS_MODEL_TYPES.SUPER_STOCKIST,
    label: 'Super Stockist',
    pluralLabel: 'Super Stockists',
    description: 'Primary stockist supplying to regular stockists and large retailers',
    icon: 'Store',
    color: '#00695c',
    features: [
      'Large inventory capacity',
      'Supply to stockists',
      'Regional coverage',
      'Better margins',
      'Direct company support'
    ],
    investmentType: 'Medium to High',
    commitmentLevel: 'Medium-term (2-5 years)',
    controlLevel: 'Regional supply chain',
    keywords: ['super stockist', 'primary stockist', 'wholesale']
  },
  [BUSINESS_MODEL_TYPES.C_AND_F_AGENT]: {
    id: BUSINESS_MODEL_TYPES.C_AND_F_AGENT,
    label: 'C&F Agent',
    pluralLabel: 'C&F Agents',
    description: 'Carry & Forward agent handling logistics, warehousing, and distribution',
    icon: 'LocalShipping',
    color: '#5d4037',
    features: [
      'Warehousing facility',
      'Transportation fleet',
      'Order processing',
      'Logistics management',
      'Territory servicing'
    ],
    investmentType: 'Medium to High',
    commitmentLevel: 'Medium-term (2-5 years)',
    controlLevel: 'Logistics operations',
    keywords: ['c&f', 'carry forward', 'logistics', 'warehouse']
  },
  [BUSINESS_MODEL_TYPES.CHANNEL_PARTNER]: {
    id: BUSINESS_MODEL_TYPES.CHANNEL_PARTNER,
    label: 'Channel Partner',
    pluralLabel: 'Channel Partners',
    description: 'Strategic partnership for market reach, sales, and business development',
    icon: 'Handshake',
    color: '#7b1fa2',
    features: [
      'Strategic alliance',
      'Market development',
      'Joint marketing',
      'Revenue sharing',
      'Mutual growth'
    ],
    investmentType: 'Variable',
    commitmentLevel: 'Flexible (1-5 years)',
    controlLevel: 'Partnership terms',
    keywords: ['channel partner', 'partner', 'alliance', 'collaboration']
  }
};

/**
 * Investment range configurations for different business models
 */
export const INVESTMENT_RANGES = {
  VERY_LOW: { min: 0, max: 100000, label: 'Under ₹1 Lakh' },
  LOW: { min: 100000, max: 500000, label: '₹1-5 Lakhs' },
  MEDIUM: { min: 500000, max: 2000000, label: '₹5-20 Lakhs' },
  HIGH: { min: 2000000, max: 10000000, label: '₹20 Lakhs - ₹1 Crore' },
  VERY_HIGH: { min: 10000000, max: 50000000, label: '₹1-5 Crores' },
  ULTRA_HIGH: { min: 50000000, max: Infinity, label: 'Above ₹5 Crores' }
};

/**
 * Revenue models for different partnership types
 */
export const REVENUE_MODELS = {
  ROYALTY: {
    id: 'royalty',
    label: 'Royalty Based',
    description: 'Percentage of revenue or profit as ongoing fee'
  },
  MARGIN: {
    id: 'margin',
    label: 'Margin Based',
    description: 'Profit margin on product sales'
  },
  COMMISSION: {
    id: 'commission',
    label: 'Commission Based',
    description: 'Commission on sales or transactions'
  },
  HYBRID: {
    id: 'hybrid',
    label: 'Hybrid Model',
    description: 'Combination of fees, margins, and commissions'
  },
  MARKUP: {
    id: 'markup',
    label: 'Markup Based',
    description: 'Fixed markup on product cost price'
  }
};

/**
 * Support types offered by brands
 */
export const SUPPORT_TYPES = {
  TRAINING: 'Initial & Ongoing Training',
  MARKETING: 'Marketing & Advertising Support',
  OPERATIONS: 'Operational Guidance',
  TECHNICAL: 'Technical Support',
  SUPPLY_CHAIN: 'Supply Chain Management',
  IT_SYSTEMS: 'IT Systems & Software',
  SITE_SELECTION: 'Site Selection Assistance',
  FINANCE: 'Financial Planning Support',
  LEGAL: 'Legal Documentation Support',
  HR: 'HR & Recruitment Support'
};

/**
 * Get business model configuration by ID
 */
export const getBusinessModelConfig = (modelId) => {
  return BUSINESS_MODEL_CONFIG[modelId] || BUSINESS_MODEL_CONFIG[BUSINESS_MODEL_TYPES.FRANCHISE];
};

/**
 * Get all business model options for dropdowns
 */
export const getBusinessModelOptions = () => {
  return Object.values(BUSINESS_MODEL_CONFIG).map(model => ({
    value: model.id,
    label: model.label,
    description: model.description
  }));
};

/**
 * Get business models by category
 */
export const getBusinessModelsByCategory = () => {
  return {
    franchise: [
      BUSINESS_MODEL_TYPES.FRANCHISE,
      BUSINESS_MODEL_TYPES.MASTER_FRANCHISE,
      BUSINESS_MODEL_TYPES.AREA_FRANCHISE
    ],
    distribution: [
      BUSINESS_MODEL_TYPES.DISTRIBUTORSHIP,
      BUSINESS_MODEL_TYPES.WHOLESALE_DISTRIBUTOR,
      BUSINESS_MODEL_TYPES.STOCKIST,
      BUSINESS_MODEL_TYPES.SUPER_STOCKIST,
      BUSINESS_MODEL_TYPES.C_AND_F_AGENT
    ],
    dealership: [
      BUSINESS_MODEL_TYPES.DEALERSHIP,
      BUSINESS_MODEL_TYPES.AUTHORIZED_DEALER
    ],
    partnership: [
      BUSINESS_MODEL_TYPES.CHANNEL_PARTNER
    ]
  };
};

/**
 * Get recommended business models based on industry
 */
export const getRecommendedModels = (industry) => {
  const recommendations = {
    'Food & Beverage': [
      BUSINESS_MODEL_TYPES.FRANCHISE,
      BUSINESS_MODEL_TYPES.AREA_FRANCHISE,
      BUSINESS_MODEL_TYPES.DISTRIBUTORSHIP
    ],
    'Retail': [
      BUSINESS_MODEL_TYPES.FRANCHISE,
      BUSINESS_MODEL_TYPES.DEALERSHIP,
      BUSINESS_MODEL_TYPES.DISTRIBUTORSHIP
    ],
    'Automotive': [
      BUSINESS_MODEL_TYPES.DEALERSHIP,
      BUSINESS_MODEL_TYPES.AUTHORIZED_DEALER,
      BUSINESS_MODEL_TYPES.DISTRIBUTORSHIP
    ],
    'FMCG': [
      BUSINESS_MODEL_TYPES.DISTRIBUTORSHIP,
      BUSINESS_MODEL_TYPES.SUPER_STOCKIST,
      BUSINESS_MODEL_TYPES.C_AND_F_AGENT
    ],
    'Manufacturing': [
      BUSINESS_MODEL_TYPES.DISTRIBUTORSHIP,
      BUSINESS_MODEL_TYPES.DEALERSHIP,
      BUSINESS_MODEL_TYPES.CHANNEL_PARTNER
    ],
    'Technology': [
      BUSINESS_MODEL_TYPES.CHANNEL_PARTNER,
      BUSINESS_MODEL_TYPES.DISTRIBUTORSHIP,
      BUSINESS_MODEL_TYPES.AUTHORIZED_DEALER
    ],
    'Healthcare': [
      BUSINESS_MODEL_TYPES.FRANCHISE,
      BUSINESS_MODEL_TYPES.DISTRIBUTORSHIP,
      BUSINESS_MODEL_TYPES.STOCKIST
    ],
    'Education': [
      BUSINESS_MODEL_TYPES.FRANCHISE,
      BUSINESS_MODEL_TYPES.MASTER_FRANCHISE,
      BUSINESS_MODEL_TYPES.CHANNEL_PARTNER
    ]
  };

  return recommendations[industry] || [
    BUSINESS_MODEL_TYPES.FRANCHISE,
    BUSINESS_MODEL_TYPES.DISTRIBUTORSHIP,
    BUSINESS_MODEL_TYPES.DEALERSHIP
  ];
};

export default {
  BUSINESS_MODEL_TYPES,
  BUSINESS_MODEL_CONFIG,
  INVESTMENT_RANGES,
  REVENUE_MODELS,
  SUPPORT_TYPES,
  getBusinessModelConfig,
  getBusinessModelOptions,
  getBusinessModelsByCategory,
  getRecommendedModels
};
