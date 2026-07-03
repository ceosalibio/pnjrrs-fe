import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useReportStore = defineStore('report', () => {
    const personnelReportData = ref([])
    const personnelItems = ref([])
    const reportId = ref(null)
    const approver = ref([])

    return {
        personnelReportData,
        personnelItems,
        reportId,
        approver
    }
},
{
    persist: {
        paths: [
            "personnelReportData",
            "personnelItems",
            "approver"
            
        ],
    },
}

)