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
          <!-- <v-text-field
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
          /> -->
        </div>
      </div>

      <!-- Organization Section -->
      <div class="form-section mt-6">
        <div class="section-title text-subtitle-2 font-weight-600 mb-3">Organization Details</div>
        
        <div class="grid">
          <app-autocomplete
            v-model="formData.category_id"
            label="Category"
            :text="'name'"
            :value="'id'"
            :items="orgItems.categories"
            :rules="[(v) => !!v || 'Category is required']"
            :hideDetails="false"
            @on-change="onCategoryChange"
            />
          <app-autocomplete
            label="Units"
            v-model="formData.unit_id"
            :text="'name'"
            :value="'id'"
            :items="orgItems.units"
            :rules="[(v) => !!v || 'Unit is required']"
            :hideDetails="false"
            @on-change="onUnitChange"
            />
          <app-autocomplete
            label="Subunits"
            v-model="formData.sub_unit_id"
            :text="'name'"
            :value="'id'"
            :items="orgItems.subunits"
            :clearable="true"
            @on-change="onSubUnitChange"
          />
          <app-autocomplete
            label="Offices"
            v-model="formData.office_id"
            :text="'name'"
            :value="'id'"
            :items="orgItems.offices"
            :clearable="true"
            @on-change="onOfficeChange"
          />
          <app-autocomplete
            label="Suboffices"
            v-model="formData.sub_office_id"
            :text="'name'"
            :value="'id'"
            :items="orgItems.suboffices"
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
            :rules="[(v) => !!v || 'Approver is required']"
            :hideDetails="false"
          />
          <app-autocomplete
            v-model="formData.office_role"
            label="Office Admin"
            :items="officeItems"
            :text="'text'"
            :value="'value'"
            :rules="[(v) => !!v || 'Office role is required']"
            :hideDetails="false"
          />

           <app-autocomplete
           v-if="authStore.user.username == 'arceo.salibio'"
            v-model="formData.role"
            label="Role"
            :items="roleItems"
            :text="'text'"
            :value="'value'"
            :hideDetails="false"
          />
        </div>
      </div>
    </v-form>
  </app-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import AppDialog from '@/components/common/AppDialog.vue'
import AppTextField from '@/components/forms/AppTextField.vue'
import AppAutocomplete from '@/components/forms/AppAutocomplete.vue'
import { useUser } from '@/composables/useUser'
import {getCategories, getUnits, getSubUnits, getOffices, getSubOffices} from '@/services/organizationService'
import { useAuthStore } from '@/stores/authStore.js'
import { APPROVER_OPTIONS, OFFICE_ROLE_OPTIONS } from '@/utils/constants.js'

const authStore = useAuthStore()
// Initialize useUser composable
const { rankItems, isLoading, addUser, editUser, fetchRank } = useUser()

// Organization dropdown items — local to the dialog so it doesn't
// touch the page filters (filterStore) or trigger their cascade watchers
const orgItems = ref({
  categories: [],
  units: [],
  subunits: [],
  offices: [],
  suboffices: []
})

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
const emptyForm = () => ({
  rank_id: null,
  name: '',
  position: '',
  username: '',
  password: '',
  category_id: null,
  unit_id: null,
  sub_unit_id: null,
  office_id: null,
  sub_office_id: null,
  approver: null,
  office_role: null,
  role : 0
})
const formData = ref(emptyForm())

// Password visibility toggle
const showPassword = ref(false)

const approverItems = APPROVER_OPTIONS
const officeItems = OFFICE_ROLE_OPTIONS

const roleItems = ref([{text : 'Yes', value:1 },{text : 'No', value:0 }])

/**
 * Cascade handlers — only fired on user selection (not on programmatic set),
 * so populating the form in edit mode won't wipe the child fields
 */
const onCategoryChange = async (categoryId) => {
  formData.value.unit_id = null
  formData.value.sub_unit_id = null
  formData.value.office_id = null
  formData.value.sub_office_id = null
  orgItems.value.subunits = []
  orgItems.value.offices = []
  orgItems.value.suboffices = []
  const res = await getUnits(1, null, categoryId)
  orgItems.value.units = res?.data || []
}

