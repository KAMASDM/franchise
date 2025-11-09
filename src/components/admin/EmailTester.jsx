import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Paper, 
  Alert,
  CircularProgress,
  Divider,
  Grid
} from '@mui/material';
import { Send, CheckCircle, Error } from '@mui/icons-material';
import { 
  sendWelcomeEmail, 
  sendNewLeadInquiryEmail, 
  sendBrandStatusUpdateEmail, 
  sendBrandOwnerResponseEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
  sendBrandSubmittedEmail,
  sendEmailVerification
} from '../../services/emailServiceNew';

/**
 * Email Testing Component
 * Use this to test all 4 EmailJS templates
 */
const EmailTester = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  // Test email state
  const [testEmail, setTestEmail] = useState('');
  const [testName, setTestName] = useState('');

  const handleTestEmail = async (emailType) => {
    if (!testEmail || !testName) {
      setResult({ success: false, error: 'Please enter both email and name' });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      let response;

      switch (emailType) {
        case 'welcome':
          response = await sendWelcomeEmail({
            email: testEmail,
            name: testName,
          });
          break;

        case 'lead-inquiry':
          response = await sendNewLeadInquiryEmail({
            brandOwnerEmail: testEmail,
            brandOwnerName: testName,
            brandName: 'Test Brand - Coffee Shop',
            inquirerName: 'John Doe',
            inquirerEmail: 'john.doe@example.com',
            inquirerPhone: '+91 9876543210',
            message: 'I am interested in this franchise opportunity. Can you provide more details about the investment requirements and expected ROI?',
            investmentRange: '₹10L - ₹50L',
          });
          break;

        case 'brand-status':
          response = await sendBrandStatusUpdateEmail({
            brandOwnerEmail: testEmail,
            brandOwnerName: testName,
            brandName: 'Test Brand - Coffee Shop',
            status: 'approved',
            message: 'Congratulations! Your brand listing has been approved.',
            brandSlug: 'test-brand-coffee-shop',
          });
          break;

        case 'brand-response':
          response = await sendBrandOwnerResponseEmail({
            inquirerEmail: testEmail,
            inquirerName: testName,
            brandName: 'Test Brand - Coffee Shop',
            brandOwnerName: 'Brand Owner',
            responseMessage: 'Thank you for your interest! We would love to discuss this opportunity with you. Please call us at +91 9876543210 or schedule a meeting at your convenience.',
            contactEmail: 'brandowner@example.com',
            contactPhone: '+91 9876543210',
            brandSlug: 'test-brand-coffee-shop',
          });
          break;

        case 'password-reset':
          response = await sendPasswordResetEmail({
            email: testEmail,
            name: testName,
            resetLink: 'https://ikama.in/reset-password?token=sample-token-123',
          });
          break;

        case 'password-changed':
          response = await sendPasswordChangedEmail({
            email: testEmail,
            name: testName,
          });
          break;

        case 'brand-submitted':
          response = await sendBrandSubmittedEmail({
            email: testEmail,
            name: testName,
            brandName: 'Test Brand - Coffee Shop',
          });
          break;

        case 'email-verification':
          response = await sendEmailVerification({
            email: testEmail,
            name: testName,
            verificationLink: 'https://ikama.in/verify-email?token=sample-token-456',
          });
          break;

        default:
          throw new Error('Invalid email type');
      }

      setResult(response);
    } catch (error) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Email Template Tester
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Test Configuration
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Test Email"
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="your.email@example.com"
              helperText="Email where test messages will be sent"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Test Name"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              placeholder="Your Name"
              helperText="Name to use in test emails"
            />
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={2}>
        {/* Welcome Email Test */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              1. Welcome Email
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Template: <code>HTML Template</code>
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Sent when: New user signs up for the first time
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Button
              fullWidth
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <Send />}
              onClick={() => handleTestEmail('welcome')}
              disabled={loading || !testEmail || !testName}
            >
              Test Welcome Email
            </Button>
          </Paper>
        </Grid>

        {/* Lead Inquiry Email Test */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              2. New Lead Inquiry
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Template: <code>HTML Template</code>
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Sent when: Someone submits a franchise inquiry form
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Button
              fullWidth
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <Send />}
              onClick={() => handleTestEmail('lead-inquiry')}
              disabled={loading || !testEmail || !testName}
            >
              Test Lead Inquiry Email
            </Button>
          </Paper>
        </Grid>

        {/* Brand Status Update Email Test */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              3. Brand Status Update
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Template: <code>HTML Template</code>
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Sent when: Admin approves/rejects brand listing
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Button
              fullWidth
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <Send />}
              onClick={() => handleTestEmail('brand-status')}
              disabled={loading || !testEmail || !testName}
            >
              Test Brand Status Email
            </Button>
          </Paper>
        </Grid>

        {/* Brand Owner Response Email Test */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              4. Brand Owner Response
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Template: <code>HTML Template</code>
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Sent when: Brand owner responds to a lead inquiry
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Button
              fullWidth
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <Send />}
              onClick={() => handleTestEmail('brand-response')}
              disabled={loading || !testEmail || !testName}
            >
              Test Brand Response Email
            </Button>
          </Paper>
        </Grid>

        {/* Password Reset Email Test */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              5. Password Reset
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Template: <code>HTML Template</code>
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Sent when: User requests password reset
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Button
              fullWidth
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <Send />}
              onClick={() => handleTestEmail('password-reset')}
              disabled={loading || !testEmail || !testName}
            >
              Test Password Reset
            </Button>
          </Paper>
        </Grid>

        {/* Password Changed Email Test */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              6. Password Changed
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Template: <code>HTML Template</code>
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Sent when: User successfully changes password
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Button
              fullWidth
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <Send />}
              onClick={() => handleTestEmail('password-changed')}
              disabled={loading || !testEmail || !testName}
            >
              Test Password Changed
            </Button>
          </Paper>
        </Grid>

        {/* Brand Submitted Email Test */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              7. Brand Submitted
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Template: <code>HTML Template</code>
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Sent when: Brand owner submits new brand listing
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Button
              fullWidth
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <Send />}
              onClick={() => handleTestEmail('brand-submitted')}
              disabled={loading || !testEmail || !testName}
            >
              Test Brand Submitted
            </Button>
          </Paper>
        </Grid>

        {/* Email Verification Test */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              8. Email Verification
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Template: <code>HTML Template</code>
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Sent when: User needs to verify email address
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Button
              fullWidth
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <Send />}
              onClick={() => handleTestEmail('email-verification')}
              disabled={loading || !testEmail || !testName}
            >
              Test Email Verification
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Result Display */}
      {result && (
        <Box sx={{ mt: 3 }}>
          <Alert 
            severity={result.success ? 'success' : 'error'} 
            icon={result.success ? <CheckCircle /> : <Error />}
          >
            {result.success ? (
              <>
                <strong>Email sent successfully!</strong>
                <br />
                Check your inbox at: {testEmail}
              </>
            ) : (
              <>
                <strong>Email failed:</strong> {result.error}
              </>
            )}
          </Alert>
        </Box>
      )}

      {/* Instructions */}
      <Paper sx={{ p: 3, mt: 3, bgcolor: 'info.lighter' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Testing Instructions
        </Typography>
        <Typography variant="body2" component="div">
          <ol style={{ margin: 0, paddingLeft: '20px' }}>
            <li>Enter your email address and name above</li>
            <li>Click on any "Test" button to send that email type</li>
            <li>Check your inbox (and spam folder) for the test email</li>
            <li>Verify that:
              <ul style={{ marginTop: '8px' }}>
                <li>Email arrives within 1-2 minutes</li>
                <li>Template renders correctly</li>
                <li>All dynamic data is populated</li>
                <li>Links work properly</li>
                <li>Email looks good on mobile and desktop</li>
              </ul>
            </li>
          </ol>
        </Typography>
      </Paper>

      {/* Configuration Info */}
      <Paper sx={{ p: 3, mt: 3, bgcolor: 'warning.lighter' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          EmailJS Configuration (HTML-Based System)
        </Typography>
        <Typography variant="body2" component="div">
          <strong>Service ID:</strong> {import.meta.env.VITE_EMAILJS_SERVICE_ID || 'Not configured'}<br />
          <strong>Public Key:</strong> {import.meta.env.VITE_EMAILJS_PUBLIC_KEY ? '✓ Configured' : '✗ Missing'}<br />
          <strong>Generic Template:</strong> {import.meta.env.VITE_EMAILJS_TEMPLATE_GENERIC || 'Not configured'}<br />
          <br />
          <strong>Architecture:</strong>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            <li>✅ Using single generic EmailJS template for unlimited emails</li>
            <li>✅ HTML templates stored locally for full control</li>
            <li>✅ Dynamic variable replacement in templates</li>
            <li>✅ No template limit - can create unlimited email types</li>
          </ul>
        </Typography>
      </Paper>
    </Box>
  );
};

export default EmailTester;
