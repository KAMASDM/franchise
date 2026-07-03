import React from 'react';
import { useAllBrands } from '../../hooks/useAllBrands';
import { useSimpleSearch } from '../../hooks/useSimpleSearch';
import { useArrayPagination } from '../../hooks/usePagination';
import { db } from '../../firebase/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, CircularProgress, Alert, Link, TextField, InputAdornment, IconButton, Pagination, Card, CardContent, Stack, Avatar, alpha, useTheme } from '@mui/material';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { Download, Search, Clear, CheckCircle, Cancel, Pending, Store } from '@mui/icons-material';
import NotificationService from '../../utils/NotificationService';
import logger from '../../utils/logger';
import { showToast } from '../../utils/toastUtils';
import { exportBrands } from '../../utils/exportUtils';
import { sendBrandApprovedEmail, sendBrandRejectedEmail } from '../../services/emailServiceNew';
import AutoBrochureService from '../../services/AutoBrochureService';
import { getDoc } from 'firebase/firestore';
import { useDevice } from '../../hooks/useDevice';
import { motion } from 'framer-motion';

const STATUS_TABS = [
    { value: '', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
];

const AdminBrandManagement = () => {
    const { brands, loading, error } = useAllBrands();
    const { searchTerm, setSearchTerm, debouncedSearchTerm } = useSimpleSearch('', 300);
    // Status filter lives in the URL so overview stat cards can deep-link
    // (e.g. /admin/brands?status=pending) and refresh keeps the view.
    const [searchParams, setSearchParams] = useSearchParams();
    const statusFilter = searchParams.get('status') || '';
    // Track rows with an in-flight status update to prevent double submission
    const [updatingIds, setUpdatingIds] = React.useState(() => new Set());

    const setStatusFilter = (value) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            if (value) next.set('status', value);
            else next.delete('status');
            return next;
        }, { replace: true });
    };

    const statusCounts = React.useMemo(() => {
        const counts = { pending: 0, active: 0, inactive: 0 };
        (brands || []).forEach((brand) => {
            if (counts[brand.status] !== undefined) counts[brand.status] += 1;
        });
        return counts;
    }, [brands]);

    // Filter brands based on status tab + debounced search
    const filteredBrands = React.useMemo(() => {
        if (!brands || !Array.isArray(brands)) return [];
        let results = statusFilter
            ? brands.filter((brand) => brand.status === statusFilter)
            : brands;

        if (debouncedSearchTerm) {
            const searchLower = debouncedSearchTerm.toLowerCase();
            results = results.filter(brand =>
                brand.brandName?.toLowerCase().includes(searchLower) ||
                brand.brandOwnerInformation?.email?.toLowerCase().includes(searchLower) ||
                brand.status?.toLowerCase().includes(searchLower)
            );
        }
        return results;
    }, [brands, debouncedSearchTerm, statusFilter]);

    const { paginatedData, currentPage, totalPages, goToPage } = useArrayPagination(filteredBrands, 10);
    
    // Ensure paginatedData is always an array
    const safePaginatedData = Array.isArray(paginatedData) ? paginatedData : [];

    const handleApproval = async (brandId, newStatus) => {
        if (updatingIds.has(brandId)) return; // already processing this row
        setUpdatingIds((prev) => new Set(prev).add(brandId));
        try {
            const brandRef = doc(db, 'brands', brandId);
            await updateDoc(brandRef, { status: newStatus });
            showToast.success(newStatus === 'active' ? 'Brand approved' : 'Brand deactivated');
            
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
            
            // Auto-generate brochure for approved brands
            if (newStatus === 'active') {
                try {
                    logger.info('Auto-generating brochure for approved brand:', brand.brandName);
                    const brochureResult = await AutoBrochureService.generateAndStoreBrochure(brandId, brand);
                    if (brochureResult.success) {
                        logger.info('✅ Brochure auto-generated successfully:', brochureResult.filename);
                    } else {
                        logger.warn('⚠️ Brochure auto-generation failed:', brochureResult.error);
                    }
                } catch (brochureError) {
                    logger.error('❌ Error in brochure auto-generation:', brochureError);
                    // Don't block approval if brochure generation fails
                }
            }
            // onSnapshot in useAllBrands will automatically reflect the status change
        } catch (err) {
            logger.error("Error updating brand status:", err);
            showToast.error('Failed to update brand status. Please try again.');
        } finally {
            setUpdatingIds((prev) => {
                const next = new Set(prev);
                next.delete(brandId);
                return next;
            });
        }
    };

    const { isMobile } = useDevice();
    const theme = useTheme();

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress size={isMobile ? 40 : 60} />
            </Box>
        );
    }
    
    if (error) return <Alert severity="error">{error}</Alert>;

    // Mobile Card View Component
    const BrandMobileCard = ({ brand, index }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
        >
            <Card 
                sx={{ 
                    mb: 2,
                    borderRadius: 3,
                    boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.08)}`,
                    border: `1px solid ${theme.palette.divider}`,
                }}
            >
                <CardContent sx={{ p: 2 }}>
                    <Stack spacing={2}>
                        {/* Header */}
                        <Box display="flex" alignItems="center" gap={1.5}>
                            <Avatar
                                sx={{
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    color: theme.palette.primary.main,
                                    width: 48,
                                    height: 48,
                                }}
                            >
                                <Store />
                            </Avatar>
                            <Box flex={1}>
                                <Link 
                                    component={RouterLink} 
                                    to={`/admin/brands/${brand.id}`}
                                    underline="hover"
                                    sx={{ 
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        display: 'block',
                                        mb: 0.5,
                                    }}
                                >
                                    {brand.brandName}
                                </Link>
                                <Typography variant="caption" color="text.secondary">
                                    {brand.brandOwnerInformation?.email}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Status */}
                        <Box>
                            <Chip
                                icon={
                                    brand.status === 'active' ? <CheckCircle /> :
                                    brand.status === 'pending' ? <Pending /> : <Cancel />
                                }
                                label={brand.status?.toUpperCase()}
                                size="small"
                                color={
                                    brand.status === 'active' ? 'success' :
                                    brand.status === 'pending' ? 'warning' : 'default'
                                }
                                sx={{ fontWeight: 600 }}
                            />
                        </Box>

                        {/* Actions */}
                        <Stack direction="row" spacing={1}>
                            {(brand.status === 'pending' || brand.status === 'inactive') && (
                                <Button
                                    variant="contained"
                                    size="small"
                                    color="success"
                                    disabled={updatingIds.has(brand.id)}
                                    onClick={() => handleApproval(brand.id, 'active')}
                                    fullWidth
                                    sx={{ minHeight: 40 }}
                                >
                                    {updatingIds.has(brand.id) ? 'Approving…' : 'Approve'}
                                </Button>
                            )}
                            {brand.status === 'active' && (
                                <Button
                                    variant="outlined"
                                    size="small"
                                    color="error"
                                    disabled={updatingIds.has(brand.id)}
                                    onClick={() => handleApproval(brand.id, 'inactive')}
                                    fullWidth
                                    sx={{ minHeight: 40 }}
                                >
                                    {updatingIds.has(brand.id) ? 'Updating…' : 'Deactivate'}
                                </Button>
                            )}
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>
        </motion.div>
    );

    return (
        <Box>
            {/* Header */}
            <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between', 
                alignItems: { xs: 'stretch', sm: 'center' }, 
                gap: 2,
                mb: 3,
            }}>
                <Box>
                    <Typography 
                        variant={isMobile ? "h5" : "h4"} 
                        sx={{ fontWeight: 'bold' }}
                    >
                        Brand Management
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {brands.length} brands • {filteredBrands.length} filtered
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Download />}
                    onClick={() => exportBrands(filteredBrands)}
                    disabled={filteredBrands.length === 0}
                    sx={{ minHeight: 48 }}
                >
                    {isMobile ? 'Export' : `Export (${filteredBrands.length})`}
                </Button>
            </Box>
            
            {/* Status Filter Tabs */}
            <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', useFlexGap: true }}>
                {STATUS_TABS.map((tab) => {
                    const count = tab.value ? statusCounts[tab.value] : brands.length;
                    const selected = statusFilter === tab.value;
                    return (
                        <Chip
                            key={tab.label}
                            label={`${tab.label} (${count})`}
                            color={selected ? 'primary' : 'default'}
                            variant={selected ? 'filled' : 'outlined'}
                            onClick={() => setStatusFilter(tab.value)}
                            sx={{ fontWeight: 600 }}
                        />
                    );
                })}
            </Stack>

            {/* Search Bar */}
            <Box sx={{ mb: 3 }}>
                <TextField
                    fullWidth
                    size={isMobile ? "medium" : "small"}
                    placeholder="Search by brand name, owner email, or status..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            '& input': {
                                minHeight: isMobile ? 48 : 'auto',
                            },
                        },
                    }}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                        endAdornment: searchTerm && (
                            <InputAdornment position="end">
                                <IconButton 
                                    onClick={() => setSearchTerm("")} 
                                    aria-label="Clear search"
                                    sx={{ minWidth: 44, minHeight: 44 }}
                                >
                                    <Clear />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
            </Box>
            
            {/* Mobile Card View / Desktop Table View */}
            {isMobile ? (
                <Box>
                    {safePaginatedData.length > 0 ? (
                        safePaginatedData.map((brand, index) => (
                            <BrandMobileCard key={brand.id} brand={brand} index={index} />
                        ))
                    ) : (
                        <Card sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="body1" color="text.secondary">
                                {loading ? 'Loading brands...' : 
                                 searchTerm ? 'No brands match your search criteria.' : 
                                 brands.length === 0 ? 'No brands available.' :
                                 'No data to display.'}
                            </Typography>
                        </Card>
                    )}
                </Box>
            ) : (
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
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    color="success"
                                                    disabled={updatingIds.has(brand.id)}
                                                    onClick={() => handleApproval(brand.id, 'active')}
                                                >
                                                    {updatingIds.has(brand.id) ? 'Approving…' : 'Approve'}
                                                </Button>
                                            )}
                                            {brand.status === 'active' && (
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    color="error"
                                                    disabled={updatingIds.has(brand.id)}
                                                    onClick={() => handleApproval(brand.id, 'inactive')}
                                                >
                                                    {updatingIds.has(brand.id) ? 'Updating…' : 'Deactivate'}
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
            )}
            
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