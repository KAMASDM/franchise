/**
 * Push Notification Service
 * Handles browser push notifications using the Notifications API and Service Worker
 */

import logger from './logger';
import { showToast } from './toastUtils';

class PushNotificationService {
  constructor() {
    this.permission = 'default';
    this.subscription = null;
    this.isSupported = 'Notification' in window && 'serviceWorker' in navigator;
  }

  /**
   * Check if push notifications are supported
   */
  isNotificationSupported() {
    return this.isSupported;
  }

  /**
   * Get current notification permission status
   */
  getPermissionStatus() {
    if (!this.isSupported) return 'unsupported';
    return Notification.permission;
  }

  /**
   * Request notification permission from user
   */
  async requestPermission() {
    if (!this.isSupported) {
      logger.warn('Push notifications not supported in this browser');
      showToast.warning('Push notifications are not supported in your browser');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;

      if (permission === 'granted') {
        logger.log('✅ Notification permission granted');
        showToast.success('Notifications enabled successfully!');
        
        // Register for push notifications
        await this.registerPushSubscription();
        return true;
      } else if (permission === 'denied') {
        logger.warn('❌ Notification permission denied');
        showToast.error('Notification permission denied. You can enable it in browser settings.');
        return false;
      } else {
        logger.warn('⚠️ Notification permission dismissed');
        return false;
      }
    } catch (error) {
      logger.error('Error requesting notification permission:', error);
      showToast.error('Failed to request notification permission');
      return false;
    }
  }

  /**
   * Register push subscription with service worker
   */
  async registerPushSubscription() {
    try {
      if (!('serviceWorker' in navigator)) {
        throw new Error('Service Workers not supported');
      }

      // Wait for service worker to be ready
      const registration = await navigator.serviceWorker.ready;
      
      // Check if already subscribed
      let subscription = await registration.pushManager.getSubscription();
      
      if (!subscription) {
        // Subscribe to push notifications
        // Note: In production, you'd need a VAPID public key from your push service
        const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
        
        if (vapidPublicKey) {
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey)
          });
          
          logger.log('✅ Push subscription created:', subscription);
        }
      }

      this.subscription = subscription;
      
      // Store subscription in localStorage for reference
      if (subscription) {
        localStorage.setItem('push_subscription', JSON.stringify(subscription.toJSON()));
      }

      return subscription;
    } catch (error) {
      logger.error('Error registering push subscription:', error);
      return null;
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribe() {
    try {
      if (this.subscription) {
        await this.subscription.unsubscribe();
        this.subscription = null;
        localStorage.removeItem('push_subscription');
        logger.log('✅ Unsubscribed from push notifications');
        showToast.success('Push notifications disabled');
        return true;
      }
      return false;
    } catch (error) {
      logger.error('Error unsubscribing from push:', error);
      showToast.error('Failed to disable push notifications');
      return false;
    }
  }

  /**
   * Show a local notification (not push)
   */
  async showLocalNotification(title, options = {}) {
    if (!this.isSupported) {
      logger.warn('Notifications not supported');
      return null;
    }

    if (Notification.permission !== 'granted') {
      logger.warn('Notification permission not granted');
      return null;
    }

    try {
      const defaultOptions = {
        icon: '/pwa-192x192.svg',
        badge: '/favicon.ico',
        vibrate: [200, 100, 200],
        tag: 'franchise-notification',
        requireInteraction: false,
        ...options
      };

      // Use service worker to show notification for better reliability
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        return await registration.showNotification(title, defaultOptions);
      } else {
        // Fallback to basic notification
        return new Notification(title, defaultOptions);
      }
    } catch (error) {
      logger.error('Error showing notification:', error);
      return null;
    }
  }

  /**
   * Show notification for new lead
   */
  async notifyNewLead(leadData) {
    return await this.showLocalNotification(
      'New Franchise Inquiry! 🎉',
      {
        body: `${leadData.firstName} ${leadData.lastName} is interested in ${leadData.brandName}`,
        icon: leadData.brandImage || '/pwa-192x192.svg',
        tag: `lead-${leadData.id}`,
        data: {
          type: 'new_lead',
          leadId: leadData.id,
          url: '/admin/leads'
        },
        actions: [
          {
            action: 'view',
            title: 'View Lead',
            icon: '/icons/view.png'
          },
          {
            action: 'close',
            title: 'Dismiss'
          }
        ]
      }
    );
  }

  /**
   * Show notification for brand approval
   */
  async notifyBrandApproval(brandData, approved = true) {
    return await this.showLocalNotification(
      approved ? 'Brand Approved! ✅' : 'Brand Needs Review',
      {
        body: approved 
          ? `Your ${brandData.brandName} franchise is now live!`
          : `Your ${brandData.brandName} submission needs additional info`,
        icon: brandData.brandImage || '/pwa-192x192.svg',
        tag: `brand-${brandData.id}`,
        data: {
          type: 'brand_status',
          brandId: brandData.id,
          approved,
          url: `/brand-owner/brands/${brandData.id}`
        }
      }
    );
  }

  /**
   * Show notification for saved search match
   */
  async notifySavedSearchMatch(brand, searchCriteria) {
    return await this.showLocalNotification(
      'New Franchise Match! 🎯',
      {
        body: `${brand.brandName} matches your saved search criteria`,
        icon: brand.brandImage || '/pwa-192x192.svg',
        tag: `search-match-${brand.id}`,
        data: {
          type: 'search_match',
          brandId: brand.id,
          url: `/brands/${brand.slug}`
        }
      }
    );
  }

  /**
   * Show notification for chat message
   */
  async notifyChatMessage(message, sender) {
    return await this.showLocalNotification(
      `New message from ${sender}`,
      {
        body: message.substring(0, 100),
        tag: 'chat-message',
        data: {
          type: 'chat_message',
          url: '/admin/chat'
        }
      }
    );
  }

  /**
   * Schedule a notification for later
   */
  scheduleNotification(title, options, delay) {
    setTimeout(() => {
      this.showLocalNotification(title, options);
    }, delay);
  }

  /**
   * Helper: Convert VAPID key to Uint8Array
   */
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  /**
   * Get notification statistics
   */
  getStats() {
    return {
      supported: this.isSupported,
      permission: this.getPermissionStatus(),
      subscribed: !!this.subscription,
      subscription: this.subscription?.toJSON() || null
    };
  }
}

// Export singleton instance
export const pushNotifications = new PushNotificationService();
export default pushNotifications;
