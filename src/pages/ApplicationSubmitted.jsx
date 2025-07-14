import React from 'react';
import { Container, Paper, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const ApplicationSubmitted = () => {
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Application Submitted!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Thank you for submitting your brand information. Our team will review your application and you will be notified once it is approved.
        </Typography>
        <Button
          variant="contained"
          component={RouterLink}
          to="/"
        >
          Back to Home
        </Button>
      </Paper>
    </Container>
  );
};

export default ApplicationSubmitted;