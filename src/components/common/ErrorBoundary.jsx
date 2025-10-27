import React from 'react';
import { Box, Typography, Button, Alert, Container } from '@mui/material';
import { Refresh } from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console in development
    if (import.meta.env.DEV) {
      console.error('Error Boundary Caught:', error, errorInfo);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Alert severity="error" sx={{ mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                Oops! Something went wrong
              </Typography>
              <Typography variant="body1" paragraph>
                We apologize for the inconvenience. The application encountered an unexpected error.
              </Typography>
            </Alert>
            
            <Button 
              variant="contained" 
              startIcon={<Refresh />}
              onClick={this.handleReload}
              sx={{ mt: 2 }}
            >
              Reload Page
            </Button>
            
            {import.meta.env.DEV && this.state.error && (
              <Box sx={{ mt: 4, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="h6" color="error" gutterBottom>
                  Error Details (Development Only):
                </Typography>
                <Typography variant="body2" component="pre" sx={{ textAlign: 'left', fontSize: '0.8rem' }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </Typography>
              </Box>
            )}
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;