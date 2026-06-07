import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useUserStore } from '@/stores/userStore'
import { useAppStore } from '@/stores/appStore'
import { login as loginService, logout as logoutService } from '@/services/authService'

export const useAuth = () => {
  const router = useRouter()
  const authStore = useAuthStore()
  const userStore = useUserStore()
  const appStore = useAppStore()

  const isLoading = ref(false)
  const error = ref(null)

  const login = async (email, password, rememberMe = false) => {
    try {
      isLoading.value = true
      error.value = null
      authStore.setLoading(true)

      const result = await loginService(email, password)

      if (!result.success) {
        error.value = result.error
        appStore.showSnackbar(result.error, 'error')
        return false
      }

      authStore.login(result.user, result.token)
      userStore.setUserData(result.user)
      authStore.setRememberMe(rememberMe)

      appStore.showSnackbar('Login successful!', 'success')
      
      // Redirect to CAPTCHA verification
      await router.push('/captcha-verification')
      return true
    } catch (err) {
      error.value = err.message
      appStore.showSnackbar(err.message, 'error')
      return false
    } finally {
      isLoading.value = false
      authStore.setLoading(false)
    }
  }

  const logout = async () => {
    try {
      authStore.setLoading(true)
      const result = await logoutService()

      if (result.success) {
        authStore.logout()
        userStore.clearUserData()
        appStore.showSnackbar('You have been logged out.', 'success')
        await router.push('/login')
      }
    } catch (err) {
      appStore.showSnackbar('Logout failed', 'error')
    } finally {
      authStore.setLoading(false)
    }
  }

  const isAuthenticated = () => {
    return authStore.getIsAuthenticated
  }

  const getUser = () => {
    return authStore.getUser
  }

  const getUserRole = () => {
    return userStore.getRole
  }

  return {
    isLoading,
    error,
    login,
    logout,
    isAuthenticated,
    getUser,
    getUserRole
  }
}
