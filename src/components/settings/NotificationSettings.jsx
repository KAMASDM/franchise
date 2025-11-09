import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  FormGroup,
  Button,
  Divider,
  Alert,
  Stack,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Email as EmailIcon,
  PhonelinkRing as PushIcon,
  Settings as SettingsIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  TestTube as TestIcon,
} from '@mui/icons-material';
import { showToast } from '../../utils/toastUtils';
import { pushNotifications } from '../../utils/pushNotifications';
import logger from '../../utils/logger';

/**
 * Notification Settings Component
 * Allows users to manage email and push notification preferences
 */
const NotificationSettings = ({ userId }) => {
  const [settings, setSettings] = useState({
    email: {
      newLeads: true,
      brandApproval: true,
      savedSearchAlerts: true,
      inquiryResponses: true,
      weeklyDigest: false,
      marketingEmails: false,
    },
    push: {
      enabled: false,
      newLeads: true,
      brandApproval: true,
      savedSearchAlerts: true,
      chatMessages: true,
    },
  });

  const [pushPermission, setPushPermission] = useState('default');
  const [loading, setLoading] = useState(false);
  const [testEmailDialog, setTestEmailDialog] = useState(false);
  const [testEmail, setTestEmail] = useState('');

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('notification_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    // Check push notification permission
    if (pushNotifications.isNotificationSupported()) {
      setPushPermission(pushNotifications.getPermissionStatus());
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('notification_settings', JSON.stringify(newSettings));
    logger.log('Notification settings saved:', newSettings);
  };

  // Handle email setting change
  const handleEmailChange = (setting) => (event) => {
    const newSettings = {
      ...settings,
      email: {
        ...settings.email,
        [setting]: event.target.checked,
      },
    };
    saveSettings(newSettings);
    showToast.success('Email preferences updated');
  };

  // Handle push setting change
  const handlePushChange = (setting) => (event) => {
    const newSettings = {
      ...settings,
      push: {
        ...settings.push,
        [setting]: event.target.checked,
      },
    };
    saveSettings(newSettings);
    showToast.success('Push notification preferences updated');
  };

  // Enable push notifications
  const handleEnablePush = async () => {
    setLoading(true);
    try {
      const granted = await pushNotifications.requestPermission();
      
      if (granted) {
        setPushPermission('granted');
        const newSettings = {
          ...settings,
          push: {
            ...settings.push,
            enabled: true,
          },
        };
        saveSettings(newSettings);
      } else {
        setPushPermission('denied');
      }
    } catch (error) {
      logger.error('Error enabling push notifications:', error);
      showToast.error('Failed to enable push notifications');
    } finally {
      setLoading(false);
    }
  };

  // Disable push notifications
  const handleDisablePush = async () => {
    setLoading(true);
    try {
      await pushNotifications.unsubscribe();
      const newSettings = {
        ...settings,
        push: {
          ...settings.push,
          enabled: false,
        },
      };
      saveSettings(newSettings);
      showToast.success('Push notifications disabled');
    } catch (error) {
      logger.error('Error disabling push notifications:', error);
      showToast.error('Failed to disable push notifications');
    } finally {
      setLoading(false);
    }
  };

  // Send test push notification
  const sendTestPush = async () => {
    try {
      await pushNotifications.showLocalNotification(
        'Test Notification',
        {
          body: 'This is a test notification from ikama - Franchise Hub!',
          icon: '/pwa-192x192.svg',
        }
      );
      showToast.success('Test notification sent');
    } catch (error) {
      logger.error('Error sending test notification:', error);
      showToast.error('Failed to send test notification');
    }
  };

  // Send test email
  const sendTestEmailHandler = async () => {
    if (!testEmail) {
      showToast.warning('Please enter an email address');
      return;
    }

    setLoading(true);
    try {
      showToast.info('Email notifications have been disabled');
      setTestEmailDialog(false);
      setTestEmail('');
    } catch (error) {
      logger.error('Error sending test email:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check if service is configured
  const emailConfigured = false; // Email service disabled
  const pushSupported = pushNotifications.isNotificationSupported();

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <SettingsIcon />
        Notification Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage how you receive updates about your franchise opportunities
      </Typography>

      {/* Email Notifications */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmailIcon color="primary" />
              <Typography variant="h6">Email Notifications</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {emailConfigured ? (
                <Chip label="Configured" color="success" size="small" icon={<CheckIcon />} />
              ) : (
                <Chip label="Not Configured" color="warning" size="small" icon={<CloseIcon />} />
              )}
              <Button
                size="small"
                startIcon={<TestIcon />}
                onClick={() => setTestEmailDialog(true)}
                disabled={!emailConfigured}
              >
                Test
              </Button>
            </Box>
          </Box>

          {!emailConfigured && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Email service is not configured. Please contact the administrator to set up EmailJS.
            </Alert>
          )}

          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.email.newLeads}
                  onChange={handleEmailChange('newLeads')}
                  disabled={!emailConfigured}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight={500}>New Lead Inquiries</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Get notified when someone inquires about your franchise
                  </Typography>
                </Box>
              }
            />

            <Divider sx={{ my: 1 }} />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.email.brandApproval}
                  onChange={handleEmailChange('brandApproval')}
                  disabled={!emailConfigured}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight={500}>Brand Status Updates</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Approval, rejection, and status changes for your listings
                  </Typography>
                </Box>
              }
            />

            <Divider sx={{ my: 1 }} />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.email.savedSearchAlerts}
                  onChange={handleEmailChange('savedSearchAlerts')}
                  disabled={!emailConfigured}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight={500}>Saved Search Alerts</Typography>
                  <Typography variant="caption" color="text.secondary">
                    New franchises matching your saved search criteria
                  </Typography>
                </Box>
              }
            />

            <Divider sx={{ my: 1 }} />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.email.inquiryResponses}
                  onChange={handleEmailChange('inquiryResponses')}
                  disabled={!emailConfigured}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight={500}>Inquiry Responses</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Replies to your franchise inquiries
                  </Typography>
                </Box>
              }
            />

            <Divider sx={{ my: 1 }} />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.email.weeklyDigest}
                  onChange={handleEmailChange('weeklyDigest')}
                  disabled={!emailConfigured}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight={500}>Weekly Digest</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Summary of new opportunities and activity
                  </Typography>
                </Box>
              }
            />

            <Divider sx={{ my: 1 }} />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.email.marketingEmails}
                  onChange={handleEmailChange('marketingEmails')}
                  disabled={!emailConfigured}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight={500}>Marketing & Tips</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Franchise tips, success stories, and promotional offers
                  </Typography>
                </Box>
              }
            />
          </FormGroup>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PushIcon color="primary" />
              <Typography variant="h6">Push Notifications</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {pushSupported ? (
                <Chip 
                  label={pushPermission === 'granted' ? 'Enabled' : 'Disabled'} 
                  color={pushPermission === 'granted' ? 'success' : 'default'} 
                  size="small" 
                />
              ) : (
                <Chip label="Not Supported" color="error" size="small" />
              )}
              {pushPermission === 'granted' && (
                <Button
                  size="small"
                  startIcon={<TestIcon />}
                  onClick={sendTestPush}
                >
                  Test
                </Button>
              )}
            </Box>
          </Box>

          {!pushSupported ? (
            <Alert severity="error">
              Push notifications are not supported in your browser. Please use a modern browser like Chrome, Firefox, or Safari.
            </Alert>
          ) : pushPermission === 'denied' ? (
            <Alert severity="warning">
              Push notifications are blocked. Please enable them in your browser settings.
            </Alert>
          ) : pushPermission !== 'granted' ? (
            <Box>
              <Alert severity="info" sx={{ mb: 2 }}>
                Enable push notifications to receive instant updates even when the app is closed.
              </Alert>
              <Button
                variant="contained"
                startIcon={<NotificationsIcon />}
                onClick={handleEnablePush}
                disabled={loading}
                fullWidth
              >
                Enable Push Notifications
              </Button>
            </Box>
          ) : (
            <Box>
              <Alert severity="success" sx={{ mb: 2 }}>
                Push notifications are enabled. You'll receive instant updates for selected events.
              </Alert>

              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.push.newLeads}
                      onChange={handlePushChange('newLeads')}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight={500}>New Lead Inquiries</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Instant notification when someone inquires about your franchise
                      </Typography>
                    </Box>
                  }
                />

                <Divider sx={{ my: 1 }} />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.push.brandApproval}
                      onChange={handlePushChange('brandApproval')}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight={500}>Brand Status Updates</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Approval and status changes for your listings
                      </Typography>
                    </Box>
                  }
                />

                <Divider sx={{ my: 1 }} />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.push.savedSearchAlerts}
                      onChange={handlePushChange('savedSearchAlerts')}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight={500}>Saved Search Matches</Typography>
                      <Typography variant="caption" color="text.secondary">
                        New franchises matching your criteria
                      </Typography>
                    </Box>
                  }
                />

                <Divider sx={{ my: 1 }} />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.push.chatMessages}
                      onChange={handlePushChange('chatMessages')}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight={500}>Chat Messages</Typography>
                      <Typography variant="caption" color="text.secondary">
                        New messages from prospects or brand owners
                      </Typography>
                    </Box>
                  }
                />
              </FormGroup>

              <Button
                variant="outlined"
                color="error"
                onClick={handleDisablePush}
                disabled={loading}
                fullWidth
                sx={{ mt: 2 }}
              >
                Disable Push Notifications
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Test Email Dialog */}
      <Dialog open={testEmailDialog} onClose={() => setTestEmailDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Send Test Email</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Email Address"
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="your.email@example.com"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTestEmailDialog(false)}>Cancel</Button>
          <Button onClick={sendTestEmailHandler} variant="contained" disabled={loading}>
            Send Test Email
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NotificationSettings;
