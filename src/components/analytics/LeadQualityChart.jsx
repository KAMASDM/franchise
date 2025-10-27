import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { formatNumber } from '../../utils/analyticsUtils';

const LeadQualityChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : 0;
      
      return (
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 2,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            boxShadow: 2
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            {data.name}
          </Typography>
          <Typography variant="body2">
            Count: {formatNumber(data.value)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {percentage}% of total
          </Typography>
        </Box>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        style={{ fontSize: 14, fontWeight: 'bold' }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          Lead Quality Distribution
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Breakdown of leads by quality score
        </Typography>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="count"
              nameKey="quality"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry) => `${value}: ${formatNumber(entry.payload.count)}`}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Summary Stats */}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-around' }}>
          {data.map((item) => {
            const percentage = total > 0 ? ((item.count / total) * 100).toFixed(1) : 0;
            return (
              <Box key={item.quality} sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: item.color,
                    display: 'inline-block',
                    mr: 0.5
                  }}
                />
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {formatNumber(item.count)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.quality} ({percentage}%)
                </Typography>
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};

export default LeadQualityChart;
