/**
 * Debug component to check video testimonials in Firestore
 * Temporary component - remove after debugging
 */

import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';

const TestimonialDebugger = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching all videoTestimonials from Firestore...');
        const snapshot = await getDocs(collection(db, 'videoTestimonials'));
        
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        console.log('Raw Firestore data:', docs);
        console.log('Total documents:', docs.length);
        console.log('Active documents:', docs.filter(d => d.isActive).length);
        
        setData(docs);
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography>Loading testimonials data...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom>
        Video Testimonials Debug Info
      </Typography>
      
      {error && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: '#ffebee' }}>
          <Typography color="error">Error: {error}</Typography>
        </Paper>
      )}
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Summary:</Typography>
        <Typography>Total Documents: {data?.length || 0}</Typography>
        <Typography>Active Documents: {data?.filter(d => d.isActive).length || 0}</Typography>
        <Typography>Inactive Documents: {data?.filter(d => !d.isActive).length || 0}</Typography>
      </Paper>

      {data && data.length > 0 ? (
        data.map((doc, index) => (
          <Paper key={doc.id} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">Document {index + 1}</Typography>
            <Typography><strong>ID:</strong> {doc.id}</Typography>
            <Typography><strong>Active:</strong> {doc.isActive ? 'Yes ✅' : 'No ❌'}</Typography>
            <Typography><strong>Author:</strong> {doc.authorName || 'N/A'}</Typography>
            <Typography><strong>Company:</strong> {doc.authorCompany || 'N/A'}</Typography>
            <Typography><strong>Order:</strong> {doc.order || 'N/A'}</Typography>
            <Typography><strong>Video URL:</strong> {doc.videoUrl || 'N/A'}</Typography>
            <Typography><strong>Thumbnail:</strong> {doc.thumbnailUrl || 'N/A'}</Typography>
            <Typography><strong>Full Data:</strong></Typography>
            <pre style={{ fontSize: '12px', overflow: 'auto' }}>
              {JSON.stringify(doc, null, 2)}
            </pre>
          </Paper>
        ))
      ) : (
        <Paper sx={{ p: 2 }}>
          <Typography color="error">
            No testimonials found in Firestore!
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Make sure you have added testimonials in the Admin panel.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default TestimonialDebugger;
