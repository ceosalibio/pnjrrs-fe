<template>
  <div class="app-file-upload">
    <!-- Upload Area -->
    <div
      class="upload-area"
      :class="{
        'drag-over': isDragOver,
        'has-files': selectedFiles.length > 0
      }"
      @dragover.prevent="isDragOver = true"
      @dragleave.prevent="isDragOver = false"
      @drop.prevent="handleFileDrop"
    >
      <!-- Hidden File Input -->
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled || uploading"
        @change="handleFileSelect"
        style="display: none"
      />

      <!-- Empty State -->
      <div v-if="selectedFiles.length === 0" class="upload-placeholder">
        <v-icon size="48" class="mb-3 upload-icon">mdi-cloud-upload-outline</v-icon>
        <p class="upload-title">{{ uploadTitle }}</p>
        <p class="upload-subtitle">{{ uploadSubtitle }}</p>

        <!-- Upload Button -->
        <v-btn
          color="primary"
          variant="outlined"
          size="md"
          class="mt-3"
          :disabled="disabled || uploading"
          :loading="uploading"
          @click="triggerFileInput"
        >
          <template #prepend>
            <v-icon>mdi-folder-open</v-icon>
          </template>
          {{ buttonLabel }}
        </v-btn>

        <!-- Accepted File Types -->
        <p v-if="accept" class="file-types-info mt-4">
          Accepted formats: {{ accept }}
        </p>

        <!-- Max File Size Info -->
        <p v-if="maxFileSize" class="file-size-info">
          Max file size: {{ formatFileSize(maxFileSize) }}
        </p>
      </div>

      <!-- Files List -->
      <div v-else class="files-list">
        <div class="files-header">
          <h4>{{ selectedFiles.length }} {{ selectedFiles.length === 1 ? 'file' : 'files' }} selected</h4>
          <v-btn
            size="sm"
            variant="text"
            icon
            :disabled="uploading"
            @click="clearFiles"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>

        <v-list class="files-items">
          <v-list-item
            v-for="(file, index) in selectedFiles"
            :key="index"
            class="file-item"
          >
            <template #prepend>
              <v-icon class="file-icon">{{ getFileIcon(file.type) }}</v-icon>
            </template>

            <v-list-item-title class="file-name">
              {{ file.name }}
            </v-list-item-title>

            <v-list-item-subtitle class="file-size">
              {{ formatFileSize(file.size) }}
            </v-list-item-subtitle>

            <template #append>
              <v-btn
                size="sm"
                variant="text"
                icon
                :disabled="uploading"
                @click="removeFile(index)"
              >
                <v-icon color="error">mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-list-item>
        </v-list>

        <!-- Upload Progress -->
        <div v-if="uploading" class="upload-progress mt-4">
          <v-progress-linear
            :model-value="uploadProgress"
            color="primary"
            height="6"
            class="mb-2"
          />
          <p class="text-center">{{ uploadProgress }}% uploaded</p>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons mt-4">
          <v-btn
            color="primary"
            variant="contained"
            size="md"
            :disabled="uploading"
            :loading="uploading"
            @click="uploadFiles"
          >
            <template #prepend>
              <v-icon>mdi-upload</v-icon>
            </template>
            Upload Files
          </v-btn>

          <v-btn
            color="secondary"
            variant="outlined"
            size="md"
            :disabled="uploading"
            @click="clearFiles"
          >
            Cancel
          </v-btn>

          <v-btn
            color="info"
            variant="text"
            size="md"
            :disabled="uploading"
            @click="triggerFileInput"
          >
            <template #prepend>
              <v-icon>mdi-plus</v-icon>
            </template>
            Add More
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Error Messages -->
    <div v-if="errors.length > 0" class="errors mt-4">
      <v-alert
        v-for="(error, index) in errors"
        :key="index"
        type="error"
        variant="tonal"
        closable
        @click:close="removeError(index)"
      >
        {{ error }}
      </v-alert>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  /**
   * Button label text
   */
  buttonLabel: {
    type: String,
    default: 'Choose File'
  },

  /**
   * Upload area title
   */
  uploadTitle: {
    type: String,
    default: 'Drag and drop files here'
  },

  /**
   * Upload area subtitle
   */
  uploadSubtitle: {
    type: String,
    default: 'or click to browse'
  },

  /**
   * Accepted file types (e.g., ".pdf,.doc,.docx" or "image/*")
   */
  accept: {
    type: String,
    default: ''
  },

  /**
   * Allow multiple file selection
   */
  multiple: {
    type: Boolean,
    default: true
  },

  /**
   * Maximum file size in bytes
   */
  maxFileSize: {
    type: Number,
    default: null
  },

  /**
   * Disabled state
   */
  disabled: {
    type: Boolean,
    default: false
  },

  /**
   * Custom upload handler function
   * Should return a Promise
   */
  onUpload: {
    type: Function,
    required: true
  }
})

const emit = defineEmits([
  'files-selected',
  'upload-start',
  'upload-progress',
  'upload-success',
  'upload-error',
  'files-cleared'
])

