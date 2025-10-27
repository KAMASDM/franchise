# Firebase Functions & Gemini API Setup Guide

## 🔧 Issue 1: Deploy Firebase Functions

The `startChat` and `sendMessage` functions need to be deployed to Firebase.

### Step 1: Deploy Functions

```bash
cd /Users/jigardesai/Desktop/franchise/franchise-portal

# Deploy all functions
firebase deploy --only functions

# Or deploy specific functions
firebase deploy --only functions:startChat,functions:sendMessage
```

### Step 2: Verify Deployment

After deployment, you should see output like:
```
✔ functions[startChat(us-central1)] Successful create operation.
✔ functions[sendMessage(us-central1)] Successful create operation.

Function URL (startChat): https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/startChat
Function URL (sendMessage): https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/sendMessage
```

---

## 🔑 Issue 2: Add Gemini API Key

You need to add your Gemini API key to Firebase Functions configuration.

### Option 1: Using Firebase Environment Config (Recommended for Production)

```bash
# Set the Gemini API key
firebase functions:config:set gemini.api_key="YOUR_GEMINI_API_KEY_HERE"

# Verify it was set
firebase functions:config:get

# Redeploy functions after setting config
firebase deploy --only functions
```

### Option 2: Using .env File (For Local Development)

1. **Create .env file in project root:**

```bash
cd /Users/jigardesai/Desktop/franchise/franchise-portal

# Copy the example file
cp .env.example .env
```

2. **Edit .env file and add:**

```bash
# Add this line to your .env file
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Example (replace with your actual key):
# GEMINI_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

3. **For Functions to use .env in local emulator:**

Create `functions/.env` file:
```bash
cd functions
echo "GEMINI_API_KEY=your_actual_gemini_api_key_here" > .env
```

---

## 🎯 Get Your Gemini API Key

If you don't have a Gemini API key yet:

1. **Visit Google AI Studio:**
   - Go to: https://makersuite.google.com/app/apikey
   - Or: https://aistudio.google.com/app/apikey

2. **Create API Key:**
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the generated key

3. **Important:** Keep this key secure and never commit it to version control!

---

## 📋 Complete Setup Steps

### 1. Get Gemini API Key
```bash
# Visit https://aistudio.google.com/app/apikey
# Copy your API key
```

### 2. Set Firebase Function Config
```bash
# Replace YOUR_KEY_HERE with your actual Gemini API key
firebase functions:config:set gemini.api_key="YOUR_KEY_HERE"
```

### 3. Deploy Functions
```bash
# Deploy all functions
firebase deploy --only functions

# Wait for deployment to complete
```

### 4. Update .env File (Optional - for local development)
```bash
# Create .env file
cp .env.example .env

# Edit .env and add:
# GEMINI_API_KEY=your_key_here
```

### 5. Verify Setup
```bash
# Check Firebase config
firebase functions:config:get

# Should show:
# {
#   "gemini": {
#     "api_key": "AIzaSy..."
#   }
# }
```

---

## 🧪 Test the Functions

### Test Locally with Emulator

```bash
# Start Firebase emulators
firebase emulators:start --only functions

# Functions will be available at:
# http://localhost:5001/YOUR_PROJECT_ID/us-central1/startChat
# http://localhost:5001/YOUR_PROJECT_ID/us-central1/sendMessage
```

### Test Deployed Functions

Use curl or Postman:

```bash
# Test sendMessage
curl -X POST \
  https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/sendMessage \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, what franchise opportunities do you have?",
    "chatHistory": [],
    "systemPrompt": "You are a helpful franchise consultant."
  }'

# Test startChat
curl -X POST \
  https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/startChat \
  -H "Content-Type: application/json" \
  -d '{
    "systemPrompt": "You are a helpful franchise consultant.",
    "initialMessage": "Tell me about franchise opportunities."
  }'
```

---

## 🔒 Security Best Practices

### 1. Never Commit API Keys

Add to `.gitignore`:
```bash
# .gitignore
.env
.env.local
.env.production
functions/.env
functions/.runtimeconfig.json
```

### 2. Use Environment-Specific Keys

- **Development**: Use `.env` file locally
- **Production**: Use Firebase Functions config

### 3. Restrict API Key Usage

In Google Cloud Console:
1. Go to: https://console.cloud.google.com/apis/credentials
2. Select your Gemini API key
3. Add restrictions:
   - HTTP referrers (for web apps)
   - IP addresses (for servers)
   - API restrictions (only Gemini API)

---

## 🐛 Troubleshooting

### Issue: "API key not configured" error

**Solution:**
```bash
# Set the API key
firebase functions:config:set gemini.api_key="YOUR_KEY"

# Redeploy
firebase deploy --only functions
```

### Issue: Functions not found (404)

**Solution:**
```bash
# List deployed functions
firebase functions:list

# Deploy again
firebase deploy --only functions
```

### Issue: Rate limit errors

**Solution:**
The functions have built-in rate limiting (20 requests/minute per IP). For higher limits, modify in `functions/index.js`:

```javascript
if (!checkRateLimit(clientIp, 100, 60000)) { // 100 requests per minute
```

### Issue: Local emulator not working

**Solution:**
```bash
# Install dependencies
cd functions
npm install

# Start emulator
firebase emulators:start --only functions
```

---

## 📊 Function Configuration

Current settings in `functions/index.js`:

```javascript
exports.sendMessage = functions
  .runWith({
    timeoutSeconds: 540,    // 9 minutes timeout
    memory: "1GB"           // 1GB memory allocation
  })
```

To modify:
- **Timeout**: Max 540 seconds (9 minutes)
- **Memory**: Options: 128MB, 256MB, 512MB, 1GB, 2GB, 4GB, 8GB
- **Region**: Default is us-central1

---

## 🔄 Update Frontend URLs

After deployment, update your frontend `.env` file:

```bash
# .env
VITE_FIREBASE_SEND_MESSAGE_URL=https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/sendMessage
VITE_FIREBASE_START_CHAT_URL=https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/startChat
```

Or the app will auto-construct URLs from your Firebase config.

---

## ✅ Verification Checklist

- [ ] Gemini API key obtained from Google AI Studio
- [ ] API key set in Firebase Functions config
- [ ] Functions deployed successfully
- [ ] Function URLs received after deployment
- [ ] .env file created (optional, for local dev)
- [ ] .gitignore updated to exclude .env files
- [ ] Functions tested with curl/Postman
- [ ] Frontend .env updated with function URLs
- [ ] Rate limiting configured appropriately

---

## 🚀 Quick Commands Summary

```bash
# 1. Set API key
firebase functions:config:set gemini.api_key="YOUR_KEY_HERE"

# 2. Deploy functions
firebase deploy --only functions

# 3. Verify config
firebase functions:config:get

# 4. Test locally (optional)
firebase emulators:start --only functions

# 5. View logs
firebase functions:log
```

---

## 📞 Need Help?

- **Firebase Functions Docs**: https://firebase.google.com/docs/functions
- **Gemini API Docs**: https://ai.google.dev/docs
- **Check function logs**: `firebase functions:log`
- **Check function status**: `firebase functions:list`

---

**Next Step**: Run the deployment command below! 👇

```bash
firebase functions:config:set gemini.api_key="YOUR_GEMINI_API_KEY"
firebase deploy --only functions
```
