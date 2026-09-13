<template>
    <div>
        <v-row>
            <v-col>
                <h2>Equipment</h2>
                <v-table class="data-table">
                    <thead>
                        <tr class="header-row">
                            <th>{{unit ? "Sub Unit" : "Unit"}}</th>
                            <th>Equipment Readiness</th>
                            <th>REDCON</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,i) in displayData" :key="i">
                            <td>{{ !item.is_total ?item?.name ?? item.sub_unit?.name : "TOTAL"}}</td>
                            <td class="text-center">{{ item?.rating_equipment?.toFixed(2) ?? 0}}%</td>
                            <td class="text-center" :class="red.redStyle(item?.redcon_equipment)">{{ item?.redcon_equipment}}</td>

                        </tr>
                    </tbody>
                </v-table>
            </v-col>
            <v-col>
                <h2>Maintenance</h2>
                <v-table class="data-table">
                    <thead>
                        <tr class="header-row">
                            <th>{{unit ? "Sub Unit" : "Unit"}}</th>
                            <th>Maintenance Readiness</th>
                            <th>REDCON</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,i) in displayData" :key="i">
                            <td>{{ !item.is_total ?item?.name ?? item.sub_unit?.name : "TOTAL"}}</td>
                            <td class="text-center">{{ item?.rating_maintenance?.toFixed(2) ?? 0}}%</td>
                            <td class="text-center" :class="red.redStyle(item?.redcon_maintenance)">{{ item?.redcon_maintenance}}</td>

                        </tr>
                    </tbody>
                </v-table>
            </v-col>
        </v-row>
        

        <!-- Assessment Section with Tabs -->
        <v-card class="mt-6">
          <v-tabs v-model="activeTab">
            <v-tab value="equipment">
              <v-icon start>mdi-account-group</v-icon>
              Equipment and Maintenance Assessment
            </v-tab>

            <v-tab value="communication">
              <v-icon start>mdi-phone</v-icon>
              Communication
            </v-tab>

            <v-tab value="dental-medical">
              <v-icon start>mdi-hospital-box</v-icon>
              Dental & Medical Assessment
            </v-tab>

            
          </v-tabs>

          <v-window v-model="activeTab">
            <!-- Equipment Assessment Tab -->
            <v-window-item value="equipment">
              <div class="pa-6">
                <AssessmentForm 
                  v-model:assessments="assessment"
                  title="Equipment Assessment"
                  @save="saveEquipment"
                  @clear="resetEquipment"
                  :status="status"
                />
              </div>
            </v-window-item>

            <!-- Communication Assessment Tab -->
            <v-window-item value="communication">
              <div class="pa-6">
                <AssessmentForm 
                  v-model:assessments="assessment_2"
                  title="Communication Assessment"
                  @save="saveCommunication"
                  @clear="resetCommunication"
                  :status="status"
                />
              </div>
            </v-window-item>

            <!-- Dental & Medical Assessment Tab -->
            <v-window-item value="dental-medical">
              <div class="pa-6">
                <AssessmentForm 
                  v-model:assessments="assessment_1"
                  title="Dental & Medical Assessment"
                  :status="status"
                  :hideAction="true"
                />
              </div>
            </v-window-item>
          </v-window>
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
import {ref, computed} from 'vue'
import AssessmentForm from '@/components/common/AssessmentForm.vue'
import AppDialog from '@/components/common/AppDialog.vue'
import { executeReportAction } from '@/services/reportService'
import { useReportStore } from '@/stores/reportStore'
import { useFilterStore } from '@/stores/filterStore'
import { useSnackbar } from '@/composables/useSnackbar'

const reportStore = useReportStore()
const filterStore = useFilterStore()
const { showSuccess, showError } = useSnackbar()
const props = defineProps({
    displayData : {
        type: Array,
        default: () => []
    },
    unit : {
        type: [String, Number],
        default: null
    },
     unit : {
            type: [String, Number],
            default: null
    },
    status : {
        type: Number,
        default: 0
    },
    consolidated : {
        type: Object,
        default: () => ({})
    },
    consolidated_personnel : {
        type: Object,
        default: () => ({})
    }
})

// Tab state
    const activeTab = ref('equipment')

    // Dialog state
    const showConfirmDialog = ref(false)
    const pendingAssessmentData = ref(null)
    const pendingAssessmentType = ref(null)

    // Equipment Assessment
    const assessment = computed(() => {
        return props.consolidated?.assessment || {
            a: '',
            b: '',
            c: '',
            d: ''
        }
    })

    // Dental & Medical Assessment
    const assessment_1 = computed(() => {
        return props.consolidated_personnel?.assessment_1 || {
            a: '',
            b: '',
            c: '',
            d: ''
        }
    })

    // Communication Assessment
    const assessment_2 = computed(() => {
        return props.consolidated?.assessment_2 || {
            a: '',
            b: '',
            c: '',
            d: ''
        }
    })

    // Reset functions
    const resetEquipment = () => {
        assessment.value = {
            a: '',
            b: '',
            c: '',
            d: ''
        }
    }

    const resetCommunication = () => {
        assessment_2.value = {
            a: '',
            b: '',
            c: '',
            d: ''
        }
    }


     // Save functions
    const saveEquipment = (assessmentData) => {
        pendingAssessmentData.value = assessmentData || assessment.value
        pendingAssessmentType.value = 'equipment'
        showConfirmDialog.value = true
    }

    const saveCommunication = (assessmentData) => {
        pendingAssessmentData.value = assessmentData || assessment_2.value
        pendingAssessmentType.value = 'communication'
        showConfirmDialog.value = true
    }


    /**
     * Handle confirmation from dialog
     */
    const handleConfirmSave = async () => {
        let payload = {
            report_type : 'equipment',
            report_month : filterStore.reportMonth,
        }
        if(pendingAssessmentType.value === 'equipment') {
            payload.assessment = pendingAssessmentData.value
        }else{
            payload.assessment_2 = pendingAssessmentData.value
        }
        try {
            const response = await executeReportAction(payload, 'all','consolidated' )
            reportStore.reportData = response?.data
            showConfirmDialog.value = false
            showSuccess('Assessment saved successfully!')
        } catch (error) {
            showError('Failed to save assessment')
            console.error(error)
        }
    }

    /**
     * Handle cancel from dialog
     */
    const handleCancelSave = () => {
        showConfirmDialog.value = false
        pendingAssessmentData.value = null
        pendingAssessmentType.value = null
    }


</script>