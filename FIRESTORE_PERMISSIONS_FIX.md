# Firestore Permissions Fix - User Management

## Problem
The AdminUserManagement component was failing with the error:
```
FirebaseError: Missing or insufficient permissions
```

This occurred because the Firestore security rules didn't allow admins to list all users from the `users` collection.

## Root Cause
The original rule was:
```javascript
match /users/{userId} {
  allow read: if request.auth.uid == userId || isAdmin();
  allow create, update: if request.auth.uid == userId;
}
```

The `allow read` permission only applies to individual document reads (`get` operations), not to queries that list multiple documents (`list` operations).

## Solution Applied

### 1. Updated Firestore Rules (Local File)
Changed the rule to explicitly allow admins to list users:
```javascript
match /users/{userId} {
  allow get: if request.auth.uid == userId || isAdmin();
  allow list: if isAdmin();
  allow create, update: if request.auth.uid == userId;
}
```

**Key Changes:**
- Split `allow read` into `allow get` and `allow list`
- `allow get`: Users can read their own data, admins can read any user
- `allow list`: Only admins can query/list all users
- This prevents unauthorized users from listing all users while still allowing self-access

### 2. Added Error Handling to useAllUsers Hook
```javascript
const [error, setError] = useState(null);

// Added try-catch with error state
catch (error) {
    console.error("Error fetching users:", error);
    setError(error.message || "Failed to load users");
    setUsers([]); // Set empty array on error
}

return { users, loading, error };
```

### 3. Added Error Handling to AdminUserManagement Component
- Displays user-friendly error message if permissions are missing
- Provides guidance on how to fix the issue
- Prevents component crash with graceful degradation

## ⚠️ IMPORTANT: Deploy Updated Rules to Firebase

The updated rules are saved in `firestore.rules` but **must be deployed to Firebase Console** to take effect.

### How to Deploy Firestore Rules:

#### Option 1: Firebase Console (Web UI)
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Firestore Database** → **Rules** tab
4. Copy the entire contents of `firestore.rules` from this project
5. Paste into the Firebase Console rules editor
6. Click **Publish**

#### Option 2: Firebase CLI (Recommended)
```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy only Firestore rules
firebase deploy --only firestore:rules

# Or deploy all Firebase features
firebase deploy
```

### Verify Rules Deployed
After deployment, the AdminUserManagement component should:
- ✅ Load the list of all users for admins
- ✅ Display user roles (Admin/User)
- ✅ Allow promoting users to admin
- ✅ Show last login times

### Testing
1. Log in as an admin user
2. Navigate to Admin Dashboard → User Management
3. Verify the user list loads without errors
4. Test promoting a user to admin role
5. Confirm role changes are reflected immediately

## Files Modified
1. `firestore.rules` - Updated users collection permissions
2. `src/hooks/useAllUsers.js` - Added error state handling
3. `src/components/admin/AdminUserManagement.jsx` - Added error UI display

## Security Considerations
- ✅ Only admins can list all users (protected by `isAdmin()` function)
- ✅ Regular users can only read their own data
- ✅ User creation/updates still restricted to the user themselves
- ✅ No sensitive data exposed to unauthorized users

## Next Steps
1. **Deploy the updated Firestore rules** (see above)
2. Test AdminUserManagement with admin account
3. Verify regular users cannot access admin features
4. Continue with Phase 3 remaining features (Live Chat System)
