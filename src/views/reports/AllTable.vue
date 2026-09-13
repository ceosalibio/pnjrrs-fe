<template>
    <div>
        <v-table class="data-table">
            <thead>
                <tr class="header-row">
                    <th>Report</th>
                    <th>Readiness<br> Rating</th>
                    <th>REDCON</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item,i) in displayData" :key="i">
                    <td class="text-center">{{ item?.report}}</td>
                    <td class="text-center font-weight-bold">{{ item?.rating?.toFixed(2) ?? 0}}%</td>
                    <td class="text-center" :class="red.redStyle(item?.redcon)">{{ item?.redcon}}</td>

                </tr>
            </tbody>
        </v-table>

        <!-- assessment section -->
        <div class="pa-6">
            <AssessmentForm 
                v-model:assessments="assessment"
                title="Consolidated Assessment"
                @save="save"
                @clear="reset"
                :status="status"
            />
        </div>

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

// Dialog state
const showConfirmDialog = ref(false)
const pendingAssessmentData = ref(null)

// Assessment
const assessment = computed(() => {
    return props.consolidated?.assessment || {
        a: '',
        b: '',
        c: '',
        d: ''
    }
})

// Reset functions
const reset = () => {
    assessment.value = {
        a: '',
        b: '',
        c: '',
        d: ''
    }
}

// Save functions
const save = (assessmentData) => {
    pendingAssessmentData.value = assessmentData || assessment.value
    showConfirmDialog.value = true
}

/**
 * Handle confirmation from dialog
 */
const handleConfirmSave = async () => {
    let payload = {
        report_type : 'all',
        report_month : filterStore.reportMonth,
        assessment : pendingAssessmentData.value
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
}
</script>