import { useState, useEffect, useCallback, useRef } from 'react';
import logger from '../utils/logger';
import { showToast } from '../utils/toastUtils';

/**
 * Custom hook for form auto-save functionality
 * Saves form data to localStorage at regular intervals and provides recovery
 */

const DEFAULT_SAVE_INTERVAL = 30000; // 30 seconds
const DRAFT_PREFIX = 'draft_';

export const useFormAutoSave = (formId, formData, options = {}) => {
  const {
    saveInterval = DEFAULT_SAVE_INTERVAL,
    onSave,
    onRecover,
    excludeFields = [],
    showNotifications = true,
  } = options;

  const [lastSaved, setLastSaved] = useState(null);
  const [hasDraft, setHasDraft] = useState(false);
  const saveTimeoutRef = useRef(null);
  const isDirtyRef = useRef(false);
  const formDataRef = useRef(formData);

  const draftKey = `${DRAFT_PREFIX}${formId}`;

  // Update ref when formData changes
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  // Check for existing draft on mount
  useEffect(() => {
    const draft = getDraft();
    if (draft && draft.data) {
      setHasDraft(true);
      logger.log('Found existing draft for form:', formId);
    }
  }, [formId]);

  // Save draft function - uses ref to avoid recreation
  const saveDraft = useCallback(() => {
    try {
      // Filter out excluded fields
      const dataToSave = { ...formDataRef.current };
      excludeFields.forEach(field => {
        delete dataToSave[field];
      });

      const draft = {
        data: dataToSave,
        timestamp: new Date().toISOString(),
        formId,
      };

      localStorage.setItem(draftKey, JSON.stringify(draft));
      setLastSaved(new Date());
      isDirtyRef.current = false;

      if (onSave) {
        onSave(draft);
      }

      if (showNotifications) {
        showToast.info('Draft saved', { duration: 2000 });
      }

      logger.log('Draft saved:', formId);
    } catch (error) {
      logger.error('Failed to save draft:', error);
    }
  }, [formId, draftKey, excludeFields, onSave, showNotifications]); // Removed formData

  // Get saved draft
  const getDraft = useCallback(() => {
    try {
      const saved = localStorage.getItem(draftKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      logger.error('Failed to retrieve draft:', error);
    }
    return null;
  }, [draftKey]);

  // Recover draft
  const recoverDraft = useCallback(() => {
    const draft = getDraft();
    if (draft && draft.data) {
      if (onRecover) {
        onRecover(draft.data);
      }
      setHasDraft(false);
      if (showNotifications) {
        showToast.success('Draft recovered successfully');
      }
      return draft.data;
    }
    return null;
  }, [getDraft, onRecover, showNotifications]);

  // Clear draft
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(draftKey);
      setHasDraft(false);
      setLastSaved(null);
      if (showNotifications) {
        showToast.info('Draft cleared');
      }
      logger.log('Draft cleared:', formId);
    } catch (error) {
      logger.error('Failed to clear draft:', error);
    }
  }, [draftKey, formId, showNotifications]);

  // Manual save trigger
  const save = useCallback(() => {
    saveDraft();
  }, [saveDraft]);

  // Auto-save effect
  useEffect(() => {
    // Don't save empty forms
    const hasData = Object.values(formData).some(value => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(v => v !== '' && v !== null && v !== undefined);
      }
      return value !== '' && value !== null && value !== undefined;
    });

    if (!hasData) {
      return;
    }

    // Mark as dirty when form data changes
    isDirtyRef.current = true;

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout
    saveTimeoutRef.current = setTimeout(() => {
      if (isDirtyRef.current) {
        saveDraft();
      }
    }, saveInterval);

    // Cleanup
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [formData, saveInterval]); // Removed saveDraft from dependencies

  // Save on unmount (component cleanup)
  useEffect(() => {
    return () => {
      if (isDirtyRef.current) {
        // Try to save one last time using ref
        try {
          const dataToSave = { ...formDataRef.current };
          excludeFields.forEach(field => {
            delete dataToSave[field];
          });
          const draft = {
            data: dataToSave,
            timestamp: new Date().toISOString(),
            formId,
          };
          localStorage.setItem(draftKey, JSON.stringify(draft));
        } catch (error) {
          logger.error('Failed to save on unmount:', error);
        }
      }
    };
  }, [formId, draftKey, excludeFields]); // Removed formData

  return {
    saveDraft: save,
    recoverDraft,
    clearDraft,
    hasDraft,
    lastSaved,
    getDraft,
  };
};

/**
 * Get all drafts from localStorage
 */
export const getAllDrafts = () => {
  const drafts = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(DRAFT_PREFIX)) {
        const draft = JSON.parse(localStorage.getItem(key));
        drafts.push({
          key,
          formId: key.replace(DRAFT_PREFIX, ''),
          ...draft,
        });
      }
    }
  } catch (error) {
    logger.error('Failed to get all drafts:', error);
  }
  return drafts;
};

/**
 * Clear all drafts
 */
export const clearAllDrafts = () => {
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(DRAFT_PREFIX)) {
        keys.push(key);
      }
    }
    keys.forEach(key => localStorage.removeItem(key));
    logger.log('All drafts cleared');
  } catch (error) {
    logger.error('Failed to clear all drafts:', error);
  }
};

export default useFormAutoSave;
