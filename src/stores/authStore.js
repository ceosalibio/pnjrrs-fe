import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)
  const isAuthenticated = ref(false)
  const rememberMe = ref(false)
  const isLoading = ref(false)
  const captchaVerified = ref(false)

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
  }

  const setAuthenticated = (status) => {
    isAuthenticated.value = status
  }

  const setRememberMe = (status) => {
    rememberMe.value = status
  }

  const setLoading = (status) => {
    isLoading.value = status
  }

  const setCaptchaVerified = (status) => {
    captchaVerified.value = status
  }

  const login = (userData, authToken) => {
    // console.log('[authStore] Login called with:', { userData, authToken })
    setUser(userData)
    setToken(authToken)
    setAuthenticated(true)
    localStorage.setItem('user',user.value)
    localStorage.setItem('token',token.value)
    localStorage.setItem('isAuthenticated',isAuthenticated.value)
    // console.log('[authStore] Store state after login:', { 
    //   user: user.value, 
    //   token: token.value, 
    //   isAuthenticated: isAuthenticated.value 
    // })
  }

  const logout = () => {
    user.value = null
    token.value = null
    isAuthenticated.value = false
    captchaVerified.value = false
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('isAuthenticated')
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
}, {
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'auth',
        storage: localStorage,
        paths: ['user', 'token', 'isAuthenticated', 'rememberMe', 'captchaVerified']
      }
    ]
  }
})