const onUnitChange = async (unitId) => {
  formData.value.sub_unit_id = null
  formData.value.office_id = null
  formData.value.sub_office_id = null
  orgItems.value.offices = []
  orgItems.value.suboffices = []
  orgItems.value.subunits = unitId ? (await getSubUnits(1, null, unitId))?.data || [] : []
}

const onSubUnitChange = async (subUnitId) => {
  formData.value.office_id = null
  formData.value.sub_office_id = null
  orgItems.value.suboffices = []
  orgItems.value.offices = subUnitId ? (await getOffices(1, null, subUnitId))?.data || [] : []
}

const onOfficeChange = async (officeId) => {
  formData.value.sub_office_id = null
  orgItems.value.suboffices = officeId ? (await getSubOffices(1, null, officeId))?.data || [] : []
}



/**
 * Handle form submission
 */
const handleSubmit = async () => {
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
      category_id: formData.value.category_id,
      unit_id: formData.value.unit_id,
      sub_unit_id: formData.value.sub_unit_id,
      office_id: formData.value.office_id,
      sub_office_id: formData.value.sub_office_id,
      approver: formData.value.approver,
      office_role: formData.value.office_role,
      role: formData.value.role || (formData.value.approver == "0" ? 0 : 2)
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
      // if (!formData.value.password) {
      //   emit('error', 'Password is required for new users')
      //   return
      // }
      payload.password = '@N3pnjrr$2026' // Default password for new users
      response = await addUser(payload)
    }

    // Get the actual API response (axios wraps it under .data)
    const apiResponse = response
    // console.log('API Response:', apiResponse)

    if (apiResponse?.success) {
      // console.log('check')
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
  // console.log('cancel')
  // Clear form values and validation messages
  formData.value = emptyForm()
  form.value?.resetValidation()

  // Reset edit mode
  isEditMode.value = false
  editingUserId.value = null
  showPassword.value = false

  // Close dialog
  isDialogOpen.value = false
}

/**
 * Load categories and units for a fresh (add mode) form
 */
const loadAddModeOrgItems = async () => {
  const [categoriesRes, unitsRes] = await Promise.all([getCategories(), getUnits()])
  orgItems.value = {
    categories: categoriesRes?.data || [],
    units: unitsRes?.data || [],
    subunits: [],
    offices: [],
    suboffices: []
  }
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
const openEditDialog = async (user) => {
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
    sub_unit_id: user.sub_unit_id,
    office_id: user.office_id,
    sub_office_id: user.sub_office_id,
    // Match the option value types (Drafter is '0', the rest are numbers)
    approver: user.approver == null ? null : (user.approver == 0 ? '0' : Number(user.approver)),
    office_role: user.office_role == null ? null : Number(user.office_role),
    role: user.role ?? 0
  }

  // Load the dropdown items for the user's current organization path
  try {
    const [categoriesRes, unitsRes, subunitsRes, officesRes, subofficesRes] = await Promise.all([
      getCategories(),
      getUnits(),
      getSubUnits(1, null, user.unit_id),
      getOffices(1, null, user.sub_unit_id),
      getSubOffices(1, null, user.office_id),
      loadRankItems()
    ])
    orgItems.value = {
      categories: categoriesRes?.data || [],
      units: unitsRes?.data || [],
      subunits: subunitsRes?.data || [],
      offices: officesRes?.data || [],
      suboffices: subofficesRes?.data || []
    }

    showPassword.value = false
    isDialogOpen.value = true
  } catch (error) {
    console.error('Failed to load organization data:', error)
    emit('error', 'Failed to load organization data')
  }
}

// Expose openEditDialog to parent components
defineExpose({ openEditDialog })

// Load rank and organization items when dialog opens in add mode
watch(isDialogOpen, (newVal) => {
  if (newVal && !isEditMode.value) {
    loadRankItems()
    loadAddModeOrgItems()
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
