<template>
    <div>
        <v-card class="pa-4 mb-4" outlined>
            <div class="d-flex ga-4 flex-wrap justify-space-between">
                <div class="d-flex ga-4 mt-4">
                    <div class="filter-input-wrapper">
                        <AppAutocomplete 
                            label="Units"
                            v-model="formData.unit"
                            :text="'name'"
                            :value="'id'"
                            :items="unitList"
                        />
                    </div>
                    <div class="filter-input-wrapper" v-if="filterStore.organizationFilterItems.subunits?.length > 0 && isHideFields && filterStore.unit">
                        <AppAutocomplete 
                            label="Subunits"
                            v-model="formData.subunit"
                            :text="'name'"
                            :value="'id'"
                            :items="subunitList"
                        />
                    </div>
                    <div class="filter-input-wrapper" v-if="filterStore.organizationFilterItems.offices?.length > 0 && isHideFields">
                        <AppAutocomplete 
                            label="Offices"
                            v-model="formData.office"
                            :text="'name'"
                            :value="'id'"
                            :items="officeList"
                        />
                    </div>
                    <div class="filter-input-wrapper" v-if="filterStore.organizationFilterItems.suboffices?.length > 0 && isHideFields">
                        <AppAutocomplete 
                            label="Suboffices"
                            v-model="formData.suboffice"
                            :text="'name'"
                            :value="'id'"
                            :items="subofficeList"
                        />
                    </div>

                    <div class="filter-input-wrapper" >
                        <AppAutocomplete 
                            label="Divisions"
                            v-model="formData.division"
                            :text="'name'"
                            :value="'id'"
                            :items="divisionList"
                        />
                    </div>

                    <div class="filter-input-wrapper" >
                        <AppTextField 
                            label="Item Name"
                            v-model="formData.item"
                        />
                    </div>

                    <div class="filter-input-wrapper" >
                        <AppTextField 
                            label="Serial /Plate / Asset Tag"
                            v-model="formData.details"
                        />
                    </div>

                    <div 
                        class="filter-input-wrapper"
                        :class="{ 'filter-input-wrapper--compact': !isHideFields }"
                    >
                        <AppMonthYearPicker 
                            v-model="filterStore.reportMonth"
                        />
                    </div>

                    <div>
                        <v-btn color="primary" @click="applyFilter()">
                            Apply Filter
                        </v-btn>
                    </div>
                </div>
                
            </div>
          
        </v-card>
        <div>
            <v-card>
                <div class="card-header-wrapper d-flex justify-space-between align-center">
                    <div>
                        <v-card-title>Equipment Inventory</v-card-title>
                        <v-card-subtitle>Manage and view all equipment inventory records</v-card-subtitle>
                    </div>
                    <div class="total-records">
                        <span class="total-label">Total Records:</span>
                        <span class="total-count">{{ total }}</span>
                    </div>
                </div>
                <v-card-text>
                    <v-table class="data-table">
                        <thead>
                            <tr class="header-row">
                                <th>Unit</th>
                                <th>Subunit</th>
                                <th>Office</th>
                                <!-- <th>Suboffice</th> -->
                                <th>Category</th>
                                <th>Item</th>
                                <th>Serial /Plate / Asset Tag</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="inventory in inventories" :key="inventory.id" class="text-center">
                                <td>{{ inventory.unit?.name }}</td>
                                <td>{{ inventory.sub_unit?.name }}</td>
                                <td>{{ inventory.office?.name ?? '-' }}</td>
                                <!-- <td>{{ inventory.suboffice }}</td> -->
                                <td>{{ inventory.type_name }}</td>
                                <td>{{ inventory.item_name }}</td>
                                <td>{{ inventory.details }}</td>
                            </tr>
                        </tbody>
                            
                            
                    </v-table>
                </v-card-text>
            </v-card>
            <Pagination
                :current-page="current_page"
                :per-page="per_page"
                :total="total"
                @update:currentPage="handlePageChange"
                @update:perPage="handlePerPageChange"
            />
        </div>
    </div>
