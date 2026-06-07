<template>
  <div class="mett-list">
    <v-card class="mb-6">
      <v-card-title>Mission Essential Task Training (METT)</v-card-title>
      <v-card-subtitle>View and manage quarterly training schedules</v-card-subtitle>
      <v-divider />

      <v-card-text>
        <table class="mett-table">
          <thead>
            <tr class="header-row">
              <th class="mission-col">MISSION<br>ESSENTIAL<br>TASK</th>
              <th>1st Qtr</th>
              <th>2nd Qtr</th>
              <th>3rd Qtr</th>
              <th>4th Qtr</th>
              <th>Required</th>
              <th>Actual</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in mettTasks" :key="task.id">
              <td class="mission-col">{{ task.missionTask }}</td>
              <td class="training-cell" :class="{ 'highlighted': task.q1 }">{{ task.q1 }}</td>
              <td class="training-cell" :class="{ 'highlighted': task.q2 }">{{ task.q2 }}</td>
              <td class="training-cell" :class="{ 'highlighted': task.q3 }">{{ task.q3 }}</td>
              <td class="training-cell" :class="{ 'highlighted': task.q4 }">{{ task.q4 }}</td>
              <td class="text-center">{{ task.required }}</td>
              <td class="text-center">{{ task.actual }}</td>
              <td class="text-center">{{ task.percentage }}%</td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="summary-row">
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td class="text-center"><strong>{{ totalRequired }}</strong></td>
              <td class="text-center"><strong>{{ totalActual }}</strong></td>
              <td class="text-center"><strong>{{ totalPercentage }}%</strong></td>
            </tr>
          </tfoot>
        </table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const mettTasks = ref([
  { id: 1, missionTask: 'Amphibious Operations', q1: 'Landing Operations', q2: '', q3: 'Marksmanship', q4: '', required: 2, actual: 0, percentage: 0 },
  { id: 2, missionTask: 'Interagency Cooperation', q1: '', q2: 'Balikatan 2023', q3: 'Flash Piston', q4: '', required: 2, actual: 0, percentage: 0 },
  { id: 3, missionTask: 'sample', q1: '', q2: '', q3: '', q4: 'sample', required: 1, actual: 0, percentage: 0 }
])

const totalRequired = computed(() => {
  return mettTasks.value.reduce((sum, task) => sum + task.required, 0)
})

const totalActual = computed(() => {
  return mettTasks.value.reduce((sum, task) => sum + task.actual, 0)
})

const totalPercentage = computed(() => {
  if (totalRequired.value === 0) return 0
  return Math.round((totalActual.value / totalRequired.value) * 100)
})
</script>

<style scoped>
.mett-list {
  padding: 1rem;
}

.mett-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Roboto', sans-serif;
}

.mett-table thead tr.header-row {
  background-color: #0066CC;
  color: white;
  font-weight: 600;
}

.mett-table thead th {
  padding: 12px 8px;
  text-align: center;
  font-size: 12px;
  text-transform: uppercase;
  border: 1px solid #0066CC;
  line-height: 1.2;
}

.mett-table th.mission-col {
  text-align: left;
  min-width: 150px;
}

.mett-table tbody td {
  padding: 10px 8px;
  border: 1px solid #e0e0e0;
  text-align: center;
}

.mett-table tbody td.mission-col {
  text-align: left;
  font-weight: 500;
  min-width: 150px;
}

.mett-table tbody td.training-cell.highlighted {
  background-color: #FFB81C;
  font-weight: 600;
  color: #333;
}

.mett-table tbody td.training-cell {
  background-color: #f9f9f9;
}

.mett-table tbody tr:hover {
  background-color: #f5f5f5;
}

.mett-table tfoot tr.summary-row {
  background-color: #f5f5f5;
  font-weight: 600;
  border-top: 2px solid #0066CC;
}

.mett-table tfoot td {
  padding: 12px 8px;
  border: 1px solid #e0e0e0;
  text-align: center;
}

.text-center {
  text-align: center;
}
</style>
