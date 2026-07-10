<template>
  <div class="personnel-reports">
    <v-card class="mb-6">
      <v-card-title>Personnel Readiness Report</v-card-title>
      <v-card-subtitle>Overall personnel readiness assessment and rating</v-card-subtitle>
      <v-divider />

      <v-card-text>
        <!-- Rating Summary Table -->
        <v-table class="rating-summary-table mb-8">
          <thead>
            <tr class="header-row">
              <th class="text-center">RATING</th>
              <th class="text-center">PERCENTAGE</th>
              <th class="text-center">WEIGHT PERCENTAGE</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Personnel Fill-up Rating ({{ readinessTableData?.fillUpRating || 0 }} %)</td>
              <td class="text-center">80%</td>
              <td class="text-center">{{ readinessTableData?.finalFillUpRating || 0 }}%</td>
            </tr>
            <tr>
              <td>Personnel Grade Rating ({{ readinessTableData?.gradeRating || 0 }} %)</td>
              <td class="text-center">85%</td>
              <td class="text-center">{{ readinessTableData?.finalGradeRating || 0 }}%</td>
            </tr>
            <tr>
              <td>Personnel Specialty Rating ({{ readinessTableData?.afposRating || 0 }} %)</td>
              <td class="text-center">100%</td>
              <td class="text-center">{{ readinessTableData?.finalAfposRating || 0 }}%</td>
            </tr>
            <tr class="total-row">
              <td colspan="2">TOTAL</td>
              <td class="text-center">{{ readinessTableData?.readiness || 0 }}%</td>
            </tr>
            <tr class="total-row">
              <td colspan="2">REDCON</td>
              <td class="text-center">{{ readinessTableData?.redcon || 0 }}</td>
            </tr>
          </tbody>
        </v-table>

        <!-- Assessment Section -->
        <AssessmentForm 
          v-model:assessments="assessments"
          @save="save"
          @clear="reset"
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
import { ref, computed } from 'vue'
import AssessmentForm from '@/components/common/AssessmentForm.vue'
import AppDialog from '@/components/common/AppDialog.vue'
import { useReportStore } from '@/stores/reportStore'
import { executeReportAction  } from '@/services/reportService'

const reportStore = useReportStore()

// Dialog state
const showConfirmDialog = ref(false)
const pendingAssessmentData = ref(null)

// Rating percentages
const psgrPercentage = ref(0)
const pqrPercentage = ref(0)
const pqrDetailPercentage = ref(0)
const psrPercentage = ref(0)

// Assessment object
const assessmentsTemp = ref({
  a: '',
  b: '',
  c: '',
  d: ''
})

const readinessTableData = computed(()=>{
  return reportStore?.reportData?.result
})

const assessments = computed(()=>{
  return reportStore?.reportData?.assessment ?? assessmentsTemp.value
})



// Computed weighted percentages
const psgrWeightedPercentage = computed(() => {
  return Math.round((psgrPercentage.value * 50) / 100)
})

const pqrWeightedPercentage = computed(() => {
  return Math.round((pqrPercentage.value * 50) / 100)
})

const pqrDetailWeightedPercentage = computed(() => {
  return Math.round((pqrDetailPercentage.value * 40) / 100)
})

const psrWeightedPercentage = computed(() => {
  return Math.round((psrPercentage.value * 60) / 100)
})

const totalWeightedPercentage = computed(() => {
  return psgrWeightedPercentage.value + pqrWeightedPercentage.value
})

const reset = () => {
  psgrPercentage.value = 0
  pqrPercentage.value = 0
  pqrDetailPercentage.value = 0
  psrPercentage.value = 0
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
  const response = await executeReportAction (payload, 'personnel','update', reportStore.reportData?.id)
  console.log(response)
  reportStore.reportData = response?.data
  showConfirmDialog.value = false
  alert('Report saved successfully!')
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
.personnel-reports {
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
