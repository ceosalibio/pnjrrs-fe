<template>
  <dashboard-layout>
    <v-row class="mb-6">
      <v-col>
        <h1 class="text-h4 font-weight-600">Personnel Management</h1>
        <p class="text-gray-600">Manage Philippine Navy personnel records</p>
      </v-col>
      <v-col auto>
        <app-button
          label="Add Personnel"
          icon="mdi-plus"
          color="primary"
          @click="handleAddPersonnel"
        />
      </v-col>
    </v-row>

    <!-- Personnel Table -->
    <app-card elevation="1">
      <v-table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Rank</th>
            <th>Position</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="personnel in personnelList" :key="personnel.id">
            <td class="font-weight-600">{{ personnel.name }}</td>
            <td>{{ personnel.rank }}</td>
            <td>{{ personnel.position }}</td>
            <td>
              <v-chip
                :color="personnel.status === 'Active' ? 'success' : 'warning'"
                size="small"
                text-color="white"
              >
                {{ personnel.status }}
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
                    title="View"
                    prepend-icon="mdi-eye"
                    @click="handleViewPersonnel(personnel.id)"
                  />
                  <v-list-item
                    title="Edit"
                    prepend-icon="mdi-pencil"
                    @click="handleEditPersonnel(personnel.id)"
                  />
                  <v-list-item
                    title="Delete"
                    prepend-icon="mdi-trash-can"
                    @click="handleDeletePersonnel(personnel.id)"
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
import { mockPersonnel } from '@/utils/mockData'
import { useAppStore } from '@/stores/appStore'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import AppCard from '@/components/common/AppCard.vue'
import AppButton from '@/components/common/AppButton.vue'

const appStore = useAppStore()

const personnelList = ref([])

const handleAddPersonnel = () => {
  appStore.showSnackbar('Personnel management form would open here', 'info')
}

const handleViewPersonnel = (id) => {
  appStore.showSnackbar(`Viewing personnel #${id}`, 'info')
}

const handleEditPersonnel = (id) => {
  appStore.showSnackbar(`Editing personnel #${id}`, 'info')
}

const handleDeletePersonnel = (id) => {
  appStore.showDialog(
    'Delete Personnel',
    'Are you sure you want to delete this personnel record?',
    () => {
      appStore.showSnackbar('Personnel deleted successfully', 'success')
    }
  )
}

onMounted(() => {
  personnelList.value = mockPersonnel
})
</script>
