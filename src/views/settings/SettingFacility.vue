<template>
    <div>
        <!-- Header -->
        <div class="mb-6">
            <h1 class="text-h4 font-weight-bold">Facilities Settings</h1>
            <p class="text-grey mt-2">Manage facilities data using CSV uploads</p>
        </div>

        <!-- Main Card with Filter & Buttons -->
        <AppCard class="mb-4">
            <template #default>
                <div class="d-flex justify-space-between align-center gap-3">
                    <!-- Left: Unit Filter + File Input -->
                    <div class="d-flex ga-8 align-center">
                        <AppAutocomplete 
                            label="Units"
                            v-model="filterStore.unit"
                            :text="'name'"
                            :value="'id'"
                            :items="filterStore.organizationFilterItems.units"
                        />
                        
                        <input
                            v-if="csvData?.length == 0"
                            ref="fileInput"
                            type="file"
                            accept=".csv"
                            style="display: none"
                            @change="handleFileChange"
                        />
                        <AppButton
                            @click="triggerFileInput"
                            color="primary"
                            :disabled="csvData?.length > 0"
                        >
                            📁 Choose CSV File
                        </AppButton>
                        <span v-if="fileName" class="text-truncate file-name-display">
                            📄 {{ fileName }}
                        </span>
                    </div>

                    <!-- Right: Action Buttons -->
                    <div class="d-flex ga-2">
                        <AppButton
                            v-if="isFromAPI && !isEditMode"
                            @click="isEditMode = true"
                            color="primary"
                            :disabled="csvData?.length == 0"
                        >
                            ✏️ Update
                        </AppButton>
                        <AppButton
                            v-if="isEditMode"
                            @click="handleSave"
                            color="success"
                            :loading="isSaving"
                        >
                            ✓ Save Changes
                        </AppButton>
                        <AppButton
                            v-if="!isFromAPI && !isEditMode"
                            @click="handleSave"
                            color="success"
                            :disabled="csvData?.length == 0"
                            :loading="isSaving"
                        >
                            Save
                        </AppButton>
                        <AppButton
                            @click="handleClear"
                            color="grey"
                            :disabled="csvData?.length == 0"
                        >
                            Clear
                        </AppButton>
                    </div>
                </div>
            </template>
        </AppCard>

        <!-- Preview Table Section -->
        <AppCard v-if="displayData.length > 0">
            <template #default>
                <div class="mb-4">
                    <h3 class="mb-4" v-if="!isFromAPI">Preview</h3>

                    <div class="table-responsive">
                        <table class="csv-table">
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Facility Type</th>
                                    <th>Structure Type</th>
                                    <th>Structure Name</th>
                                    <th v-if="isEditMode">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(row, index) in displayData" :key="index">
                                    <td>
                                        <!-- <input v-if="isEditMode" v-model="row.category" class="editable-input" /> -->
                                        <span >{{ row.category }}</span>
                                    </td>
                                    <td>
                                        <!-- <input v-if="isEditMode" v-model="row.facility_type" class="editable-input" /> -->
                                        <span>{{ row.facility_type }}</span>
                                    </td>
                                    <td>
                                        <input v-if="isEditMode" v-model="row.structure_type" class="editable-input" />
                                        <span v-else>{{ row.structure_type }}</span>
                                    </td>
                                    <td>
                                        <input v-if="isEditMode" v-model="row.structure_name" class="editable-input" />
                                        <span v-else>{{ row.structure_name }}</span>
                                    </td>
                                    <td v-if="isEditMode" class="text-center">
                                        <AppButton
                                            size="small"
                                            color="error"
                                            variant="tonal"
                                            @click="handleDeleteRow(index)"
                                        >
                                            DELETE
                                        </AppButton>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </template>
        </AppCard>

        <!-- Empty State -->
        <AppCard v-else class="text-center py-8">
            <div class="text-grey">
                <p>Upload a CSV file to view preview</p>
            </div>
        </AppCard>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import AppCard from '@/components/common/AppCard.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppAutocomplete from '@/components/forms/AppAutocomplete.vue'
