const functions = require("firebase-functions");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
admin.initializeApp();

// Initialize the Gemini AI model
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("GEMINI_API_KEY not found in environment variables. Set it in functions/.env");
}
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-2.0-flash" }) : null;

// ---------------------------------------------------------------------------
// Input sanitization for prompt injection prevention
// ---------------------------------------------------------------------------
const sanitizeField = (val, maxLen = 200) => {
  if (!val || typeof val !== "string") return "";
  // Strip characters that could break prompt structure
  return val.replace(/[`\\]/g, "").trim().substring(0, maxLen);
};

// ---------------------------------------------------------------------------
// Cloud Function: generateContent (callable — requires authentication)
// ---------------------------------------------------------------------------
exports.generateContent = functions
  .runWith({ timeoutSeconds: 60, memory: "512MB" })
  .https
  .onCall(async (data, context) => {
    // Require authentication — this is only called from the brand registration flow
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Authentication required to generate content"
      );
    }

    if (!model) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Service temporarily unavailable"
      );
    }

    const { contentType, brandInfo } = data;

    if (!contentType || !brandInfo) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "contentType and brandInfo are required"
      );
    }

    // Sanitize all user-supplied fields to prevent prompt injection
    const safe = {
      brandName: sanitizeField(brandInfo.brandName, 100),
      industry: sanitizeField(brandInfo.industry, 50),
      businessModel: sanitizeField(brandInfo.businessModel, 50),
      targetAudience: sanitizeField(brandInfo.targetAudience),
      uniqueFeatures: sanitizeField(brandInfo.uniqueFeatures),
      targetMarket: sanitizeField(brandInfo.targetMarket),
      competitiveAdvantage: sanitizeField(brandInfo.competitiveAdvantage),
      brandPersonality: sanitizeField(brandInfo.brandPersonality),
      investmentRange: sanitizeField(brandInfo.investmentRange, 50),
      purpose: sanitizeField(brandInfo.purpose, 50),
      content: sanitizeField(brandInfo.content, 1000),
    };

    let prompt = "";

    switch (contentType) {
      case "description":
        prompt = `You are a professional marketing copywriter specializing in franchise businesses.

Create a compelling brand description for:
- Brand Name: ${safe.brandName || "the brand"}
- Industry: ${safe.industry || "not specified"}
- Business Model: ${safe.businessModel || "franchise"}
- Target Audience: ${safe.targetAudience || "general consumers"}
- Unique Features: ${safe.uniqueFeatures || "quality products and services"}

Write a 2-3 paragraph brand description that:
1. Captures the essence and value proposition
2. Highlights what makes the brand unique
3. Appeals to potential franchise partners
4. Is professional yet engaging
5. Focuses on benefits and opportunities

Keep it between 150-250 words. Make it inspiring and professional.`;
        break;

      case "usps":
        prompt = `As a business strategy expert, identify 5 unique selling propositions (USPs) for:
- Brand: ${safe.brandName || "the brand"}
- Industry: ${safe.industry || "not specified"}
- Business Model: ${safe.businessModel || "franchise"}
- Target Market: ${safe.targetMarket || "general market"}
- Competitive Edge: ${safe.competitiveAdvantage || "quality and service"}

Format each USP as a concise, powerful statement (10-15 words each).
Focus on:
1. Market differentiation
2. Customer benefits
3. Franchise partner advantages
4. Proven business model
5. Support and systems

Return ONLY 5 numbered USPs, one per line, without additional explanation.`;
        break;

      case "taglines":
        prompt = `As a creative advertising copywriter, create 5 memorable marketing taglines for:
- Brand: ${safe.brandName || "the brand"}
- Industry: ${safe.industry || "not specified"}
- Brand Personality: ${safe.brandPersonality || "professional and trustworthy"}
- Audience: ${safe.targetAudience || "general consumers"}

Each tagline should be:
- 3-7 words maximum
- Memorable and catchy
- Reflect brand values
- Easy to understand
- Emotionally engaging

Return ONLY 5 numbered taglines, one per line.`;
        break;

      case "insights":
        prompt = `As a franchise industry expert, provide key insights for the ${safe.industry || "retail"} industry:

1. Current market trends (2-3 points)
2. Success factors for franchises (3 points)
3. Common challenges to address (2-3 points)
4. Recommended franchise fee range
5. Typical ROI timeline

Keep each point concise (1 sentence). Format as a structured list.`;
        break;

      case "partnerProfile":
        prompt = `Create an ideal franchise partner profile for:
- Brand: ${safe.brandName || "the brand"}
- Industry: ${safe.industry || "not specified"}
- Model: ${safe.businessModel || "franchise"}
- Investment: ${safe.investmentRange || "varies"}

Describe the ideal partner in 3 concise paragraphs:
1. Background and experience (skills, industry knowledge)
2. Personal qualities and values (traits, work ethic)
3. Resources and commitment (financial capacity, time, dedication)

Keep it professional and specific. 150-200 words total.`;
        break;

      case "enhance":
        prompt = `As a professional editor, improve this ${safe.purpose || "brand description"}:

"${safe.content}"

Make it:
1. More compelling and engaging
2. Clear and concise
3. Professional yet approachable
4. Action-oriented
5. Better structured

Keep the same length (±20 words). Return ONLY the improved version without explanation.`;
        break;

      default:
        throw new functions.https.HttpsError("invalid-argument", "Invalid content type");
    }

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return { success: true, content: text.trim(), contentType };
    } catch (error) {
      console.error("Error generating content:", error.message);
      throw new functions.https.HttpsError("internal", "Content generation failed");
    }
  });


// ---------------------------------------------------------------------------
// Firestore trigger: onInquiryCreated
// Notifies a brand owner (in-app + email) about a new franchise inquiry.
// Runs server-side because inquirers can't read the owner's users/ doc, and
// the email address must never be exposed to the browser.
// ---------------------------------------------------------------------------
const APP_URL = (process.env.APP_URL || "https://ikama.in").replace(/\/$/, "");

const escapeHtml = (val) => String(val ?? "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#39;");

const buildLeadEmailHtml = (d) => {
  const row = (label, value) => `
        <div style="margin: 8px 0; padding: 8px 0; border-bottom: 1px solid #e3f2fd;">
          <strong style="color: #333;">${label}:</strong> <span style="color: #555;">${escapeHtml(value)}</span>
        </div>`;
  const message = d.message ? `
      <div style="background-color: #fff8f0; border-left: 4px solid #ff9800; padding: 15px 20px; margin: 20px 0; border-radius: 4px;">
        <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #ff9800;">Message:</h3>
        <p style="margin: 0; font-size: 14px; color: #555555; line-height: 1.6; white-space: pre-line;">${escapeHtml(d.message)}</p>
      </div>` : "";
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <div style="background: linear-gradient(135deg, #5a76a9 0%, #3a5483 100%); padding: 30px 20px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">ikama</h1>
    </div>
    <div style="padding: 40px 30px;">
      <h2 style="font-size: 24px; color: #5a76a9; margin-bottom: 20px; text-align: center;">New Franchise Inquiry!</h2>
      <p style="font-size: 16px; color: #555555; line-height: 1.6;">Hello <strong>${escapeHtml(d.ownerName)}</strong>,</p>
      <p style="font-size: 16px; color: #555555; line-height: 1.6;">
        Great news! Someone is interested in <strong>${escapeHtml(d.brandName)}</strong>.
      </p>
      <div style="background-color: #f0f7ff; border-left: 4px solid #5a76a9; padding: 15px 20px; margin: 20px 0; border-radius: 4px;">
        <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #5a76a9;">Inquiry Details:</h3>${row("Name", d.inquirerName)}${row("Email", d.inquirerEmail)}${row("Phone", d.inquirerPhone)}${row("Investment Range", d.budget)}${row("Location", d.location)}
      </div>${message}
      <div style="text-align: center; margin: 30px 0;">
        <a href="${APP_URL}/dashboard/leads" style="display: inline-block; padding: 14px 32px; background-color: #5a76a9; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600;">
          View in Dashboard
        </a>
      </div>
    </div>
    <div style="background-color: #f9f9f9; padding: 30px; text-align: center; border-top: 1px solid #eeeeee;">
      <p style="font-size: 12px; color: #999999;"><a href="mailto:support@ikama.in" style="color: #5a76a9;">support@ikama.in</a></p>
    </div>
  </div>
</body>
</html>`;
};

// EmailJS REST API. Server-side sends need the account's private key and
// "Allow EmailJS API for non-browser applications" enabled (Account → Security).
const sendEmailJs = async ({ toEmail, toName, subject, html }) => {
  const {
    EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY, EMAILJS_PRIVATE_KEY,
  } = process.env;
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY || !EMAILJS_PRIVATE_KEY) {
    console.warn("EmailJS server credentials not configured in functions/.env — skipping lead email");
    return false;
  }
  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      accessToken: EMAILJS_PRIVATE_KEY,
      template_params: {
        to_email: toEmail,
        to_name: toName,
        from_name: "ikama",
        reply_to: "support@ikama.in",
        subject,
        message: html,
        html_content: html,
      },
    }),
  });
  if (!response.ok) {
    throw new Error(`EmailJS ${response.status}: ${await response.text()}`);
  }
  return true;
};

