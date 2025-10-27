#!/bin/bash

# Firebase Functions Deployment Script
# This script helps deploy Firebase Functions with the Gemini API

echo "🚀 Firebase Functions Deployment Script"
echo "========================================"
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found!"
    echo "📦 Install it with: npm install -g firebase-tools"
    exit 1
fi

echo "✅ Firebase CLI found"
echo ""

# Check if user is logged in
if ! firebase projects:list &> /dev/null; then
    echo "🔐 Not logged in to Firebase"
    echo "Running: firebase login"
    firebase login
fi

echo "✅ Logged in to Firebase"
echo ""

# Get current project
PROJECT=$(firebase use)
echo "📋 Current project: $PROJECT"
echo ""

# Check if Gemini API key is configured
echo "🔍 Checking Gemini API configuration..."
CONFIG=$(firebase functions:config:get 2>&1)

if echo "$CONFIG" | grep -q "gemini"; then
    echo "✅ Gemini API key is configured"
else
    echo "⚠️  Gemini API key NOT configured"
    echo ""
    echo "📝 To set it up:"
    echo "   1. Get your API key from: https://aistudio.google.com/app/apikey"
    echo "   2. Run: firebase functions:config:set gemini.api_key=\"YOUR_KEY\""
    echo ""
    read -p "Do you want to set it now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter your Gemini API key: " GEMINI_KEY
        firebase functions:config:set gemini.api_key="$GEMINI_KEY"
        echo "✅ API key configured"
    else
        echo "⚠️  Skipping API key configuration. Functions may not work correctly."
    fi
fi

echo ""
echo "📦 Installing function dependencies..."
cd functions
npm install
cd ..
echo "✅ Dependencies installed"
echo ""

# Deploy functions
echo "🚀 Deploying Firebase Functions..."
echo "   - sendMessage (Gemini chatbot)"
echo "   - startChat (Initialize chat)"
echo ""

firebase deploy --only functions

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Copy the function URLs from above"
    echo "   2. Update your .env file with the URLs"
    echo "   3. Test the functions using the testing guide"
    echo ""
    echo "📚 See FIREBASE_FUNCTIONS_SETUP.md for more details"
else
    echo ""
    echo "❌ Deployment failed!"
    echo "📚 Check FIREBASE_FUNCTIONS_SETUP.md for troubleshooting"
    exit 1
fi