import { useFilterStore } from '@/stores/filterStore'
import { useAppStore } from '@/stores/appStore'
import { useSnackbar } from '@/composables/useSnackbar'
import {
    getFacilitySettingsByUnit,
    saveFacilitySettings,
    updateFacilitySettings,
} from '@/services/settingService'
import { buildingRatingData } from '@/utils/list'

const filterStore = useFilterStore()
const appStore = useAppStore()
const { showSuccess, showError } = useSnackbar()

// State
const csvData = ref([])
const displayData = ref([])
const fileName = ref('')
const fileInput = ref(null)
const isFromAPI = ref(false)
const facilitySettingId = ref(null)
const isEditMode = ref(false)
const isSaving = ref(false)

// Trigger file input dialog
const triggerFileInput = () => {
    fileInput.value?.click()
}

// Load data from API
const loadFacilityData = async () => {
    try {
        if (!filterStore.unit) {
            displayData.value = []
            csvData.value = []
            isFromAPI.value = false
            return
        }

        appStore.setLoading(true)
        csvData.value = []
        displayData.value = []

        const response = await getFacilitySettingsByUnit(filterStore.unit)
        console.log(response, 'facility response')

        if (response?.data?.items?.length > 0) {
            const categoryList = response?.data?.items || []
            console.log('Loaded facility data:', categoryList)
            facilitySettingId.value = response?.data?.id

            // Flatten the nested structure: category -> structure_data items
            const flattenedItems = []
            categoryList.forEach(categoryItem => {
                if (categoryItem.structure_data && Array.isArray(categoryItem.structure_data)) {
                    categoryItem.structure_data.forEach(structureItem => {
                        flattenedItems.push({
                            category: categoryItem.category || '',
                            facility_type: structureItem.facility_type || '',
                            structure_type: structureItem.structure_type || '',
                            structure_name: structureItem.structure_name || '',
                       
                        })
                    })
                }
            })

            csvData.value = flattenedItems
            displayData.value = flattenedItems
            isFromAPI.value = true
            fileName.value = ''
        }
    } catch (error) {
        console.error('Error loading facility data:', error)
    } finally {
        appStore.setLoading(false)
    }
}

// Watch for unit filter changes and load data
watch(() => filterStore.unit, async (newUnit) => {
    if (newUnit) {
        await loadFacilityData()
    }
})

// Parse CSV file
const parseCSV = (csvText) => {
    const lines = csvText.trim().split('\n')
    if (lines.length < 2) {
        showError('CSV file is empty or invalid')
        return []
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    console.log(headers,'headers')
    const requiredHeaders = ['category', 'facility_type', 'structure_type', 'structure_name']

    if (!requiredHeaders.every(h => headers.includes(h))) {
        showError(`CSV must contain headers: ${requiredHeaders.join(', ')}`)
        return []
    }

    const data = []
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue

        const values = lines[i].split(',').map(v => v.trim())
        const row = {}

        headers.forEach((header, index) => {
            if (requiredHeaders.includes(header)) {
                row[header] = values[index] || ''
            }
        })

        if (row.category && row.facility_type && row.structure_type && row.structure_name) {
            row.structure_rating = buildingRatingData
            console.log(row)
            data.push(row)
        }
    }

    return data
}

// Handle file input change
const handleFileChange = (event) => {
    const files = event.target.files
    if (files && files.length > 0) {
        const file = files[0]
        handleCsvUpload(file)
    }
}

// Handle CSV file upload
const handleCsvUpload = (file) => {
    if (!file) return

    fileName.value = file.name

    const reader = new FileReader()
    reader.onload = (event) => {
        try {
            const csvText = event.target.result
            const parsedData = parseCSV(csvText)
            if (parsedData.length > 0) {
                csvData.value = parsedData
                displayData.value = parsedData
                isFromAPI.value = false
                showSuccess(`Loaded ${parsedData.length} facilities`)
            }
        } catch (error) {
            console.error('Error parsing CSV:', error)
            showError('Error parsing CSV file')
            csvData.value = []
            displayData.value = []
        }
    }

    reader.onerror = () => {
        showError('Error reading file')
    }

    reader.readAsText(file)
}

