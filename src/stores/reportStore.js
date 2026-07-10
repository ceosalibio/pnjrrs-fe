import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore.js';
import { useFilterStore } from '@/stores/filterStore.js';
import { executeReportAction  } from '@/services/reportService'

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
        let payload
        tableItems.value = []
        if(authStore.user?.approver == 1){
            payload = filterStore.getGenrateReportPayload()
        }else{
            payload = {
                report_month: filterStore.reportMonth,
                unit_id: authStore.user?.unit_id,
                sub_unit_id: authStore.user?.sub_unit_id,
                office_id: authStore.user?.office_id,
                sub_office_id: authStore.user?.sub_office_id
            }
        }
        console.log(payload,'payload')
        const response = await executeReportAction (payload, reportType)
        reportData.value = response?.data?.report
        tableItems.value = response?.data?.report?.items || []
        reportId.value = response?.data?.report?.id
        approver.value = response?.data?.approver || []
        final_approver.value = response?.data?.final_approver || null
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
{
    persist: {
        paths: [
            "reportData",
            // "tableItems",
            "approver",
            "final_approver",
            
        ],
    },
}

)