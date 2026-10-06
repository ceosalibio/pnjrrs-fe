<template>
  <div class="reports-view">
    <v-card class="mb-6">
      <v-card-title>Reports</v-card-title>
      <v-card-subtitle>View and manage system reports</v-card-subtitle>
      <v-divider />

      <v-card-text>
        <!-- Report Type Selection Buttons -->
        <div class="report-type-label">Report Type</div>
        <div class="report-types mb-6">
          <div
            v-for="type in reportTypes"
            :key="type.key"
            :title="type.disabled ? 'Not available for your office' : undefined"
          >
            <v-card
              class="report-type"
              :class="{ 'report-type--active': selectedReportType === type.key }"
              :color="selectedReportType === type.key ? type.color : undefined"
              :variant="selectedReportType === type.key ? 'tonal' : 'outlined'"
              :disabled="type.disabled"
              @click="selectedReportType = type.key"
            >
              <div class="report-type__body">
                <v-avatar
                  :color="type.disabled ? 'grey' : type.color"
                  :variant="selectedReportType === type.key ? 'flat' : 'tonal'"
                  size="40"
                  rounded="lg"
                >
                  <v-icon :icon="type.icon" size="22" />
                </v-avatar>
                <span class="report-type__label">{{ type.label }}</span>
                <v-icon
                  v-if="selectedReportType === type.key"
                  icon="mdi-check-circle"
                  size="20"
                  class="report-type__status"
                />
                <v-icon
                  v-else-if="type.disabled"
                  icon="mdi-lock-outline"
                  size="18"
                  class="report-type__status"
                />
              </div>
            </v-card>
          </div>
        </div>

        <v-divider class="my-6" />

        <!-- Filters and Controls -->
        <div class="mb-4 d-flex justify-space-between align-center gap-3">
          <div class="d-flex ga-4">
            <div class="d-flex flex-grow-1">
                <AppAutocomplete 
             
                  label="Units"
                  v-model="unit"
                  :text="'name'"
                  :value="'id'"
                  :items="unitList"
                  style="width: 250px"
                  :clearable="hpnAccess"
                  :disabled="!hpnAccess"
              />
            </div>
            
             <AppMonthYearPicker 
                v-model="filterStore.reportMonth"
                style="width: 200px"
            />
          </div>
          <div class="d-flex ga-2">
            <v-btn
              v-if="selectedReportType && filterStore.reportMonth"
              color="primary"
              prepend-icon="mdi-refresh"
              @click="handleGenerate"
            >
              Generate
            </v-btn>
            <v-btn 
              v-if="authStore.user?.approver == 0 && tableData?.length"
              :disabled="consolidated?.status > 0"
              color="success"
              @click="showSubmitDialog = true"
            >
              SUBMIT
            </v-btn>

            <v-btn 
              v-if="authStore.user?.approver > 0 && tableData?.length"
              :disabled="authStore.user?.approver != consolidated?.status"
              color="success"
              @click="showSubmitDialog = true"
            >
              APPROVE
            </v-btn>

             <v-btn 
              v-if="authStore.user?.approver > 0 && tableData?.length"
              :disabled="authStore.user?.approver != consolidated?.status"
              color="red"
              @click="handleDecline()"
            >
              DECLINED
            </v-btn>
            <v-btn
              v-if="tableData?.length > 0"
              color="secondary"
              prepend-icon="mdi-printer"
              @click="handlePrint"
            >
              Print
            </v-btn>
          </div>
        </div>
        <div class="mb-5">
            <app-timeline-status 
                :items="timelineItems"
                :activeIndex="consolidated?.status"
            />
        </div>

        <!-- Reports Table -->
        <div v-if="tableData?.length > 0">
          <PersonnelTable
            v-if="selectedReportType === 'personnel'"
            :displayData="tableData"
            :unit="unit"
            :consolidated="consolidated"
          />
          <TrainingTable
            v-else-if="selectedReportType === 'training'"
            :displayData="tableData"
            :unit="unit"
            :consolidated="consolidated"
          />
          <EquipmentTable
            v-else-if="selectedReportType === 'equipment'"
            :displayData="tableData"
            :unit="unit"
            :consolidated="consolidated"
            :consolidated_personnel="consolidated_personnel"
          />
          <FacilitiesTable
            v-else-if="selectedReportType === 'facilities'"
            :displayData="tableData"
            :unit="unit"
            :consolidated="consolidated"
          />
          <AllTable
            v-else-if="selectedReportType === 'all'"
            :displayData="tableData"
            :unit="unit"
            :consolidated="consolidated"
          />
        </div>

        <!-- Empty State -->
        <v-alert v-else type="info" title="No Reports Found">
          Select "Report Type" and "Month and Year" then Click "Generate" to create reports for the selected filters
        </v-alert>
      </v-card-text>
    </v-card>

    <!-- Submit Confirmation Dialog -->
    <app-dialog
        v-model="showSubmitDialog"
        :title="authStore.user?.approver > 0 ? 'Approve Report' : 'Submit Report'"
        :message="authStore.user?.approver > 0 ? 'Are you sure you want to approve this report?' : 'Are you sure you want to submit this report?'"
        confirm-text="Yes"
        confirm-color="success"
        @confirm="confirmSubmit"
    />

    <!-- Decline Confirmation Dialog -->
      <v-dialog v-model="showDeclineDialog" max-width="500">
          <v-card>
              <v-card-title class="text-h6">Decline Report</v-card-title>
              <v-divider />
              <v-card-text class="py-4">
                  <p class="mb-3">Please provide a reason for declining this report:</p>
                  <v-textarea
                      v-model="declineReason"
                      label="Reason"
                      placeholder="Enter your reason for declining..."
                      outlined
                      dense
                      rows="4"
                  />
              </v-card-text>
              <v-divider />
              <v-card-actions>
                  <v-spacer />
                  <v-btn color="grey" @click="showDeclineDialog = false">Cancel</v-btn>
                  <v-btn 
                      color="error" 
                      @click="confirmDecline()"
                      :disabled="!declineReason?.trim()"
                  >
                      Decline
                  </v-btn>
              </v-card-actions>
          </v-card>
      </v-dialog>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import AppAutocomplete from '@/components/forms/AppAutocomplete.vue'
