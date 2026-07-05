import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useReportStore = defineStore('report', () => {
    // const personnelReportData = ref([])
    // const personnelItems = ref([])
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

    return {
        // personnelReportData,
        // personnelItems,
        reportData,
        tableItems,
        reportId,
        approver,
        final_approver,
        clearReportData
    }
},
{
    persist: {
        paths: [
            "reportData",
            "tableItems",
            "approver",
            "final_approver",
            
        ],
    },
}

)