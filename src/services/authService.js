import api from './axiosConfig'
import { ENDPOINTS } from './endpoints'
import { mockUsers } from '@/utils/mockData'

/**
 * Login with username and password
 * @param {string} username - User username
 * @param {string} password - User password
 * @returns {Promise<Object>} Login response with token and user data
 */
export const login = async (username, password) => {
  try {
    // Actual API call - uncomment when backend is ready
    const response = await api.post(ENDPOINTS.AUTH.LOGIN, { username, password })
    console.log('API response:', response)
    // Handle response based on API format
    if (response.data.status === 'error') {
      return {
        success: false,
        error: response.data.message || 'Login failed',
        errors: response.data.errors
      }
    }
    
    // Success response
    return {
      success: true,
      token: response.data?.data?.token,
      user: response.data?.data?.user
    }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Login failed'
    }
  }
}

/**
 * Logout current user
 * @returns {Promise<Object>} Logout response
 */
export const logout = async () => {
  try {
    // Actual API call - uncomment when backend is ready
    await api.post(ENDPOINTS.AUTH.LOGOUT)
    
    await new Promise(resolve => setTimeout(resolve, 500))
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Logout failed'
    }
  }
}

/**
 * Verify CAPTCHA token
 * @param {string} token - CAPTCHA token to verify
 * @returns {Promise<Object>} Verification response
 */
export const verifyCaptcha = async (token) => {
  try {
    if (!token || token.trim() === '') {
      throw new Error('CAPTCHA token is required')
    }

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

/**
 * Get current user profile
 * @returns {Promise<Object>} User profile data
 */
export const getUserProfile = async () => {
  try {
    // const response = await api.get(ENDPOINTS.AUTH.GET_PROFILE)
    // return response.data
    
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('Not authenticated')
    }

    await new Promise(resolve => setTimeout(resolve, 500))

    return {
      success: true,
      user: {
        id: 1,
        username: 'ceo',
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
