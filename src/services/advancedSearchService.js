import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
} from 'firebase/firestore';
import { db } from '../firebase/firebase';

/**
 * Advanced Search and Filter Service
 * Handles complex filtering and searching for brand registrations
 */

/**
 * Apply filters to Firestore query
 * @param {Object} filters - Filter criteria
 * @param {number} pageSize - Results per page
 * @param {DocumentSnapshot} lastDoc - Last document for pagination
 * @returns {Promise<Object>} Query results and metadata
 */
export const applyFilters = async (filters, pageSize = 20, lastDoc = null) => {
  try {
    const brandsRef = collection(db, 'brands');
    let constraints = [];

    // Text search (limited in Firestore - use array-contains for tags/keywords)
    if (filters.searchQuery) {
      // This is a simplified approach - for production, consider using Algolia or ElasticSearch
      // For now, we'll filter client-side after fetching
    }

    // Status filter (array)
    if (filters.status && filters.status.length > 0) {
      constraints.push(where('status', 'in', filters.status.slice(0, 10))); // Firestore limits 'in' to 10 items
    }

    // Business Model filter
    if (filters.businessModel && filters.businessModel.length > 0) {
      constraints.push(where('businessModelType', 'in', filters.businessModel.slice(0, 10)));
    }

    // Industry filter
    if (filters.industry && filters.industry.length > 0) {
      constraints.push(where('industry', 'in', filters.industry.slice(0, 10)));
    }

    // Investment range filter
    if (filters.investmentRange) {
      if (filters.investmentRange.min > 0) {
        constraints.push(where('totalInvestment', '>=', filters.investmentRange.min));
      }
      if (filters.investmentRange.max < 10000000) {
        constraints.push(where('totalInvestment', '<=', filters.investmentRange.max));
      }
    }

    // Date range filter
    if (filters.dateRange?.start) {
      constraints.push(where('createdAt', '>=', new Date(filters.dateRange.start)));
    }
    if (filters.dateRange?.end) {
      constraints.push(where('createdAt', '<=', new Date(filters.dateRange.end)));
    }

    // Sorting
    const sortField = filters.sortBy || 'createdAt';
    const sortDirection = filters.sortOrder || 'desc';
    constraints.push(orderBy(sortField, sortDirection));

    // Pagination
    constraints.push(limit(pageSize));
    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    // Build and execute query
    const q = query(brandsRef, ...constraints);
    const snapshot = await getDocs(q);

    let results = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Client-side text search (if query provided)
    if (filters.searchQuery) {
      results = performClientSearch(results, filters.searchQuery);
    }

    // Client-side location filtering (if needed)
    if (filters.location?.country && filters.location.country.length > 0) {
      results = results.filter(brand =>
        filters.location.country.includes(brand.country)
      );
    }

    return {
      success: true,
      results,
      lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
      hasMore: snapshot.docs.length === pageSize,
      total: results.length,
    };
  } catch (error) {
    console.error('Filter application error:', error);
    return {
      success: false,
      error: error.message,
      results: [],
    };
  }
};

/**
 * Perform client-side text search
 * @private
 */
