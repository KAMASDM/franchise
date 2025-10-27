/**
 * PWA Utilities - Functions for managing PWA installation and service workers
 */

/**
 * Check if the app is running as a PWA
 */
export const isPWA = () => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true ||
         document.referrer.includes('android-app://');
};

/**
 * Check if PWA installation is available
 */
export const canInstallPWA = () => {
  return 'BeforeInstallPromptEvent' in window;
};

/**
 * Check if service workers are supported
 */
export const supportsServiceWorker = () => {
  return 'serviceWorker' in navigator;
};

/**
 * Check if push notifications are supported
 */
export const supportsPushNotifications = () => {
  return 'PushManager' in window && 'Notification' in window;
};

/**
 * Get notification permission status
 */
export const getNotificationPermission = () => {
  if (!('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
};

/**
 * Request notification permission
 */
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    return 'unsupported';
  }
  
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return 'denied';
  }
};

/**
 * Check if app is installed
 */
export const isAppInstalled = () => {
  // Check if running in standalone mode
  if (isPWA()) {
    return true;
  }
  
  // Check if install prompt was dismissed
  const dismissed = localStorage.getItem('pwa-install-dismissed');
  if (dismissed) {
    const dismissedTime = parseInt(dismissed, 10);
    const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
    return daysSinceDismissed < 30; // Don't show again for 30 days
  }
  
  return false;
};

/**
 * Mark install prompt as dismissed
 */
export const dismissInstallPrompt = () => {
  localStorage.setItem('pwa-install-dismissed', Date.now().toString());
};

/**
 * Clear install prompt dismissal
 */
export const clearInstallPromptDismissal = () => {
  localStorage.removeItem('pwa-install-dismissed');
};

/**
 * Register service worker
 */
export const registerServiceWorker = async () => {
  if (!supportsServiceWorker()) {
    console.warn('Service workers are not supported in this browser');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    });
    
    console.log('Service Worker registered successfully:', registration);
    
    // Check for updates periodically
    setInterval(() => {
      registration.update();
    }, 60 * 60 * 1000); // Check every hour
    
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
};

/**
 * Unregister service worker
 */
export const unregisterServiceWorker = async () => {
  if (!supportsServiceWorker()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      const success = await registration.unregister();
      console.log('Service Worker unregistered:', success);
      return success;
    }
    return false;
  } catch (error) {
    console.error('Error unregistering service worker:', error);
    return false;
  }
};

/**
 * Update service worker
 */
export const updateServiceWorker = async () => {
  if (!supportsServiceWorker()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.update();
      console.log('Service Worker updated');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating service worker:', error);
    return false;
  }
};

/**
 * Get app update available status
 */
export const checkForUpdate = async () => {
  if (!supportsServiceWorker()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.update();
      return registration.waiting !== null;
    }
    return false;
  } catch (error) {
    console.error('Error checking for updates:', error);
    return false;
  }
};

/**
 * Skip waiting and reload
 */
export const skipWaitingAndReload = () => {
  if (!supportsServiceWorker()) {
    return;
  }

  navigator.serviceWorker.getRegistration().then((registration) => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      registration.waiting.addEventListener('statechange', (e) => {
        if (e.target.state === 'activated') {
          window.location.reload();
        }
      });
    }
  });
};

/**
 * Get offline status
 */
export const isOffline = () => {
  return !navigator.onLine;
};

/**
 * Add online/offline listeners
 */
export const addConnectionListeners = (onOnline, onOffline) => {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);
  
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
};

/**
 * Get storage usage
 */
export const getStorageUsage = async () => {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    try {
      const estimate = await navigator.storage.estimate();
      return {
        usage: estimate.usage,
        quota: estimate.quota,
        percentage: ((estimate.usage / estimate.quota) * 100).toFixed(2),
        usageInMB: (estimate.usage / (1024 * 1024)).toFixed(2),
        quotaInMB: (estimate.quota / (1024 * 1024)).toFixed(2)
      };
    } catch (error) {
      console.error('Error getting storage estimate:', error);
      return null;
    }
  }
  return null;
};

/**
 * Clear all caches
 */
export const clearAllCaches = async () => {
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      console.log('All caches cleared');
      return true;
    } catch (error) {
      console.error('Error clearing caches:', error);
      return false;
    }
  }
  return false;
};

/**
 * Check if device supports install
 */
export const canShowInstallPrompt = () => {
  // Don't show if already installed
  if (isPWA()) {
    return false;
  }
  
  // Don't show if recently dismissed
  const dismissed = localStorage.getItem('pwa-install-dismissed');
  if (dismissed) {
    const dismissedTime = parseInt(dismissed, 10);
    const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
    if (daysSinceDismissed < 7) { // Show again after 7 days
      return false;
    }
  }
  
  return true;
};

export default {
  isPWA,
  canInstallPWA,
  supportsServiceWorker,
  supportsPushNotifications,
  getNotificationPermission,
  requestNotificationPermission,
  isAppInstalled,
  dismissInstallPrompt,
  clearInstallPromptDismissal,
  registerServiceWorker,
  unregisterServiceWorker,
  updateServiceWorker,
  checkForUpdate,
  skipWaitingAndReload,
  isOffline,
  addConnectionListeners,
  getStorageUsage,
  clearAllCaches,
  canShowInstallPrompt
};
