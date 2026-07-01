<template>
  <div class="personnel-add">
    <v-row class="mb-6">
      <!-- Summary Cards -->
      <v-col cols="12" md="3">
        <v-card class="summary-card">
          <v-card-title class="title-banner">TOTAL</v-card-title>
          <v-card-text>
            <div class="summary-row">
              <span>TO</span>
              <span class="value">{{ totalTO }}</span>
            </div>
            <div class="summary-row">
              <span>ACTUAL</span>
              <span class="value">{{ totalActual }}</span>
            </div>
          </v-card-text>
        </v-card>

        <v-card class="summary-card mt-4">
          <v-card-title class="title-banner">PERSONNEL FILL UP RATING</v-card-title>
          <v-card-text>
            <div class="summary-row">
              <span>Rating</span>
              <span class="value">{{ psoRating }}%</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Main Table -->
      <v-col cols="12" md="9">
        <v-card>
          <v-table class="data-table">
            <thead>
              <tr class="header-row">
                <th>GRADE</th>
                <th>TO</th>
                <th>ACTUAL</th>
              </tr>
            </thead>
            <tbody>
              <!-- Officer Section -->
              <tr class="section-header">
                <td colspan="3" class="section-title">Officer</td>
              </tr>
              <tr v-for="grade in officerGrades" :key="`officer-${grade.grade}`">
                <td>{{ grade.grade }}</td>
                <td class="text-center">{{ grade.to }}</td>
                <td class="text-center">{{ grade.actual }}</td>
              </tr>
              <tr class="sub-total">
                <td class="text-right font-weight-600">Sub-Total</td>
                <td class="text-center font-weight-600">{{ officerTO }}</td>
                <td class="text-center font-weight-600">{{ officerActual }}</td>
              </tr>

              <!-- Enlisted Section -->
              <tr class="section-header">
                <td colspan="3" class="section-title">Enlisted</td>
              </tr>
              <tr v-for="grade in enlistedGrades" :key="`enlisted-${grade.grade}`">
                <td>{{ grade.grade }}</td>
                <td class="text-center">{{ grade.to }}</td>
                <td class="text-center">{{ grade.actual }}</td>
              </tr>
              <tr class="sub-total">
                <td class="text-right font-weight-600">Sub-Total</td>
                <td class="text-center font-weight-600">{{ enlistedTO }}</td>
                <td class="text-center font-weight-600">{{ enlistedActual }}</td>
              </tr>

              <!-- Civilian Section -->
              <tr class="section-header">
                <td colspan="3" class="section-title">Civilian</td>
              </tr>
              <tr v-for="grade in civilianGrades" :key="`civilian-${grade.grade}`">
                <td>{{ grade.grade }}</td>
                <td class="text-center">{{ grade.to }}</td>
                <td class="text-center">{{ grade.actual }}</td>
              </tr>
              <tr class="sub-total">
                <td class="text-right font-weight-600">Sub-Total</td>
                <td class="text-center font-weight-600">{{ civilianTO }}</td>
                <td class="text-center font-weight-600">{{ civilianActual }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useReportStore } from '@/stores/reportStore'

const reportStore = useReportStore()

const officerGrades = ref([
  { grade: 'O10', to: 0, actual: 0 },
  { grade: 'O9', to: 0, actual: 0 },
  { grade: 'O8', to: 0, actual: 0 },
  { grade: 'O7', to: 0, actual: 0 },
  { grade: 'O6', to: 0, actual: 0 },
  { grade: 'O5', to: 0, actual: 0 },
  { grade: 'O4', to: 0, actual: 0 },
  { grade: 'O3', to: 0, actual: 0 },
  { grade: 'O2', to: 0, actual: 0 },
  { grade: 'O1', to: 0, actual: 0 }
])

const enlistedGrades = ref([
  { grade: 'E10', to: 0, actual: 0 },
  { grade: 'E9', to: 0, actual: 0 },
  { grade: 'E8', to: 0, actual: 0 },
  { grade: 'E7', to: 0, actual: 0 },
  { grade: 'E6', to: 0, actual: 0 },
  { grade: 'E5', to: 0, actual: 0 },
  { grade: 'E4', to: 0, actual: 0 },
  { grade: 'E3', to: 0, actual: 0 },
  { grade: 'E2', to: 0, actual: 0 },
  { grade: 'E1', to: 0, actual: 0 }
])