const performClientSearch = (results, searchQuery) => {
  const query = searchQuery.toLowerCase().trim();
  
  return results.filter(brand => {
    const searchableText = [
      brand.brandName,
      brand.ownerName,
      brand.industry,
      brand.description,
      brand.city,
      brand.state,
      brand.country,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return searchableText.includes(query);
  });
};

/**
 * Get aggregated statistics based on current filters
 * @param {Array} results - Filtered results
 * @returns {Object} Statistics
 */
export const getFilterStats = (results) => {
  const stats = {
    total: results.length,
    byStatus: {},
    byIndustry: {},
    byBusinessModel: {},
    investmentStats: {
      min: Infinity,
      max: -Infinity,
      average: 0,
      median: 0,
    },
    dateStats: {
      oldest: null,
      newest: null,
    },
  };

  if (results.length === 0) return stats;

  // Count by status
  results.forEach(brand => {
    stats.byStatus[brand.status] = (stats.byStatus[brand.status] || 0) + 1;
    stats.byIndustry[brand.industry] = (stats.byIndustry[brand.industry] || 0) + 1;
    stats.byBusinessModel[brand.businessModelType] = (stats.byBusinessModel[brand.businessModelType] || 0) + 1;

    // Investment stats
    const investment = brand.totalInvestment || 0;
    if (investment < stats.investmentStats.min) stats.investmentStats.min = investment;
    if (investment > stats.investmentStats.max) stats.investmentStats.max = investment;

    // Date stats
    const createdAt = brand.createdAt?.toDate?.() || new Date(brand.createdAt);
    if (!stats.dateStats.oldest || createdAt < stats.dateStats.oldest) {
      stats.dateStats.oldest = createdAt;
    }
    if (!stats.dateStats.newest || createdAt > stats.dateStats.newest) {
      stats.dateStats.newest = createdAt;
    }
  });

  // Calculate investment average
  const totalInvestment = results.reduce((sum, brand) => sum + (brand.totalInvestment || 0), 0);
  stats.investmentStats.average = Math.round(totalInvestment / results.length);

  // Calculate median investment
  const sortedInvestments = results
    .map(b => b.totalInvestment || 0)
    .sort((a, b) => a - b);
  const mid = Math.floor(sortedInvestments.length / 2);
  stats.investmentStats.median = sortedInvestments.length % 2 === 0
    ? (sortedInvestments[mid - 1] + sortedInvestments[mid]) / 2
    : sortedInvestments[mid];

  return stats;
};

/**
 * Export filtered results to CSV
 * @param {Array} results - Filtered results
 * @param {string} filename - Export filename
 */
export const exportToCSV = (results, filename = 'brand-registrations.csv') => {
  if (results.length === 0) return;

  // Define columns
  const columns = [
    'ID',
    'Brand Name',
    'Owner Name',
    'Industry',
    'Business Model',
    'Status',
    'Total Investment',
    'Franchise Units',
    'Country',
    'State',
    'City',
    'Created Date',
  ];

  // Convert data to CSV
  const csvData = [
    columns.join(','), // Header row
    ...results.map(brand => [
      brand.id,
      `"${brand.brandName || ''}"`,
      `"${brand.ownerName || ''}"`,
      brand.industry || '',
      brand.businessModelType || '',
      brand.status || '',
      brand.totalInvestment || 0,
      brand.franchiseUnits || 0,
      brand.country || '',
      brand.state || '',
      brand.city || '',
      brand.createdAt?.toDate?.().toLocaleDateString() || '',
    ].join(','))
  ].join('\n');

  // Download file
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

/**
 * Export filtered results to JSON
 * @param {Array} results - Filtered results
 * @param {string} filename - Export filename
 */
export const exportToJSON = (results, filename = 'brand-registrations.json') => {
  const jsonData = JSON.stringify(results, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

/**
 * Get common filter presets
 * @returns {Array} Preset filters
 */
export const getFilterPresets = () => [
  {
    id: 'pending-review',
    name: 'Pending Review',
    filters: {
      status: ['pending', 'under_review'],
      sortBy: 'createdAt',
      sortOrder: 'desc',
    },
  },
  {
    id: 'approved-high-investment',
    name: 'Approved (High Investment)',
    filters: {
      status: ['approved'],
      investmentRange: { min: 500000, max: 10000000 },
      sortBy: 'totalInvestment',
      sortOrder: 'desc',
    },
  },
  {
    id: 'food-beverage',
    name: 'Food & Beverage',
    filters: {
      industry: ['Food & Beverage'],
      status: ['approved'],
      sortBy: 'franchiseUnits',
      sortOrder: 'desc',
    },
  },
  {
    id: 'new-this-month',
    name: 'New This Month',
    filters: {
      dateRange: {
        start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
        end: new Date().toISOString(),
      },
      sortBy: 'createdAt',
      sortOrder: 'desc',
    },
  },
  {
    id: 'master-franchises',
    name: 'Master Franchises',
    filters: {
      businessModel: ['Master Franchise'],
      status: ['approved'],
      sortBy: 'totalInvestment',
      sortOrder: 'desc',
    },
  },
];

export default {
  applyFilters,
  getFilterStats,
  exportToCSV,
  exportToJSON,
  getFilterPresets,
};
