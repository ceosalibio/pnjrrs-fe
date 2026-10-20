<template>
    <div>
        <AppSettingHeader 
            :showGenerate="true"
            :hideFilter="true"
            :hideOffice="true"
            @generate="handleGenerate()"
        />
        <div class="mt-4">
            <AppCard>
                <template #default>
                    <!-- OLD: <div class="d-flex ga-2 justify-end"> -->
                    <div class="d-flex ga-2 justify-space-between align-center">
                    <!-- CSV Upload (same pattern as SettingFacility) -->
                    <div class="d-flex ga-2 align-center">
                        <input
                            ref="fileInput"
                            type="file"
                            accept=".csv"
                            style="display: none"
                            @change="handleFileChange"
                        />
                        <AppButton
                            @click="triggerFileInput"
                            color="primary"
                            :disabled="isExist || displayData?.length > 0"
                        >
                            📁 Choose CSV File
                        </AppButton>
                        <span v-if="fileName" class="text-truncate file-name-display">
                            📄 {{ fileName }}
                        </span>
                    </div>

                    <div class="d-flex ga-2">
                        <!-- Update Button (Always visible when data loaded) -->
                        <AppButton
                            v-if="displayData?.length > 0 && !isEditMode"
                            @click="isEditMode = true"
                            color="primary"
                        >
                            Update
                        </AppButton>

                        <!-- Delete Button (Only for saved settings) -->
                        <AppButton
                            v-if="isExist && !isEditMode"
                            @click="handleDeleteAll"
                            color="red"
                            :loading="isDeleting"
                        >
                            Delete
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
                                            <!-- OLD: No data to display. Click "Generate" to load settings. -->
                                            No data to display. Click "Generate" to load settings, or upload a CSV file.
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
import { getErrorMessage } from '@/utils/errorHandler'
    import { ref, computed, watch } from 'vue'
    import AppSettingHeader from '@/components/layouts/AppSettingHeader.vue';
    import AppCard from '@/components/common/AppCard.vue';
    import AppButton from '@/components/common/AppButton.vue';
    import { useFilterStore } from '@/stores/filterStore'; 
    import { useSnackbar } from '@/composables/useSnackbar';
    import {
        // OLD: getEquipmentTempSettings, (replaced by CSV upload)
        getEquipmentSettings,
        saveEquipmentSettings,
        updateEquipmentSettings,
        deleteEquipmentSettings,
        getDivisionList

    } from '@/services/settingService'

    const filterStore = useFilterStore()
    const { showSuccess, showError, showWarning } = useSnackbar()
    
    const displayData = ref([])
    const isExist = ref(false)
    const id = ref(null)
    const isSaving = ref(false)
    const isEditMode = ref(false)
    const isDeleting = ref(false)
    const fileName = ref('')
    const fileInput = ref(null)

    const params = computed(() => {
        return {
            unit_id: filterStore.unit,
            sub_unit_id: filterStore.subunit,
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
            // OLD: load template from API
            // const response = await getEquipmentTempSettings();
            // displayData.value = response?.data ?? [];
            showError('No saved equipment settings. Please upload a CSV file.');
        } catch (error) {
            console.error("Failed to generate equipment settings:", error);
        }
    };

    // ── CSV Upload ───────────────────────────────────────────────────
    // Template headers: categories,divisions,types,lists,required
    // "required" column is the TE2019 value of the item.
    const CSV_HEADERS = ['categories', 'divisions', 'types', 'lists', 'required'];

    const triggerFileInput = () => {
        fileInput.value?.click();
    };

    // Splits one CSV line, respecting quoted values ("Sniper, Cal .50") and "" escapes
    const parseCSVLine = (line) => {
        const values = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (inQuotes) {
                if (char === '"' && line[i + 1] === '"') {
                    current += '"';
                    i++;
                } else if (char === '"') {
                    inQuotes = false;
                } else {
                    current += char;
                }
            } else if (char === '"') {
                inQuotes = true;
            } else if (char === ',') {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current.trim());
        return values;
    };

    // Category names used by the backend rating calculation (exact, case-sensitive match)
    const REPORT_CATEGORIES = ['MOBILITY', 'FIREPOWER', 'Communications', 'Medical', 'Dental', 'Quartermaster'];

    // Converts CSV rows into the category -> division -> type -> items structure used by the table.
    // divisionIdMap: UPPERCASED division name -> equipment_divisions id (used by the Inventory division filter)
    const parseEquipmentCSV = (csvText, divisionIdMap = new Map(), warnings = []) => {
        const lines = csvText.replace(/^﻿/, '').split(/\r?\n/).filter((l) => l.trim() !== '');
        if (lines.length < 2) {
            showError('CSV file is empty or invalid');
            return [];
        }

        const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase());
        if (!CSV_HEADERS.every((h) => headers.includes(h))) {
            showError(`CSV must contain headers: ${CSV_HEADERS.join(', ')}`);
            return [];
        }
        const col = (values, header) => values[headers.indexOf(header)] ?? '';

        // Integer IDs: division_id is stored in an integer column by the equipment report
        // Divisions not in equipment_divisions get IDs above the highest DB id so they never collide
        let categorySeq = 0;
        let divisionSeq = Math.max(0, ...divisionIdMap.values());
        let typeSeq = 0;
        let itemSeq = 0;
        const unknownCategories = new Set();
        const unknownDivisions = new Set();

        // Map keys are uppercased so "mOBILITY" and "MOBILITY" group together
        const categoryMap = new Map();
        for (let i = 1; i < lines.length; i++) {
            const values = parseCSVLine(lines[i]);
            const categoryName = col(values, 'categories');
            const divisionName = col(values, 'divisions');
            const typeName = col(values, 'types');
            if (!categoryName || !divisionName || !typeName) continue;

            const categoryKey = categoryName.toUpperCase();
            if (!categoryMap.has(categoryKey)) {
                const reportName = REPORT_CATEGORIES.find((c) => c.toUpperCase() === categoryKey);
                if (!reportName) unknownCategories.add(categoryName);
                categoryMap.set(categoryKey, {
                    category_id: ++categorySeq,
                    category_name: reportName ?? categoryName,
                    divisions: [],
                    divisionMap: new Map(),
                });
            }
            const category = categoryMap.get(categoryKey);

            const divisionKey = divisionName.toUpperCase();
            if (!category.divisionMap.has(divisionKey)) {
                let divisionId = divisionIdMap.get(divisionKey);
                if (divisionId === undefined) {
                    divisionId = ++divisionSeq;
                    unknownDivisions.add(divisionName);
                }
                const division = {
                    division_id: divisionId,
                    division_name: divisionName,
                    types: [],
                    typeMap: new Map(),
                };
                category.divisionMap.set(divisionKey, division);
                category.divisions.push(division);
            }
            const division = category.divisionMap.get(divisionKey);

            const typeKey = typeName.toUpperCase();
            if (!division.typeMap.has(typeKey)) {
                const type = {
                    type_id: ++typeSeq,
                    type_name: typeName,
                    items: [],
                };
                division.typeMap.set(typeKey, type);
                division.types.push(type);
            }
            const type = division.typeMap.get(typeKey);

            // "-" or blank list -> use the type name as the item
            const listName = col(values, 'lists');
            type.items.push({
                id: ++itemSeq,
                name: !listName || listName === '-' ? typeName : listName,
                required: col(values, 'required').replace(/[^0-9]/g, ''),
            });
        }

        if (unknownCategories.size > 0) {
            warnings.push(`Category not included in rating: ${[...unknownCategories].join(', ')}`);
        }
        if (unknownDivisions.size > 0) {
            warnings.push(`Division not found in equipment divisions: ${[...unknownDivisions].join(', ')}`);
        }

        // Drop the helper maps so only the table/API shape remains
        return [...categoryMap.values()].map(({ divisionMap, ...category }) => ({
            ...category,
            divisions: category.divisions.map(({ typeMap, ...division }) => division),
        }));
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file) handleCsvUpload(file);
    };

    // UPPERCASED name -> id from the equipment_divisions table
    const loadDivisionIdMap = async (warnings) => {
        try {
            const response = await getDivisionList();
            return new Map((response?.data ?? []).map((d) => [String(d.name).trim().toUpperCase(), Number(d.id)]));
        } catch (error) {
            console.error('Error loading division list:', error);
            warnings.push('Could not load equipment divisions; division IDs were auto-generated');
            return new Map();
        }
    };

    const handleCsvUpload = (file) => {
        fileName.value = file.name;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const warnings = [];
                const divisionIdMap = await loadDivisionIdMap(warnings);
                const parsedData = parseEquipmentCSV(event.target.result, divisionIdMap, warnings);
                if (parsedData.length > 0) {
                    displayData.value = parsedData;
                    isExist.value = false;
                    id.value = null;
                    isEditMode.value = true;
                    const itemCount = parsedData.reduce((total, c) =>
                        total + c.divisions.reduce((dt, d) =>
                            dt + d.types.reduce((tt, t) => tt + t.items.length, 0), 0), 0);
                    if (warnings.length > 0) {
                        showWarning(`Loaded ${itemCount} equipment items. ${warnings.join('. ')}`, 10000);
                    } else {
                        showSuccess(`Loaded ${itemCount} equipment items`);
                    }
                } else {
                    resetFileInput();
                }
            } catch (error) {
                console.error('Error parsing CSV:', error);
                showError('Error parsing CSV file');
                displayData.value = [];
                resetFileInput();
            }
        };
        reader.onerror = () => {
            showError('Error reading file');
        };
        reader.readAsText(file);
    };

    const resetFileInput = () => {
        fileName.value = '';
        if (fileInput.value) {
            fileInput.value.value = '';
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
    // Replaces non-integer IDs (temp-… from Add Type/Item or old saved data) with max + 1 per level
    const normalizeIds = (categories) => {
        const isIntId = (value) => Number.isInteger(value) || /^\d+$/.test(String(value))
        const divisions = categories.flatMap((c) => c.divisions ?? [])
        const types = divisions.flatMap((d) => d.types ?? [])
        const items = types.flatMap((t) => t.items ?? [])

        const assign = (rows, key) => {
            let max = Math.max(0, ...rows.filter((r) => isIntId(r[key])).map((r) => Number(r[key])))
            rows.forEach((r) => {
                r[key] = isIntId(r[key]) ? Number(r[key]) : ++max
            })
        }
        assign(categories, 'category_id')
        assign(divisions, 'division_id')
        assign(types, 'type_id')
        assign(items, 'id')
    }

    const handleSave = async () => {
        if (!isExist.value && !filterStore.unit) {
            showError('Please select a unit before saving')
            return
        }
        normalizeIds(displayData.value)
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
                resetFileInput()
               await handleGenerate()
            } else {
                showError(response?.message || 'Failed to save equipment settings')
            }
        } catch (error) {
            console.error('Error saving equipment settings:', error)
            showError(getErrorMessage(error, 'An error occurred while saving'))
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
        resetFileInput()
    }

    // Delete the whole saved equipment settings of the selected unit
    const handleDeleteAll = async () => {
        if (!id.value) return
        const confirmed = confirm('Are you sure you want to delete all equipment settings for this unit? This cannot be undone.')
        if (!confirmed) return

        isDeleting.value = true
        try {
            const response = await deleteEquipmentSettings(id.value)
            if (response?.status === 'success') {
                showSuccess('Equipment settings deleted successfully')
                displayData.value = []
                isExist.value = false
                id.value = null
                isEditMode.value = false
                resetFileInput()
            } else {
                showError(response?.message || 'Failed to delete equipment settings')
            }
        } catch (error) {
            console.error('Error deleting equipment settings:', error)
            showError(getErrorMessage(error, 'An error occurred while deleting'))
        } finally {
            isDeleting.value = false
        }
    }

    // Clear the table when the unit filter changes
    watch(() => filterStore.unit, () => {
        displayData.value = []
        isExist.value = false
        id.value = null
        isEditMode.value = false
        resetFileInput()
    })
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

    .file-name-display {
        color: #666;
        max-width: 300px;
    }

    .type-name-input {
        font-style: normal;
        font-weight: 600;
        flex: 1;
        margin-right: 8px;
    }
</style>