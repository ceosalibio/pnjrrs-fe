<template>
    <div>
        <v-card class="pa-4 mb-4" outlined>
            <div class="d-flex ga-4 flex-wrap ">
                <div class="filter-input-wrapper">
                    <AppAutocomplete 
                        label="Units"
                    />
                </div>
                <div class="filter-input-wrapper">
                    <AppAutocomplete 
                        label="Subunits"
                    />
                </div>
                <div class="filter-input-wrapper">
                    <AppAutocomplete 
                        label="Offices"
                    />
                </div>

                <div class="filter-input-wrapper">
                    <AppMonthYearPicker />
                </div>

                <AppButton
                    color="warning"
                    :variant="'elevated'"
                    :size="'small'"
                    class="mt-2"
                >
                    Generate Report
                </AppButton>

                <AppButton
                    color="success"
                    :variant="'elevated'"
                    :size="'small'"
                    class="mt-2"
                >
                    Submit Report
                </AppButton>

                <AppButton
                    color="primary"
                    :variant="'elevated'"
                    :size="'small'"
                    class="mt-2"
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
</script>

<style scoped>
.filter-input-wrapper {
    flex: 1;
    min-width: 180px;
}
</style>