const civilianGrades = ref([
  { grade: 'SG24', to: 0, actual: 0 },
  { grade: 'SG23', to: 0, actual: 0 },
  { grade: 'SG22', to: 0, actual: 0 },
  { grade: 'SG21', to: 0, actual: 0 },
  { grade: 'SG20', to: 0, actual: 0 },
  { grade: 'SG19', to: 0, actual: 0 },
  { grade: 'SG18', to: 0, actual: 0 },
  { grade: 'SG17', to: 0, actual: 0 },
  { grade: 'SG16', to: 0, actual: 0 },
  { grade: 'SG15', to: 0, actual: 0 },
  { grade: 'SG14', to: 0, actual: 0 },
  { grade: 'SG13', to: 0, actual: 0 },
  { grade: 'SG12', to: 0, actual: 0 },
  { grade: 'SG11', to: 0, actual: 0 },
  { grade: 'SG10', to: 0, actual: 0 },
  { grade: 'SG9', to: 0, actual: 0 },
  { grade: 'SG8', to: 0, actual: 0 },
  { grade: 'SG7', to: 0, actual: 0 },
  { grade: 'SG6', to: 0, actual: 0 },
  { grade: 'SG5', to: 0, actual: 0 },
  { grade: 'SG4', to: 0, actual: 0 },
  { grade: 'SG3', to: 0, actual: 0 },
  { grade: 'SG2', to: 0, actual: 0 },
  { grade: 'SG1', to: 0, actual: 0 }
])

/**
 * Updates grade counts from personnel items
 * TO = count of items with matching grade
 * ACTUAL = count of items with matching grade_actual
 */
const updateGradeStats = () => {
  const items = reportStore.personnelItems || []

  // Reset all counts
  ;[...officerGrades.value, ...enlistedGrades.value, ...civilianGrades.value].forEach(g => {
    g.to = 0
    g.actual = 0
  })

  // Count TO (items with grade)
  items.forEach(item => {
    if (item.grade) {
      const gradeObj = [...officerGrades.value, ...enlistedGrades.value, ...civilianGrades.value].find(
        g => g.grade === item.grade
      )
      if (gradeObj) gradeObj.to++
    }
  })

  // Count ACTUAL (items with grade_actual)
  items.forEach(item => {
    if (item.grade_actual) {
      const gradeObj = [...officerGrades.value, ...enlistedGrades.value, ...civilianGrades.value].find(
        g => g.grade === item.grade_actual
      )
      if (gradeObj) gradeObj.actual++
    }
  })
}

// Watch for changes in personnelItems and update stats
watch(
  () => reportStore.personnelItems,
  () => updateGradeStats(),
  { deep: true, immediate: true }
)

const officerTO = computed(() => officerGrades.value.reduce((sum, g) => sum + g.to, 0))
const officerActual = computed(() => officerGrades.value.reduce((sum, g) => sum + g.actual, 0))

const enlistedTO = computed(() => enlistedGrades.value.reduce((sum, g) => sum + g.to, 0))
const enlistedActual = computed(() => enlistedGrades.value.reduce((sum, g) => sum + g.actual, 0))

const civilianTO = computed(() => civilianGrades.value.reduce((sum, g) => sum + g.to, 0))
const civilianActual = computed(() => civilianGrades.value.reduce((sum, g) => sum + g.actual, 0))

const totalTO = computed(() => officerTO.value + enlistedTO.value + civilianTO.value)
const totalActual = computed(() => officerActual.value + enlistedActual.value + civilianActual.value)

const psoRating = computed(() => {
  if (totalTO.value === 0) return 0
  let result = (totalActual.value / totalTO.value) * 100
  return result?result?.toFixed(2) : 0
})
</script>


<style scoped>
.personnel-add {
  padding: 1rem;
}

.summary-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.title-banner {
  background-color: #1976d2;
  color: white;
  padding: 12px 16px !important;
  font-size: 12px !important;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #e0e0e0;
  font-size: 14px;
}

.summary-row:last-child {
  border-bottom: none;
}

.summary-row .value {
  font-weight: 600;
  color: #1976d2;
  font-size: 18px;
}

.rating-table {
  width: 100%;
}

.rating-table thead tr.header-row {
  background-color: #1976d2;
  color: white;
}

.rating-table thead th {
  padding: 12px 8px;
  text-align: center;
  font-size: 12px;
  text-transform: uppercase;
  font-weight: 600;
  border-bottom: 2px solid #1976d2;
}

.rating-table thead th:first-child {
  text-align: left;
}

.rating-table tbody tr.section-header {
  background-color: #f5f5f5;
}

.rating-table tbody td.section-title {
  font-weight: 600;
  padding: 12px 8px;
  background-color: #f5f5f5;
  color: #333;
}

.rating-table tbody tr.sub-total {
  background-color: #e8e8e8;
  font-weight: 600;
}

.rating-table tbody td {
  padding: 10px 8px;
  border: 1px solid #e0e0e0;
  font-size: 14px;
}

.rating-table tbody tr:hover {
  background-color: #fafafa;
}

.rating-table tbody tr.sub-total:hover {
  background-color: #e8e8e8;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.font-weight-600 {
  font-weight: 600;
}
</style>