// Handle save
const handleSave = async () => {
    if (csvData.value.length === 0) {
        showError('No data to save')
        return
    }

    isSaving.value = true

    // Sync changes from displayData back to csvData
    if (isEditMode.value) {
        displayData.value.forEach((displayRow, index) => {
            csvData.value[index] = {
                category: displayRow.category,
                facility_type: displayRow.facility_type,
                structure_type: displayRow.structure_type,
                structure_name: displayRow.structure_name,
            }
        })
    }

    // Group facilities by category for payload (matching API structure)
    const groupedByCategory = []
    const categoryMap = new Map()

    csvData.value.forEach(item => {
        if (!categoryMap.has(item.category)) {
            categoryMap.set(item.category, {
                category: item.category,
                structure_data: []
            })
        }
        categoryMap.get(item.category).structure_data.push({
            facility_type: item.facility_type,
            structure_type: item.structure_type,
            structure_name: item.structure_name,
            structure_rating : item.structure_rating
        })
    })

    groupedByCategory.push(...categoryMap.values())

    const payload = {
        unit_id: filterStore.unit,
        items: groupedByCategory,
    }

    console.log(payload, 'facility payload')

    try {
        let response

        if (isFromAPI.value && facilitySettingId.value) {
            response = await updateFacilitySettings(facilitySettingId.value, payload)
        } else {
            response = await saveFacilitySettings(payload)
            csvData.value = []
        }

        if (response?.status === 'success') {
            showSuccess('Facility data saved successfully')
            isEditMode.value = false
            await loadFacilityData()
        } else {
            showError('Error saving facility data')
        }
    } catch (error) {
        console.error('Error saving data:', error)
        showError('Error saving data')
    } finally {
        isSaving.value = false
    }
}

// Handle clear
const handleClear = () => {
    csvData.value = []
    displayData.value = []
    fileName.value = ''
    isFromAPI.value = false
    facilitySettingId.value = null
    isEditMode.value = false
    if (fileInput.value) {
        fileInput.value.value = ''
    }
}

// Delete a row
const handleDeleteRow = (index) => {
    csvData.value.splice(index, 1)
    displayData.value.splice(index, 1)
    if (csvData.value.length === 0) {
        isEditMode.value = false
    }
}

// Initial load
onMounted(() => {
    loadFacilityData()
})
</script>

<style scoped>
.csv-table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
}

.csv-table thead {
    background-color: #f5f5f5;
}

.csv-table th,
.csv-table td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: left;
}

.csv-table th {
    font-weight: 600;
    color: #333;
}

.csv-table tbody tr:hover {
    background-color: #f9f9f9;
}

.text-center {
    text-align: center;
}

.file-name-display {
    margin-left: 12px;
    color: #666;
}

.table-responsive {
    overflow-x: auto;
}

.editable-input {
    width: 100%;
    padding: 8px;
    border: 1px solid #1976d2;
    border-radius: 4px;
    font-size: 14px;
}

.editable-input:focus {
    outline: none;
    border-color: #1565c0;
    box-shadow: 0 0 4px rgba(25, 118, 210, 0.5);
}

.gap-3 {
    gap: 1rem;
}

.ga-2 {
    gap: 0.5rem;
}

.ga-8 {
    gap: 2rem;
}

.d-flex {
    display: flex;
}

.align-center {
    align-items: center;
}

.justify-space-between {
    justify-content: space-between;
}

.mb-4 {
    margin-bottom: 1rem;
}

.mb-6 {
    margin-bottom: 1.5rem;
}

.mt-2 {
    margin-top: 0.5rem;
}

.mt-4 {
    margin-top: 1rem;
}

.text-truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.font-weight-bold {
    font-weight: 600;
}

.text-h4 {
    font-size: 2rem;
}

.text-grey {
    color: #999;
}

.py-8 {
    padding-top: 2rem;
    padding-bottom: 2rem;
}
</style>
