<template>
  <div class="readiness-report">
    <v-card class="elevation-2">
      <v-card-title class="bg-primary text-white">Readiness Report</v-card-title>
      <v-card-text class="pa-0">
        <v-table class="elevation-1 custom-table" fixed-header height="70vh">
          <thead>
            <tr class="header-row">
              <th class="text-center">
                Category<br />(a)
              </th>
              <th class="text-center">
                Required<br />Area<br />(b)
              </th>
              <th class="text-center">
                Actual<br />Area<br />(c)
              </th>
              <th class="text-center">
                Quantitative<br />(c/b x 100)<br />(d)
              </th>
              <th class="text-center">
                Qualitative<br />(e)
              </th>
              <th class="text-center">
                Total<br />(d + e) / 2
              </th>
              <th class="text-center">
                Percentage<br />(Weighted<br />distribution)
              </th>
            </tr>
          </thead>
          <tbody>
            <!-- Data Rows -->
            <tr v-for="(item, i) in categories" :key="`data-${i}`">
              <td class="text-center font-weight-bold">
                {{ obj.master[`${item}name`] }}
              </td>
              <td class="text-center">
                {{ obj.master[`${item}required`] }}
              </td>
              <td class="text-center">
                {{ obj.master[`${item}actual`] }}
              </td>
              <td class="text-center">
                {{ obj.master[`${item}quantitativeResult`]?.toFixed(2) + '%' }}
              </td>
              <td class="text-center">
                {{ obj.master[`${item}qualitativeResult`]?.toFixed(2) + '%' }}
              </td>
              <td class="text-center">
                {{ obj.master[`${item}totalRating`]?.toFixed(2) + '%' }}
              </td>
              <td class="text-center">
                {{ obj.master[`${item}weight`]?.toFixed(2) + '%' }}
              </td>
            </tr>

            <!-- Total Row -->
            <tr class="total-row">
              <td colspan="6" class="text-right font-weight-bold">
                TOTAL
              </td>
              <td class="text-center font-weight-bold">
                {{ obj.result?.readiness?.toFixed(2) + '%' }}
              </td>
            </tr>

            <!-- REDCON Status Row -->
            <tr class="redcon-row">
              <td colspan="6" class="text-right font-weight-bold">
                REDCON STATUS
              </td>
              <td
                class="text-center font-weight-bold"
                :class="obj.result ? red.redStyle(red.redCon(obj.result.readiness)) : ''"
              >
                {{ obj.result ? red.redCon(obj.result.readiness) : '' }}
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { red } from '@/utils/redcon.js'

// Categories
const categories = ref(['pa', 'sa', 'hs', 'bp'])

// Mock data
const mockObj = ref({
  master: {
    // Physical Appearance
    paname: 'Physical Appearance',
    parequired: 100,
    paactual: 92,
    paquantitativeResult: 92.00,
    paqualitativeResult: 91.50,
    patotalRating: 91.75,
    paweight: 25.00,
    
    // Safety
    saname: 'Safety',
    sarequired: 100,
    saactual: 95,
    saquantitativeResult: 95.00,
    saqualitativeResult: 94.00,
    satotalRating: 94.50,
    saweight: 30.00,
    
    // Hygiene & Sanitation
    hsname: 'Hygiene & Sanitation',
    hsrequired: 100,
    hsactual: 98,
    hsquantitativeResult: 98.00,
    hsqualitativeResult: 97.50,
    hstotalRating: 97.75,
    hsweight: 25.00,
    
    // Building Plans & Documents
    bpname: 'Building Plans & Documents',
    bprequired: 100,
    bpactual: 85,
    bpquantitativeResult: 85.00,
    bpqualitativeResult: 87.00,
    bptotalRating: 86.00,
    bpweight: 20.00
  },
  result: {
    readiness: 91.45
  }
})

// Use mock data if obj is empty
const props = defineProps({
  obj: {
    type: Object,
    default: () => ({
      master: {},
      result: {}
    })
  }
})

const finalObj = computed(() => {
  if (!props.obj?.master || Object.keys(props.obj.master).length === 0) {
    return mockObj.value
  }
  return props.obj
})

// Expose finalObj for template
const obj = computed(() => finalObj.value)
</script>

<style scoped>
.readiness-report {
  padding: 1rem;
}

.custom-table {
  border-collapse: collapse;
}

.custom-table td {
  border-bottom: 1px solid #e0e0e0;
  padding: 12px 8px;
  vertical-align: middle;
}

/* Header Row */
.readiness-report :deep(thead .header-row th) {
  background-color: #1565C0 !important;
  color: white !important;
  font-weight: 700 !important;
  border-bottom: 3px solid #0D47A1 !important;
  padding: 16px 8px !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px !important;
  font-size: 0.85rem !important;
  line-height: 1.4 !important;
}

/* Total Row */
.total-row {
  background-color: #E3F2FD;
  font-weight: 600;
  border-top: 2px solid #1565C0;
  border-bottom: 2px solid #1565C0;
}

.total-row td {
  padding: 14px 8px !important;
}

/* REDCON Row */
.redcon-row {
  background-color: #FFF3E0;
  font-weight: 700;
  border-top: 2px solid #FF9800;
  border-bottom: 2px solid #FF9800;
}

.redcon-row td {
  padding: 14px 8px !important;
}

/* Text Utilities */
.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.font-weight-bold {
  font-weight: 600;
}

.bg-primary {
  background-color: #1976D2;
}

.text-white {
  color: white;
}

/* Responsive */
@media (max-width: 960px) {
  .custom-table td {
    padding: 8px 4px;
    font-size: 0.85rem;
  }

  .readiness-report :deep(thead .header-row th) {
    padding: 12px 4px !important;
    font-size: 0.75rem !important;
  }
}

@media (max-width: 600px) {
  .custom-table {
    font-size: 0.75rem;
  }

  .custom-table td {
    padding: 6px 2px;
  }
}
</style>
