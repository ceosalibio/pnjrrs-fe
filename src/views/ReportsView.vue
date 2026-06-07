<template>
  <div class="reports-view">
    <v-card class="mb-6">
      <v-card-title>Reports</v-card-title>
      <v-card-subtitle>View and manage system reports</v-card-subtitle>
      <v-divider />

      <v-card-text>
        <v-row class="mb-6">
          <v-col cols="12" md="3">
            <v-sheet class="pa-4 rounded bg-info">
              <div class="text-h6">Total Reports</div>
              <div class="text-h4 font-weight-bold">32</div>
            </v-sheet>
          </v-col>
          <v-col cols="12" md="3">
            <v-sheet class="pa-4 rounded bg-success">
              <div class="text-h6">Generated</div>
              <div class="text-h4 font-weight-bold">28</div>
            </v-sheet>
          </v-col>
          <v-col cols="12" md="3">
            <v-sheet class="pa-4 rounded bg-warning">
              <div class="text-h6">Pending</div>
              <div class="text-h4 font-weight-bold">3</div>
            </v-sheet>
          </v-col>
          <v-col cols="12" md="3">
            <v-sheet class="pa-4 rounded bg-error">
              <div class="text-h6">Failed</div>
              <div class="text-h4 font-weight-bold">1</div>
            </v-sheet>
          </v-col>
        </v-row>

        <div class="mb-4 d-flex justify-space-between align-center">
          <v-text-field
            v-model="searchQuery"
            placeholder="Search reports..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            style="max-width: 300px"
            clearable
          />
          <v-btn color="primary" prepend-icon="mdi-plus">Generate Report</v-btn>
        </div>

        <v-table>
          <thead>
            <tr>
              <th>Report Name</th>
              <th>Type</th>
              <th>Generated Date</th>
              <th>Status</th>
              <th>Format</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="report in filteredReports" :key="report.id">
              <td>{{ report.name }}</td>
              <td>{{ report.type }}</td>
              <td>{{ report.date }}</td>
              <td>
                <v-chip :color="getStatusColor(report.status)" size="small">
                  {{ report.status }}
                </v-chip>
              </td>
              <td>{{ report.format }}</td>
              <td>
                <v-btn icon="mdi-download" size="small" variant="text" color="primary" title="Download" />
                <v-btn icon="mdi-eye" size="small" variant="text" color="info" title="View" />
                <v-btn icon="mdi-delete" size="small" variant="text" color="error" title="Delete" />
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

const searchQuery = ref('')

const reports = ref([
  { id: 1, name: 'Personnel Summary Report', type: 'Personnel', date: '2024-06-05', status: 'generated', format: 'PDF' },
  { id: 2, name: 'Monthly Training Report', type: 'Training', date: '2024-06-01', status: 'generated', format: 'Excel' },
  { id: 3, name: 'Equipment Status Report', type: 'Equipment', date: '2024-05-28', status: 'generated', format: 'PDF' },
  { id: 4, name: 'Facility Maintenance Log', type: 'Facilities', date: '2024-05-20', status: 'pending', format: 'PDF' },
  { id: 5, name: 'Activity Summary', type: 'System', date: '2024-05-15', status: 'generated', format: 'Excel' }
])

const filteredReports = computed(() => {
  if (!searchQuery.value) return reports.value
  const query = searchQuery.value.toLowerCase()
  return reports.value.filter(r => r.name.toLowerCase().includes(query))
})

const getStatusColor = (status) => {
  const colors = { generated: 'success', pending: 'warning', failed: 'error' }
  return colors[status] || 'info'
}
</script>

<style scoped>
.reports-view {
  padding: 1rem;
}

.bg-info {
  background-color: #2196F3;
  color: white;
}

.bg-success {
  background-color: #4CAF50;
  color: white;
}

.bg-warning {
  background-color: #FF9800;
  color: white;
}

.bg-error {
  background-color: #F44336;
  color: white;
}
</style>
