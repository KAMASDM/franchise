import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Slider,
  Grid,
  Divider,
  Chip,
  useTheme,
  InputAdornment,
  Paper,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  TrendingUp,
  AttachMoney,
  Timeline,
  Calculate,
  InfoOutlined,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

/**
 * Interactive ROI Calculator for Franchise Opportunities
 * Helps users estimate their return on investment
 */

const MotionCard = motion(Card);

const ROICalculator = ({ brand }) => {
  const theme = useTheme();

  // Extract default values from brand data
  const defaultInvestment = brand?.franchiseDetails?.minInvestment || 500000;
  const defaultRoyalty = parseFloat(brand?.franchiseDetails?.royalty?.replace(/[^0-9.]/g, '')) || 5;
  const defaultMarketingFee = parseFloat(brand?.franchiseDetails?.marketingFee?.replace(/[^0-9.]/g, '')) || 2;

  // Calculator state
  const [initialInvestment, setInitialInvestment] = useState(defaultInvestment);
  const [monthlyRevenue, setMonthlyRevenue] = useState(200000);
  const [operatingExpensePercent, setOperatingExpensePercent] = useState(60);
  const [royaltyPercent, setRoyaltyPercent] = useState(defaultRoyalty);
  const [marketingFeePercent, setMarketingFeePercent] = useState(defaultMarketingFee);

  // Calculations
  const [calculations, setCalculations] = useState({
    monthlyGrossProfit: 0,
    monthlyNetProfit: 0,
    annualNetProfit: 0,
    breakEvenMonths: 0,
    roi: 0,
  });

  useEffect(() => {
    // Calculate monthly gross profit
    const monthlyGrossProfit = monthlyRevenue * (1 - operatingExpensePercent / 100);
    
    // Calculate fees
    const royaltyFee = monthlyRevenue * (royaltyPercent / 100);
    const marketingFee = monthlyRevenue * (marketingFeePercent / 100);
    
    // Calculate monthly net profit
    const monthlyNetProfit = monthlyGrossProfit - royaltyFee - marketingFee;
    
    // Calculate annual net profit
    const annualNetProfit = monthlyNetProfit * 12;
    
    // Calculate break-even months
    const breakEvenMonths = monthlyNetProfit > 0 
      ? Math.ceil(initialInvestment / monthlyNetProfit) 
      : 0;
    
    // Calculate ROI (annual return on investment percentage)
    const roi = (annualNetProfit / initialInvestment) * 100;

    setCalculations({
      monthlyGrossProfit,
      monthlyNetProfit,
      annualNetProfit,
      breakEvenMonths,
      roi,
    });
  }, [initialInvestment, monthlyRevenue, operatingExpensePercent, royaltyPercent, marketingFeePercent]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const ResultCard = ({ icon: Icon, label, value, color, tooltip }) => (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        textAlign: 'center',
        borderTop: `4px solid ${color}`,
        height: '100%',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
        <Icon sx={{ color, mr: 1 }} />
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        {tooltip && (
          <Tooltip title={tooltip}>
            <IconButton size="small" sx={{ ml: 0.5 }}>
              <InfoOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <Typography variant="h6" fontWeight="bold" color={color}>
        {value}
      </Typography>
    </Paper>
  );

  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{ mt: 3 }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Calculate sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
          <Box>
            <Typography variant="h5" fontWeight="bold">
              ROI Calculator
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Estimate your franchise returns
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Input Section */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              Initial Investment
            </Typography>
            <TextField
              fullWidth
              type="number"
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(Number(e.target.value))}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              Expected Monthly Revenue
            </Typography>
            <TextField
              fullWidth
              type="number"
              value={monthlyRevenue}
              onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Operating Expenses: {operatingExpensePercent}%
            </Typography>
            <Slider
              value={operatingExpensePercent}
              onChange={(e, value) => setOperatingExpensePercent(value)}
              min={30}
              max={90}
              step={5}
              marks
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value}%`}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              Royalty Fee: {royaltyPercent}%
            </Typography>
            <Slider
              value={royaltyPercent}
              onChange={(e, value) => setRoyaltyPercent(value)}
              min={0}
              max={15}
              step={0.5}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value}%`}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              Marketing Fee: {marketingFeePercent}%
            </Typography>
            <Slider
              value={marketingFeePercent}
              onChange={(e, value) => setMarketingFeePercent(value)}
              min={0}
              max={10}
              step={0.5}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value}%`}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Results Section */}
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Projected Returns
        </Typography>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} md={3}>
            <ResultCard
              icon={AttachMoney}
              label="Monthly Net Profit"
              value={formatCurrency(calculations.monthlyNetProfit)}
              color={theme.palette.success.main}
              tooltip="Revenue minus operating expenses and fees"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <ResultCard
              icon={TrendingUp}
              label="Annual Net Profit"
              value={formatCurrency(calculations.annualNetProfit)}
              color={theme.palette.info.main}
              tooltip="Projected profit over 12 months"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <ResultCard
              icon={Timeline}
              label="Break-Even"
              value={`${calculations.breakEvenMonths} months`}
              color={theme.palette.warning.main}
              tooltip="Time to recover initial investment"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <ResultCard
              icon={Calculate}
              label="Annual ROI"
              value={`${calculations.roi.toFixed(1)}%`}
              color={calculations.roi > 20 ? theme.palette.success.main : theme.palette.error.main}
              tooltip="Return on investment percentage"
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, p: 2, backgroundColor: 'action.hover', borderRadius: 2 }}>
          <Typography variant="caption" color="text.secondary">
            <strong>Note:</strong> These calculations are estimates based on your inputs and should not be considered as guaranteed returns. 
            Actual results may vary based on location, market conditions, and operational efficiency. 
            Please consult with the franchisor for detailed financial projections.
          </Typography>
        </Box>
      </CardContent>
    </MotionCard>
  );
};

export default ROICalculator;
