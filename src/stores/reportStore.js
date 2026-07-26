import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore.js';
import { useFilterStore } from '@/stores/filterStore.js';
import { executeReportAction  } from '@/services/reportService'
import { useSnackbar } from '@/composables/useSnackbar'

export const useReportStore = defineStore('report', () => {
    // const personnelReportData = ref([])
    // const personnelItems = ref([])
    const filterStore = useFilterStore();
    const authStore = useAuthStore();
    const reportData = ref([])
    const tableItems = ref([])
    const reportId = ref(null)
    const approver = ref([])
    const final_approver = ref(null)

    const clearReportData = () => {
        // personnelReportData.value = []
        // personnelItems.value = []
        reportData.value = []
        tableItems.value = []
        reportId.value = null
        approver.value = []
        final_approver.value = null
    }

    const reportGenerate = async (reportType) =>{
        const { showSuccess, showError, showLoading } = useSnackbar()
        let payload
        tableItems.value = []
        
        try {
            if(authStore.user?.role == 1){
                payload = filterStore.getGenrateReportPayload()
            }else{
                payload = {
                    report_month: filterStore.reportMonth,
                    category_id: authStore.user?.category_id,
                    unit_id: authStore.user?.unit_id,
                    sub_unit_id: authStore.user?.sub_unit_id,
                    office_id: authStore.user?.office_id,
                    sub_office_id: authStore.user?.sub_office_id
                }
            }
            console.log(payload,'payload')
            
            const response = await executeReportAction (payload, reportType)
            console.log(response,'response')
            if(response?.data?.report) {
                reportData.value = response?.data?.report
                tableItems.value = response?.data?.report?.items || []
                reportId.value = response?.data?.report?.id
                approver.value = response?.data?.approver || []
                final_approver.value = response?.data?.final_approver || null
                
                showSuccess(`${reportType} report generated successfully`)
            } else {

                showError(response?.message || 'Failed to generate report: Invalid response data')
            }
        } catch (error) {
            console.log(error)
            console.error('Error generating report:', error)
            showError(error?.response?.data?.message || `Failed to generate ${reportType} report`)
            
            // Clear data on error
            reportData.value = []
            tableItems.value = []
            reportId.value = null
            approver.value = []
            final_approver.value = null
        }
    }

    return {
        // personnelReportData,
        // personnelItems,
        reportData,
        tableItems,
        reportId,
        approver,
        final_approver,
        clearReportData,
        reportGenerate
    }
},
// {
//     persist: {
//         paths: [
//             "reportData",
//             "tableItems",
//             "approver",
//             "final_approver",
            
//         ],
//     },
// }

)