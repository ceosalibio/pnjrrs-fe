<template>
  <app-dialog
    v-model="isDialogOpen"
    title="Add New User"
    confirm-text="Create User"
    cancel-text="Cancel"
    max-width="600"
    @confirm="handleSubmit"
    @cancel="handleCancel"
  >
    <form @submit.prevent="handleSubmit" class="mt-4">
      <div class="form-section">
        <!-- Personal Information Section -->
        <div class="section-title text-subtitle-2 font-weight-600 mb-3">Personal Information</div>
        
        <div class="grid">
          <app-text-field
            v-model="formData.name"
            label="Full Name"
            placeholder="Enter full name"
            :error="errors.name"
            required
            class="field"
          />
          <app-text-field
            v-model="formData.username"
            label="Username"
            placeholder="Enter username"
            :error="errors.username"
            required
            class="field"
          />
          <app-text-field
            v-model="formData.password"
            label="Password"
            type="password"
            placeholder="Enter password"
            :error="errors.password"
            required
            class="field"
          />
        </div>
      </div>

      <!-- Organization Section -->
      <div class="form-section mt-6">
        <div class="section-title text-subtitle-2 font-weight-600 mb-3">Organization Details</div>
        
        <div class="grid">
          <app-autocomplete
            v-model="formData.category"
            label="Category"
            :options="categoryOptions"
            :loading="isLoadingCategories"
            :error="errors.category"
            class="field"
          />
          <app-autocomplete
            v-model="formData.unit"
            label="Unit"
            :options="unitOptions"
            :loading="isLoadingUnits"
            :error="errors.unit"
            class="field"
          />
          <app-autocomplete
            v-model="formData.subunit"
            label="Sub Unit"
            :options="subunitOptions"
            :loading="isLoadingSubunits"
            :error="errors.subunit"
            class="field"
          />
          <app-autocomplete
            v-model="formData.office"
            label="Office"
            :options="officeOptions"
            :loading="isLoadingOffices"
            :error="errors.office"
            class="field"
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
            :options="approverOptions"
            :loading="isLoadingApprovers"
            :error="errors.approver"
            class="field"
          />
          <app-autocomplete
            v-model="formData.officeAdmin"
            label="Office Admin"
            :options="officeAdminOptions"
            :loading="isLoadingOfficeAdmins"
            :error="errors.officeAdmin"
            class="field"
          />
        </div>
      </div>
    </form>
  </app-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import AppDialog from '@/components/common/AppDialog.vue'
import AppTextField from '@/components/forms/AppTextField.vue'
import AppAutocomplete from '@/components/forms/AppAutocomplete.vue'

// Dialog state
const isDialogOpen = defineModel('open', {
  type: Boolean,
  default: false
})

// Emit events
const emit = defineEmits(['user-created', 'error'])

// Form data
const formData = ref({
  name: '',
  username: '',
  password: '',
  category: null,
  unit: null,
  subunit: null,
  office: null,
  approver: null,
  officeAdmin: null
})

// Form validation errors
const errors = ref({
  name: '',
  username: '',
  password: '',
  category: '',
  unit: '',
  subunit: '',
  office: '',
  approver: '',
  officeAdmin: ''
})

// Loading states for autocomplete options
const isLoadingCategories = ref(false)
const isLoadingUnits = ref(false)
const isLoadingSubunits = ref(false)
const isLoadingOffices = ref(false)
const isLoadingApprovers = ref(false)
const isLoadingOfficeAdmins = ref(false)

// Autocomplete options (Mock data - replace with actual API calls)
const categoryOptions = ref([
  { title: 'Maritime Operations', value: 'maritime_ops' },
  { title: 'Personnel Management', value: 'personnel_mgmt' },
  { title: 'Logistics', value: 'logistics' }
])

const unitOptions = ref([
  { title: 'Naval Base Cavite', value: 'nbc' },
  { title: 'Naval Base Subic', value: 'nbs' },
  { title: 'Naval Base Sangley', value: 'nbsa' }
])

const subunitOptions = ref([
  { title: 'Operations Division', value: 'ops_div' },
  { title: 'Supply Division', value: 'supply_div' },
  { title: 'Personnel Division', value: 'personnel_div' }
])

const officeOptions = ref([
  { title: 'Headquarters', value: 'hq' },
  { title: 'Field Office 1', value: 'fo1' },
  { title: 'Field Office 2', value: 'fo2' }
])

