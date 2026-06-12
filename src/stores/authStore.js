import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const isAuthenticated = ref(!!token.value)
  const rememberMe = ref(localStorage.getItem('rememberMe') === 'true')
  const isLoading = ref(false)
  const captchaVerified = ref(localStorage.getItem('captchaVerified') === 'true')

  const getUser = computed(() => user.value)
  const getToken = computed(() => token.value)
  const getIsAuthenticated = computed(() => isAuthenticated.value)
  const getRememberMe = computed(() => rememberMe.value)
  const getIsLoading = computed(() => isLoading.value)
  const getCaptchaVerified = computed(() => captchaVerified.value)

  const setUser = (userData) => {
    user.value = userData
  }

  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  const setAuthenticated = (status) => {
    isAuthenticated.value = status
  }

  const setRememberMe = (status) => {
    rememberMe.value = status
    localStorage.setItem('rememberMe', status)
  }

  const setLoading = (status) => {
    isLoading.value = status
  }

  const setCaptchaVerified = (status) => {
    captchaVerified.value = status
    try {
      localStorage.setItem('captchaVerified', status)
    } catch (e) {
      // ignore storage errors
    }
  }

  const login = (userData, token) => {
    setUser(userData)
    setToken(token)
    setAuthenticated(true)
  }

  const logout = () => {
    user.value = null
    token.value = null
    isAuthenticated.value = false
    captchaVerified.value = false
    localStorage.removeItem('token')
    localStorage.removeItem('captchaVerified')
  }

  return {
    user,
    token,
    isAuthenticated,
    rememberMe,
    isLoading,
    captchaVerified,
    getUser,
    getToken,
    getIsAuthenticated,
    getRememberMe,
    getIsLoading,
    getCaptchaVerified,
    setUser,
    setToken,
    setAuthenticated,
    setRememberMe,
    setLoading,
    setCaptchaVerified,
    login,
    logout
  }
})
