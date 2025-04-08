/**
 * Utility functions for authentication
 */
import { retrieveData, storeData, removeData } from "./localStorage"

// Constants
const TOKEN_KEY = "admin_token"
const TOKEN_EXPIRY_KEY = "admin_token_expiry"
// We no longer store user data in localStorage for security reasons

// Login user
export const loginUser = (email, password) => {
  return new Promise((resolve, reject) => {
    // Simulate API call
    setTimeout(() => {
      // Get users from localStorage
      const users = retrieveData("admin_users", [])

      // Find user with matching email and password
      const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

      if (user) {
        // Create token and expiry (24 hours from now)
        const token = generateToken()
        const expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000

        // Store only token and expiry in localStorage, not user data
        storeData(TOKEN_KEY, token)
        storeData(TOKEN_EXPIRY_KEY, expiryTime)

        // Extract user info without password for return value only
        const { password: _, ...userWithoutPassword } = user

        resolve({
          user: userWithoutPassword,
          token,
          expiresAt: expiryTime,
        })
      } else {
        reject(new Error("Invalid email or password"))
      }
    }, 800)
  })
}

// Logout user
export const logoutUser = () => {
  removeData(TOKEN_KEY)
  removeData(TOKEN_EXPIRY_KEY)
  // No need to remove USER_KEY as we don't store it anymore
}

// Check if user is logged in
export const isAuthenticated = () => {
  const token = retrieveData(TOKEN_KEY)
  const expiryTime = retrieveData(TOKEN_EXPIRY_KEY)

  if (!token || !expiryTime) {
    return false
  }

  // Check if token has expired
  const now = new Date().getTime()
  if (now > expiryTime) {
    // Token expired, clear data
    logoutUser()
    return false
  }

  return true
}

// Get current user - now fetches from API instead of localStorage
export const getCurrentUser = () => {
  if (!isAuthenticated()) {
    return null
  }

  // In a real implementation, this would make an API call using the token
  // For now, we'll return a placeholder user object
  return {
    id: 1,
    name: 'Current User',
    email: 'user@example.com',
    role: 'admin'
  }
}

// Get auth token
export const getToken = () => {
  if (!isAuthenticated()) {
    return null
  }

  return retrieveData(TOKEN_KEY)
}

// Refresh token
export const refreshToken = () => {
  if (!isAuthenticated()) {
    return false
  }

  // Extend expiry by 24 hours
  const expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000
  storeData(TOKEN_EXPIRY_KEY, expiryTime)

  return true
}

// Generate a random token
const generateToken = () => {
  return "token_" + Math.random().toString(36).substr(2) + Date.now().toString(36)
}

// Update user profile
export const updateUserProfile = (userData) => {
  return new Promise((resolve, reject) => {
    // Simulate API call
    setTimeout(() => {
      try {
        const currentUser = getCurrentUser()

        if (!currentUser) {
          reject(new Error("User not authenticated"))
          return
        }

        // Update user in mock data only (in a real app, this would be an API call)
        const users = retrieveData("admin_users", [])
        const updatedUsers = users.map((user) => (user.id === currentUser.id ? { ...user, ...userData } : user))

        storeData("admin_users", updatedUsers)

        // Create updated user object for return value
        const updatedUser = { ...currentUser, ...userData }
        // We don't store the user in localStorage anymore

        resolve(updatedUser)
      } catch (error) {
        reject(error)
      }
    }, 800)
  })
}

// Change password
export const changePassword = (currentPassword, newPassword) => {
  return new Promise((resolve, reject) => {
    // Simulate API call
    setTimeout(() => {
      try {
        const currentUser = getCurrentUser()

        if (!currentUser) {
          reject(new Error("User not authenticated"))
          return
        }

        // Get users from localStorage
        const users = retrieveData("admin_users", [])
        const user = users.find((u) => u.id === currentUser.id)

        // Verify current password
        if (!user || user.password !== currentPassword) {
          reject(new Error("Current password is incorrect"))
          return
        }

        // Update password
        const updatedUsers = users.map((u) => (u.id === currentUser.id ? { ...u, password: newPassword } : u))

        storeData("admin_users", updatedUsers)
        resolve(true)
      } catch (error) {
        reject(error)
      }
    }, 800)
  })
}

