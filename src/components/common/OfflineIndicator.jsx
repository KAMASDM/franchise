import React, { useState, useEffect } from 'react';
import { Snackbar, Alert, AlertTitle } from '@mui/material';
import { WifiOff, Wifi } from '@mui/icons-material';
import { isOffline, addConnectionListeners } from '../../utils/pwaUtils';

const OfflineIndicator = () => {
  const [offline, setOffline] = useState(isOffline());
  const [showOnlineMessage, setShowOnlineMessage] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setOffline(false);
      setShowOnlineMessage(true);
      setTimeout(() => setShowOnlineMessage(false), 3000);
    };

    const handleOffline = () => {
      setOffline(true);
      setShowOnlineMessage(false);
    };

    const cleanup = addConnectionListeners(handleOnline, handleOffline);
    return cleanup;
  }, []);

  return (
    <>
      {/* Offline Banner */}
      <Snackbar
        open={offline}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity="warning" 
          icon={<WifiOff />}
          sx={{ width: '100%' }}
        >
          <AlertTitle>You're Offline</AlertTitle>
          Some features may be limited. You can still browse cached content.
        </Alert>
      </Snackbar>

      {/* Back Online Message */}
      <Snackbar
        open={showOnlineMessage}
        autoHideDuration={3000}
        onClose={() => setShowOnlineMessage(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity="success" 
          icon={<Wifi />}
          onClose={() => setShowOnlineMessage(false)}
          sx={{ width: '100%' }}
        >
          You're back online!
        </Alert>
      </Snackbar>
    </>
  );
};

export default OfflineIndicator;
