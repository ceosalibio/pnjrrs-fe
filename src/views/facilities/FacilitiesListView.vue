<template>
  <div class="facilities-list">
    <v-card class="mb-6">
      <v-card-title>Facilities List</v-card-title>
      <v-card-subtitle>View and manage all naval facilities</v-card-subtitle>
      <v-divider />

      <v-card-text>
        <div class="mb-4">
          <v-text-field
            v-model="searchQuery"
            placeholder="Search facilities..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            style="max-width: 300px"
            clearable
          />
        </div>

        <v-table>
          <thead>
            <tr>
              <th>Facility Name</th>
              <th>Type</th>
              <th>Location</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="facility in filteredFacilities" :key="facility.id">
              <td>{{ facility.name }}</td>
              <td>{{ facility.type }}</td>
              <td>{{ facility.location }}</td>
              <td>{{ facility.capacity }}</td>
              <td>
                <v-chip :color="facility.status === 'operational' ? 'success' : 'warning'" size="small">
                  {{ facility.status }}
                </v-chip>
              </td>
              <td>
                <v-btn icon="mdi-information" size="small" variant="text" color="info" @click="goToDetails(facility.id)" />
                <v-btn icon="mdi-tools" size="small" variant="text" color="warning" />
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
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')

const facilities = ref([
  { id: 1, name: 'Naval Base Cavite', type: 'Naval Base', location: 'Cavite', capacity: '5000 personnel', status: 'operational' },
  { id: 2, name: 'Manila Naval Dockyard', type: 'Shipyard', location: 'Manila', capacity: '3 vessels', status: 'operational' },
  { id: 3, name: 'Subic Naval Base', type: 'Naval Base', location: 'Subic', capacity: '3000 personnel', status: 'operational' }
])

const filteredFacilities = computed(() => {
  if (!searchQuery.value) return facilities.value
  return facilities.value.filter(f => f.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

const goToDetails = (id) => {
  router.push(`/facilities/details?id=${id}`)
}
</script>

<style scoped>
.facilities-list {
  padding: 1rem;
}
</style>
