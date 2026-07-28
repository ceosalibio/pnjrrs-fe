<template>
    <div>
        <div class="mb-6">
            <h1 class="text-h4 font-weight-bold">Report Status Dashboard</h1>
            <p class="text-grey mt-2">Monitor and check the submission status of reports across all units</p>
        </div>
        <div class="mt-4">
            <AppCard class="mb-4">
                <template #default>
                    <div class="d-flex justify-space-between align-center gap-3">
                        <div class="d-flex ga-8">
                            <div class="filter-input-wrapper">
                                <AppAutocomplete 
                                    label="Units"
                                    v-model="filterStore.unit"
                                    :text="'name'"
                                    :value="'id'"
                                    :items="filterStore.organizationFilterItems.units || []"
                                />
                            </div>

                            <div class="filter-input-wrapper">
                                <AppAutocomplete 
                                    label="Report Type"
                                    v-model="reportType"
                                    :text="'text'"
                                    :value="'value'"
                                    :items="reportList"
                                />
                            </div>
                            <div class="filter-input-wrapper">
                                <AppAutocomplete 
                                    label="Status"
                                    v-model="isFinal"
                                    :text="'text'"
                                    :value="'value'"
                                    :items="isFinalList"
                                />
                            </div>
                            
                            <div class="filter-input-wrapper">
                                <AppMonthYearPicker 
                                    v-model="filterStore.reportMonth"
                                />
                            </div>
                            
                            
                        </div>

                        <div class="d-flex ga-2">
                            <AppButton
                                color="warning"
                                @click="handleGenerate()"
                            >
                               GEnerate
                            </AppButton>
                        </div>
                    </div>
                </template>
            </AppCard>

            <!-- Preview Table Section -->
            <AppCard v-if="displayData.length > 0">
                <template #default>
                    <div class="mb-4">
                     
                        <div class="table-responsive">
                            <table class="csv-table">
                                <thead>
                                    <tr>
                                        <th>Unit</th>
                                        <th>SubUnit</th>
                                        <th>Office</th>
                                        <th v-if="isFinal">Readiness</th>
                                        <th v-if="isFinal">RedCon</th>
                                        <th>Status</th>
                                    
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(row, index) in displayData" :key="index">
                                        <td>{{row.unit?.name || '-'}}</td>
                                        <td>{{row.sub_unit?.name || '-'}}</td>
                                        <td>{{row.office?.name || '-'}}</td>
                                        <td v-if="isFinal">{{row.rating || '-'}}</td>
                                        <td v-if="isFinal" :class="red.redStyle(row.redcon)">{{red.redCon(row.redcon) || '-'}}</td>
                                        <td>{{row.is_final ? "Submitted" : "Not Yet Submitted"}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </template>
            </AppCard>

            <!-- Empty State -->
            <AppCard v-else class="text-center py-8">
                <div class="text-grey">
                    <p>Click Generate to view preview</p>
                </div>
            </AppCard>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, watch, computed } from 'vue';
    import { red } from '@/utils/redcon.js'
    import AppCard from '@/components/common/AppCard.vue';
    import AppButton from '@/components/common/AppButton.vue';
    import AppAutocomplete from '@/components/forms/AppAutocomplete.vue';
    import AppMonthYearPicker from '@/components/forms/AppMonthYearPicker.vue';
    import { useFilterStore } from '@/stores/filterStore';
    import { useAppStore } from '@/stores/appStore';
    import { useSnackbar } from '@/composables/useSnackbar.js';
    import { reportStatus } from '@/services/settingService';
    import { getUnits} from '@/services/organizationService'

    const filterStore = useFilterStore();
    const appStore = useAppStore();
    const { showSuccess, showError } = useSnackbar();
    const displayData = ref([]);
    const reportType = ref('personnel');
    const isFinal = ref(false);

    const reportList = [
        {text:'Personnel', value:'personnel'},
        {text:'Training', value:'Training'},
        {text:'Equipment', value:'equipment'},
        {text:'Facility', value:'facility'}
    ]

    const isFinalList = [
        {text:'Submitted', value:true},
        {text:'Not Submitted', value:false},
       
    ]

    // Watch for filter changes to clear display data
    watch(() => filterStore.unit, () => {
        displayData.value = []
    })

    watch(() => filterStore.reportMonth, () => {
        displayData.value = []
    })

    watch(() => reportType, () => {
        displayData.value = []
    }, { deep: true })

    watch(() => isFinal, () => {
        displayData.value = []
    }, { deep: true })

    const handleGenerate = async () =>{
        let payload = {
            report_type : reportType.value,
            is_final : isFinal.value,
            unit_id : filterStore.unit,
            report_month : filterStore.reportMonth,
        }
        const response = await reportStatus(payload)
        console.log(response,'resss')
        displayData.value = response?.data
    }


    

    // Initial load
    onMounted( async () => {
        const result = await getUnits();
        filterStore.organizationFilterItems.units = result?.data || [];
        console.log(filterStore.organizationFilterItems.units)
    });
</script>

<style scoped>
.filter-input-wrapper {
    flex: 1;
    min-width: 300px;
}
.csv-table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
}

.csv-table thead {
    background-color: #3a87f3;
}

.csv-table th,
.csv-table td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: left;
}

.csv-table th {
    font-weight: 600;
    color: #f2efef;
}

.csv-table tbody tr:hover {
    background-color: #f9f9f9;
}

.csv-table th,
.csv-table td {
    border: 1px solid #ddd;
}

.text-center {
    text-align: center;
}

.file-name-display {
    margin-left: 12px;
    color: #666;
}

.table-responsive {
    overflow-x: auto;
}

.metl-cell {
    font-weight: 500;
    background-color: #f9f9f9;
    vertical-align: middle;
}

.editable-input {
    width: 100%;
    padding: 8px;
    border: 1px solid #1976d2;
    border-radius: 4px;
    font-size: 14px;
}

.editable-input:focus {
    outline: none;
    border-color: #1565c0;
    box-shadow: 0 0 4px rgba(25, 118, 210, 0.5);
}
</style>
