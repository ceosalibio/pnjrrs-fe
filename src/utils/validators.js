export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email) || 'Please enter a valid email address.'
}

export const validatePassword = (password) => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters.'
  }
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  
  if (!hasUppercase || !hasLowercase || !hasNumber) {
    return 'Password must contain uppercase, lowercase, and numbers.'
  }
  return true
}

export const validateField = (value, type = 'text') => {
  if (!value || value.trim() === '') {
    return 'This field is required.'
  }
  
  if (type === 'email') {
    return validateEmail(value)
  }
  
  if (type === 'password') {
    return validatePassword(value)
  }
  
  return true
}

export const validateForm = (formData, rules) => {
  const errors = {}
  
  for (const field in rules) {
    const value = formData[field]
    const rule = rules[field]
    
    if (rule.required && (!value || value.trim() === '')) {
      errors[field] = 'This field is required.'
      continue
    }
    
    if (rule.type === 'email' && value) {
      const emailError = validateEmail(value)
      if (emailError !== true) {
        errors[field] = emailError
        continue
      }
    }
    
    if (rule.type === 'password' && value) {
      const passwordError = validatePassword(value)
      if (passwordError !== true) {
        errors[field] = passwordError
        continue
      }
    }
  }
  
  return errors
}
