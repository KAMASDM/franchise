/**
 * Email Templates Module
 * Generates HTML email content from our templates
 * This allows unlimited templates without EmailJS template limits
 */

/**
 * Replace variables in template string
 * @param {string} template - Template string with {{variables}}
 * @param {object} data - Data object with variable values
 * @returns {string} - Template with variables replaced
 */
const replaceVariables = (template, data) => {
  let result = template;
  
  // Replace all {{variable}} with actual values
  Object.keys(data).forEach(key => {
    const value = data[key] || '';
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, value);
  });
  
  // Handle conditional blocks {{#variable}}...{{/variable}}
  // Remove blocks where variable is empty/false
  Object.keys(data).forEach(key => {
    const value = data[key];
    const startTag = `{{#${key}}}`;
    const endTag = `{{/${key}}}`;
    
    if (!value) {
      // Remove the entire conditional block if value is falsy
      const regex = new RegExp(`${startTag}[\\s\\S]*?${endTag}`, 'g');
      result = result.replace(regex, '');
    } else {
      // Keep content but remove conditional tags
      result = result.replace(new RegExp(startTag, 'g'), '');
      result = result.replace(new RegExp(endTag, 'g'), '');
    }
  });
  
  return result;
};

/**
 * Get email template HTML
 * @param {string} templateName - Name of the template
 * @param {object} data - Data to populate the template
 * @returns {string} - Complete HTML email
 */
export const getEmailTemplate = (templateName, data) => {
  const templates = {
    'welcome': getWelcomeTemplate(data),
    'new-lead-inquiry': getNewLeadInquiryTemplate(data),
    'brand-status-update': getBrandStatusUpdateTemplate(data),
    'brand-owner-response': getBrandOwnerResponseTemplate(data),
    'password-reset': getPasswordResetTemplate(data),
    'password-changed': getPasswordChangedTemplate(data),
    'brand-submitted': getBrandSubmittedTemplate(data),
    'email-verification': getEmailVerificationTemplate(data),
  };
  
  return templates[templateName] || getGenericTemplate(data);
};

/**
 * Welcome Email Template
 */
