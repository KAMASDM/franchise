import { format, subDays, startOfDay, endOfDay, isWithinInterval } from 'date-fns';

/**
 * Calculate conversion rate between two metrics
 */
export const calculateConversionRate = (numerator, denominator) => {
  if (!denominator || denominator === 0) return 0;
  return ((numerator / denominator) * 100).toFixed(2);
};

/**
 * Calculate percentage change between two values
 */
export const calculatePercentageChange = (current, previous) => {
  if (!previous || previous === 0) return current > 0 ? 100 : 0;
  return (((current - previous) / previous) * 100).toFixed(2);
};

/**
 * Group data by time period (day, week, month)
 */
export const groupByTimePeriod = (data, dateField, period = 'day') => {
  const grouped = {};
  
  data.forEach(item => {
    const date = item[dateField];
    if (!date) return;
    
    let key;
    if (period === 'day') {
      key = format(date, 'yyyy-MM-dd');
    } else if (period === 'week') {
      key = format(date, 'yyyy-ww');
    } else if (period === 'month') {
      key = format(date, 'yyyy-MM');
    }
    
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(item);
  });
  
  return grouped;
};

/**
 * Calculate metrics for a time series
 */
export const calculateTimeSeriesMetrics = (data, dateField, metricField) => {
  const grouped = groupByTimePeriod(data, dateField, 'day');
  
  return Object.entries(grouped).map(([date, items]) => ({
    date,
    value: items.length,
    // If metricField is provided, sum that field instead of counting
    metric: metricField ? items.reduce((sum, item) => sum + (item[metricField] || 0), 0) : items.length
  })).sort((a, b) => new Date(a.date) - new Date(b.date));
};

/**
 * Filter data by date range
 */
export const filterByDateRange = (data, dateField, startDate, endDate) => {
  if (!data || !Array.isArray(data)) return [];
  
  return data.filter(item => {
    const itemDate = item[dateField];
    if (!itemDate) return false;
    
    return isWithinInterval(itemDate, {
      start: startOfDay(startDate),
      end: endOfDay(endDate)
    });
  });
};

/**
 * Get top N items by a specific metric
 */
export const getTopItems = (data, metricField, n = 5) => {
  if (!data || !Array.isArray(data)) return [];
  
  return [...data]
    .sort((a, b) => (b[metricField] || 0) - (a[metricField] || 0))
    .slice(0, n);
};

/**
 * Calculate funnel metrics
 */
export const calculateFunnelMetrics = (stages) => {
  if (!stages || !Array.isArray(stages)) return [];
  
  return stages.map((stage, index) => {
    const previousStage = index > 0 ? stages[index - 1] : null;
    const conversionRate = previousStage 
      ? calculateConversionRate(stage.value, previousStage.value)
      : 100;
    
    const dropOffRate = previousStage
      ? (100 - parseFloat(conversionRate)).toFixed(2)
      : 0;
    
    return {
      ...stage,
      conversionRate: parseFloat(conversionRate),
      dropOffRate: parseFloat(dropOffRate)
    };
  });
};

/**
 * Group data by a specific field
 */
export const groupBy = (data, field) => {
  if (!data || !Array.isArray(data)) return {};
  
  return data.reduce((acc, item) => {
    const key = item[field] || 'Unknown';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});
};

/**
 * Calculate geographic distribution
 */
export const calculateGeographicDistribution = (data, locationField = 'userState') => {
  if (!data || !Array.isArray(data)) return [];
  
  const grouped = groupBy(data, locationField);
  
  return Object.entries(grouped).map(([location, items]) => ({
    location,
    count: items.length,
    percentage: calculateConversionRate(items.length, data.length)
  })).sort((a, b) => b.count - a.count);
};

/**
 * Calculate average time to conversion
 */
export const calculateAverageTimeToConversion = (leads) => {
  const convertedLeads = leads.filter(lead => lead.status === 'converted');
  
  if (convertedLeads.length === 0) return 0;
  
  const totalDays = convertedLeads.reduce((sum, lead) => {
    if (!lead.createdAt || !lead.convertedAt) return sum;
    const days = Math.floor((lead.convertedAt - lead.createdAt) / (1000 * 60 * 60 * 24));
    return sum + days;
  }, 0);
  
  return (totalDays / convertedLeads.length).toFixed(1);
};

/**
 * Calculate lead quality score distribution
 */
