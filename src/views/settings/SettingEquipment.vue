<template>
    <div>
        <AppSettingHeader 
            :showGenerate="true"
            @generate="handleGenerate()"
        />
        <div class="mt-4">
            <AppCard>
                <template #default>
                    <div class="d-flex ga-2 justify-end">
                        <!-- Update Button (Always visible when data loaded) -->
                        <AppButton
                            v-if="displayData?.length > 0 && !isEditMode"
                            @click="isEditMode = true"
                            color="primary"
                        >
                            Update
                        </AppButton>

                        <!-- Save & Clear Buttons (Only visible when in edit mode) -->
                        <template v-if="isEditMode">
                            <AppButton
                                @click="handleSave"
                                color="success"
                                :loading="isSaving"
                            >
                                Save
                            </AppButton>
                            <AppButton
                                @click="handleClear"
                                color="grey"
                            >
                                Cancel
                            </AppButton>
                        </template>
                    </div>

                    <div class="table-responsive mt-4">
                        <table class="csv-table">
                            <thead>
                                <tr>
                                    <th>Description</th>
                                    <th width="30%">TE2019</th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-if="displayData.length === 0">
                                    <tr>
                                        <td colspan="2" class="text-center text-grey">
                                            No data to display. Click "Generate" to load settings.
                                        </td>
                                    </tr>
                                </template>

                                <template v-for="category in displayData" :key="`cat-${category.category_id}`">
                                    <!-- Category Header -->
                                    <tr class="category-row">
                                        <td colspan="2">{{ category.category_name }}</td>
                                    </tr>

                                    <template v-for="division in category.divisions" :key="`div-${division.division_id}`">
                                        <!-- Division Header with Add Type -->
                                        <tr class="division-row">
                                            <td colspan="2">
                                                <div class="d-flex align-center justify-space-between">
                                                    <span>{{ division.division_name }}</span>
                                                    <AppButton
                                                        v-if="isEditMode"
                                                        size="small"
                                                        color="primary"
                                                        @click="handleAddType(division)"
                                                        variant="outlined"
                                                    >
                                                        <v-icon>
                                                            mdi-plus
                                                        </v-icon>
                                                    </AppButton>
                                                </div>
                                            </td>
                                        </tr>

                                        <template v-for="type in division.types" :key="`type-${type.type_id}`">
                                            <!-- Type Header with Add Item / Delete Type -->
                                            <tr class="type-row">
                                                <td colspan="2">
                                                    <div class="d-flex align-center justify-space-between">
                                                        <input
                                                            v-if="type.isNew"
                                                            type="text"
                                                            v-model="type.type_name"
                                                            placeholder="Enter type name"
                                                            class="type-name-input"
                                                            :disabled="!isEditMode"
                                                        />
                                                        <span v-else>{{ type.type_name }}</span>

                                                        <div class="d-flex ga-1">
                                                            <AppButton
                                                                v-if="isEditMode"
                                                                size="small"
                                                                color="primary"
                                                                @click="handleAddItem(type)"
                                                                variant="outlined"
                                                            
                                                            >
                                                                <v-icon>
                                                                    mdi-plus
                                                                </v-icon>
                                                            </AppButton>
                                                            <AppButton
                                                                v-if="isEditMode"
                                                                size="small"
                                                                color="red"
                                                                @click="handleDeleteType(division, type)"
                                                                variant="outlined"
                                                                :disabled="!isEditMode"
                                                            >
                                                                <v-icon>
                                                                    mdi-delete-outline
                                                                </v-icon>
                                                            </AppButton>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>

                                            <!-- Items -->
                                            <tr v-for="item in type.items" :key="`item-${item.id}`">
                                                <td class="item-description">
                                                    <input
                                                        v-if="item.isNew"
                                                        type="text"
                                                        v-model="item.name"
                                                        placeholder="Enter item name"
                                                        class="item-name-input"
                                                        :disabled="!isEditMode"
                                                    />
                                                    <span v-else>{{ item.name }}</span>
                                                </td>
                                                <td>
                                                    <div class="d-flex align-center ga-2">
                                                        <input
                                                            v-if="isEditMode"
                                                            type="text"
                                                            inputmode="numeric"
                                                            v-model="item.required"
                                                            @input="handleNumberInput(item, $event)"
                                                            class="te-input"
                                                        />
                                                        <span v-else>{{item.required}}</span>
                                                        <AppButton
                                                            v-if="isEditMode"
                                                            size="small"
                                                            color="red"
                                                            @click="handleDeleteItem(type, item)"
                                                            variant="outlined"
                                                            :disabled="!isEditMode"
                                                        >
                                                            <v-icon>
                                                                mdi-delete-outline
                                                            </v-icon>
                                                        </AppButton>
                                                    </div>
                                                </td>
                                            </tr>
                                        </template>
                                    </template>
                                </template>
                            </tbody>
                        </table>
                    </div>
                </template>
            </AppCard>
        </div>

    </div>
