<template>
  <v-snackbar
    :model-value="appStore.snackbar.visible"
    @update:model-value="appStore.snackbar.visible = $event"
    :color="appStore.snackbar.type"
    :timeout="appStore.snackbar.timeout"
    variant="elevated"
    location="top"
  >
    {{ appStore.snackbar.message }}
    
    <template #actions>
      <v-btn
        icon="mdi-close"
        size="small"
        @click="appStore.snackbar.visible = false"
      />
    </template>
  </v-snackbar>
</template>

<script setup>
import { useAppStore } from '@/stores/appStore'

const appStore = useAppStore()
</script>

<style scoped>
/* Snackbar styling */

</style>
