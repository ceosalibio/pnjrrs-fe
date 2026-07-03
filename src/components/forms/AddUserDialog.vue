<template>
  <app-dialog
    v-model="isDialogOpen"
    :title="isEditMode ? 'Edit User' : 'Add New User'"
    :confirm-text="isEditMode ? 'Update User' : 'Create User'"
    cancel-text="Cancel"
    max-width="600"
    @confirm="handleSubmit"
    @cancel="handleCancel"
  >
    <v-form ref="form" @submit.prevent="handleSubmit" class="mt-4">
      <div class="form-section">
        <!-- Personal Information Section -->
        <div class="section-title text-subtitle-2 font-weight-600 mb-3">Personal Information</div>
        
        <div class="grid">
         
          <app-autocomplete
            v-model="formData.rank_id"
            label="Rank"
            :items="rankItems"
            :text="'name'"
            :value="'id'"
            :rules="[(v) => !!v || 'Rank is required']"
            :hideDetails="false"
            />
          <app-text-field
            v-model="formData.name"
            label="Full Name"
            placeholder="Enter full name"
            :rules="[(v) => !!v || 'Full name is required', (v) => v?.length >= 2 || 'Name must be at least 2 characters']"
            required
            class="field"
          />

          <app-text-field
            v-model="formData.position"
            label="Position"
            placeholder="Enter position"
            :rules="[(v) => !!v || 'Position is required' ]"
            required
            class="field"
          />
          <app-text-field
            v-model="formData.username"
            label="Username"
            placeholder="Enter username"
            :rules="[(v) => !!v || 'Username is required', (v) => v?.length >= 3 || 'Username must be at least 3 characters']"
            required
            class="field"
          />
          <v-text-field
            v-model="formData.password"
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            :placeholder="isEditMode ? 'Leave empty to keep current password' : 'Enter password'"
            :rules="isEditMode ? [(v) => !v || v?.length >= 8 || 'Password must be at least 8 characters'] : [(v) => !!v || 'Password is required', (v) => v?.length >= 8 || 'Password must be at least 8 characters']"
            :required="!isEditMode"
            variant="outlined"
            density="compact"
            class="field"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="showPassword = !showPassword"
          />
        </div>
      </div>

      <!-- Organization Section -->
      <div class="form-section mt-6">
        <div class="section-title text-subtitle-2 font-weight-600 mb-3">Organization Details</div>
        
        <div class="grid">
          <app-autocomplete
            v-model="filterStore.category"
            label="Category"
            :text="'name'"
            :value="'id'"
            :items="filterStore.organizationFilterItems.categories"
            :rules="[(v) => !!v || 'Category is required']"
            :hideDetails="false"
            />
          <app-autocomplete
            label="Units"
            v-model="filterStore.unit"
            :text="'name'"
            :value="'id'"
            :items="filterStore.organizationFilterItems.units"
            :rules="[(v) => !!v || 'Unit is required']"
            :hideDetails="false"
            />
          <app-autocomplete
            label="Subunits"
            v-model="filterStore.subunit"
            :text="'name'"
            :value="'id'"
            :items="filterStore.organizationFilterItems.subunits"
            :clearable="true"
          />
          <app-autocomplete
            label="Offices"
            v-model="filterStore.office"
            :text="'name'"
            :value="'id'"
            :items="filterStore.organizationFilterItems.offices"
            :clearable="true"
          />
          <app-autocomplete
            label="Suboffices"
            v-model="filterStore.suboffice"
            :text="'name'"
            :value="'id'"
            :items="filterStore.organizationFilterItems.suboffices"
            :clearable="true"
          />

        </div>
      </div>

      <!-- Roles Section -->
      <div class="form-section mt-6">
        <div class="section-title text-subtitle-2 font-weight-600 mb-3">Role Assignment</div>
        
        <div class="grid">
          <app-autocomplete
            v-model="formData.approver"
            label="Approver"
            :items="approverItems"
            :text="'text'"
            :value="'value'"
            :rules="[(v) => !!v || 'Approver is reuquired']"
            :hideDetails="false"
          />
          <app-autocomplete
            v-model="formData.office_role"
            label="Office Admin"
            :items="officeItems"
            :text="'text'"
            :value="'value'"

          />
        </div>
      </div>
    </v-form>
  </app-dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import AppDialog from '@/components/common/AppDialog.vue'
import AppTextField from '@/components/forms/AppTextField.vue'
import AppAutocomplete from '@/components/forms/AppAutocomplete.vue'
import { useUser } from '@/composables/useUser'
import { useFilterStore } from '@/stores/filterStore.js'

// Initialize useUser composable
const { rankItems, isLoading, addUser, editUser, fetchRank } = useUser()
const filterStore = useFilterStore()

// Dialog state
const isDialogOpen = defineModel('open', {
  type: Boolean,
  default: false
})

// Edit mode state
const isEditMode = ref(false)
const editingUserId = ref(null)

