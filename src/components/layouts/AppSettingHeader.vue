<template>
    <div>
        <v-card class="pa-4 mb-4" outlined>
            <div class="d-flex ga-4 flex-wrap align-center">
                <div class="filter-input-wrapper">
                    <AppAutocomplete 
                        label="Units"
                        hide-details
                    />
                </div>
                <div class="filter-input-wrapper">
                    <AppAutocomplete 
                        label="Subunits"
                    />
                </div>
                <div class="filter-input-wrapper">
                    <AppAutocomplete 
                        label="Offices"
                    />
                </div>

                <v-spacer />

                <AppButton
                    color="primary"
                    @on-click="isUploadDialogOpen = true"
                >
                   Upload File
                </AppButton>

            </div>
        </v-card>

        <!-- File Upload Dialog -->
        <v-dialog
            v-model="isUploadDialogOpen"
            max-width="600"
            persistent
        >
            <v-card>
                <v-card-title>Upload File</v-card-title>
                <v-divider />
                <v-card-text class="pa-6">
                    <AppFileUpload
                        :onUpload="handleFileUpload"
                        accept=".pdf,.doc,.docx,.xlsx,.csv"
                        :maxFileSize="10485760"
                        button-label="Choose File"
                        @upload-success="handleUploadSuccess"
                        @upload-error="handleUploadError"
                    />
                </v-card-text>
                <v-divider />
                <v-card-actions>
                    <v-spacer />
                    <AppButton
                        color="grey"
                        variant="text"
                        @on-click="isUploadDialogOpen = false"
                    >
                        Close
                    </AppButton>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script setup>
    import { ref } from 'vue'
    import AppAutocomplete from '../forms/AppAutocomplete.vue'
    import AppButton from '../common/AppButton.vue'
    import AppTextField from '../forms/AppTextField.vue'
    import AppFileUpload from '../common/AppFileUpload.vue'
    import api from '@/services/axiosConfig'

    const isUploadDialogOpen = ref(false)

    defineProps({
        withYear : {
            type : Boolean,
            default : false
        },
        isUpload : {
            type : Boolean,
            default : false
        },
    })

    /**
     * Handle file upload
     * @param {FormData} formData - File data to upload
     * @param {Function} onProgress - Progress callback
     */
    const handleFileUpload = async (formData, onProgress) => {
        try {
            const response = await api.post('/api/upload', formData, {
                onUploadProgress: (e) => {
                    const progress = Math.round((e.loaded / e.total) * 100)
                    onProgress(progress)
                }
            })
            return response.data
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Upload failed')
        }
    }

    /**
     * Handle successful upload
     */
    const handleUploadSuccess = (result) => {
        console.log('File uploaded successfully:', result)
        isUploadDialogOpen.value = false
        // TODO: Emit event to parent or show notification
    }

    /**
     * Handle upload error
     */
    const handleUploadError = (error) => {
        console.error('Upload error:', error)
        // TODO: Show error notification
    }
</script>

<style scoped>
.filter-input-wrapper {
    flex: 1;
    min-width: 180px;
}
</style>
