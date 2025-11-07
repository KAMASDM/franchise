import toast from 'react-hot-toast';
import { CheckCircle, Error, Warning, Info } from '@mui/icons-material';

/**
 * Toast notification utilities using react-hot-toast
 * Provides consistent, beautiful notifications throughout the app
 */

const defaultOptions = {
  duration: 4000,
  position: 'top-right',
  style: {
    borderRadius: '12px',
    padding: '16px',
    fontSize: '14px',
    maxWidth: '500px',
  },
};

export const showToast = {
  success: (message, options = {}) => {
    return toast.success(message, {
      ...defaultOptions,
      ...options,
      icon: '✅',
      style: {
        ...defaultOptions.style,
        ...options.style,
      },
    });
  },

  error: (message, options = {}) => {
    return toast.error(message, {
      ...defaultOptions,
      duration: 6000, // Errors stay longer
      ...options,
      icon: '❌',
      style: {
        ...defaultOptions.style,
        ...options.style,
      },
    });
  },

  warning: (message, options = {}) => {
    return toast(message, {
      ...defaultOptions,
      ...options,
      icon: '⚠️',
      style: {
        ...defaultOptions.style,
        background: '#fff3cd',
        color: '#856404',
        ...options.style,
      },
    });
  },

  info: (message, options = {}) => {
    return toast(message, {
      ...defaultOptions,
      ...options,
      icon: 'ℹ️',
      style: {
        ...defaultOptions.style,
        background: '#d1ecf1',
        color: '#0c5460',
        ...options.style,
      },
    });
  },

  loading: (message, options = {}) => {
    return toast.loading(message, {
      ...defaultOptions,
      ...options,
    });
  },

  promise: (promise, messages) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading || 'Processing...',
        success: messages.success || 'Success!',
        error: messages.error || 'Something went wrong',
      },
      defaultOptions
    );
  },

  // Dismiss a specific toast
  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },

  // Dismiss all toasts
  dismissAll: () => {
    toast.dismiss();
  },

  // Custom toast with action button
  withAction: (message, actionLabel, onAction, options = {}) => {
    return toast(
      (t) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ flex: 1 }}>{message}</span>
          <button
            onClick={() => {
              onAction();
              toast.dismiss(t.id);
            }}
            style={{
              background: '#5a76a9',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '13px',
            }}
          >
            {actionLabel}
          </button>
        </div>
      ),
      {
        ...defaultOptions,
        duration: 8000,
        ...options,
      }
    );
  },
};

// Common toast messages
export const toastMessages = {
  // Form related
  formSaved: () => showToast.success('Changes saved successfully'),
  formError: () => showToast.error('Please fix the errors before submitting'),
  formSubmitted: () => showToast.success('Form submitted successfully'),
  
  // Data operations
  dataLoaded: () => showToast.success('Data loaded successfully'),
  dataLoadError: () => showToast.error('Failed to load data. Please try again.'),
  dataSaved: () => showToast.success('Data saved successfully'),
  dataSaveError: () => showToast.error('Failed to save data. Please try again.'),
  dataDeleted: () => showToast.success('Deleted successfully'),
  dataDeleteError: () => showToast.error('Failed to delete. Please try again.'),
  
  // Upload related
  uploadSuccess: () => showToast.success('File uploaded successfully'),
  uploadError: () => showToast.error('Upload failed. Please try again.'),
  uploadProgress: () => showToast.loading('Uploading...'),
  
  // Authentication
  loginSuccess: () => showToast.success('Welcome back!'),
  logoutSuccess: () => showToast.success('Logged out successfully'),
  authError: () => showToast.error('Authentication failed'),
  
  // Network
  networkError: () => showToast.error('Network error. Please check your connection.'),
  offline: () => showToast.warning("You're offline. Some features may be limited."),
  online: () => showToast.success("You're back online!"),
  
  // Clipboard
  copiedToClipboard: () => showToast.success('Copied to clipboard'),
  
  // Generic
  success: (msg) => showToast.success(msg),
  error: (msg) => showToast.error(msg),
  warning: (msg) => showToast.warning(msg),
  info: (msg) => showToast.info(msg),
};

export default showToast;
