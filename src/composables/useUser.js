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
  const { showSuccess, showError } = useSnackbar()

  const isLoading = ref(false)
  const users = ref([])
  const selectedUser = ref(null)
  const rankItems = ref([])
  const currentPage = ref(1)
  const perPage = ref(15)
  const lastPage = ref(1)
  const total = ref(0)
  const isLoadingUsers = ref(false)

  /**
   * Fetch all users with optional filters
   * @param {Object} filters - Query filters (search, category_id, unit_id, etc.)
   */
  const fetchUsers = async (filters = {}) => {
    isLoading.value = true
    try {
      const response = await getUsers(filters)

      if (!response.success) throw new Error(response.error)

      users.value = response.data?.data ?? response.data ?? [] 
      const paginatedData = response.data
      currentPage.value = paginatedData.current_page || 1
      lastPage.value = paginatedData.last_page || 1
      perPage.value = paginatedData.per_page || 15
      total.value = paginatedData.total || 0
      return response
    } catch (error) {
      const errorMessage = error.message || 'Failed to fetch users'
      showError(errorMessage)
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
      showError(errorMessage)
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
      showSuccess('User created successfully')
      return response
    } catch (error) {
      const errorMessage = error.message || 'Failed to create user'
      showError(errorMessage)
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
      console.log(response,'asdasdasd')
      if (!response.success) throw new Error(response.error)

      const index = users.value.findIndex(u => u.id === id)
      if (index !== -1) users.value[index] = response.data

      // showSuccess('User updated successfully')
      return response
    } catch (error) {
      const errorMessage = error.message || 'Failed to update user'
      showError(errorMessage)
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
      showSuccess('User deleted successfully')
      return response
    } catch (error) {
      const errorMessage = error.message || 'Failed to delete user'
      showError(errorMessage)
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
      showError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch rank items
   */
  const fetchRank = async () => {
    isLoading.value = true
    try {
      const response = await getRank()

      if (!response.success) throw new Error(response.error)

      rankItems.value = response.data
      console.log('Fetched ranks:', rankItems.value)
      console.log('Rank items structure:', rankItems.value.length > 0 ? rankItems.value[0] : 'empty')
      return response
    } catch (error) {
      const errorMessage = error.message || 'Failed to fetch rank'
      showError(errorMessage)
      console.error('Rank fetch error:', error)
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
    rankItems,
    currentPage,
    perPage,
    lastPage,
    total,
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

