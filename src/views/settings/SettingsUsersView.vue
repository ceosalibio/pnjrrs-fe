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


    <!-- reset Confirmation Dialog -->
    <app-dialog
      v-model="isResetDialogOpen"
      title="Reset Password"
      :message="`Are you sure you want to reset the password for user '${userToReset?.name}'? This action cannot be undone.`"
      confirm-text="Reset"
      cancel-text="Cancel"
      confirm-color="error"
      max-width="400px"
      @confirm="confirmResetPassword"
    />

    <v-card class="mb-6">
      <v-card-title>User Management</v-card-title>
      <v-card-subtitle>Manage system users and their roles</v-card-subtitle>
      <v-divider />

      <v-card-text>
        <!-- Filters and Action Button Row -->
        <div class="d-flex gap-3 mb-4 align-center filters-row">

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
            :items="withAll(filterStore.organizationFilterItems.units)"
            class="flex-grow-1"
            @on-change="onUnitFilterChange"
          />
          <AppAutocomplete
            label="Subunits"
            v-model="filterStore.subunit"
            :text="'name'"
            :value="'id'"
            :items="withAll(filterStore.organizationFilterItems.subunits)"
            :disabled="!filterStore.unit"
            class="flex-grow-1"
            @on-change="onSubUnitFilterChange"
          />
          <AppAutocomplete
              label="Offices"
              v-model="filterStore.office"
              :text="'name'"
              :value="'id'"
              :items="withAll(filterStore.organizationFilterItems.offices)"
              :disabled="!filterStore.subunit"
              class="flex-grow-1"
              @on-change="onOfficeFilterChange"
            />
            <AppAutocomplete
              label="Suboffices"
              v-model="filterStore.suboffice"
              :text="'name'"
              :value="'id'"
              :items="withAll(filterStore.organizationFilterItems.suboffices)"
              :disabled="!filterStore.office"
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

       

        <div class="table-scroll-wrapper">
          <v-table hover class="users-table">
            <thead class="table-header">
              <tr>
                <th>User</th>
                <th>Unit / Sub Unit</th>
                <th>Office / Sub Office</th>
                <th>Approver</th>
                <th>Office Role</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user,i) in users" :key="user.id ?? i">
                <td>
                  <div class="cell-primary">{{ user?.rank?.name }} {{ user.name }}</div>
                  <div class="cell-secondary">{{ user.email || user.username }}</div>
                </td>
                <td>
                  <div class="cell-primary">{{ user?.unit?.name || '-' }}</div>
                  <div v-if="user?.sub_unit?.name" class="cell-secondary">{{ user.sub_unit.name }}</div>
                </td>
                <td>
                  <div class="cell-primary">{{ user?.office?.name || '-' }}</div>
                  <div v-if="user?.sub_office?.name" class="cell-secondary">{{ user.sub_office.name }}</div>
                </td>
                <td>
                  <v-chip size="small" variant="tonal" :color="user?.approver > 0 ? 'primary' : 'grey'">
                    {{ getOptionText(APPROVER_OPTIONS, user?.approver) }}
                  </v-chip>
                </td>
                <td>
                  <v-chip v-if="user?.office_role != null" size="small" variant="tonal" color="teal">
                    {{ getOptionText(OFFICE_ROLE_OPTIONS, user?.office_role) }}
                  </v-chip>
                  <span v-else>-</span>
                </td>
                <td class="actions-cell">
                  <v-btn icon="mdi-pencil" size="small" variant="text" color="primary" title="Edit" @click="handleEditUser(user)" />
                  <v-btn icon="mdi-delete" size="small" variant="text" color="error" title="Delete" @click="handleDeleteUser(user)" />
                  <v-btn v-if="authStore.user?.office_role == 3 && authStore.user?.unit_id == 1" icon="mdi-lock-reset" size="small" variant="text" color="warning" title="Reset password" @click="handleResetPassword(user)" />
                </td>
              </tr>
              <tr v-if="!users?.length">
                <td colspan="6" class="text-center py-6 text-medium-emphasis">No users found</td>
              </tr>
            </tbody>
          </v-table>
        </div>

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
import { resetPassword } from '@/services/authService'
import { getUnits } from '@/services/organizationService'
import { APPROVER_OPTIONS, OFFICE_ROLE_OPTIONS } from '@/utils/constants.js'

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
const isResetDialogOpen = ref(false)
const userToDelete = ref(null)
const userToReset = ref(null)

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
 * Open reset confirmation dialog
 * @param {Object} user - User to reset password
 */