</template>
<script setup>
    import { ref, computed } from 'vue'
    import AppSettingHeader from '@/components/layouts/AppSettingHeader.vue';
    import AppCard from '@/components/common/AppCard.vue';
    import AppButton from '@/components/common/AppButton.vue';
    import { useFilterStore } from '@/stores/filterStore'; 
    import { useSnackbar } from '@/composables/useSnackbar';
    import { 
        getEquipmentTempSettings, 
        getEquipmentSettings,
        saveEquipmentSettings,
        updateEquipmentSettings

    } from '@/services/settingService'

    const filterStore = useFilterStore()
    const { showSuccess, showError } = useSnackbar()
    
    const displayData = ref([])
    const isExist = ref(false)
    const id = ref(null)
    const isSaving = ref(false)
    const isEditMode = ref(false)

    const params = computed(() => {
        return {
            unit_id: filterStore.unit,
            sub_unit_id: filterStore.subunit,
            office_id: filterStore.office,
            sub_office_id: filterStore.suboffice,
        }
    })

    const handleGenerate = async () => {
        displayData.value = [];
        try {
            const list = await getEquipmentSettings(params.value);
            if (list?.data?.length > 0) {
                displayData.value = list.data[0]?.items ?? [];
                id.value = list.data[0]?.id ?? []
                isExist.value = true
                return;
            }
            const response = await getEquipmentTempSettings();
            displayData.value = response?.data ?? [];
        } catch (error) {
            console.error("Failed to generate equipment settings:", error);
        }
    };

    // Generates a unique-enough temporary ID for newly added rows
    const generateTempId = () => `temp-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    // ── Division: Add Type ───────────────────────────────────────────
    // Adds a new blank Type under this division. Starts with one blank item
    // so the type isn't shown with zero rows underneath it.
    const handleAddType = (division) => {
        const newTypeId = generateTempId();
        const newItemId = generateTempId();

        division.types.push({
            type_id: newTypeId,
            type_name: "",
            isNew: true,
            items: [
                {
                    id: newItemId,
                    name: "",
                    required: "",
                    isNew: true,
                },
            ],
        });
    };

    // ── Type: Delete ───────────────────────────────────────────────────
    // Removes the whole type (and its items) from division.types
    const handleDeleteType = (division, type) => {
        const confirmed = confirm(
            `Delete "${type.type_name || 'this type'}" and all its items?`
        );
        if (!confirmed) return;

        const index = division.types.findIndex((t) => t.type_id === type.type_id);
        if (index !== -1) {
            division.types.splice(index, 1);
        }
    };

    // ── Type: Add Item ───────────────────────────────────────────────────
    // Adds a new blank Item (editable name + required) to type.items
    const handleAddItem = (type) => {
        const newItemId = generateTempId();
        type.items.push({
            id: newItemId,
            name: "",
            required: "",
            isNew: true,
        });
    };

    // ── Item: Delete ───────────────────────────────────────────────────
    const handleDeleteItem = (type, item) => {
        const confirmed = confirm(`Delete "${item.name || 'this item'}"?`);
        if (!confirmed) return;

        const index = type.items.findIndex((i) => i.id === item.id);
        if (index !== -1) {
            type.items.splice(index, 1);
        }
    };

    // ── Item: Number-only input for "required" field ────────────────────
    const handleNumberInput = (item, event) => {
        const raw = event.target.value;
        const sanitized = raw.replace(/[^0-9]/g, "");
        item.required = sanitized;
        event.target.value = sanitized;
    };




    // 
    const handleSave = async () => {
        isSaving.value = true
        try {
            let response
            
            if (!isExist.value) {
                const payload = {
                    ...params.value,
                    items: displayData.value
                }
                response = await saveEquipmentSettings(payload)
            } else {
                const payload = {
                    items: displayData.value
                }
                response = await updateEquipmentSettings(id.value, payload)
            }
            
            if (response?.status === 'success') {
                showSuccess('Equipment settings saved successfully')
                isEditMode.value = false
                displayData.value = []
                isExist.value = false
                id.value = null
               await handleGenerate()
            } else {
                showError(response?.message || 'Failed to save equipment settings')
            }
        } catch (error) {
            console.error('Error saving equipment settings:', error)
            showError(error?.response?.data?.message || 'An error occurred while saving')
        } finally {
            isSaving.value = false
        }
    }

    // Clear/Cancel edit mode
    const handleClear = () => {
        const confirmed = confirm('Are you sure you want to cancel editing? All unsaved changes will be lost.')
        if (!confirmed) return
        
        isEditMode.value = false
        displayData.value = []
        isExist.value = false
        id.value = null
    }
</script>
<style scoped>
    .table-responsive {
        overflow-x: auto;
    }

    .csv-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.9rem;
    }

    .csv-table thead {
        background-color: #f5f5f5;
    }

    .csv-table th,
    .csv-table td {
        padding: 12px;
        border: 1px solid #ddd;
        text-align: left;
    }

    .csv-table th {
        font-weight: 600;
        background-color: #f5f5f5;
    }

    .csv-table tbody tr:hover {
        background-color: #f9f9f9;
    }

    .csv-table tbody tr:nth-child(even) {
        background-color: #fafafa;
    }

    /* Hierarchy styling */
    .category-row td {
        background-color: #1E3A5F;
        color: #ffffff;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.03em;
    }

    .division-row td {
        background-color: #d6e4f0;
        font-weight: 700;
        padding-left: 20px;
    }

    .type-row td {
        background-color: #eef3f8;
        font-weight: 600;
        font-style: italic;
        padding-left: 32px;
    }

    .item-description {
        padding-left: 44px;
    }

    .te-input {
        width: 100%;
        padding: 4px 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    .type-name-input,
    .item-name-input {
        padding: 4px 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        width: 100%;
    }

    .type-name-input {
        font-style: normal;
        font-weight: 600;
        flex: 1;
        margin-right: 8px;
    }
</style>