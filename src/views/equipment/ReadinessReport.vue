<template>
  <AppEmptyState 
      v-if="reportStore.tableItems?.length === 0"
      title="No Data Available"
      message="Please generate first to view this page"
    />
  <div class="equipment-readiness" v-else>
    <div class="d-flex">
      <ReadinessTable
        title="Equipment Readiness Report"
        :data="equipmentReadiness"
        :category-id="reportStore.reportData?.category_id"
        actual-column-label="Actual Nr of Equipment"
      />
      <ReadinessTable
        title="Maintenance Readiness Report"
        :data="maintenanceReadiness"
        :category-id="reportStore.reportData?.category_id"
        actual-column-label="Operational Readiness"
      />
    </div>
    <v-card>
      <v-card-text>
         <!-- Assessment Section -->
          <div class="ma-5">
            <AssessmentForm 
              v-model:assessments="assessments"
              @save="save"
              @clear="reset"
            />
          </div>
          
      </v-card-text>
    </v-card>

    <!-- Save Confirmation Dialog -->
    <AppDialog
      v-model="showConfirmDialog"
      title="Confirm Save"
      message="Are you sure you want to save this assessment? This action cannot be undone."
      confirm-text="Save"
      cancel-text="Cancel"
      confirm-color="success"
      @confirm="handleConfirmSave"
      @cancel="handleCancelSave"
    />
  </div>
</template>

<script setup>
import AppEmptyState from '@/components/common/AppEmptyState.vue'
import { computed, ref } from 'vue'
import { useReportStore } from '@/stores/reportStore'
import AssessmentForm from '@/components/common/AssessmentForm.vue'
import AppDialog from '@/components/common/AppDialog.vue'
import ReadinessTable from './ReadinessTable.vue'
import { executeReportAction  } from '@/services/reportService'

const reportStore = useReportStore()

const equipmentReadiness = computed(() => reportStore?.reportData?.result?.equipment || {})
const maintenanceReadiness = computed(() => reportStore?.reportData?.result?.maintenance || {})
// Dialog state
const showConfirmDialog = ref(false)
const pendingAssessmentData = ref(null)
// Assessment object
const assessmentsTemp = ref({
  a: '',
  b: '',
  c: '',
  d: ''
})

const save = (assessmentData) => {
  // Store the assessment data and show confirmation dialog
  pendingAssessmentData.value = assessmentData || assessments.value
  showConfirmDialog.value = true
}

/**
 * Handle confirmation from dialog
 */
const handleConfirmSave = async () => {
  let payload ={
    assessment: pendingAssessmentData.value
  }
  const response = await executeReportAction (payload, 'equipment','update', reportStore.reportId)
  console.log(response)
  reportStore.reportData = response?.data
  showConfirmDialog.value = false
  // alert('Report saved successfully!')
}

/**
 * Handle cancel from dialog
 */
const handleCancelSave = () => {
  showConfirmDialog.value = false
  pendingAssessmentData.value = null
}
</script>

<style scoped>
.equipment-readiness { 
  padding: 1rem;
  width: 100%;
  overflow-x: auto;
}

.d-flex {
  display: flex;
  gap: 1rem;
  width: 100%;
  overflow-x: auto;
}

.d-flex > div {
  flex: 1;
  min-width: 0;
  min-height: 0;
}

.d-flex > div v-card {
  width: 100%;
  height: 100%;
}

.custom-table { 
  border-collapse: collapse;
  width: 100%;
  font-size: 0.9rem;
}

.custom-table td { 
  border-bottom: 1px solid #e0e0e0;
  padding: 8px 6px;
  vertical-align: middle;
  word-break: break-word;
}

.detail-title { 
  font-weight: 700;

}

.readiness { 
  background: #E3F2FD;
  font-weight: 600;
  text-align: center;
}

.text-center { 
  text-align: center;
}

.text-end {
  text-align: right;
}

.bg-primary { 
  background-color: #1976D2;
}

.text-white { 
  color: white;
}

/* Header styling similar to other readiness reports */
.equipment-readiness :deep(thead th) {
  background-color: #1565C0 !important;
  color: white !important;
  font-weight: 700 !important;
  border-bottom: 3px solid #0D47A1 !important;
  padding: 10px 6px !important;
  text-transform: uppercase !important;
  font-size: 0.85rem !important;
  white-space: normal !important;
}

/* Make v-card compact */
.equipment-readiness :deep(.v-card) {
  display: flex;
  flex-direction: column;
}

.equipment-readiness :deep(.v-card-text) {
  flex: 1;
  overflow: hidden;
  padding: 0 !important;
}

.equipment-readiness :deep(.v-table__wrapper) {
  height: 100%;
  overflow-y: auto;
}

@media (max-width: 1600px) {
  .custom-table { font-size: 0.85rem; }
  .custom-table td { padding: 6px 4px; }
  .equipment-readiness :deep(thead th) { padding: 8px 4px !important; font-size: 0.8rem !important; }
}

@media (max-width: 1200px) {
  .d-flex {
    flex-direction: column;
  }
  
  .d-flex > div {
    width: 100%;
  }
  
  .custom-table { font-size: 0.75rem; }
  .custom-table td { padding: 4px 2px; }
  .equipment-readiness :deep(thead th) { padding: 6px 2px !important; font-size: 0.7rem !important; }
}
</style>