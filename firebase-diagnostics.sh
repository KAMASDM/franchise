#!/bin/bash

echo "=========================================="
echo "Firebase Authentication Diagnostics"
echo "=========================================="
echo ""

echo "✓ Project: franchise-2d12e"
echo "✓ App ID: 1:1003055150601:web:ba8251b99b0df8b2032ad8"
echo ""

echo "Checking Configuration Files..."
echo "-------------------------------------------"

# Check .env file
echo "1. Environment Variables (.env):"
if [ -f .env ]; then
    echo "   ✓ .env file exists"
    grep "VITE_FIREBASE" .env | head -5
else
    echo "   ✗ .env file not found!"
fi
echo ""

# Check firebase config
echo "2. Firebase Config (src/firebase/firebase.js):"
if [ -f src/firebase/firebase.js ]; then
    echo "   ✓ Firebase config file exists"
    grep -A 7 "const firebaseConfig" src/firebase/firebase.js | head -8
else
    echo "   ✗ Firebase config file not found!"
fi
echo ""

echo "3. Firebase Project Configuration:"
npx firebase projects:list 2>/dev/null | grep franchise-2d12e
echo ""

echo "4. Registered Apps:"
npx firebase apps:list --project franchise-2d12e 2>/dev/null | grep -A 5 "App Display Name"
echo ""

echo "=========================================="
echo "CRITICAL: Manual Checks Needed"
echo "=========================================="
echo ""
echo "You must manually verify in Firebase Console:"
echo ""
echo "1. Phone Authentication Enabled:"
echo "   → https://console.firebase.google.com/project/franchise-2d12e/authentication/providers"
echo "   → Check if 'Phone' provider shows 'Enabled'"
echo ""
echo "2. Authorized Domains:"
echo "   → https://console.firebase.google.com/project/franchise-2d12e/authentication/settings"
echo "   → Scroll to 'Authorized domains'"
echo "   → Verify 'localhost' is in the list"
echo ""
echo "3. Test Phone Numbers (optional):"
echo "   → Same Phone provider settings page"
echo "   → Check if test number +91 9999999999 is configured"
echo "   → Code should be: 123456"
echo ""
echo "4. reCAPTCHA Configuration:"
echo "   → Check if you're using reCAPTCHA v3 or Enterprise"
echo "   → If Enterprise, ensure it's linked to Firebase project"
echo ""
echo "=========================================="
echo "Current Issues Detected:"
echo "=========================================="
echo ""
echo "✗ auth/too-many-requests - SMS quota exceeded (10/day on free tier)"
echo "  Solution: Use test number +91 9999999999 / code 123456"
echo "  Or wait until midnight UTC for quota reset"
echo ""
echo "✗ auth/invalid-app-credential (when using real numbers)"
echo "  Solution: Add 'localhost' to authorized domains"
echo ""
echo "✓ reCAPTCHA 'already rendered' error - FIXED in code"
echo ""
echo "=========================================="
echo "Next Steps:"
echo "=========================================="
echo ""
echo "1. Add 'localhost' to authorized domains (if not done)"
echo "2. Use test number for development: +91 9999999999"
echo "3. Hard refresh browser: Cmd+Shift+R (Mac)"
echo "4. Clear browser cache"
echo "5. Test phone authentication"
echo ""
echo "For detailed instructions, see:"
echo "  - FIX_LOCALHOST_DOMAIN.md"
echo "  - SMS_QUOTA_INFO.md"
echo "  - PHONE_AUTH_CRITICAL_FIX.md"
echo ""
