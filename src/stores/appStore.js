import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  const sidebarOpen = ref(true)
  const snackbar = ref({
    visible: false,
    message: '',
    type: 'info', // 'success', 'error', 'warning', 'info'
    timeout: 3000
  })
  const loading = ref(false)
  const dialog = ref({
    visible: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: null,
    onCancel: null
  })

  const getSidebarOpen = computed(() => sidebarOpen.value)
  const getSnackbar = computed(() => snackbar.value)
  const getLoading = computed(() => loading.value)
  const getDialog = computed(() => dialog.value)

  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
  }

  const setSidebarOpen = (status) => {
    sidebarOpen.value = status
  }

  const showSnackbar = (message, type = 'info', timeout = 3000) => {
    snackbar.value = {
      visible: true,
      message,
      type,
      timeout
    }
  }

  const hideSnackbar = () => {
    snackbar.value.visible = false
  }

  const setLoading = (status) => {
    loading.value = status
  }

  const showDialog = (title, message, onConfirm, onCancel = null, confirmText = 'Confirm', cancelText = 'Cancel') => {
    dialog.value = {
      visible: true,
      title,
      message,
      confirmText,
      cancelText,
      onConfirm,
      onCancel
    }
  }

  const hideDialog = () => {
    dialog.value.visible = false
  }

  return {
    sidebarOpen,
    snackbar,
    loading,
    dialog,
    getSidebarOpen,
    getSnackbar,
    getLoading,
    getDialog,
    toggleSidebar,
    setSidebarOpen,
    showSnackbar,
    hideSnackbar,
    setLoading,
    showDialog,
    hideDialog
  }
})
