/**
 * Input Validation and Sanitization Service
 * Provides comprehensive validation and sanitization for user inputs
 */

export class ValidationService {

  // Email validation
  static validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!email || typeof email !== 'string') {
      return { isValid: false, error: 'Email is required' };
    }
    
    const trimmedEmail = email.trim();
    
    if (trimmedEmail.length === 0) {
      return { isValid: false, error: 'Email cannot be empty' };
    }
    
    if (trimmedEmail.length > 254) {
      return { isValid: false, error: 'Email is too long' };
    }
    
    if (!emailRegex.test(trimmedEmail)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }
    
    return { isValid: true, sanitized: trimmedEmail.toLowerCase() };
  }

  // Phone number validation (Indian format)
  static validatePhone(phone) {
    if (!phone || typeof phone !== 'string') {
      return { isValid: false, error: 'Phone number is required' };
    }
    
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Indian mobile number validation
    const indianMobileRegex = /^[6-9]\d{9}$/;
    const indianLandlineRegex = /^[0-9]{10,11}$/;
    
    if (cleanPhone.length === 10 && indianMobileRegex.test(cleanPhone)) {
      return { isValid: true, sanitized: cleanPhone };
    }
    
    if (cleanPhone.length >= 10 && cleanPhone.length <= 11 && indianLandlineRegex.test(cleanPhone)) {
      return { isValid: true, sanitized: cleanPhone };
    }
    
    return { isValid: false, error: 'Please enter a valid Indian phone number' };
  }

  // Name validation
  static validateName(name, fieldName = 'Name') {
    if (!name || typeof name !== 'string') {
      return { isValid: false, error: `${fieldName} is required` };
    }
    
    const trimmedName = name.trim();
    
    if (trimmedName.length === 0) {
      return { isValid: false, error: `${fieldName} cannot be empty` };
    }
    
    if (trimmedName.length < 2) {
      return { isValid: false, error: `${fieldName} must be at least 2 characters long` };
    }
    
    if (trimmedName.length > 50) {
      return { isValid: false, error: `${fieldName} must be less than 50 characters` };
    }
    
    // Allow only letters, spaces, hyphens, and apostrophes
    const nameRegex = /^[a-zA-Z\s\-']+$/;
    if (!nameRegex.test(trimmedName)) {
      return { isValid: false, error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` };
    }
    
    return { isValid: true, sanitized: this.sanitizeText(trimmedName) };
  }

  // General text sanitization
  static sanitizeText(text) {
    if (!text || typeof text !== 'string') return '';
    
    return text
      .trim()
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/[<>]/g, '') // Remove potential HTML brackets
      .substring(0, 1000); // Limit length
  }

  // URL validation
  static validateURL(url, fieldName = 'URL') {
    if (!url || typeof url !== 'string') {
      return { isValid: false, error: `${fieldName} is required` };
    }
    
    const trimmedUrl = url.trim();
    
    if (trimmedUrl.length === 0) {
      return { isValid: false, error: `${fieldName} cannot be empty` };
    }
    
    try {
      const urlObj = new URL(trimmedUrl.startsWith('http') ? trimmedUrl : `https://${trimmedUrl}`);
      return { isValid: true, sanitized: urlObj.toString() };
    } catch (error) {
      return { isValid: false, error: `Please enter a valid ${fieldName}` };
    }
  }

  // Number validation
  static validateNumber(value, fieldName = 'Number', options = {}) {
    const { min = 0, max = Number.MAX_SAFE_INTEGER, integer = false } = options;
    
    if (value === null || value === undefined || value === '') {
      return { isValid: false, error: `${fieldName} is required` };
    }
    
    const num = Number(value);
    
    if (isNaN(num)) {
      return { isValid: false, error: `${fieldName} must be a valid number` };
    }
    
    if (integer && !Number.isInteger(num)) {
      return { isValid: false, error: `${fieldName} must be a whole number` };
    }
    
    if (num < min) {
      return { isValid: false, error: `${fieldName} must be at least ${min}` };
    }
    
    if (num > max) {
      return { isValid: false, error: `${fieldName} must be no more than ${max}` };
    }
    
    return { isValid: true, sanitized: num };
  }

  // File validation
  static validateFile(file, options = {}) {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB default
      allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      fieldName = 'File'
    } = options;
    
    if (!file) {
      return { isValid: false, error: `${fieldName} is required` };
    }
    
    // Check file size
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
      return { isValid: false, error: `${fieldName} size must be less than ${maxSizeMB}MB` };
    }
    
    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      const allowedTypesStr = allowedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ');
      return { isValid: false, error: `${fieldName} must be one of: ${allowedTypesStr}` };
    }
    
    // Check file name for potential security issues
    if (file.name.length > 255) {
      return { isValid: false, error: `${fieldName} name is too long` };
    }
    
    // Sanitize filename
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    return { 
      isValid: true, 
      sanitized: file,
      sanitizedName 
    };
  }

  // Address validation
  static validateAddress(address) {
    const errors = {};
    let isValid = true;
    
    // Street address
    if (!address.street || typeof address.street !== 'string' || address.street.trim().length === 0) {
      errors.street = 'Street address is required';
      isValid = false;
    } else if (address.street.trim().length < 5) {
      errors.street = 'Street address must be at least 5 characters';
      isValid = false;
    }
    
    // City
    if (!address.city || typeof address.city !== 'string' || address.city.trim().length === 0) {
      errors.city = 'City is required';
      isValid = false;
    } else if (address.city.trim().length < 2) {
      errors.city = 'City must be at least 2 characters';
      isValid = false;
    }
    
    // State
    if (!address.state || typeof address.state !== 'string' || address.state.trim().length === 0) {
      errors.state = 'State is required';
      isValid = false;
    }
    
    // ZIP code
    if (address.zipCode) {
      const zipRegex = /^[0-9]{5,6}$/;
      if (!zipRegex.test(address.zipCode.replace(/\D/g, ''))) {
        errors.zipCode = 'Please enter a valid ZIP code';
        isValid = false;
      }
    }
    
    if (!isValid) {
      return { isValid: false, errors };
    }
    
    return {
      isValid: true,
      sanitized: {
        street: this.sanitizeText(address.street),
        city: this.sanitizeText(address.city),
        state: this.sanitizeText(address.state),
        country: this.sanitizeText(address.country || 'India'),
        zipCode: address.zipCode ? address.zipCode.replace(/\D/g, '') : ''
      }
    };
  }

  // Batch validation for forms
  static validateForm(data, rules) {
    const errors = {};
    const sanitized = {};
    let isValid = true;
    
    Object.keys(rules).forEach(field => {
      const rule = rules[field];
      const value = data[field];
      
      let result;
      
      switch (rule.type) {
        case 'email':
          result = this.validateEmail(value);
          break;
        case 'phone':
          result = this.validatePhone(value);
          break;
        case 'name':
          result = this.validateName(value, rule.fieldName || field);
          break;
        case 'url':
          result = this.validateURL(value, rule.fieldName || field);
          break;
        case 'number':
          result = this.validateNumber(value, rule.fieldName || field, rule.options);
          break;
        case 'text':
          if (rule.required && (!value || value.trim().length === 0)) {
            result = { isValid: false, error: `${rule.fieldName || field} is required` };
          } else {
            result = { isValid: true, sanitized: this.sanitizeText(value) };
          }
          break;
        case 'file':
          result = this.validateFile(value, rule.options);
          break;
        case 'address':
          result = this.validateAddress(value);
          break;
        default:
          result = { isValid: true, sanitized: value };
      }
      
      if (!result.isValid) {
        errors[field] = result.error || result.errors;
        isValid = false;
      } else {
        sanitized[field] = result.sanitized;
      }
    });
    
    return { isValid, errors, sanitized };
  }

  // XSS Prevention
  static sanitizeForDisplay(text) {
    if (!text || typeof text !== 'string') return '';
    
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }
}

export default ValidationService;