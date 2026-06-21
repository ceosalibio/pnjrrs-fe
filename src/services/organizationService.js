import api from './axiosConfig'
import { ENDPOINTS } from './endpoints'

/**
 * CATEGORIES SERVICE
 */

/**
 * Get all categories
 * @param {number} page - Page number
 * @param {number} perPage - Items per page (default: 50)
 * @returns {Promise<Object>} List of categories
 */
export const getCategories = async (page = 1, perPage = null) => {
  try {
    const response = await api.get(ENDPOINTS.CATEGORIES.LIST, { params: { page, per_page: perPage } })
    return {
      success: true,
      data: response.data?.data || { data: [], current_page: 1, last_page: 1, total: 0 }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to fetch categories'
    }
  }
}

/**
 * Get category by ID
 * @param {number} id - Category ID
 * @returns {Promise<Object>} Category data
 */
export const getCategoryById = async (id) => {
  try {
    const response = await api.get(ENDPOINTS.CATEGORIES.GET(id))
    return response.data
    
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      success: true,
      data: null
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to fetch category'
    }
  }
}

/**
 * Create new category
 * @param {Object} data - Category data
 * @returns {Promise<Object>} Created category
 */
export const createCategory = async (data) => {
  try {
      const response = await api.post(ENDPOINTS.CATEGORIES.CREATE, data)
      return response.data
      
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true,
      data: { id: Date.now(), ...data }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to create category'
    }
  }
}

/**
 * Update category
 * @param {number} id - Category ID
 * @param {Object} data - Updated category data
 * @returns {Promise<Object>} Updated category
 */
export const updateCategory = async (id, data) => {
  try {
        const response = await api.put(ENDPOINTS.CATEGORIES.UPDATE(id), data)
        return response.data
        
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true,
      data: { id, ...data }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to update category'
    }
  }
}

/**
 * Delete category
 * @param {number} id - Category ID
 * @returns {Promise<Object>} Delete response
 */
export const deleteCategory = async (id) => {
  try {
    await api.delete(ENDPOINTS.CATEGORIES.DELETE(id))
    
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to delete category'
    }
  }
}

/**
 * UNITS SERVICE
 */

/**
 * Get all units
 * @param {number} page - Page number
 * @param {number} perPage - Items per page (default: 50)
 * @returns {Promise<Object>} List of units
 */
export const getUnits = async (page = 1, perPage = null, category_id = null) => {
  try {
      const params = { page, per_page: perPage };
      if (category_id) {
        params.category_id = category_id;
      }
      const response = await api.get(ENDPOINTS.UNITS.LIST, { params });
      return {
        success: true,
        data: response.data?.data || { data: [], current_page: 1, last_page: 1, total: 0 }
      }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to fetch units'
    }
  }
}

/**
 * Get unit by ID
 * @param {number} id - Unit ID
 * @returns {Promise<Object>} Unit data
 */
export const getUnitById = async (id) => {
  try {
      const response = await api.get(ENDPOINTS.UNITS.GET(id))
      return response.data
      
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      success: true,
      data: null
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to fetch unit'
    }
  }
}

/**
 * Create new unit
 * @param {Object} data - Unit data
 * @returns {Promise<Object>} Created unit
 */
export const createUnit = async (data) => {
  try {
    const response = await api.post(ENDPOINTS.UNITS.CREATE, data)
    return response.data
    
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true,
      data: { id: Date.now(), ...data }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to create unit'
    }
  }
}

/**
 * Update unit
 * @param {number} id - Unit ID
 * @param {Object} data - Updated unit data
 * @returns {Promise<Object>} Updated unit
 */
export const updateUnit = async (id, data) => {
  try {
      const response = await api.put(ENDPOINTS.UNITS.UPDATE(id), data)
      return response.data
      
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true,
      data: { id, ...data }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to update unit'
    }
  }
}

/**
 * Delete unit
 * @param {number} id - Unit ID
 * @returns {Promise<Object>} Delete response
 */
export const deleteUnit = async (id) => {
  try {
    await api.delete(ENDPOINTS.UNITS.DELETE(id))
    
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to delete unit'
    }
  }
}

/**
 * SUB-UNITS SERVICE
 */

/**
 * Get all sub-units
 * @param {number} perPage - Items per page (default: 50)
 * @returns {Promise<Object>} List of sub-units
 */
export const getSubUnits = async (page = 1, perPage = null, unit_id = null) => {
  try {
    const params = { page, per_page: perPage };
    if (unit_id) {
      params.unit_id = unit_id;
    }
    const response = await api.get(ENDPOINTS.SUB_UNITS.LIST, { params });
    return {
      success: true,
      data: response.data?.data || { data: [], current_page: 1, last_page: 1, total: 0 }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to fetch sub-units'
    }
  }
}

/**
 * Get sub-unit by ID
 * @param {number} id - Sub-unit ID
 * @returns {Promise<Object>} Sub-unit data
 */
export const getSubUnitById = async (id) => {
  try {
    const response = await api.get(ENDPOINTS.SUB_UNITS.GET(id))
    return response.data
    
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      success: true,
      data: null
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to fetch sub-unit'
    }
  }
}

/**
 * Create new sub-unit
 * @param {Object} data - Sub-unit data
 * @returns {Promise<Object>} Created sub-unit
 */
