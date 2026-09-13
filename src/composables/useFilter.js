import { useFilterStore } from '@/stores/filterStore'
import { ref, computed } from 'vue'
import { getDivisionList} from '@/services/settingService'
export const useFilter = () => {
    const filterStore = useFilterStore()
    const divisionList = ref([{ name: 'ALL', id: null }])
    const categoryList = computed(() => {
        const categories = filterStore.organizationFilterItems.categories || []
        return [{ name: 'ALL', id: null }, ...categories]
    })
    const unitList = computed(() => {
        const units = filterStore.organizationFilterItems.units || []
        return [{ name: 'ALL', id: null }, ...units]
    })
    const subunitList = computed(() => {
        const subunits = filterStore.organizationFilterItems.subunits || []
        return [{ name: 'ALL', id: null }, ...subunits]
    })
    const officeList = computed(() => {
        const offices = filterStore.organizationFilterItems.offices || []
        return [{ name: 'ALL', id: null }, ...offices]
    })
    const subofficeList = computed(() => {
        const suboffices = filterStore.organizationFilterItems.suboffices || []
        return [{ name: 'ALL', id: null }, ...suboffices]
    })

    const fetchDivisionList = async () => {
        try {
            const response = await getDivisionList()
            const divisions = response?.data || []
            divisionList.value = [{ name: 'ALL', id: null }, ...divisions]
        } catch (error) {
            console.error('Error fetching division list:', error)
        }
    }


    return {
        categoryList,
        unitList,
        subunitList,
        officeList,
        subofficeList,
        divisionList,
        fetchDivisionList
    }
}