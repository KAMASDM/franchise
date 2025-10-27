import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Chip
} from '@mui/material';
import { LocationOn } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatNumber } from '../../utils/analyticsUtils';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

const GeographicDistribution = ({ data }) => {
  const topLocations = data.slice(0, 10);
  const maxCount = Math.max(...topLocations.map(d => d.count), 1);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
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
            {data.location}
          </Typography>
          <Typography variant="body2">
            Inquiries: {formatNumber(data.count)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {data.percentage}% of total
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <LocationOn color="primary" />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Geographic Distribution
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Lead distribution by state/region
            </Typography>
          </Box>
        </Box>

        {/* Bar Chart */}
        <Box sx={{ mb: 4 }}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topLocations}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="location"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {topLocations.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>

        {/* Detailed Table */}
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Rank</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>State/Region</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Inquiries</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Distribution</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Percentage</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topLocations.map((location, index) => (
                <TableRow key={location.location} hover>
                  <TableCell>
                    <Chip
                      label={index + 1}
                      size="small"
                      color={index < 3 ? 'primary' : 'default'}
                      sx={{ fontWeight: 'bold', minWidth: 32 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {location.location}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {formatNumber(location.count)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={(location.count / maxCount) * 100}
                        sx={{
                          flexGrow: 1,
                          height: 8,
                          borderRadius: 1,
                          bgcolor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: COLORS[index % COLORS.length],
                            borderRadius: 1
                          }
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" color="text.secondary">
                      {location.percentage}%
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {data.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              No geographic data available for this period
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default GeographicDistribution;
