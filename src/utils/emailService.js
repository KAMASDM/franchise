/**
 * Email Service using EmailJS
 * Handles all email notifications with EmailJS templates
 */

import emailjs from '@emailjs/browser';
import logger from './logger';
import { showToast } from './toastUtils';

class EmailService {
  constructor() {
    // EmailJS configuration from environment variables
    this.serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    this.publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    
    // Template IDs for different email types
    this.templates = {
      newLead: import.meta.env.VITE_EMAILJS_TEMPLATE_NEW_LEAD,
      brandApproval: import.meta.env.VITE_EMAILJS_TEMPLATE_BRAND_APPROVAL,
      welcome: import.meta.env.VITE_EMAILJS_TEMPLATE_WELCOME,
      savedSearch: import.meta.env.VITE_EMAILJS_TEMPLATE_SAVED_SEARCH,
      inquiryResponse: import.meta.env.VITE_EMAILJS_TEMPLATE_INQUIRY_RESPONSE,
      brandRegistration: import.meta.env.VITE_EMAILJS_TEMPLATE_BRAND_REGISTRATION,
    };

    // Initialize EmailJS
    if (this.publicKey) {
      emailjs.init(this.publicKey);
      logger.log('✅ EmailJS initialized');
    } else {
      logger.warn('⚠️ EmailJS public key not found. Email functionality will be disabled.');
    }
  }

  /**
   * Check if email service is configured
   */
  isConfigured() {
    return !!(this.serviceId && this.publicKey);
  }

