import api from './axiosConfig'
import { mockPersonnel } from '@/utils/mockData'

export const getPersonnel = async () => {
  try {
    // Mock get personnel - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true,
      data: mockPersonnel
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to fetch personnel'
    }
  }
}

export const getPersonnelById = async (id) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300))
    const personnel = mockPersonnel.find(p => p.id === id)
    
    if (!personnel) {
      throw new Error('Personnel not found')
    }

    return {
      success: true,
      data: personnel
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to fetch personnel'
    }
  }
}

export const createPersonnel = async (data) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true,
      data: { id: Date.now(), ...data }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to create personnel'
    }
  }
}

export const updatePersonnel = async (id, data) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true,
      data: { id, ...data }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to update personnel'
    }
  }
}

export const deletePersonnel = async (id) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to delete personnel'
    }
  }
}

/**
 * Create a new system user
 * @param {Object} userData - User data object
 * @param {string} userData.name - User's full name
 * @param {string} userData.username - User's username
 * @param {string} userData.password - User's password
 * @param {string} userData.category - User's category
 * @param {string} userData.unit - User's unit
 * @param {string} userData.subunit - User's sub unit
 * @param {string} userData.office - User's office
 * @param {string} userData.approver - User's approver
 * @param {string} userData.officeAdmin - User's office admin
 * @returns {Promise<Object>} Response object with success status and user data
 */
export const createUser = async (userData) => {
  try {
    // TODO: Replace with actual API endpoint
    // const response = await api.post('/users', userData)
    // return { success: true, data: response.data }
    
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true,
      data: { id: Date.now(), ...userData, status: 'active', createdAt: new Date().toISOString() }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to create user'
    }
  }
}

/**
 * Get all system users
 * @returns {Promise<Object>} Response object with success status and users list
 */
export const getUsers = async () => {
  try {
    // TODO: Replace with actual API endpoint
    // const response = await api.get('/users')
    // return { success: true, data: response.data }
    
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true,
      data: []
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
 * @param {string|number} id - User ID
 * @returns {Promise<Object>} Response object with success status and user data
 */
export const getUserById = async (id) => {
  try {
    // TODO: Replace with actual API endpoint
    // const response = await api.get(`/users/${id}`)
    // return { success: true, data: response.data }
    
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      success: true,
      data: {}
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to fetch user'
    }
  }
}

/**
 * Update user
 * @param {string|number} id - User ID
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} Response object with success status and updated user data
 */
export const updateUser = async (id, userData) => {
  try {
    // TODO: Replace with actual API endpoint
    // const response = await api.put(`/users/${id}`, userData)
    // return { success: true, data: response.data }
    
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true,
      data: { id, ...userData }
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
 * @param {string|number} id - User ID
 * @returns {Promise<Object>} Response object with success status
 */
export const deleteUser = async (id) => {
  try {
    // TODO: Replace with actual API endpoint
    // const response = await api.delete(`/users/${id}`)
    // return { success: true }
    
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

export default api

