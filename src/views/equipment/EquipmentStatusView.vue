<template>
  <div class="equipment-status">
    <v-card class="mb-6">
      <v-card-title>Equipment Status</v-card-title>
      <v-card-subtitle>Monitor equipment condition and maintenance schedule</v-card-subtitle>
      <v-divider />

      <v-card-text>
        <v-row class="mb-6">
          <v-col cols="12" md="3">
            <v-sheet class="pa-4 rounded bg-info">
              <div class="text-h6">Total Equipment</div>
              <div class="text-h4 font-weight-bold">42</div>
            </v-sheet>
          </v-col>
          <v-col cols="12" md="3">
            <v-sheet class="pa-4 rounded bg-success">
              <div class="text-h6">Excellent</div>
              <div class="text-h4 font-weight-bold">25</div>
            </v-sheet>
          </v-col>
          <v-col cols="12" md="3">
            <v-sheet class="pa-4 rounded bg-warning">
              <div class="text-h6">Fair</div>
              <div class="text-h4 font-weight-bold">12</div>
            </v-sheet>
          </v-col>
          <v-col cols="12" md="3">
            <v-sheet class="pa-4 rounded bg-error">
              <div class="text-h6">Poor</div>
              <div class="text-h4 font-weight-bold">5</div>
            </v-sheet>
          </v-col>
        </v-row>

        <v-table>
          <thead>
            <tr>
              <th>Equipment Name</th>
              <th>Current Condition</th>
              <th>Last Maintenance</th>
              <th>Next Maintenance</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in statusItems" :key="item.id">
              <td>{{ item.name }}</td>
              <td>
                <v-chip :color="getConditionColor(item.condition)" size="small">
                  {{ item.condition }}
                </v-chip>
              </td>
              <td>{{ item.lastMaintenance }}</td>
              <td>{{ item.nextMaintenance }}</td>
              <td>
                <v-chip :color="item.needsAction ? 'warning' : 'success'" size="small">
                  {{ item.needsAction ? 'Action Needed' : 'OK' }}
                </v-chip>
              </td>
              <td>
                <v-btn icon="mdi-calendar" size="small" variant="text" color="primary" title="Schedule Maintenance" />
                <v-btn icon="mdi-note-plus" size="small" variant="text" color="info" title="Add Note" />
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

const statusItems = ref([
  { id: 1, name: 'Radar System', condition: 'excellent', lastMaintenance: '2024-05-20', nextMaintenance: '2024-08-20', needsAction: false },
  { id: 2, name: 'Communication Radio', condition: 'good', lastMaintenance: '2024-04-15', nextMaintenance: '2024-07-15', needsAction: false },
  { id: 3, name: 'Navigation Equipment', condition: 'fair', lastMaintenance: '2024-03-10', nextMaintenance: '2024-06-10', needsAction: true },
  { id: 4, name: 'Weapon System', condition: 'excellent', lastMaintenance: '2024-05-01', nextMaintenance: '2024-11-01', needsAction: false }
])

const getConditionColor = (condition) => {
  const colors = { excellent: 'success', good: 'info', fair: 'warning', poor: 'error' }
  return colors[condition] || 'secondary'
}
</script>

<style scoped>
.equipment-status {
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
