<template>
  <div class="rating-table">
    <v-card>
      <v-table class="elevation-1 custom-table" fixed-header height="90vh">
        <thead>
          <tr class="header-row">
            <th class="text-left" style="width: 20%">Facility</th>
            <th colspan="3" class="text-center">Quantitative</th>
            <th class="text-center">Qualitative</th>
            <th class="text-center">Rating</th>
            <th class="text-center">REDCON</th>
          </tr>
          <tr class="subheader-row">
            <th class="text-left"></th>
            <th class="text-center">Required</th>
            <th class="text-center">Actual</th>
            <th class="text-center">Rating</th>
            <th class="text-center">Rating</th>
            <th class="text-center"></th>
            <th class="text-center"></th>
          </tr>
        </thead>
        <tbody>
          <template v-if="finalObj?.tableData?.length > 0" v-for="(item, i) in finalObj.tableData" :key="`main-${i}`">
            <!-- Main Row -->
            <tr>
              <td
                :class="item.title ? 'item-title' : 'item-detail'"
                :colspan="item.title ? 5 : 1"
              >
                {{ item.description }}
              </td>

              <!-- Detail Columns (only if not a title row) -->
              <template v-if="!item.title">
                <td class="text-center">{{ item.required }}</td>
                <td class="text-center">{{ item.actual }}</td>
                <td class="text-center">
                  {{ item.rating ? item.rating.toFixed(2) + '%' : '' }}
                </td>
                <td class="text-center">
                  {{ item.total ? item.total.toFixed(2) + '%' : '' }}
                </td>
              </template>

              <!-- Rating and REDCON (with rowspan for groups) -->
              <td
                v-if="item.count > 0"
                :rowspan="item.count > 0 ? item.count : 1"
                class="text-center align-middle"
              >
                <div class="text-h6 font-weight-bold">
                  {{ getRating(item) }}
                </div>
              </td>
              <td
                v-if="item.count > 0"
                :rowspan="item.count > 0 ? item.count : 1"
                :class="
                  getRating(item)
                    ? `${red.redStyle(red.redCon(getRating(item)))} text-h6`
                    : ''
                "
                class="text-center align-middle font-weight-bold"
              >
                {{ getRating(item) ? red.redCon(getRating(item)).substr(0, 2) : '' }}
              </td>
            </tr>

            <!-- Average Rating Row -->
            <tr
              v-if="!item.count && (!finalObj.tableData[i + 1] || finalObj.tableData[i + 1].count)"
              class="bg-detail"
              :key="`avg-${i}`"
            >
              <td class="font-weight-bold text-left" colspan="3">
                Average Rating
              </td>
              <td class="font-weight-bold text-center">
                {{ getQuantitative(item) }}
              </td>
              <td class="font-weight-bold text-center">
                {{ getQualitative(item) }}
              </td>
              <td colspan="2"></td>
            </tr>
          </template>
        </tbody>
      </v-table>
    </v-card>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { red  } from '@/utils/redcon.js'

const props = defineProps({
  obj: {
    type: Object,
    default: () => ({
      tableData: [],
      master: {}
    })
  }
})

// Mock data
const mockObj = ref({
  tableData: [
    // Building Maintenance Group
    {
      title: true,
      description: 'Building Maintenance',
      count: 3,
      info: 1
    },
    {
      title: false,
      description: 'Roof Condition',
      required: 100,
      actual: 95,
      rating: 95.00,
      total: 92.50,
      count: 0,
      info: 1
    },
    {
      title: false,
      description: 'Wall Condition',
      required: 100,
      actual: 85,
      rating: 85.00,
      total: 87.50,
      count: 0,
      info: 1
    },
    {
      title: false,
      description: 'Floor Condition',
      required: 100,
      actual: 80,
      rating: 80.00,
      total: 82.50,
      count: 0,
      info: 1
    },
    // Safety Equipment Group
    {
      title: true,
      description: 'Safety Equipment',
      count: 2,
      info: 2
    },
    {
      title: false,
      description: 'Fire Suppression System',
      required: 100,
      actual: 90,
      rating: 90.00,
      total: 92.00,
      count: 0,
      info: 2
    },
    {
      title: false,
      description: 'Emergency Lighting',
      required: 100,
      actual: 88,
      rating: 88.00,
      total: 90.00,
      count: 0,
      info: 2
    },
    // Facility Operations Group
    {
      title: true,
      description: 'Facility Operations',
      count: 2,
      info: 3
    },
    {
      title: false,
      description: 'Water System',
      required: 100,
      actual: 98,
      rating: 98.00,
      total: 97.50,
      count: 0,
      info: 3
    },
    {
      title: false,
      description: 'Electrical System',
      required: 100,
      actual: 92,
      rating: 92.00,
      total: 94.50,
      count: 0,
      info: 3
    },
    // Building Plans Group
    {
      title: true,
      description: 'Building Plans & Documents',
      count: 1,
      info: 4
    },
    {
      title: false,
      description: 'Documentation Completeness',
      required: 100,
      actual: 85,
      rating: 85.00,
      total: 88.00,
      count: 0,
      info: 4
    }
  ],
  master: {
    // Physical Appearance ratings
    pa_facilityrating: 88.75,
    pa_quantitative: 86.25,
    pa_qualitative: 91.25,
    
    // Safety ratings
    sa_facilityrating: 89.00,
    sa_quantitative: 89.00,
    sa_qualitative: 91.00,
    
    // Functionality/Sanitation ratings
    hs_facilityrating: 95.00,
    hs_quantitative: 95.00,
    hs_qualitative: 94.00,
    
    // Building Plans ratings
    bp_facilityrating: 85.00,
    bp_quantitative: 85.00,
    bp_qualitative: 88.00
  }
})

