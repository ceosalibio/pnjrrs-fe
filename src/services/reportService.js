import api from './axiosConfig'
import { ENDPOINTS } from './endpoints'

const REPORT_CONFIG = {
  personnel: {
    create: { method: 'post', endpoint: () => ENDPOINTS.REPORT_PERSONNEL.CREATE },
    update: { method: 'put',  endpoint: (id) => ENDPOINTS.REPORT_PERSONNEL.UPDATE(id) },
    printReadiness: { method: 'post', endpoint: () => ENDPOINTS.REPORT_PERSONNEL.PRINT_READINESS },
    summary: { method: 'get',  endpoint: () => ENDPOINTS.REPORT_PERSONNEL.SUMMARY_READINESS },
    printSummaryReadiness: { method: 'post', endpoint: () => ENDPOINTS.REPORT_PERSONNEL.PRINT_SUMMARY_READINESS },
  },
  training: {
    create: { method: 'post', endpoint: () => ENDPOINTS.REPORT_TRAINING.CREATE },
    getAll: { method: 'get',  endpoint: () => ENDPOINTS.REPORT_TRAINING.LIST },
    update: { method: 'put',  endpoint: (id) => ENDPOINTS.REPORT_TRAINING.UPDATE(id) },
    printReadiness: { method: 'post', endpoint: () => ENDPOINTS.REPORT_TRAINING.PRINT_READINESS },
    summary: { method: 'get',  endpoint: () => ENDPOINTS.REPORT_TRAINING.SUMMARY_READINESS },
    printSummaryReadiness: { method: 'post', endpoint: () => ENDPOINTS.REPORT_TRAINING.PRINT_SUMMARY_READINESS },
  },
  equipment: {
    create: { method: 'post', endpoint: () => ENDPOINTS.REPORT_EQUIPMENT.CREATE },
    getAll: { method: 'get',  endpoint: () => ENDPOINTS.REPORT_EQUIPMENT.LIST },
    update: { method: 'put',  endpoint: (id) => ENDPOINTS.REPORT_EQUIPMENT.UPDATE(id) },
    printReadiness: { method: 'post', endpoint: () => ENDPOINTS.REPORT_EQUIPMENT.PRINT_READINESS },
    summary: { method: 'get',  endpoint: () => ENDPOINTS.REPORT_EQUIPMENT.SUMMARY_READINESS },
    printSummaryReadiness: { method: 'post', endpoint: () => ENDPOINTS.REPORT_EQUIPMENT.PRINT_SUMMARY_READINESS },
  },

  facilities: {
    create: { method: 'post', endpoint: () => ENDPOINTS.REPORT_FACILITIES.CREATE },
    getAll: { method: 'get',  endpoint: () => ENDPOINTS.REPORT_FACILITIES.LIST },
    update: { method: 'put',  endpoint: (id) => ENDPOINTS.REPORT_FACILITIES.UPDATE(id) },
    printReadiness: { method: 'post', endpoint: () => ENDPOINTS.REPORT_FACILITIES.PRINT_READINESS },
    summary: { method: 'get',  endpoint: () => ENDPOINTS.REPORT_FACILITIES.SUMMARY_READINESS },
    printSummaryReadiness: { method: 'post', endpoint: () => ENDPOINTS.REPORT_FACILITIES.PRINT_SUMMARY_READINESS },
  },
  all: {
    stats: { method: 'get',  endpoint: () => ENDPOINTS.REPORT_ALL.SUMMARY_STATS },
    summary: { method: 'get',  endpoint: () => ENDPOINTS.REPORT_ALL.SUMMARY_READINESS },
    printSummaryReadiness: { method: 'post', endpoint: () => ENDPOINTS.REPORT_ALL.PRINT_SUMMARY_READINESS },
  },
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

export const printReportReadiness = async (
  payload,
  reportType,
  fileName = 'readiness-report.xlsx'
) => {
  const reportGroup = REPORT_CONFIG[reportType]

  if (!reportGroup) {
    return { success: false, error: `Unknown report type: ${reportType}` }
  }

  const config = reportGroup.printReadiness

  if (!config) {
    return {
      success: false,
      error: `Print readiness action not defined for report type "${reportType}"`,
    }
  }

  try {
    const response = await api.post(
      config.endpoint(),
      payload,
      {
        responseType: 'blob',
      }
    )

    const url = window.URL.createObjectURL(response.data)

    const link = document.createElement('a')
    link.href = url
    link.download = fileName

    document.body.appendChild(link)
    link.click()

    link.remove()
    window.URL.revokeObjectURL(url)

    return {
      success: true,
      message: 'File downloaded successfully.',
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || `Failed to print readiness for ${reportType} report`,
      message:
        error.response?.data?.message ||
        error.message ||
        `Failed to print readiness for ${reportType} report`,
    }
  }
}


export const printSummaryReportReadiness = async (
  payload,
  reportType,
  fileName = 'readiness-report.xlsx'
) => {
  const reportGroup = REPORT_CONFIG[reportType]

  if (!reportGroup) {
    return { success: false, error: `Unknown report type: ${reportType}` }
  }

  const config = reportGroup.printSummaryReadiness

  if (!config) {
    return {
      success: false,
      error: `Print readiness action not defined for report type "${reportType}"`,
    }
  }

  try {
    const response = await api.post(
      config.endpoint(),
      payload,
      {
        responseType: 'blob',
      }
    )

    const url = window.URL.createObjectURL(response.data)

    const link = document.createElement('a')
    link.href = url
    link.download = `${reportType}-${fileName}`

    document.body.appendChild(link)
    link.click()

    link.remove()
    window.URL.revokeObjectURL(url)

    return {
      success: true,
      message: 'File downloaded successfully.',
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || `Failed to print readiness for ${reportType} report`,
      message:
        error.response?.data?.message ||
        error.message ||
        `Failed to print readiness for ${reportType} report`,
    }
  }
}
