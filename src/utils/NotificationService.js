import { db } from "../firebase/firebase";
import { 
  collection, 
  addDoc, 
  serverTimestamp,
  doc,
  getDoc 
} from "firebase/firestore";
import { emailService } from './emailService';
import { pushNotifications } from './pushNotifications';
import logger from './logger';

export class NotificationService {
  
  static async sendLeadNotification(brandOwnerId, leadData) {
    try {
      // Check if user exists before sending notification
      const userRef = doc(db, "users", brandOwnerId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        console.warn(`User ${brandOwnerId} not found, skipping notification`);
        return;
      }

      const userData = userSnap.data();

      const notificationData = {
        type: "new_lead",
        title: "New Franchise Inquiry",
        message: `${leadData.firstName} ${leadData.lastName} is interested in your ${leadData.brandName} franchise`,
        leadId: leadData.id || null,
        brandName: leadData.brandName,
        prospectName: `${leadData.firstName} ${leadData.lastName}`,
        prospectEmail: leadData.email,
        budget: leadData.budget,
        location: leadData.userAddress?.city || leadData.brandFranchiseLocation?.city || "Not specified",
        read: false,
        createdAt: serverTimestamp(),
      };

      // Save to Firestore
      await addDoc(
        collection(db, "users", brandOwnerId, "notifications"), 
        notificationData
      );

      console.log(`✅ Lead notification sent to user ${brandOwnerId}`);

      // Get user notification preferences
      const settings = this.getUserSettings(brandOwnerId);

      // Send email notification if enabled
      if (settings.email.newLeads && userData.email) {
        try {
          await emailService.sendNewLeadEmail(userData.email, {
            ...leadData,
            brandOwnerName: userData.firstName || userData.displayName || 'Brand Owner',
            location: leadData.userAddress?.city || leadData.brandFranchiseLocation?.city || "Not specified",
          });
          logger.log('✅ Email notification sent');
        } catch (error) {
          logger.error('Failed to send email notification:', error);
        }
      }

      // Send push notification if enabled and permission granted
      if (settings.push.newLeads && pushNotifications.getPermissionStatus() === 'granted') {
        try {
          await pushNotifications.notifyNewLead(leadData);
          logger.log('✅ Push notification sent');
        } catch (error) {
          logger.error('Failed to send push notification:', error);
        }
      } else if (settings.push.newLeads && pushNotifications.getPermissionStatus() !== 'granted') {
        logger.warn('⚠️ Push notifications enabled but permission not granted');
      }
    } catch (error) {
      console.error("❌ Error sending lead notification:", error);
      // Don't throw error to avoid breaking the lead creation process
    }
  }

  static async sendBrandApprovalNotification(brandOwnerId, brandData, approved = true) {
    try {
      const userRef = doc(db, "users", brandOwnerId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        console.warn(`User ${brandOwnerId} not found, skipping notification`);
        return;
      }

      const userData = userSnap.data();

      const notificationData = {
        type: approved ? "brand_approved" : "brand_rejected",
        title: approved ? "Brand Approved!" : "Brand Submission Needs Review",
        message: approved 
          ? `Congratulations! Your ${brandData.brandName} franchise has been approved and is now live on the platform.`
          : `Your ${brandData.brandName} franchise submission requires additional information. Please contact support.`,
        brandId: brandData.id,
        brandName: brandData.brandName,
        read: false,
        createdAt: serverTimestamp(),
      };

      // Save to Firestore
      await addDoc(
        collection(db, "users", brandOwnerId, "notifications"), 
        notificationData
      );

      console.log(`✅ Brand ${approved ? 'approval' : 'rejection'} notification sent to user ${brandOwnerId}`);

      // Get user notification preferences
      const settings = this.getUserSettings(brandOwnerId);

      // Send email notification if enabled
      if (settings.email.brandApproval && userData.email) {
        try {
          await emailService.sendBrandStatusEmail(
            userData.email,
            {
              ...brandData,
              ownerName: userData.firstName || userData.displayName || 'Brand Owner',
            },
            approved
          );
          logger.log('✅ Email notification sent');
        } catch (error) {
          logger.error('Failed to send email notification:', error);
        }
      }

      // Send push notification if enabled and permission granted
      if (settings.push.brandApproval && pushNotifications.getPermissionStatus() === 'granted') {
        try {
          await pushNotifications.notifyBrandApproval(brandData, approved);
          logger.log('✅ Push notification sent');
        } catch (error) {
          logger.error('Failed to send push notification:', error);
        }
      } else if (settings.push.brandApproval && pushNotifications.getPermissionStatus() !== 'granted') {
        logger.warn('⚠️ Push notifications enabled but permission not granted');
      }
    } catch (error) {
      console.error("❌ Error sending brand notification:", error);
    }
  }

  static async sendAdminNotification(message, data = {}) {
    try {
      // For now, we'll use a hardcoded admin list
      // In production, this should be configurable
      const ADMIN_UIDS = import.meta.env.VITE_ADMIN_UIDS?.split(',') || [];
      
      if (ADMIN_UIDS.length === 0) {
        console.warn("No admin UIDs configured, skipping admin notification");
      } else {
        const notificationPromises = ADMIN_UIDS.map(async (adminUid) => {
          const notificationData = {
            type: "admin_alert",
            title: "New Activity",
            message: message,
            ...data,
            read: false,
            createdAt: serverTimestamp(),
          };

          return addDoc(
            collection(db, "users", adminUid.trim(), "notifications"), 
            notificationData
          );
        });

        await Promise.all(notificationPromises);
        console.log(`✅ Admin notifications sent to ${ADMIN_UIDS.length} admins`);
      }

      // Send email notification for brand submissions
      if (data.type === 'brand_submission' && data.submittedBy) {
        try {
          // Send confirmation email to brand owner
          const userRef = doc(db, "users", data.userId);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const userData = userSnap.data();
            await emailService.sendBrandRegistrationEmail(userData.email, {
              ownerName: userData.firstName || userData.displayName || 'Brand Owner',
              brandName: data.brandName,
              businessModel: data.businessModel,
              industries: data.industries,
              investmentRange: data.investmentRange,
            });
            logger.log('✅ Brand registration confirmation email sent');
          }
        } catch (emailError) {
          logger.error('Failed to send brand registration email:', emailError);
          // Don't throw - email failure shouldn't break the notification
        }
      }
    } catch (error) {
      console.error("❌ Error sending admin notification:", error);
    }
  }

  /**
   * Get user notification settings from localStorage
   */
  static getUserSettings(userId) {
    try {
      const settingsKey = `notification_settings_${userId}`;
      const saved = localStorage.getItem(settingsKey);
      
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      logger.error('Failed to get user settings:', error);
    }

    // Return default settings
    return {
      email: {
        newLeads: true,
        brandApproval: true,
        savedSearchAlerts: true,
        inquiryResponses: true,
        weeklyDigest: false,
        marketingEmails: false,
      },
      push: {
        enabled: false,
        newLeads: true,
        brandApproval: true,
        savedSearchAlerts: true,
        chatMessages: true,
      },
    };
  }

  /**
   * Save user notification settings
   */
  static saveUserSettings(userId, settings) {
    try {
      const settingsKey = `notification_settings_${userId}`;
      localStorage.setItem(settingsKey, JSON.stringify(settings));
      logger.log('User notification settings saved');
    } catch (error) {
      logger.error('Failed to save user settings:', error);
    }
  }
}

export default NotificationService;