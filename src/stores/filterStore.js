import { defineStore } from 'pinia'
import { ref, watch, onMounted } from 'vue'
import { getCategories, getUnits,  getSubUnits, getOffices, getSubOffices  } from '@/services/organizationService'
export const useFilterStore = defineStore('filter', () => {
    const search = ref('')
    const category = ref('')
    const unit = ref('')
    const subunit = ref('')
    const office = ref('')
    const suboffice = ref('')
    const reportMonth = ref('')
    const organizationFilterItems = ref({})


    watch(() => category.value, async (newCategory) => {
        if (newCategory !== '' && newCategory != null) {
            unit.value = ''
            subunit.value = ''
            office.value = ''
            suboffice.value = ''
            const result = await getUnits(1,null,newCategory)
            organizationFilterItems.value.units = result.data
        }
    })

    watch(() => unit.value, async (newUnit) => {
        if (newUnit !== '' && newUnit != null) {
            subunit.value = ''
            office.value = ''
            suboffice.value = ''
            const result = await getSubUnits(1,null,newUnit)
            organizationFilterItems.value.subunits = result.data
        }
    })

    watch(() => subunit.value, async (newSubUnit) => {
        if (newSubUnit !== '' && newSubUnit != null) {
            office.value = ''
            suboffice.value = ''
            const result = await getOffices(1,null,newSubUnit)
            organizationFilterItems.value.offices = result.data
        }
    })

    watch(() => office.value, async (newOffice) => {
        console.log('Office changed to:', newOffice)
        if (newOffice !== '' && newOffice != null) {
            suboffice.value = ''
            console.log('Fetching suboffices for office:', newOffice)
            const result = await getSubOffices(1,null,newOffice)
            organizationFilterItems.value.suboffices = result.data
        }
    })

    onMounted(async () => {
        const categoryResult = await getCategories()
        organizationFilterItems.value.categories = categoryResult.data
        const result = await getUnits()
        organizationFilterItems.value.units = result.data
    })

    // Build filter payload for API requests
    const getGenrateReportPayload = () => ({
        category_id: category.value || null,
        unit_id: unit.value || null,
        sub_unit_id: subunit.value || null,
        office_id: office.value || null,
        sub_office_id: suboffice.value || null,
        report_month: reportMonth.value || null,
    })

    return {
        search,
        category,
        unit,
        subunit,
        office,
        suboffice,
        reportMonth,
        getSubOffices,
        getOffices,
        getSubUnits,
        organizationFilterItems,
        getGenrateReportPayload
    }
})