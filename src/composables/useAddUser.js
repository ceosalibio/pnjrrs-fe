import { ref } from 'vue'
import { useSnackbar } from './useSnackbar'

/**
 * Composable for managing user creation operations
 * Handles form submission, validation, and API communication
 */
export const useAddUser = () => {
  const { showSnackbar } = useSnackbar()
  const isLoading = ref(false)

  /**
   * Create a new user via API
   * @param {Object} userData - User data object containing all user information
   * @returns {Promise<Object>} Response object with success status and data/error
   */
  const createUser = async (userData) => {
    isLoading.value = true
    try {
      // TODO: Replace with actual API call
      // const response = await userService.createUser(userData)
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newUser = {
        id: Date.now(),
        ...userData,
        status: 'active',
        createdAt: new Date().toISOString(),
        lastLogin: 'Never'
      }

      showSnackbar({
        message: 'User created successfully',
        color: 'success'
      })

      return {
        success: true,
        data: newUser
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to create user'
      showSnackbar({
        message: errorMessage,
        color: 'error'
      })

      return {
        success: false,
        error: errorMessage
      }
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    createUser
  }
}