export const createSubUnit = async (data) => {
  try {
      const response = await api.post(ENDPOINTS.SUB_UNITS.CREATE, data)
      return response.data
    
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true,
      data: { id: Date.now(), ...data }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to create sub-unit'
    }
  }
}

/**
 * Update sub-unit
 * @param {number} id - Sub-unit ID
 * @param {Object} data - Updated sub-unit data
 * @returns {Promise<Object>} Updated sub-unit
 */
export const updateSubUnit = async (id, data) => {
  try {
    const response = await api.put(ENDPOINTS.SUB_UNITS.UPDATE(id), data)
    return response.data
    
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true,
      data: { id, ...data }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to update sub-unit'
    }
  }
}

/**
 * Delete sub-unit
 * @param {number} id - Sub-unit ID
 * @returns {Promise<Object>} Delete response
 */
export const deleteSubUnit = async (id) => {
  try {
    await api.delete(ENDPOINTS.SUB_UNITS.DELETE(id))
    
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to delete sub-unit'
    }
  }
}

/**
 * OFFICES SERVICE
 */

/**
 * Get all offices
 * @param {number} perPage - Items per page (default: 50)
 * @returns {Promise<Object>} List of offices
 */
export const getOffices = async (page = 1, perPage = null, sub_unit_id = null) => {
  try {
      const params = { page, per_page: perPage };
      if (sub_unit_id) {
        params.sub_unit_id = sub_unit_id;
      }
      const response = await api.get(ENDPOINTS.OFFICES.LIST, { params });
      return {
        success: true,
        data: response.data?.data || { data: [], current_page: 1, last_page: 1, total: 0 }
      }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to fetch offices'
    }
  }
}

/**
 * Get office by ID
 * @param {number} id - Office ID
 * @returns {Promise<Object>} Office data
 */
export const getOfficeById = async (id) => {
  try {
    const response = await api.get(ENDPOINTS.OFFICES.GET(id))
    return response.data
    
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      success: true,
      data: null
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to fetch office'
    }
  }
}

/**
 * Create new office
 * @param {Object} data - Office data
 * @returns {Promise<Object>} Created office
 */
export const createOffice = async (data) => {
  try {
    const response = await api.post(ENDPOINTS.OFFICES.CREATE, data)
    return response.data
    
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true,
      data: { id: Date.now(), ...data }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to create office'
    }
  }
}

/**
 * Update office
 * @param {number} id - Office ID
 * @param {Object} data - Updated office data
 * @returns {Promise<Object>} Updated office
 */
export const updateOffice = async (id, data) => {
  try {
    const response = await api.put(ENDPOINTS.OFFICES.UPDATE(id), data)
    return response.data
    
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true,
      data: { id, ...data }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to update office'
    }
  }
}

/**
 * Delete office
 * @param {number} id - Office ID
 * @returns {Promise<Object>} Delete response
 */
export const deleteOffice = async (id) => {
  try {
    await api.delete(ENDPOINTS.OFFICES.DELETE(id))
    
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to delete office'
    }
  }
}

/**
 * SUB-OFFICES SERVICE
 */

/**
 * Get all sub-offices
 * @param {number} perPage - Items per page (default: 50)
 * @returns {Promise<Object>} List of sub-offices
 */
export const getSubOffices = async (page = 1, perPage = null, office_id = null) => {
  try {
    const params = { page, per_page: perPage };
    if (office_id) {
      params.office_id = office_id;
    }
    const response = await api.get(ENDPOINTS.SUB_OFFICES.LIST, { params });
    return {
      success: true,
      data: response.data?.data || { data: [], current_page: 1, last_page: 1, total: 0 }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to fetch sub-offices'
    }
  }
}

/**
 * Get sub-office by ID
 * @param {number} id - Sub-office ID
 * @returns {Promise<Object>} Sub-office data
 */
export const getSubOfficeById = async (id) => {
  try {
      const response = await api.get(ENDPOINTS.SUB_OFFICES.GET(id))
      return response.data
      
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      success: true,
      data: null
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to fetch sub-office'
    }
  }
}

/**
 * Create new sub-office
 * @param {Object} data - Sub-office data
 * @returns {Promise<Object>} Created sub-office
 */
export const createSubOffice = async (data) => {
  try {
    const response = await api.post(ENDPOINTS.SUB_OFFICES.CREATE, data)
    return response.data
    
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true,
      data: { id: Date.now(), ...data }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to create sub-office'
    }
  }
}

/**
 * Update sub-office
 * @param {number} id - Sub-office ID
 * @param {Object} data - Updated sub-office data
 * @returns {Promise<Object>} Updated sub-office
 */
export const updateSubOffice = async (id, data) => {
  try {
    const response = await api.put(ENDPOINTS.SUB_OFFICES.UPDATE(id), data)
    return response.data
    
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true,
      data: { id, ...data }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to update sub-office'
    }
  }
}

/**
 * Delete sub-office
 * @param {number} id - Sub-office ID
 * @returns {Promise<Object>} Delete response
 */
export const deleteSubOffice = async (id) => {
  try {
    await api.delete(ENDPOINTS.SUB_OFFICES.DELETE(id))
    
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to delete sub-office'
    }
  }
}
