<template>
    <div>
        <AppSettingHeader />
            <!-- <AppLoadingOverlay :isVisible="appStore.loading" /> -->
            <div class="mt-4">
            <!-- CSV Upload Section -->
            <AppCard class="mb-4">
                <template #default>
                    <div class="d-flex justify-space-between align-center gap-3">
                        <div>
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
                            >
                                📁 Choose CSV File
                            </AppButton>
                            <span v-if="fileName" class="text-truncate file-name-display">
                                📄 {{ fileName }}
                            </span>
                        </div>

                        <div class=" d-flex gap-2">
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
                                        <th>Description</th>
                                        <th>Grade</th>
                                        <th>AFPOS</th>
                                        <th>Required</th>
                                        <th>Office</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(row, index) in displayData" :key="index" :class="{ 'total-row': row.isTotal, 'section-header-row': row.isSectionHeader && !row.description.toLowerCase().includes('branch'), 'office-highlight': row.isOffice }">
                                        <td>
                                            <input 
                                                v-if="isFromAPI && !row.isTotal && !row.isSectionHeader"
                                                v-model="row.description" 
                                                type="text"
                                                class="editable-field"
                                            />
                                            <span v-else>{{ row.description }}</span>
                                        </td>
                                        <td>{{ row.grade }}</td>
                                        <td>{{ row.afpos }}</td>
                                        <td class="text-center" :class="{ 'font-weight-bold': row.isTotal }">
                                            <input 
                                                v-if="isFromAPI && !row.isTotal && !row.isSectionHeader"
                                                v-model="row.required" 
                                                type="number"
                                                class="editable-field"
                                                @change="onRequiredChange(index)"
                                            />
                                            <span v-else>{{ row.required }}</span>
                                        </td>
                                        <td v-if="row.isSectionHeader && !isFromAPI" class="text-center">
                                            <input
                                                type="checkbox"
                                                v-model="row.office"
                                                class="cursor-pointer"
                                            />
                                        </td>
                                        <td v-else></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
