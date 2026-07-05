<template>
  <div class="mett-list">
    <AppFilterHeader 
      :reportType="'training'"
    />
    <v-card class="mb-6">
      <div class="d-flex justify-space-between align-center pa-4">
          <div>
              <v-card-title>Mission Essential Task Training (METT)</v-card-title>
              <v-card-subtitle>View and manage quarterly training schedules</v-card-subtitle>
          </div>
          <div class="d-flex ga-2">
             <AppButton
                v-if="reportStore.tableItems?.length > 0 && !reportStore?.reportData?.status"
                :color="isEditMode ? 'success' : 'primary'"
                @click="toggleEditMode"
              >
              {{ isEditMode ? 'Save' : 'Update' }}
            </AppButton>

            <AppButton
                v-if="isEditMode"
                :color="'grey'"
                @click="isEditMode = false"
              >
              Cancel
            </AppButton>
          </div>
         
      </div>
      <v-divider />

      <v-card-text>
        <table class="mett-table">
          <thead>
            <tr class="header-row">
              <th>METL</th>
              <th>MET</th>
              <th>Required</th>
              <th>Actual</th>
              <th>Quarter</th>
              <th>Date Performed</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(training,i) in reportStore?.tableItems" :key="i">
              <td v-if="shouldShowMetl(i)" class="text-center" :rowspan="getMetlRowspan(i)">{{ training.metl }}</td>
              <td class="text-center">{{ training.met }}</td>
              <td class="text-center">{{ training.required }}</td>
              <td class="text-center">
                <div v-if="isEditMode && !training?.status" class="cell-edit actual-edit">
                  <AppTextField
                    v-model="editValues[i].actual"
                    type="number"
                    density="compact"
                    hide-details
                  />
                </div>
                <span v-else>{{ training.actual }}</span>
              </td>
              <td class="text-center">{{ training.quarter }}</td>
              <td class="text-center">
                <div v-if="isEditMode && !training?.status" class="cell-edit date-edit">
                  <AppDatePicker
                    v-model="editValues[i].datePerformed"
                    density="compact"
                    :hide-details="true"
                  />
                </div>
                <span v-else>{{ training.datePerformed }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppButton from '@/components/common/AppButton.vue'
import AppFilterHeader from '@/components/layouts/AppFilterHeader.vue'
import AppTextField from '@/components/forms/AppTextField.vue'
import AppDatePicker from '@/components/forms/AppDatePicker.vue'
import { useReportStore } from '@/stores/reportStore'
import { useSnackbar } from '@/composables/useSnackbar'
import { executeReportAction  } from '@/services/reportService'


const reportStore = useReportStore()
const { showError } = useSnackbar()
const isEditMode = ref(false)

// Store edit values for each row
const editValues = ref({})

// Initialize edit values from tableItems
const initializeEditValues = () => {
  const items = reportStore?.tableItems || []
  items.forEach((item, index) => {
    editValues.value[index] = {
      actual: item.actual,
      datePerformed: item.datePerformed
    }
  })
}

// Toggle edit mode
const toggleEditMode = () => {
  if (!isEditMode.value) {
    initializeEditValues()
    isEditMode.value = true
  } else {
    // Validate before saving
    if (validateChanges()) {
      saveChanges()
      isEditMode.value = false
    }
  }
}

// Validate that if actual has a value, datePerformed must also have a value
const validateChanges = () => {
  const items = reportStore?.tableItems || []
  const errors = []
  
  items.forEach((item, index) => {
    if (editValues.value[index]) {
      const actual = editValues.value[index].actual
      const datePerformed = editValues.value[index].datePerformed
      
      // If actual has a value but datePerformed is empty
      if (actual && !datePerformed) {
        errors.push(`Row ${index + 1} (${item.met}): Actual is filled but Date Performed is empty`)
      }
    }
  })
  
  if (errors.length > 0) {
    showError(errors.join('; '))
    return false
  }
  
  return true
}

// Save changes back to store
const saveChanges = async () => {
  const items = reportStore?.tableItems || []
  items.forEach((item, index) => {
    if (editValues.value[index]) {
      item.actual = editValues.value[index].actual
      item.datePerformed = editValues.value[index].datePerformed
    }
  })
  let payload = {
    items: items
  }
  const response = await executeReportAction(payload, 'training', 'update', reportStore.reportId)
  console.log(items, 'Updated tableItems after saving changes')
}

// Calculate rowspan for METL cells based on metl_id grouping
const metlRowspans = computed(() => {
  const rowspans = {}
  const tableItems = reportStore?.tableItems || []
  
  let i = 0
  while (i < tableItems.length) {
    const currentMetlId = tableItems[i].metl_id
    let count = 1
    
    // Count consecutive rows with same metl_id
    while (i + count < tableItems.length && tableItems[i + count].metl_id === currentMetlId) {
      count++
    }
    
    // Mark the first row of this group with the rowspan
    rowspans[i] = count
    
    i += count
  }
  
  return rowspans
})

// Check if this row should display the METL cell
const shouldShowMetl = (index) => {
  return metlRowspans.value[index] !== undefined
}

// Get the rowspan value for a METL cell
const getMetlRowspan = (index) => {
  return metlRowspans.value[index] || 1
}
</script>

<style scoped>
.mett-list {
  padding: 1rem;
}

.mett-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Roboto', sans-serif;
}

.mett-table thead tr.header-row {
  background-color: #0066CC;
  color: white;
  font-weight: 600;
}

.mett-table thead th {
  padding: 12px 8px;
  text-align: center;
  font-size: 12px;
  text-transform: uppercase;
  border: 1px solid #0066CC;
  line-height: 1.2;
}

.mett-table th.mission-col {
  text-align: left;
  min-width: 150px;
}

.mett-table tbody td {
  padding: 10px 8px;
  border: 1px solid #e0e0e0;
  text-align: center;
}

.mett-table tbody td.mission-col {
  text-align: left;
  font-weight: 500;
  min-width: 150px;
}

.mett-table tbody td.training-cell.highlighted {
  background-color: #FFB81C;
  font-weight: 600;
  color: #333;
}

.mett-table tbody td.training-cell {
  background-color: #f9f9f9;
}

.mett-table tbody tr:hover {
  background-color: #f5f5f5;
}

.mett-table tfoot tr.summary-row {
  background-color: #f5f5f5;
  font-weight: 600;
  border-top: 2px solid #0066CC;
}

.mett-table tfoot td {
  padding: 12px 8px;
  border: 1px solid #e0e0e0;
  text-align: center;
}

.text-center {
  text-align: center;
}

.cell-edit {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.actual-edit {
  max-width: 120px;
  margin: 0 auto;
}

.date-edit {
  justify-content: center;
  max-width: 150px;
  margin: 0 auto;
}
</style>
