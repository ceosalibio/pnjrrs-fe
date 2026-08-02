<template>
  <!-- Page Header -->
  <v-row class="mb-6">
    <v-col>
      <h1 class="text-h4 font-weight-600">Personnel Readiness Report</h1>
      <p class="text-gray-600">Overview of personnel status and performance ratings</p>
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
          <p class="text-h3 font-weight-700">2,847</p>
        </div>
      </app-card>
    </v-col>
    <v-col cols="12" sm="6" md="3">
      <app-card elevation="1" class="h-100">
        <div class="d-flex flex-column align-center justify-center pa-4">
          <p class="text-sm text-gray-600 mb-3 text-uppercase font-weight-600">Actual Number</p>
          <p class="text-h3 font-weight-700">2,645</p>
        </div>
      </app-card>
    </v-col>
    <v-col cols="12" sm="6" md="3">
      <app-card elevation="1" class="h-100">
        <div class="d-flex flex-column align-center justify-center pa-4">
          <p class="text-sm text-gray-600 mb-3 text-uppercase font-weight-600">Submitted Report</p>
          <p class="text-h3 font-weight-700">2,590</p>
        </div>
      </app-card>
    </v-col>
    <v-col cols="12" sm="6" md="3">
      <app-card elevation="1" class="h-100">
        <div class="d-flex flex-column align-center justify-center pa-4">
          <p class="text-sm text-gray-600 mb-3 text-uppercase font-weight-600">Not Yet Submitted</p>
          <p class="text-h3 font-weight-700">55</p>
        </div>
      </app-card>
    </v-col>
  </v-row>

  <!-- Main Content: Announcement + Graphs -->
  <v-row class="mb-6">
    <!-- Announcement (Top Right) -->
    <v-col cols="12" lg="4">
      <announcement-card
        title="Personnel Update"
        message="All personnel must complete mandatory training and readiness assessments by end of August. Compliance is required."
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
  labels: ['Combat Ready', 'Fully Ready', 'Partially Ready', 'Training', 'Not Ready'],
  values: [92, 88, 68, 45, 25]
})

const ratingsData = ref({
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
  values: [82, 85, 83, 87, 90, 93]
})
</script>

<style scoped>
.text-gray-600 {
  color: #666 !important;
}
</style>
