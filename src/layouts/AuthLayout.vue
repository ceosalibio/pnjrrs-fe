<template>
  <v-app class="auth-app">
    <v-main class="auth-main">
      <div class="auth-container">
        <div class="mobile-title-wrapper">
          <h1 class="mobile-title">Automated<br>Philippine NAVY <br>AFPJRRS</h1>
        </div>
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
@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes glow {
  0%, 100% {
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  }
  50% {
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.6), 0 0 40px rgba(30, 144, 255, 0.4);
  }
}

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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 90px;
  padding: 0 20px;
  gap: 20px;
}

.mobile-title-wrapper {
  display: none;
  width: 100%;
}

.mobile-title {
  color: white;
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  letter-spacing: 0.5px;
  animation: slideInDown 0.6s ease-out, glow 3s ease-in-out infinite 0.6s;
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
  animation: slideInUp 0.8s ease-out;
}

.auth-card:hover {
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.4);
}

/* Tablet screens */
@media (max-width: 1024px) {
  .auth-container {
    margin-right: 50px;
    max-width: 450px;
  }
}

/* Mobile devices */
@media (max-width: 768px) {
  .auth-main {
    background-image: none;
    background-color: #0a1a33;
    justify-content: center;
  }

  .auth-container {
    margin-right: 0;
    max-width: 100%;
    padding: 0 20px;
  }

  .mobile-title-wrapper {
    display: block;
    animation: slideInDown 0.6s ease-out;
  }

  .mobile-title {
    font-size: 20px;
    margin-bottom: 10px;
  }

  .auth-card {
    background: rgba(30, 60, 110, 0.85) !important;
  }
}

/* Small mobile devices */
@media (max-width: 480px) {
  .auth-main {
    padding: 10px;
  }

  .auth-container {
    padding: 0 15px;
  }

  .mobile-title {
    font-size: 18px;
    line-height: 1.4;
  }

  .auth-card :deep(.pa-8) {
    padding: 24px !important;
  }
}

</style>

