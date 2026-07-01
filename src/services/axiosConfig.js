import axios from 'axios'
import { useAppStore } from '@/stores/appStore'

/**
 * Global Axios Instance Configuration
 * Provides a centralized, reusable API client with automatic token injection
 * 
 * Features:
 * - Centralized base URL configuration
 * - Automatic token injection in request headers
 * - Global loading state, applied ONLY to authenticated (token-bearing) requests
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

// Counter to correctly handle multiple concurrent authenticated requests
let activeAuthRequests = 0

const startLoading = () => {
  const appStore = useAppStore()
  activeAuthRequests++
  appStore.setLoading(true)
}

const stopLoading = () => {
  const appStore = useAppStore()
  activeAuthRequests = Math.max(0, activeAuthRequests - 1)
  if (activeAuthRequests === 0) {
    appStore.setLoading(false)
  }
}

/**
 * Request Interceptor
 * Automatically injects authentication token from localStorage.
 * Only requests that actually have a token attached will trigger
 * the global loading state (tracked via config._hasToken).
 *
 * Set `skipLoading: true` in a request config to opt a specific
 * authenticated call out of the global loading indicator
 * (e.g. background polling, silent refreshes).
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      config._hasToken = true

      if (config.skipLoading !== true) {
        startLoading()
        config._loadingStarted = true
      }
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
 *
 * Only stops loading for requests that had it started
 * (i.e. token-bearing requests that weren't explicitly skipped).
 */
api.interceptors.response.use(
  (response) => {
    if (response.config._loadingStarted) {
      stopLoading()
    }
    return response
  },
  (error) => {
    if (error.config?._loadingStarted) {
      stopLoading()
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      // Optionally redirect to login
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default api