const handleResetPassword = (user) => {
  userToReset.value = user
  isResetDialogOpen.value = true
}

const confirmResetPassword = async () => {
  if (!userToReset.value) return

  try {
    const response = await resetPassword(userToReset.value?.id)
    
    if (response?.success) {
      showSuccess(response?.message || 'Password reset successfully')
      // Close dialog
      isResetDialogOpen.value = false
      userToReset.value = null
    } else {
      showError(response?.message || response?.error || 'Failed to reset password')
    }
  } catch (error) {
    console.error('Error resetting password:', error)
    showError('Error resetting password')
  }
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
  // Show "All" for empty filters (persisted values may be null)
  ;['unit', 'subunit', 'office', 'suboffice'].forEach((key) => {
    if (filterStore[key] == null) filterStore[key] = ''
  })
  // Always load the full unit list — the persisted one may be filtered by category
  const unitsRes = await getUnits()
  filterStore.organizationFilterItems.units = unitsRes?.data || []
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
    // console.log(response,'response')
  
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
/**
 * Prepend an "All" option to a filter list.
 * Uses '' as its value — the filterStore watchers and loadUsers both ignore ''
 */
const withAll = (items) => [{ id: '', name: 'All' }, ...(items || [])]

/**
 * When a filter is set to "All", reset the filters below it
 * (the filterStore watchers only cascade on a specific selection)
 */
const onUnitFilterChange = (value) => {
  if (value) return
  filterStore.unit = ''
  filterStore.subunit = ''
  filterStore.office = ''
  filterStore.suboffice = ''
  filterStore.organizationFilterItems.subunits = []
  filterStore.organizationFilterItems.offices = []
  filterStore.organizationFilterItems.suboffices = []
}

const onSubUnitFilterChange = (value) => {
  if (value) return
  filterStore.subunit = ''
  filterStore.office = ''
  filterStore.suboffice = ''
  filterStore.organizationFilterItems.offices = []
  filterStore.organizationFilterItems.suboffices = []
}

const onOfficeFilterChange = (value) => {
  if (value) return
  filterStore.office = ''
  filterStore.suboffice = ''
  filterStore.organizationFilterItems.suboffices = []
}

/**
 * Get the display label of a value from an options list
 * (loose compare since API values may come as strings or numbers)
 */
const getOptionText = (options, value) => {
  if (value === null || value === undefined || value === '') return '-'
  return options.find(o => o.value == value)?.text ?? value
}

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
  white-space: nowrap;
}

.users-table td {
  padding-top: 10px !important;
  padding-bottom: 10px !important;
  vertical-align: middle;
}

.users-table tbody tr:nth-child(even) {
  background-color: rgba(0, 0, 0, 0.02);
}

.cell-primary {
  font-weight: 500;
  line-height: 1.3;
}

.cell-secondary {
  font-size: 0.8rem;
  color: rgba(0, 0, 0, 0.6);
  line-height: 1.3;
  margin-top: 2px;
}

.actions-cell {
  white-space: nowrap;
  text-align: center;
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

/* ===== MOBILE RESPONSIVENESS (bago) ===== */

/* Table: gawing horizontal scroll sa maliit na screen imbes na mag-squeeze/mag-overflow ng buong page */
.table-scroll-wrapper {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

:deep(.v-table) {
  min-width: 900px; /* para hindi masyadong maliit/paikpik ang mga columns kapag naka-scroll */
}

@media (max-width: 960px) {
  .filters-row {
    flex-wrap: wrap;
  }

  .filters-row :deep(.v-spacer) {
    display: none; /* di na kailangan ng spacer kapag naka-wrap na */
  }
}

@media (max-width: 600px) {
  .settings-users {
    padding: 0.5rem;
  }

  .filters-row {
    flex-direction: column;
    align-items: stretch;
  }

  .filters-row > * {
    width: 100% !important;
    flex: 1 1 100% !important;
    max-width: 100% !important;
  }

  /* Ang Add User button, gawing full width sa mobile */
  .filters-row :deep(button) {
    width: 100%;
  }
}
</style>