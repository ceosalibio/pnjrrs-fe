import api from './axiosConfig'
import { ENDPOINTS } from './endpoints'

const mockReports = [
  { id: 1, title: 'Monthly Operations Report', status: 'Approved', date: '2024-06-01', author: 'CAPT Maria Santos' },
  { id: 2, title: 'Equipment Maintenance Report', status: 'Pending', date: '2024-06-05', author: 'PO3 Pedro Garcia' },
  { id: 3, title: 'Personnel Training Summary', status: 'Approved', date: '2024-06-03', author: 'CAPT Maria Santos' }
]

/**
 * Get all reports
 * @returns {Promise<Object>} List of reports
 */
export const getReports = async () => {
  try {
    // const response = await api.get(ENDPOINTS.REPORTS.LIST)
    // return response.data
    
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true,
      data: mockReports
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to fetch reports'
    }
  }
}

/**
 * Get report by ID
 * @param {number} id - Report ID
 * @returns {Promise<Object>} Report data
 */
export const getReportById = async (id) => {
  try {
    // const response = await api.get(ENDPOINTS.REPORTS.GET(id))
    // return response.data
    
    await new Promise(resolve => setTimeout(resolve, 300))
    const report = mockReports.find(r => r.id === id)
    
    if (!report) {
      throw new Error('Report not found')
    }

    return {
      success: true,
      data: report
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to fetch report'
    }
  }
}

/**
 * Create new report
 * @param {Object} data - Report data
 * @returns {Promise<Object>} Created report
 */
export const createReport = async (data) => {
  try {
    // const response = await api.post(ENDPOINTS.REPORTS.CREATE, data)
    // return response.data
    
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true,
      data: { id: Date.now(), status: 'Pending', ...data }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to create report'
    }
  }
}

/**
 * Update report
 * @param {number} id - Report ID
 * @param {Object} data - Updated report data
 * @returns {Promise<Object>} Updated report
 */
export const updateReport = async (id, data) => {
  try {
    // const response = await api.put(ENDPOINTS.REPORTS.UPDATE(id), data)
    // return response.data
    
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true,
      data: { id, ...data }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to update report'
    }
  }
}

/**
 * Approve report
 * @param {number} id - Report ID
 * @returns {Promise<Object>} Approval response
 */
export const approveReport = async (id) => {
  try {
    // const response = await api.post(ENDPOINTS.REPORTS.APPROVE(id))
    // return response.data
    
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true,
      data: { id, status: 'Approved' }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to approve report'
    }
  }
}

/**
 * Delete report
 * @param {number} id - Report ID
 * @returns {Promise<Object>} Delete response
 */
export const deleteReport = async (id) => {
  try {
    // await api.delete(ENDPOINTS.REPORTS.DELETE(id))
    
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      success: true
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to delete report'
    }
  }
}

export default api
