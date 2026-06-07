<template>
  <v-app class="app-container">
    <app-navbar />
    <app-sidebar />
    
    <v-main class="d-flex flex-column">
      <v-container class="flex-grow-1 py-6">
        <router-view />
      </v-container>

      <app-footer />
    </v-main>

    <app-loading
      :is-loading="appStore.getLoading"
      message="Processing..."
    />

    <app-snackbar
      :model-value="appStore.getSnackbar.visible"
      :message="appStore.getSnackbar.message"
      :type="appStore.getSnackbar.type"
      :timeout="appStore.getSnackbar.timeout"
      @update:model-value="appStore.hideSnackbar()"
    />

    <app-dialog
      :model-value="appStore.getDialog.visible"
      :title="appStore.getDialog.title"
      :message="appStore.getDialog.message"
      :confirm-text="appStore.getDialog.confirmText"
      :cancel-text="appStore.getDialog.cancelText"
      @confirm="handleDialogConfirm"
      @cancel="handleDialogCancel"
    />
  </v-app>
</template>

<script setup>
import { useAppStore } from '@/stores/appStore'
import { RouterView } from 'vue-router'
import AppNavbar from '@/components/navigation/AppNavbar.vue'
import AppSidebar from '@/components/navigation/AppSidebar.vue'
import AppFooter from '@/components/navigation/AppFooter.vue'
import AppLoading from '@/components/common/AppLoading.vue'
import AppSnackbar from '@/components/common/AppSnackbar.vue'
import AppDialog from '@/components/common/AppDialog.vue'

const appStore = useAppStore()

const handleDialogConfirm = () => {
  if (appStore.getDialog.onConfirm) {
    appStore.getDialog.onConfirm()
  }
  appStore.hideDialog()
}

const handleDialogCancel = () => {
  if (appStore.getDialog.onCancel) {
    appStore.getDialog.onCancel()
  }
  appStore.hideDialog()
}
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

::v-deep .v-main {
  background-color: #f5f5f5;
  flex: 1;
}
</style>
