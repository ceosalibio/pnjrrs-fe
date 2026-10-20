import { useAppStore } from '@/stores/appStore'
import { getErrorMessage } from '@/utils/errorHandler'

export const useSnackbar = () => {
  const appStore = useAppStore()

  const showSuccess = (message, timeout = 3000) => {
    appStore.showSnackbar(message, 'success', timeout)
  }

  // Accepts a string, an axios error, or an API response body
  const showError = (message, timeout = 3000) => {
    appStore.showSnackbar(getErrorMessage(message), 'error', timeout)
  }

  const showWarning = (message, timeout = 3000) => {
    appStore.showSnackbar(message, 'warning', timeout)
  }

  const showInfo = (message, timeout = 3000) => {
    appStore.showSnackbar(message, 'info', timeout)
  }

  const hide = () => {
    appStore.hideSnackbar()
  }

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hide
  }
}
