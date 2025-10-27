import React, { useMemo } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Chip,
  Stack,
  useTheme
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import {
  TrendingUp,
  LocalShipping as DistributionIcon,
  Store as FranchiseIcon,
  Business as DealershipIcon,
  Handshake as PartnershipIcon
} from '@mui/icons-material';
import { BUSINESS_MODEL_CONFIG } from '../../constants/businessModels';
import { formatNumber, formatPercentage } from '../../utils/analyticsUtils';

/**
 * BusinessModelAnalytics - Analytics component showing metrics by business model
 */
const BusinessModelAnalytics = ({ brands = [], leads = [], brandViews = [] }) => {
  const theme = useTheme();

  // Calculate metrics by business model
  const modelMetrics = useMemo(() => {
    const metrics = {};

    // Initialize metrics for each model
    Object.keys(BUSINESS_MODEL_CONFIG).forEach(modelId => {
      metrics[modelId] = {
        brandCount: 0,
        viewCount: 0,
        leadCount: 0,
        conversionRate: 0,
        totalRevenue: 0,
        averageInvestment: 0,
        color: BUSINESS_MODEL_CONFIG[modelId].color
      };
    });

    // Count brands by model
    brands.forEach(brand => {
      const models = brand.businessModels || ['franchise'];
      models.forEach(modelId => {
        if (metrics[modelId]) {
          metrics[modelId].brandCount += 1;
        }
      });
    });

    // Count views by model
    brandViews.forEach(view => {
      const brand = brands.find(b => b.id === view.brandId);
      if (brand && brand.businessModels) {
        brand.businessModels.forEach(modelId => {
          if (metrics[modelId]) {
            metrics[modelId].viewCount += view.totalViews || 0;
          }
        });
      }
    });

    // Count leads by model
    leads.forEach(lead => {
      const brand = brands.find(b => b.id === lead.brandId);
      if (brand && brand.businessModels) {
        brand.businessModels.forEach(modelId => {
          if (metrics[modelId]) {
            metrics[modelId].leadCount += 1;
          }
        });
      }
    });

    // Calculate conversion rates
    Object.keys(metrics).forEach(modelId => {
      const { viewCount, leadCount } = metrics[modelId];
      metrics[modelId].conversionRate = viewCount > 0 
        ? (leadCount / viewCount) * 100 
        : 0;
    });

    return metrics;
  }, [brands, leads, brandViews]);

  // Prepare data for charts
  const pieChartData = useMemo(() => {
    return Object.entries(modelMetrics)
      .filter(([_, data]) => data.brandCount > 0)
      .map(([modelId, data]) => ({
        name: BUSINESS_MODEL_CONFIG[modelId]?.label || modelId,
        value: data.brandCount,
        color: data.color
      }))
      .sort((a, b) => b.value - a.value);
  }, [modelMetrics]);

  const barChartData = useMemo(() => {
    return Object.entries(modelMetrics)
      .filter(([_, data]) => data.brandCount > 0)
      .map(([modelId, data]) => ({
        name: BUSINESS_MODEL_CONFIG[modelId]?.label || modelId,
        views: data.viewCount,
        leads: data.leadCount,
        brands: data.brandCount,
        color: data.color
      }))
      .sort((a, b) => b.leads - a.leads);
  }, [modelMetrics]);

  const conversionData = useMemo(() => {
    return Object.entries(modelMetrics)
      .filter(([_, data]) => data.viewCount > 0)
      .map(([modelId, data]) => ({
        name: BUSINESS_MODEL_CONFIG[modelId]?.label || modelId,
        rate: data.conversionRate,
        color: data.color
      }))
      .sort((a, b) => b.rate - a.rate);
  }, [modelMetrics]);

  const radarChartData = useMemo(() => {
    const maxValues = {
      brands: Math.max(...Object.values(modelMetrics).map(m => m.brandCount)),
      views: Math.max(...Object.values(modelMetrics).map(m => m.viewCount)),
      leads: Math.max(...Object.values(modelMetrics).map(m => m.leadCount))
    };

    return Object.entries(modelMetrics)
      .filter(([_, data]) => data.brandCount > 0)
      .map(([modelId, data]) => ({
        model: BUSINESS_MODEL_CONFIG[modelId]?.label || modelId,
        brands: maxValues.brands > 0 ? (data.brandCount / maxValues.brands) * 100 : 0,
        views: maxValues.views > 0 ? (data.viewCount / maxValues.views) * 100 : 0,
        leads: maxValues.leads > 0 ? (data.leadCount / maxValues.leads) * 100 : 0
      }));
  }, [modelMetrics]);

  // Get top performing models
  const topModels = useMemo(() => {
    return Object.entries(modelMetrics)
      .filter(([_, data]) => data.leadCount > 0)
      .sort((a, b) => b[1].leadCount - a[1].leadCount)
      .slice(0, 5)
      .map(([modelId, data]) => ({
        id: modelId,
        ...data,
        config: BUSINESS_MODEL_CONFIG[modelId]
      }));
  }, [modelMetrics]);

  const getCategoryIcon = (categoryName) => {
    switch (categoryName) {
      case 'franchise': return <FranchiseIcon />;
      case 'distribution': return <DistributionIcon />;
      case 'dealership': return <DealershipIcon />;
      case 'partnership': return <PartnershipIcon />;
      default: return <FranchiseIcon />;
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 1.5, border: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle2" fontWeight="bold">
            {payload[0].name}
          </Typography>
          {payload.map((entry, index) => (
            <Typography key={index} variant="body2" sx={{ color: entry.color }}>
              {entry.dataKey}: {formatNumber(entry.value)}
            </Typography>
          ))}
        </Paper>
      );
    }
    return null;
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
        Business Model Performance
      </Typography>

      {/* Top Performing Models Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {topModels.map((model) => (
          <Grid item xs={12} sm={6} md={2.4} key={model.id}>
            <Card elevation={2} sx={{ 
              border: `2px solid ${model.color}15`,
              borderTop: `4px solid ${model.color}`
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box flex={1}>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      {model.config?.label}
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                      {formatNumber(model.leadCount)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Leads
                    </Typography>
                  </Box>
                </Box>
                <Stack spacing={0.5} sx={{ mt: 2 }}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="caption">Brands:</Typography>
                    <Typography variant="caption" fontWeight="bold">
                      {model.brandCount}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="caption">Views:</Typography>
                    <Typography variant="caption" fontWeight="bold">
                      {formatNumber(model.viewCount)}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="caption">Conv. Rate:</Typography>
                    <Typography variant="caption" fontWeight="bold" color="success.main">
                      {formatPercentage(model.conversionRate)}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Grid */}
      <Grid container spacing={3}>
        {/* Brand Distribution Pie Chart */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Brand Distribution by Model
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Views vs Leads Bar Chart */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Views & Leads by Model
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="views" fill={theme.palette.primary.main} name="Views" />
                  <Bar dataKey="leads" fill={theme.palette.success.main} name="Leads" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Conversion Rate Chart */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Conversion Rate by Model
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={conversionData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" unit="%" />
                  <YAxis dataKey="name" type="category" width={120} />
                  <Tooltip 
                    formatter={(value) => `${value.toFixed(2)}%`}
                    content={<CustomTooltip />}
                  />
                  <Bar dataKey="rate" fill={theme.palette.info.main} name="Conversion Rate">
                    {conversionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Radar Chart */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Model Performance Comparison
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarChartData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="model" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar 
                    name="Brands" 
                    dataKey="brands" 
                    stroke={theme.palette.primary.main} 
                    fill={theme.palette.primary.main} 
                    fillOpacity={0.3} 
                  />
                  <Radar 
                    name="Views" 
                    dataKey="views" 
                    stroke={theme.palette.secondary.main} 
                    fill={theme.palette.secondary.main} 
                    fillOpacity={0.3} 
                  />
                  <Radar 
                    name="Leads" 
                    dataKey="leads" 
                    stroke={theme.palette.success.main} 
                    fill={theme.palette.success.main} 
                    fillOpacity={0.3} 
                  />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Model Performance Table */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Detailed Model Metrics
              </Typography>
              <Box sx={{ overflowX: 'auto' }}>
                <Stack spacing={1} sx={{ mt: 2 }}>
                  {Object.entries(modelMetrics)
                    .filter(([_, data]) => data.brandCount > 0)
                    .sort((a, b) => b[1].leadCount - a[1].leadCount)
                    .map(([modelId, data]) => {
                      const config = BUSINESS_MODEL_CONFIG[modelId];
                      return (
                        <Paper 
                          key={modelId}
                          elevation={1}
                          sx={{ 
                            p: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            borderLeft: `4px solid ${data.color}`
                          }}
                        >
                          <Box flex={1}>
                            <Typography variant="subtitle2" fontWeight="bold" color={data.color}>
                              {config?.label}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {config?.description}
                            </Typography>
                          </Box>
                          <Box display="flex" gap={3}>
                            <Box textAlign="center">
                              <Typography variant="h6" fontWeight="bold">
                                {data.brandCount}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Brands
                              </Typography>
                            </Box>
                            <Box textAlign="center">
                              <Typography variant="h6" fontWeight="bold">
                                {formatNumber(data.viewCount)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Views
                              </Typography>
                            </Box>
                            <Box textAlign="center">
                              <Typography variant="h6" fontWeight="bold">
                                {formatNumber(data.leadCount)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Leads
                              </Typography>
                            </Box>
                            <Box textAlign="center">
                              <Typography variant="h6" fontWeight="bold" color="success.main">
                                {formatPercentage(data.conversionRate)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Conv. Rate
                              </Typography>
                            </Box>
                          </Box>
                        </Paper>
                      );
                    })}
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BusinessModelAnalytics;
