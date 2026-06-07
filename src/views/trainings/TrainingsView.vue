<template>
  <dashboard-layout>
    <v-row class="mb-6">
      <v-col>
        <h1 class="text-h4 font-weight-600">Training Programs</h1>
        <p class="text-gray-600">Manage training schedules and personnel development</p>
      </v-col>
      <v-col auto>
        <app-button
          label="Schedule Training"
          icon="mdi-plus"
          color="primary"
          @click="handleScheduleTraining"
        />
      </v-col>
    </v-row>

    <!-- Training Table -->
    <app-card elevation="1">
      <v-table>
        <thead>
          <tr>
            <th>Training Name</th>
            <th>Instructor</th>
            <th>Start Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="training in trainingsList" :key="training.id">
            <td class="font-weight-600">{{ training.name }}</td>
            <td>{{ training.instructor }}</td>
            <td>{{ training.startDate }}</td>
            <td>
              <v-chip
                :color="getStatusColor(training.status)"
                size="small"
                text-color="white"
              >
                {{ training.status }}
              </v-chip>
            </td>
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
                    @click="handleViewTraining(training.id)"
                  />
                  <v-list-item
                    title="Edit"
                    prepend-icon="mdi-pencil"
                    @click="handleEditTraining(training.id)"
                  />
                  <v-list-item
                    title="Delete"
                    prepend-icon="mdi-trash-can"
                    @click="handleDeleteTraining(training.id)"
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
import { mockTrainings } from '@/utils/mockData'
import { useAppStore } from '@/stores/appStore'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import AppCard from '@/components/common/AppCard.vue'
import AppButton from '@/components/common/AppButton.vue'

const appStore = useAppStore()

const trainingsList = ref([])

const getStatusColor = (status) => {
  const colors = {
    'Scheduled': 'info',
    'In Progress': 'warning',
    'Completed': 'success',
    'Cancelled': 'error'
  }
  return colors[status] || 'gray'
}

const handleScheduleTraining = () => {
  appStore.showSnackbar('Training scheduling form would open here', 'info')
}

const handleViewTraining = (id) => {
  appStore.showSnackbar(`Viewing training #${id}`, 'info')
}

const handleEditTraining = (id) => {
  appStore.showSnackbar(`Editing training #${id}`, 'info')
}

const handleDeleteTraining = (id) => {
  appStore.showDialog(
    'Delete Training',
    'Are you sure you want to delete this training program?',
    () => {
      appStore.showSnackbar('Training deleted successfully', 'success')
    }
  )
}

onMounted(() => {
  trainingsList.value = mockTrainings
})
</script>
