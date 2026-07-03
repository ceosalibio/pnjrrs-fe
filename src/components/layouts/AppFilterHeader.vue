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
                <div class="filter-input-wrapper" v-if="filterStore.organizationFilterItems.offices?.length > 0">
                    <AppAutocomplete 
                        
                        label="Offices"
                        v-model="filterStore.office"
                        :text="'name'"
                        :value="'id'"
                        :items="filterStore.organizationFilterItems.offices"
                    />
                </div>
                <div class="filter-input-wrapper" v-if="filterStore.organizationFilterItems.suboffices?.length > 0">
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
                <div v-if="showGenerate">
                    <AppButton
                       
                        color="warning"
                        @on-click="handleGenerate()"
                    >
                    Generate Report
                    </AppButton>
                </div>
                
                <div v-if="showSubmit">
                    <AppButton
                        color="success"
                        @on-click="handleSubmit()"
                    >
                        Submit Report
                    </AppButton>
                </div>

                <div v-if="showPrint">
                    <AppButton
                        color="primary"
                        @on-click="handlePrint()"

                    >
                        Print Report
                    </AppButton>
                </div>

                

            </div>
            <div>
                <app-timeline-status 
                    :items="timelineItems"
                    :activeIndex="0"
                    />
            </div>
           
        </v-card>
    </div>
</template>
<script setup>
    import {computed} from 'vue'
    import AppAutocomplete from '../forms/AppAutocomplete.vue';
    import AppButton from '../common/AppButton.vue';
    import AppTimelineStatus from './AppTimelineStatus.vue';
    import AppMonthYearPicker from '../forms/AppMonthYearPicker.vue';
    import { useFilterStore } from '@/stores/filterStore.js';
    import { useReportStore } from '@/stores/reportStore.js';

    const emit = defineEmits(['generate','submit','print'])
    const filterStore = useFilterStore();
    const reportStore = useReportStore();

    const props = defineProps({
        showGenerate : {
            type : Boolean,
            default : true
        },
        showSubmit : {
            type : Boolean,
            default : true
        },
        showPrint : {
            type : Boolean,
            default : true
        },

    })

    const timelineItems = computed(() => {
        if (!reportStore.approver || reportStore.approver.length === 0) {
            return [];
        }
        
        return reportStore.approver.map((stage) => {
            const userNames = stage.users?.map(u => u.name).join('/ ') || stage.position;
            return {
                label: userNames,
                sublabel: stage.position,
                ...(stage.users?.[0]?.timestamp && { timestamp: stage.users[0].timestamp })
            };
        });
    });

    const isGenerateDisabled = computed(() => {
        if (!filterStore.reportMonth) return true;
        if (!filterStore.unit) return true;
        if (!filterStore.subunit) return true;
        if (filterStore.organizationFilterItems.offices?.length > 0 && !filterStore.office) return true;
        if (filterStore.organizationFilterItems.suboffices?.length > 0 && !filterStore.suboffice) return true;
        return false;
    })

    function handleGenerate() {
        emit('generate')
    }

    function handleSubmit() {
        emit('submit')
    }

    function handlePrint() {
        emit('print')
    }
</script>

<style scoped>
.filter-input-wrapper {
    flex: 1;
    min-width: 180px;
}
</style>
