import api from './axiosConfig'
import { ENDPOINTS } from './endpoints'

const REPORT_CONFIG = {
  personnel: {
    create: { method: 'post', endpoint: () => ENDPOINTS.REPORT_PERSONNEL.CREATE },
    // getAll: { method: 'get',  endpoint: () => ENDPOINTS.REPORT_PERSONNEL.GET },
    // getOne: { method: 'get',  endpoint: (id) => `${ENDPOINTS.REPORT_PERSONNEL.GET}/${id}` },
    update: { method: 'put',  endpoint: (id) => ENDPOINTS.REPORT_PERSONNEL.UPDATE(id) },
    // submit: { method: 'post', endpoint: (id) => `${ENDPOINTS.REPORT_PERSONNEL.SUBMIT}/${id}` },
  },
  // training: {
  //   create: { method: 'post', endpoint: () => ENDPOINTS.REPORT_TRAINING.CREATE },
  //   getAll: { method: 'get',  endpoint: () => ENDPOINTS.REPORT_TRAINING.GET },
  // },
}

export const executeReportAction  = async (payload, reportType, action = 'create', id = null) => {
  const reportGroup = REPORT_CONFIG[reportType]

  if (!reportGroup) {
    return { success: false, error: `Unknown report type: ${reportType}` }
  }

  const config = reportGroup[action]

  if (!config) {
    return { success: false, error: `Unknown action "${action}" for report type "${reportType}"` }
  }

  const endpoint = config.endpoint(id) // kahit walang id, okay lang - undefined lang gagamitin sa endpoint() na walang param

  try {
    const response = config.method === 'get'
      ? await api.get(endpoint, { params: payload })
      : await api[config.method](endpoint, payload)

    return response?.data
  } catch (error) {
    return {
      success: false,
      error: error.message || `Failed to ${action} ${reportType} report`,
      message: error.response?.data?.message || error.message || `Failed to ${action} ${reportType} report`,
    }
  }
}