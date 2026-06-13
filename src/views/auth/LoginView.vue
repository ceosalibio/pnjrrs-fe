<template>
  <auth-layout>
    <login-form
      :loading="isLoading"
      @submit="handleLogin"
    />

    <v-divider class="my-4" />

    <!-- <p class="text-center text-sm text-gray-600">
      Don't have an account?
      <v-btn
        variant="text"
        color="primary"
        size="small"
        @click="handleSignUp"
      >
        Request Access
      </v-btn>
    </p> -->
  </auth-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import LoginForm from '@/components/forms/LoginForm.vue'
import { useAuth } from '@/composables/useAuth'
import { useAppStore } from '@/stores/appStore'

const router = useRouter()
const appStore = useAppStore()
const { login } = useAuth()

const isLoading = ref(false)

const handleLogin = async (credentials) => {
  isLoading.value = true
  try {
    await login(credentials.username, credentials.password, credentials.rememberMe)
  } catch (error) {
    appStore.showSnackbar(error.message, 'error')
  } finally {
    isLoading.value = false
  }
}

const handleSignUp = () => {
  appStore.showSnackbar('Please contact your system administrator for access', 'info')
}
</script>