const getWelcomeTemplate = (data) => {
  const template = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <div style="background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%); padding: 30px 20px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">ikama</h1>
    </div>
    <div style="padding: 40px 30px;">
      <h2 style="font-size: 24px; color: #1976d2; margin-bottom: 20px;">Welcome to ikama! 🎉</h2>
      <p style="font-size: 16px; color: #555555; line-height: 1.6;">Hello <strong>{{to_name}}</strong>,</p>
      <p style="font-size: 16px; color: #555555; line-height: 1.6;">
        Welcome to <strong>{{platform_name}}</strong>! We're excited to have you join our community of franchise enthusiasts and entrepreneurs.
      </p>
      <div style="background-color: #f0f7ff; border-left: 4px solid #1976d2; padding: 15px 20px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0; font-size: 14px; color: #555555;">
          <strong>✨ Your account is ready!</strong><br>
          Start exploring hundreds of franchise opportunities tailored to your investment goals.
        </p>
      </div>
      <h3 style="font-size: 18px; color: #333333; margin: 30px 0 15px 0;">Get Started:</h3>
      <ul style="font-size: 14px; color: #777777; line-height: 1.8;">
        <li>Browse franchise opportunities across various industries</li>
        <li>Use filters to find brands matching your investment range</li>
        <li>Save your favorite brands for later</li>
        <li>Submit inquiries directly to brand owners</li>
        <li>Access expert resources and guides</li>
      </ul>
      <div style="text-align: center; margin: 30px 0;">
        <a href="{{login_url}}" style="display: inline-block; padding: 14px 32px; background-color: #1976d2; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600;">
          Explore Franchises
        </a>
      </div>
      <div style="height: 1px; background-color: #eeeeee; margin: 30px 0;"></div>
      <p style="font-size: 14px; color: #777777;">
        Need help? Contact us at <a href="mailto:{{support_email}}" style="color: #1976d2;">{{support_email}}</a>
      </p>
    </div>
    <div style="background-color: #f9f9f9; padding: 30px; text-align: center; border-top: 1px solid #eeeeee;">
      <p style="font-size: 12px; color: #999999; margin: 5px 0;">© 2025 ikama. All rights reserved.</p>
      <p style="font-size: 12px; color: #999999;"><a href="mailto:support@ikama.in" style="color: #1976d2;">support@ikama.in</a></p>
    </div>
  </div>
</body>
</html>`;
  
  return replaceVariables(template, data);
};

/**
 * New Lead Inquiry Template
 */
const getNewLeadInquiryTemplate = (data) => {
  const template = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <div style="background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%); padding: 30px 20px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">ikama</h1>
    </div>
    <div style="padding: 40px 30px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="width: 60px; height: 60px; background-color: #4caf50; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center; font-size: 30px; color: white;">🎯</div>
      </div>
      <h2 style="font-size: 24px; color: #1976d2; margin-bottom: 20px; text-align: center;">New Franchise Inquiry!</h2>
      <p style="font-size: 16px; color: #555555; line-height: 1.6;">Hello <strong>{{brand_owner_name}}</strong>,</p>
      <p style="font-size: 16px; color: #555555; line-height: 1.6;">
        Great news! Someone is interested in <strong>{{brand_name}}</strong>.
      </p>
      <div style="background-color: #f0f7ff; border-left: 4px solid #1976d2; padding: 15px 20px; margin: 20px 0; border-radius: 4px;">
        <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #1976d2;">Inquiry Details:</h3>
        <div style="margin: 8px 0; padding: 8px 0; border-bottom: 1px solid #e3f2fd;">
          <strong style="color: #333;">Name:</strong> <span style="color: #555;">{{inquirer_name}}</span>
        </div>
        <div style="margin: 8px 0; padding: 8px 0; border-bottom: 1px solid #e3f2fd;">
          <strong style="color: #333;">Email:</strong> <span style="color: #555;">{{inquirer_email}}</span>
        </div>
        <div style="margin: 8px 0; padding: 8px 0; border-bottom: 1px solid #e3f2fd;">
          <strong style="color: #333;">Phone:</strong> <span style="color: #555;">{{inquirer_phone}}</span>
        </div>
        <div style="margin: 8px 0; padding: 8px 0; border-bottom: 1px solid #e3f2fd;">
          <strong style="color: #333;">Investment Range:</strong> <span style="color: #555;">{{investment_range}}</span>
        </div>
        <div style="margin: 8px 0; padding: 8px 0;">
          <strong style="color: #333;">Date:</strong> <span style="color: #555;">{{inquiry_date}}</span>
        </div>
      </div>
      {{#inquiry_message}}
      <div style="background-color: #fff8f0; border-left: 4px solid #ff9800; padding: 15px 20px; margin: 20px 0; border-radius: 4px;">
        <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #ff9800;">Message:</h3>
        <p style="margin: 0; font-size: 14px; color: #555555; line-height: 1.6;">{{inquiry_message}}</p>
      </div>
      {{/inquiry_message}}
      <div style="background-color: #f0fdf4; border-left: 4px solid #4caf50; padding: 15px 20px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0; font-size: 14px; color: #555555;">
          <strong>⚡ Quick Response Tips:</strong><br>
          Respond within 24 hours to increase conversion rates. Personalize your response and address their specific interests.
        </p>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="{{dashboard_url}}" style="display: inline-block; padding: 14px 32px; background-color: #1976d2; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600;">
          View in Dashboard
        </a>
      </div>
    </div>
    <div style="background-color: #f9f9f9; padding: 30px; text-align: center; border-top: 1px solid #eeeeee;">
      <p style="font-size: 12px; color: #999999; margin: 5px 0;">© 2025 ikama. All rights reserved.</p>
      <p style="font-size: 12px; color: #999999;"><a href="mailto:support@ikama.in" style="color: #1976d2;">support@ikama.in</a></p>
    </div>
  </div>
</body>
</html>`;
  
  return replaceVariables(template, data);
};

/**
 * Brand Status Update Template
 */
