/**
 * Global validation rules for form inputs
 */

// Basic required field validation
export const required = () => {
    return (value) => {
      // Empty string, null, undefined
      if (value === '' || value === null || value === undefined) return 'This field is required';
      // Empty array
      if (Array.isArray(value) && value.length === 0) return 'This field is required';
      // Empty object
      if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) return 'This field is required';
      return true;
    };
  };
  
  
  // Min length validation
  export const minLength = (length, message) => {
    return v => !v || v.length >= length || (message || `Must be at least ${length} characters`);
  };
  
  // Max length validation
  export const maxLength = (length, message) => {
    return v => !v || v.length <= length || (message || `Must be less than ${length} characters`);
  };
  
  // Email validation
  export const email = (message = 'Must be a valid email') => {
    return v => !v || /.+@.+\..+/.test(v) || message;
  };
  
  // Numeric validation
  export const numeric = (message = 'Must be a number') => {
    return v => !v || /^\d+$/.test(v) || message;
  };
  
  // Custom pattern validation
  export const pattern = (pattern, message = 'Invalid format') => {
    return v => !v || pattern.test(v) || message;
  };
  
  // Combine multiple rules
  export const compose = (...rules) => {
    return v => {
      for (const rule of rules) {
        const result = rule(v);
        if (result !== true) return result;
      }
      return true;
    };
  };
  
  // Common rule sets
  export const commonRules = {
    required: required(),
    email: compose(required(), email()),
    name: compose(required(), minLength(2), maxLength(50)),
    phone: compose(required(), pattern(/^\d{10,15}$/, 'Invalid phone number')),
    password: compose(required(), minLength(8), pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, 'Password must contain letters and numbers'))
  };