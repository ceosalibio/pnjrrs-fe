import api from './axiosConfig'
import { ENDPOINTS } from './endpoints'
import { mockPersonnel } from '@/utils/mockData'

/**
 * Get all users with optional filters
 * @param {Object} filters - Query filters
 * @param {string} filters.search - Search term
 * @param {number} filters.category_id - Category ID
 * @param {number} filters.unit_id - Unit ID
 * @param {number} filters.sub_unit_id - Sub-unit ID
 * @param {number} filters.office_id - Office ID
 * @param {number} filters.sub_office_id - Sub-office ID
 * @param {number} filters.per_page - Items per page
 * @returns {Promise<Object>} List of users
 */
export const getUsers = async (filters = {}) => {
  try {
    // const response = await api.get(ENDPOINTS.USERS.LIST, { params: filters })
    // return response.data
    
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true,
      data: mockPersonnel
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to fetch users'
    }
  }
}

/**
 * Get user by ID
 * @param {number} id - User ID
 * @returns {Promise<Object>} User data
 */
export const getUserById = async (id) => {
  try {
    // const response = await api.get(ENDPOINTS.USERS.GET(id))
    // return response.data
    
    await new Promise(resolve => setTimeout(resolve, 300))
    const user = mockPersonnel.find(p => p.id === id)
    
    if (!user) {
      throw new Error('User not found')
    }

    return {
      success: true,
      data: user
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to fetch user'
    }
  }
}

/**
 * Create new user
 * @param {Object} data - User data
 * @returns {Promise<Object>} Created user
 */
export const createUser = async (data) => {
  try {
    // const response = await api.post(ENDPOINTS.USERS.CREATE, data)
    // return response.data
    
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true,
      data: { id: Date.now(), ...data }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to create user'
    }
  }
}

/**
 * Update user
 * @param {number} id - User ID
 * @param {Object} data - Updated user data
 * @returns {Promise<Object>} Updated user
 */
export const updateUser = async (id, data) => {
  try {
    // const response = await api.put(ENDPOINTS.USERS.UPDATE(id), data)
    // return response.data
    
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true,
      data: { id, ...data }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to update user'
    }
  }
}

/**
 * Delete user
 * @param {number} id - User ID
 * @returns {Promise<Object>} Delete response
 */
export const deleteUser = async (id) => {
  try {
    // await api.delete(ENDPOINTS.USERS.DELETE(id))
    
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to delete user'
    }
  }
}

/**
 * Get users by rank
 * @param {number} rankId - Rank ID
 * @returns {Promise<Object>} Users with given rank
 */
export const getUsersByRank = async (rankId) => {
  try {
    // const response = await api.get(ENDPOINTS.USERS.GET_BY_RANK(rankId))
    // return response.data
    
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      success: true,
      data: mockPersonnel.filter(u => u.rank === rankId)
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to fetch users by rank'
    }
  }
}

