
<template>
  <div class="equipment-details">
    <AppFilterHeader
      :reportType="'equipment'"
    />
    <v-card>
      <v-card-title>Equipment & Maintenance</v-card-title>
      <v-card-subtitle>Combined view of equipment items and maintenance status</v-card-subtitle>
      <v-divider />

      <v-card-text>
        <template #default>

          <div class="d-flex ga-2 justify-space-between">
              <div class="search-wrapper">
                <AppTextField 
                  v-model="searchQuery"
                  :label="'Search'" 
                  :placeholder="'Search equipment here'"
                />
              </div>

              <div class="d-flex ga-2">
                <!-- Update Button (Always visible when data loaded) -->
                <AppButton
                    v-if="reportStore?.tableItems?.length > 0 && !isEditMode"
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
              
          </div>

          <div class="table-responsive mt-4">
              <v-table class="data-table">
                  <thead>
                      <tr class="header-row">
                          <th></th>
                          <th >TE2019</th>
                          <th >ONHAND</th>
                          <th >URRS / <br>OPERATIONAL<br>STATUS</th>
                          <th >POINT</th>
                          <th >ASSESSMENT</th>

                      </tr>
                  </thead>
                  <tbody>
                      <template v-if="filteredTableItems?.length === 0">
                          <tr>
                              <td colspan="6" class="text-center text-grey">
                                  {{ searchQuery ? 'No results found. Try a different search.' : 'No data to display. Click "Generate" to load settings.' }}
                              </td>
                          </tr>
                      </template>

                      <template v-for="category in filteredTableItems" :key="`cat-${category.category_id}`">
                          <!-- Category Header -->
                          <tr class="category-row no-border">
                              <td class="text-center">{{ category.category_name }}</td>
                              <td class="text-center"><strong>{{ calculateCategoryTotalsWithPoints(category).required }}</strong></td>
                              <td class="text-center"> <strong>{{ calculateCategoryTotalsWithPoints(category).onhand }}</strong></td>
                              <td ></td>
                              <td class="text-center"><strong>{{ calculateCategoryTotalsWithPoints(category).points }}</strong></td>
                              <td></td>
                          </tr>

                          <template v-for="division in category.divisions" :key="`div-${division.division_id}`">
                              <!-- Division Header with Add Type -->
                              <tr class="division-row">
                                  <td>{{ division.division_name }}</td>
                                  <td class="text-center">
                                    <strong>{{ calculateDivisionTotalsWithPoints(division).required }}</strong>
                                  </td>
                                  <td class="text-center">
                                     <strong>{{ calculateDivisionTotalsWithPoints(division).onhand }}</strong>
                                  </td>
                                  <td ></td>
                                  <td class="text-center">
                                     <strong>{{ calculateDivisionTotalsWithPoints(division).points }}</strong>
                                  </td>
                                  <td >
                                     <div class="d-flex align-center justify-end">
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
                                      <td colspan="6">
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
                                              @blur="removeItemNew(item)"
                                          />
                                          <span v-else>{{ item.name }}</span>
                                      </td>
                                      <td class="text-center">
                                        <input
                                            v-if="isEditMode && item.isNew"
                                            type="text"
                                            inputmode="numeric"
                                            v-model="item.required"
                                            @input="handleNumberInput(item, 'required', $event)"
                                            class="te-input"
                                        />
                                        <span v-else>{{item.required}}</span>
                                      </td>
                                      <td class="text-center">
                                        <input
                                            v-if="isEditMode"
                                            type="text"
                                            inputmode="numeric"
                                            v-model="item.onhand"
                                            @input="handleNumberInput(item, 'onhand', $event)"
                                            class="te-input"
                                        />
                                        <span v-else>{{item.onhand}}</span>
                                      </td>
                                      <td class="text-center">
                                        <select
                                            v-if="isEditMode"
                                            v-model="item.urrs"
                                            @change="handleUrrsChange(item)"
                                            class="te-select"
                                        >
                                            <option value="">Select Status</option>
                                            <option value="R1">R1</option>
                                            <option value="R2">R2</option>
                                            <option value="R3">R3</option>
                                            <option value="R4">R4</option>
                                        </select>
                                        <span v-else>{{ item.urrs }}</span>
                                      </td>

                                      <td class="text-center">
                                        {{ getItemPoint(item) }}
                                      </td>

                                      <td>
                                        <div class="d-flex align-center ga-2">
                                            <input
                                                v-if="isEditMode"
                                                type="text"
                                                inputmode="numeric"
                                                v-model="item.remarks"
                                                @input="handleNumberInput(item, 'remarks', $event)"
                                                class="te-input"
                                            />
                                            <span v-else>{{item.remarks}}</span>
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
              </v-table>
          </div>
      </template>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import AppFilterHeader from '@/components/layouts/AppFilterHeader.vue'
import { ref, computed } from 'vue'
import AppButton from '@/components/common/AppButton.vue';
import AppTextField from '@/components/forms/AppTextField.vue';
import { useReportStore } from '@/stores/reportStore'
import { useSnackbar } from '@/composables/useSnackbar'
import { executeReportAction  } from '@/services/reportService'

