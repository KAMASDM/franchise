import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { auth, provider, db } from '../firebase/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { sendWelcomeEmail, sendEmailVerification as sendVerificationEmail, sendPhoneVerificationEmail, sendNewDeviceLoginEmail } from './emailServiceNew';

/**
 * Unified Authentication Service
 * Handles email/password, phone OTP, and Google sign-in
 */

class AuthService {
  constructor() {
    this.recaptchaVerifier = null;
    this.confirmationResult = null;
  }

  /**
   * Initialize reCAPTCHA for phone authentication
   * Using invisible reCAPTCHA for better UX
   */
  async initializeRecaptcha() {
    if (!this.recaptchaVerifier) {
      try {
        // Clear the container first to prevent "already rendered" error
        const container = document.getElementById('recaptcha-container');
        if (container) {
          container.innerHTML = '';
        }

        this.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: (response) => {
            console.log('reCAPTCHA verified successfully');
          },
          'expired-callback': () => {
            console.log('reCAPTCHA expired, please verify again');
            this.clearRecaptcha();
          },
        });
        
        // Render the invisible reCAPTCHA
        await this.recaptchaVerifier.render();
        console.log('Invisible reCAPTCHA initialized and rendered');
      } catch (error) {
        console.error('Error initializing reCAPTCHA:', error);
        // Clear on error to allow retry
        this.clearRecaptcha();
        throw new Error('Failed to initialize reCAPTCHA. Please refresh the page.');
      }
    }
    return this.recaptchaVerifier;
  }

  /**
   * Clear reCAPTCHA verifier
   */
  clearRecaptcha() {
    if (this.recaptchaVerifier) {
      try {
        this.recaptchaVerifier.clear();
      } catch (error) {
        console.log('Error clearing reCAPTCHA:', error);
      }
      this.recaptchaVerifier = null;
    }
    
    // Clear the container
    const container = document.getElementById('recaptcha-container');
    if (container) {
      container.innerHTML = '';
    }
  }

  /**
   * Create user document in Firestore
   */
  async createUserDocument(user, additionalData = {}) {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      const { email, displayName, phoneNumber, photoURL } = user;
      
      await setDoc(userRef, {
        uid: user.uid,
        email: email || additionalData.email || null,
        displayName: displayName || `${additionalData.firstName} ${additionalData.lastName}` || '',
        phoneNumber: phoneNumber || additionalData.phone || null,
        photoURL: photoURL || null,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        emailVerified: user.emailVerified,
        loginDevices: [], // Track devices for new device login detection
        ...additionalData,
      });

      return true; // New user
    } else {
      // Update last login
      await setDoc(
        userRef,
        {
          lastLogin: serverTimestamp(),
        },
        { merge: true }
      );

      return false; // Existing user
    }
  }

  /**
   * Check for new device login and send notification if needed
   */
  async checkAndNotifyNewDevice(user) {
    try {
      // Generate a device fingerprint (simple implementation)
      const deviceInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        screenResolution: `${screen.width}x${screen.height}`,
        timestamp: Date.now()
      };
      
      const deviceFingerprint = btoa(JSON.stringify({
        userAgent: deviceInfo.userAgent.substring(0, 50), // Truncate for storage
        platform: deviceInfo.platform,
        timezone: deviceInfo.timezone
      }));

      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const loginDevices = userData.loginDevices || [];
        
        // Check if this device fingerprint exists
        const existingDevice = loginDevices.find(device => device.fingerprint === deviceFingerprint);
        
        if (!existingDevice) {
          // New device detected - send email notification
          if (userData.email) {
            try {
              await sendNewDeviceLoginEmail({
                email: userData.email,
                name: userData.displayName || 'User',
                deviceInfo: {
                  platform: deviceInfo.platform,
                  browser: this.getBrowserName(deviceInfo.userAgent),
                  location: deviceInfo.timezone,
                  loginTime: new Date().toLocaleString('en-IN', {
                    dateStyle: 'long',
                    timeStyle: 'short',
                    timeZone: 'Asia/Kolkata'
                  })
                }
              });
              console.log('New device login email sent to:', userData.email);
            } catch (emailError) {
              console.error('Failed to send new device login email:', emailError);
              // Don't block login if email fails
            }
          }
          
          // Add new device to the list (keep only last 5 devices)
          const newDevice = {
            fingerprint: deviceFingerprint,
            platform: deviceInfo.platform,
            userAgent: deviceInfo.userAgent.substring(0, 100),
            lastSeen: serverTimestamp(),
            firstSeen: serverTimestamp()
          };
          
          const updatedDevices = [newDevice, ...loginDevices].slice(0, 5);
          
          // Update user document with new device
          await setDoc(userRef, {
            loginDevices: updatedDevices
          }, { merge: true });
        } else {
          // Update last seen for existing device
          const updatedDevices = loginDevices.map(device => 
            device.fingerprint === deviceFingerprint 
              ? { ...device, lastSeen: serverTimestamp() }
              : device
          );
          
          await setDoc(userRef, {
            loginDevices: updatedDevices
          }, { merge: true });
        }
      }
    } catch (error) {
      console.error('Error in new device detection:', error);
      // Don't throw - this is optional functionality
    }
  }

  /**
   * Get browser name from user agent (helper method)
   */
  getBrowserName(userAgent) {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    return 'Unknown Browser';
  }

  /**
   * Email/Password Registration
   */
  async registerWithEmail(email, password, firstName, lastName) {
    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile with display name
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      });

      // Create Firestore user document
      const isNewUser = await this.createUserDocument(user, {
        firstName,
        lastName,
        authMethod: 'email',
      });

      // Send email verification
      await sendEmailVerification(user);

      // Send welcome email
      try {
        await sendVerificationEmail({
          email: user.email,
          name: `${firstName} ${lastName}`,
          verificationLink: user.emailVerificationLink || window.location.origin,
        });
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
      }

      return {
        success: true,
        user,
        message: 'Account created! Please check your email to verify your account.',
      };
    } catch (error) {
      console.error('Email registration error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Email/Password Sign In
   */
  async signInWithEmail(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user document (this also handles new vs existing user detection)
      const isNewUser = await this.createUserDocument(user);

      // Check for new device login (only for existing users)
      if (!isNewUser) {
        await this.checkAndNotifyNewDevice(user);
      }

      if (!user.emailVerified) {
        return {
          success: true,
          user,
          warning: 'Please verify your email address. Check your inbox for the verification link.',
        };
      }

      return {
        success: true,
        user,
        message: 'Successfully signed in!',
      };
    } catch (error) {
      console.error('Email sign-in error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Google Sign In
   */
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Create or update user document
      const isNewUser = await this.createUserDocument(user, {
        authMethod: 'google',
      });

      if (isNewUser) {
        // Send welcome email for new users
        try {
          await sendWelcomeEmail({
            email: user.email,
            name: user.displayName || 'User',
          });
        } catch (emailError) {
          console.error('Failed to send welcome email:', emailError);
        }
      } else {
        // Check for new device login (only for existing users)
        await this.checkAndNotifyNewDevice(user);
      }

      return {
        success: true,
        user,
        isNewUser,
        message: isNewUser ? 'Welcome! Your account has been created.' : 'Welcome back!',
      };
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Send Phone OTP
   */
  async sendPhoneOTP(phoneNumber) {
    try {
      // Initialize and render reCAPTCHA
      const appVerifier = await this.initializeRecaptcha();

      // Send OTP
      this.confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);

      return {
        success: true,
        message: 'OTP sent to your phone number!',
      };
    } catch (error) {
      console.error('Phone OTP error:', error);
      this.clearRecaptcha(); // Properly clear reCAPTCHA on error
      throw this.handleAuthError(error);
    }
  }

  /**
   * Verify Phone OTP
   */
  async verifyPhoneOTP(code, additionalData = {}) {
    try {
      if (!this.confirmationResult) {
        throw new Error('Please request OTP first');
      }

      // Verify OTP
      const result = await this.confirmationResult.confirm(code);
      const user = result.user;

      // Create or update user document
      const isNewUser = await this.createUserDocument(user, {
        authMethod: 'phone',
        ...additionalData,
      });

      if (isNewUser && additionalData.firstName) {
        // Update profile with display name
        await updateProfile(user, {
          displayName: `${additionalData.firstName} ${additionalData.lastName || ''}`,
        });

        // Send welcome email if email is provided
        if (additionalData.email) {
          try {
            await sendWelcomeEmail({
              email: additionalData.email,
              name: `${additionalData.firstName} ${additionalData.lastName || ''}`,
            });
          } catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
          }
        }
      }

      // Send phone verification confirmation email (for all users with email)
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();
      if (userData?.email) {
        try {
          await sendPhoneVerificationEmail({
            email: userData.email,
            name: userData.displayName || `${additionalData.firstName || ''} ${additionalData.lastName || ''}`.trim() || 'User',
            phoneNumber: user.phoneNumber,
          });
          console.log('Phone verification confirmation email sent to:', userData.email);
        } catch (emailError) {
          console.error('Failed to send phone verification email:', emailError);
          // Don't block the verification if email fails
        }
      }

      // Reset
      this.confirmationResult = null;
      this.recaptchaVerifier = null;

      return {
        success: true,
        user,
        isNewUser,
        message: isNewUser ? 'Account created successfully!' : 'Successfully signed in!',
      };
    } catch (error) {
      console.error('OTP verification error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Send Password Reset Email
   */
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);

      return {
        success: true,
        message: 'Password reset link sent to your email!',
      };
    } catch (error) {
      console.error('Password reset error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Update User Password
   */
  async changePassword(currentPassword, newPassword) {
    try {
      const user = auth.currentUser;

      if (!user || !user.email) {
        throw new Error('No user is currently signed in');
      }

      // Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      return {
        success: true,
        message: 'Password updated successfully!',
      };
    } catch (error) {
      console.error('Change password error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Resend Email Verification
   */
  async resendVerificationEmail() {
    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error('No user is currently signed in');
      }

      if (user.emailVerified) {
        return {
          success: false,
          message: 'Email is already verified',
        };
      }

      await sendEmailVerification(user);

      return {
        success: true,
        message: 'Verification email sent!',
      };
    } catch (error) {
      console.error('Resend verification error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Handle Firebase Auth Errors
   */
  handleAuthError(error) {
    const errorMessages = {
      'auth/email-already-in-use': 'This email is already registered. Please sign in instead.',
      'auth/invalid-email': 'Invalid email address format.',
      'auth/operation-not-allowed': 'This sign-in method is not enabled.',
      'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/invalid-phone-number': 'Invalid phone number format. Use +[country code][number]',
      'auth/invalid-verification-code': 'Invalid OTP code. Please try again.',
      'auth/code-expired': 'OTP code has expired. Please request a new one.',
      'auth/too-many-requests': '⚠️ Too many SMS requests! Please wait 1 hour or use test number: +91 9999999999 (code: 123456). Firebase free tier: 10 SMS/day.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
      'auth/popup-closed-by-user': 'Sign-in cancelled.',
      'auth/requires-recent-login': 'Please sign in again to continue.',
      'auth/invalid-app-credential': '⚠️ localhost is not authorized! Go to Firebase Console > Authentication > Settings > Authorized domains > Add "localhost". See FIX_LOCALHOST_DOMAIN.md for instructions.',
    };

    const message = errorMessages[error.code] || error.message || 'An error occurred. Please try again.';

    return new Error(message);
  }

  /**
   * Sign Out
   */
  async signOut() {
    try {
      await auth.signOut();
      return { success: true, message: 'Signed out successfully!' };
    } catch (error) {
      console.error('Sign out error:', error);
      throw new Error('Failed to sign out. Please try again.');
    }
  }
}

// Export singleton instance
const authService = new AuthService();
export default authService;
