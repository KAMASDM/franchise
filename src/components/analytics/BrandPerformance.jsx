import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Chip,
  LinearProgress
} from '@mui/material';
import { TrendingUp, Star } from '@mui/icons-material';
import { formatNumber } from '../../utils/analyticsUtils';

const BrandPerformance = ({ data }) => {
  const maxInquiries = Math.max(...data.map(b => b.inquiries), 1);

  const getPerformanceColor = (conversionRate) => {
    const rate = parseFloat(conversionRate);
    if (rate >= 10) return 'success';
    if (rate >= 5) return 'warning';
    return 'default';
  };

  const getPerformanceLabel = (conversionRate) => {
    const rate = parseFloat(conversionRate);
    if (rate >= 10) return 'Excellent';
    if (rate >= 5) return 'Good';
    return 'Average';
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Brand Performance
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Top performing brands by inquiries and conversions
            </Typography>
          </Box>
          <Chip
            icon={<Star />}
            label={`Top ${data.length} Brands`}
            color="primary"
            variant="outlined"
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Rank</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Brand Name</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Views</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Inquiries</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Conversions</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Conv. Rate</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Performance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((brand, index) => (
                <TableRow key={brand.id} hover>
                  <TableCell>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        bgcolor: index < 3 ? 'primary.main' : 'grey.300',
                        color: index < 3 ? 'white' : 'text.primary',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: 14
                      }}
                    >
                      {index + 1}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {brand.name}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      {formatNumber(brand.views)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        {formatNumber(brand.inquiries)}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(brand.inquiries / maxInquiries) * 100}
                        sx={{
                          height: 4,
                          borderRadius: 2,
                          bgcolor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: 'primary.main',
                            borderRadius: 2
                          }
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {formatNumber(brand.conversions)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={`${brand.conversionRate}%`}
                      size="small"
                      color={getPerformanceColor(brand.conversionRate)}
                      sx={{ fontWeight: 'bold', minWidth: 60 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {parseFloat(brand.conversionRate) >= 5 && (
                        <TrendingUp sx={{ color: 'success.main', fontSize: 20 }} />
                      )}
                      <Typography variant="body2" color="text.secondary">
                        {getPerformanceLabel(brand.conversionRate)}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {data.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              No brand performance data available for this period
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default BrandPerformance;