const reportStore = useReportStore()
const { showError, showSuccess } = useSnackbar()
const isEditMode = ref(false)
const isExist = ref(false)
const id = ref(null)
const isSaving = ref(false)
const searchQuery = ref('')

 const params = computed(() => {
        return {
            unit_id: filterStore.unit,
            sub_unit_id: filterStore.subunit,
            office_id: filterStore.office,
            sub_office_id: filterStore.suboffice,
        }
    })

    // Filtered table items based on search query
    const filteredTableItems = computed(() => {
        if (!searchQuery.value.trim()) {
            return reportStore?.tableItems || []
        }

        const query = searchQuery.value.toLowerCase().trim()
        
        return (reportStore?.tableItems || []).map(category => ({
            ...category,
            divisions: category.divisions.map(division => ({
                ...division,
                types: division.types.map(type => ({
                    ...type,
                    items: type.items.filter(item => 
                        item.name?.toLowerCase().includes(query) ||
                        item.remarks?.toLowerCase().includes(query)
                    )
                })).filter(type => type.items.length > 0) // Remove types with no matching items
            })).filter(division => division.types.length > 0) // Remove divisions with no matching types
        })).filter(category => category.divisions.length > 0) // Remove categories with no matching divisions
    })



    // Calculate totals for a division
    const calculateDivisionTotals = (division) => {
        let totalRequired = 0
        let totalOnhand = 0

        if (division.types && Array.isArray(division.types)) {
            division.types.forEach(type => {
                if (type.items && Array.isArray(type.items)) {
                    type.items.forEach(item => {
                        totalRequired += parseInt(item.required) || 0
                        totalOnhand += parseInt(item.onhand) || 0
                    })
                }
            })
        }

        return {
            required: totalRequired,
            onhand: totalOnhand
        }
    }

    // Calculate totals for a category
    const calculateCategoryTotals = (category) => {
        let totalRequired = 0
        let totalOnhand = 0

        if (category.divisions && Array.isArray(category.divisions)) {
            category.divisions.forEach(division => {
                const divisionTotals = calculateDivisionTotals(division)
                totalRequired += divisionTotals.required
                totalOnhand += divisionTotals.onhand
            })
        }

        return {
            required: totalRequired,
            onhand: totalOnhand
        }
    }



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

    // ── Item: Number-only input for numeric fields, text for remarks ────────────────────
    const handleNumberInput = (item, fieldName, event) => {
        const raw = event.target.value;
        
        // Only numeric fields: required, onhand, urrs
        // Remarks field can accept any text
        if (fieldName === 'remarks') {
            // Allow any text for remarks
            item[fieldName] = raw;
        } else {
            // Only numbers for other fields
            const sanitized = raw.replace(/[^0-9]/g, "");
            
            // Validation: onhand cannot be greater than required
            if (fieldName === 'onhand') {
                const onhandValue = parseInt(sanitized) || 0;
                const requiredValue = parseInt(item.required) || 0;
                
                if (onhandValue > requiredValue) {
                    // Show warning and reject the value
                    showError(`Onhand (${onhandValue}) cannot be greater than Required (${requiredValue})`);
                    event.target.value = item.onhand;
                    item.onhand = 0
                    return;
                }
            }
            
            item[fieldName] = sanitized;
            event.target.value = sanitized;
        }
    };

    // remove item.isNew to false
    const removeItemNew = (item) =>{
        item.isNew = false
    }
    // URRS to Point mapping
    const urrsPointMap = {
        'R1': 1,
        'R2': 0.8,
        'R3': 0.5,
        'R4': 0,
        '': 0
    }

    // Handle URRS selection and update point
    const handleUrrsChange = (item) => {
        item.point = urrsPointMap[item.urrs] || 0
    }

    // Get point value for an item
    const getItemPoint = (item) => {
        return item.point || urrsPointMap[item.urrs] || 0
    }

    // Calculate division totals including points
    const calculateDivisionTotalsWithPoints = (division) => {
        let totalRequired = 0
        let totalOnhand = 0
        let totalPoints = 0

        if (division.types && Array.isArray(division.types)) {
            division.types.forEach(type => {
                if (type.items && Array.isArray(type.items)) {
                    type.items.forEach(item => {
                        totalRequired += parseInt(item.required) || 0
                        totalOnhand += parseInt(item.onhand) || 0
                        totalPoints += getItemPoint(item)
                    })
                }
            })
        }
        division.required = totalRequired
        division.onhand = totalOnhand
        division.points = totalPoints.toFixed(2)
        division.rating = (totalOnhand / totalRequired) * 100
        division.points_rating = (totalPoints / totalOnhand) * 100
        return {
            required: totalRequired,
            onhand: totalOnhand,
            points: totalPoints.toFixed(2)
        }
    }

    // Calculate category totals including points
    const calculateCategoryTotalsWithPoints = (category) => {
        let totalRequired = 0
        let totalOnhand = 0
        let totalPoints = 0

        if (category.divisions && Array.isArray(category.divisions)) {
            category.divisions.forEach(division => {
                const divisionTotals = calculateDivisionTotalsWithPoints(division)
                totalRequired += divisionTotals.required
                totalOnhand += divisionTotals.onhand
                totalPoints += parseFloat(divisionTotals.points)
            })
        }

        category.required = totalRequired
        category.onhand = totalOnhand
        category.points = totalPoints.toFixed(2)
        return {
            required: totalRequired,
            onhand: totalOnhand,
            points: totalPoints.toFixed(2)
        }
    }







    // 
    const handleSave = async () => {
        isSaving.value = true
        try {
          const payload = {
              items: reportStore?.tableItems
          }
          console.log(payload,'payyyy')
          const response = await executeReportAction(payload, 'equipment', 'update', reportStore.reportId)
          console.log(response,'response')
            
          if (response?.status == 'success') {
            showSuccess('Equipment  saved successfully')
            isEditMode.value = false
              await reportStore.reportGenerate('equipment')
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
.search-wrapper {
    min-width: 300px;
    max-width: 400px;
    width: 100%;
}

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

    .category-row.no-border td {
        border: none;
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

    .te-select {
        width: 100%;
        padding: 4px 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        background-color: #ffffff;
        cursor: pointer;
        font-size: 0.9rem;
    }

    .te-select:hover {
        border-color: #999;
    }

    .te-select:focus {
        outline: none;
        border-color: #1976d2;
        box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
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
