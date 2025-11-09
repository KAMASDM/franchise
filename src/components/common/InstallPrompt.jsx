import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Slide,
  Stack,
  Chip
} from '@mui/material';
import {
  Close as CloseIcon,
  GetApp as InstallIcon,
  PhoneAndroid,
  Speed,
  Cloud,
  Notifications
} from '@mui/icons-material';
import { canShowInstallPrompt, dismissInstallPrompt, isPWA } from '../../utils/pwaUtils';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const InstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(iOS);

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      
      // Show prompt if allowed
      if (canShowInstallPrompt()) {
        // Delay showing prompt by 30 seconds to not annoy users immediately
        setTimeout(() => {
          setShowPrompt(true);
        }, 30000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, show manual install instructions
    if (iOS && canShowInstallPrompt() && !isPWA()) {
      setTimeout(() => {
        setShowPrompt(true);
      }, 45000); // Show after 45 seconds on iOS
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt && !isIOS) {
      return;
    }

    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
        dismissInstallPrompt();
      }
      
      // Clear the deferredPrompt
      setDeferredPrompt(null);
    }
    
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    dismissInstallPrompt();
  };

  const handleLater = () => {
    setShowPrompt(false);
    // Don't mark as dismissed permanently, show again later
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <Dialog
      open={showPrompt}
      onClose={handleLater}
      TransitionComponent={Transition}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        elevation: 8,
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }
      }}
    >
      <DialogTitle sx={{ color: 'white', pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
            <InstallIcon />
            Install ikama - Franchise Hub
          </Typography>
          <IconButton onClick={handleLater} sx={{ color: 'white' }} aria-label="Close install prompt">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ bgcolor: 'white', py: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Get the best experience!
        </Typography>
        <Typography variant="body2" paragraph color="text.secondary">
          Install ikama - Franchise Hub on your device for quick access and a better experience.
        </Typography>

        <Stack spacing={2} sx={{ my: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              bgcolor: 'primary.light', 
              p: 1.5, 
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <PhoneAndroid sx={{ color: 'primary.main', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                Home Screen Access
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Launch directly from your home screen
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              bgcolor: 'success.light', 
              p: 1.5, 
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Speed sx={{ color: 'success.main', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                Lightning Fast
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Optimized performance and instant loading
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              bgcolor: 'info.light', 
              p: 1.5, 
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Cloud sx={{ color: 'info.main', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                Works Offline
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Browse brands even without internet
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              bgcolor: 'warning.light', 
              p: 1.5, 
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Notifications sx={{ color: 'warning.main', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                Instant Updates
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Get notified about new opportunities
              </Typography>
            </Box>
          </Box>
        </Stack>

        {isIOS && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
              How to install on iOS:
            </Typography>
            <Typography variant="body2" component="div">
              1. Tap the <strong>Share</strong> button in Safari<br />
              2. Scroll and tap <strong>"Add to Home Screen"</strong><br />
              3. Tap <strong>Add</strong> to confirm
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ bgcolor: 'white', p: 2, gap: 1 }}>
        <Button onClick={handleDismiss} color="inherit">
          Don't Show Again
        </Button>
        <Button onClick={handleLater} variant="outlined">
          Maybe Later
        </Button>
        {!isIOS && (
          <Button 
            onClick={handleInstall} 
            variant="contained" 
            startIcon={<InstallIcon />}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #6a4193 100%)',
              }
            }}
          >
            Install Now
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default InstallPrompt;
