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