  /**
   * Send email using EmailJS template
   */
  async sendEmail(templateId, templateData) {
    if (!this.isConfigured()) {
      logger.warn('Email service not configured. Skipping email send.');
      return { success: false, error: 'Email service not configured' };
    }

    try {
      // Send via EmailJS
      const response = await emailjs.send(
        this.serviceId,
        templateId,
        templateData,
        this.publicKey
      );

      if (response.status === 200) {
        logger.log(`✅ Email sent successfully using template ${templateId}`);
        return { success: true, messageId: response.text };
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      logger.error('❌ Failed to send email:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send new lead notification email
   */
  async sendNewLeadEmail(brandOwnerEmail, leadData) {
    logger.log(`Sending new lead notification to ${brandOwnerEmail}`);

    const templateData = {
      brand_owner_name: leadData.brandOwnerName || 'Brand Owner',
      brand_name: leadData.brandName,
      prospect_name: `${leadData.firstName} ${leadData.lastName}`,
      prospect_email: leadData.email,
      prospect_phone: leadData.phone || 'Not provided',
      budget: leadData.budget || 'Not specified',
      location: leadData.location || 'Not specified',
      message: leadData.message || 'No message provided',
      lead_url: `${window.location.origin}/admin/leads/${leadData.id}`,
    };

    const result = await this.sendEmail(
      this.templates.newLead,
      templateData
    );

    if (result.success) {
      showToast.success('Email notification sent to brand owner');
    }

    return result;
  }

  /**
   * Send brand approval/rejection email
   */
  async sendBrandStatusEmail(ownerEmail, brandData, approved = true, rejectionReason = null) {
    logger.log(`Sending brand ${approved ? 'approval' : 'rejection'} email to ${ownerEmail}`);

    const templateData = {
      owner_name: brandData.ownerName || 'Brand Owner',
      brand_name: brandData.brandName,
      brand_url: `${window.location.origin}/brands/${brandData.slug}`,
      status: approved ? 'approved' : 'rejected',
      approved_content: approved ? '<div style="background-color: #d4edda; border: 2px solid #28a745; border-radius: 8px; padding: 25px; text-align: center;"><h2 style="margin: 0 0 10px; color: #155724; font-size: 24px; font-weight: bold;">✓ Congratulations!</h2><p style="margin: 0; color: #155724; font-size: 16px; line-height: 1.6;">Your brand has been <strong>approved</strong> and is now live on our platform!</p></div>' : '',
      rejected_content: !approved ? `<div style="background-color: #f8d7da; border: 2px solid #dc3545; border-radius: 8px; padding: 25px;"><h2 style="margin: 0 0 10px; color: #721c24; font-size: 20px; font-weight: bold;">Update Required</h2><p style="margin: 0 0 15px; color: #721c24; font-size: 16px; line-height: 1.6;">We need a few changes before we can approve your brand listing.</p><p style="margin: 0; color: #721c24; font-size: 15px; line-height: 1.6;"><strong>Reason:</strong> ${rejectionReason || 'Please review your submission'}</p></div>` : '',
      rejection_reason: rejectionReason || '',
      next_steps: approved ? 'Your brand is now visible to all prospects. Start receiving leads!' : 'Please review the feedback and resubmit your brand listing.',
    };

    return await this.sendEmail(
      this.templates.brandApproval,
      templateData
    );
  }

  /**
   * Send brand registration confirmation email
   */
  async sendBrandRegistrationEmail(ownerEmail, brandData) {
    logger.log(`Sending brand registration confirmation to ${ownerEmail}`);

    const templateData = {
      owner_name: brandData.ownerName || 'Brand Owner',
      brand_name: brandData.brandName,
      business_model: brandData.businessModel || 'Franchise',
      industries: Array.isArray(brandData.industries) ? brandData.industries.join(', ') : brandData.industries,
      investment_range: brandData.investmentRange || 'Not specified',
      dashboard_url: `${window.location.origin}/dashboard`,
      to_email: ownerEmail,
    };

    const result = await this.sendEmail(
      this.templates.brandRegistration,
      templateData
    );

    if (result.success) {
      logger.log('✅ Brand registration confirmation email sent');
    }

    return result;
  }

  /**
   * Send welcome email to new users
   */
  async sendWelcomeEmail(userEmail, userName, userType = 'prospect') {
    logger.log(`Sending welcome email to ${userEmail}`);

    const templateData = {
      user_name: userName,
      user_type: userType, // Just send 'prospect' or 'brand_owner'
      browse_url: `${window.location.origin}/brands`,
      profile_url: `${window.location.origin}/dashboard`,
      to_email: userEmail, // Add recipient email
    };

    return await this.sendEmail(
      this.templates.welcome,
      templateData
    );
  }

  /**
   * Send saved search alert email
   */
  async sendSavedSearchAlert(userEmail, userName, searchCriteria, matchingBrands) {
    logger.log(`Sending saved search alert to ${userEmail}`);

    // Generate brand cards HTML
    const brandCards = matchingBrands.map(brand => `
      <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin-bottom: 15px; background-color: #ffffff;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="width: 80px; vertical-align: top;">
              <img src="${brand.brandLogo || brand.brandImage}" alt="${brand.brandName}" style="width: 80px; height: 80px; border-radius: 8px; object-fit: cover;">
            </td>
            <td style="padding-left: 20px; vertical-align: top;">
              <h4 style="margin: 0 0 8px; color: #333333; font-size: 18px; font-weight: bold;">${brand.brandName}</h4>
              <p style="margin: 0 0 8px; color: #666666; font-size: 14px; line-height: 1.5;">${brand.description || brand.category}</p>
              <p style="margin: 0; color: #5a76a9; font-size: 14px; font-weight: bold;">Investment: ${brand.initialInvestment ? `$${(brand.initialInvestment / 1000).toFixed(0)}K` : 'Contact for details'}</p>
            </td>
          </tr>
        </table>
      </div>
    `).join('');

    const templateData = {
      user_name: userName,
      match_count: matchingBrands.length,
      search_criteria: searchCriteria,
      brand_cards: brandCards,
      search_url: `${window.location.origin}/brands?${searchCriteria}`,
      unsubscribe_url: `${window.location.origin}/settings/notifications`,
    };

    return await this.sendEmail(
      this.templates.savedSearch,
      templateData
    );
  }

  /**
   * Send inquiry response email
   */
  async sendInquiryResponse(prospectEmail, responseData) {
    logger.log(`Sending inquiry response to ${prospectEmail}`);

    const templateData = {
      prospect_name: responseData.prospectName,
      brand_name: responseData.brandName,
      brand_owner_name: responseData.brandOwnerName,
      response_message: responseData.message,
      brand_owner_email: responseData.contactEmail,
      brand_owner_phone: responseData.contactPhone || 'Not provided',
      original_inquiry: responseData.originalInquiry || 'Your original inquiry',
      conversation_url: `${window.location.origin}/messages`,
    };

    return await this.sendEmail(
      this.templates.inquiryResponse,
      templateData
    );
  }

  /**
   * Batch send emails (with rate limiting)
   */
  async sendBatchEmails(emailList, delay = 1000) {
    const results = [];

    for (const emailData of emailList) {
      try {
        const result = await this.sendEmail(
          emailData.templateId,
          emailData.data
        );
        results.push({ templateId: emailData.templateId, ...result });

        // Add delay to avoid rate limiting
        if (delay > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      } catch (error) {
        logger.error(`Failed to send email with template ${emailData.templateId}:`, error);
        results.push({ templateId: emailData.templateId, success: false, error: error.message });
      }
    }

    return results;
  }

  /**
   * Send test email
   */
  async sendTestEmail(toEmail) {
    logger.log(`Sending test email to ${toEmail}`);

    const prospectContent = '<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; padding: 30px; color: white; text-align: center;"><h2 style="margin: 0 0 15px; font-size: 22px; font-weight: bold;">Ready to Find Your Perfect Franchise?</h2><p style="margin: 0; font-size: 15px; line-height: 1.6;">Explore hundreds of franchise opportunities, compare options, and connect directly with brand owners. Your entrepreneurial journey starts here!</p></div><div style="margin-top: 30px;"><h3 style="margin: 0 0 15px; color: #333333; font-size: 18px; font-weight: bold;">What You Can Do:</h3><ul style="margin: 0; padding-left: 20px; color: #666666; font-size: 15px; line-height: 1.8;"><li>Browse franchise opportunities by industry and investment level</li><li>Save your favorite brands for later</li><li>Compare multiple franchises side-by-side</li><li>Connect directly with brand owners</li><li>Get personalized recommendations</li></ul></div>';

    const templateData = {
      user_name: 'Test User',
      user_type_content: prospectContent,
      browse_url: `${window.location.origin}/brands`,
      profile_url: `${window.location.origin}/profile`,
    };

    const result = await this.sendEmail(
      this.templates.welcome,
      templateData
    );

    if (result.success) {
      showToast.success(`Test email sent to ${toEmail}`);
    } else {
      showToast.error('Failed to send test email');
    }

    return result;
  }

  /**
   * Get email service statistics
   */
  getStats() {
    return {
      configured: this.isConfigured(),
      serviceId: this.serviceId ? '✓' : '✗',
      publicKey: this.publicKey ? '✓' : '✗',
      templates: Object.keys(this.templates).reduce((acc, key) => {
        acc[key] = this.templates[key] ? '✓' : '✗';
        return acc;
      }, {}),
    };
  }
}

// Export singleton instance
export const emailService = new EmailService();
export default emailService;
