<template>
    <div>
        <div>
            <h2 class="text-h5">Organization Management</h2>
            <p class="text-body-1 text-grey">Manage organizational structure, including categories, units, sub-units, offices, and sub-offices.</p>
        </div>
        <v-card class="mt-4">
            <v-tabs
                v-model="activeTab"
                bg-color="primary"
            >
                <v-tab value="categories">Categories</v-tab>
                <v-tab value="units">Units</v-tab>
                <v-tab value="subunits">Sub Units</v-tab>
                <v-tab value="offices">Offices</v-tab>
                <v-tab value="suboffices">Sub Offices</v-tab>
            </v-tabs>

            <v-window v-model="activeTab" class="pa-4">
                <v-window-item value="categories">
                    <CategoriesCrud />
                </v-window-item>
                <v-window-item value="units">
                    <UnitsCrud />
                </v-window-item>
                <v-window-item value="subunits">
                    <SubUnitsCrud />
                </v-window-item>
                <v-window-item value="offices">
                    <OfficesCrud />
                </v-window-item>
                <v-window-item value="suboffices">
                    <SubOfficesCrud />
                </v-window-item>
            </v-window>
        </v-card>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import CategoriesCrud from '@/components/organization/CategoriesCrud.vue';
    import UnitsCrud from '@/components/organization/UnitsCrud.vue';
    import SubUnitsCrud from '@/components/organization/SubUnitsCrud.vue';
    import OfficesCrud from '@/components/organization/OfficesCrud.vue';
    import SubOfficesCrud from '@/components/organization/SubOfficesCrud.vue';

    const activeTab = ref('categories');
</script>