</template>
<script setup>
    import {computed, ref, onMounted, watch} from 'vue'
    import AppAutocomplete from '@/components/forms/AppAutocomplete.vue';
    import AppTextField from '@/components/forms/AppTextField.vue';
    import AppButton from '@/components/common/AppButton.vue';
    import Pagination from '@/components/common/AppPaginationV2.vue';
    import AppMonthYearPicker from '@/components/forms/AppMonthYearPicker.vue';
    import { useFilterStore } from '@/stores/filterStore.js';
    import { useAuthStore } from '@/stores/authStore.js';
    import { useFilter } from '@/composables/useFilter.js';
    import { useInventory } from '@/composables/useInventory.js';
    const filterStore = useFilterStore();
    const authStore = useAuthStore();
    const { 
        categoryList,
        unitList, 
        subunitList, 
        officeList, 
        subofficeList,
        divisionList,
        fetchDivisionList
        } = useFilter();

    const { 
        loading,
        fetchData,
        current_page,
        per_page,
        total,
        inventories,
     } = useInventory();

    const formData = ref({
        unit: null,
        subunit: null,
        office: null,
        suboffice: null,
        division: null,
        item: null,
        details : null,
        reportMonth: null
    })

    const applyFilter = async () => {
        current_page.value = 1  // Reset to page 1 when applying new filters
        await fetchDataWithFilters()
    }

    const fetchDataWithFilters = async () => {
        const filters = {
            unit_id: formData.value.unit,
            sub_unit_id: formData.value.subunit,
            office_id: formData.value.office,
            sub_office_id: formData.value.suboffice,
            division_id: formData.value.division,
            item_name: formData.value.item,
            details: formData.value.details,
            report_month: filterStore.reportMonth,
            page : current_page.value,
            per_page : per_page.value
        }
        await fetchData(filters)
    }

    // Watch for changes and fetch data
    let isUserTriggered = false
    
    watch([() => current_page.value, () => per_page.value], async () => {
        if (isUserTriggered) {
            await fetchDataWithFilters()
        }
        isUserTriggered = false
    })

    // Set flag when user changes pagination
    const handlePageChange = async (page) => {
        isUserTriggered = true
        current_page.value = page
    }

    const handlePerPageChange = async (perPageValue) => {
        isUserTriggered = true
        per_page.value = perPageValue
        current_page.value = 1  // Reset to page 1 when changing per_page
    }
  
    onMounted(async () => {
        await filterStore.initializeFilterData()
        await fetchDivisionList()
        await fetchDataWithFilters()
    })

   

    const isHideFields = computed(() => {
        if(authStore.user?.role == 1){
            return true
        }
        return false
    })

 

</script>

<style scoped>
.filter-input-wrapper {
    flex: 1;
    min-width: 220px;
}

.filter-input-wrapper--compact {
    flex: 0 0 250px;
    max-width: 250px;
    min-width: 200px;
}

.card-header-wrapper {
    padding: 16px 16px 12px 16px;
    border-bottom: 1px solid #e0e6ed;
}

.total-records {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: linear-gradient(135deg, #f0f4ff 0%, #f8faff 100%);
    border-radius: 6px;
    border: 1px solid #dfe8f5;
}

.total-label {
    font-size: 13px;
    font-weight: 600;
    color: #606266;
}

.total-count {
    font-size: 18px;
    font-weight: 700;
    color: #3d7bff;
}

/* ===== MOBILE RESPONSIVENESS (bago) ===== */
@media (max-width: 768px) {
    .filter-input-wrapper,
    .filter-input-wrapper--compact {
        flex: 1 1 100% !important;
        max-width: 100% !important;
        min-width: 100% !important;
    }

    .card-header-wrapper {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }

    .total-records {
        width: 100%;
    }
}

@media (max-width: 600px) {
    :deep(.pa-4.mb-4) {
        padding: 12px !important;
    }

    :deep(.d-flex.ga-4.flex-wrap.justify-space-between) {
        flex-direction: column;
        align-items: stretch;
    }

    :deep(.d-flex.ga-4.flex-wrap.justify-space-between) > .d-flex.ga-4:first-child {
        flex-direction: column;
        width: 100%;
    }

    :deep(.d-flex.ga-4.flex-wrap.justify-space-between) > .d-flex.ga-4:last-child {
        flex-direction: column;
        width: 100%;
        gap: 8px !important;
    }

    :deep(.d-flex.ga-4.flex-wrap.justify-space-between) > .d-flex.ga-4:last-child > div {
        width: 100%;
    }

    :deep(.d-flex.ga-4.flex-wrap.justify-space-between) > .d-flex.ga-4:last-child button {
        width: 100%;
    }
}

@media (max-width: 480px) {
    :deep(.v-dialog) {
        margin: 12px;
    }
}
</style>