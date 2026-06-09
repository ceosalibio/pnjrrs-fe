import axios from 'axios'

/**
 * Global Axios Instance Configuration
 * Provides a centralized, reusable API client with automatic token injection
 * 
 * Features:
 * - Centralized base URL configuration
 * - Automatic token injection in request headers
 * - Environment-based configuration
 * - Request/Response interceptors ready for extension
 */

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

/**
 * Request Interceptor
 * Automatically injects authentication token from localStorage
 * Can be extended for other request transformations
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Response Interceptor
 * Can be extended to handle global error scenarios
 * Examples: Handle 401 redirects, refresh tokens, etc.
 */
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      // Optionally redirect to login
      // window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