<!-- 
                        <div class="mt-4 d-flex gap-2">
                            <AppButton
                                @click="handleSave"
                                color="primary"
                            >
                                Save
                            </AppButton>
                            <AppButton
                                @click="handleClear"
                            >
                                Clear
                            </AppButton>
                        </div> -->
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
    import { getOrganizationSettings , saveOrganizationSettings, updateOrganizationSettings, deleteOrganizationSettings } from '@/services/settingService';
    
    const filterStore = useFilterStore();
    const appStore = useAppStore();
    const { showSnackbar } = useSnackbar();
    const csvData = ref([]);
    const displayData = ref([]); // Expanded data for display only
    const fileName = ref('');
    const fileInput = ref(null);
    const isFromAPI = ref(false); // Track if data is from API or CSV upload
    const editingRow = ref(null); // Track which row is being edited
    const organizationSettingId = ref(null); // Store the ID from API for update operations

    /**
     * Expands rows based on required count for DISPLAY ONLY
     * Only expands rows with grade (actual personnel rows)
     * Each row with required > 1 will be repeated required times with required = 1
     */
    const expandRowsByRequired = (rows) => {
      const expandedRows = [];
      
      rows.forEach(row => {
        // Only expand rows that have a grade (personnel rows)
        if (row.grade && row.grade.trim() !== '') {
          const required = parseInt(row.required) || 1;
          // Repeat row based on required count
          for (let i = 0; i < required; i++) {
            expandedRows.push({
              ...row,
              required: '1' // Set each expanded row to 1
            });
          }
        } else {
          // Don't expand: section headers, totals, or rows without grade
          expandedRows.push(row);
        }
      });
      
      return expandedRows;
    };

    // Trigger file input dialog
    const triggerFileInput = () => {
        fileInput.value?.click();
    };

    // Load data from API
    const loadOrganizationData = async () => {
        try {
            csvData.value = [];
            displayData.value = [];
            const filters = {
                // category_id: filterStore.category,
                // unit_id: filterStore.unit,
                sub_unit_id: filterStore.subunit,
                office_id: filterStore.office,
                sub_office_id: filterStore.suboffice
            };
            
            const response = await getOrganizationSettings(filters);
            
            // Extract items from nested structure: response.data.data[0].items
            // const items = response?.data?.data?.[0]?.items;
            
            if (response?.data?.data?.length == 1) {
                 const items = response?.data?.data?.[0]?.items;
                 organizationSettingId.value = response?.data?.data?.[0]?.id;
                const processedItems = items.map(item => {
                    const description = item.description?.trim().toLowerCase() || '';
                    const isSubTotal =(['sub-total','subtotal','total','sub- total']).includes(description);
                    const isAggregateTotal = description.includes('aggregate total');
                    
                    return {
                        ...item,
                        isTotal: isSubTotal || isAggregateTotal,
                        isSubTotal: isSubTotal,
                        isAggregateTotal: isAggregateTotal,
                        isSectionHeader: !item.grade && !item.afpos && !isSubTotal && !isAggregateTotal,
                        isOffice: item.office === true && !item.grade && !item.afpos
                    };
                });
                
                csvData.value = processedItems; // Keep original data
                displayData.value = expandRowsByRequired(processedItems); // Expand for display
                isFromAPI.value = true;
                fileName.value = '';
                // Recalculate totals after loading from API
                recalculateTotals();
                // showSnackbar('Data loaded successfully', 'success');
            }
        } catch (error) {
            console.error('Error loading organization data:', error);
            // showSnackbar('Error loading data', 'error');
        } finally {
            appStore.setLoading(false);
        }
    };

    // Watch for filter changes and load data
    watch([() => filterStore.subunit, () => filterStore.office, () => filterStore.suboffice], async (newValues) => {
        const [subunit, office, suboffice] = newValues;
        if (subunit || office || suboffice) {
            await loadOrganizationData();
        }
    });

    // Trigger file input dialog
    // const triggerFileInput = () => {
    //     fileInput.value?.click();
    // };

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

    // Parse CSV string to array of objects with computed totals
    const parseCsv = (csvText) => {
        const lines = csvText.trim().split('\n');
        if (lines.length === 0) return [];

        // Get headers from first line
        const headerLine = parseCSVLine(lines[0]);
        const headers = headerLine.map(h => h.toLowerCase().replace(/"/g, ''));
        
        const allRows = [];
        const sections = [];
        let currentSection = [];

        // First pass: parse all rows
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '') continue;
            
            const values = parseCSVLine(lines[i]).map(v => v.replace(/"/g, ''));
            const row = {};
            
            headers.forEach((header, index) => {
                if (header === 'description/disposition') {
                    row.description = values[index] || '';
                } else if (header === 'grade') {
                    row.grade = values[index] || '';
                } else if (header === 'afpos') {
                    row.afpos = values[index] || '';
                } else if (header === 'required') {
                    row.required = values[index] || '';
                }
            });

            // Skip rows with empty description
            if (!row.description || row.description.trim() === '') {
                continue;
            }

            // Check if it's a total row (case-insensitive)
            const description = row.description.trim().toLowerCase();
            const isSubTotal = (['sub-total','subtotal','total', 'sub- total']).includes(description);
            const isAggregateTotal = description.includes('aggregate total');

            row.isTotal = isSubTotal || isAggregateTotal;
            row.isSubTotal = isSubTotal;
            row.isAggregateTotal = isAggregateTotal;
            
            // Check if it's a section header (has description but no grade, afpos, required)
            const hasGrade = row.grade && row.grade.trim() !== '';
            const hasAfpos = row.afpos && row.afpos.trim() !== '';
            const hasRequired = row.required && row.required.trim() !== '';
            row.isSectionHeader = !hasGrade && !hasAfpos && !hasRequired && !row.isTotal;
            
            // Check if it's an office without 'branch' in description
            row.isOffice = row.isSectionHeader && !row.description.toLowerCase().includes('branch');
            
            row.office = false; // Default checkbox to unchecked
            row.key = null; // Will be set for total rows

            if (isSubTotal) {
                sections.push([...currentSection]);
                currentSection = [];
                allRows.push(row);
            } else if (isAggregateTotal) {
                allRows.push(row);
            } else {
                currentSection.push(row);
                allRows.push(row);
            }
        }

        // Second pass: compute totals
        const resultData = [];
        let rowIndex = 0;

        for (const row of allRows) {
            if (row.isTotal) {
                if (row.isSubTotal) {
                    // Find the section for this sub-total
                    let total = 0;
                    let j = rowIndex - 1;
                    let sectionName = '';
                    while (j >= 0 && !resultData[j].isTotal) {
                        const requiredVal = parseInt(resultData[j].required) || 0;
                        total += requiredVal;
                        // Get the section name from the first office/section header we find
                        if (!sectionName && resultData[j].isSectionHeader) {
                            sectionName = resultData[j].description.replace(/[^a-zA-Z0-9]/g, '_');
                        }
                        j--;
                    }
                    row.required = total.toString();
                    row.key = `subtotal_${sectionName || rowIndex}`;
                } else if (row.isAggregateTotal) {
                    // Sum all SUB-TOTAL rows
                    let total = 0;
                    for (const dataRow of resultData) {
                        if (dataRow.isSubTotal) {
                            const requiredVal = parseInt(dataRow.required) || 0;
                            total += requiredVal;
                        }
                    }
                    row.required = total.toString();
                    row.key = 'aggregate_total';
                }
            }

            resultData.push(row);
            rowIndex++;
        }

        return resultData;
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
                csvData.value = parsedData; // Keep original data
                displayData.value = expandRowsByRequired(parsedData); // Expand for display
                isFromAPI.value = false; // Mark as CSV upload
                // Recalculate totals after parsing CSV
                recalculateTotals();
                // showSnackbar('CSV file loaded successfully', 'success');
            } catch (error) {
                console.error('Error parsing CSV:', error);
                // showSnackbar('Error parsing CSV file', 'error');
                csvData.value = [];
                displayData.value = [];
            }
        };

        reader.onerror = () => {
            // showSnackbar('Error reading file', 'error');
        };

        reader.readAsText(file);
    };

    // Handle save - create array of objects to send to backend
    const handleSave = async () => {
        if (csvData.value.length === 0) {
            // showSnackbar('No data to save', 'warning');
            return;
        }

        // Expand rows and recalculate totals based on expanded data
        const expandedForSave = expandRowsByRequired(csvData.value);

        // Return all data rows including totals with officeName field
        let currentOfficeName = '';
        const dataToSend = expandedForSave.map((row,i) => {
            // Update current office name if this is an office header (office: true)
            if (row.isOffice && row.office) {
                currentOfficeName = row.description.toUpperCase();
            }

            const item = {
                id : i + 1 ,
                description: row.description,
                grade: row.grade,
                afpos: row.afpos,
                required: row.required,
                office: row.office, // Include office status (true/false)
                officeName: currentOfficeName // Add office name
            };
            
            // Add key for total rows
            if (row.isTotal && row.key) {
                item.key = row.key;
            }
            
            return item;
        });

        // console.log('Data prepared for backend:', dataToSend);
        // return false

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
            console.log('Data to send to backend:', payload);
            
            let response;
            
            // Use update for API data, save for new/CSV data
            if (isFromAPI.value && organizationSettingId.value) {
                response = await updateOrganizationSettings(organizationSettingId.value, payload);
            } else {
                response = await saveOrganizationSettings(payload);
                csvData.value = [];
            }
            
            console.log('Response from backend:', response);
            if(response?.status == 'success') {
                // showSnackbar('Data saved successfully!', 'success');
                if(payload?.office_id){
                    const result = await filterStore.getSubOffices(1,null,payload?.office_id);
                    filterStore.organizationFilterItems.suboffices = result.data;
                }else{
                    const result = await filterStore.getOffices(1,null,payload?.sub_unit_id);
                    filterStore.organizationFilterItems.offices = result.data;
                }
                //  await loadOrganizationData();
            } 
        } catch (error) {
            console.error('Error saving data:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Error saving data';
            // showSnackbar(errorMessage, 'error');
        } finally {
            appStore.setLoading(false);
        }
    };

    // Handle clear
    const handleClear = () => {
        csvData.value = [];
        displayData.value = [];
        fileName.value = '';
        if (fileInput.value) {
            fileInput.value.value = '';
        }
        isFromAPI.value = false;
        editingRow.value = null;
        organizationSettingId.value = null;
        // showSnackbar('Data cleared', 'info');
    };

    // Recalculate totals based on expanded rows
    const recalculateTotals = () => {
        for (let i = 0; i < csvData.value.length; i++) {
            const row = csvData.value[i];
            
            if (row.isSubTotal) {
                // Sum all non-total rows in this section, counting expansion
                let total = 0;
                let j = i - 1;
                while (j >= 0 && !csvData.value[j].isTotal) {
                    const dataRow = csvData.value[j];
                    if (dataRow.grade && dataRow.grade.trim() !== '') {
                        // For personnel rows, count their required value (they will expand)
                        const requiredVal = parseInt(dataRow.required) || 1;
                        total += requiredVal;
                    } else {
                        // Non-personnel rows don't expand
                        const requiredVal = parseInt(dataRow.required) || 0;
                        total += requiredVal;
                    }
                    j--;
                }
                row.required = total.toString();
            } else if (row.isAggregateTotal) {
                // Sum all SUB-TOTAL rows
                let total = 0;
                for (const dataRow of csvData.value) {
                    if (dataRow.isSubTotal) {
                        const requiredVal = parseInt(dataRow.required) || 0;
                        total += requiredVal;
                    }
                }
                row.required = total.toString();
            }
        }
        
        // Update display data to reflect totals
        displayData.value = expandRowsByRequired(csvData.value);
    };

    // Handle row edit
    const onRequiredChange = (index) => {
        recalculateTotals();
    };

    onMounted(() => {
       
    });
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

    .cursor-pointer {
        cursor: pointer;
    }

    .gap-3 {
        gap: 1rem;
    }

    .gap-2 {
        gap: 0.5rem;
    }

    .text-grey {
        color: #999;
    }

    .py-8 {
        padding-top: 2rem;
        padding-bottom: 2rem;
    }

    .file-name-display {
        font-size: 0.9rem;
        color: #666;
        max-width: 300px;
    }

    .pa-4 {
        padding: 1rem;
    }

    .d-flex {
        display: flex;
    }

    .align-center {
        align-items: center;
    }

    .mb-4 {
        margin-bottom: 1rem;
    }

    .mt-4 {
        margin-top: 1rem;
    }

    .text-center {
        text-align: center;
    }

    .text-truncate {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .total-row {
        background-color: #e8f5e9 !important;
        font-weight: 600;
    }

    .total-row td {
        background-color: #e8f5e9;
    }

    .section-header-row {
        background-color: #f3e5f5 !important;
        font-weight: 600;
    }

    .section-header-row td {
        background-color: #f3e5f5;
    }

    .office-highlight {
        background-color: #ece8e1 !important;
    }

    .office-highlight td {
        background-color: #fff3e0;
    }

    .font-weight-bold {
        font-weight: 600;
    }

    .editable-field {
        width: 100%;
        padding: 6px 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 0.9rem;
        font-family: inherit;
    }

    .editable-field:focus {
        outline: none;
        border-color: #1976d2;
        box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
    }
</style>
