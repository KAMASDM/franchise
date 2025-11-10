import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Card,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
  Divider,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Link as MuiLink,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Phone,
  Lock,
  Google,
  ArrowBack,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';
import FranchiseHubLogo from '../components/common/FranchiseHubLogo';
import { useDevice } from '../hooks/useDevice';

/**
 * Modern Authentication Page
 * Supports: Email/Password, Phone OTP, Google Sign-in
 */
const AuthPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isMobile } = useDevice();
  const [activeTab, setActiveTab] = useState(0); // 0 = Login, 1 = Register

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Cleanup reCAPTCHA when component unmounts or switching auth methods
  useEffect(() => {
    return () => {
      // Clear reCAPTCHA when leaving the page
      authService.clearRecaptcha();
    };
  }, []);

  const [authMethod, setAuthMethod] = useState('email'); // 'email', 'phone'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '+91 ',
    otp: '',
    firstName: '',
    lastName: '',
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError('');
    setSuccess('');
    setOtpSent(false);
    // Clear reCAPTCHA when switching tabs
    authService.clearRecaptcha();
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleEmailPasswordAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (activeTab === 0) {
        // Login
        const result = await authService.signInWithEmail(formData.email, formData.password);
        
        if (result.warning) {
          setSuccess(result.warning);
        } else {
          setSuccess(result.message);
        }
        
        // Redirect after successful login
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        // Register
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }

        const result = await authService.registerWithEmail(
          formData.email,
          formData.password,
          formData.firstName,
          formData.lastName
        );

        setSuccess(result.message);
        
        // Redirect after successful registration
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!otpSent) {
        // Send OTP
        if (!formData.phone.startsWith('+91')) {
          setError('Phone number must start with +91');
          setLoading(false);
          return;
        }

        // Validate Indian phone number format (should be +91 followed by 10 digits)
        const phoneDigits = formData.phone.replace(/\s/g, '').substring(3);
        if (phoneDigits.length !== 10 || !/^\d{10}$/.test(phoneDigits)) {
          setError('Please enter a valid 10-digit mobile number');
          setLoading(false);
          return;
        }

        const result = await authService.sendPhoneOTP(formData.phone.replace(/\s/g, ''));
        setOtpSent(true);
        setSuccess(result.message);
      } else {
        // Verify OTP
        if (formData.otp.length !== 6) {
          setError('Please enter a valid 6-digit OTP');
          setLoading(false);
          return;
        }

        const additionalData = activeTab === 1 ? {
          firstName: formData.firstName,
          lastName: formData.lastName,
        } : {};

        const result = await authService.verifyPhoneOTP(formData.otp, additionalData);
        setSuccess(result.message);
        
        // Redirect after successful verification
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (err) {
      setError(err.message);
      // Clear reCAPTCHA on error to allow retry
      if (!otpSent) {
        authService.clearRecaptcha();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await authService.signInWithGoogle();
      setSuccess(result.message);
      
      // Redirect after successful sign-in
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderEmailPasswordForm = () => (
    <Box component="form" onSubmit={handleEmailPasswordAuth} sx={{ mt: 3 }}>
      {activeTab === 1 && (
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </Box>
      )}

      <TextField
        fullWidth
        label="Email Address"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleInputChange}
        required
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        label="Password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        value={formData.password}
        onChange={handleInputChange}
        required
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {activeTab === 1 && (
        <TextField
          fullWidth
          label="Confirm Password"
          name="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          value={formData.confirmPassword}
          onChange={handleInputChange}
          required
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      )}

      {activeTab === 0 && (
        <Box sx={{ textAlign: 'right', mb: 2 }}>
          <MuiLink
            component={RouterLink}
            to="/forgot-password"
            sx={{ fontSize: '0.875rem' }}
          >
            Forgot Password?
          </MuiLink>
        </Box>
      )}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={loading}
        sx={{ mb: 2, py: 1.5 }}
      >
        {loading ? (
          <CircularProgress size={24} />
        ) : activeTab === 0 ? (
          'Sign In'
        ) : (
          'Create Account'
        )}
      </Button>
    </Box>
  );

  const renderPhoneForm = () => (
    <Box component="form" onSubmit={handlePhoneAuth} sx={{ mt: 3 }}>
      {activeTab === 1 && !otpSent && (
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </Box>
      )}

      <TextField
        fullWidth
        label="Phone Number"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={(e) => {
          // Prevent user from deleting +91
          if (!e.target.value.startsWith('+91')) {
            setFormData(prev => ({ ...prev, phone: '+91 ' }));
          } else {
            handleInputChange(e);
          }
        }}
        required
        disabled={otpSent}
        placeholder="9876543210"
        helperText="Enter your 10-digit mobile number"
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Phone />
            </InputAdornment>
          ),
        }}
      />

      {otpSent && (
        <TextField
          fullWidth
          label="Enter OTP"
          name="otp"
          value={formData.otp}
          onChange={handleInputChange}
          required
          placeholder="6-digit code"
          helperText="Enter the code sent to your phone"
          sx={{ mb: 2 }}
          inputProps={{ maxLength: 6 }}
        />
      )}

      {/* Invisible reCAPTCHA container */}
      <div id="recaptcha-container" style={{ display: 'none' }}></div>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={loading}
        sx={{ mb: 2, py: 1.5 }}
      >
        {loading ? (
          <CircularProgress size={24} />
        ) : otpSent ? (
          'Verify OTP'
        ) : (
          'Send OTP'
        )}
      </Button>

      {otpSent && (
        <Button
          fullWidth
          variant="text"
          onClick={() => {
            setOtpSent(false);
            setError('');
            setSuccess('');
            // Clear reCAPTCHA when changing phone number
            authService.clearRecaptcha();
          }}
          disabled={loading}
        >
          Change Phone Number
        </Button>
      )}
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        py: 4,
        px: isMobile ? 1 : 0,
      }}
    >
      <Container maxWidth="sm" sx={{ width: '100%' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={8}
            sx={{
              p: isMobile ? 1 : 4,
              borderRadius: 3,
              position: 'relative',
              overflow: 'visible',
            }}
          >
            {/* Back to Home Button */}
            <IconButton
              component={RouterLink}
              to="/"
              sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1 }}
            >
              <ArrowBack />
            </IconButton>

            {/* Logo/Brand */}
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center', 
              mb: 4, 
              mt: isMobile ? 6 : 2, 
              width: '100%',
            }}>
             <Card 
  elevation={3}
  sx={{ 
    p: isMobile ? 2 : 3,
    borderRadius: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    bgcolor: 'background.default',
    mb: 2,
    width: '100%', // <-- THE FIX: Force the card to take up full width
    maxWidth: '100%',
    overflow: 'hidden',
  }}
