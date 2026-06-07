import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000'
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const mockReports = [
  { id: 1, title: 'Monthly Operations Report', status: 'Approved', date: '2024-06-01', author: 'CAPT Maria Santos' },
  { id: 2, title: 'Equipment Maintenance Report', status: 'Pending', date: '2024-06-05', author: 'PO3 Pedro Garcia' },
  { id: 3, title: 'Personnel Training Summary', status: 'Approved', date: '2024-06-03', author: 'CAPT Maria Santos' }
]

export const getReports = async () => {
  try {
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

export const getReportById = async (id) => {
  try {
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

export const createReport = async (data) => {
  try {
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

export const updateReport = async (id, data) => {
  try {
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

export const approveReport = async (id) => {
  try {
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

export const deleteReport = async (id) => {
  try {
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
