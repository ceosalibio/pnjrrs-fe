import { ref, computed } from 'vue'
import api from '@/services/axiosConfig'

/**
 * Composable for handling file uploads
 * Provides upload functionality and state management
 * 
 * @param {string} endpoint - API endpoint for file upload
 * @param {Object} options - Configuration options
 * @returns {Object} Upload handler and utilities
 */
export const useFileUpload = (endpoint, options = {}) => {
  const {
    maxFileSize = 10 * 1024 * 1024, // 10 MB default
    allowedExtensions = [],
    onSuccess = null,
    onError = null
  } = options

  const uploading = ref(false)
  const uploadProgress = ref(0)
  const uploadError = ref(null)
  const uploadedFiles = ref([])

  /**
   * Upload files to server
   * @param {FormData} formData - FormData object containing files
   * @param {Function} progressCallback - Callback for progress updates
   * @returns {Promise} Upload result
   */
  const uploadHandler = async (formData, progressCallback) => {
    uploading.value = true
    uploadError.value = null

    try {
      // Create upload request with progress tracking
      const config = {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          uploadProgress.value = progress
          if (progressCallback) progressCallback(progress)
        }
      }

      const response = await api.post(endpoint, formData, config)

      if (response.data.success) {
        uploadedFiles.value = response.data.data || []
        if (onSuccess) onSuccess(response.data)
        return response.data
      } else {
        throw new Error(response.data.error || 'Upload failed')
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'File upload failed'
      uploadError.value = errorMessage
      if (onError) onError(error)
      throw error
    } finally {
      uploading.value = false
      uploadProgress.value = 0
    }
  }

  /**
   * Validate file
   * @param {File} file - File to validate
   * @returns {string|null} Error message or null if valid
   */
  const validateFile = (file) => {
    // Check file size
    if (maxFileSize && file.size > maxFileSize) {
      const maxSizeMB = (maxFileSize / (1024 * 1024)).toFixed(2)
      return `File size exceeds ${maxSizeMB}MB`
    }

    // Check file extension
    if (allowedExtensions.length > 0) {
      const fileExtension = file.name.split('.').pop().toLowerCase()
      if (!allowedExtensions.includes(fileExtension)) {
        return `File type .${fileExtension} is not allowed. Allowed types: ${allowedExtensions.join(', ')}`
      }
    }

    return null
  }

  /**
   * Reset upload state
   */
  const resetUpload = () => {
    uploading.value = false
    uploadProgress.value = 0
    uploadError.value = null
    uploadedFiles.value = []
  }

  return {
    uploadHandler,
    validateFile,
    resetUpload,
    uploading,
    uploadProgress,
    uploadError,
    uploadedFiles
  }
}
