<template>
  <div class="facilities-maintenance">
    <AppFilterHeader
      :reportType="'facilities'"
    />

    <v-card class="mt-4">
      <v-card-title>Facilities</v-card-title>
      <v-card-subtitle>Facility readiness assessment and evaluation</v-card-subtitle>
       <div class="d-flex ga-2 justify-end ma-5">
 

          <div class="d-flex ga-2">
            <!-- Update Button (Always visible when data loaded) -->
            <AppButton
                v-if="reportStore?.tableItems?.length > 0 && !isEditMode"
                @click="() => { originalData = JSON.parse(JSON.stringify(reportStore.tableItems)); isEditMode = true }"
                color="primary"
            >
                Update
            </AppButton>

            <!-- Save & Clear Buttons (Only visible when in edit mode) -->
            <template v-if="isEditMode">
                <AppButton
                    @click="handleSave"
                    color="success"
                    :loading="isSaving"
                    
                >
                    Save
                </AppButton>
                <AppButton
                    @click="handleClear"
                    color="grey"
                >
                    Cancel
                </AppButton>
            </template>
          </div>
      </div>
      <AppEmptyState 
        v-if="reportStore.tableItems?.length === 0"
        title="No Data Available"
        message="Please generate first to view this page"
      />
      <v-table class="data-table" v-else>
        <thead>
          <tr class="header-row">
            <th class="text-left">Category</th>
            <th class="text-center">Required Area sqm</th>
            <th class="text-center">Actual Area sqm</th>
            <th class="text-center">Quantitative<br>(Actual Area/Required)</th>
            <th class="text-center">Qualitative</th>
            <th class="text-center">Percentage<br>(Quantitative+Qualitative)/2</th>
            <th class="text-center">View</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in reportStore.tableItems" :key="idx" height="90vh" >
            <td class="text-center">{{item.category}}</td>
            <td class="text-center">
              <input 
                v-model.number="item.required_area_sqm" 
                type="number" 
                class="input-field"
                :disabled="!isEditMode"
                @change="calculateQuantitative(item)"
      
              />
            </td>
            <td class="text-center">
              <input 
                v-model.number="item.actual_area_sqm" 
                type="number" 
                class="input-field"
                :disabled="!isEditMode"
                @change="calculateQuantitative(item)"

              />
            </td>
            <td class="text-center">{{item.quantitative_percentage}}%</td>
            <td class="text-center">{{item.qualitative_percentage}}%</td>
            <td class="text-center">{{item.average_percentage}}%</td>
            <td class="text-center">
              <v-btn
                v-if="!item.title"
                icon
                @click="openDialog(item)"
              >
                <v-icon>mdi-eye</v-icon>
              </v-btn>
            </td>

          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- Facility Details Dialog Component -->
    <FacilityDetailsDialog
      v-model="isDialogOpen"
      :title="dialogTitle"
      :facilities="currentFacilityData"
      :parameters="parameters"
      :is-read-only="!isEditMode"
      @save="handleDialogSave"
      @parameter-change="handleParameterChange"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppEmptyState from '@/components/common/AppEmptyState.vue'
import AppFilterHeader from '@/components/layouts/AppFilterHeader.vue'
import AppButton from '@/components/common/AppButton.vue'
import FacilityDetailsDialog from '@/components/facilities/FacilityDetailsDialog.vue'
import { useReportStore } from '@/stores/reportStore'
import { executeReportAction  } from '@/services/reportService'
import { useSnackbar } from '@/composables/useSnackbar'

const reportStore = useReportStore()
const { showError, showSuccess } = useSnackbar()
// State
const edit = ref(false)
const index = ref(null)
const isDialogOpen = ref(false)
const dialogTitle = ref('')
const currentItem = ref(null) // Track the current item being edited
const isEditMode = ref(false) // Track edit mode
const isSaving = ref(false) // Track saving state
const currentFacilityData = ref(null) // Current facility data for dialog
const originalData = ref(null) // Store original data for cancel functionality



/**
 * Calculate quantitative percentage (Actual Area / Required Area)
 * @param {Object} item - Item to calculate for
 */
const calculateQuantitative = (item) => {
  if(item.actual_area_sqm > item.required_area_sqm) {
    showError('Actual Area cannot be greater than Required Area')
    item.actual_area_sqm = item.required_area_sqm // Reset to required area
  }
  if (item.actual_area_sqm && item.required_area_sqm) {
    item.quantitative_percentage = parseFloat((item.actual_area_sqm / item.required_area_sqm * 100).toFixed(2))
  }
}

/**
 * Open dialog for detailed editing
 * @param {Object} item - Item to edit
 */
const openDialog = (item) => {
  currentItem.value = item // Store the current item for later update
  dialogTitle.value = `Update Details - ${item.category}`
  // Set facility data with the building_physical_inspection_report structure
  currentFacilityData.value = {
    categories: item.building_physical_inspection_report?.categories || [],
    total_percentage: item.total_percentage || 0,
    total_numerical_rating: item.total_numerical_rating || 0
  }
  isDialogOpen.value = true
}

