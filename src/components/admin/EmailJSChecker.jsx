import React, { useState } from 'react';
import { Box, Typography, Paper, Button, Alert, Divider, TextField } from '@mui/material';
import { CheckCircle, Error, Warning } from '@mui/icons-material';

/**
 * EmailJS Configuration Checker
 * Helps diagnose EmailJS setup issues
 */
const EmailJSChecker = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_GENERIC;

  const configOk = publicKey && serviceId && templateId;

  const testEmailJSConnection = async () => {
    setLoading(true);
    setTestResult(null);

    try {
      const emailjs = (await import('@emailjs/browser')).default;
      
      // Initialize
      emailjs.init(publicKey);

      console.log('Testing EmailJS connection...');
      console.log('Service ID:', serviceId);
      console.log('Template ID:', templateId);

      // Try to send a simple test
      const response = await emailjs.send(
        serviceId,
        templateId,
        {
          to_email: 'test@example.com',
          to_name: 'Test User',
          from_name: 'ikama',
          reply_to: 'support@ikama.in',
          subject: 'Test Email',
          message: '<h1>Test</h1><p>This is a test email.</p>',
          html_content: '<h1>Test</h1><p>This is a test email.</p>',
        }
      );

      console.log('EmailJS Response:', response);

      setTestResult({
        success: true,
        message: 'EmailJS is configured correctly!',
        details: response,
      });
    } catch (error) {
      console.error('EmailJS Test Error:', error);
      
      setTestResult({
        success: false,
        message: error.text || error.message,
        details: error,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h4" sx={{ mb: 1 }}>
        EmailJS Configuration Checker
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Diagnose and fix EmailJS setup issues
      </Typography>

      {!configOk && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="h6">❌ Configuration Error!</Typography>
          <Typography variant="body2">
            Missing environment variables. Check your <code>.env</code> file and restart the server.
          </Typography>
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Environment Variables
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Public Key:</strong>{' '}
            {publicKey ? (
              <span style={{ color: 'green' }}>✓ {publicKey}</span>
            ) : (
              <span style={{ color: 'red' }}>✗ Missing</span>
            )}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Service ID:</strong>{' '}
            {serviceId ? (
              <span style={{ color: 'green' }}>✓ {serviceId}</span>
            ) : (
              <span style={{ color: 'red' }}>✗ Missing</span>
            )}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Generic Template ID:</strong>{' '}
            {templateId ? (
              <span style={{ color: 'green' }}>✓ {templateId}</span>
            ) : (
              <span style={{ color: 'red' }}>✗ Missing</span>
            )}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {configOk ? (
          <Alert severity="success" icon={<CheckCircle />}>
            All environment variables are configured
          </Alert>
        ) : (
          <Alert severity="error" icon={<Error />}>
            Missing environment variables! Check your .env file.
          </Alert>
        )}
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          EmailJS Template Configuration
        </Typography>

        <Alert severity="warning" icon={<Warning />} sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>⚠️ TEMPLATE MUST BE CONFIGURED IN EMAILJS DASHBOARD!</strong>
          </Typography>
          <Typography variant="body2" component="div">
            Go to: <a href="https://dashboard.emailjs.com/admin/templates" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2' }}>
              https://dashboard.emailjs.com/admin/templates
            </a>
            <br /><br />
            <strong>Create or edit template: <code>{templateId}</code></strong>
            <br /><br />
            <strong>Required template fields in EmailJS:</strong>
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
              <li><strong>To Email:</strong> <code>{'{{to_email}}'}</code> ← This is where the email goes!</li>
              <li><strong>To Name:</strong> <code>{'{{to_name}}'}</code></li>
              <li><strong>From Name:</strong> <code>ikama</code> (or <code>{'{{from_name}}'}</code>)</li>
              <li><strong>Reply To:</strong> <code>support@ikama.in</code> (or <code>{'{{reply_to}}'}</code>)</li>
              <li><strong>Subject:</strong> <code>{'{{subject}}'}</code></li>
              <li><strong>Content/Message:</strong> <code>{'{{{message}}}'}</code> ⚠️ <strong>Triple braces! (or use html_content)</strong></li>
            </ul>
            <br />
            <strong style={{ color: '#d32f2f' }}>⚠️ Without proper "To Email" field, you'll get "recipients address is empty" error!</strong>
          </Typography>
        </Alert>

        <Button
          variant="contained"
          onClick={testEmailJSConnection}
          disabled={!configOk || loading}
          fullWidth
        >
          {loading ? 'Testing...' : 'Test EmailJS Connection'}
        </Button>
      </Paper>

      {testResult && (
        <Paper sx={{ p: 3 }}>
          <Alert 
            severity={testResult.success ? 'success' : 'error'}
            icon={testResult.success ? <CheckCircle /> : <Error />}
          >
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {testResult.message}
            </Typography>
            {testResult.details && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Details:</strong>
                </Typography>
                <pre style={{ 
                  fontSize: '12px', 
                  overflow: 'auto', 
                  backgroundColor: '#f5f5f5',
                  padding: '8px',
                  borderRadius: '4px',
                  marginTop: '8px'
                }}>
                  {JSON.stringify(testResult.details, null, 2)}
                </pre>
              </Box>
            )}
          </Alert>
        </Paper>
      )}

      <Paper sx={{ p: 3, mt: 3, bgcolor: 'info.lighter' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          📝 How to Create the Generic Template
        </Typography>
        <Typography variant="body2" component="div">
          <strong>Step 1:</strong> Go to <a href="https://dashboard.emailjs.com/admin/templates" target="_blank" rel="noopener noreferrer">EmailJS Templates</a>
          <br /><br />
          <strong>Step 2:</strong> Click "Create New Template"
          <br /><br />
          <strong>Step 3:</strong> Set up the template fields:
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            <li><strong>Template Name:</strong> Generic HTML Email</li>
            <li><strong>From Name:</strong> ikama</li>
            <li><strong>To Email:</strong> <code style={{ backgroundColor: '#fff3cd', padding: '2px 4px' }}>{'{{to_email}}'}</code></li>
            <li><strong>To Name:</strong> <code>{'{{to_name}}'}</code></li>
            <li><strong>Reply To:</strong> support@ikama.in</li>
            <li><strong>Subject:</strong> <code>{'{{subject}}'}</code></li>
            <li><strong>Content:</strong> <code style={{ backgroundColor: '#fff3cd', padding: '2px 4px' }}>{'{{{message}}}'}</code> (triple braces!)</li>
          </ul>
          <br />
          <strong>Step 4:</strong> Link template to service: <code>{import.meta.env.VITE_EMAILJS_SERVICE_ID}</code>
          <br /><br />
          <strong>Step 5:</strong> Save template and copy the Template ID
          <br /><br />
          <strong>Step 6:</strong> Update <code>.env</code> file:
          <pre style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '8px', 
            borderRadius: '4px',
            fontSize: '12px',
            overflow: 'auto'
          }}>
            VITE_EMAILJS_TEMPLATE_GENERIC=your_template_id_here
          </pre>
          <br />
          <strong>Step 7:</strong> Restart dev server and test again!
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, mt: 3, bgcolor: 'error.lighter' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Common Issues & Solutions
        </Typography>
        <Typography variant="body2" component="div">
          <strong>422 Error (Invalid Request):</strong>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            <li>Template doesn't exist or ID is wrong</li>
            <li>Template variables don't match what we're sending</li>
            <li>Missing triple braces for HTML content: <code>{'{{{html_content}}}'}</code></li>
            <li>Service is not connected to the template</li>
          </ul>

          <strong>401 Error (Unauthorized):</strong>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            <li>Invalid public key</li>
            <li>Service ID doesn't match</li>
          </ul>

          <strong>Template Not Found:</strong>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            <li>Go to EmailJS dashboard: <a href="https://dashboard.emailjs.com/" target="_blank" rel="noopener noreferrer">dashboard.emailjs.com</a></li>
            <li>Create a new template with ID: <code>{templateId}</code></li>
            <li>Or update .env with correct template ID</li>
          </ul>
        </Typography>
      </Paper>
    </Box>
  );
};

export default EmailJSChecker;
