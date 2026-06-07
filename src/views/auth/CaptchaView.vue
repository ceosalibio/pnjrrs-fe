<template>
  <auth-layout>
    <captcha-form
      :loading="isLoading"
      @submit="handleCaptchaSubmit"
      @back="handleBack"
    />
  </auth-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import CaptchaForm from '@/components/forms/CaptchaForm.vue'
import { useAuthStore } from '@/stores/authStore'
import { useAppStore } from '@/stores/appStore'

const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()

const isLoading = ref(false)

const handleCaptchaSubmit = async (data) => {
  isLoading.value = true
  try {
    // Simulate CAPTCHA verification
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    authStore.setCaptchaVerified(true)
    appStore.showSnackbar('CAPTCHA verified successfully!', 'success')
    
    // Redirect to dashboard
    await router.push('/dashboard')
  } catch (error) {
    appStore.showSnackbar(error.message, 'error')
  } finally {
    isLoading.value = false
  }
}

const handleBack = async () => {
  authStore.logout()
  await router.push('/login')
}
</script>
