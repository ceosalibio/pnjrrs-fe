<template>
  <app-card title="Recent Activities" elevation="1">
    <v-timeline layout="compact" align="start">
      <v-timeline-item
        v-for="activity in activities"
        :key="activity.id"
        :dot-color="getDotColor(activity.type)"
        size="small"
      >
        <div class="d-flex justify-space-between align-start">
          <div class="flex-grow-1">
            <div class="d-flex align-center gap-2">
              <v-avatar size="28">
                <v-icon :color="getDotColor(activity.type)" size="16">{{ getActivityIcon(activity.type) }}</v-icon>
              </v-avatar>
              <div class="d-flex flex-column gap-1">
                <p class="font-weight-600 text-sm mb-0">{{ activity.user }}</p>
                <p class="text-xs text-gray-600 mb-0">{{ activity.action }}</p>
              </div>
            </div>
          </div>
          <p class="text-xs text-gray-600">{{ activity.time }}</p>
        </div>
      </v-timeline-item>
    </v-timeline>
    <div class="d-flex justify-center mt-4">
      <app-button
        label="View All Activities"
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
  activities: {
    type: Array,
    required: true
  }
})

const getDotColor = (type) => {
  const colors = {
    login: 'info',
    report: 'success',
    training: 'warning',
    equipment: 'primary'
  }
  return colors[type] || 'primary'
}

const getActivityIcon = (type) => {
  const icons = {
    login: 'mdi-login',
    report: 'mdi-file-check',
    training: 'mdi-school',
    equipment: 'mdi-toolbox'
  }
  return icons[type] || 'mdi-information'
}
</script>

<style scoped>
.text-gray-600 {
  color: #666 !important;
}
</style>
