import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { db } from '../firebase/firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';

class PushNotificationService {
  constructor() {
    this.messaging = null;
    this.vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
    this.listeners = new Set();
  }

  /**
   * Initialize Firebase Cloud Messaging
   */
  async initialize() {
    try {
      if (!('Notification' in window)) {
        console.warn('This browser does not support notifications');
        return false;
      }

      this.messaging = getMessaging();
      return true;
    } catch (error) {
      console.error('Error initializing FCM:', error);
      return false;
    }
  }

  /**
   * Request notification permission from user
   */
  async requestPermission() {
    try {
      const permission = await Notification.requestPermission();
      console.log('Notification permission:', permission);
      
      if (permission === 'granted') {
        const token = await this.getDeviceToken();
        return { granted: true, token };
      }
      
      return { granted: false, token: null };
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return { granted: false, token: null };
    }
  }

  /**
   * Get device FCM token
   */
  async getDeviceToken() {
    try {
      if (!this.messaging) {
        await this.initialize();
      }

      const currentToken = await getToken(this.messaging, {
        vapidKey: this.vapidKey
      });

      if (currentToken) {
        console.log('FCM Token obtained:', currentToken.substring(0, 20) + '...');
        return currentToken;
      } else {
        console.log('No FCM token available');
        return null;
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  /**
   * Save FCM token to user profile
   */
  async saveTokenToUser(userId, token) {
    try {
      if (!userId || !token) return false;

      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        fcmTokens: arrayUnion(token),
        notificationsEnabled: true,
        lastTokenUpdate: new Date().toISOString()
      });

      console.log('FCM token saved to user profile');
      return true;
    } catch (error) {
      console.error('Error saving FCM token:', error);
      return false;
    }
  }

  /**
   * Listen for foreground messages
   */
  onForegroundMessage(callback) {
    if (!this.messaging) {
      console.warn('Messaging not initialized');
      return () => {};
    }

    const unsubscribe = onMessage(this.messaging, (payload) => {
      console.log('Foreground message received:', payload);
      
      const notification = {
        title: payload.notification?.title || 'New Notification',
        body: payload.notification?.body || '',
        icon: payload.notification?.icon || '/pwa-192x192.svg',
        badge: payload.notification?.badge || '/pwa-192x192.svg',
        data: payload.data || {},
        timestamp: new Date().toISOString()
      };

      // Call registered listeners
      this.listeners.forEach(listener => listener(notification));
      
      // Call the provided callback
      if (callback) callback(notification);

      // Show browser notification
      this.showNotification(notification);
    });

    return unsubscribe;
  }

  /**
   * Add notification listener
   */
  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Remove notification listener
   */
  removeListener(callback) {
    this.listeners.delete(callback);
  }

  /**
   * Show browser notification
   */
  async showNotification(notification) {
    try {
      if (!('Notification' in window)) return;
      
      if (Notification.permission === 'granted') {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(notification.title, {
          body: notification.body,
          icon: notification.icon,
          badge: notification.badge,
          data: notification.data,
          tag: notification.data?.id || Date.now().toString(),
          requireInteraction: false,
          vibrate: [200, 100, 200]
        });
      }
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }

  /**
   * Get notification permission status
   */
  getPermissionStatus() {
    if (!('Notification' in window)) {
      return 'unsupported';
    }
    return Notification.permission;
  }

  /**
   * Check if notifications are supported
   */
  isSupported() {
    return 'Notification' in window && 'serviceWorker' in navigator;
  }

  /**
   * Send test notification
   */
  async sendTestNotification() {
    const notification = {
      title: 'Test Notification',
      body: 'This is a test notification from FranchiseHub',
      icon: '/pwa-192x192.svg',
      data: { type: 'test' }
    };
    
    await this.showNotification(notification);
  }

  /**
   * Create notification templates
   */
  static createNotification(type, data) {
    const templates = {
      newLead: {
        title: '🎯 New Lead Received!',
        body: `${data.name} is interested in ${data.brandName}`,
        icon: '/pwa-192x192.svg',
        data: { 
          type: 'lead',
          leadId: data.leadId,
          brandId: data.brandId,
          url: `/admin/leads`
        }
      },
      chatMessage: {
        title: `💬 New message from ${data.senderName}`,
        body: data.message,
        icon: data.senderAvatar || '/pwa-192x192.svg',
        data: {
          type: 'chat',
          chatId: data.chatId,
          senderId: data.senderId,
          url: `/dashboard/chat/${data.chatId}`
        }
      },
      brandApproval: {
        title: '✅ Brand Profile Approved',
        body: `Your brand "${data.brandName}" has been approved and is now live!`,
        icon: '/pwa-192x192.svg',
        data: {
          type: 'approval',
          brandId: data.brandId,
          url: `/brands/${data.brandSlug}`
        }
      },
      brandUpdate: {
        title: '📢 Brand Update',
        body: data.message,
        icon: data.brandLogo || '/pwa-192x192.svg',
        data: {
          type: 'update',
          brandId: data.brandId,
          url: `/brands/${data.brandSlug}`
        }
      },
      systemAlert: {
        title: '⚠️ System Alert',
        body: data.message,
        icon: '/pwa-192x192.svg',
        data: {
          type: 'alert',
          severity: data.severity,
          url: data.url
        }
      }
    };

    return templates[type] || {
      title: 'FranchiseHub Notification',
      body: data.message || '',
      icon: '/pwa-192x192.svg',
      data
    };
  }
}

export default new PushNotificationService();
