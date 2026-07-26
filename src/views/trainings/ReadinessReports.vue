<template>
  <div class="training-reports">
    <v-card class="mb-6">
      <div>
        <div class="d-flex justify-space-between align-center pa-4">
          <div>
            <v-card-title>Training Readiness Report</v-card-title>
            <v-card-subtitle>Overall training readiness assessment and rating</v-card-subtitle>
          </div>
          <AppButton
            v-if="reportStore.reportData?.status"
            @click="printReport"
          >
            print
            <v-icon>
              mdi-printer-outline
            </v-icon>
          </AppButton>
        </div>
      </div>
      <v-divider />

      <v-card-text>
        <!-- Rating Summary Table -->
        <v-table class="rating-summary-table mb-8">
    
          <tbody>
            <tr height="90vh">
              <td rowspan="2">Training Readiness = </td>
              <td class="text-center">
                <div>
                    Nr of METT Conducted
                </div>
                <div>
                  {{reportStore?.reportData?.result?.actual}}
                </div>
              </td>
              <td rowspan="2" class="text-center">x 100</td>
            </tr>
            <tr height="90vh">
              <td class="text-center">
                <div>
                    Nr of METT Programmed (Until Current Quarter)
                </div>
                <div>
                  {{reportStore?.reportData?.result?.required}}
                </div>
              </td>
            </tr>
            <tr height="90vh" class="total-row">
              <td >Training Readiness Rating </td>
              <td colspan="2" class="text-center font-weight-bold">{{reportStore?.reportData?.result?.readiness || 0}} %</td>
            </tr>
             <tr height="90vh" class="total-row">
              <td >REDCON </td>
              <td colspan="2" class="text-center"  :class="red.redStyle(reportStore?.reportData?.result?.redcon)">{{ red.redCon(reportStore?.reportData?.result?.redcon) }}</td>
            </tr>
           
          </tbody>
        </v-table>

        <!-- Assessment Section -->
        <AssessmentForm 
          v-model:assessments="assessments"
          @save="save"
          @clear="reset"
          :status="reportStore.reportData?.status"
        />
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
import { red } from '@/utils/redcon.js'
import { ref, computed } from 'vue'
import AppButton from '@/components/common/AppButton.vue'
import AssessmentForm from '@/components/common/AssessmentForm.vue'
import AppDialog from '@/components/common/AppDialog.vue'
import { useReportStore } from '@/stores/reportStore'
import { useSnackbar } from '@/composables/useSnackbar'
import { executeReportAction, printReportReadiness  } from '@/services/reportService'

const reportStore = useReportStore()
const { showSuccess } = useSnackbar()
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

const assessments = computed(()=>{
  return reportStore?.reportData?.assessment ?? assessmentsTemp.value
})

const reset = () => {
  assessments.value = {
    a: '',
    b: '',
    c: '',
    d: ''
  }
}

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
  const response = await executeReportAction (payload, 'training','update', reportStore.reportId)
  reportStore.reportData = response?.data
  showConfirmDialog.value = false
  showSuccess('Assessment saved successfully!')
}

/**
 * Handle cancel from dialog
 */
const handleCancelSave = () => {
  showConfirmDialog.value = false
  pendingAssessmentData.value = null
}

const printReport = async () => {
 let payload = {
    assessment: reportStore?.reportData?.assessment,
    rating: reportStore?.reportData?.result
    
  }
  await printReportReadiness(payload, 'training', 'training-readiness-report.xlsx') 
  showSuccess('Report printed successfully!')
}
</script>

<style scoped>
.training-reports {
  padding: 1rem;
}

.rating-summary-table {
  width: 100%;
  margin-bottom: 2rem;
}

.rating-summary-table thead tr.header-row {
  background-color: #1976d2;
  color: white;
}

.rating-summary-table thead th {
  padding: 12px 16px;
  text-align: center;
  font-size: 12px;
  text-transform: uppercase;
  font-weight: 600;
  border-bottom: 2px solid #1976d2;
}

.rating-summary-table thead th:first-child {
  text-align: left;
}

.rating-summary-table tbody td {
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  font-size: 14px;
}

.rating-summary-table tbody tr.total-row {
  background-color: #e8e8e8;
  font-weight: 600;
}

.rating-summary-table tbody tr:hover {
  background-color: #f9f9f9;
}

.rating-summary-table tbody tr.total-row:hover {
  background-color: #e8e8e8;
}

.text-center {
  text-align: center;
}

.assessment-section {
  margin-top: 2rem;
}

.assessment-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

.assessment-item {
  margin-bottom: 24px;
}

.question-header {
  background-color: #e8e8e8;
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 500;
  color: #333;
  border-radius: 4px 4px 0 0;
  line-height: 1.5;
}

.font-weight-600 {
  font-weight: 600;
}

.mb-8 {
  margin-bottom: 32px;
}
</style>
