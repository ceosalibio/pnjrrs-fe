import api from './axiosConfig'
import { ENDPOINTS } from './endpoints'
import { useAppStore } from '@/stores/appStore'

const appStore = useAppStore()
// setting organization service functions

/**
 * Get all organization settings with optional filters
 * @param {Object} filters - Query filters
 * @returns {Promise<Object>} Organization settings list response
 * 
 * Note: This function is a placeholder and should be implemented according to the actual API response structure for organization settings.
 */
export const getOrganizationSettings = async (filters = {}) => {
  try {
    const response = await api.get(ENDPOINTS.SETTING_ORGANIZATION.LIST, { params: filters })
    return response.data;
  } catch (error) {
    console.error('Error fetching organization settings:', error);
    throw error;
  }
}

/**
 * Create or update organization settings
 * @param {Object} payload - Organization settings data to create or update
 * @returns {Promise<Object>} API response for create/update operation
 * /
 * Note: This function is a placeholder and should be implemented according to the actual API requirements for creating/updating organization settings.
 */
export const saveOrganizationSettings = async (payload) => {
    try {
        const response = await api.post(ENDPOINTS.SETTING_ORGANIZATION.CREATE, payload);
        return response.data;
    } catch (error) {
        console.error('Error saving organization settings:', error);
        throw error;
    }
}

/**
 * update organization settings by ID
 * @param {number} id - ID of the organization settings to update
 * @param {Object} payload - Organization settings data to update
 *  
 * Note: This function is a placeholder and should be implemented according to the actual API requirements for updating organization settings.
 */
export const updateOrganizationSettings = async (id, payload) => {
    try {
        const response = await api.put(ENDPOINTS.SETTING_ORGANIZATION.UPDATE(id), payload);
        return response.data;
    } catch (error) {
        console.error('Error updating organization settings:', error);
        throw error;
    }
}

/**
 * Delete organization settings by ID
 * @param {number} id - ID of the organization settings to delete
 * @returns {Promise<Object>} API response for delete operation
 * 
 * Note: This function is a placeholder and should be implemented according to the actual API requirements for deleting organization settings.
 */
export const deleteOrganizationSettings = async (id) => {
    try {
        const response = await api.delete(ENDPOINTS.SETTING_ORGANIZATION.DELETE(id));
        return response.data;
    } catch (error) {
        console.error('Error deleting organization settings:', error);
        throw error;
    }
}

// ============================================================
// setting training service functions
// ============================================================

/**
 * Get all training settings with optional filters
 * @param {Object} filters - Query filters
 * @returns {Promise<Object>} Training settings list response
 */
export const getTrainingSettings = async (filters = {}) => {
    try {
        const response = await api.get(ENDPOINTS.SETTING_TRAINING.LIST, { params: filters })
        return response.data;
    } catch (error) {
        console.error('Error fetching training settings:', error);
        throw error;
    }
}

export const getTrainingSettingsByUnit = async (unitId) => {
    try {
        const response = await api.get(ENDPOINTS.SETTING_TRAINING.GET_BY_UNIT(unitId));
        return response.data;
    } catch (error) {
        console.error('Error fetching training settings:', error);
        throw error;
    }
}

/**
 * Create training settings
 * @param {Object} payload - Training settings data to create
 * @returns {Promise<Object>} API response for create operation
 */
export const saveTrainingSettings = async (payload) => {
    try {
        const response = await api.post(ENDPOINTS.SETTING_TRAINING.CREATE, payload);
        return response.data;
    } catch (error) {
        console.error('Error saving training settings:', error);
        throw error;
    }
}

/**
 * Update training settings by ID
 * @param {number} id - ID of the training settings to update
 * @param {Object} payload - Training settings data to update
 * @returns {Promise<Object>} API response for update operation
 */
export const updateTrainingSettings = async (id, payload) => {
    try {
        const response = await api.put(ENDPOINTS.SETTING_TRAINING.UPDATE(id), payload);
        return response.data;
    } catch (error) {
        console.error('Error updating training settings:', error);
        throw error;
    }
}

/**
 * Delete training settings by ID
 * @param {number} id - ID of the training settings to delete
 * @returns {Promise<Object>} API response for delete operation
 */
export const deleteTrainingSettings = async (id) => {
    try {
        const response = await api.delete(ENDPOINTS.SETTING_TRAINING.DELETE(id));
        return response.data;
    } catch (error) {
        console.error('Error deleting training settings:', error);
        throw error;
    }
}



// ============================================================
// setting equipment service functions
// ============================================================

export const getEquipmentTempSettings = async () => {
    try {
        const response = await api.get(ENDPOINTS.SETTING_EQUIPMENT.TEMP_LIST)
        return response.data;
    } catch (error) {
        console.error('Error fetching equipment settings:', error);
        throw error;
    }
}

export const getEquipmentSettings = async (filters) => {
    try {
        const response = await api.get(ENDPOINTS.SETTING_EQUIPMENT.LIST, { params: filters })
        return response.data;
    } catch (error) {
        console.error('Error fetching equipment settings:', error);
        throw error;
    }
}

/**
 * Create equipment settings
 * @param {Object} payload - equipment settings data to create
 * @returns {Promise<Object>} API response for create operation
 */
export const saveEquipmentSettings = async (payload) => {
    try {
        const response = await api.post(ENDPOINTS.SETTING_EQUIPMENT.CREATE, payload);
        return response.data;
    } catch (error) {
        console.error('Error saving equipment settings:', error);
        throw error;
    }
}

/**
 * Update equipment settings by ID
 * @param {number} id - ID of the equipment settings to update
 * @param {Object} payload - equipment settings data to update
 * @returns {Promise<Object>} API response for update operation
 */
export const updateEquipmentSettings = async (id, payload) => {
    try {
        const response = await api.put(ENDPOINTS.SETTING_EQUIPMENT.UPDATE(id), payload);
        return response.data;
    } catch (error) {
        console.error('Error updating equipment settings:', error);
        throw error;
    }
}

/**
 * Delete equipment settings by ID
 * @param {number} id - ID of the equipment settings to delete
 * @returns {Promise<Object>} API response for delete operation
 */
export const deleteEquipmentSettings = async (id) => {
    try {
        const response = await api.delete(ENDPOINTS.SETTING_EQUIPMENT.DELETE(id));
        return response.data;
    } catch (error) {
        console.error('Error deleting equipment settings:', error);
        throw error;
    }
}