exports.onInquiryCreated = functions.firestore
  .document("brandfranchiseInquiry/{inquiryId}")
  .onCreate(async (snap, context) => {
    const { inquiryId } = context.params;
    const lead = snap.data() || {};
    const ownerId = lead.brandOwnerId;
    if (!ownerId || !lead.brandId) {
      console.warn(`Inquiry ${inquiryId} has no brandOwnerId/brandId — skipping`);
      return;
    }

    // Defense in depth (rules check this too): the owner must own the brand
    const db = admin.firestore();
    const brandSnap = await db.doc(`brands/${lead.brandId}`).get();
    if (!brandSnap.exists || brandSnap.get("userId") !== ownerId) {
      console.warn(`Inquiry ${inquiryId}: brandOwnerId does not own brand ${lead.brandId} — skipping`);
      return;
    }

    const prospectName = `${lead.firstName || ""} ${lead.lastName || ""}`.trim() || "Someone";
    const location = lead.userAddress?.city || lead.brandFranchiseLocation?.city || "Not specified";

    // Notification id = inquiry id: create() fails on retry, so a re-delivered
    // event can't double-notify or double-email.
    try {
      await db.doc(`users/${ownerId}/notifications/${inquiryId}`).create({
        type: "new_lead",
        title: "New Franchise Inquiry",
        message: `${prospectName} is interested in your ${lead.brandName} franchise`,
        leadId: inquiryId,
        brandName: lead.brandName || "",
        prospectName,
        prospectEmail: lead.email || "",
        budget: lead.budget || "",
        location,
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      if (error.code === 6) { // ALREADY_EXISTS
        console.log(`Inquiry ${inquiryId} already processed`);
        return;
      }
      throw error;
    }

    // Owner email: profile doc first, then the auth record
    let ownerEmail = null;
    let ownerName = "Brand Owner";
    const ownerSnap = await db.doc(`users/${ownerId}`).get();
    if (ownerSnap.exists) {
      ownerEmail = ownerSnap.get("email") || null;
      ownerName = ownerSnap.get("displayName") || ownerName;
    }
    if (!ownerEmail) {
      try {
        const authUser = await admin.auth().getUser(ownerId);
        ownerEmail = authUser.email || null;
        ownerName = authUser.displayName || ownerName;
      } catch (error) {
        console.warn(`Could not load auth record for ${ownerId}:`, error.message);
      }
    }
    if (!ownerEmail) {
      console.warn(`No email for brand owner ${ownerId} — in-app notification only`);
      return;
    }

    try {
      await sendEmailJs({
        toEmail: ownerEmail,
        toName: ownerName,
        subject: `New Franchise Inquiry for ${lead.brandName || "your brand"}`,
        html: buildLeadEmailHtml({
          ownerName,
          brandName: lead.brandName,
          inquirerName: prospectName,
          inquirerEmail: lead.email,
          inquirerPhone: lead.phone || "Not provided",
          budget: lead.budget || "Not specified",
          location,
          message: lead.comments,
        }),
      });
    } catch (error) {
      // The in-app notification already landed; don't retry the whole trigger
      console.error(`Lead email for inquiry ${inquiryId} failed:`, error.message);
    }
  });
