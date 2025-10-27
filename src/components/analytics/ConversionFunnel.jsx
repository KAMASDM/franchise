import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { formatNumber } from '../../utils/analyticsUtils';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const ConversionFunnel = ({ data }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          Conversion Funnel
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Track how users move through your conversion stages
        </Typography>

        {/* Funnel Visualization */}
        <Box sx={{ mb: 3 }}>
          {data.map((stage, index) => (
            <Box key={stage.name} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  {stage.name}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {formatNumber(stage.value)}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={stage.conversionRate}
                sx={{
                  height: 8,
                  borderRadius: 1,
                  backgroundColor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: COLORS[index % COLORS.length],
                    borderRadius: 1
                  }
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  Conversion: {stage.conversionRate.toFixed(1)}%
                </Typography>
                {index > 0 && (
                  <Typography variant="caption" color="error">
                    Drop-off: {stage.dropOffRate}%
                  </Typography>
                )}
              </Box>
            </Box>
          ))}
        </Box>

        {/* Bar Chart Alternative View */}
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              angle={-15}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              formatter={(value) => formatNumber(value)}
              contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="value" name="Count" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ConversionFunnel;
