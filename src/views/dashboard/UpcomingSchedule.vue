<template>
  <app-card title="Upcoming Schedule" elevation="1">
    <div class="d-flex flex-column gap-3">
      <div
        v-for="schedule in schedules"
        :key="schedule.id"
        class="d-flex justify-space-between align-start gap-3 pb-3 border-bottom"
      >
        <div class="d-flex flex-column gap-2 flex-grow-1">
          <div class="d-flex align-center gap-2">
            <v-chip
              :color="schedule.tagColor"
              size="small"
              text-color="white"
              class="font-weight-600"
            >
              {{ schedule.tag }}
            </v-chip>
            <span class="text-sm text-gray-600">{{ schedule.date }}</span>
          </div>
          <p class="font-weight-600 mb-0">{{ schedule.type }}</p>
          <p class="text-sm text-gray-600 mb-0">{{ schedule.time }}</p>
        </div>
      </div>
    </div>
    <div class="d-flex justify-center mt-4">
      <app-button
        label="View Calendar"
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
  schedules: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.text-gray-600 {
  color: #666 !important;
}

.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}

.border-bottom:last-child {
  border-bottom: none;
}
</style>
