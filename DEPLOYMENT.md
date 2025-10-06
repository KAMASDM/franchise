# 🚀 Production Deployment Checklist

## ✅ Pre-Deployment Setup

### 1. Environment Configuration
- [ ] Create `.env` file with all required Firebase configuration variables
- [ ] Set up Firebase project in production mode
- [ ] Configure Firebase Hosting
- [ ] Deploy Firebase Functions with proper environment variables
- [ ] Set up Firestore security rules (use `firestore.rules` template)

### 2. Security Configuration
- [ ] Configure Firebase Authentication providers (Google OAuth)
- [ ] Set up proper CORS settings for Firebase Functions
- [ ] Review and deploy Firestore security rules
- [ ] Configure Firebase Storage security rules if using file uploads
- [ ] Add your domain to Firebase authorized domains

### 3. Performance Optimization
- [ ] Run `npm run build` to check for build warnings
- [ ] Optimize images and assets
- [ ] Enable Firebase Performance Monitoring
- [ ] Set up CDN for static assets (if needed)

### 4. Monitoring & Analytics
- [ ] Enable Firebase Analytics
- [ ] Set up error tracking (Firebase Crashlytics or external service)
- [ ] Configure Firebase Performance Monitoring
- [ ] Set up uptime monitoring

## ✅ Environment Variables Required

Create a `.env` file with these variables:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Optional - Firebase Functions URLs
VITE_FIREBASE_SEND_MESSAGE_URL=https://us-central1-your-project-id.cloudfunctions.net/sendMessage
VITE_FIREBASE_START_CHAT_URL=https://us-central1-your-project-id.cloudfunctions.net/startChat
```

## ✅ Firebase Functions Setup

1. Navigate to `/functions` directory
2. Install dependencies: `npm install`
3. Set Gemini API key: `firebase functions:config:set gemini.api_key="YOUR_GEMINI_API_KEY"`
4. Deploy functions: `firebase deploy --only functions`

## ✅ Firebase Hosting Deployment

1. Build the project: `npm run build`
2. Initialize Firebase hosting: `firebase init hosting`
3. Deploy: `firebase deploy --only hosting`

## ✅ Post-Deployment Testing

### Functionality Testing
- [ ] User registration and login
- [ ] Brand registration and approval workflow
- [ ] Franchise inquiry form submission
- [ ] Chatbot functionality with brand recommendations
- [ ] Admin dashboard access and functionality
- [ ] Search and filter functionality
- [ ] Mobile responsiveness

### Performance Testing  
- [ ] Page load speeds (aim for < 3 seconds)
- [ ] Large dataset handling
- [ ] Image loading optimization
- [ ] API response times

### Security Testing
- [ ] Authentication flows
- [ ] Protected routes
- [ ] Admin-only access restrictions
- [ ] Data validation and sanitization
- [ ] HTTPS enforcement

## ⚠️ Known Issues to Monitor

1. **Bundle Size**: Main bundle is ~1.3MB - monitor performance impact
2. **Firebase Costs**: Monitor Firestore reads/writes and Function invocations
3. **Gemini API Usage**: Monitor AI API costs and rate limits

## 🔧 Maintenance Tasks

### Regular Updates
- [ ] Update dependencies monthly
- [ ] Monitor Firebase usage and costs
- [ ] Review and update security rules
- [ ] Backup Firestore data regularly

### Performance Monitoring
- [ ] Monitor Core Web Vitals
- [ ] Check error rates and user feedback
- [ ] Review analytics data
- [ ] Optimize database queries if needed

## 📞 Support Information

- Firebase Console: https://console.firebase.google.com/
- Error Monitoring: Check Firebase Console -> Functions -> Logs
- Performance: Firebase Console -> Performance
- Analytics: Firebase Console -> Analytics