import AppMonthYearPicker from '@/components/forms/AppMonthYearPicker.vue'
import AppDialog from '@/components/common/AppDialog.vue';
import AppTimelineStatus from '@/components/layouts/AppTimelineStatus.vue';
import { useFilterStore } from '@/stores/filterStore.js'
import { useAuthStore } from '@/stores/authStore.js'
import { useReportStore } from '@/stores/reportStore.js'
import { executeReportAction, printSummaryReportReadiness } from '@/services/reportService'
import { formatToPhilippineTime } from '@/utils/dateFormatter.js'
import PersonnelTable from './PersonnelTable.vue'
import TrainingTable from './TrainingTable.vue'
import EquipmentTable from './EquipmentTable.vue'
import FacilitiesTable from './FacilitiesTable.vue'
import AllTable from './AllTable.vue'
import { getUnits} from '@/services/organizationService'
import { useSnackbar } from '@/composables/useSnackbar'
import { useFilter } from '@/composables/useFilter'
const { showSuccess, showError } = useSnackbar()



const authStore = useAuthStore();
const filterStore = useFilterStore();
const reportStore = useReportStore();
const {unitList} = useFilter()
const selectedReportType = ref('')
const selectedUnit = ref(null)
const selectedMonth = ref(null)
const tableData = ref([])
const unit = ref(null)
const showSubmitDialog = ref(false);
const showDeclineDialog = ref(false);
const declineReason = ref('');
const finalApprover = ref(null)
const approver = ref([])
const consolidated = ref({})
const consolidated_personnel = ref({})

const hpnAccess = computed(()=>{
  return authStore.user?.role == 1 || authStore.user?.unit_id == 1
})

const adminAccess = computed(()=>{
  return authStore.user?.role == 1 || authStore.n3_access
})

// Report type cards — same enable/disable rules as the old buttons
const reportTypes = computed(() => {
  const office = authStore.office
  const admin = adminAccess.value
  const types = [
    { key: 'personnel', label: 'Personnel', icon: 'mdi-account-multiple', color: 'info', disabled: office != 1 && !admin },
    { key: 'training', label: 'Training', icon: 'mdi-bullseye-arrow', color: 'success', disabled: office != 8 && !admin },
    { key: 'equipment', label: 'Equipment & Maintenance', icon: 'mdi-toolbox', color: 'warning', disabled: ![4, 6, 8].includes(office) && !admin },
    { key: 'facilities', label: 'Facilities', icon: 'mdi-home-city', color: 'error', disabled: ![4, 6, 8].includes(office) && !admin }
  ]
  if (admin) {
    types.push({ key: 'all', label: 'All Reports', icon: 'mdi-view-grid-outline', color: 'blue-darken-4', disabled: false })
  }
  return types
})

const timelineItems = computed(() => {
    if (!approver.value || approver.value.length === 0) {
        return [];
    }
    
    return approver.value.map((stage) => {
        const userNames = stage.users?.map(u => u.name).join('/ ') || stage.position;
        const createdAt = stage.actual?.[0]?.created_at;
        const philippineTime = createdAt ? formatToPhilippineTime(createdAt) : null;
        
        return {
            label: userNames,
            sublabel: stage.position,
            isDone: consolidated.value?.status > stage.approver,
            ...(philippineTime && { timestamp: philippineTime }),
            declined : stage.declined
        };
    });
});



// Get initial report type based on office
const getInitialReportType = () => {
  const office = authStore.office
  const reportTypeMap = {
    1: 'personnel',
    8: 'training',
    4: 'equipment',
    6: 'equipment',
    3: 'all'
  }
  return reportTypeMap[office] || ''
}

