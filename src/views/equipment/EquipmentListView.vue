<template>
  <div class="equipment-list">
    <v-card class="mb-6">
      <v-card-title>Equipment List</v-card-title>
      <v-card-subtitle>Manage and track all naval equipment</v-card-subtitle>
      <v-divider />

      <v-card-text>
        <div class="d-flex justify-space-between align-center mb-4">
          <v-text-field
            v-model="searchQuery"
            placeholder="Search equipment..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            style="max-width: 300px"
            clearable
          />
          <router-link to="/equipment/add">
            <v-btn color="primary" prepend-icon="mdi-plus">Add Equipment</v-btn>
          </router-link>
        </div>

        <v-table>
          <thead>
            <tr>
              <th>Equipment Name</th>
              <th>Category</th>
              <th>Serial Number</th>
              <th>Quantity</th>
              <th>Condition</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="equipment in filteredEquipment" :key="equipment.id">
              <td>{{ equipment.name }}</td>
              <td>{{ equipment.category }}</td>
              <td>{{ equipment.serial }}</td>
              <td>{{ equipment.quantity }}</td>
              <td>
                <v-chip :color="getConditionColor(equipment.condition)" size="small">
                  {{ equipment.condition }}
                </v-chip>
              </td>
              <td>{{ equipment.location }}</td>
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
import { ref, computed } from 'vue'

const searchQuery = ref('')

const equipment = ref([
  { id: 1, name: 'Radar System', category: 'Electronics', serial: 'RS-001', quantity: 2, condition: 'excellent', location: 'Main Base' },
  { id: 2, name: 'Communication Radio', category: 'Communications', serial: 'CR-002', quantity: 10, condition: 'good', location: 'Main Base' },
  { id: 3, name: 'Navigation Equipment', category: 'Navigation', serial: 'NE-003', quantity: 5, condition: 'good', location: 'Harbor' }
])

const filteredEquipment = computed(() => {
  if (!searchQuery.value) return equipment.value
  return equipment.value.filter(e => e.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

const getConditionColor = (condition) => {
  const colors = { excellent: 'success', good: 'info', fair: 'warning', poor: 'error' }
  return colors[condition] || 'secondary'
}
</script>

<style scoped>
.equipment-list {
  padding: 1rem;
}
</style>
