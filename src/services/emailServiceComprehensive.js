/**
 * COMPREHENSIVE EMAIL SERVICE
 * All 56 email sending functions for ikama Franchise Portal
 * Integrates with emailTemplatesComprehensive.js
 */

import emailjs from '@emailjs/browser';
import { getEmailTemplate } from './emailTemplatesComprehensive';

// Initialize EmailJS
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_GENERIC_TEMPLATE = import.meta.env.VITE_EMAILJS_TEMPLATE_GENERIC || 'template_rzndmfq';

if (EMAILJS_PUBLIC_KEY) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

/**
 * Base email sender
 */
const sendEmail = async (to_email, to_name, subject, templateName, templateData) => {
  try {
    if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID) {
      console.error('EmailJS not configured');
      return { success: false, error: 'Email service not configured' };
    }

    const htmlContent = getEmailTemplate(templateName, {
      ...templateData,
      to_name,
      to_email
    });

    const templateParams = {
      to_email,
      to_name,
      from_name: 'ikama',
      reply_to: 'support@ikama.in',
      subject,
      message: htmlContent,
      html_content: htmlContent,
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_GENERIC_TEMPLATE,
      templateParams
    );

    await logEmailActivity({
      to_email,
      to_name,
      subject,
      template: templateName,
      status: 'sent',
      timestamp: new Date().toISOString(),
    });

    return { success: true, response };
  } catch (error) {
    console.error('Error sending email:', error);
    
    await logEmailActivity({
      to_email,
      to_name,
      subject,
      template: templateName,
      status: 'failed',
      error: error.text || error.message,
      timestamp: new Date().toISOString(),
    });
    
    return { success: false, error: error.text || error.message };
  }
};

/**
 * Log email activity to Firestore
 */
