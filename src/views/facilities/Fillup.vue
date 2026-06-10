<template>
  <div class="facilities-maintenance">
    <app-filter-header />

    <v-card class="mt-4">
      <v-table class="elevation-1 custom-table" fixed-header height="80vh">
        <thead>
          <tr>
            <th class="text-left">Description</th>
            <th class="text-center" style="width: 10%">Required</th>
            <th class="text-center" style="width: 10%">Actual</th>
            <th class="text-center" style="width: 10%">Physical<br>Appearance</th>
            <th class="text-center" style="width: 10%">Safety</th>
            <th class="text-center" style="width: 10%">Functionality<br>Sanitation</th>
            <th class="text-center" style="width: 10%">Building Plans<br>Documents</th>
            <th class="text-center" style="width: 10%">
              {{ obj.status === '0' ? 'Update' : 'View' }}
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(item, i) in obj.tableData" :key="i">
            <!-- Title Row (Group Header) -->
            <tr v-if="item.title" class="item-title-row">
              <td class="item-title" :colspan="8">
                {{ item.description }}
              </td>
            </tr>

            <!-- Detail Row -->
            <tr v-else class="item-detail-row">
              <td class="item-detail text-left">{{ item.description }}</td>
              <td class="text-center">{{ item.required }}</td>

              <!-- Actual Column (Editable on double click) -->
              <td class="text-center">
                <v-tooltip text="Double click to edit" location="top">
                  <template #activator="{ props }">
                    <div
                      v-bind="props"
                      @dblclick="
                        obj.status === '0' &&
                        item.required &&
                        user.approver === 1 &&
                        (edit = true) &&
                        (index = i)
                      "
                      :class="
                        obj.status === '0' &&
                        item.required &&
                        user.approver === 1
                          ? 'editable'
                          : ''
                      "
                      class="editable-cell"
                    >
                      <!-- Edit Mode -->
                      <v-text-field
                        v-if="
                          edit &&
                          index === i &&
                          obj.status === '0' &&
                          user.approver === 1 &&
                          item.required
                        "
                        v-model="item.actual"
                        type="number"
                        density="compact"
                        min="0"
                        variant="outlined"
                        class="text-center"
                        @blur="
                          updateDetail(item);
                          edit = false;
                        "
                      />
                      <!-- View Mode -->
                      <div v-else style="white-space: pre-wrap">
                        {{ item.actual ? item.actual : '' }}
                      </div>
                    </div>
                  </template>
                </v-tooltip>
              </td>

              <!-- Physical Appearance -->
              <td class="text-center">
                <v-chip
                  v-if="item.pa"
                  :color="getPercentageColor(item.pa)"
                  text-color="white"
                  size="small"
                >
                  {{ item.pa }}%
                </v-chip>
              </td>

              <!-- Safety -->
              <td class="text-center">
                <v-chip
                  v-if="item.sa"
                  :color="getPercentageColor(item.sa)"
                  text-color="white"
                  size="small"
                >
                  {{ item.sa }}%
                </v-chip>
              </td>

              <!-- Functionality/Sanitation -->
              <td class="text-center">
                <v-chip
                  v-if="item.hs"
                  :color="getPercentageColor(item.hs)"
                  text-color="white"
                  size="small"
                >
                  {{ item.hs }}%
                </v-chip>
              </td>

              <!-- Building Plans/Documents -->
              <td class="text-center">
                <v-chip
                  v-if="item.bp"
                  :color="getPercentageColor(item.bp)"
                  text-color="white"
                  size="small"
                >
                  {{ item.bp }}%
                </v-chip>
              </td>

              <!-- Actions -->
              <td class="text-center">
                <v-tooltip text="Click to open updating details" location="top">
                  <template #activator="{ props }">
                    <v-btn
                      v-if="item.required"
                      v-bind="props"
                      icon
                      size="small"
                      @click="openDialog(item)"
                    >
                      <v-icon
                        v-if="obj.status === '0' && user.approver === 1"
                        color="warning"
                      >
                        mdi-table-edit
                      </v-icon>
                      <v-icon v-else color="success">
                        mdi-eye
                      </v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
              </td>
            </tr>
          </template>
        </tbody>
      </v-table>
    </v-card>

    <!-- Facility Details Dialog Component -->
    <FacilityDetailsDialog
      v-model="isDialogOpen"
      :title="dialogTitle"
      :facilities="temp.facility"
      :parameters="parameters"
      :is-read-only="obj.status !== '0'"
      @save="handleDialogSave"
      @parameter-change="handleParameterChange"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppFilterHeader from '@/components/layouts/AppFilterHeader.vue'
import FacilityDetailsDialog from '@/components/facilities/FacilityDetailsDialog.vue'

// State
const edit = ref(false)
const index = ref(null)
const isDialogOpen = ref(false)
const dialogTitle = ref('')

// User info (mock data - replace with actual user from store)
const user = ref({
  approver: 1 // 0 or 1
})