const getBrandStatusUpdateTemplate = (data) => {
  const isApproved = data.status === 'approved';
  const statusColor = isApproved ? '#4caf50' : '#ff9800';
  const statusIcon = isApproved ? '✓' : '⏳';
  
  const template = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <div style="background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%); padding: 30px 20px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">ikama</h1>
    </div>
    <div style="padding: 40px 30px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="width: 60px; height: 60px; background-color: ${statusColor}; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center; font-size: 30px; color: white;">${statusIcon}</div>
      </div>
      <h2 style="font-size: 24px; color: ${statusColor}; margin-bottom: 20px; text-align: center;">Brand Status Update</h2>
      <p style="font-size: 16px; color: #555555; line-height: 1.6;">Hello <strong>{{brand_owner_name}}</strong>,</p>
      <p style="font-size: 16px; color: #555555; line-height: 1.6;">{{status_message}}</p>
      <div style="background-color: #f0f7ff; border-left: 4px solid #1976d2; padding: 15px 20px; margin: 20px 0; border-radius: 4px;">
        <div style="margin: 8px 0; padding: 8px 0; border-bottom: 1px solid #e3f2fd;">
          <strong style="color: #333;">Brand Name:</strong> <span style="color: #555;">{{brand_name}}</span>
        </div>
        <div style="margin: 8px 0; padding: 8px 0; border-bottom: 1px solid #e3f2fd;">
          <strong style="color: #333;">Status:</strong> <span style="color: ${statusColor}; font-weight: 600; text-transform: capitalize;">{{status}}</span>
        </div>
        <div style="margin: 8px 0; padding: 8px 0;">
          <strong style="color: #333;">Updated:</strong> <span style="color: #555;">{{update_date}}</span>
        </div>
      </div>
      {{#admin_message}}
      <div style="background-color: #fff8f0; border-left: 4px solid #ff9800; padding: 15px 20px; margin: 20px 0; border-radius: 4px;">
        <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #ff9800;">Admin Note:</h3>
        <p style="margin: 0; font-size: 14px; color: #555555; line-height: 1.6;">{{admin_message}}</p>
      </div>
      {{/admin_message}}
      <p style="font-size: 16px; color: #555555; line-height: 1.6;"><strong>Next Steps:</strong></p>
      <p style="font-size: 14px; color: #777777; line-height: 1.6;">{{next_steps}}</p>
      <div style="text-align: center; margin: 30px 0;">
        {{#brand_url}}
        <a href="{{brand_url}}" style="display: inline-block; padding: 14px 32px; background-color: #4caf50; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; margin-right: 10px;">
          View Brand Page
        </a>
        {{/brand_url}}
        <a href="{{dashboard_url}}" style="display: inline-block; padding: 14px 32px; background-color: #1976d2; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600;">
          Go to Dashboard
        </a>
      </div>
    </div>
    <div style="background-color: #f9f9f9; padding: 30px; text-align: center; border-top: 1px solid #eeeeee;">
      <p style="font-size: 12px; color: #999999; margin: 5px 0;">© 2025 ikama. All rights reserved.</p>
      <p style="font-size: 12px; color: #999999;"><a href="mailto:support@ikama.in" style="color: #1976d2;">support@ikama.in</a></p>
    </div>
  </div>
</body>
</html>`;
  
  return replaceVariables(template, data);
};

// Export more templates as needed...
// For now, we'll add simple stubs for other templates

const getBrandOwnerResponseTemplate = (data) => {
  return getGenericTemplate({ ...data, title: 'Response from Brand Owner' });
};

const getPasswordResetTemplate = (data) => {
  return getGenericTemplate({ ...data, title: 'Reset Your Password' });
};

const getPasswordChangedTemplate = (data) => {
  return getGenericTemplate({ ...data, title: 'Password Changed Successfully' });
};

const getBrandSubmittedTemplate = (data) => {
  return getGenericTemplate({ ...data, title: 'Brand Submission Received' });
};

const getEmailVerificationTemplate = (data) => {
  return getGenericTemplate({ ...data, title: 'Verify Your Email' });
};

/**
 * Generic Template (fallback)
 */
const getGenericTemplate = (data) => {
  const template = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <div style="background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%); padding: 30px 20px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">ikama</h1>
    </div>
    <div style="padding: 40px 30px;">
      <h2 style="font-size: 24px; color: #1976d2; margin-bottom: 20px;">{{title}}</h2>
      <p style="font-size: 16px; color: #555555; line-height: 1.6;">Hello <strong>{{to_name}}</strong>,</p>
      <div style="font-size: 16px; color: #555555; line-height: 1.6;">
        {{message}}
      </div>
    </div>
    <div style="background-color: #f9f9f9; padding: 30px; text-align: center; border-top: 1px solid #eeeeee;">
      <p style="font-size: 12px; color: #999999; margin: 5px 0;">© 2025 ikama. All rights reserved.</p>
      <p style="font-size: 12px; color: #999999;"><a href="mailto:support@ikama.in" style="color: #1976d2;">support@ikama.in</a></p>
    </div>
  </div>
</body>
</html>`;
  
  return replaceVariables(template, data);
};

export default {
  getEmailTemplate,
};
