<template>
  <div class="readiness-reports">
    <v-card class="mb-6">
      <v-card-title>Readiness Reports</v-card-title>
      <v-card-subtitle>View readiness metrics across ORAC, METT, and TRR</v-card-subtitle>
      <v-divider />

      <v-card-text>
        <table class="readiness-table">
          <thead>
            <tr class="header-row">
              <th colspan="2">PERCENTAGE<br>ORAC</th>
              <th colspan="2">PERCENTAGE<br>METT</th>
              <th>TRR</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="report in readinessReports" :key="report.id">
              <td class="metric-label">{{ report.label }}</td>
              <td class="metric-value">{{ report.oracPercentage }}%</td>
              <td class="metric-label">{{ report.label }}</td>
              <td class="metric-value">{{ report.mettPercentage }}%</td>
              <td class="trrValue">{{ report.trrPercentage }}%</td>
            </tr>
          </tbody>
        </table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const readinessReports = ref([
  { id: 1, label: '', oracPercentage: 0, mettPercentage: 0, trrPercentage: 0 },
  { id: 2, label: '', oracPercentage: 0, mettPercentage: 0, trrPercentage: 0 }
])
</script>

<style scoped>
.readiness-reports {
  padding: 1rem;
}

.readiness-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Roboto', sans-serif;
}

.readiness-table thead tr.header-row {
  background-color: #0066CC;
  color: white;
  font-weight: 600;
}

.readiness-table thead th {
  padding: 16px 12px;
  text-align: center;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  border-right: 1px solid #004999;
  line-height: 1.4;
}

.readiness-table thead th:last-child {
  border-right: none;
}

.readiness-table tbody tr {
  border-bottom: 1px solid #e0e0e0;
}

.readiness-table tbody td {
  padding: 16px 12px;
  text-align: center;
  border-right: 1px solid #e0e0e0;
}

.readiness-table tbody td:last-child {
  border-right: none;
}

.readiness-table tbody td.metric-label {
  text-align: center;
  font-size: 13px;
  color: #666;
}

.readiness-table tbody td.metric-value {
  font-weight: 500;
  font-size: 14px;
}

.readiness-table tbody td.trrValue {
  font-weight: 600;
  font-size: 14px;
}

.readiness-table tbody tr:hover {
  background-color: #f9f9f9;
}
</style>
