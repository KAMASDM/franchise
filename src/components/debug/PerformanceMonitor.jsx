import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, Stack, Chip } from '@mui/material';

const PerformanceMonitor = ({ componentName = 'Component' }) => {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    renderTime: 0,
    mounted: false,
  });

  useEffect(() => {
    const startTime = performance.now();
    
    // Mark as mounted
    setMetrics(prev => ({ ...prev, mounted: true }));
    
    // Measure load time
    const loadTime = performance.now() - startTime;
    
    // Use requestAnimationFrame to measure render time
    requestAnimationFrame(() => {
      const renderTime = performance.now() - startTime;
      setMetrics({
        loadTime: loadTime.toFixed(2),
        renderTime: renderTime.toFixed(2),
        mounted: true,
      });
      
      console.log(`🚀 [${componentName}] Performance Metrics:`, {
        loadTime: `${loadTime.toFixed(2)}ms`,
        renderTime: `${renderTime.toFixed(2)}ms`,
      });
    });
  }, [componentName]);

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <Card sx={{ 
      position: 'fixed', 
      top: 16, 
      right: 16, 
      p: 2, 
      zIndex: 9999,
      minWidth: 200,
      opacity: 0.9
    }}>
      <Typography variant="h6" sx={{ mb: 1, fontSize: '0.875rem' }}>
        Performance Monitor
      </Typography>
      <Stack spacing={1}>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Component: {componentName}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Load Time: 
          </Typography>
          <Chip 
            label={`${metrics.loadTime}ms`}
            size="small"
            color={parseFloat(metrics.loadTime) < 100 ? 'success' : parseFloat(metrics.loadTime) < 500 ? 'warning' : 'error'}
            sx={{ ml: 1, fontSize: '0.7rem' }}
          />
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Render Time: 
          </Typography>
          <Chip 
            label={`${metrics.renderTime}ms`}
            size="small"
            color={parseFloat(metrics.renderTime) < 16 ? 'success' : parseFloat(metrics.renderTime) < 33 ? 'warning' : 'error'}
            sx={{ ml: 1, fontSize: '0.7rem' }}
          />
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Status: 
          </Typography>
          <Chip 
            label={metrics.mounted ? 'Mounted' : 'Loading'}
            size="small"
            color={metrics.mounted ? 'success' : 'warning'}
            sx={{ ml: 1, fontSize: '0.7rem' }}
          />
        </Box>
      </Stack>
    </Card>
  );
};

export default PerformanceMonitor;