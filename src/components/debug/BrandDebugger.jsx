import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { generateBrandSlug } from '../../utils/brandUtils';
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText,
  CircularProgress,
  Button,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const BrandDebugger = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        console.log('[BrandDebugger] Fetching all brands...');
        const brandsRef = collection(db, 'brands');
        const querySnapshot = await getDocs(brandsRef);
        
        const brandsData = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const slug = generateBrandSlug(data.brandName);
          brandsData.push({
            id: doc.id,
            brandName: data.brandName,
            slug: slug,
            status: data.status,
            userId: data.userId,
            ...data
          });
        });
        
        console.log('[BrandDebugger] Found brands:', brandsData);
        setBrands(brandsData);
      } catch (err) {
        console.error('[BrandDebugger] Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Brand Debugger
      </Typography>
      <Typography variant="body1" paragraph>
        Total brands found: {brands.length}
      </Typography>
      
      {brands.length === 0 ? (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" color="warning.main">
            No brands found in database!
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            This means either:
            <br />
            1. The database is empty
            <br />
            2. Firebase connection issues
            <br />
            3. Permission issues
          </Typography>
          <Button 
            variant="contained" 
            sx={{ mt: 2 }}
            onClick={() => navigate('/dashboard/register-brand')}
          >
            Create First Brand
          </Button>
        </Paper>
      ) : (
        <List>
          {brands.map((brand) => (
            <ListItem key={brand.id} sx={{ border: '1px solid #ddd', mb: 1, borderRadius: 1 }}>
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="h6">{brand.brandName}</Typography>
                    <Chip label={brand.status} size="small" color={brand.status === 'active' ? 'success' : 'warning'} />
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2">
                      <strong>ID:</strong> {brand.id}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Slug:</strong> {brand.slug}
                    </Typography>
                    <Typography variant="body2">
                      <strong>URL:</strong> /brand/{brand.slug}
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{ mt: 1 }}
                      onClick={() => navigate(`/brand/${brand.slug}`)}
                    >
                      Test Link
                    </Button>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default BrandDebugger;