// Reactive state
const fileInput = ref(null)
const selectedFiles = ref([])
const isDragOver = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)
const errors = ref([])

/**
 * Trigger file input dialog
 */
const triggerFileInput = () => {
  fileInput.value?.click()
}

/**
 * Handle file selection from input
 */
const handleFileSelect = (event) => {
  const files = Array.from(event.target.files || [])
  addFiles(files)
}

/**
 * Handle file drop
 */
const handleFileDrop = (event) => {
  isDragOver.value = false
  const files = Array.from(event.dataTransfer.files || [])
  addFiles(files)
}

/**
 * Add files to selection
 */
const addFiles = (files) => {
  errors.value = []

  for (const file of files) {
    // Validate file
    const error = validateFile(file)
    if (error) {
      errors.value.push(error)
      continue
    }

    // Add if not already selected
    const isDuplicate = selectedFiles.value.some(f => f.name === file.name && f.size === file.size)
    if (!isDuplicate) {
      selectedFiles.value.push(file)
    }
  }

  // Reset file input
  if (fileInput.value) {
    fileInput.value.value = ''
  }

  emit('files-selected', selectedFiles.value)
}

/**
 * Validate file
 */
const validateFile = (file) => {
  // Check file size
  if (props.maxFileSize && file.size > props.maxFileSize) {
    return `${file.name} exceeds maximum file size (${formatFileSize(props.maxFileSize)})`
  }

  return null
}

/**
 * Remove file from selection
 */
const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
}

/**
 * Clear all files
 */
const clearFiles = () => {
  selectedFiles.value = []
  errors.value = []
  uploadProgress.value = 0
  emit('files-cleared')
}

/**
 * Upload files
 */
const uploadFiles = async () => {
  if (selectedFiles.value.length === 0) {
    errors.value = ['No files selected']
    return
  }

  uploading.value = true
  uploadProgress.value = 0
  errors.value = []

  try {
    emit('upload-start', selectedFiles.value)

    // Create FormData
    const formData = new FormData()
    selectedFiles.value.forEach((file, index) => {
      formData.append(`files`, file)
    })

    // Call custom upload handler
    const result = await props.onUpload(formData, (progress) => {
      uploadProgress.value = progress
      emit('upload-progress', progress)
    })

    uploadProgress.value = 100
    emit('upload-success', result)

    // Clear files after successful upload
    setTimeout(() => {
      clearFiles()
    }, 1000)
  } catch (error) {
    const errorMessage = error.message || 'File upload failed'
    errors.value.push(errorMessage)
    emit('upload-error', error)
  } finally {
    uploading.value = false
  }
}

/**
 * Remove error message
 */
const removeError = (index) => {
  errors.value.splice(index, 1)
}

/**
 * Format file size
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Get file icon based on file type
 */
const getFileIcon = (fileType) => {
  if (!fileType) return 'mdi-file'

  if (fileType.startsWith('image/')) return 'mdi-image'
  if (fileType.startsWith('video/')) return 'mdi-video'
  if (fileType.startsWith('audio/')) return 'mdi-music'
  if (fileType.includes('pdf')) return 'mdi-file-pdf'
  if (fileType.includes('word') || fileType.includes('document')) return 'mdi-file-word'
  if (fileType.includes('sheet') || fileType.includes('excel')) return 'mdi-file-excel'
  if (fileType.includes('presentation') || fileType.includes('powerpoint')) return 'mdi-file-powerpoint'
  if (fileType.includes('zip') || fileType.includes('archive') || fileType.includes('compressed')) return 'mdi-file-zip'

  return 'mdi-file'
}

// Expose methods for parent component
defineExpose({
  triggerFileInput,
  clearFiles,
  uploadFiles,
  selectedFiles
})
</script>

<style scoped>
.app-file-upload {
  width: 100%;
}

.upload-area {
  position: relative;
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 32px 24px;
  background-color: #fafafa;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover:not(.has-files) {
    border-color: #1976d2;
    background-color: #f0f7ff;
  }

  &.drag-over {
    border-color: #1976d2;
    background-color: #e3f2fd;
  }

  &.has-files {
    border-color: #4caf50;
    background-color: #f1f8e9;
    padding: 24px;
  }
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 200px;
}

.upload-icon {
  color: #1976d2 !important;
}

.upload-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.upload-subtitle {
  font-size: 14px;
  color: #666;
  margin: 8px 0 0 0;
}

.file-types-info,
.file-size-info {
  font-size: 12px;
  color: #999;
  margin: 8px 0 0 0;
}

.files-list {
  min-height: 100px;
}

.files-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;

  h4 {
    margin: 0;
    color: #333;
    font-size: 14px;
    font-weight: 600;
  }
}

.files-items {
  padding: 0;
  margin: 16px 0;
}

.file-item {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.file-icon {
  color: #1976d2;
  min-width: 24px;
}

.file-name {
  font-size: 14px;
  color: #333;
  word-break: break-word;
}

.file-size {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.upload-progress {
  text-align: center;

  p {
    font-size: 12px;
    color: #666;
    margin: 0;
  }
}

.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    flex-direction: column;

    button {
      width: 100%;
    }
  }
}

.errors {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
