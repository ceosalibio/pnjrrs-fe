<template>
  <div class="personnel-list">
    <AppFilterHeader 
      @generate="handleGenerate()"
    />

    <v-card class="mb-6">
      <div class="d-flex justify-space-between align-center pa-4">
        <div>
          <v-card-title>Personnel List</v-card-title>
          <v-card-subtitle>Manage and view all personnel records</v-card-subtitle>
        </div>
        <AppButton
          v-if="reportStore.personnelItems?.length > 0"
          :color="isEditMode ? 'success' : 'primary'"
          @click="toggleEditMode"
        >
          {{ isEditMode ? 'Save' : 'Update' }}
        </AppButton>
      </div>
      <v-divider />
      
      <v-card-text>
        <v-table class="data-table">
          <thead>
            <tr class="header-row">
              <th>DESCRIPTION/POSITION</th>
              <th>NAME</th>
              <th>RANK REQUIRED</th>
              <th>ACTUAL</th>
              <th>POINTS</th>
              <th>AFPOS</th>
              <th>ACTUAL</th>
              <th>POINTS</th>
              <th>REQUIRED</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in reportStore.personnelItems" :key="i">
              <td v-if="!item?.office">{{ item.description }}</td>
              <td v-if="!item?.office" :class="{ 'editable-cell': isEditMode && item.grade }">
                  <div v-if="isEditMode && item.grade">
                    <div class="cell-content ga-2">
                      <AppAutocomplete
                        v-model="item.rank"
                        :items="rankItems"
                        :text="'name'"
                        :value="'name'"
                        label="Rank"
                        class="rank-field"
                        @update:model-value="(val) => onRankChange(item, val)"
                      />
                      <AppTextField
                        v-model="item.name"
                        label="Name"
                        class="input-field"
                        :hideDetails="true"
                      />

                      <AppTextField
                        v-model="item.serial"
                        label="Serial"
                        class="input-field-serial"
                        :hideDetails="true"
                      />
                      <AppAutocomplete
                        v-model="item.type"
                        :items="typeList"
                        :text="'text'"
                        :value="'value'"
                        label="Type"
                        density="compact"
                      />
                    </div>
                    
                  </div>
                  <div v-else>
                    <span >{{item?.rank}}  {{ item.name }}  {{item?.type}}</span>
                  </div>

                 
                  
              </td>
              <td v-if="!item?.office" class="text-center">{{ item.grade }}</td>
              <td v-if="!item?.office" class="text-center">{{ item.grade_actual }}</td>
              <td v-if="!item?.office">{{ item.grade_points }}</td>
              <td v-if="!item?.office" class="text-center">{{ item.afpos }}</td>
               <td v-if="!item?.office" :class="{ 'editable-cell': isEditMode && item.grade }">
                <AppAutocomplete
                  v-if="isEditMode && item.grade"
                  v-model="item.afpos_actual_id"
                  :items="afposItems"
                  :text="'name'"
                  :value="'id'"
                  label="AFPOS"
                  class="rank-field"
                  @update:model-value="(val) => onAfposChange(item, val)"
                />
                <span v-else>{{ item.afpos_actual_name }}</span>
              </td>
              <td v-if="!item?.office">{{ item.afpos_points }}</td>
              <td v-if="!item?.office" class="text-center">{{ item.required }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppFilterHeader from '@/components/layouts/AppFilterHeader.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppAutocomplete from '@/components/forms/AppAutocomplete.vue'
import { useFilterStore } from '@/stores/filterStore'
import { useReportStore } from '@/stores/reportStore'
import { useSnackbar } from '@/composables/useSnackbar'
import { executeReportAction  } from '@/services/reportService'
import { getRank } from '@/services/userService'
import { getAfposItems } from  '@/services/afposService'
import AppTextField from '@/components/forms/AppTextField.vue'
import {
  calculateGradePoints,
  formatPersonnelName,
  calculatePayloadSummary
} from '@/utils/personnelCalculations'

const filterStore = useFilterStore()
const reportStore = useReportStore()
const router = useRouter()
const { showSuccess, showError } = useSnackbar()

const rankItems = ref([])
const afposItems = ref([])
const isEditMode = ref(false)
const hasUnsavedChanges = ref(false)




const typeList = ref([
  // { text: 'PN', value: 'PN' },
  // { text: 'PMC', value: 'PMC' },
  { text: 'PN', value: 'PN' },
  { text: 'PN(M)', value: 'PN(M)' },
  { text: 'PN(GSC)', value: 'PN(GSC)' },
  { text: 'PN(M)(GSC)', value: 'PN(M)(GSC)' },
  { text: 'PN(MNSA)', value: 'PN(MNSA)' },
  { text: 'PN(JSC)', value: 'PN(JSC)' },
  { text: 'PN(M)(MNSA)', value: 'PN(M)(MNSA)' },
  { text: 'PN(M)(JSC)', value: 'PN(M)(JSC)' }
])


const handleGenerate = async () => {
  isEditMode.value = false
  reportStore.personnelItems = []
  const payload = filterStore.getGenrateReportPayload()
  const response = await executeReportAction (payload, 'personnel')
  console.log(response)
  reportStore.personnelReportData = response?.data
  reportStore.personnelItems = response?.data?.items || []
  reportStore.reportId = response?.data?.id
}

const toggleEditMode = async () => {
  if (isEditMode.value) {
    // Save mode - persist changes
    await handleSave()
  } else {
    // Enter edit mode
    isEditMode.value = true
    hasUnsavedChanges.value = false
    const response = await getRank()
    rankItems.value = response?.data
    const afpos = await getAfposItems()
    afposItems.value = afpos
    
    // Initialize rank, name, type properties on each item
    reportStore.personnelItems.forEach((item) => {
      if (!item.rank) item.rank = null
      if (!item.name) item.name = ''
      if (!item.type) item.type = null
    })
  }
}

const onRankChange = (item, selectedName) => {
  const found = rankItems.value.find((r) => r.name === selectedName)
  item.grade_name = found?.grade?.name || ''
  item.division = found?.division_id
  item.grade_actual = found?.grade?.name

  // Format name based on division using helper function
  item.name = formatPersonnelName(item.name, item.division)
  
  // Calculate grade_points based on grade comparison
  item.grade_points = calculateGradePoints(item.grade, item.grade_actual)
}

const onAfposChange = (item, selectedId) => {
  const found = afposItems.value.find((r) => r.id === selectedId)
  item.afpos_actual_name = found?.name || ''
  if(item.item_afpos_id == found?.id){
    item.afpos_points = 1;
  }
}



const handleSave = async () => {
  try {
    // Check for duplicate serials
    const serialMap = new Map()
    const duplicateSerials = []

    reportStore.personnelItems.forEach((item) => {
      const serial = item.serial?.trim()
      if (serial) {
        console.log('Serial found:', serial)
        if (serialMap.has(serial)) {
          if (!duplicateSerials.includes(serial)) {
            duplicateSerials.push(serial)
          }
        } else {
          serialMap.set(serial, true)
        }
      }
    })

    console.log('Duplicate serials:', duplicateSerials)

    // If duplicates found, show error and don't save
    if (duplicateSerials.length > 0) {
      const message = `Serial number(s) already exist:\n${duplicateSerials.join('\n')}\n\nThe report will not save. Please correct these duplicates.`
      showError(message)
      return
    }

    // Format all names based on division before saving
    reportStore.personnelItems.forEach((item) => {
      item.name = formatPersonnelName(item.name, item.division)
    })

    // Calculate summary statistics
    const { gradePoints, afposPoints, actualCount } = calculatePayloadSummary(
      reportStore.personnelItems
    )

    // Get required count from report data
    const requiredCount = reportStore.personnelReportData?.required || 0
    const payload = {
      items: reportStore.personnelItems,
      grade_points: gradePoints,
      afpos_points: afposPoints,
      actual: actualCount,
      required: requiredCount
    }
    console.log(payload, 'payload')
    
    // Exit edit mode immediately to stop watcher from marking changes as unsaved
    isEditMode.value = false
    hasUnsavedChanges.value = false
    
    const response = await executeReportAction(payload, 'personnel', 'update', reportStore.reportId)
    console.log(response, 'response')
    
    // Check if response contains an error
    if (response?.status !== 'success') {
      showError(response?.message || 'Error saving data')
      return
    }
    
    showSuccess('Personnel data saved successfully!')
  } catch (error) {
    showError('Error saving data: ' + error.message)
    // Re-enter edit mode if save failed
    isEditMode.value = true
  }
}

// Watch for unsaved changes
const markUnsavedChanges = () => {
  if (isEditMode.value) {
    hasUnsavedChanges.value = true
  }
}

// Watch reportStore.personnelItems for changes in edit mode
watch(
  () => reportStore.personnelItems,
  () => markUnsavedChanges(),
  { deep: true }
)

// Guard against unsaved changes on route leave
router.beforeEach((to, from, next) => {
  if (hasUnsavedChanges.value && from.path.startsWith('/personnel')) {
    const confirmed = confirm('You have unsaved changes. Do you want to save before leaving?')
    if (confirmed) {
      handleSave().then(() => next())
    } else {
      hasUnsavedChanges.value = false
      next()
    }
  } else {
    next()
  }
})

onBeforeUnmount(() => {
  if (hasUnsavedChanges.value) {
    const confirmed = confirm('You have unsaved changes. Do you want to save before leaving?')
    if (confirmed) {
      handleSave()
    }
  }
})
</script>

<style scoped>
.personnel-list {
  padding: 1rem;
}

.text-center {
  text-align: center;
  vertical-align: middle;
}

.editable-cell {
  background-color: #fff9c4;
  padding: 8px;
  border-radius: 4px;
  vertical-align: middle;
}

.d-flex {
  display: flex;
}

.justify-space-between {
  justify-content: space-between;
}

.align-center {
  align-items: center;
}

.pa-4 {
  padding: 1rem;
}

:deep(.data-table) {
  width: 100%;
}

:deep(.data-table thead) {
  background-color: #f5f5f5;
}

:deep(.data-table th) {
  font-weight: 600;
  padding: 12px;
  text-align: center;
}

:deep(.data-table td) {
  padding: 12px;
  border-bottom: 1px solid #e0e0e0;
}

.cell-content {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 8px;
}

.cell-content :deep(.v-autocomplete) {
  flex: 1;
  min-width: 100px;
}

.input-field {
  width: 400px !important;
}

.input-field-serial {
  width: 250px !important;
}
.rank-field {
  width: 150px !important;
}
</style>
