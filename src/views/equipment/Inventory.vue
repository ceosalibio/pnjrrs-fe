<template>
    <div>
        <v-card class="pa-4 mb-4" outlined>
            <div class="d-flex ga-4 flex-wrap justify-space-between">
                <div class="d-flex ga-4">
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
                
            </div>
          
        </v-card>
    </div>
</template>
<script setup>
    import {computed, ref, onMounted} from 'vue'
    import AppAutocomplete from '@/components/forms/AppAutocomplete.vue';
    import AppButton from '@/components/common/AppButton.vue';
    import AppMonthYearPicker from '@/components/forms/AppMonthYearPicker.vue';
    import { useFilterStore } from '@/stores/filterStore.js';
    import { useAuthStore } from '@/stores/authStore.js';

    const filterStore = useFilterStore();
    const authStore = useAuthStore();
  
    onMounted(async () => {
        await filterStore.initializeFilterData()
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
    min-width: 180px;
}

.filter-input-wrapper--compact {
    flex: 0 0 250px;
    max-width: 250px;
    min-width: 200px;
}

/* ===== MOBILE RESPONSIVENESS (bago) ===== */
@media (max-width: 768px) {
    .filter-input-wrapper,
    .filter-input-wrapper--compact {
        flex: 1 1 100% !important;
        max-width: 100% !important;
        min-width: 100% !important;
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