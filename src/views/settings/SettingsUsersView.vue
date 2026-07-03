<template>
  <div class="settings-users">
    <!-- Add User Dialog -->
    <add-user-dialog
      ref="addUserDialogRef"
      v-model:open="isAddUserDialogOpen"
      @user-created="handleUserCreated"
      @user-updated="handleUserUpdated"
      @error="handleDialogError"
    />

    <!-- Delete Confirmation Dialog -->
    <app-dialog
      v-model="isDeleteDialogOpen"
      title="Delete User"
      :message="`Are you sure you want to delete user '${userToDelete?.name}'? This action cannot be undone.`"
      confirm-text="Delete"
      cancel-text="Cancel"
      confirm-color="error"
      max-width="400px"
      @confirm="confirmDeleteUser"
    />

    <v-card class="mb-6">
      <v-card-title>User Management</v-card-title>
      <v-card-subtitle>Manage system users and their roles</v-card-subtitle>
      <v-divider />

      <v-card-text>
        <!-- Filters and Action Button Row -->
        <div class="d-flex gap-3 mb-4 align-center">

          <AppTextField
            v-model="filterStore.search"
            placeholder="Search users..."
            prepend-inner-icon="mdi-magnify"
            class="flex-grow-1"
            density="compact"
            hide-details
          />
          <AppAutocomplete 
            label="Units"
            v-model="filterStore.unit"
            :text="'name'"
            :value="'id'"
            :items="filterStore.organizationFilterItems.units"
            class="flex-grow-1"
          />
          <AppAutocomplete 
            label="Subunits"
            v-model="filterStore.subunit"
            :text="'name'"
            :value="'id'"
            :items="filterStore.organizationFilterItems.subunits"
            class="flex-grow-1"
          />
          <AppAutocomplete 
              label="Offices"
              v-model="filterStore.office"
              :text="'name'"
              :value="'id'"
              :items="filterStore.organizationFilterItems.offices"
              class="flex-grow-1"
            />
            <AppAutocomplete 
              label="Suboffices"
              v-model="filterStore.suboffice"
              :text="'name'"
              :value="'id'"
              :items="filterStore.organizationFilterItems.suboffices"
              class="flex-grow-1"
            />
          <v-spacer />
          <AppButton 
            color="primary" 
            @on-click="openAddUserDialog"
          >
            Add User
          </AppButton>
        </div>

       

        <v-table>
          <thead class="table-header">
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Unit</th>
              <th>Sub Unit</th>
              <th>Office</th>
              <th>Sub office</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user,i) in users" :key="i">
              <td>{{ user?.rank?.name }}  {{ user.name }}</td>
              <td>{{ user.email || user.username }}</td>
              <td>{{ user?.unit?.name }}</td>
              <td>{{ user?.sub_unit?.name }}</td>
              <td>{{ user?.office?.name }}</td>
              <td>{{ user?.sub_office?.name }}</td>
              <td>
                <v-btn icon="mdi-pencil" size="small" variant="text" color="primary" @click="handleEditUser(user)" />
                <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="handleDeleteUser(user)" />
              </td>
            </tr>
          </tbody>
        </v-table>

        <!-- Pagination -->
          <AppPagination
            :current-page="currentPage"
            :total-pages="lastPage"
            :total-items="total"
            :per-page="perPage"
            @page-change="onPageChange"
          />
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import AppTextField from '@/components/forms/AppTextField.vue'
import AppAutocomplete from '@/components/forms/AppAutocomplete.vue'
import AddUserDialog from '@/components/forms/AddUserDialog.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppDialog from '@/components/common/AppDialog.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import { useAuthStore } from '@/stores/authStore.js'
import { useFilterStore } from '@/stores/filterStore.js'
import { useUser } from '@/composables/useUser.js'
import { useSnackbar } from '@/composables/useSnackbar.js'

const filterStore = useFilterStore()
const authStore = useAuthStore()
const { showSuccess, showError } = useSnackbar()


// Initialize useUser composable
const {  
  fetchUsers,
  users,
  currentPage,
  perPage,
  lastPage,
  total,
  removeUser
 } = useUser()

// Form reference to access dialog methods
const addUserDialogRef = ref(null)

// Dialog state
const isAddUserDialogOpen = ref(false)

// Delete confirmation dialog state
const isDeleteDialogOpen = ref(false)
const userToDelete = ref(null)

