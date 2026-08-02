<template>
  <!-- Page Header -->
  <v-row class="mb-6">
    <v-col>
      <h1 class="text-h4 font-weight-600">Reports Readiness Overview</h1>
      <p class="text-gray-600">Consolidated view of all submitted and pending reports</p>
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
          <p class="text-sm text-gray-600 mb-3 text-uppercase font-weight-600">Total Reports</p>
          <p class="text-h3 font-weight-700">450</p>
        </div>
      </app-card>
    </v-col>
    <v-col cols="12" sm="6" md="3">
      <app-card elevation="1" class="h-100">
        <div class="d-flex flex-column align-center justify-center pa-4">
          <p class="text-sm text-gray-600 mb-3 text-uppercase font-weight-600">Submitted</p>
          <p class="text-h3 font-weight-700">425</p>
        </div>
      </app-card>
    </v-col>
    <v-col cols="12" sm="6" md="3">
      <app-card elevation="1" class="h-100">
        <div class="d-flex flex-column align-center justify-center pa-4">
          <p class="text-sm text-gray-600 mb-3 text-uppercase font-weight-600\">Approved</p>
          <p class="text-h3 font-weight-700">398</p>
        </div>
      </app-card>
    </v-col>
    <v-col cols="12" sm="6" md="3">
      <app-card elevation="1" class="h-100">
        <div class="d-flex flex-column align-center justify-center pa-4">
          <p class="text-sm text-gray-600 mb-3 text-uppercase font-weight-600">Pending</p>
          <p class="text-h3 font-weight-700">27</p>
        </div>
      </app-card>
    </v-col>
  </v-row>

  <!-- Main Content: Announcement + Graphs -->
  <v-row class="mb-6">
    <!-- Announcement (Top Right) -->
    <v-col cols="12" lg="4">
      <announcement-card
        title="Report Deadline"
        message="All outstanding reports must be submitted by August 31, 2026. Late submissions will require justification."
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
  labels: ['Approved', 'Pending Review', 'Rejected', 'Resubmitted', 'Draft'],
  values: [398, 27, 12, 8, 5]
})

const ratingsData = ref({
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
  values: [70, 75, 80, 85, 88, 92]
})
</script>

<style scoped>
.text-gray-600 {
  color: #666 !important;
}
</style>
