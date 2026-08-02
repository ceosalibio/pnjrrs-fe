<template>
  <app-card elevation="1" class="h-100">
    <div class="d-flex flex-column justify-center align-center pa-6" style="min-height: 250px;">
      <v-icon size="48" color="primary" class="mb-4">mdi-megaphone</v-icon>
      <p class="text-h6 font-weight-600 text-center">{{ title }}</p>
      <p class="text-sm text-gray-600 text-center mt-3 mb-4">{{ message }}</p>
      <app-button
        label="View Details"
        variant="outlined"
        color="primary"
        size="small"
      />
    </div>
  </app-card>
</template>

<script setup>
import { defineProps } from 'vue'
import AppCard from '@/components/common/AppCard.vue'
import AppButton from '@/components/common/AppButton.vue'

defineProps({
  title: {
    type: String,
    default: 'Announcement'
  },
  message: {
    type: String,
    default: 'Important updates and announcements will appear here'
  }
})
</script>

<style scoped>
.text-gray-600 {
  color: #666 !important;
}
</style>
