import { useState, useEffect, useMemo } from 'react';
import { subDays } from 'date-fns';
import { useAllLeads } from './useAllLeads';
import { useAllBrands } from './useAllBrands';
import { useAllBrandViews } from './useAllBrandViews';
import { useChatLeads } from './useChatLeads';
import {
  calculateConversionRate,
  calculatePercentageChange,
  calculateTimeSeriesMetrics,
  filterByDateRange,
  getTopItems,
  calculateFunnelMetrics,
  calculateGeographicDistribution,
  calculateLeadQualityDistribution,
  generateDateRange,
  fillMissingDates,
  calculateBrandMetrics,
  calculateRevenueProjection,
  getTrendDirection
} from '../utils/analyticsUtils';

/**
 * Custom hook for analytics data and calculations
 */
export const useAnalytics = (dateRange = 30) => {
  const [timeRange, setTimeRange] = useState(dateRange);
  const [selectedMetric, setSelectedMetric] = useState('all');
  
  // Fetch all data
  const { leads: allLeads = [], loading: leadsLoading } = useAllLeads();
  const { brands = [], loading: brandsLoading } = useAllBrands();
  const { views: allViews = [], loading: viewsLoading } = useAllBrandViews();
  const { leads: chatLeads = [], loading: chatLoading } = useChatLeads();

  const loading = leadsLoading || brandsLoading || viewsLoading || chatLoading;

  // Calculate date boundaries
  const dateRangeStart = useMemo(() => subDays(new Date(), timeRange), [timeRange]);
  const dateRangeEnd = useMemo(() => new Date(), []);

  // Filter data by date range
  const leads = useMemo(() => 
    filterByDateRange(allLeads, 'createdAt', dateRangeStart, dateRangeEnd),
    [allLeads, dateRangeStart, dateRangeEnd]
  );

  const views = useMemo(() => 
    filterByDateRange(allViews, 'viewedAt', dateRangeStart, dateRangeEnd),
    [allViews, dateRangeStart, dateRangeEnd]
  );

  // Previous period for comparison
  const previousPeriodStart = useMemo(() => 
    subDays(dateRangeStart, timeRange),
    [dateRangeStart, timeRange]
  );

  const previousLeads = useMemo(() => 
    filterByDateRange(allLeads, 'createdAt', previousPeriodStart, dateRangeStart),
    [allLeads, previousPeriodStart, dateRangeStart]
  );

  // Overview Metrics
  const overviewMetrics = useMemo(() => {
    const totalViews = views.length;
    const totalInquiries = leads.length;
    const totalConversions = leads.filter(l => l.status === 'converted').length;
    const totalBrands = brands.filter(b => b.status === 'active').length;
    
    const previousViews = filterByDateRange(allViews, 'viewedAt', previousPeriodStart, dateRangeStart).length;
    const previousInquiries = previousLeads.length;
    const previousConversions = previousLeads.filter(l => l.status === 'converted').length;

    return {
      totalViews,
      totalInquiries,
      totalConversions,
      totalBrands,
      viewsChange: calculatePercentageChange(totalViews, previousViews),
      inquiriesChange: calculatePercentageChange(totalInquiries, previousInquiries),
      conversionsChange: calculatePercentageChange(totalConversions, previousConversions),
      viewsGrowth: getTrendDirection(totalViews, previousViews),
      inquiriesGrowth: getTrendDirection(totalInquiries, previousInquiries),
      conversionsGrowth: getTrendDirection(totalConversions, previousConversions)
    };
  }, [views, leads, brands, allViews, previousLeads, previousPeriodStart, dateRangeStart]);

  // Conversion Funnel
  const conversionFunnel = useMemo(() => {
    const totalUsers = 1000; // This should come from analytics if available
    const stages = [
      { name: 'Visitors', value: totalUsers },
      { name: 'Brand Views', value: views.length },
      { name: 'Inquiries', value: leads.length },
      { name: 'Conversions', value: leads.filter(l => l.status === 'converted').length }
    ];
    
    return calculateFunnelMetrics(stages);
  }, [views, leads]);

  // Time Series Data
  const timeSeriesData = useMemo(() => {
    const dateRangeArray = generateDateRange(timeRange);
    
    const viewsTimeSeries = calculateTimeSeriesMetrics(views, 'viewedAt');
    const inquiriesTimeSeries = calculateTimeSeriesMetrics(leads, 'createdAt');
    const conversionsTimeSeries = calculateTimeSeriesMetrics(
      leads.filter(l => l.status === 'converted'),
      'createdAt'
    );

    return dateRangeArray.map(date => ({
      date,
      views: viewsTimeSeries.find(d => d.date === date)?.value || 0,
      inquiries: inquiriesTimeSeries.find(d => d.date === date)?.value || 0,
      conversions: conversionsTimeSeries.find(d => d.date === date)?.value || 0
    }));
  }, [views, leads, timeRange]);

  // Brand Performance
  const brandPerformance = useMemo(() => {
    const metrics = brands
      .filter(b => b.status === 'active')
      .map(brand => calculateBrandMetrics(brand, leads, views));
    
    return getTopItems(metrics, 'inquiries', 10);
  }, [brands, leads, views]);

  // Geographic Distribution
  const geographicDistribution = useMemo(() => 
    calculateGeographicDistribution(leads, 'userState'),
    [leads]
  );

  // Lead Quality Distribution
  const leadQualityDistribution = useMemo(() => 
    calculateLeadQualityDistribution(leads),
    [leads]
  );

  // Revenue Projections
  const revenueProjection = useMemo(() => 
    calculateRevenueProjection(leads, 50000), // $50k average deal value
    [leads]
  );

  // Top Performing Brands
  const topBrands = useMemo(() => 
    getTopItems(brandPerformance, 'conversions', 5),
    [brandPerformance]
  );

  // Conversion Rate
  const conversionRate = useMemo(() => 
    calculateConversionRate(
      leads.filter(l => l.status === 'converted').length,
      leads.length
    ),
    [leads]
  );

  // View to Inquiry Rate
  const viewToInquiryRate = useMemo(() => 
    calculateConversionRate(leads.length, views.length),
    [leads, views]
  );

  // Chat Leads Analytics
  const chatLeadsAnalytics = useMemo(() => {
    const filteredChatLeads = filterByDateRange(chatLeads, 'timestamp', dateRangeStart, dateRangeEnd);
    return {
      total: filteredChatLeads.length,
      qualified: filteredChatLeads.filter(l => (l.leadScore || 0) >= 50).length,
      timeSeries: calculateTimeSeriesMetrics(filteredChatLeads, 'timestamp')
    };
  }, [chatLeads, dateRangeStart, dateRangeEnd]);

  // Industry Distribution
  const industryDistribution = useMemo(() => {
    const distribution = {};
    brands.forEach(brand => {
      const industry = brand.brandIndustry || 'Other';
      distribution[industry] = (distribution[industry] || 0) + 1;
    });
    
    return Object.entries(distribution)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [brands]);

  // Investment Range Distribution
  const investmentDistribution = useMemo(() => {
    const distribution = {};
    leads.forEach(lead => {
      const budget = lead.budget || 'Not specified';
      distribution[budget] = (distribution[budget] || 0) + 1;
    });
    
    return Object.entries(distribution)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [leads]);

  return {
    loading,
    timeRange,
    setTimeRange,
    selectedMetric,
    setSelectedMetric,
    overviewMetrics,
    conversionFunnel,
    timeSeriesData,
    brandPerformance,
    geographicDistribution,
    leadQualityDistribution,
    revenueProjection,
    topBrands,
    conversionRate,
    viewToInquiryRate,
    chatLeadsAnalytics,
    industryDistribution,
    investmentDistribution,
    // Raw data for custom calculations
    leads,
    views,
    brands,
    chatLeads
  };
};

export default useAnalytics;
