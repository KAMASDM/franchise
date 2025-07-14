import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { Container, Typography, Box, Paper, CircularProgress, Alert, Grid, Chip } from '@mui/material';

const BrandDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [brand, setBrand] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBrand = async () => {
            setLoading(true);
            try {
                const brandRef = doc(db, 'brands', id);
                const brandSnap = await getDoc(brandRef);

                if (brandSnap.exists()) {
                    const brandData = brandSnap.data();
                    // Ensure only active brands are shown to the public
                    if (brandData.status === 'active') {
                        setBrand({ id: brandSnap.id, ...brandData });
                    } else {
                        setError("This brand is currently under review and not publicly visible.");
                    }
                } else {
                    setError("Brand not found. It may have been removed.");
                }
            } catch (err) {
                console.error("Error fetching brand details:", err);
                setError("An error occurred while fetching brand details.");
            }
            setLoading(false);
        };

        if (id) {
            fetchBrand();
        }
    }, [id]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container sx={{ py: 8 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (!brand) {
        return null; // Or a fallback component
    }

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Box
                            component="img"
                            src={brand.logoUrl || 'https://via.placeholder.com/300'}
                            alt={`${brand.brandName} logo`}
                            sx={{ width: '100%', borderRadius: 2 }}
                        />
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Typography variant="h2" component="h1" gutterBottom>
                            {brand.brandName}
                        </Typography>
                        <Chip label={brand.category} color="primary" sx={{ mb: 2 }} />
                        <Typography variant="h5" color="text.secondary" paragraph>
                            Investment: {brand.investmentRange}
                        </Typography>
                        <Typography variant="h5" color="text.secondary" paragraph>
                            Minimum ROI: {brand.minROI}%
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
                            Our Story
                        </Typography>
                        <Typography variant="body1" paragraph>
                            {brand.story}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default BrandDetail;