const handleGenerate = async () => {

  // if(adminAccess.value){
  //   unit.value = filterStore.unit
  // }else{
  //   unit.value = authStore.user?.unit_id
  // }

  let payload = {
    report_type : 'all',
    category_id: authStore.user?.category_id,
    unit_id : unit.value,
    sub_unit_id: authStore.user?.sub_unit_id,
    office_id: authStore.user?.office_id,
    sub_office_id: authStore.user?.sub_office_id,
    report_month : filterStore.reportMonth
  }

  const result = await executeReportAction(payload,selectedReportType.value, 'summary')
  // console.log(result)
  tableData.value = result?.data?.report
  approver.value = result?.data?.approver || []
  finalApprover.value = result?.data?.final_approver || null
  consolidated.value = result?.data?.consolidated || {}
  consolidated_personnel.value = result?.data?.consolidated_personnel || {}
}



const handlePrint = async () => {
  let payload = {
    summary : tableData.value,
    assessment : {}
  }

  await printSummaryReportReadiness(payload, selectedReportType.value)
  showSuccess('Report printed successfully!');
  // TODO: Implement print functionality
}


async function confirmSubmit() {
  
    let status = authStore.user?.approver + 1;
    let payload = {
        status: status,
        is_final:  finalApprover.value == authStore.user?.approver ? 1 : 0
    }
    if(!authStore.user?.approver){
        payload.category_id = authStore.user?.category_id
        payload.unit_id =  authStore.user?.unit_id
        payload.sub_unit_id = authStore.user?.sub_unit_id
        payload.office_id = authStore.user?.office_id
        payload.sub_office_id = authStore.user?.sub_office_id
    }
    // if(reportStore.reportData?.assessment == null || reportStore.reportData?.assessment == undefined){
    //     showError('Please fill out the assessment before submitting the report.')
    //     return false
    // }
    const response = await executeReportAction (payload, 'all','consolidated_approver',consolidated.value.id)
    if(response?.status == "success"){
        await handleGenerate()
        showSubmitDialog.value = false
        showSuccess(status > 1 ? 'Report approved successfully!' : 'Report submitted successfully!')
    }
}

async function handleDecline() {
    showDeclineDialog.value = true
    declineReason.value = ''
}

async function confirmDecline() {
    if (!declineReason.value?.trim()) {
        showError('Please provide a reason for declining')
        return
    }

    try {
        let status = authStore.user?.approver - 1;
        let payload = {
            status: status,
            reason: declineReason.value
        }
        
        const response = await executeReportAction(payload,'all','consolidated_approver',consolidated.value.id)
        
        if (response?.status == "success") {
            await handleGenerate()
            showDeclineDialog.value = false
            declineReason.value = ''
            showSuccess('Report declined successfully!')
        } else {
            showError(response?.message || 'Failed to decline report')
        }
    } catch (error) {
        showError(error.message || 'Failed to decline report')
    }
}

watch(() => unit, async (newCategory, __oldCategory) => {
     
  if (newCategory) {
      tableData.value = []
  }
}, { immediate: false })

watch(() => selectedReportType.value, async (newCategory, __oldCategory) => {
     
  if (newCategory) {
      tableData.value = []
  }
}, { immediate: false })

onMounted(async () => {
    const result = await getUnits();
    filterStore.organizationFilterItems.units = result?.data || [];
    if (!hpnAccess.value) {
      unit.value = authStore.user?.unit_id
    }
    // Set initial report type based on user's office
    selectedReportType.value = getInitialReportType()

})
</script>

<style scoped>
.reports-view {
  padding: 1rem;
}

/* Report type cards */
.report-type-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 8px;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
}

.report-types {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.report-type {
  position: relative;
  height: 100%;
  border-radius: 10px;
  border-width: 1px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.report-type:not(.v-card--disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 31, 84, 0.1);
}

.report-type--active {
  border: 2px solid currentColor;
}

.report-type__body {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  min-height: 68px;
}

.report-type__label {
  flex: 1;
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.25;
}

.report-type__status {
  flex-shrink: 0;
  opacity: 0.85;
}

.filters-section {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
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

.gap-3 {
  gap: 1rem;
}

.ga-4 {
  gap: 1rem;
}

.ga-2 {
  gap: 0.5rem;
}

.my-6 {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.h-100 {
  height: 100%;
}

@media (max-width: 960px) {
  .filters-section {
    flex-direction: column;
    width: 100%;
  }

}

@media (max-width: 600px) {
  .d-flex {
    flex-direction: column;
  }

  /* Two cards per row on phones */
  .report-types {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .report-type__body {
    flex-direction: column;
    text-align: center;
    gap: 6px;
    padding: 10px 8px;
  }

  .report-type__label {
    font-size: 0.8rem;
  }

  .report-type__status {
    position: absolute;
    top: 6px;
    right: 6px;
  }
}
</style>
