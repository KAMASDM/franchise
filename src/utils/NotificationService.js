import { db } from "../firebase/firebase";
import { 
  collection, 
  addDoc, 
  serverTimestamp,
  doc,
  getDoc 
} from "firebase/firestore";

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

      await addDoc(
        collection(db, "users", brandOwnerId, "notifications"), 
        notificationData
      );

      console.log(`✅ Lead notification sent to user ${brandOwnerId}`);
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

      await addDoc(
        collection(db, "users", brandOwnerId, "notifications"), 
        notificationData
      );

      console.log(`✅ Brand ${approved ? 'approval' : 'rejection'} notification sent to user ${brandOwnerId}`);
    } catch (error) {
      console.error("❌ Error sending brand notification:", error);
    }
  }

  static async sendAdminNotification(message, data = {}) {
    try {
      // For now, we'll use a hardcoded admin list
      // In production, this should be configurable
      const ADMIN_UIDS = process.env.REACT_APP_ADMIN_UIDS?.split(',') || [];
      
      if (ADMIN_UIDS.length === 0) {
        console.warn("No admin UIDs configured, skipping admin notification");
        return;
      }

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
    } catch (error) {
      console.error("❌ Error sending admin notification:", error);
    }
  }
}

export default NotificationService;