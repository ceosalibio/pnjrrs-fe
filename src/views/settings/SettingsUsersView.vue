<template>
  <div class="settings-users">
    <v-card class="mb-6">
      <v-card-title>User Management</v-card-title>
      <v-card-subtitle>Manage system users and their roles</v-card-subtitle>
      <v-divider />

      <v-card-text>
        <div class="mb-4 d-flex justify-space-between align-center">
          <v-text-field
            v-model="searchQuery"
            placeholder="Search users..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            style="max-width: 300px"
            clearable
          />
          <v-btn color="primary" prepend-icon="mdi-plus">Add User</v-btn>
        </div>

        <v-table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id">
              <td>{{ user.username }}</td>
              <td>{{ user.email }}</td>
              <td>
                <v-chip :color="getRoleColor(user.role)" size="small">
                  {{ user.role }}
                </v-chip>
              </td>
              <td>
                <v-chip :color="user.status === 'active' ? 'success' : 'warning'" size="small">
                  {{ user.status }}
                </v-chip>
              </td>
              <td>{{ user.lastLogin }}</td>
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

const users = ref([
  { id: 1, username: 'admin', email: 'admin@pnay.gov.ph', role: 'admin', status: 'active', lastLogin: '2024-06-05 14:30' },
  { id: 2, username: 'officer1', email: 'officer1@pnay.gov.ph', role: 'officer', status: 'active', lastLogin: '2024-06-05 10:15' },
  { id: 3, username: 'user1', email: 'user1@pnay.gov.ph', role: 'user', status: 'active', lastLogin: '2024-06-04 09:45' },
  { id: 4, username: 'officer2', email: 'officer2@pnay.gov.ph', role: 'officer', status: 'inactive', lastLogin: '2024-05-28 16:20' }
])

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(u => 
    u.username.toLowerCase().includes(query) || 
    u.email.toLowerCase().includes(query)
  )
})

const getRoleColor = (role) => {
  const colors = { admin: 'error', officer: 'primary', user: 'info' }
  return colors[role] || 'secondary'
}
</script>

<style scoped>
.settings-users {
  padding: 1rem;
}
</style>
