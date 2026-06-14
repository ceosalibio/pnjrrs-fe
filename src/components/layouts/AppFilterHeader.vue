<template>
    <div>
        <v-card class="pa-4 mb-4" outlined>
            <div class="d-flex ga-4 flex-wrap ">
                <div class="filter-input-wrapper">
                    <AppAutocomplete 
                        label="Units"
                        v-model="filterStore.unit"
                        :text="'name'"
                        :value="'id'"
                        :items="filterStore.organizationFilterItems.units"
                    />
                </div>
                <div class="filter-input-wrapper">
                    <AppAutocomplete 
                        label="Subunits"
                        v-model="filterStore.subunit"
                        :text="'name'"
                        :value="'id'"
                        :items="filterStore.organizationFilterItems.subunits"
                    />
                </div>
                <div class="filter-input-wrapper">
                    <AppAutocomplete 
                        label="Offices"
                        v-model="filterStore.office"
                        :text="'name'"
                        :value="'id'"
                        :items="filterStore.organizationFilterItems.offices"
                    />
                </div>
                <div class="filter-input-wrapper">
                    <AppAutocomplete 
                        label="Suboffices"
                        v-model="filterStore.suboffice"
                        :text="'name'"
                        :value="'id'"
                        :items="filterStore.organizationFilterItems.suboffices"
                    />
                </div>

                <div class="filter-input-wrapper">
                    <AppMonthYearPicker 
                        v-model="filterStore.reportMonth"
                    />
                </div>

                <AppButton
                    color="warning"
                >
                    Generate Report
                </AppButton>

                <AppButton
                    color="success"
                >
                    Submit Report
                </AppButton>

                <AppButton
                    color="primary"
                >
                    Print Report
                </AppButton>

            </div>
            <div>
                <app-timeline-status 
                    :items="[
                        { label: 'ADM ARCEO SALIBIO PN', sublabel: 'ENCODER/DRAFTER', timestamp: '2025-06-04 19:30:41' },
                        { label: 'OIC CONCURRING' },
                        { label: 'EX-O CONCURRING' },
                        { label: 'DEPUTY CONCURRING' },
                        { label: 'AC OF NS FOR OPERATIONS N3' }
                    ]"
                    :activeIndex="0"
                    />
            </div>
           
        </v-card>
    </div>
</template>
<script setup>
    import AppAutocomplete from '../forms/AppAutocomplete.vue';
    import AppButton from '../common/AppButton.vue';
    import AppTimelineStatus from './AppTimelineStatus.vue';
    import AppMonthYearPicker from '../forms/AppMonthYearPicker.vue';
    import { useFilterStore } from '@/stores/filterStore.js';

    const filterStore = useFilterStore();
</script>

<style scoped>
.filter-input-wrapper {
    flex: 1;
    min-width: 180px;
}
</style>
