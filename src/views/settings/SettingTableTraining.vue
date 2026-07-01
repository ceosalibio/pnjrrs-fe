<template>
    <div>
        <AppSettingHeader />
        <div class="mt-4">
            <!-- CSV Upload Section -->
            <AppCard class="mb-4">
                <template #default>
                    <div class="d-flex justify-space-between align-center gap-3">
                        <div>
                            <input
                                v-if="csvData?.length == 0"
                                ref="fileInput"
                                type="file"
                                accept=".csv"
                                style="display: none"
                                @change="handleFileChange"
                            />
                            <AppButton
                                @click="triggerFileInput"
                                color="primary"
                                :disabled="csvData?.length > 0"
                            >
                                📁 Choose CSV File
                            </AppButton>
                            <span v-if="fileName" class="text-truncate file-name-display">
                                📄 {{ fileName }}
                            </span>
                        </div>

                        <div class="d-flex gap-2">
                            <AppButton
                                @click="handleSave"
                                color="success"
                                :disabled="csvData?.length == 0"
                            >
                                Save
                            </AppButton>
                            <AppButton
                                @click="handleClear"
                                color="grey"
                                :disabled="csvData?.length == 0"
                            >
                                Clear
                            </AppButton>
                        </div>
                    </div>
                </template>
            </AppCard>

            <!-- Preview Table Section -->
            <AppCard v-if="displayData.length > 0">
                <template #default>
                    <div class="mb-4">
                        <h3 class="mb-4">Preview</h3>
                        
                        <div class="table-responsive">
                            <table class="csv-table">
                                <thead>
                                    <tr>
                                        <th>METL</th>
                                        <th>MET</th>
                                        <th>Required</th>
                                        <th>Quarter</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(row, index) in displayData" :key="index">
                                        <!-- METL with rowspan merge -->
                                        <td v-if="row.metlRowspan > 0" :rowspan="row.metlRowspan" class="metl-cell">
                                            {{ row.metl }}
                                        </td>
                                        <td>{{ row.met }}</td>
                                        <td class="text-center">{{ row.required }}</td>
                                        <td class="text-center">{{ row.quarter }}</td>
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
                    <p>Upload a CSV file to view preview</p>
                </div>
            </AppCard>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, watch, computed } from 'vue';
    import AppSettingHeader from '@/components/layouts/AppSettingHeader.vue';
    import AppCard from '@/components/common/AppCard.vue';
    import AppButton from '@/components/common/AppButton.vue';
    import AppLoadingOverlay from '@/components/common/AppLoadingOverlay.vue';
    import { useFilterStore } from '@/stores/filterStore';
    import { useAppStore } from '@/stores/appStore';
    import { useSnackbar } from '@/composables/useSnackbar.js';
    import { getTrainingSettings, saveTrainingSettings, updateTrainingSettings, deleteTrainingSettings } from '@/services/settingService';
    
    const filterStore = useFilterStore();
    const appStore = useAppStore();
    const { showSnackbar } = useSnackbar();
    const csvData = ref([]);
    const displayData = ref([]);
    const fileName = ref('');
    const fileInput = ref(null);
    const isFromAPI = ref(false);
    const trainingSettingId = ref(null);

    /**
     * Calculate rowspan for METL column by grouping consecutive rows with same METL
     */
    const calculateMetlRowspan = (rows) => {
        const result = [];
        
        for (let i = 0; i < rows.length; i++) {
            const currentRow = { ...rows[i] };
            const currentMetl = currentRow.metl;
            
            // Count how many consecutive rows have the same METL
            let rowspan = 1;
            let j = i + 1;
            while (j < rows.length && rows[j].metl === currentMetl) {
                rowspan++;
                j++;
            }
            
            // Only add rowspan if this is the first row of a group
            if (i === 0 || rows[i - 1].metl !== currentMetl) {
                currentRow.metlRowspan = rowspan;
            } else {
                currentRow.metlRowspan = 0; // Don't render METL cell for subsequent rows
            }
            
            result.push(currentRow);
        }
        
        return result;
    };

    // Trigger file input dialog
    const triggerFileInput = () => {
        fileInput.value?.click();
    };

    // Load data from API
    const loadTrainingData = async () => {
        try {
            csvData.value = [];
            displayData.value = [];
            
            const filters = {
                sub_unit_id: filterStore.subunit,
                office_id: filterStore.office,
                sub_office_id: filterStore.suboffice
            };
            
            const response = await getTrainingSettings(filters);
            
            if (response?.data?.data?.length > 0) {
                const items = response?.data?.data?.[0]?.items || [];
                trainingSettingId.value = response?.data?.data?.[0]?.id;
                
                const processedItems = items.map(item => {
                    return {
                        metl: item.metl || '',
                        met: item.met || '',
                        required: item.required || '',
                        quarter: item.quarter || ''
                    };
                });
                
                csvData.value = processedItems;
                displayData.value = calculateMetlRowspan(processedItems);
                isFromAPI.value = true;
                fileName.value = '';
            }
        } catch (error) {
            console.error('Error loading training data:', error);
        } finally {
            appStore.setLoading(false);
        }
    };

    // Watch for filter changes and load data
    watch([() => filterStore.subunit, () => filterStore.office, () => filterStore.suboffice], async (newValues) => {
        const [subunit, office, suboffice] = newValues;
        if (subunit || office || suboffice) {
            await loadTrainingData();
        }
    });

    // Handle file input change
    const handleFileChange = (event) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            handleCsvUpload(file);
        }
    };

    // Parse CSV with proper handling of quoted values
    const parseCSVLine = (line) => {
        const result = [];
        let current = '';
        let insideQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
                insideQuotes = !insideQuotes;
            } else if (char === ',' && !insideQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }

        result.push(current.trim());
        return result;
    };

    // Parse CSV string to array of objects
    const parseCsv = (csvText) => {
        const lines = csvText.trim().split('\n');
        if (lines.length === 0) return [];

        // Get headers from first line
        const headerLine = parseCSVLine(lines[0]);
        const headers = headerLine.map(h => h.toLowerCase().replace(/"/g, ''));
        
        const allRows = [];

        // Parse rows
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '') continue;
            
            const values = parseCSVLine(lines[i]).map(v => v.replace(/"/g, ''));
            const row = {};
            
            headers.forEach((header, index) => {
                if (header === 'metl') {
                    row.metl = values[index] || '';
                } else if (header === 'met') {
                    row.met = values[index] || '';
                } else if (header === 'required') {
                    row.required = values[index] || '';
                } else if (header === 'quarter') {
                    row.quarter = values[index] || '';
                }
            });

            // Skip rows with empty metl
            if (!row.metl || row.metl.trim() === '') {
                continue;
            }

            allRows.push(row);
        }

        return allRows;
    };

    // Handle CSV file upload
    const handleCsvUpload = (file) => {
        if (!file) return;

        fileName.value = file.name;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const csvText = event.target.result;
                const parsedData = parseCsv(csvText);
                csvData.value = parsedData;
                displayData.value = calculateMetlRowspan(parsedData);
                isFromAPI.value = false;
            } catch (error) {
                console.error('Error parsing CSV:', error);
                showSnackbar('Error parsing CSV file', 'error');
                csvData.value = [];
                displayData.value = [];
            }
        };

        reader.onerror = () => {
            showSnackbar('Error reading file', 'error');
        };

        reader.readAsText(file);
    };

    // Handle save
    const handleSave = async () => {
        if (csvData.value.length === 0) {
            showSnackbar('No data to save', 'warning');
            return;
        }

        const dataToSend = csvData.value.map((row, i) => {
            return {
                id: i + 1,
                metl: row.metl,
                met: row.met,
                required: row.required,
                quarter: row.quarter
            };
        });

        if (dataToSend.length === 0) {
            showSnackbar('No data to send', 'warning');
            return;
        }

        let payload = {
            category_id: filterStore.category,
            unit_id: filterStore.unit,
            sub_unit_id: filterStore.subunit,
            office_id: filterStore.office,
            items: dataToSend
        };

        try {
            appStore.setLoading(true);
            
            let response;
            
            if (isFromAPI.value && trainingSettingId.value) {
                response = await updateTrainingSettings(trainingSettingId.value, payload);
            } else {
                response = await saveTrainingSettings(payload);
                csvData.value = [];
            }
            
            if (response?.status === 'success') {
                showSnackbar('Training data saved successfully', 'success');
                await loadTrainingData();
            } else {
                showSnackbar('Error saving training data', 'error');
            }
        } catch (error) {
            console.error('Error saving data:', error);
            showSnackbar('Error saving data', 'error');
        } finally {
            appStore.setLoading(false);
        }
    };

    // Handle clear
    const handleClear = () => {
        csvData.value = [];
        displayData.value = [];
        fileName.value = '';
        isFromAPI.value = false;
        trainingSettingId.value = null;
        if (fileInput.value) {
            fileInput.value.value = '';
        }
    };

    // Initial load
    onMounted(() => {
        loadTrainingData();
    });
</script>

<style scoped>
.csv-table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
}

.csv-table thead {
    background-color: #f5f5f5;
}

.csv-table th,
.csv-table td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: left;
}

.csv-table th {
    font-weight: 600;
    color: #333;
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
</style>
