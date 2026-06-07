import { useAppStore } from '@/stores/appStore'

export const useLoading = () => {
  const appStore = useAppStore()

  const startLoading = () => {
    appStore.setLoading(true)
  }

  const stopLoading = () => {
    appStore.setLoading(false)
  }

  const isLoading = () => {
    return appStore.getLoading
  }

  const withLoading = async (callback) => {
    try {
      startLoading()
      const result = await callback()
      return result
    } finally {
      stopLoading()
    }
  }

  return {
    startLoading,
    stopLoading,
    isLoading,
    withLoading
  }
}
