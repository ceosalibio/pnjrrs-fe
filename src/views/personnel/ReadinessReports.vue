<template>
  <div class="personnel-reports">
    <v-card class="mb-6">
      <v-card-title>Personnel Readiness Report</v-card-title>
      <v-card-subtitle>Overall personnel readiness assessment and rating</v-card-subtitle>
      <v-divider />

      <v-card-text>
        <!-- Rating Summary Table -->
        <v-table class="rating-summary-table mb-8">
          <thead>
            <tr class="header-row">
              <th>RATING</th>
              <th>PERCENTAGE</th>
              <th>WEIGHT PERCENTAGE</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>PSGR (50%)</td>
              <td class="text-center">{{ psgrPercentage }}%</td>
              <td class="text-center">{{ psgrWeightedPercentage }}%</td>
            </tr>
            <tr>
              <td>Personnel Qualification Rating (50%)</td>
              <td class="text-center">{{ pqrPercentage }}%</td>
              <td class="text-center">{{ pqrWeightedPercentage }}%</td>
            </tr>
            <tr>
              <td>PQR (40%)</td>
              <td class="text-center">{{ pqrDetailPercentage }}%</td>
              <td class="text-center">{{ pqrDetailWeightedPercentage }}%</td>
            </tr>
            <tr>
              <td>PSR (60%)</td>
              <td class="text-center">{{ psrPercentage }}%</td>
              <td class="text-center">{{ psrWeightedPercentage }}%</td>
            </tr>
            <tr class="total-row">
              <td class="font-weight-600">TOTAL (PSGR + PQR)</td>
              <td class="text-center"></td>
              <td class="text-center font-weight-600">{{ totalWeightedPercentage }}%</td>
            </tr>
          </tbody>
        </v-table>

        <!-- Assessment Section -->
        <div class="assessment-section">
          <h3 class="assessment-title">Assessment:</h3>

          <div class="assessment-item">
            <div class="question-header">
              a. What capability shortfall exists or what has occurred to cause the lower assessment, and which elements of operational preparedness are affected?
            </div>
            <v-text-field
              v-model="assessmentA"
              variant="outlined"
              placeholder="Enter assessment..."
              class="mt-2"
            />
          </div>

          <div class="assessment-item">
            <div class="question-header">
              b. What are the consequences of the lower level of readiness?
            </div>
            <v-text-field
              v-model="assessmentB"
              variant="outlined"
              placeholder="Enter assessment..."
              class="mt-2"
            />
          </div>

          <div class="assessment-item">
            <div class="question-header">
              c. What is required to remedy the situation?
            </div>
            <v-text-field
              v-model="assessmentC"
              variant="outlined"
              placeholder="Enter assessment..."
              class="mt-2"
            />
          </div>

          <div class="assessment-item">
            <div class="question-header">
              d. What level is achievable within a prescribed period?
            </div>
            <v-text-field
              v-model="assessmentD"
              variant="outlined"
              placeholder="Enter assessment..."
              class="mt-2"
            />
          </div>

          <div class="d-flex gap-2 justify-end mt-6">
            <v-btn variant="outlined" @click="reset">Clear</v-btn>
            <v-btn color="primary" @click="save">Save Report</v-btn>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Rating percentages
const psgrPercentage = ref(0)
const pqrPercentage = ref(0)
const pqrDetailPercentage = ref(0)
const psrPercentage = ref(0)

// Assessment fields
const assessmentA = ref('')
const assessmentB = ref('')
const assessmentC = ref('')
const assessmentD = ref('')

// Computed weighted percentages
const psgrWeightedPercentage = computed(() => {
  return Math.round((psgrPercentage.value * 50) / 100)
})

const pqrWeightedPercentage = computed(() => {
  return Math.round((pqrPercentage.value * 50) / 100)
})

const pqrDetailWeightedPercentage = computed(() => {
  return Math.round((pqrDetailPercentage.value * 40) / 100)
})

const psrWeightedPercentage = computed(() => {
  return Math.round((psrPercentage.value * 60) / 100)
})

const totalWeightedPercentage = computed(() => {
  return psgrWeightedPercentage.value + pqrWeightedPercentage.value
})

const reset = () => {
  psgrPercentage.value = 0
  pqrPercentage.value = 0
  pqrDetailPercentage.value = 0
  psrPercentage.value = 0
  assessmentA.value = ''
  assessmentB.value = ''
  assessmentC.value = ''
  assessmentD.value = ''
}

const save = () => {
  console.log({
    psgrPercentage: psgrPercentage.value,
    pqrPercentage: pqrPercentage.value,
    pqrDetailPercentage: pqrDetailPercentage.value,
    psrPercentage: psrPercentage.value,
    assessments: {
      a: assessmentA.value,
      b: assessmentB.value,
      c: assessmentC.value,
      d: assessmentD.value
    }
  })
  alert('Report saved successfully!')
}
</script>

<style scoped>
.personnel-reports {
  padding: 1rem;
}

.rating-summary-table {
  width: 100%;
  margin-bottom: 2rem;
}

.rating-summary-table thead tr.header-row {
  background-color: #1976d2;
  color: white;
}

.rating-summary-table thead th {
  padding: 12px 16px;
  text-align: center;
  font-size: 12px;
  text-transform: uppercase;
  font-weight: 600;
  border-bottom: 2px solid #1976d2;
}

.rating-summary-table thead th:first-child {
  text-align: left;
}

.rating-summary-table tbody td {
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  font-size: 14px;
}

.rating-summary-table tbody tr.total-row {
  background-color: #e8e8e8;
  font-weight: 600;
}

.rating-summary-table tbody tr:hover {
  background-color: #f9f9f9;
}

.rating-summary-table tbody tr.total-row:hover {
  background-color: #e8e8e8;
}

.text-center {
  text-align: center;
}

.assessment-section {
  margin-top: 2rem;
}

.assessment-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

.assessment-item {
  margin-bottom: 24px;
}

.question-header {
  background-color: #e8e8e8;
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 500;
  color: #333;
  border-radius: 4px 4px 0 0;
  line-height: 1.5;
}

.font-weight-600 {
  font-weight: 600;
}

.mb-8 {
  margin-bottom: 32px;
}
</style>
