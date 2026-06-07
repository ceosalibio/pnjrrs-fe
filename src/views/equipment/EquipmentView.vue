<template>
  <dashboard-layout>
    <v-row class="mb-6">
      <v-col>
        <h1 class="text-h4 font-weight-600">Equipment Management</h1>
        <p class="text-gray-600">Track and manage naval equipment inventory</p>
      </v-col>
      <v-col auto>
        <app-button
          label="Add Equipment"
          icon="mdi-plus"
          color="primary"
          @click="handleAddEquipment"
        />
      </v-col>
    </v-row>

    <!-- Equipment Table -->
    <app-card elevation="1">
      <v-table>
        <thead>
          <tr>
            <th>Equipment Name</th>
            <th>Model</th>
            <th>Status</th>
            <th>Last Maintenance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="equipment in equipmentList" :key="equipment.id">
            <td class="font-weight-600">{{ equipment.name }}</td>
            <td>{{ equipment.model }}</td>
            <td>
              <v-chip
                :color="getStatusColor(equipment.status)"
                size="small"
                text-color="white"
              >
                {{ equipment.status }}
              </v-chip>
            </td>
            <td>{{ equipment.lastMaintenance }}</td>
            <td>
              <v-menu>
                <template #activator="{ props }">
                  <v-btn
                    icon="mdi-dots-vertical"
                    variant="text"
                    size="small"
                    v-bind="props"
                  />
                </template>
                <v-list>
                  <v-list-item
                    title="View Details"
                    prepend-icon="mdi-eye"
                    @click="handleViewEquipment(equipment.id)"
                  />
                  <v-list-item
                    title="Edit"
                    prepend-icon="mdi-pencil"
                    @click="handleEditEquipment(equipment.id)"
                  />
                  <v-list-item
                    title="Schedule Maintenance"
                    prepend-icon="mdi-wrench"
                    @click="handleScheduleMaintenance(equipment.id)"
                  />
                  <v-list-item
                    title="Delete"
                    prepend-icon="mdi-trash-can"
                    @click="handleDeleteEquipment(equipment.id)"
                  />
                </v-list>
              </v-menu>
            </td>
          </tr>
        </tbody>
      </v-table>
    </app-card>
  </dashboard-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { mockEquipment } from '@/utils/mockData'
import { useAppStore } from '@/stores/appStore'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import AppCard from '@/components/common/AppCard.vue'
import AppButton from '@/components/common/AppButton.vue'

const appStore = useAppStore()

const equipmentList = ref([])

const getStatusColor = (status) => {
  const colors = {
    'Operational': 'success',
    'Maintenance': 'warning',
    'Out of Service': 'error',
    'Under Repair': 'warning'
  }
  return colors[status] || 'gray'
}

const handleAddEquipment = () => {
  appStore.showSnackbar('Equipment form would open here', 'info')
}

const handleViewEquipment = (id) => {
  appStore.showSnackbar(`Viewing equipment #${id}`, 'info')
}

const handleEditEquipment = (id) => {
  appStore.showSnackbar(`Editing equipment #${id}`, 'info')
}

const handleScheduleMaintenance = (id) => {
  appStore.showSnackbar(`Scheduling maintenance for equipment #${id}`, 'info')
}

const handleDeleteEquipment = (id) => {
  appStore.showDialog(
    'Delete Equipment',
    'Are you sure you want to delete this equipment record?',
    () => {
      appStore.showSnackbar('Equipment deleted successfully', 'success')
    }
  )
}

onMounted(() => {
  equipmentList.value = mockEquipment
})
</script>