// Use mock data if obj is empty
const finalObj = computed(() => {
  if (!props.obj?.tableData || props.obj.tableData.length === 0) {
    return mockObj.value
  }
  return props.obj
})

/**
 * Get rating based on item info type
 * @param {Object} item - Facility item
 * @returns {string} Formatted rating percentage
 */
const getRating = (item) => {
  const rating = finalObj.value.master
  if (!rating) return ''

  switch (item.info) {
    case 1:
      return rating.pa_facilityrating?.toFixed(2) + '%' || ''
    case 2:
      return rating.sa_facilityrating?.toFixed(2) + '%' || ''
    case 3:
      return rating.hs_facilityrating?.toFixed(2) + '%' || ''
    case 4:
      return rating.bp_facilityrating?.toFixed(2) + '%' || ''
    default:
      return ''
  }
}

/**
 * Get quantitative rating
 * @param {Object} item - Facility item
 * @returns {string} Formatted quantitative percentage
 */
const getQuantitative = (item) => {
  const rating = finalObj.value.master
  if (!rating) return ''

  switch (item.info) {
    case 1:
      return rating.pa_quantitative?.toFixed(2) + '%' || ''
    case 2:
      return rating.sa_quantitative?.toFixed(2) + '%' || ''
    case 3:
      return rating.hs_quantitative?.toFixed(2) + '%' || ''
    case 4:
      return rating.bp_quantitative?.toFixed(2) + '%' || ''
    default:
      return ''
  }
}

/**
 * Get qualitative rating
 * @param {Object} item - Facility item
 * @returns {string} Formatted qualitative percentage
 */
const getQualitative = (item) => {
  const rating = finalObj.value.master
  if (!rating) return ''

  switch (item.info) {
    case 1:
      return rating.pa_qualitative?.toFixed(2) + '%' || ''
    case 2:
      return rating.sa_qualitative?.toFixed(2) + '%' || ''
    case 3:
      return rating.hs_qualitative?.toFixed(2) + '%' || ''
    case 4:
      return rating.bp_qualitative?.toFixed(2) + '%' || ''
    default:
      return ''
  }
}
</script>

<style scoped>
.rating-table {
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
  vertical-align: middle;
}

/* Title Row */
.item-title {
  font-weight: 600;
  background-color: #2196F3;
  color: white;
  padding: 12px 16px !important;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Detail Row */
.item-detail {
  font-weight: 500;
  padding: 12px 16px !important;
  text-align: left;
}

/* Average Rating Background */
.bg-detail {
  background-color: #708090;
  color: white;
  font-weight: bold;
}

.text-center {
  text-align: center;
}

.text-left {
  text-align: left;
}

.align-middle {
  vertical-align: middle;
}

.font-weight-bold {
  font-weight: 600;
}

.text-h6 {
  font-size: 1.25rem;
  font-weight: 500;
}

/* Header Styling */
.rating-table :deep(thead .header-row th) {
  background-color: #1565C0 !important;
  color: white !important;
  font-weight: 700 !important;
  border-bottom: 3px solid #0D47A1 !important;
  padding: 16px 8px !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px !important;
  font-size: 0.95rem !important;
}

.rating-table :deep(thead .subheader-row th) {
  background-color: #1976D2 !important;
  color: white !important;
  font-weight: 600 !important;
  border-bottom: 2px solid #1565C0 !important;
  padding: 12px 8px !important;
  font-size: 0.90rem !important;
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
</style>
