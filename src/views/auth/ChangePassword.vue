<template>
  <AuthLayout>
    <div class="change-password-container">
      <v-card class="elevation-3" max-width="450" width="100%">
        <v-card-title class="bg-primary text-white pa-6">
          <v-icon left>mdi-lock-reset</v-icon>
          Change Password
        </v-card-title>

        <v-card-text class="pa-6">
          <v-form @submit.prevent="handleChangePassword" ref="formRef">
            <!-- Username (Disabled) -->
            <v-text-field
              v-model="username"
              label="Username"
              prepend-icon="mdi-account"
              readonly
              disabled
              class="mb-4"
            />

            <!-- Current Password -->
            <v-text-field
              v-model="currentPassword"
              :label="'Temporary Password'"
              :type="showCurrentPassword ? 'text' : 'password'"
              prepend-icon="mdi-lock"
              :append-icon="showCurrentPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append="showCurrentPassword = !showCurrentPassword"
              class="mb-4"
              required
            />

            <!-- New Password -->
            <v-text-field
              v-model="newPassword"
              label="New Password"
              :type="showNewPassword ? 'text' : 'password'"
              prepend-icon="mdi-lock-outline"
              :append-icon="showNewPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append="showNewPassword = !showNewPassword"
              class="mb-4"
              :rules="passwordRules"
              required
            />

            <!-- Confirm Password -->
            <v-text-field
              v-model="confirmPassword"
              label="Confirm Password"
              :type="showConfirmPassword ? 'text' : 'password'"
              prepend-icon="mdi-lock-check"
              :append-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append="showConfirmPassword = !showConfirmPassword"
              class="mb-6"
              :rules="confirmPasswordRules"
              required
            />

            <!-- Action Buttons -->
            <div >
              <v-btn
                type="submit"
                color="primary"
                block
                :loading="isLoading"
                :disabled="!isFormValid"
              >
                <v-icon left>mdi-check</v-icon>
                Update Password
              </v-btn>
              <v-btn
                class="mt-2"
                color="grey"
                block
                @click="handleCancel"
              >
                <v-icon left>mdi-close</v-icon>
                Cancel
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </div>
  </AuthLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useAppStore } from '@/stores/appStore'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { forceChangePassword } from '@/services/authService'

const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()

const username = ref(authStore.getPendingUsername || '')
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const formRef = ref(null)

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Password validation rules
const passwordRules = [
  v => !!v || 'Password is required',
  v => (v && v.length >= 6) || 'Password must be at least 6 characters',
]

const confirmPasswordRules = [
  v => !!v || 'Confirm password is required',
  v => v === newPassword.value || 'Passwords do not match',
]

const isFormValid = computed(() => {
  return (
    username.value &&
    currentPassword.value &&
    newPassword.value &&
    confirmPassword.value &&
    newPassword.value === confirmPassword.value &&
    newPassword.value.length >= 6
  )
})

const handleChangePassword = async () => {
  if (!isFormValid.value) return

  isLoading.value = true
  try {
    const result = await forceChangePassword(
      authStore.getPendingUsername,
      currentPassword.value, // This is the temporary password
      newPassword.value
    )

    if (result?.success) {
      appStore.showSnackbar('Password changed successfully!', 'success')
      
      // Fully logout to clear all auth state
      authStore.logout()
      
      // Wait a moment for state to clear
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Redirect to login
      await router.push({ name: 'Login' })
    } else {
      appStore.showSnackbar(result?.error || 'Failed to change password', 'error')
    }
  } catch (error) {
    console.error('Error changing password:', error)
    appStore.showSnackbar(
      error?.response?.data?.message || 'An error occurred while changing password',
      'error'
    )
  } finally {
    isLoading.value = false
  }
}

const handleCancel = async () => {
  const confirmed = confirm('Are you sure you want to cancel? You will need to change your password later.')
  if (confirmed) {
    authStore.clearPendingPasswordChange()
    await router.push('/login')
  }
}
</script>

<style scoped>
.change-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
}

.gap-2 {
  gap: 0.5rem;
}
</style>
