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
                <AppButton
                    color="primary"
                    :variant="'elevated'"
                    :size="'md'"
                >
                    Print Report
                </AppButton>

            </div>
        </v-card>
    </div>
</template>
<script setup>
    import AppAutocomplete from '../forms/AppAutocomplete.vue';
    import AppButton from '../common/AppButton.vue';
    import AppTextField from '../forms/AppTextField.vue';

    defineProps({
        withYear : {
            type : Boolean,
            default : false
        }
    }) 
</script>

<style scoped>
.filter-input-wrapper {
    flex: 1;
    min-width: 180px;
}
</style>
