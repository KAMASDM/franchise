import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  Chip,
  Stack
} from '@mui/material';
import {
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Send as SendIcon
} from '@mui/icons-material';
import emailjs from '@emailjs/browser';

/**
 * Reusable Email Verification Component
 * Uses EmailJS to send verification codes
 * 
 * @param {string} value - Email value
 * @param {function} onChange - Callback when email changes
 * @param {function} onVerificationChange - Callback when verification status changes
 * @param {boolean} required - Whether field is required
 * @param {boolean} disabled - Whether field is disabled
 */
const EmailVerification = ({
  value = '',
  onChange,
  onVerificationChange,
  required = true,
  disabled = false,
  label = 'Email Address',
  helperText = 'We will send a verification code to this email'
}) => {
  const [email, setEmail] = useState(value);
  const [verificationCode, setVerificationCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);

  // EmailJS configuration from environment variables
  const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_GENERIC;
  const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  // Sync external value changes
  useEffect(() => {
    if (value && value !== email) {
      setEmail(value);
    }
  }, [value]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Notify parent of verification status changes
  useEffect(() => {
    if (onVerificationChange) {
      onVerificationChange(verified, email);
    }
  }, [verified, email]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleEmailChange = (e) => {
    const newValue = e.target.value;
    setEmail(newValue);
    if (onChange) onChange(newValue);
    
    // Reset verification if email changes after verification
    if (verified) {
      setVerified(false);
      setCodeSent(false);
      setInputCode('');
      setError('Email changed. Please verify again.');
    }
  };

  const handleSendCode = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Check EmailJS configuration
      if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
        setError('Email service not configured. Please contact support.');
        setLoading(false);
        return;
      }

      // Validate email
      if (!validateEmail(email)) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }

      // Generate 6-digit code
      const code = generateVerificationCode();
      setVerificationCode(code);

      // Send email using EmailJS with correct template parameters
      const templateParams = {
        to_email: email,
        to_name: email.split('@')[0],
        from_name: 'ikama',
        reply_to: 'support@ikama.in',
        subject: 'Email Verification Code',
        message: `Your verification code is: <strong>${code}</strong><br><br>This code will expire in 10 minutes.<br><br>If you didn't request this code, please ignore this email.`
      };

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      setCodeSent(true);
      setSuccess('Verification code sent to your email!');
      setCountdown(60); // 60 second countdown
    } catch (err) {
      console.error('Error sending verification code:', err);
      setError('Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (inputCode.length !== 6) {
        setError('Please enter a valid 6-digit code');
        setLoading(false);
        return;
      }

      if (inputCode === verificationCode) {
        setVerified(true);
        setSuccess('Email verified successfully!');
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } catch (err) {
      console.error('Error verifying code:', err);
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = () => {
    setInputCode('');
    setCodeSent(false);
    handleSendCode();
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <TextField
          fullWidth
          label={label}
          type="email"
          value={email}
          onChange={handleEmailChange}
          required={required}
          disabled={disabled || verified || codeSent}
          placeholder="your@email.com"
          helperText={verified ? 'Verified ✓' : helperText}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon color={verified ? 'success' : 'action'} />
              </InputAdornment>
            ),
            endAdornment: verified && (
              <InputAdornment position="end">
                <Chip
                  icon={<CheckCircleIcon />}
                  label="Verified"
                  color="success"
                  size="small"
                />
              </InputAdornment>
            )
          }}
          error={!!error && !verified}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: verified ? 'success.lighter' : 'inherit'
            }
          }}
        />

        {!verified && !codeSent && (
          <Button
            variant="contained"
            onClick={handleSendCode}
            disabled={loading || disabled || !email || !validateEmail(email)}
            startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
            sx={{ minWidth: '140px', height: '56px' }}
          >
            {loading ? 'Sending...' : 'Send Code'}
          </Button>
        )}
      </Stack>

      {/* Verification Code Input */}
      {codeSent && !verified && (
        <Box sx={{ mt: 2, ml: 0 }}>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <TextField
              fullWidth
              label="Enter Verification Code"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              helperText={`Enter the 6-digit code sent to ${email}`}
              disabled={loading || disabled}
              inputProps={{ maxLength: 6 }}
              error={!!error}
            />

            <Button
              variant="contained"
              color="success"
              onClick={handleVerifyCode}
              disabled={loading || disabled || inputCode.length !== 6}
              startIcon={loading ? <CircularProgress size={20} /> : <CheckCircleIcon />}
              sx={{ minWidth: '140px', height: '56px' }}
            >
              {loading ? 'Verifying...' : 'Verify'}
            </Button>
          </Stack>

          {/* Resend Code */}
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Didn't receive the code?
            </Typography>
            <Button
              size="small"
              onClick={handleResendCode}
              disabled={countdown > 0 || loading}
            >
              {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
            </Button>
          </Box>
        </Box>
      )}

      {/* Success Message */}
      {success && (
        <Alert severity="success" sx={{ mt: 2 }} icon={<CheckCircleIcon />}>
          {success}
        </Alert>
      )}

      {/* Error Message */}
      {error && !verified && (
        <Alert severity="error" sx={{ mt: 2 }} icon={<ErrorIcon />}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default EmailVerification;
