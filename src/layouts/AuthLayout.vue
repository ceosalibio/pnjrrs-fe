<template>
  <v-app class="auth-app">
    <v-main class="auth-main">
      <div class="auth-container">
        <v-card
          class="auth-card"
          elevation="4"
      
        >
          <v-card-text class="pa-8">
            <h2 class="text-h5 font-weight-600 text-white text-center mb-6">Log in</h2>
            <slot />
          </v-card-text>
        </v-card>
      </div>
    </v-main>

    <app-snackbar />
  </v-app>
</template>

<script setup>
import AppSnackbar from '@/components/common/AppSnackbar.vue'
// import { useAppStore } from '@/stores/appStore'

// const appStore = useAppStore()
</script>

<style scoped>
.auth-app {
  height: 100vh;
  width: 100vw;
}

.auth-main {
  height: 100vh;
  background: url('@/assets/images/coverpage.png') center center / 90% 100% no-repeat;
  background-color: #0a1a33; 
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 20px;
}

.auth-container {
  width: 100%;
  max-width: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 90px;
}

.auth-card {
  width: 100%;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  background: rgba(30, 60, 110, 0.7) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  opacity: 0.80;
}

.auth-card:hover {
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.4);
}
</style>