>
  {/* The inner Box is no longer needed */}
  <FranchiseHubLogo 
    width={isMobile ? 480 : 360} 
    height={isMobile ? 104 : 108} 
    variant="full"
    color="primary"
    
  />
</Card>
              <Typography 
                variant={isMobile ? "body2" : "body1"} 
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                Your Gateway to Franchise Opportunities
              </Typography>
            </Box>

            {/* Login/Register Tabs */}
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              centered
              sx={{ mb: 3 }}
            >
              <Tab label="Sign In" />
              <Tab label="Create Account" />
            </Tabs>

            {/* Error/Success Messages */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
                {success}
              </Alert>
            )}

            {/* Auth Method Toggle */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Button
                fullWidth
                variant={authMethod === 'email' ? 'contained' : 'outlined'}
                startIcon={<Email />}
                onClick={() => {
                  setAuthMethod('email');
                  setOtpSent(false);
                  setError('');
                  // Clear reCAPTCHA when switching to email
                  authService.clearRecaptcha();
                }}
              >
                Email
              </Button>
              <Button
                fullWidth
                variant={authMethod === 'phone' ? 'contained' : 'outlined'}
                startIcon={<Phone />}
                onClick={() => {
                  setAuthMethod('phone');
                  setError('');
                }}
              >
                Phone
              </Button>
            </Box>

            {/* Auth Forms */}
            {authMethod === 'email' ? renderEmailPasswordForm() : renderPhoneForm()}

            {/* Divider */}
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            {/* Google Sign-in */}
            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<Google />}
              onClick={handleGoogleSignIn}
              disabled={loading}
              sx={{
                py: 1.5,
                borderColor: '#4285F4',
                color: '#4285F4',
                '&:hover': {
                  borderColor: '#357ae8',
                  backgroundColor: 'rgba(66, 133, 244, 0.04)',
                },
              }}
            >
              Continue with Google
            </Button>

            {/* Terms and Privacy */}
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', textAlign: 'center', mt: 3 }}
            >
              By continuing, you agree to our{' '}
              <MuiLink component={RouterLink} to="/terms">
                Terms of Service
              </MuiLink>{' '}
              and{' '}
              <MuiLink component={RouterLink} to="/privacy">
                Privacy Policy
              </MuiLink>
            </Typography>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default AuthPage;
