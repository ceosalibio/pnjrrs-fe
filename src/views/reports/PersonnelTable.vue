<template>
    <div>
        <v-table class="data-table">
            <thead>
                <tr class="header-row">
                    <th>{{unit ? "Sub Unit" : "Unit"}}</th>
                    <th>TO</th>
                    <th>Actual</th>
                    <th>Personnel Fill-up <br> (Actual/TO x 100)</th>
                    <th>Rank <br> (Total Points)</th>
                    <th>RR <br> (Total Points / Actual  x 100)</th>
                    <th>FOS/Rating <br> (Aligned)</th>
                    <th>PSR<br> (Aligned FOS/Actual x 100)</th>
                    <th>PRR</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item,i) in displayData" :key="i">
                    <td>{{ !item.is_total ?item?.name ?? item.sub_unit?.name : "TOTAL"}}</td>
                    <td class="text-center">{{ item?.required}}</td>
                    <td class="text-center">{{ item?.actual}}</td>
                    <td class="text-center">{{ item?.fillUpRating ?? 0}}%</td>
                    <td class="text-center">{{ item?.grade_points}}</td>
                    <td class="text-center">{{ item?.gradeRating ?? 0}}%</td>
                    <td class="text-center">{{ item?.afpos_points}}</td>
                    <td class="text-center">{{ item?.afposRating ?? 0}}%</td>
                    <td class="text-center">{{ item?.readiness ?? 0}}%</td>
                    <td class="text-center" :class="red.redStyle(item?.redcon)">{{ item?.redcon}}</td>

                </tr>
            </tbody>
        </v-table>

        <!-- Assessment Section with Tabs -->
        <v-card class="mt-6">
          <v-tabs v-model="activeTab">
            <v-tab value="personnel">
              <v-icon start>mdi-account-group</v-icon>
              Personnel Assessment
            </v-tab>
            <v-tab value="dental-medical">
              <v-icon start>mdi-hospital-box</v-icon>
              Dental & Medical Assessment
            </v-tab>
          </v-tabs>

          <v-window v-model="activeTab">
            <!-- Personnel Assessment Tab -->
            <v-window-item value="personnel">
              <div class="pa-6">
                <AssessmentForm 
                  v-model:assessments="assessment"
                  title="Personnel Assessment"
                  @save="savePersonnel"
                  @clear="resetPersonnel"
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
                  @save="saveDentalMedical"
                  @clear="resetDentalMedical"
                  :status="status"
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
        status : {
            type: Number,
            default: 0
        },
        consolidated : {
            type: Object,
            default: () => ({})
        }
    })

    // Tab state
    const activeTab = ref('personnel')

    // Dialog state
    const showConfirmDialog = ref(false)
    const pendingAssessmentData = ref(null)
    const pendingAssessmentType = ref(null) // Track which assessment is being saved

    // Personnel Assessment
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
        return props.consolidated?.assessment_1 || {
            a: '',
            b: '',
            c: '',
            d: ''
        }
    })

    // Question sets
    // const personnelQuestions = {
    //     a: 'What capability shortfall exists or what has occurred to cause the lower assessment, and which elements of operational preparedness are affected?',
    //     b: 'What are the consequences of the lower level of readiness?',
    //     c: 'What is required to remedy the situation?',
    //     d: 'What level is achievable within a prescribed period?'
    // }

    // const dentalMedicalQuestions = {
    //     a: 'What dental/medical capability shortfall exists or what has occurred to cause the lower assessment?',
    //     b: 'What are the consequences of the lower level of dental/medical readiness?',
    //     c: 'What is required to remedy the dental/medical situation?',
    //     d: 'What level of dental/medical readiness is achievable within a prescribed period?'
    // }

    // Reset functions
    const resetPersonnel = () => {
        assessment.value = {
            a: '',
            b: '',
            c: '',
            d: ''
        }
    }

    const resetDentalMedical = () => {
        assessment_1.value = {
            a: '',
            b: '',
            c: '',
            d: ''
        }
    }

    // Save functions
    const savePersonnel = (assessmentData) => {
        pendingAssessmentData.value = assessmentData || assessment.value
        pendingAssessmentType.value = 'personnel'
        showConfirmDialog.value = true
    }

    const saveDentalMedical = (assessmentData) => {
        pendingAssessmentData.value = assessmentData || assessment_1.value
        pendingAssessmentType.value = 'dental_medical'
        showConfirmDialog.value = true
    }

    /**
     * Handle confirmation from dialog
     */
    const handleConfirmSave = async () => {
        let payload = {
            report_type : 'personnel',
            report_month : filterStore.reportMonth,
        }
        if(pendingAssessmentType.value === 'personnel') {
            payload.assessment = pendingAssessmentData.value
        }else{
            payload.assessment_1 = pendingAssessmentData.value
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

<style scoped>
.mt-6 {
    margin-top: 1.5rem;
}

.pa-6 {
    padding: 1.5rem;
}
</style>