// Users data
// const users = ref([])

// Pagination state
// const currentPage = ref(1)
// const perPage = ref(15)
// const lastPage = ref(1)
// const total = ref(0)
const isLoadingUsers = ref(false)



/**
 * Open Add User Dialog
 */
const openAddUserDialog = async () => {
  isAddUserDialogOpen.value = true
}

/**
 * Handle edit user - open dialog with user data
 * @param {Object} user - User to edit
 */
const handleEditUser = (user) => {
  addUserDialogRef.value?.openEditDialog(user)
}

/**
 * Handle user created event from dialog
 * @param {Object} newUser - The newly created user object
 */
const handleUserCreated = (newUser) => {
  showSuccess('User created successfully')
  // Reload current page to show newly created user
  loadUsers(currentPage.value)
}

/**
 * Handle user updated event from dialog
 * @param {Object} updatedUser - The updated user object
 */
const handleUserUpdated = (updatedUser) => {
  showSuccess('User updated successfully')
  // Reload current page to show updated user
  loadUsers(currentPage.value)
}

/**
 * Handle error event from dialog
 * @param {string} errorMessage - Error message from dialog
 */
const handleDialogError = (errorMessage) => {
  showError(errorMessage)
}

/**
 * Open delete confirmation dialog
 * @param {Object} user - User to delete
 */
const handleDeleteUser = (user) => {
  userToDelete.value = user
  isDeleteDialogOpen.value = true
}

/**
 * Confirm delete user
 */
const confirmDeleteUser = async () => {
  if (!userToDelete.value) return

  try {
    const response = await removeUser(userToDelete.value.id)
    
    if (response?.status === 'success' || response?.success) {
      showSuccess('User deleted successfully')
      // Close dialog
      isDeleteDialogOpen.value = false
      userToDelete.value = null
      // Reload current page to reflect deletion
      loadUsers(currentPage.value)
    } else {
      showError(response?.message || response?.error || 'Failed to delete user')
    }
  } catch (error) {
    console.error('Error deleting user:', error)
    showError('Error deleting user')
  }
}

onMounted(async () => {
  await loadUsers(1)
})

/**
 * Load users with pagination
 * @param {number} page - Page number
 */
const loadUsers = async (page = 1) => {
  isLoadingUsers.value = true
  try {
    const filters = {
      page: page,
      per_page: perPage.value
    }
    
    // Add filter values if they exist
    if (filterStore.search) filters.search = filterStore.search
    if (filterStore.unit) filters.unit_id = filterStore.unit
    if (filterStore.subunit) filters.sub_unit_id = filterStore.subunit
    if (filterStore.office) filters.office_id = filterStore.office
    if (filterStore.suboffice) filters.sub_office_id = filterStore.suboffice
    
    const response = await fetchUsers(filters)
    console.log(response,'response')
  
  } catch (error) {
    console.error('Failed to load users:', error)
  } finally {
    isLoadingUsers.value = false
  }
}



/**
 * Handle page change event from pagination component
 * @param {number} page - New page number
 */
const onPageChange = async (page) => {
  await loadUsers(page)
}

// Watch for filter changes and reload data (but only when dialog is closed)
watch([() => filterStore.search, () => filterStore.unit, () => filterStore.subunit, () => filterStore.office, () => filterStore.suboffice], 
  () => {
    // Only reload if dialog is closed to avoid interference with edit mode
    if (!isAddUserDialogOpen.value) {
      // Reset to page 1 when filters change
      currentPage.value = 1
      loadUsers(1)
    }
  }
)
const getRoleColor = (role) => {
  const colors = { admin: 'error', officer: 'primary', user: 'info' }
  return colors[role] || 'secondary'
}
</script>

<style scoped>
.settings-users {
  padding: 1rem;
}

.table-header {
  background-color: #1f73b7 !important;
}

.table-header th {
  color: white !important;
  font-weight: 600 !important;
}

.filter-field {
  min-width: 250px;
  flex: 0 0 auto;
}

.action-button {
  text-transform: uppercase;
  font-weight: 600;
  min-width: 150px;
}

.gap-3 {
  gap: 1rem;
}

@media (max-width: 960px) {
  .filter-field {
    min-width: 200px;
  }
}

@media (max-width: 600px) {
  .filter-field {
    min-width: 100%;
    flex: 1 1 auto;
  }
  
  .action-button {
    min-width: 100%;
  }
}
</style>

