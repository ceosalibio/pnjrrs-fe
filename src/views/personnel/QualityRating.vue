<template>
  <div class="personnel-list">
    <AppFilterHeader 
      @generate="handleGenerate()"
      :reportType="'personnel'"
    />

    <v-card class="mb-6">
      <div class="d-flex justify-space-between align-center pa-4">
        <div>
          <v-card-title>Personnel List</v-card-title>
          <v-card-subtitle>Manage and view all personnel records</v-card-subtitle>
        </div>
        <div class="d-flex ga-2">
          <AppButton
            v-if="!reportStore.reportData?.status && reportStore.tableItems?.length > 0 && !authtStore.hideUpdateBtn"
            :color="isEditMode ? 'success' : 'primary'"
            :loading="isSaving"
            @click="toggleEditMode"
            
          >
            {{ isEditMode ? 'Save' : 'Update' }}
          </AppButton>
          <AppButton
            v-if="isEditMode"
            :color="'grey'"
            :disabled="isSaving"
            @click="isEditMode = false"
            >
            Cancel
          </AppButton>
        </div>
        
      </div>
      <v-divider />
      
      <v-card-text>
        <AppEmptyState 
          v-if="reportStore.tableItems?.length === 0"
          title="No Data Available"
          message="Please generate first to view this page"
        />
        <v-table class="data-table" v-else>
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
            <tr v-for="(item, i) in visibleItems" :key="pageOffset + i">
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
                        @update:model-value="markUnsavedChanges"
                      />

                      <AppTextField
                        v-model="item.serial"
                        label="Serial"
                        class="input-field-serial"
                        :hideDetails="true"
                        @update:model-value="markUnsavedChanges"
                      />
                      <AppAutocomplete
                        v-model="item.type"
                        :items="typeList"
                        :text="'text'"
                        :value="'value'"
                        label="Type"
                        density="compact"
                        @update:model-value="markUnsavedChanges"
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
        <!-- Paginate only in edit mode; rendering inputs for every row freezes the page -->
        <AppPagination
          v-if="isEditMode && reportStore.tableItems?.length > 0"
          v-model:current-page="currentPage"
          :last-page="lastPage"
          :total-items="reportStore.tableItems.length"
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import AppEmptyState from '@/components/common/AppEmptyState.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import { ref, shallowRef, onBeforeUnmount, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppFilterHeader from '@/components/layouts/AppFilterHeader.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppAutocomplete from '@/components/forms/AppAutocomplete.vue'
import { useReportStore } from '@/stores/reportStore'
import { useAuthStore } from '@/stores/authStore'
import { useAppStore } from '@/stores/appStore'
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

const reportStore = useReportStore()
const authtStore = useAuthStore()
const appStore = useAppStore()
const router = useRouter()
const { showSuccess, showError } = useSnackbar()

const rankItems = shallowRef([])
const afposItems = shallowRef([])
const isEditMode = ref(false)
const hasUnsavedChanges = ref(false)
const isSaving = ref(false)

const PAGE_SIZE = 25
const currentPage = ref(1)
const lastPage = computed(() =>
  Math.ceil((reportStore.tableItems?.length || 0) / PAGE_SIZE) || 1
)
const pageOffset = computed(() => isEditMode.value ? (currentPage.value - 1) * PAGE_SIZE : 0)
const visibleItems = computed(() => {
  const items = reportStore.tableItems || []
  return isEditMode.value ? items.slice(pageOffset.value, pageOffset.value + PAGE_SIZE) : items
})

watch(currentPage, () => window.scrollTo({ top: 0, behavior: 'smooth' }))

// Table gets cleared when a filter (e.g. date) changes; drop out of edit mode with it
watch(
  () => reportStore.tableItems?.length,
  (length) => {
    if (!length && !isSaving.value) {
      isEditMode.value = false
      hasUnsavedChanges.value = false
      currentPage.value = 1
    }
  }
)



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
  currentPage.value = 1
  // reportStore.tableItems = []
  // const payload = filterStore.getGenrateReportPayload()
  // const response = await executeReportAction (payload, 'personnel')
  // // console.log(response)
  // reportStore.personnelReportData = response?.data?.report
  // reportStore.tableItems = response?.data?.report?.items || []
  // reportStore.reportId = response?.data?.report?.id
  // reportStore.approver = response?.data?.approver || []
}

const toggleEditMode = async () => {
  if (isEditMode.value) {
    // Save mode - persist changes
    await handleSave()
  } else {
    // Enter edit mode - fetch dropdown lists once, in parallel
    if (!rankItems.value?.length || !afposItems.value?.length) {
      const [rankResponse, afpos] = await Promise.all([getRank(), getAfposItems()])
      rankItems.value = rankResponse?.data || []
      afposItems.value = afpos || []
    }

    currentPage.value = 1
    hasUnsavedChanges.value = false
    isEditMode.value = true
  }
}

