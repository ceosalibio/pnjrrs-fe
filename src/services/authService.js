import api from './axiosConfig'
import { API_ENDPOINTS } from '@/utils/constants'
import { mockUsers } from '@/utils/mockData'

export const login = async (email, password) => {
  try {
    // Mock login - replace with actual API call
    const user = mockUsers.find(u => u.email === email && u.password === password)
    
    if (!user) {
      throw new Error('Invalid credentials')
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const token = `mock_token_${user.id}_${Date.now()}`
    
    return {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        rank: user.rank,
        role: user.role,
        avatar: user.avatar
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Login failed'
    }
  }
}

export const logout = async () => {
  try {
    // Mock logout - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 500))
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Logout failed'
    }
  }
}

export const verifyCaptcha = async (token) => {
  try {
    // Mock CAPTCHA verification - replace with actual API call
    if (!token || token.trim() === '') {
      throw new Error('CAPTCHA token is required')
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    return {
      success: true,
      verified: true
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'CAPTCHA verification failed'
    }
  }
}

export const getUserProfile = async () => {
  try {
    // Mock get profile - replace with actual API call
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('Not authenticated')
    }

    await new Promise(resolve => setTimeout(resolve, 500))

    return {
      success: true,
      user: {
        id: 1,
        email: 'user@pnay.gov.ph',
        firstName: 'Juan',
        lastName: 'Dela Cruz',
        rank: 'Commodore',
        role: 'admin',
        avatar: null,
        department: 'Naval Operations'
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to fetch profile'
    }
  }
}

export default api
