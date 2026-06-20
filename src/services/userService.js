import api from './axiosConfig'
import { ENDPOINTS } from './endpoints'

/**
 * Get all users with optional filters
 * @param {Object} filters - Query filters
 * @returns {Promise<Object>} Users list response
 */
export const getUsers = async (filters = {}) => {
  try {
    const response = await api.get(ENDPOINTS.USERS.LIST, { params: filters })
    
    if (response.data.status === 'error') {
      return {
        success: false,
        error: response.data.message || 'Failed to fetch users'
      }
    }
    
    return {
      success: true,
      data: response.data?.data || []
    }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to fetch users'
    }
  }
}

/**
 * Get a single user by ID
 * @param {number} id - User ID
 * @returns {Promise<Object>} User data response
 */
export const getUserById = async (id) => {
  try {
    const response = await api.get(ENDPOINTS.USERS.GET(id))
    
    if (response.data.status === 'error') {
      return {
        success: false,
        error: response.data.message || 'Failed to fetch user'
      }
    }
    
    return {
      success: true,
      data: response.data?.data || {}
    }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to fetch user'
    }
  }
}

/**
 * Create a new user
 * @param {Object} userData - User data object
 * @returns {Promise<Object>} Created user response
 */
export const createUser = async (userData) => {
  try {
    const response = await api.post(ENDPOINTS.USERS.CREATE, userData)
    
    if (response.data.status === 'error') {
      return {
        success: false,
        error: response.data.message || 'Failed to create user'
      }
    }
    
    return {
      success: true,
      data: response.data?.data || {}
    }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to create user'
    }
  }
}

/**
 * Update an existing user
 * @param {number} id - User ID
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} Updated user response
 */
export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(ENDPOINTS.USERS.UPDATE(id), userData)
    
    if (response.data.status === 'error') {
      return {
        success: false,
        error: response.data.message || 'Failed to update user'
      }
    }
    
    return {
      success: true,
      data: response.data?.data || {}
    }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to update user'
    }
  }
}

/**
 * Delete a user
 * @param {number} id - User ID
 * @returns {Promise<Object>} Delete response
 */
export const deleteUser = async (id) => {
  try {
    const response = await api.delete(ENDPOINTS.USERS.DELETE(id))
    
    if (response.data.status === 'error') {
      return {
        success: false,
        error: response.data.message || 'Failed to delete user'
      }
    }
    
    return {
      success: true,
      data: response.data?.data || {}
    }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to delete user'
    }
  }
}

/**
 * Get users filtered by rank
 * @param {number} rankId - Rank ID
 * @returns {Promise<Object>} Users by rank response
 */
export const getUsersByRank = async (rankId) => {
  try {
    const response = await api.get(ENDPOINTS.USERS.GET_BY_RANK(rankId))
    
    if (response.data.status === 'error') {
      return {
        success: false,
        error: response.data.message || 'Failed to fetch users by rank'
      }
    }
    
    return {
      success: true,
      data: response.data?.data || []
    }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to fetch users by rank'
    }
  }
}

/**
 * Get ranks
 * @returns {Promise<Object>} Ranks response
 */
export const getRank = async () => {
  try {
    const response = await api.get(ENDPOINTS.USERS.GET_RANK)
    
    if (response.data.status === 'error') {
      return {
        success: false,
        error: response.data.message || 'Failed to fetch ranks'
      }
    }
    
    return {
      success: true,
      data: response.data?.data || []
    }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to fetch ranks'
    }
  }
}

export default api