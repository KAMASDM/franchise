import React from 'react';
import { Box, Skeleton, Card, CardContent, Grid, Stack } from '@mui/material';

/**
 * Skeleton loader components that mirror actual content layout
 * Provides better perceived performance than generic spinners
 */

export const BrandCardSkeleton = () => (
  <Card sx={{ height: '100%', borderRadius: 3 }}>
    {/* Brand header image */}
    <Skeleton variant="rectangular" height={120} />
    
    <CardContent>
      {/* Brand logo */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Skeleton variant="circular" width={48} height={48} sx={{ mr: 2 }} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="70%" height={24} />
          <Skeleton variant="text" width="50%" height={20} />
        </Box>
      </Box>

      {/* Industry chips */}
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Skeleton variant="rounded" width={80} height={24} />
        <Skeleton variant="rounded" width={100} height={24} />
      </Stack>

      {/* Description */}
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="95%" />
      <Skeleton variant="text" width="80%" />

      {/* Stats */}
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Skeleton variant="text" width={80} />
        <Skeleton variant="text" width={80} />
      </Box>

      {/* Button */}
      <Skeleton variant="rounded" width="100%" height={36} sx={{ mt: 2 }} />
    </CardContent>
  </Card>
);

export const BrandDetailSkeleton = () => (
  <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
    {/* Hero Banner */}
    <Skeleton variant="rectangular" width="100%" height={300} sx={{ mb: 3, borderRadius: 2 }} />

    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        {/* Brand Name */}
        <Skeleton variant="text" width="60%" height={48} sx={{ mb: 2 }} />
        
        {/* Chips */}
        <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
          <Skeleton variant="rounded" width={100} height={28} />
          <Skeleton variant="rounded" width={120} height={28} />
          <Skeleton variant="rounded" width={90} height={28} />
        </Stack>

        {/* Description */}
        <Skeleton variant="rectangular" height={150} sx={{ mb: 3, borderRadius: 1 }} />

        {/* Details Table */}
        <Skeleton variant="rectangular" height={200} sx={{ mb: 3, borderRadius: 1 }} />

        {/* Gallery */}
        <Grid container spacing={2}>
          {[1, 2, 3].map((i) => (
            <Grid item xs={4} key={i}>
              <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 1 }} />
            </Grid>
          ))}
        </Grid>
      </Grid>

      <Grid item xs={12} md={4}>
        {/* Sidebar Card */}
        <Card>
          <CardContent>
            <Skeleton variant="text" width="80%" height={32} sx={{ mb: 2 }} />
            <Stack spacing={2}>
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="90%" />
              <Skeleton variant="rounded" width="100%" height={40} sx={{ mt: 2 }} />
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Box>
);

export const ListItemSkeleton = () => (
  <Card sx={{ mb: 2, p: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="text" width="60%" height={24} />
        <Skeleton variant="text" width="40%" height={20} />
      </Box>
      <Skeleton variant="rounded" width={80} height={32} />
    </Box>
  </Card>
);

export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <Box sx={{ width: '100%' }}>
    {/* Table header */}
    <Box sx={{ display: 'flex', gap: 2, mb: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
      {Array(columns).fill(0).map((_, i) => (
        <Skeleton key={i} variant="text" width={`${100 / columns}%`} height={24} />
      ))}
    </Box>

    {/* Table rows */}
    {Array(rows).fill(0).map((_, rowIndex) => (
      <Box key={rowIndex} sx={{ display: 'flex', gap: 2, mb: 1, p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        {Array(columns).fill(0).map((_, colIndex) => (
          <Skeleton key={colIndex} variant="text" width={`${100 / columns}%`} height={20} />
        ))}
      </Box>
    ))}
  </Box>
);

export const FormSkeleton = () => (
  <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
    <Skeleton variant="text" width="40%" height={36} sx={{ mb: 3 }} />
    
    <Stack spacing={3}>
      {[1, 2, 3, 4].map((i) => (
        <Box key={i}>
          <Skeleton variant="text" width="30%" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="rounded" width="100%" height={56} />
        </Box>
      ))}
      
      <Skeleton variant="rounded" width="100%" height={48} sx={{ mt: 2 }} />
    </Stack>
  </Box>
);

export const DashboardSkeleton = () => (
  <Box sx={{ p: 3 }}>
    <Skeleton variant="text" width="30%" height={40} sx={{ mb: 3 }} />
    
    {/* Stats Cards */}
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {[1, 2, 3, 4].map((i) => (
        <Grid item xs={12} sm={6} md={3} key={i}>
          <Card>
            <CardContent>
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="text" width="40%" height={48} sx={{ my: 1 }} />
              <Skeleton variant="text" width="50%" height={20} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>

    {/* Chart */}
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Skeleton variant="text" width="25%" height={28} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={300} />
      </CardContent>
    </Card>

    {/* Table */}
    <Card>
      <CardContent>
        <Skeleton variant="text" width="25%" height={28} sx={{ mb: 2 }} />
        <TableSkeleton rows={5} columns={4} />
      </CardContent>
    </Card>
  </Box>
);

export const BrandGridSkeleton = ({ count = 9 }) => (
  <Grid container spacing={3}>
    {Array(count).fill(0).map((_, i) => (
      <Grid item xs={12} sm={6} md={4} key={i}>
        <BrandCardSkeleton />
      </Grid>
    ))}
  </Grid>
);

export default BrandCardSkeleton;
