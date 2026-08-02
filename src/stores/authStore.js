import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)
  const hpn = ref(null)
  const office = ref(null)
  const n3_access = ref(null)
  const isAuthenticated = ref(false)
  const rememberMe = ref(false)
  const isLoading = ref(false)
  const captchaVerified = ref(false)
  const pendingUsername = ref(null)
  const pendingPassword = ref(null)

  const getUser = computed(() => user.value)
  const getToken = computed(() => token.value)
  const getIsAuthenticated = computed(() => isAuthenticated.value)
  const getRememberMe = computed(() => rememberMe.value)
  const getIsLoading = computed(() => isLoading.value)
  const getCaptchaVerified = computed(() => captchaVerified.value)
  const getPendingUsername = computed(() => pendingUsername.value)
  const getPendingPassword = computed(() => pendingPassword.value)
  const hideUpdateBtn = computed(()=>{
    return user.value?.role == 2
  })

  const setUser = (userData) => {
    user.value = userData
  }

  const setHpn = (userData) =>{
    hpn.value = userData?.unit_id == 1 ? true : false
  }
  const setOffice = (userData) =>{
    office.value = userData?.office_role
  }

  const setn3Access = (userData) =>{
    n3_access.value = userData?.unit_id == 1  && userData?.office_role == 3
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

  const setPendingPasswordChange = (username, password) => {
    pendingUsername.value = username
    pendingPassword.value = password
  }

  const clearPendingPasswordChange = () => {
    pendingUsername.value = null
    pendingPassword.value = null
  }

  const login = (userData, authToken) => {
    // console.log('[authStore] Login called with:', { userData, authToken })
    setUser(userData)
    setToken(authToken)
    setAuthenticated(true)
    setHpn(userData)
    setOffice(userData)
    setn3Access(userData)
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
    clearPendingPasswordChange()
    localStorage.clear()
  }

  return {
    user,
    token,
    hpn,
    office,
    n3_access,
    isAuthenticated,
    rememberMe,
    isLoading,
    captchaVerified,
    pendingUsername,
    pendingPassword,
    getUser,
    getToken,
    getIsAuthenticated,
    getRememberMe,
    getIsLoading,
    getCaptchaVerified,
    getPendingUsername,
    getPendingPassword,
    hideUpdateBtn,
    setUser,
    setToken,
    setAuthenticated,
    setRememberMe,
    setLoading,
    setCaptchaVerified,
    setPendingPasswordChange,
    clearPendingPasswordChange,
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