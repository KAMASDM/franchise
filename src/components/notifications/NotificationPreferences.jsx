import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormGroup,
  FormControlLabel,
  Switch,
  Typography,
  Box,
  Divider,
  Alert,
  AlertTitle,
  Chip,
  Stack,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Notifications,
  NotificationsActive,
  NotificationsOff,
  Close,
  Info,
  CheckCircle,
  Warning
} from '@mui/icons-material';
import PushNotificationService from '../../utils/PushNotificationService';
import { useAuth } from '../../hooks/useAuth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

const NotificationPreferences = ({ open, onClose }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState('default');
  const [preferences, setPreferences] = useState({
    enabled: false,
    newLeads: true,
    chatMessages: true,
    brandUpdates: true,
    systemAlerts: true,
    emailNotifications: true,
    pushNotifications: false
  });
  const [fcmToken, setFcmToken] = useState(null);

  useEffect(() => {
    if (open && currentUser) {
      loadPreferences();
      checkPermissionStatus();
    }
  }, [open, currentUser]);

  const loadPreferences = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setPreferences(prev => ({
          ...prev,
          ...userData.notificationPreferences,
          enabled: userData.notificationsEnabled || false,
          pushNotifications: userData.fcmTokens?.length > 0 || false
        }));
        
        if (userData.fcmTokens && userData.fcmTokens.length > 0) {
          setFcmToken(userData.fcmTokens[0]);
        }
      }
    } catch (error) {
      console.error('Error loading notification preferences:', error);
    }
  };

  const checkPermissionStatus = () => {
    const status = PushNotificationService.getPermissionStatus();
    setPermissionStatus(status);
  };

  const handleEnablePushNotifications = async () => {
    setLoading(true);
    
    try {
      // Initialize FCM
      const initialized = await PushNotificationService.initialize();
      if (!initialized) {
        alert('Push notifications are not supported in this browser');
        setLoading(false);
        return;
      }

      // Request permission
      const { granted, token } = await PushNotificationService.requestPermission();
      
      if (granted && token) {
        // Save token to user profile
        await PushNotificationService.saveTokenToUser(currentUser.uid, token);
        setFcmToken(token);
        setPermissionStatus('granted');
        
        setPreferences(prev => ({
          ...prev,
          pushNotifications: true,
          enabled: true
        }));

        // Test notification
        await PushNotificationService.sendTestNotification();
      } else {
        setPermissionStatus('denied');
        alert('Notification permission was denied. Please enable it in your browser settings.');
      }
    } catch (error) {
      console.error('Error enabling push notifications:', error);
      alert('Failed to enable push notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = async (key, value) => {
    const newPreferences = {
      ...preferences,
      [key]: value
    };
    
    setPreferences(newPreferences);

    // Save to Firestore
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        notificationPreferences: {
          newLeads: newPreferences.newLeads,
          chatMessages: newPreferences.chatMessages,
          brandUpdates: newPreferences.brandUpdates,
          systemAlerts: newPreferences.systemAlerts,
          emailNotifications: newPreferences.emailNotifications
        },
        notificationsEnabled: newPreferences.enabled
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const getPermissionStatusDisplay = () => {
    switch (permissionStatus) {
      case 'granted':
        return {
          icon: <CheckCircle color="success" />,
          text: 'Enabled',
          color: 'success'
        };
      case 'denied':
        return {
          icon: <Warning color="error" />,
          text: 'Blocked',
          color: 'error'
        };
      default:
        return {
          icon: <Info color="info" />,
          text: 'Not enabled',
          color: 'default'
        };
    }
  };

  const permissionDisplay = getPermissionStatusDisplay();

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        pb: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <NotificationsActive color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Notification Preferences
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {/* Push Notification Status */}
        <Alert 
          severity={permissionDisplay.color}
          icon={permissionDisplay.icon}
          sx={{ mb: 3 }}
        >
          <AlertTitle>Push Notifications: {permissionDisplay.text}</AlertTitle>
          {permissionStatus === 'granted' ? (
            <Typography variant="body2">
              You'll receive real-time notifications for important updates.
            </Typography>
          ) : permissionStatus === 'denied' ? (
            <Typography variant="body2">
              Notifications are blocked. Enable them in your browser settings to receive updates.
            </Typography>
          ) : (
            <Typography variant="body2">
              Enable push notifications to stay updated with real-time alerts.
            </Typography>
          )}
        </Alert>

        {/* Enable/Disable All */}
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={preferences.enabled}
                onChange={(e) => handlePreferenceChange('enabled', e.target.checked)}
                color="primary"
              />
            }
            label={
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  Enable Notifications
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Master switch for all notification types
                </Typography>
              </Box>
            }
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Push Notifications Setup */}
        {permissionStatus !== 'granted' && (
          <Box sx={{ mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<Notifications />}
              onClick={handleEnablePushNotifications}
              disabled={loading || permissionStatus === 'denied'}
              fullWidth
              sx={{ py: 1.5 }}
            >
              {loading ? 'Enabling...' : 'Enable Push Notifications'}
            </Button>
            {permissionStatus === 'denied' && (
              <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                Please enable notifications in your browser settings
              </Typography>
            )}
          </Box>
        )}

        {/* Notification Categories */}
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold', color: 'text.secondary' }}>
          Notification Types
        </Typography>

        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={preferences.newLeads}
                onChange={(e) => handlePreferenceChange('newLeads', e.target.checked)}
                disabled={!preferences.enabled}
              />
            }
            label={
              <Box>
                <Typography variant="body2">New Leads</Typography>
                <Typography variant="caption" color="text.secondary">
                  Get notified when someone expresses interest in your franchise
                </Typography>
              </Box>
            }
          />

          <FormControlLabel
            control={
              <Switch
                checked={preferences.chatMessages}
                onChange={(e) => handlePreferenceChange('chatMessages', e.target.checked)}
                disabled={!preferences.enabled}
              />
            }
            label={
              <Box>
                <Typography variant="body2">Chat Messages</Typography>
                <Typography variant="caption" color="text.secondary">
                  Receive notifications for new chat messages
                </Typography>
              </Box>
            }
          />

          <FormControlLabel
            control={
              <Switch
                checked={preferences.brandUpdates}
                onChange={(e) => handlePreferenceChange('brandUpdates', e.target.checked)}
                disabled={!preferences.enabled}
              />
            }
            label={
              <Box>
                <Typography variant="body2">Brand Updates</Typography>
                <Typography variant="caption" color="text.secondary">
                  Updates about your listed franchises
                </Typography>
              </Box>
            }
          />

          <FormControlLabel
            control={
              <Switch
                checked={preferences.systemAlerts}
                onChange={(e) => handlePreferenceChange('systemAlerts', e.target.checked)}
                disabled={!preferences.enabled}
              />
            }
            label={
              <Box>
                <Typography variant="body2">System Alerts</Typography>
                <Typography variant="caption" color="text.secondary">
                  Important system notifications and updates
                </Typography>
              </Box>
            }
          />

          <Divider sx={{ my: 2 }} />

          <FormControlLabel
            control={
              <Switch
                checked={preferences.emailNotifications}
                onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                disabled={!preferences.enabled}
              />
            }
            label={
              <Box>
                <Typography variant="body2">Email Notifications</Typography>
                <Typography variant="caption" color="text.secondary">
                  Receive notifications via email
                </Typography>
              </Box>
            }
          />
        </FormGroup>

        {/* FCM Token Info (for debugging) */}
        {fcmToken && process.env.NODE_ENV === 'development' && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary">
              FCM Token: {fcmToken.substring(0, 20)}...
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotificationPreferences;