export const calculateLeadQualityDistribution = (leads) => {
  if (!leads || !Array.isArray(leads)) {
    return [
      { quality: 'Hot', count: 0, color: '#ef4444' },
      { quality: 'Warm', count: 0, color: '#f59e0b' },
      { quality: 'Cold', count: 0, color: '#3b82f6' }
    ];
  }
  
  const distribution = {
    hot: 0,
    warm: 0,
    cold: 0
  };
  
  leads.forEach(lead => {
    const score = lead.leadScore || 0;
    if (score >= 70) distribution.hot++;
    else if (score >= 40) distribution.warm++;
    else distribution.cold++;
  });
  
  return [
    { quality: 'Hot', count: distribution.hot, color: '#ef4444' },
    { quality: 'Warm', count: distribution.warm, color: '#f59e0b' },
    { quality: 'Cold', count: distribution.cold, color: '#3b82f6' }
  ];
};

/**
 * Generate date range for analytics
 */
export const generateDateRange = (days = 30) => {
  const dates = [];
  for (let i = days - 1; i >= 0; i--) {
    dates.push(format(subDays(new Date(), i), 'yyyy-MM-dd'));
  }
  return dates;
};

/**
 * Fill missing dates in time series
 */
export const fillMissingDates = (data, dateRange) => {
  if (!data || !Array.isArray(data)) data = [];
  if (!dateRange || !Array.isArray(dateRange)) return [];
  
  const dataMap = data.reduce((acc, item) => {
    acc[item.date] = item;
    return acc;
  }, {});
  
  return dateRange.map(date => ({
    date,
    value: dataMap[date]?.value || 0,
    metric: dataMap[date]?.metric || 0
  }));
};

/**
 * Calculate brand-specific metrics
 */
export const calculateBrandMetrics = (brand, leads, views) => {
  if (!brand) return null;
  if (!leads || !Array.isArray(leads)) leads = [];
  if (!views || !Array.isArray(views)) views = [];
  
  const brandLeads = leads.filter(lead => lead.brandId === brand.id);
  const brandViews = views.filter(view => view.brandId === brand.id);
  
  return {
    id: brand.id,
    name: brand.brandName,
    views: brandViews.length,
    inquiries: brandLeads.length,
    conversions: brandLeads.filter(l => l.status === 'converted').length,
    conversionRate: calculateConversionRate(
      brandLeads.filter(l => l.status === 'converted').length,
      brandLeads.length
    ),
    viewToInquiryRate: calculateConversionRate(brandLeads.length, brandViews.length)
  };
};

/**
 * Format currency
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format number with commas
 */
export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Format percentage with 2 decimal places
 */
export const formatPercentage = (num) => {
  if (typeof num !== 'number' || isNaN(num)) return '0.00%';
  return `${num.toFixed(2)}%`;
};

/**
 * Get trend direction
 */
export const getTrendDirection = (current, previous) => {
  if (current > previous) return 'up';
  if (current < previous) return 'down';
  return 'stable';
};

/**
 * Calculate revenue projection based on leads
 */
export const calculateRevenueProjection = (leads, averageDealValue = 50000) => {
  if (!leads || !Array.isArray(leads)) {
    return {
      pipeline: {
        total: 0,
        hot: 0,
        warm: 0,
        cold: 0
      },
      estimatedRevenue: 0,
      projectedRevenue: 0
    };
  }
  
  const pipeline = {
    total: leads.length * averageDealValue,
    hot: leads.filter(l => (l.leadScore || 0) >= 70).length * averageDealValue,
    warm: leads.filter(l => (l.leadScore || 0) >= 40 && (l.leadScore || 0) < 70).length * averageDealValue,
    cold: leads.filter(l => (l.leadScore || 0) < 40).length * averageDealValue
  };
  
  // Estimated conversion rates by quality
  const estimatedRevenue = 
    (pipeline.hot * 0.5) + 
    (pipeline.warm * 0.2) + 
    (pipeline.cold * 0.05);
  
  return {
    pipeline,
    estimatedRevenue,
    formatted: formatCurrency(estimatedRevenue)
  };
};

export default {
  calculateConversionRate,
  calculatePercentageChange,
  groupByTimePeriod,
  calculateTimeSeriesMetrics,
  filterByDateRange,
  getTopItems,
  calculateFunnelMetrics,
  groupBy,
  calculateGeographicDistribution,
  calculateAverageTimeToConversion,
  calculateLeadQualityDistribution,
  generateDateRange,
  fillMissingDates,
  calculateBrandMetrics,
  formatCurrency,
  formatNumber,
  getTrendDirection,
  calculateRevenueProjection
};
