<template>
  <div class="facilities-maintenance">
    <v-card class="mb-6">
      <v-card-title>Facility Maintenance</v-card-title>
      <v-card-subtitle>Schedule and track maintenance activities</v-card-subtitle>
      <v-divider />

      <v-card-text>
        <v-row class="mb-6">
          <v-col cols="12" md="3">
            <v-sheet class="pa-4 rounded bg-info">
              <div class="text-h6">Scheduled</div>
              <div class="text-h4 font-weight-bold">8</div>
            </v-sheet>
          </v-col>
          <v-col cols="12" md="3">
            <v-sheet class="pa-4 rounded bg-warning">
              <div class="text-h6">In Progress</div>
              <div class="text-h4 font-weight-bold">3</div>
            </v-sheet>
          </v-col>
          <v-col cols="12" md="3">
            <v-sheet class="pa-4 rounded bg-success">
              <div class="text-h6">Completed</div>
              <div class="text-h4 font-weight-bold">24</div>
            </v-sheet>
          </v-col>
          <v-col cols="12" md="3">
            <v-sheet class="pa-4 rounded bg-error">
              <div class="text-h6">Overdue</div>
              <div class="text-h4 font-weight-bold">1</div>
            </v-sheet>
          </v-col>
        </v-row>

        <v-btn color="primary" prepend-icon="mdi-plus" class="mb-4">
          Schedule New Maintenance
        </v-btn>

        <v-table>
          <thead>
            <tr>
              <th>Facility</th>
              <th>Maintenance Type</th>
              <th>Scheduled Date</th>
              <th>Contractor</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="maintenance in maintenanceItems" :key="maintenance.id">
              <td>{{ maintenance.facility }}</td>
              <td>{{ maintenance.type }}</td>
              <td>{{ maintenance.scheduledDate }}</td>
              <td>{{ maintenance.contractor }}</td>
              <td>
                <v-chip :color="getStatusColor(maintenance.status)" size="small">
                  {{ maintenance.status }}
                </v-chip>
              </td>
              <td>
                <v-btn icon="mdi-pencil" size="small" variant="text" color="primary" />
                <v-btn icon="mdi-delete" size="small" variant="text" color="error" />
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const maintenanceItems = ref([
  { id: 1, facility: 'Naval Base Cavite', type: 'Electrical System', scheduledDate: '2024-06-15', contractor: 'ElectroServe Corp', status: 'scheduled' },
  { id: 2, facility: 'Manila Naval Dockyard', type: 'Dock Repair', scheduledDate: '2024-06-10', contractor: 'Global Dockworks', status: 'in-progress' },
  { id: 3, facility: 'Subic Naval Base', type: 'roof Inspection', scheduledDate: '2024-05-20', contractor: 'BuildRight Inc', status: 'completed' }
])

const getStatusColor = (status) => {
  const colors = { scheduled: 'info', 'in-progress': 'warning', completed: 'success', overdue: 'error' }
  return colors[status] || 'secondary'
}
</script>

<style scoped>
.facilities-maintenance {
  padding: 1rem;
}

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
