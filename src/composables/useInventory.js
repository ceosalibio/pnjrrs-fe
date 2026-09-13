import { ref } from 'vue'
import { useSnackbar } from './useSnackbar'
import { executeReportAction } from '@/services/reportService'

/**
 * Composable for managing user operations
 * Handles CRUD operations via userService
 */
export const useInventory = () => {
  const { showSuccess, showError } = useSnackbar()

  const loading = ref(false)
  const inventories = ref([])
  const current_page = ref(1)
  const per_page = ref(50)
  const total = ref(0)


  /**
   * Fetch all users with optional filters
   * @param {Object} filters - Query filters (search, category_id, unit_id, etc.)
   */
  const fetchData = async (filters = {}) => {
    loading.value = true
    try {
        const result = await executeReportAction(filters,'equipment','inventory')

        // if (!result.success) throw new Error(result.error)

        inventories.value = result.data?.data ?? result.data ?? []
        total.value = result?.data?.total ?? result?.data?.length ?? 0
        current_page.value = result?.data?.current_page ?? 1
      return result
    } catch (error) {
      const errorMessage = error.message || 'Failed to fetch inventories'
      showError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }


  return {
    // State
    loading,
    current_page,
    per_page,
    total,
    inventories,
    // Methods
    fetchData,
  
  }
}

