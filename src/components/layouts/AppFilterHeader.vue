<template>
    <div>
        <v-card class="pa-4 mb-4" outlined>
            <div class="d-flex ga-4 flex-wrap justify-space-between">
                <div class="d-flex ga-4">
                    <div class="filter-input-wrapper" v-if="isHideFields">
                        <AppAutocomplete 
                            label="Units"
                            v-model="filterStore.unit"
                            :text="'name'"
                            :value="'id'"
                            :items="filterStore.organizationFilterItems.units"
                        />
                    </div>
                    <div class="filter-input-wrapper" v-if="isHideFields">
                        <AppAutocomplete 
                            label="Subunits"
                            v-model="filterStore.subunit"
                            :text="'name'"
                            :value="'id'"
                            :items="filterStore.organizationFilterItems.subunits"
                        />
                    </div>
                    <div class="filter-input-wrapper" v-if="filterStore.organizationFilterItems.offices?.length > 0 && isHideFields">
                        <AppAutocomplete 
                            
                            label="Offices"
                            v-model="filterStore.office"
                            :text="'name'"
                            :value="'id'"
                            :items="filterStore.organizationFilterItems.offices"
                        />
                    </div>
                    <div class="filter-input-wrapper" v-if="filterStore.organizationFilterItems.suboffices?.length > 0 && isHideFields">
                        <AppAutocomplete 
                            
                            label="Suboffices"
                            v-model="filterStore.suboffice"
                            :text="'name'"
                            :value="'id'"
                            :items="filterStore.organizationFilterItems.suboffices"
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
                </div>
                <div class="d-flex ga-4">
                    <div v-if="showGenerate">
                        <AppButton
                            :disabled="isGenerateDisabled"
                            color="warning"
                            @on-click="handleGenerate()"
                        >
                        Generate Report
                        </AppButton>
                    </div>
                    
                    <div v-if="showSubmit && authStore.user?.approver == 0 && reportStore?.tableItems?.length > 0">
                        <AppButton
                            :disabled="reportStore?.reportData?.status > 0"
                            color="success"
                            @on-click="handleSubmit()"
                        >
                            Submit Report
                        </AppButton>
                    </div>

                    <div v-if="showSubmit && authStore.user?.approver > 0">
                        <AppButton
                            :disabled="authStore.user?.approver != reportStore?.reportData?.status"
                            color="success"
                            @on-click="handleSubmit()"
                        >
                            Approved Report
                        </AppButton>
                    </div>
                    <div v-if="showSubmit && authStore.user?.approver > 0">
                        <AppButton
                            :disabled="authStore.user?.approver != reportStore?.reportData?.status"
                            color="red"
                            @on-click="handleDecline()"
                        >
                            Declined Report
                        </AppButton>
                    </div>

                    <!-- <div v-if="showPrint">
                        <AppButton
                            color="primary"
                            @on-click="handlePrint()"

                        >
                            Print Report
                        </AppButton>
                    </div> -->
                </div>
                

                

            </div>
            <div>
                <app-timeline-status 
                    :items="timelineItems"
                    :activeIndex="reportStore?.reportData?.status"
                />
            </div>
           
        </v-card>

        <!-- Submit Confirmation Dialog -->
        <app-dialog
            v-model="showSubmitDialog"
            :title="authStore.user?.approver > 0 ? 'Approve Report' : 'Submit Report'"
            :message="authStore.user?.approver > 0 ? 'Are you sure you want to approve this report?' : 'Are you sure you want to submit this report?'"
            confirm-text="Yes, Submit"
            confirm-color="success"
            @confirm="confirmSubmit"
        />

        <!-- Decline Confirmation Dialog -->
        <v-dialog v-model="showDeclineDialog" max-width="500">
            <v-card>
                <v-card-title class="text-h6">Decline Report</v-card-title>
                <v-divider />
                <v-card-text class="py-4">
                    <p class="mb-3">Please provide a reason for declining this report:</p>
                    <v-textarea
                        v-model="declineReason"
                        label="Reason"
                        placeholder="Enter your reason for declining..."
                        outlined
                        dense
                        rows="4"
                    />
                </v-card-text>
                <v-divider />
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="grey" @click="showDeclineDialog = false">Cancel</v-btn>
                    <v-btn 
                        color="error" 
                        @click="confirmDecline()"
                        :disabled="!declineReason?.trim()"
                    >
                        Decline
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script setup>
    import {computed, ref, onMounted} from 'vue'
    import AppAutocomplete from '../forms/AppAutocomplete.vue';
    import AppButton from '../common/AppButton.vue';
    import AppDialog from '../common/AppDialog.vue';
    import AppTimelineStatus from './AppTimelineStatus.vue';
    import AppMonthYearPicker from '../forms/AppMonthYearPicker.vue';
    import { useFilterStore } from '@/stores/filterStore.js';
    import { useReportStore } from '@/stores/reportStore.js';
    import { useAuthStore } from '@/stores/authStore.js';
    import { executeReportAction  } from '@/services/reportService'
    import { formatToPhilippineTime } from '@/utils/dateFormatter.js'
    import { useSnackbar } from '@/composables/useSnackbar'

    const emit = defineEmits(['generate','submit','print'])
    const filterStore = useFilterStore();
    const reportStore = useReportStore();
    const authStore = useAuthStore();
    const showSubmitDialog = ref(false);
    const showDeclineDialog = ref(false);
    const declineReason = ref('');
    const { showSuccess, showError } = useSnackbar()

    onMounted(async () => {
        // Initialize filter data (categories and units) when component mounts
        await filterStore.initializeFilterData()
    })

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
        reportType : {
            type : String,
            default : "personnel"
        },


    })

    const timelineItems = computed(() => {
        if (!reportStore.approver || reportStore.approver.length === 0) {
            return [];
        }
        
        return reportStore.approver.map((stage) => {
            const userNames = stage.users?.map(u => u.name).join('/ ') || stage.position;
            // Get created_at from actual array (first actual record if it exists)
            const createdAt = stage.actual?.[0]?.created_at;
            // Format to Philippine time
            const philippineTime = createdAt ? formatToPhilippineTime(createdAt) : null;
            
            return {
                label: userNames,
                sublabel: stage.position,
                isDone: reportStore?.reportData?.status > stage.approver, // If timestamp exists, it's done
                ...(philippineTime && { timestamp: philippineTime }),
                declined : stage.declined
            };
        });
    });

    const isGenerateDisabled = computed(() => {
        if (!filterStore.reportMonth) return true;
        if(authStore.user?.role == 1){
             if (!filterStore.unit) return true;
            if (!filterStore.subunit) return true;
            if (filterStore.organizationFilterItems.offices?.length > 0 && !filterStore.office) return true;
            if (filterStore.organizationFilterItems.suboffices?.length > 0 && !filterStore.suboffice) return true;
        }
       
        return false;
    })

    const isHideFields = computed(() => {
        if(authStore.user?.role == 1){
            return true
        }
        return false
    })

    async function handleGenerate() {
       
        emit('generate')
        await reportStore.reportGenerate(props.reportType)
        // let payload
        // reportStore.tableItems = []
        // if(authStore.user?.approver == 1){
        //     payload = filterStore.getGenrateReportPayload()
        // }else{
        //     payload = {
        //         report_month: filterStore.reportMonth,
        //         unit_id: authStore.user?.unit_id,
        //         sub_unit_id: authStore.user?.sub_unit_id,
        //         office_id: authStore.user?.office_id,
        //         sub_office_id: authStore.user?.sub_office_id
        //     }
        // }
        // console.log(payload,'payload')
        // const response = await executeReportAction (payload, props.reportType)
        // reportStore.reportData = response?.data?.report
        // reportStore.tableItems = response?.data?.report?.items || []
        // reportStore.reportId = response?.data?.report?.id
        // reportStore.approver = response?.data?.approver || []
        // reportStore.final_approver = response?.data?.final_approver || null

    }

    async function handleSubmit() {
        showSubmitDialog.value = true
    }

    async function handleDecline() {
        showDeclineDialog.value = true
        declineReason.value = ''
    }

    async function confirmSubmit() {
        // console.log(reportStore.final_approver,authStore.user?.approver)
        let status = authStore.user?.approver + 1;
        emit('submit')
        let payload = {
            status: status,
            is_final:  reportStore.final_approver == authStore.user?.approver ? 1 : 0
        }
        // console.log(reportStore.reportData,'payload')
        if(reportStore.reportData?.assessment == null || reportStore.reportData?.assessment == undefined){
            showError('Please fill out the assessment before submitting the report.')
            return false
        }
        const response = await executeReportAction (payload, props.reportType,'update',reportStore.reportId)
        if(response?.status == "success"){
            await handleGenerate()
            showSubmitDialog.value = false
            showSuccess(status > 1 ? 'Report approved successfully!' : 'Report submitted successfully!')
        }
    }

    async function confirmDecline() {
        if (!declineReason.value?.trim()) {
            showError('Please provide a reason for declining')
            return
        }

        try {
            let status = authStore.user?.approver - 1;
            let payload = {
                status: status, // Declined status
                reason: declineReason.value
            }
            
            const response = await executeReportAction(payload, props.reportType, 'update', reportStore.reportId)
            
            if (response?.status == "success") {
                await handleGenerate()
                showDeclineDialog.value = false
                declineReason.value = ''
                showSuccess('Report declined successfully!')
            } else {
                showError(response?.message || 'Failed to decline report')
            }
        } catch (error) {
            showError(error.message || 'Failed to decline report')
        }
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

.filter-input-wrapper--compact {
    flex: 0 0 250px;   /* fixed width, hindi na "kumakain" ng buong row */
    max-width: 250px;
    min-width: 200px;
}

</style>
