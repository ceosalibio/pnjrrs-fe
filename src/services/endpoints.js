/**
 * Centralized API Endpoints
 * Extracted from Postman collection and organized by feature/module
 * Base path: /api/v1
 */
const BASE_PATH = '/api/v1';
export const ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: `${BASE_PATH}/login`,
    LOGOUT: `${BASE_PATH}/logout`
  },

  // Users management endpoints
  USERS: {
    LIST: `${BASE_PATH}/users`,
    GET: (id) => `${BASE_PATH}/users/${id}`,
    CREATE: `${BASE_PATH}/users`,
    UPDATE: (id) => `${BASE_PATH}/users/${id}`,
    DELETE: (id) => `${BASE_PATH}/users/${id}`,
    GET_BY_RANK: (rankId) => `${BASE_PATH}/users/rank/${rankId}`,
    GET_RANK:`${BASE_PATH}/users/get-rank`
  },

  // Categories endpoints
  CATEGORIES: {
    LIST: `${BASE_PATH}/categories`,
    GET: (id) => `${BASE_PATH}/categories/${id}`,
    CREATE: `${BASE_PATH}/categories`,
    UPDATE: (id) => `${BASE_PATH}/categories/${id}`,
    DELETE: (id) => `${BASE_PATH}/categories/${id}`
  },

  // Units endpoints
  UNITS: {
    LIST: `${BASE_PATH}/units`,
    GET: (id) => `${BASE_PATH}/units/${id}`,
    CREATE: `${BASE_PATH}/units`,
    UPDATE: (id) => `${BASE_PATH}/units/${id}`,
    DELETE: (id) => `${BASE_PATH}/units/${id}`
  },

  // Sub-Units endpoints
  SUB_UNITS: {
    LIST: `${BASE_PATH}/sub-units`,
    GET: (id) => `${BASE_PATH}/sub-units/${id}`,
    CREATE: `${BASE_PATH}/sub-units`,
    UPDATE: (id) => `${BASE_PATH}/sub-units/${id}`,
    DELETE: (id) => `${BASE_PATH}/sub-units/${id}`
  },

  // Offices endpoints
  OFFICES: {
    LIST: `${BASE_PATH}/offices`,
    GET: (id) => `${BASE_PATH}/offices/${id}`,
    CREATE: `${BASE_PATH}/offices`,
    UPDATE: (id) => `${BASE_PATH}/offices/${id}`,
    DELETE: (id) => `${BASE_PATH}/offices/${id}`
  },

  // Sub-Offices endpoints
  SUB_OFFICES: {
    LIST: `${BASE_PATH}/sub-offices`,
    GET: (id) => `${BASE_PATH}/sub-offices/${id}`,
    CREATE: `${BASE_PATH}/sub-offices`,
    UPDATE: (id) => `${BASE_PATH}/sub-offices/${id}`,
    DELETE: (id) => `${BASE_PATH}/sub-offices/${id}`
  },

  // AFPOS/Item AFPOS endpoints
  AFPOS: {
    LIST: `${BASE_PATH}/item-afpos`,
    GET: (id) => `${BASE_PATH}/item-afpos/${id}`,
    CREATE: `${BASE_PATH}/item-afpos`,
    UPDATE: (id) => `${BASE_PATH}/item-afpos/${id}`,
    DELETE: (id) => `${BASE_PATH}/item-afpos/${id}`,
    GET_BY_DIVISION: (divisionId) => `${BASE_PATH}/item-afpos/division/${divisionId}`
  },
  // SETTING_ORGANIZATION endpoints are not included as they are not defined in the Postman collection
  SETTING_ORGANIZATION: {
    LIST: `${BASE_PATH}/settings/organizations`,
    GET: (id) => `${BASE_PATH}/settings/organizations/${id}`,
    CREATE: `${BASE_PATH}/settings/organizations`,
    UPDATE: (id) => `${BASE_PATH}/settings/organizations/${id}`,
    DELETE: (id) => `${BASE_PATH}/settings/organizations/${id}`,
  },

  // SETTING_TRAINING endpoints
  SETTING_TRAINING: {
    LIST: `${BASE_PATH}/settings/training-items`,
    GET: (id) => `${BASE_PATH}/settings/training-items/${id}`,
    GET_BY_UNIT: (unitId) => `${BASE_PATH}/settings/training-items/unit/${unitId}`,
    CREATE: `${BASE_PATH}/settings/training-items`,
    UPDATE: (id) => `${BASE_PATH}/settings/training-items/${id}`,
    DELETE: (id) => `${BASE_PATH}/settings/training-items/${id}`,
  },

  // personnel report
  REPORT_PERSONNEL: {
    // LIST: `${BASE_PATH}/settings/organizations`,
    // GET: (id) => `${BASE_PATH}/settings/organizations/${id}`,
    CREATE: `${BASE_PATH}/report/personnels`,
    UPDATE: (id) => `${BASE_PATH}/report/personnels/${id}`,
    // DELETE: (id) => `${BASE_PATH}/settings/organizations/${id}`,
  },

   // personnel report
  REPORT_TRAINING: {
    LIST: `${BASE_PATH}/report/trainings`,
    // GET: (id) => `${BASE_PATH}/settings/organizations/${id}`,
    CREATE: `${BASE_PATH}/report/trainings`,
    UPDATE: (id) => `${BASE_PATH}/report/trainings/${id}`,
    // DELETE: (id) => `${BASE_PATH}/settings/organizations/${id}`,
  },
}
