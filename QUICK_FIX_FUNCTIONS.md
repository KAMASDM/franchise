# 🔧 Quick Fix: Firebase Functions & Gemini API

## The Issues
1. ❌ `startChat` Firebase function is not deployed
2. ❌ Gemini API key is missing from environment

---

## 🚀 Quick Solution (3 Steps)

### Step 1: Get Your Gemini API Key
Visit: https://aistudio.google.com/app/apikey

Click "Create API Key" and copy it.

---

### Step 2: Configure Firebase Functions

```bash
# Replace YOUR_KEY_HERE with your actual Gemini API key
firebase functions:config:set gemini.api_key="YOUR_KEY_HERE"
```

**Example:**
```bash
firebase functions:config:set gemini.api_key="AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

---

### Step 3: Deploy Functions

**Option A - Use the deployment script (recommended):**
```bash
./deploy-functions.sh
```

**Option B - Deploy manually:**
```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

---

## ✅ Verify Deployment

After deployment, you should see:

```
✔ functions[sendMessage(us-central1)] Successful update operation.
✔ functions[startChat(us-central1)] Successful update operation.

Function URL (sendMessage): https://us-central1-YOUR_PROJECT.cloudfunctions.net/sendMessage
Function URL (startChat): https://us-central1-YOUR_PROJECT.cloudfunctions.net/startChat
```

---

## 🧪 Test Your Functions

### Test with curl:

```bash
# Replace YOUR_PROJECT_ID with your Firebase project ID
curl -X POST \
  https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/sendMessage \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What franchise opportunities are available?",
    "chatHistory": [],
    "systemPrompt": "You are a helpful franchise consultant."
  }'
```

Expected response:
```json
{
  "success": true,
  "response": "Based on your interests..."
}
```

---

## 📝 Optional: Local Development Setup

Create a `.env` file in the project root:

```bash
# Copy the example
cp .env.example .env

# Edit .env and add your keys
nano .env  # or use any text editor
```

Add these lines to `.env`:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 🐛 Troubleshooting

### Problem: "API key not configured" error
**Solution:**
```bash
firebase functions:config:set gemini.api_key="YOUR_KEY"
firebase deploy --only functions
```

### Problem: Functions not deploying
**Solution:**
```bash
# Install dependencies
cd functions
npm install
cd ..

# Deploy again
firebase deploy --only functions
```

### Problem: Need to see function logs
**Solution:**
```bash
firebase functions:log
```

### Problem: Check current configuration
**Solution:**
```bash
firebase functions:config:get
```

---

## 📚 Full Documentation

See `FIREBASE_FUNCTIONS_SETUP.md` for complete documentation.

---

## ⚡ Quick Commands Cheat Sheet

```bash
# Set Gemini API key
firebase functions:config:set gemini.api_key="YOUR_KEY"

# Deploy functions
firebase deploy --only functions

# View logs
firebase functions:log

# Check config
firebase functions:config:get

# List deployed functions
firebase functions:list

# Run local emulator
firebase emulators:start --only functions
```

---

## 🎯 What's Next?

After deployment:
1. ✅ Copy the function URLs
2. ✅ Update your frontend `.env` file with the URLs (optional)
3. ✅ Test the chatbot in your app
4. ✅ Monitor logs with `firebase functions:log`

---

**Need help?** Check `FIREBASE_FUNCTIONS_SETUP.md` for detailed instructions!
