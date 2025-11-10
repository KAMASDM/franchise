import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Divider,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Send, Schedule, Email, Analytics } from '@mui/icons-material';
import engagementEmailService from '../../services/engagementEmailService';

/**
 * Engagement Email Management Component
 * Allows admins to manually trigger engagement emails and view analytics
 */
const EngagementEmailManager = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  // Test email settings
  const [testEmail, setTestEmail] = useState('');
  const [testName, setTestName] = useState('');
  const [testEmailType, setTestEmailType] = useState('getting-started');

  const engagementEmailTypes = [
    { value: 'getting-started', label: 'Getting Started Guide', description: 'Welcome new users' },
    { value: 'profile-completion', label: 'Profile Completion', description: 'Remind users to complete profiles' },
    { value: 'we-miss-you', label: 'We Miss You', description: 'Re-engage inactive users' },
    { value: 'recommendations', label: 'Personalized Recommendations', description: 'AI-based franchise suggestions' },
  ];

  const handleRunEngagementBatch = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await engagementEmailService.sendAllEngagementEmails();
      setResult(response);
    } catch (error) {
      setResult({
        success: false,
        error: error.message,
        message: 'Failed to run engagement email batch',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRunSpecificBatch = async (emailType) => {
    setLoading(true);
    setResult(null);

    try {
      let response;
      switch (emailType) {
        case 'getting-started':
          response = await engagementEmailService.sendGettingStartedEmails();
          break;
        case 'profile-completion':
          response = await engagementEmailService.sendProfileCompletionReminders();
          break;
        case 'we-miss-you':
          response = await engagementEmailService.sendWeMissYouEmails();
          break;
        default:
          throw new Error('Unknown email type');
      }
      setResult(response);
    } catch (error) {
      setResult({
        success: false,
        error: error.message,
        message: `Failed to run ${emailType} emails`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmail = async () => {
    if (!testEmail || !testName) {
      setResult({
        success: false,
        error: 'Please enter both email and name for testing',
        message: 'Missing test email or name',
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await engagementEmailService.testEngagementEmail(
        testEmailType,
        testEmail,
        testName
      );
      setResult(response);
    } catch (error) {
      setResult({
        success: false,
        error: error.message,
        message: 'Failed to send test email',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Engagement Email Management
      </Typography>

      {/* Result Display */}
      {result && (
        <Alert 
          severity={result.success ? 'success' : 'error'} 
          sx={{ mb: 3 }}
          onClose={() => setResult(null)}
        >
          <Typography variant="body2">
            <strong>{result.message}</strong>
          </Typography>
          {result.results && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" component="div">
                • Getting Started: {result.results.gettingStarted?.emailsSent?.length || 0} emails
              </Typography>
              <Typography variant="caption" component="div">
                • Profile Completion: {result.results.profileCompletion?.emailsSent?.length || 0} emails
              </Typography>
              <Typography variant="caption" component="div">
                • We Miss You: {result.results.weMissYou?.emailsSent?.length || 0} emails
              </Typography>
            </Box>
          )}
          {result.error && (
            <Typography variant="caption" color="error" component="div" sx={{ mt: 1 }}>
              Error: {result.error}
            </Typography>
          )}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Manual Batch Triggers */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Manual Email Triggers
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Manually trigger engagement email batches. In production, these should run automatically via scheduled functions.
            </Typography>

            {/* Run All Emails */}
            <Box sx={{ mb: 3 }}>
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                onClick={handleRunEngagementBatch}
                disabled={loading}
                size="large"
                sx={{ mb: 2 }}
              >
                Run All Engagement Emails
              </Button>
              <Typography variant="body2" color="text.secondary">
                Runs getting started, profile completion, and we miss you emails
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Individual Email Types */}
            <Typography variant="h6" sx={{ mb: 2 }}>
              Individual Email Batches
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Schedule />}
                  onClick={() => handleRunSpecificBatch('getting-started')}
                  disabled={loading}
                >
                  Getting Started
                </Button>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  24h after signup
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Analytics />}
                  onClick={() => handleRunSpecificBatch('profile-completion')}
                  disabled={loading}
                >
                  Profile Completion
                </Button>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Incomplete profiles
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Email />}
                  onClick={() => handleRunSpecificBatch('we-miss-you')}
                  disabled={loading}
                >
                  We Miss You
                </Button>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  30+ days inactive
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Test Individual Emails */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Test Individual Email
            </Typography>
            
            <TextField
              fullWidth
              label="Test Email"
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              sx={{ mb: 2 }}
              placeholder="test@example.com"
            />
            
            <TextField
              fullWidth
              label="Test Name"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              sx={{ mb: 2 }}
              placeholder="John Doe"
            />
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Email Type</InputLabel>
              <Select
                value={testEmailType}
                label="Email Type"
                onChange={(e) => setTestEmailType(e.target.value)}
              >
                {engagementEmailTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Button
              fullWidth
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <Send />}
              onClick={handleTestEmail}
              disabled={loading || !testEmail || !testName}
            >
              Send Test Email
            </Button>
            
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              {engagementEmailTypes.find(type => type.value === testEmailType)?.description}
            </Typography>
          </Paper>
        </Grid>

        {/* Setup Instructions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, bgcolor: 'info.lighter' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              🚀 Production Setup Instructions
            </Typography>
            
            <Typography variant="body2" sx={{ mb: 2 }}>
              For automated engagement emails in production, consider these options:
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  <strong>Option 1: Firebase Cloud Functions</strong>
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, fontSize: '0.85rem' }}>
                  Create scheduled functions that run daily using pubsub triggers.
                  Example: <code>functions.pubsub.schedule('0 9 * * *')</code>
                </Typography>
                
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  <strong>Option 2: Vercel Cron Jobs</strong>
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                  Add API routes and configure <code>vercel.json</code> with cron schedules.
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  <strong>Recommended Schedule:</strong>
                </Typography>
                <Typography variant="body2" component="div" sx={{ fontSize: '0.85rem' }}>
                  • 9 AM: Getting Started emails<br />
                  • 2 PM: Profile completion reminders<br />
                  • 6 PM: We miss you emails (monthly)<br />
                  • 10 PM: Analytics and cleanup
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EngagementEmailManager;