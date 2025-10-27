import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { formatNumber } from '../../utils/analyticsUtils';

const TimeSeriesChart = ({ data }) => {
  const [selectedMetrics, setSelectedMetrics] = useState(['views', 'inquiries', 'conversions']);

  const handleMetricToggle = (event, newMetrics) => {
    if (newMetrics.length > 0) {
      setSelectedMetrics(newMetrics);
    }
  };

  const formatXAxis = (dateStr) => {
    try {
      return format(parseISO(dateStr), 'MMM dd');
    } catch {
      return dateStr;
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
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
          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
            {formatXAxis(label)}
          </Typography>
          {payload.map((entry) => (
            <Typography
              key={entry.name}
              variant="body2"
              sx={{ color: entry.color }}
            >
              {entry.name}: {formatNumber(entry.value)}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Trends Over Time
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track key metrics day by day
            </Typography>
          </Box>
          <ToggleButtonGroup
            value={selectedMetrics}
            onChange={handleMetricToggle}
            aria-label="metric selection"
            size="small"
          >
            <ToggleButton value="views" aria-label="views">
              Views
            </ToggleButton>
            <ToggleButton value="inquiries" aria-label="inquiries">
              Inquiries
            </ToggleButton>
            <ToggleButton value="conversions" aria-label="conversions">
              Conversions
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tickFormatter={formatXAxis}
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={70}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            
            {selectedMetrics.includes('views') && (
              <Line
                type="monotone"
                dataKey="views"
                name="Views"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            )}
            
            {selectedMetrics.includes('inquiries') && (
              <Line
                type="monotone"
                dataKey="inquiries"
                name="Inquiries"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            )}
            
            {selectedMetrics.includes('conversions') && (
              <Line
                type="monotone"
                dataKey="conversions"
                name="Conversions"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TimeSeriesChart;
