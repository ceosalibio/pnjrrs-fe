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
            v-model="formData.username"
            label="Username"
            placeholder="Enter username"
            :rules="[(v) => !!v || 'Username is required', (v) => v?.length >= 3 || 'Username must be at least 3 characters']"
            required
            class="field"
          />
          <app-text-field
            v-model="formData.password"
            label="Password"
            type="password"
            placeholder="Enter password"
            :rules="[(v) => !!v || 'Password is required', (v) => v?.length >= 8 || 'Password must be at least 8 characters']"
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
            v-model="filterStore.category"
            label="Category"
            :text="'name'"
            :value="'id'"
            :items="filterStore.organizationFilterItems.categories"
            :rules="[(v) => !!v || 'Category is required']"
            />
          <app-autocomplete
            label="Units"
            v-model="filterStore.unit"
            :text="'name'"
            :value="'id'"
            :items="filterStore.organizationFilterItems.units"
            :rules="[(v) => !!v || 'Unit is required']"
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
          <!-- <app-autocomplete
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
          /> -->
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
const { rankItems, isLoading, addUser, fetchRank } = useUser()
const filterStore = useFilterStore()

// Dialog state
const isDialogOpen = defineModel('open', {
  type: Boolean,
  default: false
})

// Emit events
const emit = defineEmits(['user-created', 'error'])

// Form reference
const form = ref(null)

// Form data
const formData = ref({
  rank_id: null,
  name: '',
  username: '',
  password: '',
  category_id: null,
  unit_id: null,
  subunit_id: null,
  office_id: null,
  suboffice_id: null
})



/**
 * Handle form submission
 */
const handleSubmit = async () => {
  const { valid } = await form.value.validate()
  console.log('Form valid:', valid)
  
  if (!valid) {
    emit('error', 'Please fill in all required fields correctly')
    return
  }

  try {
    const payload = {
      rank_id: formData.value.rank_id,
      name: formData.value.name,
      username: formData.value.username,
      password: formData.value.password,
      category_id: filterStore.category,
      unit_id: filterStore.unit,
      sub_unit_id: filterStore.subunit,
      office_id: filterStore.office,
      sub_office_id: filterStore.suboffice
    }

    const response = await addUser(payload)

    if (response.success) {
      emit('user-created', response.data)
      handleCancel()
    } else {
      emit('error', response.error || 'Failed to create user')
    }
  } catch (error) {
    emit('error', error.message || 'Failed to create user')
  }
}

/**
 * Handle dialog cancel
 */
const handleCancel = () => {
  // Reset form using Vuetify's form reset
  form.value?.reset()
  
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

// Load rank items when dialog opens
watch(isDialogOpen, (newVal) => {
  if (newVal) {
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
