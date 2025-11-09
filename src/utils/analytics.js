/**
 * Analytics Utility for Brand Registration Form
 * Tracks user interactions, form progress, and conversion events
 */

import { logEvent } from 'firebase/analytics';
import { analytics } from '../firebase/firebase';

/**
 * Track form start event
 * @param {string} businessModelType - Selected business model
 */
export const trackFormStart = (businessModelType = 'unknown') => {
  if (!analytics) return;
  
  logEvent(analytics, 'form_start', {
    form_name: 'brand_registration',
    business_model: businessModelType,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track step navigation
 * @param {number} stepNumber - Current step number (0-based)
 * @param {string} stepName - Name of the step
 * @param {number} timeSpent - Time spent on previous step in seconds
 */
export const trackStepNavigation = (stepNumber, stepName, timeSpent = 0) => {
  if (!analytics) return;
  
  logEvent(analytics, 'form_step_view', {
    form_name: 'brand_registration',
    step_number: stepNumber + 1, // Convert to 1-based for readability
    step_name: stepName,
    time_spent_seconds: Math.round(timeSpent),
  });
};

/**
 * Track step completion
 * @param {number} stepNumber - Completed step number
 * @param {string} stepName - Name of the step
 * @param {number} completionPercentage - Completion percentage of the step
 */
export const trackStepCompletion = (stepNumber, stepName, completionPercentage = 0) => {
  if (!analytics) return;
  
  logEvent(analytics, 'form_step_complete', {
    form_name: 'brand_registration',
    step_number: stepNumber + 1,
    step_name: stepName,
    completion_percentage: Math.round(completionPercentage),
  });
};

/**
 * Track form abandonment
 * @param {number} lastStep - Last step user was on
 * @param {number} totalTimeSpent - Total time spent on form in seconds
 * @param {number} overallCompletion - Overall form completion percentage
 */
export const trackFormAbandonment = (lastStep, totalTimeSpent = 0, overallCompletion = 0) => {
  if (!analytics) return;
  
  logEvent(analytics, 'form_abandon', {
    form_name: 'brand_registration',
    last_step: lastStep + 1,
    total_time_spent_seconds: Math.round(totalTimeSpent),
    overall_completion_percentage: Math.round(overallCompletion),
  });
};

/**
 * Track validation error
 * @param {string} fieldName - Field that has error
 * @param {string} errorType - Type of validation error
 * @param {number} stepNumber - Step where error occurred
 */
export const trackValidationError = (fieldName, errorType, stepNumber) => {
  if (!analytics) return;
  
  logEvent(analytics, 'form_validation_error', {
    form_name: 'brand_registration',
    field_name: fieldName,
    error_type: errorType,
    step_number: stepNumber + 1,
  });
};

/**
 * Track field interaction
 * @param {string} fieldName - Field that was interacted with
 * @param {string} interactionType - Type of interaction (focus, blur, change)
 * @param {number} stepNumber - Current step number
 */
export const trackFieldInteraction = (fieldName, interactionType, stepNumber) => {
  if (!analytics) return;
  
  // Only track first interaction with each field to avoid spam
  const trackedFields = new Set(
    JSON.parse(sessionStorage.getItem('tracked_fields') || '[]')
  );
  
  const fieldKey = `${fieldName}_${interactionType}`;
  if (trackedFields.has(fieldKey)) return;
  
  trackedFields.add(fieldKey);
  sessionStorage.setItem('tracked_fields', JSON.stringify([...trackedFields]));
  
  logEvent(analytics, 'form_field_interaction', {
    form_name: 'brand_registration',
    field_name: fieldName,
    interaction_type: interactionType,
    step_number: stepNumber + 1,
  });
};

/**
 * Track business model selection
 * @param {string} businessModel - Selected business model type
 */
export const trackBusinessModelSelection = (businessModel) => {
  if (!analytics) return;
  
  logEvent(analytics, 'business_model_selected', {
    form_name: 'brand_registration',
    business_model: businessModel,
  });
};

/**
 * Track file upload
 * @param {string} fileType - Type of file uploaded
 * @param {number} fileSize - Size of file in bytes
 * @param {number} stepNumber - Step where upload occurred
 */
export const trackFileUpload = (fileType, fileSize, stepNumber) => {
  if (!analytics) return;
  
  logEvent(analytics, 'form_file_upload', {
    form_name: 'brand_registration',
    file_type: fileType,
    file_size_kb: Math.round(fileSize / 1024),
    step_number: stepNumber + 1,
  });
};

/**
 * Track form submission attempt
 * @param {boolean} success - Whether submission was successful
 * @param {number} totalTimeSpent - Total time spent on form
 * @param {string} businessModel - Selected business model
 */
export const trackFormSubmission = (success, totalTimeSpent = 0, businessModel = 'unknown') => {
  if (!analytics) return;
  
  logEvent(analytics, success ? 'form_submit_success' : 'form_submit_failure', {
    form_name: 'brand_registration',
    business_model: businessModel,
    total_time_spent_seconds: Math.round(totalTimeSpent),
  });
  
  // Track as conversion if successful
  if (success) {
    logEvent(analytics, 'generate_lead', {
      currency: 'INR',
      value: 0, // Can be set based on business logic
    });
  }
};

/**
 * Track auto-save event
 * @param {number} stepNumber - Current step
 */
export const trackAutoSave = (stepNumber) => {
  if (!analytics) return;
  
  // Track only once per session to avoid spam
  const autoSaveTracked = sessionStorage.getItem('auto_save_tracked');
  if (autoSaveTracked) return;
  
  sessionStorage.setItem('auto_save_tracked', 'true');
  
  logEvent(analytics, 'form_auto_save', {
    form_name: 'brand_registration',
    step_number: stepNumber + 1,
  });
};

/**
 * Track session recovery
 */
export const trackSessionRecovery = () => {
  if (!analytics) return;
  
  logEvent(analytics, 'form_session_recovered', {
    form_name: 'brand_registration',
  });
};

/**
 * Track help/tooltip interaction
 * @param {string} helpTopic - Topic of help content
 * @param {number} stepNumber - Current step
 */
export const trackHelpInteraction = (helpTopic, stepNumber) => {
  if (!analytics) return;
  
  logEvent(analytics, 'help_viewed', {
    form_name: 'brand_registration',
    help_topic: helpTopic,
    step_number: stepNumber + 1,
  });
};

/**
 * Track data export
 * @param {string} exportFormat - Format of export (JSON or PDF)
 */
export const trackDataExport = (exportFormat) => {
  if (!analytics) return;
  
  logEvent(analytics, 'data_exported', {
    form_name: 'brand_registration',
    export_format: exportFormat.toLowerCase(),
  });
};

/**
 * Track conditional field visibility change
 * @param {string} businessModel - Current business model
 * @param {number} visibleFieldsCount - Number of visible fields
 */
export const trackConditionalFieldsChange = (businessModel, visibleFieldsCount) => {
  if (!analytics) return;
  
  logEvent(analytics, 'conditional_fields_updated', {
    form_name: 'brand_registration',
    business_model: businessModel,
    visible_fields_count: visibleFieldsCount,
  });
};

/**
 * Track high contrast mode toggle
 * @param {boolean} enabled - Whether high contrast mode is enabled
 */
export const trackHighContrastToggle = (enabled) => {
  if (!analytics) return;
  
  logEvent(analytics, 'accessibility_feature_used', {
    feature: 'high_contrast_mode',
    enabled: enabled,
  });
};

/**
 * Get analytics tracking status
 * @returns {boolean} Whether analytics is available and active
 */
export const isAnalyticsEnabled = () => {
  return analytics !== null;
};

/**
 * Track custom event
 * @param {string} eventName - Name of the event
 * @param {object} eventParams - Event parameters
 */
export const trackCustomEvent = (eventName, eventParams = {}) => {
  if (!analytics) return;
  
  logEvent(analytics, eventName, {
    form_name: 'brand_registration',
    ...eventParams,
  });
};

// Helper function to calculate time spent
let stepStartTime = Date.now();

export const resetStepTimer = () => {
  stepStartTime = Date.now();
};

export const getStepTimeSpent = () => {
  return (Date.now() - stepStartTime) / 1000; // Convert to seconds
};

// Track page views
export const trackPageView = (pageName) => {
  if (!analytics) return;
  
  logEvent(analytics, 'page_view', {
    page_title: pageName,
    page_location: window.location.href,
    page_path: window.location.pathname,
  });
};

/**
 * Generic event tracker (alias for trackCustomEvent)
 * @param {string} eventName - Name of the event
 * @param {object} eventParams - Event parameters
 */
export const trackEvent = (eventName, eventParams = {}) => {
  return trackCustomEvent(eventName, eventParams);
};

export default {
  trackFormStart,
  trackStepNavigation,
  trackStepCompletion,
  trackFormAbandonment,
  trackValidationError,
  trackFieldInteraction,
  trackBusinessModelSelection,
  trackFileUpload,
  trackFormSubmission,
  trackAutoSave,
  trackSessionRecovery,
  trackHelpInteraction,
  trackDataExport,
  trackConditionalFieldsChange,
  trackHighContrastToggle,
  isAnalyticsEnabled,
  trackCustomEvent,
  trackEvent,
  trackPageView,
  resetStepTimer,
  getStepTimeSpent,
};
