import React from 'react';
import { useAllBrands } from '../../hooks/useAllBrands';
import { db } from '../../firebase/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, CircularProgress, Alert, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import NotificationService from '../../utils/NotificationService';

const AdminBrandManagement = () => {
    const { brands, loading, error, setBrands } = useAllBrands();

    const handleApproval = async (brandId, newStatus) => {
        try {
            const brandRef = doc(db, 'brands', brandId);
            await updateDoc(brandRef, { status: newStatus });
            
            // Find the brand data for notification
            const brand = brands.find(b => b.id === brandId);
            
            // Send notification to brand owner
            if (brand && brand.userId) {
                await NotificationService.sendBrandApprovalNotification(
                    brand.userId, 
                    { ...brand, id: brandId }, 
                    newStatus === 'active'
                );
            }
            
            setBrands(prevBrands => 
                prevBrands.map(brand => 
                    brand.id === brandId ? { ...brand, status: newStatus } : brand
                )
            );
        } catch (err) {
            console.error("Error updating brand status:", err);
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Brand Verification & Management</Typography>
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
                        {brands.map((brand) => (
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
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default AdminBrandManagement;