const approverOptions = ref([
  { title: 'Admin User', value: 'admin' },
  { title: 'Manager User', value: 'manager' },
  { title: 'Supervisor User', value: 'supervisor' }
])

const officeAdminOptions = ref([
  { title: 'Office Admin 1', value: 'office_admin_1' },
  { title: 'Office Admin 2', value: 'office_admin_2' }
])

/**
 * Validate form fields
 * @returns {boolean} True if form is valid
 */
const validateForm = () => {
  let isValid = true
  const newErrors = {
    name: '',
    username: '',
    password: '',
    category: '',
    unit: '',
    subunit: '',
    office: '',
    approver: '',
    officeAdmin: ''
  }

  // Validate text fields
  if (!formData.value.name || formData.value.name.trim() === '') {
    newErrors.name = 'Full name is required'
    isValid = false
  }

  if (!formData.value.username || formData.value.username.trim() === '') {
    newErrors.username = 'Username is required'
    isValid = false
  } else if (formData.value.username.length < 3) {
    newErrors.username = 'Username must be at least 3 characters'
    isValid = false
  }

  if (!formData.value.password || formData.value.password === '') {
    newErrors.password = 'Password is required'
    isValid = false
  } else if (formData.value.password.length < 8) {
    newErrors.password = 'Password must be at least 8 characters'
    isValid = false
  }

  // Validate autocomplete fields
  if (!formData.value.category) {
    newErrors.category = 'Category is required'
    isValid = false
  }

  if (!formData.value.unit) {
    newErrors.unit = 'Unit is required'
    isValid = false
  }

  if (!formData.value.subunit) {
    newErrors.subunit = 'Sub Unit is required'
    isValid = false
  }

  if (!formData.value.office) {
    newErrors.office = 'Office is required'
    isValid = false
  }

  if (!formData.value.approver) {
    newErrors.approver = 'Approver is required'
    isValid = false
  }

  if (!formData.value.officeAdmin) {
    newErrors.officeAdmin = 'Office Admin is required'
    isValid = false
  }

  errors.value = newErrors
  return isValid
}

/**
 * Handle form submission
 */
const handleSubmit = async () => {
  if (!validateForm()) {
    emit('error', 'Please fill in all required fields correctly')
    return
  }

  try {
    // TODO: Replace with actual API call to userService
    // const response = await createUser(formData.value)
    
    // Mock success response
    const newUser = {
      id: Date.now(),
      ...formData.value,
      status: 'active',
      createdAt: new Date().toISOString()
    }

    emit('user-created', newUser)
    handleCancel()
  } catch (error) {
    emit('error', error.message || 'Failed to create user')
  }
}

/**
 * Handle dialog cancel
 */
const handleCancel = () => {
  // Reset form
  formData.value = {
    name: '',
    username: '',
    password: '',
    category: null,
    unit: null,
    subunit: null,
    office: null,
    approver: null,
    officeAdmin: null
  }

  // Reset errors
  errors.value = {
    name: '',
    username: '',
    password: '',
    category: '',
    unit: '',
    subunit: '',
    office: '',
    approver: '',
    officeAdmin: ''
  }

  // Close dialog
  isDialogOpen.value = false
}

/**
 * Load dropdown options when dialog opens
 * TODO: Replace with actual API calls to fetch real data
 */
const loadDropdownOptions = async () => {
  try {
    isLoadingCategories.value = true
    isLoadingUnits.value = true
    isLoadingSubunits.value = true
    isLoadingOffices.value = true
    isLoadingApprovers.value = true
    isLoadingOfficeAdmins.value = true

    // Simulate API calls with timeout
    await new Promise(resolve => setTimeout(resolve, 300))

    // Data is already loaded in the ref declarations above
    // In a real application, you would call your API here
  } catch (error) {
    emit('error', 'Failed to load dropdown options')
  } finally {
    isLoadingCategories.value = false
    isLoadingUnits.value = false
    isLoadingSubunits.value = false
    isLoadingOffices.value = false
    isLoadingApprovers.value = false
    isLoadingOfficeAdmins.value = false
  }
}

// Load options when dialog opens
watch(isDialogOpen, (newVal) => {
  if (newVal) {
    loadDropdownOptions()
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
