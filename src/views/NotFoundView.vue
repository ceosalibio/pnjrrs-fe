<template>
  <v-app>
    <v-main>
      <v-container class="d-flex align-center justify-center h-100">
        <v-card max-width="500" class="text-center pa-8">
          <v-icon size="120" color="primary" class="mb-4">mdi-alert-circle-outline</v-icon>
          <h1 class="text-h3 font-weight-600 mb-4">404</h1>
          <p class="text-h6 mb-2">Page Not Found</p>
          <p class="text-gray-600 mb-6">The page you're looking for doesn't exist or has been moved.</p>
          <app-button
            label="Go to Dashboard"
            color="primary"
            full-width
            @click="goToDashboard"
          />
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { useRouter } from 'vue-router'
import AppButton from '@/components/common/AppButton.vue'

const router = useRouter()

const goToDashboard = () => {
  router.push('/dashboard')
}
</script>
