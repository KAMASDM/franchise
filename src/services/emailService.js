import emailjs from '@emailjs/browser';

/**
 * Email Service using EmailJS
 * Handles all email notifications for the franchise portal
 */

// Initialize EmailJS with public key
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;

// Template IDs
const TEMPLATES = {
  WELCOME: import.meta.env.VITE_EMAILJS_TEMPLATE_WELCOME, // template_0jjs1wi
  NEW_LEAD_INQUIRY: import.meta.env.VITE_EMAILJS_TEMPLATE_NEW_LEAD_INQUIRY, // template_3vnz7mu
  BRAND_STATUS_UPDATE: import.meta.env.VITE_EMAILJS_TEMPLATE_BRAND_STATUS_UPDATE, // template_ak6j2k4
  BRAND_OWNER_RESPONSE: import.meta.env.VITE_EMAILJS_TEMPLATE_BRAND_OWNER_RESPONSE, // template_othz9ot
};

// Initialize EmailJS
if (EMAILJS_PUBLIC_KEY) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

/**
 * Base function to send email
 * @param {string} templateId - EmailJS template ID
 * @param {object} templateParams - Parameters for the email template
 * @returns {Promise} EmailJS response
 */
const sendEmail = async (templateId, templateParams) => {
  try {
    if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID) {
      console.error('EmailJS not configured. Missing public key or service ID.');
      return { success: false, error: 'Email service not configured' };
    }

    if (!templateId) {
      console.error('Template ID is required');
      return { success: false, error: 'Template ID missing' };
    }

    console.log(`Sending email with template: ${templateId}`, templateParams);

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      templateId,
      templateParams
    );

    console.log('Email sent successfully:', response);
    return { success: true, response };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message || 'Failed to send email' };
  }
};

/**
 * Send welcome email to new user
 * @param {object} userData - User information
 * @param {string} userData.email - User's email
 * @param {string} userData.name - User's name
 */
export const sendWelcomeEmail = async (userData) => {
  const templateParams = {
    to_email: userData.email,
    to_name: userData.name || 'User',
    user_name: userData.name || 'User',
    platform_name: 'ikama Franchise Portal',
    login_url: `${window.location.origin}/login`,
    support_email: 'support@ikama.in',
  };

  return sendEmail(TEMPLATES.WELCOME, templateParams);
};

/**
 * Send new lead inquiry notification to brand owner
 * @param {object} leadData - Lead inquiry information
 * @param {string} leadData.brandOwnerEmail - Brand owner's email
 * @param {string} leadData.brandOwnerName - Brand owner's name
 * @param {string} leadData.brandName - Brand name
 * @param {string} leadData.inquirerName - Person inquiring
 * @param {string} leadData.inquirerEmail - Inquirer's email
 * @param {string} leadData.inquirerPhone - Inquirer's phone
 * @param {string} leadData.message - Inquiry message
 * @param {string} leadData.investmentRange - Investment range
 */
export const sendNewLeadInquiryEmail = async (leadData) => {
  const templateParams = {
    to_email: leadData.brandOwnerEmail,
    to_name: leadData.brandOwnerName || 'Brand Owner',
    brand_name: leadData.brandName,
    brand_owner_name: leadData.brandOwnerName || 'Brand Owner',
    inquirer_name: leadData.inquirerName,
    inquirer_email: leadData.inquirerEmail,
    inquirer_phone: leadData.inquirerPhone || 'Not provided',
    inquiry_message: leadData.message || 'No message provided',
    investment_range: leadData.investmentRange || 'Not specified',
    inquiry_date: new Date().toLocaleString('en-IN', {
      dateStyle: 'long',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata'
    }),
    dashboard_url: `${window.location.origin}/admin/leads`,
    support_email: 'support@ikama.in',
  };

  return sendEmail(TEMPLATES.NEW_LEAD_INQUIRY, templateParams);
};

