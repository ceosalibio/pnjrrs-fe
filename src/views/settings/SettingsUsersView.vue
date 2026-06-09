<template>
  <div class="settings-users">
    <!-- Add User Dialog -->
    <add-user-dialog
      v-model:open="isAddUserDialogOpen"
      @user-created="handleUserCreated"
      @error="handleDialogError"
    />

    <v-card class="mb-6">
      <v-card-title>User Management</v-card-title>
      <v-card-subtitle>Manage system users and their roles</v-card-subtitle>
      <v-divider />

      <v-card-text>
        <div class="mb-4 d-flex justify-space-between align-center ga-2">
          <AppTextField
            v-model="searchQuery"
            placeholder="Search users..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            clearable
            hide-details
          />
           <AppAutocomplete
            label="Category"
            variant="outlined"
            density="compact"
            clearable
            hide-details

          />
          <!-- <AppAutocomplete
            label="Category"
            variant="outlined"
            density="compact"
            clearable
          /> -->
          <AppAutocomplete
            label="Unit"
            variant="outlined"
            density="compact"
            clearable
            hide-details
          />
           <AppAutocomplete
            label="Subunit"
            variant="outlined"
            density="compact"
            clearable
            hide-details
          />
           <AppAutocomplete
            label="Office"
            variant="outlined"
            density="compact"
            clearable
            hide-details
          />
          <v-btn color="primary" prepend-icon="mdi-plus" @click="openAddUserDialog">Add User</v-btn>
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
import AppTextField from '@/components/forms/AppTextField.vue'
import AppAutocomplete from '@/components/forms/AppAutocomplete.vue'
import AddUserDialog from '@/components/forms/AddUserDialog.vue'

// Dialog state
const isAddUserDialogOpen = ref(false)

// Search state
const searchQuery = ref('')

// Users data
const users = ref([
  { id: 1, username: 'admin', email: 'admin@pnay.gov.ph', role: 'admin', status: 'active', lastLogin: '2024-06-05 14:30' },
  { id: 2, username: 'officer1', email: 'officer1@pnay.gov.ph', role: 'officer', status: 'active', lastLogin: '2024-06-05 10:15' },
  { id: 3, username: 'user1', email: 'user1@pnay.gov.ph', role: 'user', status: 'active', lastLogin: '2024-06-04 09:45' },
  { id: 4, username: 'officer2', email: 'officer2@pnay.gov.ph', role: 'officer', status: 'inactive', lastLogin: '2024-05-28 16:20' }
])

/**
 * Open Add User Dialog
 */
const openAddUserDialog = () => {
  isAddUserDialogOpen.value = true
}

/**
 * Handle user created event from dialog
 * @param {Object} newUser - The newly created user object
 */
const handleUserCreated = (newUser) => {
  users.value.push({
    id: newUser.id,
    username: newUser.username,
    email: newUser.username, // TODO: Update to use actual email when available
    role: 'user', // Default role, can be customized
    status: 'active',
    lastLogin: 'Never'
  })
  
  // Show success message
  console.log('User created successfully:', newUser)
  // TODO: Integrate with snackbar/toast notification
}

/**
 * Handle dialog error event
 * @param {string} error - Error message
 */
const handleDialogError = (error) => {
  console.error('Error:', error)
  // TODO: Integrate with snackbar/toast notification
}

/**
 * Computed property for filtered users based on search query
 */
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(u => 
    u.username.toLowerCase().includes(query) || 
    u.email.toLowerCase().includes(query)
  )
})

/**
 * Get badge color based on user role
 * @param {string} role - User role
 * @returns {string} Color class
 */
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
