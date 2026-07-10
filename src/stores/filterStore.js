import { defineStore } from 'pinia'
import { ref, watch, onMounted, nextTick } from 'vue'
import { getCategories, getUnits, getSubUnits, getOffices, getSubOffices } from '@/services/organizationService'
import { useReportStore } from './reportStore';

export const useFilterStore = defineStore('filter', () => {
    const reportStore = useReportStore()
    const search = ref('')
    const category = ref('')
    const unit = ref('')
    const subunit = ref('')
    const office = ref('')
    const suboffice = ref('')
    const reportMonth = ref('')
    const organizationFilterItems = ref({})

    // Guard flag para hindi ma-trigger ang reset/cascade logic
    // habang nire-restore pa lang ng pinia-persist ang naka-save na state
    const isHydrating = ref(true)

    watch(() => category.value, async (newCategory, oldCategory) => {
        if (isHydrating.value) return

        if (newCategory !== oldCategory && newCategory !== '' && newCategory != null) {
            unit.value = ''
            subunit.value = ''
            office.value = ''
            suboffice.value = ''
            const result = await getUnits(1, null, newCategory)
            organizationFilterItems.value.units = result.data
        }
    }, { immediate: false })

    watch(() => unit.value, async (newUnit, oldUnit) => {
        if (isHydrating.value) return

        if (newUnit !== oldUnit && newUnit !== '' && newUnit != null) {
            subunit.value = ''
            office.value = ''
            suboffice.value = ''
            if (reportStore) {
                reportStore.reportData = []
                reportStore.tableItems = []
            }
            const result = await getSubUnits(1, null, newUnit)
            organizationFilterItems.value.subunits = result.data
        }
    }, { immediate: false })

    watch(() => subunit.value, async (newSubUnit, oldSubUnit) => {
        if (isHydrating.value) return

        if (newSubUnit !== oldSubUnit && newSubUnit !== '' && newSubUnit != null) {
            office.value = ''
            suboffice.value = ''
            if (reportStore) {
                reportStore.reportData = []
                reportStore.tableItems = []
            }
            const result = await getOffices(1, null, newSubUnit)
            organizationFilterItems.value.offices = result.data
        }
    }, { immediate: false })

    watch(() => office.value, async (newOffice, oldOffice) => {
        if (isHydrating.value) return

        if (newOffice !== oldOffice && newOffice !== '' && newOffice != null) {
            suboffice.value = ''
            if (reportStore) {
                reportStore.reportData = []
                reportStore.tableItems = []
            }
            const result = await getSubOffices(1, null, newOffice)
            organizationFilterItems.value.suboffices = result.data
        }
    }, { immediate: false })

    onMounted(async () => {
        // Kapag walang naka-save na options sa categories, kunin ang default list
        if (!organizationFilterItems.value.categories) {
            const categoryResult = await getCategories()
            organizationFilterItems.value.categories = categoryResult.data
        }

        // Igalang ang naka-restore na category kapag nagfetch ng units,
        // para hindi ma-overwrite ng unfiltered/page-1 list ang tamang selection
        if (category.value) {
            const result = await getUnits(1, null, category.value)
            organizationFilterItems.value.units = result.data
        } else if (!organizationFilterItems.value.units || organizationFilterItems.value.units.length === 0) {
            const result = await getUnits()
            organizationFilterItems.value.units = result.data
        }

        // Hintayin ang susunod na DOM tick para tiyak na tapos na
        // ang restore ng pinia-persist bago patayin ang guard
        await nextTick()
        isHydrating.value = false
    })

    const initializeFilterData = async () => {
        // Fetch categories if not already loaded
        if (!organizationFilterItems.value.categories || organizationFilterItems.value.categories.length === 0) {
            const categoryResult = await getCategories()
            organizationFilterItems.value.categories = categoryResult.data
        }

        // Igalang din dito ang naka-restore na category, kung meron
        if (category.value) {
            const result = await getUnits(1, null, category.value)
            organizationFilterItems.value.units = result.data
        } else if (!organizationFilterItems.value.units || organizationFilterItems.value.units.length === 0) {
            const result = await getUnits()
            organizationFilterItems.value.units = result.data
        }

        // Ensure hydration is complete
        await nextTick()
        isHydrating.value = false
    }

    // Build filter payload for API requests
    const getGenrateReportPayload = () => ({
        category_id: category.value || null,
        unit_id: unit.value || null,
        sub_unit_id: subunit.value || null,
        office_id: office.value || null,
        sub_office_id: suboffice.value || null,
        report_month: reportMonth.value || null,
    })

    const clearFilterData = () => {
        search.value = ''
        category.value = ''
        unit.value = ''
        subunit.value = ''
        office.value = ''
        suboffice.value = ''
        reportMonth.value = ''
        organizationFilterItems.value = {}
    }

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
        getGenrateReportPayload,
        clearFilterData,
        initializeFilterData
    };

},
{
    persist: {
        paths: [
            "category",
            "unit",
            "subunit",
            "office",
            "suboffice",
            "reportMonth",
            "organizationFilterItems"
        ],
    },
}

);