/**
 * Send brand status update email to brand owner
 * @param {object} statusData - Brand status information
 * @param {string} statusData.brandOwnerEmail - Brand owner's email
 * @param {string} statusData.brandOwnerName - Brand owner's name
 * @param {string} statusData.brandName - Brand name
 * @param {string} statusData.status - New status (approved/rejected/pending)
 * @param {string} statusData.message - Admin message/reason
 * @param {string} statusData.rejectionReason - Reason for rejection (if applicable)
 */
export const sendBrandStatusUpdateEmail = async (statusData) => {
  const isApproved = statusData.status === 'approved';
  const isRejected = statusData.status === 'rejected';

  const templateParams = {
    to_email: statusData.brandOwnerEmail,
    to_name: statusData.brandOwnerName || 'Brand Owner',
    brand_name: statusData.brandName,
    brand_owner_name: statusData.brandOwnerName || 'Brand Owner',
    status: statusData.status,
    status_message: isApproved 
      ? 'Congratulations! Your brand has been approved and is now live on our platform.' 
      : isRejected 
      ? 'We regret to inform you that your brand listing could not be approved at this time.'
      : 'Your brand status has been updated.',
    admin_message: statusData.message || '',
    rejection_reason: statusData.rejectionReason || '',
    next_steps: isApproved 
      ? 'Your brand is now visible to potential franchisees. You can optimize your listing and start receiving inquiries.'
      : isRejected 
      ? 'Please review the feedback and resubmit your brand with the requested changes.'
      : 'Please check your dashboard for more details.',
    brand_url: isApproved ? `${window.location.origin}/brands/${statusData.brandSlug || ''}` : '',
    dashboard_url: `${window.location.origin}/admin/brands`,
    support_email: 'support@ikama.in',
    update_date: new Date().toLocaleString('en-IN', {
      dateStyle: 'long',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata'
    }),
  };

  return sendEmail(TEMPLATES.BRAND_STATUS_UPDATE, templateParams);
};

/**
 * Send brand owner response notification to inquirer
 * @param {object} responseData - Response information
 * @param {string} responseData.inquirerEmail - Inquirer's email
 * @param {string} responseData.inquirerName - Inquirer's name
 * @param {string} responseData.brandName - Brand name
 * @param {string} responseData.brandOwnerName - Brand owner's name
 * @param {string} responseData.responseMessage - Response from brand owner
 * @param {string} responseData.contactEmail - Brand owner's contact email
 * @param {string} responseData.contactPhone - Brand owner's contact phone
 */
export const sendBrandOwnerResponseEmail = async (responseData) => {
  const templateParams = {
    to_email: responseData.inquirerEmail,
    to_name: responseData.inquirerName || 'User',
    inquirer_name: responseData.inquirerName || 'User',
    brand_name: responseData.brandName,
    brand_owner_name: responseData.brandOwnerName,
    response_message: responseData.responseMessage,
    contact_email: responseData.contactEmail || '',
    contact_phone: responseData.contactPhone || '',
    response_date: new Date().toLocaleString('en-IN', {
      dateStyle: 'long',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata'
    }),
    brand_url: `${window.location.origin}/brands/${responseData.brandSlug || ''}`,
    support_email: 'support@ikama.in',
  };

  return sendEmail(TEMPLATES.BRAND_OWNER_RESPONSE, templateParams);
};

/**
 * Log email activity to Firestore (for tracking)
 * @param {object} emailLog - Email log data
 */
export const logEmailActivity = async (emailLog) => {
  try {
    const { db } = await import('../firebase/firebase');
    const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
    
    await addDoc(collection(db, 'emailLogs'), {
      ...emailLog,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error logging email activity:', error);
  }
};

/**
 * Helper function to validate email
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Export templates for reference
export { TEMPLATES };

export default {
  sendWelcomeEmail,
  sendNewLeadInquiryEmail,
  sendBrandStatusUpdateEmail,
  sendBrandOwnerResponseEmail,
  logEmailActivity,
  isValidEmail,
};
