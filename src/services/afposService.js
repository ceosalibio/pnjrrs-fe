import api from './axiosConfig'
import { ENDPOINTS } from './endpoints'

/**
 * Get all AFPOS items
 * @param {Object} filters - Query filters
 * @returns {Promise<Object>} List of AFPOS items
 */
export const getAfposItems = async (filters = {}) => {
  try {
    const response = await api.get(ENDPOINTS.AFPOS.LIST, { params: filters })
    return response.data?.data ?? response?.data
    
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to fetch AFPOS items'
    }
  }
}

/**
 * Get AFPOS item by ID
 * @param {number} id - AFPOS item ID
 * @returns {Promise<Object>} AFPOS item data
 */
export const getAfposItemById = async (id) => {
  try {
    const response = await api.get(ENDPOINTS.AFPOS.GET(id))
    return response.data
    
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      success: true,
      data: null
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to fetch AFPOS item'
    }
  }
}

/**
 * Create new AFPOS item
 * @param {Object} data - AFPOS item data
 * @returns {Promise<Object>} Created AFPOS item
 */
export const createAfposItem = async (data) => {
  try {
    const response = await api.post(ENDPOINTS.AFPOS.CREATE, data)
    return response.data
    
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true,
      data: { id: Date.now(), ...data }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to create AFPOS item'
    }
  }
}

/**
 * Update AFPOS item
 * @param {number} id - AFPOS item ID
 * @param {Object} data - Updated AFPOS item data
 * @returns {Promise<Object>} Updated AFPOS item
 */
export const updateAfposItem = async (id, data) => {
  try {
    const response = await api.put(ENDPOINTS.AFPOS.UPDATE(id), data)
    return response.data
    
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true,
      data: { id, ...data }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to update AFPOS item'
    }
  }
}

/**
 * Delete AFPOS item
 * @param {number} id - AFPOS item ID
 * @returns {Promise<Object>} Delete response
 */
export const deleteAfposItem = async (id) => {
  try {
    await api.delete(ENDPOINTS.AFPOS.DELETE(id))
    
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to delete AFPOS item'
    }
  }
}

/**
 * Get AFPOS items by division
 * @param {number} divisionId - Division ID
 * @returns {Promise<Object>} AFPOS items for division
 */
export const getAfposItemsByDivision = async (divisionId) => {
  try {
    // const response = await api.get(ENDPOINTS.AFPOS.GET_BY_DIVISION(divisionId))
    // return response.data
    
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      success: true,
      data: []
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to fetch AFPOS items by division'
    }
  }
}
