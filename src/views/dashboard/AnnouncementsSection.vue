<template>
  <app-card title="Announcements" elevation="1">
    <div class="d-flex flex-column gap-3">
      <v-card
        v-for="announcement in announcements"
        :key="announcement.id"
        flat
        border
        class="pa-3"
      >
        <div class="d-flex justify-space-between align-start mb-2">
          <p class="font-weight-600 mb-0">{{ announcement.title }}</p>
          <v-chip
            v-if="announcement.tagColor"
            :color="announcement.tagColor"
            size="x-small"
            text-color="white"
            class="font-weight-600"
          >
            {{ announcement.tag }}
          </v-chip>
        </div>
        <p class="text-sm text-gray-600 mb-2">{{ announcement.description }}</p>
        <p class="text-xs text-gray-400 mb-0">{{ formatDate(announcement.date) }}</p>
      </v-card>
    </div>
    <div class="d-flex justify-center mt-4">
      <app-button
        label="View All"
        variant="text"
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
  announcements: {
    type: Array,
    required: true
  }
})

const formatDate = (date) => {
  const options = { month: 'short', day: 'numeric', year: 'numeric' }
  return new Date(date).toLocaleDateString('en-US', options)
}
</script>

<style scoped>
.text-gray-600 {
  color: #666 !important;
}

.text-gray-400 {
  color: #ccc !important;
}
</style>
