/**
 * PWA Update Prompt Component
 * Shows a notification when a new version of the app is available
 */

import React, { useEffect, useState } from 'react';
import {
  Snackbar,
  Alert,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { Refresh, Close } from '@mui/icons-material';

const PWAUpdatePrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState(null);

  useEffect(() => {
    // Check if service worker is supported
    if ('serviceWorker' in navigator) {
      // Listen for service worker updates
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker available
                setWaitingWorker(newWorker);
                setShowPrompt(true);
              }
            });
          }
        });
      });

      // Check for waiting service worker on load
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration?.waiting) {
          setWaitingWorker(registration.waiting);
          setShowPrompt(true);
        }
      });

      // Listen for controller change (when new SW takes over)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      // Tell the waiting service worker to skip waiting
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  return (
    <Snackbar
      open={showPrompt}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{ 
        bottom: { xs: 80, sm: 24 },
        '& .MuiSnackbar-root': {
          maxWidth: '600px',
        }
      }}
    >
      <Alert
        severity="info"
        icon={<Refresh />}
        sx={{
          width: '100%',
          boxShadow: 3,
          alignItems: 'center',
          '& .MuiAlert-message': {
            flex: 1,
          },
        }}
        action={
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button
              color="inherit"
              size="small"
              onClick={handleUpdate}
              variant="outlined"
              sx={{ 
                fontWeight: 600,
                borderColor: 'currentColor',
                '&:hover': {
                  borderColor: 'currentColor',
                  bgcolor: 'rgba(255,255,255,0.1)',
                }
              }}
            >
              Update Now
            </Button>
            <Button
              color="inherit"
              size="small"
              onClick={handleDismiss}
              sx={{ minWidth: 'auto', px: 1 }}
            >
              <Close fontSize="small" />
            </Button>
          </Box>
        }
      >
        <Typography variant="body2" fontWeight={600}>
          New Version Available!
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
          Click "Update Now" to get the latest features and improvements
        </Typography>
      </Alert>
    </Snackbar>
  );
};

export default PWAUpdatePrompt;
