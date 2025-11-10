import React from 'react';
import { useAllBrands } from '../../hooks/useAllBrands';
import { useSimpleSearch } from '../../hooks/useSimpleSearch';
import { useArrayPagination } from '../../hooks/usePagination';
import { db } from '../../firebase/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, CircularProgress, Alert, Link, TextField, InputAdornment, IconButton, Pagination } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Download, Search, Clear } from '@mui/icons-material';
import NotificationService from '../../utils/NotificationService';
import logger from '../../utils/logger';
import { exportBrands } from '../../utils/exportUtils';
import { sendBrandStatusUpdateEmail, sendBrandApprovedEmail, sendBrandRejectedEmail } from '../../services/emailServiceNew';
import { getDoc } from 'firebase/firestore';

const AdminBrandManagement = () => {
    const { brands, loading, error, setBrands } = useAllBrands();
    const { searchTerm, setSearchTerm, debouncedSearchTerm } = useSimpleSearch('', 300);

    // Filter brands based on debounced search
    const filteredBrands = React.useMemo(() => {
        if (!brands || !Array.isArray(brands)) return [];
        if (!debouncedSearchTerm) return brands;
        
        const searchLower = debouncedSearchTerm.toLowerCase();
        return brands.filter(brand => 
            brand.brandName?.toLowerCase().includes(searchLower) ||
            brand.brandOwnerInformation?.email?.toLowerCase().includes(searchLower) ||
            brand.status?.toLowerCase().includes(searchLower)
        );
    }, [brands, debouncedSearchTerm]);

    const { paginatedData, currentPage, totalPages, goToPage } = useArrayPagination(filteredBrands, 10);
    
    // Ensure paginatedData is always an array
    const safePaginatedData = Array.isArray(paginatedData) ? paginatedData : [];

    const handleApproval = async (brandId, newStatus) => {
        try {
            const brandRef = doc(db, 'brands', brandId);
            await updateDoc(brandRef, { status: newStatus });
            
            // Find the brand data for notification
            const brand = brands.find(b => b.id === brandId);
            
            // Send in-app notification to brand owner
            if (brand && brand.userId) {
                await NotificationService.sendBrandApprovalNotification(
                    brand.userId, 
                    { ...brand, id: brandId }, 
                    newStatus === 'active'
                );
                
                // Send email notification to brand owner
                try {
                    const brandOwnerDoc = await getDoc(doc(db, "users", brand.userId));
                    const brandOwnerData = brandOwnerDoc.data();
                    
                    if (brandOwnerData?.email) {
                        if (newStatus === 'active') {
                            // Send brand approved email
                            await sendBrandApprovedEmail({
                                brandOwnerEmail: brandOwnerData.email,
                                brandOwnerName: brandOwnerData.displayName || brand.brandOwnerInformation?.name || 'Brand Owner',
                                brandName: brand.brandName,
                                brandSlug: brand.slug || brand.brandName?.toLowerCase().replace(/\s+/g, '-'),
                            });
                            logger.info('Brand approved email sent to brand owner:', brandOwnerData.email);
                        } else {
                            // Send brand rejected email
                            await sendBrandRejectedEmail({
                                brandOwnerEmail: brandOwnerData.email,
                                brandOwnerName: brandOwnerData.displayName || brand.brandOwnerInformation?.name || 'Brand Owner',
                                brandName: brand.brandName,
                                reason: 'Your brand listing did not meet our current requirements.',
                            });
                            logger.info('Brand rejected email sent to brand owner:', brandOwnerData.email);
                        }
                    }
                } catch (emailError) {
                    logger.error('Failed to send brand status update email:', emailError);
                    // Don't block the approval if email fails
                }
            }
            
            setBrands(prevBrands => 
                prevBrands.map(brand => 
                    brand.id === brandId ? { ...brand, status: newStatus } : brand
                )
            );
        } catch (err) {
            logger.error("Error updating brand status:", err);
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Brand Verification & Management</Typography>
                <Button
                    variant="contained"
                    startIcon={<Download />}
                    onClick={() => exportBrands(brands)}
                    disabled={brands.length === 0}
                >
                    Export Brands ({brands.length})
                </Button>
            </Box>
            
            {/* Search Bar */}
            <Box sx={{ mb: 3 }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search by brand name, owner email, or status..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                        endAdornment: searchTerm && <InputAdornment position="end"><IconButton onClick={() => setSearchTerm("")} aria-label="Clear search"><Clear /></IconButton></InputAdornment>
                    }}
                />
            </Box>
            
            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'primary.light' }}>
                            <TableCell sx={{ fontWeight: 'bold' }}>Brand Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Owner Email</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {safePaginatedData.length > 0 ? (
                            safePaginatedData.map((brand) => (
                                <TableRow key={brand.id} hover>
                                    <TableCell>
                                        {/* THIS LINK IS NOW CORRECT */}
                                        <Link component={RouterLink} to={`/admin/brands/${brand.id}`} underline="hover">
                                            {brand.brandName}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{brand.brandOwnerInformation?.email}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={brand.status}
                                            color={
                                                brand.status === 'active' ? 'success' :
                                                brand.status === 'pending' ? 'warning' : 'default'
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {(brand.status === 'pending' || brand.status === 'inactive') && (
                                            <Button variant="contained" size="small" color="success" onClick={() => handleApproval(brand.id, 'active')}>
                                                Approve
                                            </Button>
                                        )}
                                        {brand.status === 'active' && (
                                            <Button variant="outlined" size="small" color="error" onClick={() => handleApproval(brand.id, 'inactive')}>
                                                Deactivate
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        {loading ? 'Loading brands...' : 
                                         searchTerm ? 'No brands match your search criteria.' : 
                                         brands.length === 0 ? 'No brands available.' :
                                         'No data to display.'}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            
            {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination 
                        count={totalPages} 
                        page={currentPage} 
                        onChange={(e, page) => goToPage(page)}
                        color="primary"
                        showFirstButton
                        showLastButton
                    />
                </Box>
            )}
        </Box>
    );
};

export default AdminBrandManagement;