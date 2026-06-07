import axios from 'axios'
import { mockPersonnel } from '@/utils/mockData'

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

export default api
