# Email Templates for ikama Franchise Portal

This folder contains HTML email templates for all email triggers in the system. Each template is designed to be responsive, accessible, and professionally branded for ikama.

## 📁 Template Organization

### 🔐 Authentication & Account (01-05)
- `01-email-verification.html` - Email verification after signup
- `02-password-reset.html` - Password reset request
- `03-password-changed.html` - Password change confirmation

### 🏢 Brand Management (04-12)
- `04-brand-submitted.html` - Brand registration submitted
- `05-brand-rejected.html` - Brand listing rejected
- `06-brand-needs-revision.html` - Brand requires changes
- `07-brand-listing-updated.html` - Brand updated successfully
- `08-brand-featured.html` - Brand promoted to featured
- `09-brand-expiring-soon.html` - Brand listing expiring (7 days)
- `10-brand-expired.html` - Brand listing expired

### 📨 Lead Management (11-16)
- `11-inquiry-confirmation-user.html` - Inquiry confirmation to user
- `12-lead-status-changed.html` - Lead status update
- `13-lead-followup-owner.html` - Reminder to brand owner
- `14-lead-closed-won.html` - Successful conversion
- `15-lead-closed-lost.html` - Lead didn't convert

### 💬 Support & Contact (16-18)
- `16-contact-submitted-user.html` - Contact form confirmation
- `17-support-resolved.html` - Support ticket resolved
- `18-chat-summary.html` - Chat conversation transcript

### 💳 Payment & Subscription (19-24)
- `19-payment-successful.html` - Payment confirmation
- `20-payment-failed.html` - Payment failure notice
- `21-invoice-generated.html` - Monthly invoice
- `22-subscription-upgraded.html` - Plan upgrade confirmation
- `23-subscription-downgraded.html` - Plan downgrade notice
- `24-subscription-cancelled.html` - Cancellation confirmation

### 🎯 Engagement & Nurture (25-35)
- `25-welcome-series-day0.html` - Welcome email (Day 0)
- `26-welcome-series-day2.html` - Discover features (Day 2)
- `27-welcome-series-day5.html` - Get most value (Day 5)
- `28-welcome-series-day10.html` - Need help? (Day 10)
- `29-inactive-7days.html` - Re-engagement (7 days)
- `30-inactive-30days.html` - Re-engagement (30 days)
- `31-inactive-90days.html` - Last attempt (90 days)
- `32-profile-incomplete.html` - Complete your profile
- `33-saved-brands-reminder.html` - Saved brands follow-up
- `34-abandoned-inquiry.html` - Complete your inquiry

### 📰 Content & Newsletter (35-40)
- `35-weekly-newsletter.html` - Weekly digest
- `36-monthly-report.html` - Monthly market report
- `37-new-blog-post.html` - Blog notification
- `38-franchising-tips.html` - Educational series

### 🎁 Recommendations (39-43)
- `39-new-brands-matching.html` - New matching brands
- `40-price-drop-alert.html` - Price reduction notification
- `41-similar-brands.html` - Similar brand suggestions
- `42-investment-range-matches.html` - Brands in your range

### 👔 Brand Owner Engagement (43-47)
- `43-brand-owner-welcome.html` - New brand owner welcome
- `44-lead-performance-weekly.html` - Weekly performance report
- `45-monthly-brand-performance.html` - Monthly analytics
- `46-no-leads-reminder.html` - Optimization suggestions
- `47-high-performing-recognition.html` - Top performer recognition

### 🎓 Events & Webinars (48-52)
- `48-webinar-invitation.html` - Webinar invite (7 days before)
- `49-webinar-reminder-3days.html` - Webinar reminder (3 days)
- `50-webinar-reminder-1hour.html` - Final reminder (1 hour)
- `51-webinar-recording.html` - Recording available
- `52-expo-invitation.html` - Franchise expo invitation

### 🎉 Milestones & Celebrations (53-56)
- `53-account-anniversary.html` - 1 year celebration
- `54-first-inquiry.html` - First inquiry encouragement
- `55-milestone-10views.html` - Active researcher recognition

### 📊 Feedback & Reviews (56-58)
- `56-post-inquiry-feedback.html` - Experience survey
- `57-nps-survey.html` - Net Promoter Score
- `58-review-request.html` - Platform review request