// Emit events
const emit = defineEmits(['user-created', 'user-updated', 'error'])

// Form reference
const form = ref(null)

// Form data
const formData = ref({
  rank_id: null,
  name: '',
  position: '',
  username: '',
  password: '',
  category_id: null,
  unit_id: null,
  subunit_id: null,
  office_id: null,
  suboffice_id: null,
  approver: null,
  office_role: null
})

// Password visibility toggle
const showPassword = ref(false)

const approverItems = ref([
  {text : 'Drafter', value:'0' },
  {text : '1st Approver', value:1 },
  {text : '2nd Approver', value:2 },
  {text : '3rd Approver', value:3 },
  {text : '4th Approver', value:4 },
  {text : '5th Approver', value:5 },
])

const officeItems = ref([
  {text : '1 - Personnel', value:1 },
  {text : '8 - Training', value:8 },
  {text : '4 - Equepment/Maintenance/Communication', value: 4 },
  {text : '3 - Consolidated', value:3 },
])



/**
 * Handle form submission
 */
const handleSubmit = async () => {
  console.log('testst')
  const { valid } = await form.value.validate()
  
  if (!valid) {
    emit('error', 'Please fill in all required fields correctly')
    return
  }

  try {
    const payload = {
      rank_id: formData.value.rank_id,
      name: formData.value.name,
      position: formData.value.position,
      username: formData.value.username,
      category_id: filterStore.category,
      unit_id: filterStore.unit,
      sub_unit_id: filterStore.subunit,
      office_id: filterStore.office,
      sub_office_id: filterStore.suboffice,
      approver: formData.value.approver,
      office_role: formData.value.office_role,
      role: formData.value.approver ? 2 : 0
    }

    // Only include password if it's provided (required for create, optional for edit)
    if (formData.value.password) {
      payload.password = formData.value.password
    }

    let response
    
    if (isEditMode.value && editingUserId.value) {
      response = await editUser(editingUserId.value, payload)
    } else {
      // Create mode requires password
      if (!formData.value.password) {
        emit('error', 'Password is required for new users')
        return
      }
      payload.password = formData.value.password
      response = await addUser(payload)
    }

    // Get the actual API response (axios wraps it under .data)
    const apiResponse = response
    console.log('API Response:', apiResponse)

    if (apiResponse?.success) {
      console.log('check')
      if (isEditMode.value) {
        emit('user-updated', apiResponse.data)
      } else {
        emit('user-created', apiResponse.data)
      }
      // Close dialog after successful save
      setTimeout(() => {
        handleCancel()
      }, 300)
    } else {
      emit('error', apiResponse?.message || apiResponse?.error || 'Failed to save user')
    }
  } catch (error) {
    emit('error', error.message || 'Failed to save user')
  }
}

/**
 * Handle dialog cancel
 */
const handleCancel = () => {
  console.log('cancel')
  // Reset form using Vuetify's form reset
  form.value?.reset()
  
  // Reset edit mode
  isEditMode.value = false
  editingUserId.value = null
  showPassword.value = false
  
  // Reset organization filter store values
  filterStore.category = null
  filterStore.unit = null
  filterStore.subunit = null
  filterStore.office = null
  filterStore.suboffice = null
  
  // Close dialog
  isDialogOpen.value = false
}

/**
 * Load rank items when dialog opens
 */
const loadRankItems = async () => {
  try {
    await fetchRank()
  } catch (error) {
    console.error('Failed to load rank items:', error)
    emit('error', 'Failed to load rank items')
  }
}

/**
 * Open dialog in edit mode with user data
 * @param {Object} user - User object to edit
 */
const openEditDialog = (user) => {
  isEditMode.value = true
  editingUserId.value = user.id
  
  formData.value = {
    rank_id: user.rank_id,
    name: user.name,
    position: user.position,
    username: user.username,
    password: '', // Leave empty for edit mode
    category_id: user.category_id,
    unit_id: user.unit_id,
    subunit_id: user.sub_unit_id,
    office_id: user.office_id,
    suboffice_id: user.sub_office_id,
    approver: user.approver,
    office_role: user.office_role
  }
  
  // Set organization filter store values for organization fields
  filterStore.category = user.category_id
  filterStore.unit = user.unit_id
  filterStore.subunit = user.sub_unit_id
  filterStore.office = user.office_id
  filterStore.suboffice = user.sub_office_id
  
  showPassword.value = false
  isDialogOpen.value = true
  loadRankItems()
}

// Expose openEditDialog to parent components
defineExpose({ openEditDialog })

// Load rank items when dialog opens
watch(isDialogOpen, (newVal) => {
  if (newVal && !isEditMode.value) {
    loadRankItems()
  }
})


</script>

<style scoped>
.form-section {
  margin-bottom: 1rem;
}

.section-title {
  color: rgba(0, 0, 0, 0.87);
  margin-bottom: 1rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.field {
  width: 100%;
}

@media (max-width: 600px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
