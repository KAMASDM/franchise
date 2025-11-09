import emailjs from '@emailjs/browser';
import { getEmailTemplate } from './emailTemplates';

/**
 * Enhanced Email Service using EmailJS as sending service only
 * We use our own HTML templates for unlimited flexibility
 */

// Initialize EmailJS with public key
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_GENERIC_TEMPLATE = import.meta.env.VITE_EMAILJS_TEMPLATE_GENERIC || 'template_rzndmfq';

// Initialize EmailJS
if (EMAILJS_PUBLIC_KEY) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

/**
 * Base function to send email with HTML content
 * @param {string} to_email - Recipient email
 * @param {string} to_name - Recipient name
 * @param {string} subject - Email subject
 * @param {string} htmlContent - HTML email content
 * @returns {Promise} EmailJS response
 */
const sendEmailHTML = async (to_email, to_name, subject, htmlContent) => {
  try {
    if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID) {
      console.error('EmailJS not configured. Missing public key or service ID.');
      return { success: false, error: 'Email service not configured' };
    }

    console.log(`🔵 Attempting to send email...`);
    console.log(`  To: ${to_email}`);
    console.log(`  Name: ${to_name}`);
    console.log(`  Subject: ${subject}`);
    console.log(`  Template ID: ${EMAILJS_GENERIC_TEMPLATE}`);
    console.log(`  Service ID: ${EMAILJS_SERVICE_ID}`);
    console.log(`  HTML Length: ${htmlContent?.length || 0} characters`);

    // EmailJS template parameters
    // Note: EmailJS uses these exact field names in the template
    const templateParams = {
      to_email: to_email,           // Recipient email
      to_name: to_name,             // Recipient name
      from_name: 'ikama',           // Sender name
      reply_to: 'support@ikama.in', // Reply-to email
      subject: subject,             // Email subject
      message: htmlContent,         // Try 'message' field (common in EmailJS)
      html_content: htmlContent,    // Also include html_content
    };

    console.log('📤 Template params:', templateParams);

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_GENERIC_TEMPLATE,
      templateParams
    );

    console.log('✅ Email sent successfully:', response);
    
    // Log email activity
    await logEmailActivity({
      to_email,
      to_name,
      subject,
      status: 'sent',
      timestamp: new Date().toISOString(),
    });
    
    return { success: true, response };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    console.error('Error details:', {
      message: error.message,
      text: error.text,
      status: error.status,
    });
    
    // Log failed email
    await logEmailActivity({
      to_email,
      to_name,
      subject,
      status: 'failed',
      error: error.text || error.message,
      timestamp: new Date().toISOString(),
    });
    
    return { success: false, error: error.text || error.message || 'Failed to send email' };
  }
};

/**
 * Send welcome email to new user
 * @param {object} userData - User information
 */
export const sendWelcomeEmail = async (userData) => {
  const htmlContent = getEmailTemplate('welcome', {
    to_name: userData.name || 'User',
    user_name: userData.name || 'User',
    platform_name: 'ikama Franchise Portal',
    login_url: `${window.location.origin}/login`,
    support_email: 'support@ikama.in',
  });

  return sendEmailHTML(
    userData.email,
    userData.name || 'User',
    'Welcome to ikama Franchise Portal! 🎉',
    htmlContent
  );
};

/**
 * Send new lead inquiry notification to brand owner
 */
export const sendNewLeadInquiryEmail = async (leadData) => {
  const htmlContent = getEmailTemplate('new-lead-inquiry', {
    brand_owner_name: leadData.brandOwnerName || 'Brand Owner',
    brand_name: leadData.brandName,
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
  });

  return sendEmailHTML(
    leadData.brandOwnerEmail,
    leadData.brandOwnerName || 'Brand Owner',
    `New Franchise Inquiry for ${leadData.brandName} 🎯`,
    htmlContent
  );
};

/**
 * Send brand status update email to brand owner
 */
export const sendBrandStatusUpdateEmail = async (statusData) => {
  const isApproved = statusData.status === 'approved';
  const isRejected = statusData.status === 'rejected';

  const htmlContent = getEmailTemplate('brand-status-update', {
    brand_owner_name: statusData.brandOwnerName || 'Brand Owner',
    brand_name: statusData.brandName,
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
  });

  const subject = isApproved 
    ? `🎉 ${statusData.brandName} Approved on ikama!`
    : isRejected
    ? `Brand Submission Update - ${statusData.brandName}`
    : `Status Update - ${statusData.brandName}`;

  return sendEmailHTML(
    statusData.brandOwnerEmail,
    statusData.brandOwnerName || 'Brand Owner',
    subject,
    htmlContent
  );
};

/**
 * Send brand owner response notification to inquirer
 */
export const sendBrandOwnerResponseEmail = async (responseData) => {
  const htmlContent = getEmailTemplate('brand-owner-response', {
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
  });

  return sendEmailHTML(
    responseData.inquirerEmail,
    responseData.inquirerName || 'User',
    `Response from ${responseData.brandName} 📩`,
    htmlContent
  );
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (userData) => {
  const htmlContent = getEmailTemplate('password-reset', {
    to_name: userData.name || 'User',
    reset_link: userData.resetLink,
  });

  return sendEmailHTML(
    userData.email,
    userData.name || 'User',
    'Reset Your Password - ikama',
    htmlContent
  );
};

/**
 * Send password changed confirmation
 */
export const sendPasswordChangedEmail = async (userData) => {
  const htmlContent = getEmailTemplate('password-changed', {
    to_name: userData.name || 'User',
    to_email: userData.email,
    change_date: new Date().toLocaleString('en-IN', {
      dateStyle: 'long',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata'
    }),
    login_url: `${window.location.origin}/login`,
  });

  return sendEmailHTML(
    userData.email,
    userData.name || 'User',
    'Password Changed Successfully - ikama',
    htmlContent
  );
};

/**
 * Send brand submission confirmation
 */
export const sendBrandSubmittedEmail = async (brandData) => {
  const htmlContent = getEmailTemplate('brand-submitted', {
    brand_owner_name: brandData.brandOwnerName || 'Brand Owner',
    brand_name: brandData.brandName,
    submission_date: new Date().toLocaleString('en-IN', {
      dateStyle: 'long',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata'
    }),
    dashboard_url: `${window.location.origin}/admin/brands`,
  });

  return sendEmailHTML(
    brandData.brandOwnerEmail,
    brandData.brandOwnerName || 'Brand Owner',
    `Brand Submission Received - ${brandData.brandName}`,
    htmlContent
  );
};

/**
 * Send email verification
 */
export const sendEmailVerification = async (userData) => {
  const htmlContent = getEmailTemplate('email-verification', {
    to_name: userData.name || 'User',
    to_email: userData.email,
    verification_link: userData.verificationLink,
  });

  return sendEmailHTML(
    userData.email,
    userData.name || 'User',
    'Verify Your Email - ikama',
    htmlContent
  );
};

/**
 * Log email activity to Firestore (for tracking)
 */
export const logEmailActivity = async (emailLog) => {
  try {
    const { db } = await import('../firebase/firebase');
    const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
    
    // Clean the log object - remove undefined fields
    const cleanLog = Object.entries(emailLog).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    
    await addDoc(collection(db, 'emailLogs'), {
      ...cleanLog,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error logging email activity:', error);
  }
};

/**
 * Helper function to validate email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default {
  sendWelcomeEmail,
  sendNewLeadInquiryEmail,
  sendBrandStatusUpdateEmail,
  sendBrandOwnerResponseEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
  sendBrandSubmittedEmail,
  sendEmailVerification,
  logEmailActivity,
  isValidEmail,
};
