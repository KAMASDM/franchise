import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { Container, Typography, Grid, CircularProgress, Box } from '@mui/material';
import BrandCard from '../components/brand/BrandCard';
import SearchFilters from '../components/common/SearchFilters';

const Brands = () => {
    const [brands, setBrands] = useState([]);
    const [filteredBrands, setFilteredBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBrands = async () => {
            setLoading(true);
            try {
                const brandsCollection = collection(db, 'brands');
                const q = query(brandsCollection, where("status", "==", "active"));
                const querySnapshot = await getDocs(q);
                const brandsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setBrands(brandsData);
                setFilteredBrands(brandsData);
                setError(null);
            } catch (err) {
                console.error("Error fetching brands:", err);
                setError("Failed to load brands. Please try again later.");
            }
            setLoading(false);
        };

        fetchBrands();
    }, []);

    const handleFilterChange = (filters) => {
        let tempBrands = [...brands];
        if (filters.keyword) {
            tempBrands = tempBrands.filter(brand =>
                brand.brandName.toLowerCase().includes(filters.keyword.toLowerCase()) ||
                brand.category.toLowerCase().includes(filters.keyword.toLowerCase())
            );
        }
        // Add more filtering logic here for category, investment, etc.
        setFilteredBrands(tempBrands);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h6" color="error">{error}</Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 8 }}>
            <Typography variant="h2" align="center" gutterBottom>
                Explore Franchise Opportunities
            </Typography>
            <SearchFilters onFilterChange={handleFilterChange} />
            <Grid container spacing={4} sx={{ mt: 4 }}>
                {filteredBrands.length > 0 ? (
                    filteredBrands.map((brand) => (
                        <Grid item key={brand.id} xs={12} sm={6} md={4}>
                            <BrandCard brand={brand} />
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                            No brands found matching your criteria.
                        </Typography>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
};

export default Brands;