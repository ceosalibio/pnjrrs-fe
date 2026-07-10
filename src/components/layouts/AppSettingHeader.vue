<template>
    <div>
        <v-card class="pa-4" outlined>
            <div class="d-flex ga-4 flex-wrap align-center">
                <div class="filter-input-wrapper">
                    <AppAutocomplete 
                        label="Units"
                        v-model="filterStore.unit"
                        :text="'name'"
                        :value="'id'"
                        :items="filterStore.organizationFilterItems.units"
                    />
                </div>
                <div class="filter-input-wrapper">
                    <AppAutocomplete 
                        label="Subunits"
                        v-model="filterStore.subunit"
                        :text="'name'"
                        :value="'id'"
                        :items="filterStore.organizationFilterItems.subunits"
                    />
                </div>
                <div class="filter-input-wrapper">
                    <AppAutocomplete 
                        v-if="filterStore.organizationFilterItems.offices?.length > 0"
                        label="Offices"
                        v-model="filterStore.office"
                        :text="'name'"
                        :value="'id'"
                        :items="filterStore.organizationFilterItems.offices"
                        :clearable="true"
                    />
                </div>
                <div class="filter-input-wrapper">
                    <AppAutocomplete 
                        v-if="filterStore.organizationFilterItems.suboffices?.length > 0"
                        label="Suboffices"
                        v-model="filterStore.suboffice"
                        :text="'name'"
                        :value="'id'"
                        :items="filterStore.organizationFilterItems.suboffices"
                    />
                </div>

                <v-spacer />

                <AppButton
                    v-if="showGenerate"
                    color="warning"
                    @on-click="emit('generate')"
                >
                   Generate
                </AppButton>

                <AppButton
                    v-if="isUpload"
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
    import { useFilterStore } from '@/stores/filterStore.js';

    const filterStore = useFilterStore();
    const isUploadDialogOpen = ref(false)

    // Define emitted events
    const emit = defineEmits(['generate', 'upload-success', 'upload-error'])

    defineProps({
        withYear : {
            type : Boolean,
            default : false
        },
        isUpload : {
            type : Boolean,
            default : false
        },
        showGenerate : {
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
        isUploadDialogOpen.value = false
        emit('upload-success', result)
    }

    /**
     * Handle upload error
     */
    const handleUploadError = (error) => {
        emit('upload-error', error)
    }
</script>

<style scoped>
.filter-input-wrapper {
    flex: 1;
    min-width: 180px;
}
</style>
