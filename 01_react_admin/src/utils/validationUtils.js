/**
 * Utility functions for form validation
 */

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone number format (basic validation)
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\d\s\-$$$$.+]+$/
  return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10
}

// Validate password strength
export const isStrongPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
  return passwordRegex.test(password)
}

// Get password strength score (0-4)
export const getPasswordStrength = (password) => {
  if (!password) return 0

  let score = 0

  // Length check
  if (password.length >= 8) score += 1

  // Complexity checks
  if (/[A-Z]/.test(password)) score += 1
  if (/[a-z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1

  return score
}

// Validate date format (YYYY-MM-DD)
export const isValidDate = (dateString) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/

  if (!regex.test(dateString)) return false

  const date = new Date(dateString)
  const timestamp = date.getTime()

  if (isNaN(timestamp)) return false

  return date.toISOString().slice(0, 10) === dateString
}

// Validate URL format
export const isValidUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch (e) {
    return false
  }
}

// Validate form fields
export const validateForm = (formData, rules) => {
  const errors = {}

  Object.keys(rules).forEach((field) => {
    const value = formData[field]
    const fieldRules = rules[field]

    // Required check
    if (fieldRules.required && (!value || value.trim() === "")) {
      errors[field] = "This field is required"
      return
    }

    // Skip other validations if field is empty and not required
    if (!value && !fieldRules.required) return

    // Email validation
    if (fieldRules.email && !isValidEmail(value)) {
      errors[field] = "Please enter a valid email address"
      return
    }

    // Phone validation
    if (fieldRules.phone && !isValidPhone(value)) {
      errors[field] = "Please enter a valid phone number"
      return
    }

    // Min length validation
    if (fieldRules.minLength && value.length < fieldRules.minLength) {
      errors[field] = `Must be at least ${fieldRules.minLength} characters`
      return
    }

    // Max length validation
    if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
      errors[field] = `Must be no more than ${fieldRules.maxLength} characters`
      return
    }

    // Pattern validation
    if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
      errors[field] = fieldRules.message || "Invalid format"
      return
    }

    // Custom validation
    if (fieldRules.validate && typeof fieldRules.validate === "function") {
      const customError = fieldRules.validate(value, formData)
      if (customError) {
        errors[field] = customError
        return
      }
    }
  })

  return errors
}