const onRankChange = (item, selectedName) => {
  markUnsavedChanges()
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
  // console.log(item,'itemmm',selectedId,'selectedId')
  markUnsavedChanges()
  const found = afposItems.value.find((r) => r.id === selectedId)
  // console.log(found,'found')
  item.afpos_actual_name = found?.name || ''
  
  // Initialize afpos_points to 0
  item.afpos_points = null
 
  // Check if grade starts with 'E' (Enlisted)
  if (item.grade && item.grade.startsWith('E')) {
    // For Enlisted: compare cluster group
    if (item.item_afpos_group == found?.cluster?.group) {
      item.afpos_points = 1
    }
  } else {
    let afposName = item.afpos?.toLowerCase() || ''
    // For Officer and Civilian: compare afpos ID
    // console.log(item)
    if (afposName == 'open rating' || 
        item.item_afpos_id == found?.id && selectedId) {
          // console.log('testtt')
      item.afpos_points = 1
    }
    if(afposName.includes('civ') && item.afpos_actual_name?.toLowerCase().includes('civ')){
      item.afpos_points = 1
    }


  }

   if(!selectedId){
    item.afpos_points = null
  }
}



const handleSave = async () => {
  if (isSaving.value) return
  isSaving.value = true
  appStore.setLoading(true)
  // Let the overlay paint before the synchronous work over all rows below
  await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve)))

  try {
    // Check for duplicate serials
    const serialMap = new Map()
    const duplicateSerials = []

    reportStore.tableItems.forEach((item) => {
      const serial = item.serial?.trim()
      if (serial) {
        // console.log('Serial found:', serial)
        if (serialMap.has(serial)) {
          if (!duplicateSerials.includes(serial)) {
            duplicateSerials.push(serial)
          }
        } else {
          serialMap.set(serial, true)
        }
      }
    })

    // console.log('Duplicate serials:', duplicateSerials)

    // If duplicates found, show error and don't save
    if (duplicateSerials.length > 0) {
      const message = `Serial number(s) already exist:\n${duplicateSerials.join('\n')}\n\nThe report will not save. Please correct these duplicates.`
      showError(message)
      return
    }

    // Initialize rank/name/type here instead of on entering edit mode, so
    // clicking Update doesn't mutate every row up front
    reportStore.tableItems.forEach((item) => {
      if (!item.rank) item.rank = null
      if (!item.type) item.type = null
      item.name = formatPersonnelName(item.name || '', item.division)
    })

    // Calculate summary statistics
    const { gradePoints, afposPoints, actualCount } = calculatePayloadSummary(
      reportStore.tableItems
    )

    // Get required count from report data
    const requiredCount = reportStore.reportData?.required || 0
    const payload = {
      items: reportStore.tableItems,
      grade_points: gradePoints,
      afpos_points: afposPoints,
      actual: actualCount,
      required: requiredCount
    }
    // console.log(payload, 'payload')
    
    
    
    const response = await executeReportAction(payload, 'personnel', 'update', reportStore.reportId)
    // The axios interceptor hides the overlay once a request finishes; keep it up until reload is done
    appStore.setLoading(true)
    // console.log(response, 'response')
    
    // Check if response contains an error
    if (response?.status !== 'success') {
      showError(response?.message || 'Error saving data')
      return
    }
    // Exit edit mode immediately to stop watcher from marking changes as unsaved
    isEditMode.value = false
    hasUnsavedChanges.value = false
     await reportStore.reportGenerate('personnel')
    showSuccess('Personnel data saved successfully!')
  } catch (error) {
    showError('Error saving data: ' + error.message)
    // Re-enter edit mode if save failed
    isEditMode.value = true
  } finally {
    isSaving.value = false
    appStore.setLoading(false)
  }
}

// Called from the edit inputs instead of a deep watcher on tableItems,
// which re-traversed every row on each keystroke
function markUnsavedChanges() {
  if (isEditMode.value) {
    hasUnsavedChanges.value = true
  }
}

// Guard against unsaved changes on route leave
router.beforeEach((to, from, next) => {
  if (hasUnsavedChanges.value && from.path.startsWith('/personnel')) {
    const confirmed = confirm('You have unsaved changes. Do you want to save before leaving?')
    if (confirmed) {
      handleSave().then(() => next())
    } else {
      handleGenerate()
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
    }else{
      handleGenerate()
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