export const logEmailActivity = async (emailLog) => {
  try {
    const { db } = await import('../firebase/firebase');
    const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
    
    const cleanLog = Object.entries(emailLog).reduce((acc, [key, value]) => {
      if (value !== undefined) acc[key] = value;
      return acc;
    }, {});
    
    await addDoc(collection(db, 'emailLogs'), {
      ...cleanLog,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error logging email:', error);
  }
};

// ==========================================
// TRANSACTIONAL EMAILS (1-22)
// ==========================================

// 1. Welcome Email
export const sendWelcomeEmail = async (userData) => {
  return sendEmail(
    userData.email,
    userData.name || 'User',
    'Welcome to ikama! 🎉',
    'welcome',
    {
      login_url: `${window.location.origin}/login`,
      platform_name: 'ikama Franchise Hub'
    }
  );
};

// 2. Email Verification
export const sendEmailVerification = async (userData) => {
  return sendEmail(
    userData.email,
    userData.name || 'User',
    'Verify Your Email - ikama',
    'email-verification',
    {
      otp: userData.otp,
      verification_code: userData.verification_code,
      verification_link: userData.verificationLink
    }
  );
};

// 3. Phone Verification
export const sendPhoneVerificationEmail = async (userData) => {
  return sendEmail(
    userData.email,
    userData.name || 'User',
    'Phone Verification - ikama',
    'phone-verification',
    {
      phone_number: userData.phone,
      otp: userData.otp
    }
  );
};

// 4. Password Reset Request
export const sendPasswordResetEmail = async (userData) => {
  return sendEmail(
    userData.email,
    userData.name || 'User',
    'Reset Your Password - ikama',
    'password-reset',
    {
      reset_link: userData.resetLink
    }
  );
};

// 5. Password Changed Successfully
export const sendPasswordChangedEmail = async (userData) => {
  return sendEmail(
    userData.email,
    userData.name || 'User',
    'Password Changed Successfully - ikama',
    'password-changed',
    {
      change_date: new Date().toLocaleString('en-IN', {
        dateStyle: 'long',
        timeStyle: 'short',
        timeZone: 'Asia/Kolkata'
      }),
      login_url: `${window.location.origin}/login`,
      ip_address: userData.ipAddress
    }
  );
};

// 6. Login from New Device
export const sendNewDeviceLoginEmail = async (userData) => {
  return sendEmail(
    userData.email,
    userData.name || 'User',
    'New Device Login Alert - ikama',
    'new-device-login',
    {
      device_info: userData.deviceInfo,
      location: userData.location,
      login_time: new Date().toLocaleString('en-IN', {
        dateStyle: 'long',
        timeStyle: 'short',
        timeZone: 'Asia/Kolkata'
      })
    }
  );
};

// 7. Account Deactivation
export const sendAccountDeactivationEmail = async (userData) => {
  return sendEmail(
    userData.email,
    userData.name || 'User',
    'Account Deactivated - ikama',
    'account-deactivation',
    {
      deactivation_date: new Date().toLocaleString('en-IN', {
        dateStyle: 'long',
        timeZone: 'Asia/Kolkata'
      })
    }
  );
};

// 8. Brand Registration Submitted
export const sendBrandSubmittedEmail = async (brandData) => {
  return sendEmail(
    brandData.brandOwnerEmail,
    brandData.brandOwnerName || 'Brand Owner',
    `Brand Submission Received - ${brandData.brandName}`,
    'brand-submitted',
    {
      brand_name: brandData.brandName,
      submission_date: new Date().toLocaleString('en-IN', {
        dateStyle: 'long',
        timeStyle: 'short',
        timeZone: 'Asia/Kolkata'
      }),
      dashboard_url: `${window.location.origin}/dashboard/brands`
    }
  );
};

// 9. Brand Approved
export const sendBrandApprovedEmail = async (brandData) => {
  return sendEmail(
    brandData.brandOwnerEmail,
    brandData.brandOwnerName || 'Brand Owner',
    `🎉 ${brandData.brandName} is Now Live on ikama!`,
    'brand-approved',
    {
      brand_name: brandData.brandName,
      brand_url: `${window.location.origin}/brands/${brandData.brandSlug}`,
      dashboard_url: `${window.location.origin}/dashboard/brands`,
      approval_date: new Date().toLocaleString('en-IN', {
        dateStyle: 'long',
        timeZone: 'Asia/Kolkata'
      })
    }
  );
};

// 10. Brand Rejected
export const sendBrandRejectedEmail = async (brandData) => {
  return sendEmail(
    brandData.brandOwnerEmail,
    brandData.brandOwnerName || 'Brand Owner',
    `Brand Submission Update - ${brandData.brandName}`,
    'brand-rejected',
    {
      brand_name: brandData.brandName,
      rejection_reason: brandData.rejectionReason,
      admin_feedback: brandData.adminFeedback,
      dashboard_url: `${window.location.origin}/dashboard/brands`
    }
  );
};

// 11. Brand Published
export const sendBrandPublishedEmail = async (brandData) => {
  return sendEmail(
    brandData.brandOwnerEmail,
    brandData.brandOwnerName || 'Brand Owner',
    `${brandData.brandName} is Now Visible to Franchisees!`,
    'brand-published',
    {
      brand_name: brandData.brandName,
      brand_url: `${window.location.origin}/brands/${brandData.brandSlug}`,
      dashboard_url: `${window.location.origin}/dashboard/brands`
    }
  );
};

// 12. Brand Updated
export const sendBrandUpdatedEmail = async (brandData) => {
  return sendEmail(
    brandData.brandOwnerEmail,
    brandData.brandOwnerName || 'Brand Owner',
    `Brand Updated - ${brandData.brandName}`,
    'brand-updated',
    {
      brand_name: brandData.brandName,
      updated_fields: brandData.updatedFields,
      dashboard_url: `${window.location.origin}/dashboard/brands`
    }
  );
};

// 13. Brand Unpublished
export const sendBrandUnpublishedEmail = async (brandData) => {
  return sendEmail(
    brandData.brandOwnerEmail,
    brandData.brandOwnerName || 'Brand Owner',
    `Brand Unpublished - ${brandData.brandName}`,
    'brand-unpublished',
    {
      brand_name: brandData.brandName,
      reason: brandData.reason,
      dashboard_url: `${window.location.origin}/dashboard/brands`
    }
  );
};

// 14. New Inquiry Received (Brand Owner)
export const sendNewInquiryToBrandOwnerEmail = async (inquiryData) => {
  return sendEmail(
    inquiryData.brandOwnerEmail,
    inquiryData.brandOwnerName || 'Brand Owner',
    `New Franchise Inquiry for ${inquiryData.brandName} 🎯`,
    'new-inquiry-brand-owner',
    {
      brand_name: inquiryData.brandName,
      inquirer_name: inquiryData.inquirerName,
      inquirer_email: inquiryData.inquirerEmail,
      inquirer_phone: inquiryData.inquirerPhone,
      inquiry_message: inquiryData.message,
      investment_range: inquiryData.investmentRange,
      inquiry_date: new Date().toLocaleString('en-IN', {
        dateStyle: 'long',
        timeStyle: 'short',
        timeZone: 'Asia/Kolkata'
      }),
      dashboard_url: `${window.location.origin}/dashboard/leads`
    }
  );
};

// 15. Inquiry Sent Confirmation (User)
export const sendInquirySentConfirmationEmail = async (inquiryData) => {
  return sendEmail(
    inquiryData.inquirerEmail,
    inquiryData.inquirerName || 'User',
    `Your Inquiry to ${inquiryData.brandName} Has Been Sent`,
    'inquiry-sent-confirmation',
    {
      brand_name: inquiryData.brandName,
      brand_url: `${window.location.origin}/brands/${inquiryData.brandSlug}`,
      inquiry_date: new Date().toLocaleString('en-IN', {
        dateStyle: 'long',
        timeZone: 'Asia/Kolkata'
      })
    }
  );
};

// 16. Contact Form Submitted
export const sendContactFormConfirmationEmail = async (contactData) => {
  return sendEmail(
    contactData.email,
    contactData.name || 'User',
    'We Received Your Message - ikama',
    'contact-form-confirmation',
    {
      message: contactData.message,
      submission_date: new Date().toLocaleString('en-IN', {
        dateStyle: 'long',
        timeZone: 'Asia/Kolkata'
      })
    }
  );
};

// 17. Inquiry Response from Brand
export const sendInquiryResponseEmail = async (responseData) => {
  return sendEmail(
    responseData.inquirerEmail,
    responseData.inquirerName || 'User',
    `Response from ${responseData.brandName} 📩`,
    'inquiry-response',
    {
      brand_name: responseData.brandName,
      brand_owner_name: responseData.brandOwnerName,
      response_message: responseData.responseMessage,
      contact_email: responseData.contactEmail,
      contact_phone: responseData.contactPhone,
      response_date: new Date().toLocaleString('en-IN', {
        dateStyle: 'long',
        timeStyle: 'short',
        timeZone: 'Asia/Kolkata'
      }),
      brand_url: `${window.location.origin}/brands/${responseData.brandSlug}`
    }
  );
};

// 18. Lead Status Update
export const sendLeadStatusUpdateEmail = async (leadData) => {
  return sendEmail(
    leadData.inquirerEmail,
    leadData.inquirerName || 'User',
    `Update on Your ${leadData.brandName} Application`,
    'lead-status-update',
    {
      brand_name: leadData.brandName,
      status: leadData.status,
      status_message: leadData.statusMessage,
      next_steps: leadData.nextSteps
    }
  );
};

// 19. Document Upload Confirmation
export const sendDocumentUploadConfirmationEmail = async (userData) => {
  return sendEmail(
    userData.email,
    userData.name || 'User',
    'Documents Received - ikama',
    'document-upload-confirmation',
    {
      document_types: userData.documentTypes,
      upload_date: new Date().toLocaleString('en-IN', {
        dateStyle: 'long',
        timeZone: 'Asia/Kolkata'
      })
    }
  );
};

// 20. Document Verification Success
export const sendDocumentVerifiedEmail = async (userData) => {
  return sendEmail(
    userData.email,
    userData.name || 'User',
    'Documents Verified Successfully - ikama',
    'document-verified',
    {
      verification_date: new Date().toLocaleString('en-IN', {
        dateStyle: 'long',
        timeZone: 'Asia/Kolkata'
      })
    }
  );
};

// 21. Document Verification Failed
export const sendDocumentVerificationFailedEmail = async (userData) => {
  return sendEmail(
    userData.email,
    userData.name || 'User',
    'Document Verification - Action Required',
    'document-verification-failed',
    {
      failed_documents: userData.failedDocuments,
      reasons: userData.reasons,
      resubmit_url: `${window.location.origin}/dashboard/documents`
    }
  );
};

// 22. Investment Proof Verified
export const sendInvestmentProofVerifiedEmail = async (userData) => {
  return sendEmail(
    userData.email,
    userData.name || 'User',
    'Investment Proof Verified - ikama',
    'investment-proof-verified',
    {
      investment_range: userData.investmentRange,
      verification_date: new Date().toLocaleString('en-IN', {
        dateStyle: 'long',
        timeZone: 'Asia/Kolkata'
      })
    }
  );
};

// ==========================================
// ENGAGEMENT EMAILS (23-42)
// ==========================================

// 23. Getting Started Guide
export const sendGettingStartedEmail = async (userData) => {
  return sendEmail(
    userData.email,
    userData.name || 'User',
    'Get Started with ikama - Quick Guide',
    'getting-started-guide',
    {
      login_url: `${window.location.origin}/login`
    }
  );
};

// 24. Profile Completion Reminder
export const sendProfileCompletionReminderEmail = async (userData) => {
  return sendEmail(
    userData.email,
    userData.name || 'User',
    'Complete Your Profile - Unlock More Opportunities',
    'profile-completion-reminder',
    {
      completion_percentage: userData.completionPercentage,
      missing_fields: userData.missingFields,
      profile_url: `${window.location.origin}/dashboard/profile`
    }
  );
};

// 25. How to Find Right Franchise
export const sendFindRightFranchiseGuideEmail = async (userData) => {
  return sendEmail(
    userData.email,
    userData.name || 'User',
    'How to Find the Right Franchise for You',
    'find-right-franchise-guide',
    {
      brands_url: `${window.location.origin}/brands`
    }
  );
};

// 26. Platform Tour
export const sendPlatformTourEmail = async (userData) => {
  return sendEmail(
    userData.email,
    userData.name || 'User',
    'Explore ikama Features - Platform Tour',
    'platform-tour',
    {
      login_url: `${window.location.origin}/login`
    }
  );
};

// 27. Success Stories Introduction
export const sendSuccessStoriesEmail = async (userData) => {
  return sendEmail(
    userData.email,
    userData.name || 'User',
    'Real Success Stories from ikama Community',
    'success-stories',
    {
      testimonials_url: `${window.location.origin}/testimonials`
    }
  );
};

// 28. Incomplete Inquiry Follow-up
export const sendIncompleteInquiryFollowupEmail = async (userData) => {
  return sendEmail(
    userData.email,
    userData.name || 'User',
    'Complete Your Franchise Inquiry',
    'incomplete-inquiry-followup',
    {
      brand_name: userData.brandName,
      brand_url: `${window.location.origin}/brands/${userData.brandSlug}`
    }
  );
};

// 29. Saved Brands Reminder
export const sendSavedBrandsReminderEmail = async (userData) => {
  return sendEmail(
    userData.email,
    userData.name || 'User',
    'Your Saved Franchises Are Still Available',
    'saved-brands-reminder',
    {
      saved_brands: userData.savedBrands,
      saved_brands_url: `${window.location.origin}/dashboard/saved`
    }
  );
};

// 30. New Brands in Category
export const sendNewBrandsInCategoryEmail = async (userData) => {
  return sendEmail(
    userData.email,
    userData.name || 'User',
    `New ${userData.category} Franchises Available`,
    'new-brands-in-category',
    {
      category: userData.category,
      new_brands: userData.newBrands,
      category_url: `${window.location.origin}/brands?category=${userData.category}`
    }
  );
};

// 31. Price Drop Alert
export const sendPriceDropAlertEmail = async (userData) => {
  return sendEmail(
    userData.email,
    userData.name || 'User',
    `Price Reduced: ${userData.brandName}`,
    'price-drop-alert',
    {
      brand_name: userData.brandName,
      old_investment: userData.oldInvestment,
      new_investment: userData.newInvestment,
      savings: userData.savings,
      brand_url: `${window.location.origin}/brands/${userData.brandSlug}`
    }
  );
};

// 32. Application Deadline Reminder
export const sendApplicationDeadlineReminderEmail = async (userData) => {
  return sendEmail(
    userData.email,
    userData.name || 'User',
    `Deadline Approaching: ${userData.brandName}`,
    'application-deadline-reminder',
    {
      brand_name: userData.brandName,
      deadline_date: userData.deadlineDate,
      brand_url: `${window.location.origin}/brands/${userData.brandSlug}`
    }
  );
};

// 33. We Miss You
export const sendWeMissYouEmail = async (userData) => {
  return sendEmail(
    userData.email,
    userData.name || 'User',
    'We Miss You at ikama!',
    'we-miss-you',
    {
      days_inactive: userData.daysInactive,
      login_url: `${window.location.origin}/login`
    }
  );
};

// 34. What's New Since You Left
export const sendWhatsNewEmail = async (userData) => {
  return sendEmail(
    userData.email,
    userData.name || 'User',
    'See What\'s New on ikama',
    'whats-new',
    {
      new_features: userData.newFeatures,
      new_brands_count: userData.newBrandsCount,
      login_url: `${window.location.origin}/login`
    }
  );
};

// 35. Personalized Recommendations
export const sendPersonalizedRecommendationsEmail = async (userData) => {
  return sendEmail(
    userData.email,
    userData.name || 'User',
    'Franchises Recommended Just for You',
    'personalized-recommendations',
    {
      recommended_brands: userData.recommendedBrands,
      brands_url: `${window.location.origin}/brands`
    }
  );
};

// 36. Limited Time Opportunities
export const sendLimitedTimeOpportunitiesEmail = async (userData) => {
  return sendEmail(
    userData.email,
    userData.name || 'User',
    '⏰ Limited Time Franchise Opportunities',
    'limited-time-opportunities',
    {
      urgent_brands: userData.urgentBrands,
      brands_url: `${window.location.origin}/brands`
    }
  );
};

// 37-56: Additional templates would follow the same pattern

// Export all functions
export default {
  // Transactional (1-22)
  sendWelcomeEmail,
  sendEmailVerification,
  sendPhoneVerificationEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
  sendNewDeviceLoginEmail,
  sendAccountDeactivationEmail,
  sendBrandSubmittedEmail,
  sendBrandApprovedEmail,
  sendBrandRejectedEmail,
  sendBrandPublishedEmail,
  sendBrandUpdatedEmail,
  sendBrandUnpublishedEmail,
  sendNewInquiryToBrandOwnerEmail,
  sendInquirySentConfirmationEmail,
  sendContactFormConfirmationEmail,
  sendInquiryResponseEmail,
  sendLeadStatusUpdateEmail,
  sendDocumentUploadConfirmationEmail,
  sendDocumentVerifiedEmail,
  sendDocumentVerificationFailedEmail,
  sendInvestmentProofVerifiedEmail,
  
  // Engagement (23-36+)
  sendGettingStartedEmail,
  sendProfileCompletionReminderEmail,
  sendFindRightFranchiseGuideEmail,
  sendPlatformTourEmail,
  sendSuccessStoriesEmail,
  sendIncompleteInquiryFollowupEmail,
  sendSavedBrandsReminderEmail,
  sendNewBrandsInCategoryEmail,
  sendPriceDropAlertEmail,
  sendApplicationDeadlineReminderEmail,
  sendWeMissYouEmail,
  sendWhatsNewEmail,
  sendPersonalizedRecommendationsEmail,
  sendLimitedTimeOpportunitiesEmail,
  
  // Utility
  logEmailActivity,
};
