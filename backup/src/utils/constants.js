// src/utils/constants.js
export const APP_NAME = 'FranchiseHub'
export const APP_TAGLINE = 'Your Gateway to Restaurant Franchise Success'

export const CONTACT_INFO = {
  phone: '+1 (555) 123-4567',
  email: 'info@franchisehub.com',
  address: {
    street: '123 Business Avenue',
    suite: 'Suite 100',
    city: 'New York',
    state: 'NY',
    zip: '10001'
  }
}

export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/franchisehub',
  twitter: 'https://twitter.com/franchisehub',
  linkedin: 'https://linkedin.com/company/franchisehub',
  instagram: 'https://instagram.com/franchisehub'
}

export const FRANCHISE_CATEGORIES = [
  'Pizza',
  'Burgers',
  'Mexican',
  'Asian',
  'Coffee',
  'Ice Cream',
  'Sandwiches',
  'Seafood',
  'Chicken',
  'Italian',
  'Indian',
  'Mediterranean'
]

export const INVESTMENT_RANGES = [
  { label: 'Under $100K', min: 0, max: 99999 },
  { label: '$100K - $200K', min: 100000, max: 199999 },
  { label: '$200K - $300K', min: 200000, max: 299999 },
  { label: '$300K - $500K', min: 300000, max: 499999 },
  { label: 'Over $500K', min: 500000, max: Infinity }
]

export const BLOG_CATEGORIES = [
  'Investment Tips',
  'Financing',
  'Market Analysis',
  'Success Tips',
  'Industry Trends',
  'Operations',
  'Marketing',
  'Legal',
  'Technology'
]

export const LOCAL_STORAGE_KEYS = {
  USER_CAPTURED: 'userCaptured',
  SEARCH_HISTORY: 'searchHistory',
  VIEWED_BRANDS: 'viewedBrands',
  USER_PREFERENCES: 'userPreferences'
}

export const TRACKING_EVENTS = {
  PAGE_VIEW: 'page_view',
  BRAND_VIEW: 'brand_view',
  INQUIRY_SUBMITTED: 'inquiry_submitted',
  LEAD_CAPTURED: 'lead_captured',
  CHAT_STARTED: 'chat_started',
  PHONE_CLICKED: 'phone_clicked',
  EMAIL_CLICKED: 'email_clicked'
}