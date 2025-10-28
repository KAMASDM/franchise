import React from 'react';
import { useAllBrands } from '../../hooks/useAllBrands';
import { db } from '../../firebase/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, CircularProgress, Alert, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'; // Import RouterLink
import logger from '../../utils/logger';

const AdminVerification = () => {
    const { brands, loading, error, setBrands } = useAllBrands();

    const handleApproval = async (brandId, newStatus) => {
        try {
            const brandRef = doc(db, 'brands', brandId);
            await updateDoc(brandRef, {
                status: newStatus
            });
            // Update the state locally to reflect the change immediately
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
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Admin Brand Verification</Typography>
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
                                    {/* Make the brand name a clickable link */}
                                    <Link component={RouterLink} to={`/dashboard/brand-details/${brand.brandName.replace(/\s+/g, "-").toLowerCase()}`} underline="hover">
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
                                    {brand.status === 'pending' && (
                                        <Button variant="contained" color="success" onClick={() => handleApproval(brand.id, 'active')}>
                                            Approve
                                        </Button>
                                    )}
                                    {brand.status === 'active' && (
                                        <Button variant="outlined" color="error" onClick={() => handleApproval(brand.id, 'inactive')}>
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

export default AdminVerification;