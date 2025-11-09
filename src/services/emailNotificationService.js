import emailjs from '@emailjs/browser';

/**
 * Email Notification Service
 * Handles all email notifications for the brand registration system
 * 
 * ⚠️ OPTIONAL SERVICE - Form submission works without email configuration
 * 
 * Setup Instructions (Optional):
 * 1. Sign up at https://www.emailjs.com/
 * 2. Create ONE generic template called "template_inline" with this content:
 *    
 *    Subject: {{subject}}
 *    
 *    Body (HTML):
 *    {{{html_content}}}
 *    
 *    Note: Use triple braces {{{ }}} for html_content to render HTML
 * 
 * 3. Add your credentials to .env file:
 *    VITE_EMAILJS_PUBLIC_KEY=your_public_key
 *    VITE_EMAILJS_SERVICE_ID=your_service_id
 * 
 * That's it! All email templates are now managed in this file, not in EmailJS.
 * If not configured, form submission will work normally without email notifications.
 */

// Initialize EmailJS with your public key
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID';

// We only need ONE generic template in EmailJS called "template_inline"
// All HTML content is managed in this file

// Initialize EmailJS
if (EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

/**
 * Check if email service is configured
 */
export const isEmailServiceConfigured = () => {
  return EMAILJS_PUBLIC_KEY && 
         EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY' &&
         EMAILJS_SERVICE_ID &&
         EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID';
};

/**
 * Email HTML Templates
 */
const emailTemplates = {
  submissionConfirmation: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        .info-box { background: white; padding: 15px; border-left: 4px solid #667eea; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Submission Received!</h1>
          <p>Thank you for registering with ikama - Franchise Hub</p>
        </div>
        <div class="content">
          <p>Dear ${data.to_name},</p>
          
          <p>We're excited to inform you that your brand registration for <strong>${data.brand_name}</strong> has been successfully received!</p>
          
          <div class="info-box">
            <p><strong>📋 Submission Details:</strong></p>
            <p>Business Model: ${data.business_model}</p>
            <p>Submission Date: ${data.submission_date} at ${data.submission_time}</p>
            <p>Tracking ID: ${data.tracking_id}</p>
          </div>
          
          <p><strong>What's Next?</strong></p>
          <ul>
            <li>Our team will review your submission within 2-3 business days</li>
            <li>You'll receive an email notification once the review is complete</li>
            <li>If approved, your brand will be listed on our platform</li>
          </ul>
          
          <center>
            <a href="${data.website_url}/dashboard" class="button">View Dashboard</a>
          </center>
          
          <p>If you have any questions, feel free to reach out to our support team.</p>
          
          <p>Best regards,<br><strong>The ikama Team</strong></p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} ikama - Franchise Hub. All rights reserved.</p>
          <p>This is an automated message, please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `,
  
  adminNotification: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #2563eb; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .detail-row { padding: 10px 0; border-bottom: 1px solid #e0e0e0; }
        .label { font-weight: bold; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🔔 New Brand Submission</h2>
        </div>
        <div class="content">
          <p><strong>A new brand has been submitted for review!</strong></p>
          
          <div class="detail-row">
            <span class="label">Brand Name:</span> ${data.brand_name}
          </div>
          <div class="detail-row">
            <span class="label">Submitter:</span> ${data.submitter_name}
          </div>
          <div class="detail-row">
            <span class="label">Email:</span> ${data.submitter_email}
          </div>
          <div class="detail-row">
            <span class="label">Business Model:</span> ${data.business_model}
          </div>
          <div class="detail-row">
            <span class="label">Industry:</span> ${data.industry}
          </div>
          <div class="detail-row">
            <span class="label">Location:</span> ${data.location}
          </div>
          <div class="detail-row">
            <span class="label">Investment Range:</span> ${data.investment_range}
          </div>
          <div class="detail-row">
            <span class="label">Submitted:</span> ${data.submission_date} at ${data.submission_time}
          </div>
          
          <center>
            <a href="${data.review_url}" class="button">Review Submission</a>
          </center>
        </div>
      </div>
    </body>
    </html>
  `,
  
  approvalNotification: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .success-box { background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 15px 0; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Congratulations!</h1>
          <p>Your brand has been approved</p>
        </div>
        <div class="content">
          <p>Dear ${data.to_name},</p>
          
          <div class="success-box">
            <h3 style="margin-top: 0; color: #059669;">✅ Your brand "${data.brand_name}" is now LIVE!</h3>
            <p style="margin-bottom: 0;">Approval Date: ${data.approval_date}</p>
          </div>
          
          <p><strong>What this means:</strong></p>
          <ul>
            <li>Your brand profile is now visible to potential franchisees</li>
            <li>You'll start receiving inquiries from interested partners</li>
            <li>Your listing appears in search results</li>
          </ul>
          
          <p><strong>Next Steps:</strong></p>
          <ul>
            <li>View and manage your brand profile</li>
            <li>Respond to franchise inquiries promptly</li>
            <li>Keep your information up to date</li>
          </ul>
          
          <center>
            <a href="${data.brand_url}" class="button" style="margin-right: 10px;">View Your Brand</a>
            <a href="${data.dashboard_url}" class="button" style="background: #667eea;">Go to Dashboard</a>
          </center>
          
          <p>Thank you for partnering with ikama!</p>
          
          <p>Best regards,<br><strong>The ikama Team</strong></p>
        </div>
      </div>
    </body>
    </html>
  `,
  
  rejectionNotification: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .warning-box { background: #fee2e2; border-left: 4px solid: #ef4444; padding: 15px; margin: 15px 0; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⚠️ Submission Needs Attention</h1>
        </div>
        <div class="content">
          <p>Dear ${data.to_name},</p>
          
          <p>Thank you for your interest in listing "${data.brand_name}" on ikama - Franchise Hub.</p>
          
          <div class="warning-box">
            <p><strong>Your submission requires revision:</strong></p>
            <p>${data.reason}</p>
          </div>
          
          <p><strong>What you can do:</strong></p>
          <ul>
            <li>Review the feedback above</li>
            <li>Make necessary corrections to your submission</li>
            <li>Resubmit your brand for review</li>
          </ul>
          
          <p>We're here to help you succeed. If you have any questions, please don't hesitate to reach out to our support team at <a href="mailto:${data.support_email}">${data.support_email}</a></p>
          
          <center>
            <a href="${data.resubmit_url}" class="button">Resubmit Application</a>
          </center>
          
          <p>Best regards,<br><strong>The ikama Team</strong></p>
        </div>
      </div>
    </body>
    </html>
  `,
  
  leadReceivedNotification: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #f59e0b; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .lead-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 15px 0; border-radius: 4px; }
        .detail-row { padding: 8px 0; border-bottom: 1px solid #e0e0e0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎯 New Lead Received!</h1>
          <p>Someone is interested in your franchise</p>
        </div>
        <div class="content">
          <p>Dear ${data.brand_owner_name},</p>
          
          <div class="lead-box">
            <h3 style="margin-top: 0; color: #d97706;">New inquiry for "${data.brand_name}"</h3>
          </div>
          
          <p><strong>Lead Details:</strong></p>
          <div class="detail-row"><strong>Name:</strong> ${data.lead_name}</div>
          <div class="detail-row"><strong>Email:</strong> ${data.lead_email}</div>
          <div class="detail-row"><strong>Phone:</strong> ${data.lead_phone}</div>
          <div class="detail-row"><strong>Location:</strong> ${data.lead_location}</div>
          <div class="detail-row"><strong>Investment Capacity:</strong> ${data.investment_capacity}</div>
          <div class="detail-row"><strong>Received:</strong> ${data.received_date}</div>
          
          ${data.message ? `<p><strong>Message:</strong></p><p style="background: white; padding: 15px; border-radius: 4px; font-style: italic;">"${data.message}"</p>` : ''}
          
          <p><strong>⏰ Quick action recommended!</strong> Leads are most responsive within the first 24 hours.</p>
          
          <center>
            <a href="${data.dashboard_url}" class="button">View Lead Details</a>
          </center>
          
          <p>Best regards,<br><strong>The ikama Team</strong></p>
        </div>
      </div>
    </body>
    </html>
  `,
  
  leadStatusChangeNotification: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #8b5cf6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .status-box { background: #ede9fe; border-left: 4px solid #8b5cf6; padding: 15px; margin: 15px 0; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📊 Lead Status Updated</h1>
        </div>
        <div class="content">
          <p>Dear ${data.brand_owner_name},</p>
          
          <div class="status-box">
            <p><strong>Lead status has been updated for "${data.brand_name}"</strong></p>
            <p style="font-size: 18px; margin: 10px 0;">
              Status: <strong>${data.old_status}</strong> → <strong style="color: #8b5cf6;">${data.new_status}</strong>
            </p>
          </div>
          
          <p><strong>Lead Information:</strong></p>
          <p>Name: ${data.lead_name}<br>
          Email: ${data.lead_email}<br>
          Updated: ${data.update_date}</p>
          
          ${data.notes ? `<p><strong>Notes:</strong></p><p style="background: white; padding: 15px; border-radius: 4px;">${data.notes}</p>` : ''}
          
          <center>
            <a href="${data.dashboard_url}" class="button">View Lead</a>
          </center>
          
          <p>Best regards,<br><strong>The ikama Team</strong></p>
        </div>
      </div>
    </body>
    </html>
  `
};

/**
 * Send email using EmailJS with inline HTML
 * @private
 */
const sendEmail = async (htmlContent, subject, recipientEmail, recipientName) => {
  if (!isEmailServiceConfigured()) {
    console.warn('Email service not configured. Skipping email notification.');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const templateParams = {
      to_email: recipientEmail,
      to_name: recipientName,
      subject: subject,
      html_content: htmlContent,
      from_name: 'ikama - Franchise Hub',
      reply_to: 'noreply@ikama.com'
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      'template_inline', // Generic template that just uses {{html_content}}
      templateParams
    );

    console.log('Email sent successfully:', response);
    return { success: true, response };
  } catch (error) {
    console.warn('Failed to send email (non-critical):', error.text || error.message);
    return { success: false, error: error.text || error.message, nonCritical: true };
  }
};

/**
 * Send confirmation email to user after form submission
 */
export const sendSubmissionConfirmation = async (userData) => {
  const data = {
    to_name: userData.name || 'Valued Partner',
    brand_name: userData.brandName,
    business_model: userData.businessModelType,
    submission_date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    submission_time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    tracking_id: userData.id || 'Processing',
    website_url: window.location.origin,
  };

  const htmlContent = emailTemplates.submissionConfirmation(data);
  
  return await sendEmail(
    htmlContent,
    `✅ Brand Registration Received - ${userData.brandName}`,
    userData.email,
    data.to_name
  );
};

/**
 * Send notification to admin about new submission
 */
export const sendAdminNotification = async (submissionData, adminEmail = 'admin@ikama.com') => {
  const data = {
    brand_name: submissionData.brandName,
    submitter_name: submissionData.ownerInfo?.name || submissionData.contactInfo?.email || 'Not provided',
    submitter_email: submissionData.contactInfo?.email || 'Not provided',
    business_model: submissionData.businessModelType,
    industry: submissionData.industries?.join(', ') || 'Not specified',
    location: `${submissionData.contactInfo?.city || 'N/A'}, ${submissionData.contactInfo?.state || 'N/A'}`,
    investment_range: submissionData.investmentRange || 'Not specified',
    submission_date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    submission_time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    review_url: `${window.location.origin}/admin/brands/${submissionData.id}`,
  };

  const htmlContent = emailTemplates.adminNotification(data);
  
  return await sendEmail(
    htmlContent,
    `🔔 New Submission: ${submissionData.brandName}`,
    adminEmail,
    'Admin'
  );
};

/**
 * Send approval notification to brand owner
 */
export const sendApprovalNotification = async (brandData) => {
  const data = {
    to_name: brandData.contactName || brandData.contactPerson || brandData.brandName,
    brand_name: brandData.brandName,
    approval_date: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    brand_url: `${window.location.origin}/brands/${brandData.slug || brandData.id}`,
    dashboard_url: `${window.location.origin}/dashboard`
  };

  const htmlContent = emailTemplates.approvalNotification(data);
  
  return await sendEmail(
    htmlContent,
    `🎉 Congratulations! ${brandData.brandName} is Now Live`,
    brandData.email || brandData.contactEmail,
    data.to_name
  );
};

/**
 * Send rejection notification with feedback
 */
export const sendRejectionNotification = async (brandData, reason = '') => {
  const data = {
    to_name: brandData.contactName || brandData.contactPerson || brandData.brandName,
    brand_name: brandData.brandName,
    reason: reason || 'Your submission did not meet our current listing requirements. Please review our guidelines and resubmit with the necessary updates.',
    support_email: 'support@ikama.com',
    resubmit_url: `${window.location.origin}/brand-registration`
  };

  const htmlContent = emailTemplates.rejectionNotification(data);
  
  return await sendEmail(
    htmlContent,
    `Attention Required: ${brandData.brandName} Submission`,
    brandData.email || brandData.contactEmail,
    data.to_name
  );
};

/**
 * Send new lead received notification to brand owner
 */
export const sendLeadReceivedNotification = async (leadData, brandData) => {
  const data = {
    brand_owner_name: brandData.contactName || brandData.contactPerson || brandData.brandName,
    brand_name: brandData.brandName,
    lead_name: leadData.name,
    lead_email: leadData.email,
    lead_phone: leadData.phone || 'Not provided',
    lead_location: leadData.location || 'Not specified',
    investment_capacity: leadData.investmentCapacity || 'Not specified',
    received_date: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    message: leadData.message || '',
    dashboard_url: `${window.location.origin}/dashboard/leads`
  };

  const htmlContent = emailTemplates.leadReceivedNotification(data);
  
  return await sendEmail(
    htmlContent,
    `🎯 New Lead for ${brandData.brandName}!`,
    brandData.email || brandData.contactEmail,
    data.brand_owner_name
  );
};

/**
 * Send lead status change notification to brand owner
 */
export const sendLeadStatusChangeNotification = async (leadData, brandData, oldStatus, newStatus, notes = '') => {
  const data = {
    brand_owner_name: brandData.contactName || brandData.contactPerson || brandData.brandName,
    brand_name: brandData.brandName,
    lead_name: leadData.name,
    lead_email: leadData.email,
    old_status: oldStatus,
    new_status: newStatus,
    update_date: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    notes: notes,
    dashboard_url: `${window.location.origin}/dashboard/leads`
  };

  const htmlContent = emailTemplates.leadStatusChangeNotification(data);
  
  return await sendEmail(
    htmlContent,
    `Lead Status Updated: ${leadData.name} - ${brandData.brandName}`,
    brandData.email || brandData.contactEmail,
    data.brand_owner_name
  );
};

/**
 * Send status update notification
 */
export const sendStatusUpdateNotification = async (brandData, newStatus, message = '') => {
  // For now, this uses the same template as approval/rejection
  // Can be customized further if needed
  if (newStatus === 'approved') {
    return await sendApprovalNotification(brandData);
  } else if (newStatus === 'rejected') {
    return await sendRejectionNotification(brandData, message);
  }
  
  // For other status changes, log for now
  console.log('Status update:', brandData.brandName, 'to', newStatus);
};

/**
 * Send reminder email for incomplete registration
 */
export const sendReminderEmail = async (userData, draftData) => {
  // TODO: Create reminder email template when reminder system is implemented
  console.log('Reminder email:', userData, draftData);
  // Future implementation would check last_saved date and send reminder if > 7 days
};

/**
 * Send welcome email to new users
 */
export const sendWelcomeEmail = async (userData) => {
  // TODO: Create welcome email template when user auth system triggers it
  console.log('Welcome email:', userData);
  // Future implementation would send when user completes Firebase authentication
};

/**
 * Send bulk email notifications (e.g., for marketing campaigns)
 */
export const sendBulkNotifications = async (recipients, templateId, commonParams = {}) => {
  if (!Array.isArray(recipients) || recipients.length === 0) {
    return { success: false, error: 'No recipients provided' };
  }

  const results = [];
  
  for (const recipient of recipients) {
    const templateParams = {
      ...commonParams,
      to_email: recipient.email,
      to_name: recipient.name || 'Valued Partner',
    };

    const result = await sendEmail(templateId, templateParams);
    results.push({
      recipient: recipient.email,
      ...result,
    });

    // Add delay to avoid rate limiting (EmailJS has limits)
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return {
    success: true,
    total: recipients.length,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results,
  };
};

/**
 * Send custom email with template
 */
export const sendCustomEmail = async (to, subject, templateId, params = {}) => {
  const templateParams = {
    to_email: to,
    subject: subject,
    ...params,
  };

  return await sendEmail(templateId, templateParams);
};

/**
 * Schedule reminder emails for inactive drafts
 * Call this periodically (e.g., daily cron job)
 */
export const sendInactiveDraftReminders = async () => {
  // This would typically be called from a backend cron job
  // For now, it's a placeholder that shows the structure
  
  const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000);
  const drafts = JSON.parse(localStorage.getItem('brandRegistrationDraft') || '{}');
  
  if (drafts.lastSaved && drafts.lastSaved < threeDaysAgo && drafts.email) {
    return await sendReminderEmail(
      { email: drafts.email },
      {
        brandName: drafts.brandName,
        lastSaved: drafts.lastSaved,
        completionPercentage: calculateCompletionPercentage(drafts),
      }
    );
  }

  return { success: false, error: 'No inactive drafts found' };
};

/**
 * Helper: Calculate form completion percentage
 */
const calculateCompletionPercentage = (formData) => {
  const requiredFields = [
    'brandName', 'email', 'businessModelType', 'industry',
    'city', 'state', 'phone', 'initialInvestment'
  ];
  
  const completedFields = requiredFields.filter(field => formData[field]);
  return Math.round((completedFields.length / requiredFields.length) * 100);
};

/**
 * Email notification triggers for different events
 */
export const EmailEvents = {
  FORM_SUBMITTED: 'form_submitted',
  BRAND_APPROVED: 'brand_approved',
  BRAND_REJECTED: 'brand_rejected',
  STATUS_CHANGED: 'status_changed',
  DOCUMENT_UPLOADED: 'document_uploaded',
  PAYMENT_RECEIVED: 'payment_received',
  CONTRACT_SIGNED: 'contract_signed',
  REMINDER_SENT: 'reminder_sent',
};

/**
 * Auto-send appropriate email based on event
 */
export const handleEmailEvent = async (event, data) => {
  switch (event) {
    case EmailEvents.FORM_SUBMITTED:
      await sendSubmissionConfirmation(data);
      await sendAdminNotification(data);
      break;
    
    case EmailEvents.BRAND_APPROVED:
      await sendApprovalNotification(data);
      break;
    
    case EmailEvents.BRAND_REJECTED:
      await sendRejectionNotification(data, data.rejectionReason);
      break;
    
    case EmailEvents.STATUS_CHANGED:
      await sendStatusUpdateNotification(data, data.newStatus, data.message);
      break;
    
    default:
      console.log('Unknown email event:', event);
  }
};

export default {
  sendSubmissionConfirmation,
  sendAdminNotification,
  sendApprovalNotification,
  sendRejectionNotification,
  sendStatusUpdateNotification,
  sendReminderEmail,
  sendWelcomeEmail,
  sendBulkNotifications,
  sendCustomEmail,
  handleEmailEvent,
  isEmailServiceConfigured,
  EmailEvents,
};
