<template>
  <div class="reports-view">
    <v-card class="mb-6">
      <v-card-title>Reports</v-card-title>
      <v-card-subtitle>View and manage system reports</v-card-subtitle>
      <v-divider />

      <v-card-text>
        <!-- Report Type Selection Buttons -->
        <v-row class="mb-6">
          <v-col cols="12" :md="adminAccess ? '2':'3'">
            <v-btn
              class="report-btn h-100"
              :color="selectedReportType === 'personnel' ? 'info' : 'grey-lighten-2'"
              :text="selectedReportType !== 'personnel'"
              @click="selectedReportType = 'personnel'"
              :disabled="authStore.office != 1 && !adminAccess"

            >
              <div class="btn-content">
                <div class="text-h4">Personnel</div>
                <!-- <div class="text-subtitle2">{{ reportStats.personnel }} Reports</div> -->
              </div>
            </v-btn>
          </v-col>
          <v-col cols="12" :md="adminAccess ? '2':'3'">
            <v-btn
              class="report-btn h-100"
              :color="selectedReportType === 'training' ? 'success' : 'grey-lighten-2'"
              :text="selectedReportType !== 'training'"
              @click="selectedReportType = 'training'"
              :disabled="authStore.office != 8 && !adminAccess"
            >
              <div class="btn-content">
                <div class="text-h4">Training</div>
                <!-- <div class="text-subtitle2">{{ reportStats.training }} Reports</div> -->
              </div>
            </v-btn>
          </v-col>
          <v-col cols="12" md="3">
            <v-btn
              class="report-btn h-100"
              :color="selectedReportType === 'equipment' ? 'warning' : 'grey-lighten-2'"
              :text="selectedReportType !== 'equipment'"
              @click="selectedReportType = 'equipment'"
              :disabled="![4, 6, 8].includes(authStore.office) && !adminAccess"
            >
              <div class="btn-content">
                <div class="text-h5">Equipment & Maintenance</div>
                <!-- <div class="text-subtitle2">{{ reportStats.equipment }} Reports</div> -->
              </div>
            </v-btn>
          </v-col>
          
          <v-col cols="12" md="3">
            <v-btn
              class="report-btn h-100"
              :color="selectedReportType === 'facilities' ? 'error' : 'grey-lighten-2'"
              :text="selectedReportType !== 'facilities'"
              @click="selectedReportType = 'facilities'"
              :disabled="![4, 6, 8].includes(authStore.office) && !adminAccess"
            >
              <div class="btn-content">
                <div class="text-h4">Facilities</div>
                <!-- <div class="text-subtitle2">{{ reportStats.facilities }} Reports</div> -->
              </div>
            </v-btn>
          </v-col>

          <v-col cols="12" md="2" v-if="adminAccess">
            <v-btn
              class="report-btn h-100"
              :color="selectedReportType === 'all' ? 'blue-darken-4' : 'grey-lighten-2'"
              :text="selectedReportType !== 'all'"
              @click="selectedReportType = 'all'"
            >
              <div class="btn-content">
                <div class="text-h4">ALL</div>
                <!-- <div class="text-subtitle2">{{ reportStats.facilities }} Reports</div> -->
              </div>
            </v-btn>
          </v-col>
        </v-row>

        <v-divider class="my-6" />

        <!-- Filters and Controls -->
        <div class="mb-4 d-flex justify-space-between align-center gap-3">
          <div class="d-flex ga-4">
            <div class="d-flex flex-grow-1">
                <AppAutocomplete 
                 v-if="adminAccess"
                  label="Units"
                  v-model="filterStore.unit"
                  :text="'name'"
                  :value="'id'"
                  :items="filterStore.organizationFilterItems.units"
                  style="width: 250px"
                  :clearable="true"
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
              v-if="tableData?.length > 0"
              color="secondary"
              prepend-icon="mdi-printer"
              @click="handlePrint"
            >
              Print
            </v-btn>
          </div>
        </div>

        <!-- Reports Table -->
        <div v-if="tableData?.length > 0">
          <PersonnelTable v-if="selectedReportType === 'personnel'" :displayData="tableData" :unit="unit"/>
          <TrainingTable v-else-if="selectedReportType === 'training'" :displayData="tableData" :unit="unit"/>
          <EquipmentTable v-else-if="selectedReportType === 'equipment'" :displayData="tableData" :unit="unit"/>
          <FacilitiesTable v-else-if="selectedReportType === 'facilities'" :displayData="tableData" :unit="unit"/>
          <AllTable v-else-if="selectedReportType === 'all'" :displayData="tableData" :unit="unit"/>
        </div>

        <!-- Empty State -->
        <v-alert v-else type="info" title="No Reports Found">
          Select "Rport Type" and "Month and Year" then Click "Generate" to create reports for the selected filters
        </v-alert>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import AppAutocomplete from '@/components/forms/AppAutocomplete.vue'
import AppMonthYearPicker from '@/components/forms/AppMonthYearPicker.vue'
import { useFilterStore } from '@/stores/filterStore.js'
import { useAuthStore } from '@/stores/authStore.js'
import { executeReportAction, printSummaryReportReadiness } from '@/services/reportService'
import PersonnelTable from './PersonnelTable.vue'
import TrainingTable from './TrainingTable.vue'
import EquipmentTable from './EquipmentTable.vue'
import FacilitiesTable from './FacilitiesTable.vue'
import AllTable from './AllTable.vue'
import { getUnits} from '@/services/organizationService'
import { useSnackbar } from '@/composables/useSnackbar'

const { showSuccess, showError } = useSnackbar()



const authStore = useAuthStore();
const filterStore = useFilterStore();
const selectedReportType = ref('')
const selectedUnit = ref(null)
const selectedMonth = ref(null)
const tableData = ref([])
const unit = ref(null)


const adminAccess = computed(()=>{
  return authStore.user?.role == 1 || authStore.n3_access
})

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

  if(adminAccess.value){
    unit.value = filterStore.unit
  }else{
    unit.value = authStore.user?.unit_id
  }

  let payload = {
    unit_id : unit.value,
    report_month : filterStore.reportMonth
  }

  const result = await executeReportAction(payload,selectedReportType.value, 'summary')
  tableData.value = result?.data
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

watch(() => filterStore.unit, async (newCategory, __oldCategory) => {
     
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
    // Set initial report type based on user's office
    selectedReportType.value = getInitialReportType()

})
</script>

<style scoped>
.reports-view {
  padding: 1rem;
}

.report-btn {
  width: 100%;
  height: 120px !important;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.report-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 8px;
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

/* Responsive */
@media (max-width: 960px) {
  .filters-section {
    flex-direction: column;
    width: 100%;
  }

  .report-btn {
    height: 100px !important;
  }
}

@media (max-width: 600px) {
  .d-flex {
    flex-direction: column;
  }

  .report-btn {
    height: 80px !important;
  }

  .btn-content {
    gap: 4px;
  }

  .btn-content .text-h6 {
    font-size: 1rem !important;
  }

  .btn-content .text-subtitle2 {
    font-size: 0.75rem !important;
  }
}
</style>