### ⚖️ Administrative & Compliance (59-63)
- `59-terms-updated.html` - Terms of Service update
- `60-privacy-updated.html` - Privacy Policy update
- `61-data-export-ready.html` - Data export download
- `62-security-alert.html` - Suspicious activity warning
- `63-account-deleted.html` - Account deletion confirmation

---

## 🎨 Design Guidelines

### Brand Colors
- **Primary:** #1976d2 (Blue)
- **Secondary:** #1565c0 (Dark Blue)
- **Success:** #4caf50 (Green)
- **Warning:** #ff9800 (Orange)
- **Error:** #f44336 (Red)
- **Background:** #f5f5f5 (Light Gray)

### Typography
- **Font Family:** -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
- **Headings:** Bold, varying sizes (24px, 20px, 18px)
- **Body Text:** 16px, line-height 1.6
- **Small Text:** 14px, 12px

### Layout
- **Max Width:** 600px (optimal for email clients)
- **Padding:** Consistent spacing throughout
- **Mobile Responsive:** Adapts to smaller screens
- **Buttons:** Rounded (6px), bold text, clear CTAs

---

## 📧 Variable Naming Convention

All templates use double curly braces `{{variable_name}}` for EmailJS variables.

### Common Variables (used in most templates):
- `{{to_email}}` - Recipient email address
- `{{to_name}}` - Recipient name
- `{{platform_name}}` - ikama Franchise Portal
- `{{support_email}}` - support@ikama.in
- `{{current_year}}` - 2025

### Template-Specific Variables:
Each template file includes comments at the top listing all required variables.

---

## 🔧 How to Use These Templates

### Step 1: Copy Template HTML
Open the template file you need and copy its entire HTML content.

### Step 2: Create in EmailJS
1. Log in to your EmailJS dashboard
2. Go to Email Templates
3. Click "Create New Template"
4. Paste the HTML content
5. Configure variables
6. Save and note the Template ID

### Step 3: Update Environment Variables
Add the template ID to your `.env` file:
```
VITE_EMAILJS_TEMPLATE_NAME=template_xxxxx
```

### Step 4: Integrate in Code
Use the template in your email service:
```javascript
await sendEmail(TEMPLATES.TEMPLATE_NAME, templateParams);
```

---

## ✅ Testing Checklist

For each template, verify:
- [ ] All variables render correctly
- [ ] Links work and point to correct URLs
- [ ] Responsive on mobile devices
- [ ] Renders correctly in major email clients (Gmail, Outlook, Apple Mail)
- [ ] Images load (if any)
- [ ] CTA buttons are clickable
- [ ] Unsubscribe link present (for marketing emails)
- [ ] Footer information accurate
- [ ] No broken formatting
- [ ] Text is readable on both light and dark mode

---

## 📱 Email Client Compatibility

Templates are tested and optimized for:
- ✅ Gmail (Desktop & Mobile)
- ✅ Outlook (2016, 2019, 365)
- ✅ Apple Mail (macOS & iOS)
- ✅ Yahoo Mail
- ✅ Thunderbird
- ✅ Mobile email clients

---

## 🔒 Compliance

All templates include:
- Company contact information
- Physical address in footer
- Unsubscribe option (where applicable)
- Privacy policy link
- CAN-SPAM compliance
- GDPR compliance

---

## 📝 Customization Notes

### To Update Branding:
1. Replace color codes in inline styles
2. Update logo/company name
3. Modify footer contact information
4. Adjust spacing/padding as needed

### To Add Images:
Upload images to a CDN and use absolute URLs:
```html
<img src="https://your-cdn.com/image.png" alt="Description" style="max-width: 100%;">
```

---

## 🚀 Next Steps

1. Review all templates
2. Customize with your branding
3. Upload to EmailJS dashboard
4. Get template IDs
5. Update `.env` file
6. Integrate into application
7. Test thoroughly
8. Deploy!

---

## 📞 Support

For questions or issues with templates:
- Email: support@ikama.in
- Documentation: /docs/EMAIL_TRIGGER_SYSTEM.md
- Implementation Guide: /docs/EMAIL_IMPLEMENTATION_COMPLETE.md

---

**Last Updated:** November 9, 2025  
**Version:** 1.0  
**Total Templates:** 63
