import { 
  sendGettingStartedEmail,
  sendProfileCompletionReminderEmail,
  sendSavedBrandsReminderEmail,
  sendWeMissYouEmail,
  sendPersonalizedRecommendationsEmail 
} from './emailServiceNew';
import { db } from '../firebase/firebase';
import { collection, query, where, getDocs, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import logger from '../utils/logger';

/**
 * Engagement Email Service
 * Handles time-based engagement emails to improve user retention
 * 
 * NOTE: This service provides the functions for engagement emails.
 * For production, these should be triggered by:
 * 1. Firebase Cloud Functions with scheduled triggers
 * 2. Cron jobs on a backend server
 * 3. Third-party services like Zapier or n8n
 */

class EngagementEmailService {
  
  /**
   * Send Getting Started email to new users (24 hours after signup)
   */
  async sendGettingStartedEmails() {
    try {
      const yesterday = new Date();
      yesterday.setHours(yesterday.getHours() - 24);
      
      // Get users who signed up ~24 hours ago and haven't received getting started email
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        where('createdAt', '>=', yesterday),
        where('createdAt', '<=', new Date(yesterday.getTime() + 3600000)) // 1 hour window
      );
      
      const snapshot = await getDocs(q);
      const emailsSent = [];
      
      for (const userDoc of snapshot.docs) {
        const userData = userDoc.data();
        
        // Skip if user already received getting started email
        if (userData.emails?.gettingStarted) {
          continue;
        }
        
        // Skip if no email
        if (!userData.email) {
          continue;
        }
        
        try {
          await sendGettingStartedEmail({
            email: userData.email,
            name: userData.displayName || 'User'
          });
          
          // Mark as sent
          await setDoc(doc(db, 'users', userDoc.id), {
            emails: {
              ...userData.emails,
              gettingStarted: {
                sent: true,
                sentAt: serverTimestamp()
              }
            }
          }, { merge: true });
          
          emailsSent.push(userData.email);
          logger.info('Getting started email sent to:', userData.email);
          
        } catch (emailError) {
          logger.error('Failed to send getting started email to:', userData.email, emailError);
        }
      }
      
      return { 
        success: true, 
        message: `Getting started emails sent to ${emailsSent.length} users`,
        emailsSent 
      };
      
    } catch (error) {
      logger.error('Error in sendGettingStartedEmails:', error);
      throw error;
    }
  }
  
  /**
   * Send Profile Completion Reminders (for users with incomplete profiles)
   */
  async sendProfileCompletionReminders() {
    try {
      // Get users with incomplete profiles (< 80% complete)
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      const emailsSent = [];
      
      for (const userDoc of snapshot.docs) {
        const userData = userDoc.data();
        
        // Skip if no email
        if (!userData.email) {
          continue;
        }
        
        // Calculate profile completion
        const completionData = this.calculateProfileCompletion(userData);
        
        // Skip if profile is complete enough
        if (completionData.percentage >= 80) {
          continue;
        }
        
        // Skip if reminder sent recently (within 7 days)
        if (userData.emails?.profileCompletion?.sentAt) {
          const lastSent = userData.emails.profileCompletion.sentAt.toDate();
          const daysSinceLastSent = (Date.now() - lastSent.getTime()) / (1000 * 60 * 60 * 24);
          if (daysSinceLastSent < 7) {
            continue;
          }
        }
        
        try {
          await sendProfileCompletionReminderEmail({
            email: userData.email,
            name: userData.displayName || 'User',
            completionPercentage: completionData.percentage,
            missingFields: completionData.missingFields
          });
          
          // Mark as sent
          await setDoc(doc(db, 'users', userDoc.id), {
            emails: {
              ...userData.emails,
              profileCompletion: {
                sent: true,
                sentAt: serverTimestamp(),
                completionPercentage: completionData.percentage
              }
            }
          }, { merge: true });
          
          emailsSent.push(userData.email);
          logger.info('Profile completion reminder sent to:', userData.email);
          
        } catch (emailError) {
          logger.error('Failed to send profile completion email to:', userData.email, emailError);
        }
      }
      
      return { 
        success: true, 
        message: `Profile completion reminders sent to ${emailsSent.length} users`,
        emailsSent 
      };
      
    } catch (error) {
      logger.error('Error in sendProfileCompletionReminders:', error);
      throw error;
    }
  }
  
  /**
   * Send "We Miss You" emails (after 30 days of inactivity)
   */
  async sendWeMissYouEmails() {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      // Get users who haven't logged in for 30+ days
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        where('lastLogin', '<=', thirtyDaysAgo)
      );
      
      const snapshot = await getDocs(q);
      const emailsSent = [];
      
      for (const userDoc of snapshot.docs) {
        const userData = userDoc.data();
        
        // Skip if no email
        if (!userData.email) {
          continue;
        }
        
        // Skip if "we miss you" email sent recently (within 30 days)
        if (userData.emails?.weMissYou?.sentAt) {
          const lastSent = userData.emails.weMissYou.sentAt.toDate();
          const daysSinceLastSent = (Date.now() - lastSent.getTime()) / (1000 * 60 * 60 * 24);
          if (daysSinceLastSent < 30) {
            continue;
          }
        }
        
        try {
          await sendWeMissYouEmail({
            email: userData.email,
            name: userData.displayName || 'User',
            lastLoginDate: userData.lastLogin?.toDate()?.toLocaleDateString('en-IN') || 'a while ago'
          });
          
          // Mark as sent
          await setDoc(doc(db, 'users', userDoc.id), {
            emails: {
              ...userData.emails,
              weMissYou: {
                sent: true,
                sentAt: serverTimestamp()
              }
            }
          }, { merge: true });
          
          emailsSent.push(userData.email);
          logger.info('We miss you email sent to:', userData.email);
          
        } catch (emailError) {
          logger.error('Failed to send we miss you email to:', userData.email, emailError);
        }
      }
      
      return { 
        success: true, 
        message: `We miss you emails sent to ${emailsSent.length} users`,
        emailsSent 
      };
      
    } catch (error) {
      logger.error('Error in sendWeMissYouEmails:', error);
      throw error;
    }
  }
  
  /**
   * Calculate profile completion percentage
   */
  calculateProfileCompletion(userData) {
    const fields = [
      { name: 'Display Name', value: userData.displayName },
      { name: 'Email', value: userData.email },
      { name: 'Phone Number', value: userData.phoneNumber },
      { name: 'Profile Photo', value: userData.photoURL },
      { name: 'Email Verification', value: userData.emailVerified },
    ];
    
    const completedFields = fields.filter(field => 
      field.value && field.value !== '' && field.value !== false
    );
    
    const percentage = Math.round((completedFields.length / fields.length) * 100);
    const missingFields = fields
      .filter(field => !field.value || field.value === '' || field.value === false)
      .map(field => field.name);
    
    return { percentage, missingFields, completedFields: completedFields.length, totalFields: fields.length };
  }
  
  /**
   * Send all engagement emails (for manual triggering or testing)
   */
  async sendAllEngagementEmails() {
    try {
      logger.info('Starting engagement email batch...');
      
      const results = {
        gettingStarted: await this.sendGettingStartedEmails(),
        profileCompletion: await this.sendProfileCompletionReminders(),
        weMissYou: await this.sendWeMissYouEmails()
      };
      
      const totalEmailsSent = 
        results.gettingStarted.emailsSent.length +
        results.profileCompletion.emailsSent.length +
        results.weMissYou.emailsSent.length;
      
      logger.info('Engagement email batch completed. Total emails sent:', totalEmailsSent);
      
      return {
        success: true,
        message: `Engagement email batch completed. Total emails sent: ${totalEmailsSent}`,
        results
      };
      
    } catch (error) {
      logger.error('Error in sendAllEngagementEmails:', error);
      throw error;
    }
  }
  
  /**
   * Test engagement emails with a specific user email
   */
  async testEngagementEmail(emailType, testEmail, testName = 'Test User') {
    try {
      let result;
      
      switch (emailType) {
        case 'getting-started':
          result = await sendGettingStartedEmail({
            email: testEmail,
            name: testName
          });
          break;
          
        case 'profile-completion':
          result = await sendProfileCompletionReminderEmail({
            email: testEmail,
            name: testName,
            completionPercentage: 65,
            missingFields: ['Phone Number', 'Profile Photo', 'Email Verification']
          });
          break;
          
        case 'we-miss-you':
          result = await sendWeMissYouEmail({
            email: testEmail,
            name: testName,
            lastLoginDate: '15 October 2025'
          });
          break;
          
        case 'recommendations':
          result = await sendPersonalizedRecommendationsEmail({
            email: testEmail,
            name: testName,
            recommendations: [
              { brandName: 'Coffee Shop Franchise', category: 'Food & Beverage', investment: '₹10L - ₹25L' },
              { brandName: 'Fitness Center', category: 'Health & Fitness', investment: '₹25L - ₹50L' }
            ]
          });
          break;
          
        default:
          throw new Error(`Unknown email type: ${emailType}`);
      }
      
      logger.info(`Test ${emailType} email sent to:`, testEmail);
      return { success: true, message: `Test ${emailType} email sent successfully!`, result };
      
    } catch (error) {
      logger.error(`Error sending test ${emailType} email:`, error);
      throw error;
    }
  }
}

// Export singleton instance
const engagementEmailService = new EngagementEmailService();
export default engagementEmailService;

/**
 * PRODUCTION SETUP NOTES:
 * 
 * To automate these emails in production, you can use:
 * 
 * 1. Firebase Cloud Functions (Recommended):
 *    - Create scheduled functions that run daily
 *    - Use Firebase Functions cron triggers
 *    - Example: exports.dailyEngagementEmails = functions.pubsub.schedule('0 9 * * *').onRun(...)
 * 
 * 2. Vercel Cron Jobs:
 *    - Add API routes in /api/cron/
 *    - Configure vercel.json with cron schedules
 * 
 * 3. External Cron Service:
 *    - Use services like cron-job.org or EasyCron
 *    - Hit your API endpoints on schedule
 * 
 * 4. GitHub Actions:
 *    - Use scheduled workflows
 *    - Run engagement email scripts
 * 
 * Example daily schedule:
 * - 9 AM: Getting Started emails (24h after signup)
 * - 2 PM: Profile completion reminders
 * - 6 PM: We miss you emails (monthly)
 */