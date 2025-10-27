import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Chip,
  Stack
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Remove as TrendingFlat,
  Visibility,
  ContactMail,
  CheckCircle,
  Business,
  Timeline,
  PieChart as PieChartIcon,
  Map as MapIcon,
  Store as StoreIcon
} from '@mui/icons-material';
import { useAnalytics } from '../../hooks/useAnalytics';
import ConversionFunnel from './ConversionFunnel';
import BrandPerformance from './BrandPerformance';
import TimeSeriesChart from './TimeSeriesChart';
import LeadQualityChart from './LeadQualityChart';
import GeographicDistribution from './GeographicDistribution';
import BusinessModelAnalytics from './BusinessModelAnalytics';
import { formatNumber, formatCurrency } from '../../utils/analyticsUtils';
import { useAllBrands } from '../../hooks/useAllBrands';
import { useAllLeads } from '../../hooks/useAllLeads';
import { useAllBrandViews } from '../../hooks/useAllBrandViews';

const AnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const {
    loading,
    timeRange,
    setTimeRange,
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
    investmentDistribution
  } = useAnalytics(30);

  // Get data for business model analytics
  const { brands = [] } = useAllBrands();
  const { leads = [] } = useAllLeads();
  const { brandViews = [] } = useAllBrandViews();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getTrendIcon = (growth) => {
    if (growth === 'up') return <TrendingUp sx={{ color: 'success.main' }} />;
    if (growth === 'down') return <TrendingDown sx={{ color: 'error.main' }} />;
    return <TrendingFlat sx={{ color: 'text.secondary' }} />;
  };

  const getTrendColor = (change) => {
    const value = parseFloat(change);
    if (value > 0) return 'success.main';
    if (value < 0) return 'error.main';
    return 'text.secondary';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Analytics Dashboard
        </Typography>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            label="Time Range"
          >
            <MenuItem value={7}>Last 7 days</MenuItem>
            <MenuItem value={30}>Last 30 days</MenuItem>
            <MenuItem value={90}>Last 90 days</MenuItem>
            <MenuItem value={365}>Last year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Overview Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Total Views */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Total Views
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {formatNumber(overviewMetrics.totalViews)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {getTrendIcon(overviewMetrics.viewsGrowth)}
                    <Typography 
                      variant="body2" 
                      sx={{ color: getTrendColor(overviewMetrics.viewsChange) }}
                    >
                      {overviewMetrics.viewsChange > 0 ? '+' : ''}
                      {overviewMetrics.viewsChange}%
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ 
                  bgcolor: 'primary.light', 
                  p: 1.5, 
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Visibility sx={{ color: 'primary.main', fontSize: 32 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Inquiries */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Total Inquiries
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {formatNumber(overviewMetrics.totalInquiries)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {getTrendIcon(overviewMetrics.inquiriesGrowth)}
                    <Typography 
                      variant="body2" 
                      sx={{ color: getTrendColor(overviewMetrics.inquiriesChange) }}
                    >
                      {overviewMetrics.inquiriesChange > 0 ? '+' : ''}
                      {overviewMetrics.inquiriesChange}%
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ 
                  bgcolor: 'info.light', 
                  p: 1.5, 
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ContactMail sx={{ color: 'info.main', fontSize: 32 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Conversions */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Conversions
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {formatNumber(overviewMetrics.totalConversions)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {getTrendIcon(overviewMetrics.conversionsGrowth)}
                    <Typography 
                      variant="body2" 
                      sx={{ color: getTrendColor(overviewMetrics.conversionsChange) }}
                    >
                      {overviewMetrics.conversionsChange > 0 ? '+' : ''}
                      {overviewMetrics.conversionsChange}%
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ 
                  bgcolor: 'success.light', 
                  p: 1.5, 
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <CheckCircle sx={{ color: 'success.main', fontSize: 32 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Active Brands */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Active Brands
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {formatNumber(overviewMetrics.totalBrands)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Conversion Rate: {conversionRate}%
                  </Typography>
                </Box>
                <Box sx={{ 
                  bgcolor: 'warning.light', 
                  p: 1.5, 
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Business sx={{ color: 'warning.main', fontSize: 32 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs for Different Views */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          <Tab icon={<Timeline />} label="Trends" iconPosition="start" />
          <Tab icon={<PieChartIcon />} label="Performance" iconPosition="start" />
          <Tab icon={<MapIcon />} label="Geographic" iconPosition="start" />
          <Tab icon={<StoreIcon />} label="Business Models" iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {/* Conversion Funnel */}
          <Grid item xs={12} md={6}>
            <ConversionFunnel data={conversionFunnel} />
          </Grid>

          {/* Lead Quality Distribution */}
          <Grid item xs={12} md={6}>
            <LeadQualityChart data={leadQualityDistribution} />
          </Grid>

          {/* Time Series Chart */}
          <Grid item xs={12}>
            <TimeSeriesChart data={timeSeriesData} />
          </Grid>

          {/* Revenue Projection */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Revenue Projection
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
                    {revenueProjection.formatted}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Estimated based on current pipeline
                  </Typography>
                  <Stack spacing={1} sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Hot Leads Pipeline:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(revenueProjection.pipeline.hot)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Warm Leads Pipeline:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(revenueProjection.pipeline.warm)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Cold Leads Pipeline:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(revenueProjection.pipeline.cold)}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Chat Analytics */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Chat Analytics
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Total Conversations
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        {formatNumber(chatLeadsAnalytics.total)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Qualified Leads
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        {formatNumber(chatLeadsAnalytics.qualified)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          {/* Brand Performance */}
          <Grid item xs={12}>
            <BrandPerformance data={brandPerformance} />
          </Grid>
        </Grid>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
          {/* Geographic Distribution */}
          <Grid item xs={12}>
            <GeographicDistribution data={geographicDistribution} />
          </Grid>
        </Grid>
      )}

      {activeTab === 3 && (
        <Grid container spacing={3}>
          {/* Business Model Analytics */}
          <Grid item xs={12}>
            <BusinessModelAnalytics 
              brands={brands}
              leads={leads}
              brandViews={brandViews}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default AnalyticsDashboard;
