<template>
  <div class="settings-permissions">
    <v-card class="mb-6">
      <v-card-title>Permissions Management</v-card-title>
      <v-card-subtitle>Configure role-based access control</v-card-subtitle>
      <v-divider />

      <v-card-text>
        <v-tabs v-model="activeTab">
          <v-tab value="admin">Admin</v-tab>
          <v-tab value="officer">Officer</v-tab>
          <v-tab value="user">User</v-tab>
        </v-tabs>

        <v-divider />

        <v-window v-model="activeTab">
          <v-window-item value="admin">
            <div class="pa-6">
              <h3 class="mb-4">Admin Permissions</h3>
              <v-checkbox
                v-for="perm in adminPermissions"
                :key="perm"
                :label="perm"
                checked
                class="mb-2"
              />
            </div>
          </v-window-item>

          <v-window-item value="officer">
            <div class="pa-6">
              <h3 class="mb-4">Officer Permissions</h3>
              <v-checkbox
                v-for="perm in officerPermissions"
                :key="perm"
                :label="perm"
                :model-value="true"
                class="mb-2"
                @update:model-value="updateOfficerPerm(perm, $event)"
              />
            </div>
          </v-window-item>

          <v-window-item value="user">
            <div class="pa-6">
              <h3 class="mb-4">User Permissions</h3>
              <v-checkbox
                v-for="perm in userPermissions"
                :key="perm"
                :label="perm"
                :model-value="true"
                class="mb-2"
                @update:model-value="updateUserPerm(perm, $event)"
              />
            </div>
          </v-window-item>
        </v-window>

        <v-divider class="my-6" />

        <div class="d-flex gap-2 justify-end">
          <v-btn variant="outlined" @click="resetPermissions">Reset to Default</v-btn>
          <v-btn color="primary">Save Permissions</v-btn>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAppStore } from '@/stores/appStore'

const appStore = useAppStore()
const activeTab = ref('admin')

const adminPermissions = ref([
  'View Dashboard',
  'Manage Personnel',
  'Manage Trainings',
  'Manage Equipment',
  'Manage Facilities',
  'View Reports',
  'System Settings',
  'User Management',
  'Permissions Management',
  'View Activity Logs'
])

const officerPermissions = ref([
  'View Dashboard',
  'View Personnel',
  'Manage Trainings',
  'Manage Equipment',
  'View Facilities',
  'View Reports'
])

const userPermissions = ref([
  'View Dashboard',
  'View Personnel',
  'View Trainings',
  'View Equipment',
  'View Facilities',
  'View Reports'
])

const updateOfficerPerm = (perm, value) => {
  // Handle permission update
}

const updateUserPerm = (perm, value) => {
  // Handle permission update
}

const resetPermissions = () => {
  appStore.showSnackbar('Permissions reset to default', 'info')
}
</script>

<style scoped>
.settings-permissions {
  padding: 1rem;
}
</style>
