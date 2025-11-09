import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Alert,
  CircularProgress,
  Stack,
  Divider,
  Chip,
  Tab,
  Tabs,
  Card,
  CardContent,
} from '@mui/material';
import {
  Email as EmailIcon,
  Send as SendIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import * as emailService from '../../services/emailNotificationService';

const EmailTemplatePreview = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [testEmail, setTestEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  const templates = [
    {
      name: 'Submission Confirmation',
      description: 'Sent to users after they submit the registration form',
      variables: ['to_name', 'brand_name', 'business_model', 'submission_date', 'tracking_id'],
      testFunction: emailService.sendSubmissionConfirmation,
    },
    {
      name: 'Admin Notification',
      description: 'Sent to admins when a new brand is registered',
      variables: ['brand_name', 'submitter_name', 'business_model', 'location', 'review_url'],
      testFunction: emailService.sendAdminNotification,
    },
    {
      name: 'Approval Notification',
      description: 'Sent when a brand registration is approved',
      variables: ['to_name', 'brand_name', 'approval_date', 'dashboard_url', 'brand_url'],
      testFunction: emailService.sendApprovalNotification,
    },
    {
      name: 'Rejection Notification',
      description: 'Sent when a brand registration is rejected',
      variables: ['to_name', 'brand_name', 'rejection_date', 'reason', 'resubmit_url'],
      testFunction: emailService.sendRejectionNotification,
    },
    {
      name: 'Status Update',
      description: 'Sent when brand status changes',
      variables: ['to_name', 'brand_name', 'old_status', 'new_status', 'message'],
      testFunction: emailService.sendStatusUpdateNotification,
    },
    {
      name: 'Reminder Email',
      description: 'Sent to users with incomplete registration drafts',
      variables: ['to_name', 'brand_name', 'last_saved', 'completion_percentage', 'resume_url'],
      testFunction: emailService.sendReminderEmail,
    },
    {
      name: 'Welcome Email',
      description: 'Sent to new users when they sign up',
      variables: ['to_name', 'signup_date', 'dashboard_url', 'register_brand_url'],
      testFunction: emailService.sendWelcomeEmail,
    },
  ];

  const currentTemplate = templates[activeTab];

  const handleSendTest = async () => {
    if (!testEmail) {
      setResult({ success: false, error: 'Please enter an email address' });
      return;
    }

    setSending(true);
    setResult(null);

    try {
      // Create test data
      const testData = {
        email: testEmail,
        name: 'Test User',
        brandName: 'Test Brand',
        businessModelType: 'franchise',
        city: 'Test City',
        state: 'Test State',
        contactPerson: 'Test Contact',
        id: 'TEST123',
        slug: 'test-brand',
      };

      const response = await currentTemplate.testFunction(testData);
      setResult(response);
    } catch (error) {
      setResult({ success: false, error: error.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <EmailIcon /> Email Templates & Testing
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Preview and test email templates. Configure EmailJS credentials in .env file to enable email sending.
      </Typography>

      {!emailService.isEmailServiceConfigured() && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Email service not configured. Add EmailJS credentials to .env file to enable email notifications.
          <br />
          <strong>Setup Steps:</strong>
          <ol>
            <li>Sign up at <a href="https://www.emailjs.com/" target="_blank" rel="noopener noreferrer">emailjs.com</a></li>
            <li>Create email templates for each notification type</li>
            <li>Add VITE_EMAILJS_PUBLIC_KEY and VITE_EMAILJS_SERVICE_ID to your .env file</li>
          </ol>
        </Alert>
      )}

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {templates.map((template, index) => (
            <Tab key={index} label={template.name} />
          ))}
        </Tabs>
      </Paper>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {currentTemplate.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {currentTemplate.description}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" gutterBottom>
            Template Variables:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3 }}>
            {currentTemplate.variables.map((variable) => (
              <Chip
                key={variable}
                label={`{{${variable}}}`}
                size="small"
                variant="outlined"
                sx={{ mb: 1 }}
              />
            ))}
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" gutterBottom>
            Send Test Email:
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <TextField
              fullWidth
              type="email"
              label="Test Email Address"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={!emailService.isEmailServiceConfigured()}
            />
            <Button
              variant="contained"
              onClick={handleSendTest}
              disabled={sending || !emailService.isEmailServiceConfigured()}
              startIcon={sending ? <CircularProgress size={20} /> : <SendIcon />}
              sx={{ minWidth: 120 }}
            >
              {sending ? 'Sending...' : 'Send Test'}
            </Button>
          </Stack>

          {result && (
            <Alert
              severity={result.success ? 'success' : 'error'}
              icon={result.success ? <SuccessIcon /> : <ErrorIcon />}
            >
              {result.success
                ? 'Test email sent successfully! Check your inbox.'
                : `Failed to send email: ${result.error}`}
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Email Configuration Guide
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>Step 1:</strong> Create an account at{' '}
            <a href="https://www.emailjs.com/" target="_blank" rel="noopener noreferrer">
              EmailJS
            </a>
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>Step 2:</strong> Connect your email service (Gmail, Outlook, etc.)
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>Step 3:</strong> Create email templates for each notification type using the
            variables listed above
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>Step 4:</strong> Add your EmailJS credentials to .env:
            <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px', marginTop: '8px' }}>
{`VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_SUBMISSION=template_submission
VITE_EMAILJS_TEMPLATE_ADMIN=template_admin
VITE_EMAILJS_TEMPLATE_APPROVAL=template_approval
VITE_EMAILJS_TEMPLATE_REJECTION=template_rejection
VITE_EMAILJS_TEMPLATE_STATUS=template_status
VITE_EMAILJS_TEMPLATE_REMINDER=template_reminder
VITE_EMAILJS_TEMPLATE_WELCOME=template_welcome`}
            </pre>
          </Typography>
          <Typography variant="body2">
            <strong>Step 5:</strong> Test each template using the form above
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EmailTemplatePreview;
