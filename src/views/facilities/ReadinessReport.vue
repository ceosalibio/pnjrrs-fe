<template>
  <AppEmptyState 
      v-if="reportStore.tableItems?.length === 0"
      title="No Data Available"
      message="Please generate first to view this page"
    />
  <div class="readiness-report" v-else>
    <v-card  class="mb-6">
      <v-card-title>Facility Readiness Report</v-card-title>
      <v-card-subtitle>Overall facility readiness assessment and rating</v-card-subtitle>
      <v-card-text class="pa-0">
        <v-table class="data-table">
          <thead>
            <tr class="header-row">
              <th class="text-left">Category</th>
              <th class="text-center">Required Area sqm</th>
              <th class="text-center">Actual Area sqm</th>
              <th class="text-center">Quantitative<br>(Actual Area/Required)</th>
              <th class="text-center">Qualitative</th>
              <th class="text-center">Percentage<br>(Quantitative+Qualitative)/2</th>
              <th class="text-center">Percentage <br> (Weighted Distribution) </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in reportStore?.reportData?.result?.categories || []" :key="idx" height="90vh">
              <td class="text-center">{{item.category}} ({{ item.weight_percentage }}%)</td>
              <td class="text-center">{{item.required_area}}</td>
              <td class="text-center">{{item.actual_area}}</td>             
              <td class="text-center">{{item.quantitative_percentage}}%</td>
              <td class="text-center">{{item.qualitative_percentage}}%</td>
              <td class="text-center">{{item.average_percentage}}%</td>
              <td class="text-center">{{item.weighted_score}}%</td>
            </tr>

            <tr height="90vh" >
              <td colspan="3" class="text-end">TOTAL</td> 
              <td class="text-center">{{reportStore?.reportData?.result?.average_quantitative_percentage}}%</td>
              <td class="text-center">{{reportStore?.reportData?.result?.average_qualitative_percentage}}%</td>
              <td class="text-center">{{reportStore?.reportData?.result?.average_percentage}}%</td>
              <td class="text-center">{{reportStore?.reportData?.result?.overall_readiness}}%</td>
            </tr>
            <tr height="90vh" >
              <td colspan="6" class="text-center" >REDCON</td> 
              <td class="text-center" :class="red.redStyle(reportStore?.reportData?.result?.redcon)">{{red.redCon(reportStore?.reportData?.result?.redcon)}}</td>
            </tr>
          </tbody>
        </v-table>

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
import { red } from '@/utils/redcon.js'
import AppEmptyState from '@/components/common/AppEmptyState.vue'
import { ref, computed } from 'vue'
import AssessmentForm from '@/components/common/AssessmentForm.vue'
import AppDialog from '@/components/common/AppDialog.vue'
import { useReportStore } from '@/stores/reportStore'
import { executeReportAction  } from '@/services/reportService'
const reportStore = useReportStore()
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

const handleConfirmSave = async () => {
  let payload ={
    assessment: pendingAssessmentData.value
  }
  const response = await executeReportAction (payload, 'facilities','update', reportStore.reportId)
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
.readiness-report {
  padding: 1rem;
}

.custom-table {
  border-collapse: collapse;
}

.custom-table td {
  border-bottom: 1px solid #e0e0e0;
  padding: 12px 8px;
  vertical-align: middle;
}

/* Header Row */
.readiness-report :deep(thead .header-row th) {
  background-color: #1565C0 !important;
  color: white !important;
  font-weight: 700 !important;
  border-bottom: 3px solid #0D47A1 !important;
  padding: 16px 8px !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px !important;
  font-size: 0.85rem !important;
  line-height: 1.4 !important;
}

/* Total Row */
.total-row {
  background-color: #E3F2FD;
  font-weight: 600;
  border-top: 2px solid #1565C0;
  border-bottom: 2px solid #1565C0;
}

.total-row td {
  padding: 14px 8px !important;
}

/* REDCON Row */
.redcon-row {
  background-color: #FFF3E0;
  font-weight: 700;
  border-top: 2px solid #FF9800;
  border-bottom: 2px solid #FF9800;
}

.redcon-row td {
  padding: 14px 8px !important;
}

/* Text Utilities */
.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.font-weight-bold {
  font-weight: 600;
}

.bg-primary {
  background-color: #1976D2;
}

.text-white {
  color: white;
}

/* Responsive */
@media (max-width: 960px) {
  .custom-table td {
    padding: 8px 4px;
    font-size: 0.85rem;
  }

  .readiness-report :deep(thead .header-row th) {
    padding: 12px 4px !important;
    font-size: 0.75rem !important;
  }
}

@media (max-width: 600px) {
  .custom-table {
    font-size: 0.75rem;
  }

  .custom-table td {
    padding: 6px 2px;
  }
}
</style>
