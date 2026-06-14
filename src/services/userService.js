import { ref } from 'vue'
import { useSnackbar } from './useSnackbar'
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUsersByRank,
  getRank
} from '@/services/userService'

/**
 * Composable for managing user operations
 * Handles CRUD operations via userService
 */
export const useUser = () => {
  const { showSnackbar } = useSnackbar()

  const isLoading = ref(false)
  const users = ref([])
  const selectedUser = ref(null)
  const rank = ref(null)

  /**
   * Fetch all users with optional filters
   * @param {Object} filters - Query filters (search, category_id, unit_id, etc.)
   */
  const fetchUsers = async (filters = {}) => {
    isLoading.value = true
    try {
      const response = await getUsers(filters)

      if (!response.success) throw new Error(response.error)

      users.value = response.data
      return response
    } catch (error) {
      const errorMessage = error.message || 'Failed to fetch users'
      showSnackbar({ message: errorMessage, color: 'error' })
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch a single user by ID
   * @param {number} id - User ID
   */
  const fetchUserById = async (id) => {
    isLoading.value = true
    try {
      const response = await getUserById(id)

      if (!response.success) throw new Error(response.error)

      selectedUser.value = response.data
      return response
    } catch (error) {
      const errorMessage = error.message || 'Failed to fetch user'
      showSnackbar({ message: errorMessage, color: 'error' })
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Create a new user
   * @param {Object} userData - User data object
   */
  const addUser = async (userData) => {
    isLoading.value = true
    try {
      const response = await createUser(userData)

      if (!response.success) throw new Error(response.error)

      users.value.push(response.data)
      showSnackbar({ message: 'User created successfully', color: 'success' })
      return response
    } catch (error) {
      const errorMessage = error.message || 'Failed to create user'
      showSnackbar({ message: errorMessage, color: 'error' })
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Update an existing user
   * @param {number} id - User ID
   * @param {Object} userData - Updated user data
   */
  const editUser = async (id, userData) => {
    isLoading.value = true
    try {
      const response = await updateUser(id, userData)

      if (!response.success) throw new Error(response.error)

      const index = users.value.findIndex(u => u.id === id)
      if (index !== -1) users.value[index] = response.data

      showSnackbar({ message: 'User updated successfully', color: 'success' })
      return response
    } catch (error) {
      const errorMessage = error.message || 'Failed to update user'
      showSnackbar({ message: errorMessage, color: 'error' })
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Delete a user by ID
   * @param {number} id - User ID
   */
  const removeUser = async (id) => {
    isLoading.value = true
    try {
      const response = await deleteUser(id)

      if (!response.success) throw new Error(response.error)

      users.value = users.value.filter(u => u.id !== id)
      showSnackbar({ message: 'User deleted successfully', color: 'success' })
      return response
    } catch (error) {
      const errorMessage = error.message || 'Failed to delete user'
      showSnackbar({ message: errorMessage, color: 'error' })
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch users filtered by rank
   * @param {number} rankId - Rank ID
   */
  const fetchUsersByRank = async (rankId) => {
    isLoading.value = true
    try {
      const response = await getUsersByRank(rankId)

      if (!response.success) throw new Error(response.error)

      users.value = response.data
      return response
    } catch (error) {
      const errorMessage = error.message || 'Failed to fetch users by rank'
      showSnackbar({ message: errorMessage, color: 'error' })
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch rank 
   */
  const fetchRank = async (rankId) => {
    isLoading.value = true
    try {
      const response = await getRank()

      if (!response.success) throw new Error(response.error)

      rank.value = response.data
      return response
    } catch (error) {
      const errorMessage = error.message || 'Failed to fetch rank'
      showSnackbar({ message: errorMessage, color: 'error' })
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    isLoading,
    users,
    selectedUser,
    rank,
    // Methods
    fetchUsers,
    fetchUserById,
    addUser,
    editUser,
    removeUser,
    fetchUsersByRank,
    fetchRank
  }
}