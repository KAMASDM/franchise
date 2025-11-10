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
  Phone as PhoneIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Send as SendIcon
} from '@mui/icons-material';
import authService from '../../services/authService';

/**
 * Reusable Phone Verification Component
 * @param {string} value - Phone number value
 * @param {function} onChange - Callback when phone changes
 * @param {function} onVerificationChange - Callback when verification status changes
 * @param {boolean} required - Whether field is required
 * @param {boolean} disabled - Whether field is disabled
 * @param {boolean} autoVerify - Auto-verify on mount if already verified
 */
const PhoneVerification = ({
  value = '+91 ',
  onChange,
  onVerificationChange,
  required = true,
  disabled = false,
  autoVerify = false,
  label = 'Phone Number',
  helperText = 'Enter your 10-digit mobile number'
}) => {
  const [phoneNumber, setPhoneNumber] = useState(value);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);

  // Sync external value changes
  useEffect(() => {
    if (value && value !== phoneNumber) {
      setPhoneNumber(value);
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
      onVerificationChange(verified, phoneNumber);
    }
  }, [verified, phoneNumber]);

  const handlePhoneChange = (e) => {
    const newValue = e.target.value;
    
    // Prevent deleting +91
    if (!newValue.startsWith('+91')) {
      setPhoneNumber('+91 ');
      if (onChange) onChange('+91 ');
      return;
    }
    
    setPhoneNumber(newValue);
    if (onChange) onChange(newValue);
    
    // Reset verification if phone changes after verification
    if (verified) {
      setVerified(false);
      setOtpSent(false);
      setOtp('');
      setError('Phone number changed. Please verify again.');
    }
  };

  const handleSendOTP = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate phone number
      if (!phoneNumber.startsWith('+91')) {
        setError('Phone number must start with +91');
        setLoading(false);
        return;
      }

      const phoneDigits = phoneNumber.replace(/\s/g, '').substring(3);
      if (phoneDigits.length !== 10 || !/^\d{10}$/.test(phoneDigits)) {
        setError('Please enter a valid 10-digit mobile number');
        setLoading(false);
        return;
      }

      // Send OTP
      const result = await authService.sendPhoneOTP(phoneNumber.replace(/\s/g, ''));
      setOtpSent(true);
      setSuccess(result.message || 'OTP sent successfully!');
      setCountdown(60); // 60 second countdown
    } catch (err) {
      console.error('Error sending OTP:', err);
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (otp.length !== 6) {
        setError('Please enter a valid 6-digit OTP');
        setLoading(false);
        return;
      }

      const result = await authService.verifyPhoneOTP(otp);
      setVerified(true);
      setSuccess('Phone number verified successfully!');
      
      // Clean up reCAPTCHA
      authService.clearRecaptcha();
    } catch (err) {
      console.error('Error verifying OTP:', err);
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    setOtp('');
    setOtpSent(false);
    handleSendOTP();
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <TextField
          fullWidth
          label={label}
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          required={required}
          disabled={disabled || verified || otpSent}
          placeholder="9876543210"
          helperText={verified ? 'Verified ✓' : helperText}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PhoneIcon color={verified ? 'success' : 'action'} />
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

        {!verified && !otpSent && (
          <Button
            variant="contained"
            onClick={handleSendOTP}
            disabled={loading || disabled || !phoneNumber || phoneNumber === '+91 '}
            startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
            sx={{ minWidth: '140px', height: '56px' }}
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </Button>
        )}
      </Stack>

      {/* OTP Input */}
      {otpSent && !verified && (
        <Box sx={{ mt: 2, ml: 0 }}>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <TextField
              fullWidth
              label="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              helperText={`Enter the 6-digit OTP sent to ${phoneNumber}`}
              disabled={loading || disabled}
              inputProps={{ maxLength: 6 }}
              error={!!error}
            />

            <Button
              variant="contained"
              color="success"
              onClick={handleVerifyOTP}
              disabled={loading || disabled || otp.length !== 6}
              startIcon={loading ? <CircularProgress size={20} /> : <CheckCircleIcon />}
              sx={{ minWidth: '140px', height: '56px' }}
            >
              {loading ? 'Verifying...' : 'Verify'}
            </Button>
          </Stack>

          {/* Resend OTP */}
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Didn't receive OTP?
            </Typography>
            <Button
              size="small"
              onClick={handleResendOTP}
              disabled={countdown > 0 || loading}
            >
              {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
            </Button>
          </Box>
        </Box>
      )}

      {/* reCAPTCHA Container */}
      <div id="recaptcha-container" style={{ marginTop: '10px' }}></div>

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

export default PhoneVerification;