/**
 * Handle parameter change from dialog
 * @param {Object} item - Item with parameter change
 */
const handleParameterChange = (item) => {
  console.log('Parameter changed for:', item)
}

/**
 * Handle dialog save
 * @param {Object} facilities - Updated facilities data
 */
const handleDialogSave = async (facilities) => {
  try {
    // Update the current item's qualitative_percentage with the total_percentage from the dialog
    if (currentItem.value) {
      currentItem.value.qualitative_percentage = facilities.total_percentage
      currentItem.value.total_percentage = facilities.total_percentage
      currentItem.value.total_numerical_rating = facilities.total_numerical_rating
      
      // Also update the building_physical_inspection_report categories
      if (facilities.categories) {
        currentItem.value.building_physical_inspection_report = {
          categories: facilities.categories
        }
      }
      
      // Calculate average percentage: (quantitative + qualitative) / 2
      if (currentItem.value.quantitative_percentage !== undefined && currentItem.value.qualitative_percentage !== undefined) {
        currentItem.value.average_percentage = parseFloat(
          ((currentItem.value.quantitative_percentage + currentItem.value.qualitative_percentage) / 2).toFixed(2)
        )
      }
    }
    
    // Update in reportStore
    if (reportStore.tableItems) {
      const itemIndex = reportStore.tableItems.findIndex(
        item => item.category === currentItem.value?.category
      )
      if (itemIndex !== -1) {
        reportStore.tableItems[itemIndex] = { ...currentItem.value }
      }
    }
    
    console.log('Updating facility details:', facilities)
    console.log('Updated item:', currentItem.value)
    console.log('Updated store:', reportStore.tableItems)
  } catch (error) {
    console.error('Error updating facility details:', error)
  }
}

/**
 * Handle save button click - saves all changes to API
 */
const handleSave = async () => {
  try {
    isSaving.value = true
    
    // Prepare payload with all current items
    const payload = {
      items: reportStore?.tableItems
    }
    
    // Execute API call
    const response = await executeReportAction(payload, 'facilities', 'update', reportStore.reportId)
    
    if (response?.status === 'success') {
      showSuccess('Facilities saved successfully')
      isEditMode.value = false
      // Regenerate the report
      await reportStore.reportGenerate('facilities', reportStore.reportId)
    } else {
      showError(response?.message || 'Failed to save facilities settings')
    }
  } catch (error) {
    console.error('Error saving facilities:', error)
    showError('An error occurred while saving facilities')
  } finally {
    isSaving.value = false
  }
}

/**
 * Handle cancel button click - discards changes and exits edit mode
 */
const handleClear = () => {
  // Restore original data if it was saved
  if (originalData.value) {
    reportStore.tableItems = JSON.parse(JSON.stringify(originalData.value))
  }
  isEditMode.value = false
}
</script>

<style scoped>
.facilities-maintenance {
  padding: 1rem;
}

.custom-table {
  border-collapse: collapse;
}

.custom-table th {
  background-color: #f5f5f5;
  font-weight: 600;
  border-bottom: 2px solid #e0e0e0;
  padding: 12px 8px;
}

.custom-table td {
  border-bottom: 1px solid #e0e0e0;
  padding: 12px 8px;
}

/* Title Row Styling */
.item-title-row {
  background-color: #e3f2fd;
}

.item-title {
  font-weight: 600;
  background-color: #2196F3;
  color: white;
  padding: 12px 16px !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Detail Row Styling */
.item-detail-row {
  background-color: #fafafa;
}

.item-detail-row:hover {
  background-color: #f5f5f5;
}

.item-detail {
  font-weight: 500;
  padding: 12px 16px !important;
}

/* Editable Cell */
.editable-cell {
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.editable-cell:hover {
  background-color: #fff3e0;
  border-radius: 4px;
}

.editable-cell.editable {
  background-color: #fff9c4;
  border: 1px solid #fbc02d;
}

/* Text alignment */
.text-left {
  text-align: left;
}

.text-center {
  text-align: center;
}

/* Responsive */
@media (max-width: 960px) {
  .custom-table th,
  .custom-table td {
    padding: 8px 4px;
    font-size: 0.85rem;
  }

  .item-title {
    padding: 8px 12px !important;
  }

  .item-detail {
    padding: 8px 12px !important;
  }
}

@media (max-width: 600px) {
  .custom-table {
    font-size: 0.75rem;
  }

  .custom-table th,
  .custom-table td {
    padding: 6px 2px;
  }
}

/* Color utility classes */
.bg-info {
  background-color: #2196F3;
  color: white;
}

.bg-warning {
  background-color: #FF9800;
  color: white;
}

.bg-success {
  background-color: #4CAF50;
  color: white;
}

.bg-error {
  background-color: #F44336;
  color: white;
}

/* Input field styling */
.input-field {
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 0.95rem;
  width: 100%;
  max-width: 150px;
  transition: all 0.2s ease;
  text-align: center;
}

.input-field:focus {
  outline: none;
  border-color: #2196F3;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

.input-field:disabled {
  background-color: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}
</style>
