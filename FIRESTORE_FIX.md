# 🚨 URGENT FIX: Firestore Security Rules Issue

## Problem
Brand registration is failing with "Missing or insufficient permissions" error.

## Root Cause
Firestore security rules are either:
1. Not configured (defaulting to deny all)
2. Too restrictive for authenticated users

## 🔥 IMMEDIATE FIX

### Step 1: Configure Firestore Security Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database** → **Rules**
4. Copy the contents of `firestore-dev.rules` and paste them
5. Click **Publish**

### Step 2: Verify Authentication

Make sure users are properly authenticated before trying to register brands:

```javascript
// Check in browser console when registering a brand
console.log("Current user:", firebase.auth().currentUser);
```

### Step 3: Test the Fix

1. Sign in to your application
2. Try registering a brand
3. Check browser console for debug messages

## 🔧 TEMPORARY WORKAROUND (For Testing Only)

If you need to test immediately, you can temporarily use these permissive rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

⚠️ **WARNING**: This allows all authenticated users to read/write all data. Use only for testing!

## 🔍 Debug Information Added

The BrandRegistration component now includes debug logging:
- User authentication status
- Data being submitted
- Specific error messages

Check browser console when testing.

## 🛡️ Production-Ready Rules

Use the rules in `firestore.rules` for production (more restrictive and secure).

## ✅ Verification Steps

1. User can sign in/out
2. Brand registration works without errors
3. Data appears in Firestore console
4. Admin can see new brand submissions
5. Security rules prevent unauthorized access