// Dialog data (mock data - replace with actual data)
const temp = ref({
  facility: [
    {
      detail: 'Structural Components',
      percent: null,
      code: null,
      parameter: null,
      rating: null
    },
    {
      detail: 'Roof',
      percent: 90,
      code: 'ROOF',
      parameter: 'Excellent',
      rating: 95
    },
    {
      detail: 'Walls',
      percent: 85,
      code: 'WALLS',
      parameter: 'Good',
      rating: 88
    },
    {
      detail: 'Floor',
      percent: 80,
      code: 'FLOOR',
      parameter: 'Good',
      rating: 82
    },
    {
      detail: 'Facilities & Systems',
      percent: null,
      code: null,
      parameter: null,
      rating: null
    },
    {
      detail: 'Water Supply',
      percent: 95,
      code: 'WATER',
      parameter: 'Excellent',
      rating: 98
    },
    {
      detail: 'Electrical System',
      percent: 88,
      code: 'ELECTRICAL',
      parameter: 'Good',
      rating: 90
    }
  ]
})

// Parameter options
const parameters = ref([
  { text: 'Poor', value: 'poor' },
  { text: 'Fair', value: 'fair' },
  { text: 'Good', value: 'good' },
  { text: 'Very Good', value: 'very_good' },
  { text: 'Excellent', value: 'excellent' }
])

// Object with table data (mock data - replace with actual data)
const obj = ref({
  status: '0', // '0' = draft/editable, '1' = completed/view only
  tableData: [
    {
      title: true,
      description: 'Building Maintenance'
    },
    {
      title: false,
      description: 'Roof condition',
      required: 'Yes',
      actual: 85,
      pa: 90,
      sa: 85,
      hs: 88,
      bp: 92
    },
    {
      title: false,
      description: 'Wall condition',
      required: 'Yes',
      actual: 75,
      pa: 80,
      sa: 75,
      hs: 78,
      bp: 82
    },
    {
      title: false,
      description: 'Floor condition',
      required: 'No',
      actual: null,
      pa: null,
      sa: null,
      hs: null,
      bp: null
    },
    {
      title: true,
      description: 'Facilities Equipment'
    },
    {
      title: false,
      description: 'Water system',
      required: 'Yes',
      actual: 95,
      pa: 95,
      sa: 98,
      hs: 96,
      bp: 97
    },
    {
      title: false,
      description: 'Electrical system',
      required: 'Yes',
      actual: 88,
      pa: 90,
      sa: 85,
      hs: 88,
      bp: 89
    }
  ]
})

/**
 * Get color for percentage chips
 * @param {number} percentage - The percentage value
 * @returns {string} Color code
 */
const getPercentageColor = (percentage) => {
  if (percentage >= 90) return 'success'
  if (percentage >= 75) return 'warning'
  if (percentage >= 60) return 'orange'
  return 'error'
}

/**
 * Update detail on blur
 * @param {Object} item - Item to update
 */
const updateDetail = (item) => {
  edit.value = false
  // TODO: Make API call to update the item
  console.log('Updated item:', item)
}

/**
 * Open dialog for detailed editing
 * @param {Object} item - Item to edit
 */
const openDialog = (item) => {
  dialogTitle.value = `Update Details - ${item.description}`
  isDialogOpen.value = true
  // TODO: Fetch facility details from API based on item ID
  console.log('Open dialog for:', item)
}

/**
 * Handle parameter change from dialog
 * @param {Object} item - Item with parameter change
 */
const handleParameterChange = (item) => {
  console.log('Parameter changed for:', item)
}

/**
 * Handle dialog save
 * @param {Array} facilities - Updated facilities data
 */
const handleDialogSave = async (facilities) => {
  try {
    // TODO: Make API call to update facility details
    console.log('Updating facility details:', facilities)
    // TODO: Show success notification
  } catch (error) {
    console.error('Error updating details:', error)
    // TODO: Show error notification
  }
}
</script>

<style scoped>
.facilities-maintenance {
  padding: 1rem;
}

.custom-table {
  border-collapse: collapse;
}

.custom-table th {
  background-color: #f5f5f5;
  font-weight: 600;
  border-bottom: 2px solid #e0e0e0;
  padding: 12px 8px;
}

.custom-table td {
  border-bottom: 1px solid #e0e0e0;
  padding: 12px 8px;
}

/* Title Row Styling */
.item-title-row {
  background-color: #e3f2fd;
}

.item-title {
  font-weight: 600;
  background-color: #2196F3;
  color: white;
  padding: 12px 16px !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Detail Row Styling */
.item-detail-row {
  background-color: #fafafa;
}

.item-detail-row:hover {
  background-color: #f5f5f5;
}

.item-detail {
  font-weight: 500;
  padding: 12px 16px !important;
}

/* Editable Cell */
.editable-cell {
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.editable-cell:hover {
  background-color: #fff3e0;
  border-radius: 4px;
}

.editable-cell.editable {
  background-color: #fff9c4;
  border: 1px solid #fbc02d;
}

/* Text alignment */
.text-left {
  text-align: left;
}

.text-center {
  text-align: center;
}

/* Responsive */
@media (max-width: 960px) {
  .custom-table th,
  .custom-table td {
    padding: 8px 4px;
    font-size: 0.85rem;
  }

  .item-title {
    padding: 8px 12px !important;
  }

  .item-detail {
    padding: 8px 12px !important;
  }
}

@media (max-width: 600px) {
  .custom-table {
    font-size: 0.75rem;
  }

  .custom-table th,
  .custom-table td {
    padding: 6px 2px;
  }
}

/* Color utility classes */
.bg-info {
  background-color: #2196F3;
  color: white;
}

.bg-warning {
  background-color: #FF9800;
  color: white;
}

.bg-success {
  background-color: #4CAF50;
  color: white;
}

.bg-error {
  background-color: #F44336;
  color: white;
}
</style>
