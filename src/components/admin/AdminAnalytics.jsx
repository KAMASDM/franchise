import React from 'react';
import { useAllBrands } from '../../hooks/useAllBrands';
import { useAllBrandViews } from '../../hooks/useAllBrandViews';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, CircularProgress, Alert, Link as MuiLink } from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { Link } from 'react-router-dom';

/**
 * AdminAnalytics component displays the total page view counts for all brands.
 * It combines data from 'brands' and 'brandViews' collections to provide a
 * sorted list of brand performance based on user visits.
 */
const AdminAnalytics = () => {
    const { brands, loading: brandsLoading, error: brandsError } = useAllBrands();
    const { brandViews, loading: viewsLoading, error: viewsError } = useAllBrandViews();

    if (brandsLoading || viewsLoading) {
        return <CircularProgress />;
    }

    if (brandsError || viewsError) {
        return <Alert severity="error">{brandsError || viewsError}</Alert>;
    }

    // Create a map for quick lookup of views by brandId for efficient data merging
    const viewsMap = new Map(brandViews.map(view => [view.brandId, view.totalViews]));

    // Combine brand data with view counts, sort by most views
    const brandsWithAnalytics = brands.map(brand => ({
        ...brand,
        totalViews: viewsMap.get(brand.id) || 0,
    })).sort((a, b) => b.totalViews - a.totalViews);

    return (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Brand Page Analytics</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Track the total number of page visits for each brand's public detail page.
            </Typography>
            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'primary.light' }}>
                            <TableCell sx={{ fontWeight: 'bold' }}>Brand</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Total Page Views</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Owner Email</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {brandsWithAnalytics.map((brand) => (
                            <TableRow key={brand.id} hover>
                                <TableCell>
                                    <Box display="flex" alignItems="center">
                                        <Avatar src={brand.brandLogo || brand.brandImage} sx={{ mr: 2 }} />
                                        <MuiLink component={Link} to={`/admin/brands/${brand.id}`} underline="hover">
                                            <Typography>{brand.brandName}</Typography>
                                        </MuiLink>
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>
                                    <Box display="flex" alignItems="center" justifyContent="center">
                                        <Visibility color="action" sx={{ mr: 1 }} />
                                        <Typography variant="h6" component="span" fontWeight="bold">
                                            {brand.totalViews.toLocaleString()}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>{brand.brandOwnerInformation?.email}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default AdminAnalytics;

