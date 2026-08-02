<template>
  <!-- Page Header -->
  <v-row class="mb-6">
    <v-col>
      <h1 class="text-h4 font-weight-600">Training Readiness Report</h1>
      <p class="text-gray-600">Overview of training programs and completion ratings</p>
    </v-col>
    <v-col auto class="d-flex align-center">
      <p class="text-sm text-gray-600">{{ currentDate }}</p>
    </v-col>
  </v-row>

  <!-- Stats Section (2x2 grid) -->
  <v-row class="mb-6">
    <v-col cols="12" sm="6" md="3">
      <app-card elevation="1" class="h-100">
        <div class="d-flex flex-column align-center justify-center pa-4">
          <p class="text-sm text-gray-600 mb-3 text-uppercase font-weight-600">Required Number</p>
          <p class="text-h3 font-weight-700">45</p>
        </div>
      </app-card>
    </v-col>
    <v-col cols="12" sm="6" md="3">
      <app-card elevation="1" class="h-100">
        <div class="d-flex flex-column align-center justify-center pa-4">
          <p class="text-sm text-gray-600 mb-3 text-uppercase font-weight-600">Actual Number</p>
          <p class="text-h3 font-weight-700">42</p>
        </div>
      </app-card>
    </v-col>
    <v-col cols="12" sm="6" md="3">
      <app-card elevation="1" class="h-100">
        <div class="d-flex flex-column align-center justify-center pa-4">
          <p class="text-sm text-gray-600 mb-3 text-uppercase font-weight-600">Submitted Report</p>
          <p class="text-h3 font-weight-700">40</p>
        </div>
      </app-card>
    </v-col>
    <v-col cols="12" sm="6" md="3">
      <app-card elevation="1" class="h-100">
        <div class="d-flex flex-column align-center justify-center pa-4">
          <p class="text-sm text-gray-600 mb-3 text-uppercase font-weight-600">Not Yet Submitted</p>
          <p class="text-h3 font-weight-700">2</p>
        </div>
      </app-card>
    </v-col>
  </v-row>

  <!-- Main Content: Announcement + Graphs -->
  <v-row class="mb-6">
    <!-- Announcement (Top Right) -->
    <v-col cols="12" lg="4">
      <announcement-card
        title="Training Announcement"
        message="New Advanced Maritime Operations Training program launching September 1, 2026. Early registration now open."
      />
    </v-col>

    <!-- Readiness Graph (Bottom Left) -->
    <v-col cols="12" lg="6">
      <readiness-graph :data="readinessData" />
    </v-col>

    <!-- Ratings Line Graph (Bottom Right) -->
    <v-col cols="12" lg="6">
      <ratings-line-graph :data="ratingsData" />
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppCard from '@/components/common/AppCard.vue'
import AnnouncementCard from './AnnouncementCard.vue'
import ReadinessGraph from './ReadinessGraph.vue'
import RatingsLineGraph from './RatingsLineGraph.vue'

const currentDate = computed(() => {
  const today = new Date()
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  return today.toLocaleDateString('en-US', options)
})

const readinessData = ref({
  labels: ['Completed', 'In Progress', 'Scheduled', 'Pending', 'Not Started'],
  values: [35, 8, 12, 5, 3]
})

const ratingsData = ref({
  labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'],
  values: [78, 82, 85, 88, 90, 93]
})
</script>

<style scoped>
.text-gray-600 {
  color: #666 !important;
}
</style>
