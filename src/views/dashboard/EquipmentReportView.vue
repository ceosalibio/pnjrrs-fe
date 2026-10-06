<template>
  <section class="dashboard-section">
    <!-- Section Header -->
    <div class="section-header">
      <v-avatar color="orange-darken-2" variant="tonal" rounded="lg" size="40">
        <v-icon icon="mdi-toolbox" />
      </v-avatar>
      <div>
        <h2 class="section-title">Equipment Readiness Report</h2>
        <p class="section-subtitle">Overview of equipment status and operational ratings</p>
      </div>
    </div>

    <!-- Stats Section -->
    <v-row class="mb-2">
      <v-col cols="6">
        <stat-card label="Submitted Report" :value="stats.submitted" icon="mdi-file-check-outline" color="success" :progress="submittedPercent" :loading="loading" />
      </v-col>
      <v-col cols="6">
        <stat-card label="Not Yet Submitted" :value="stats.not_submitted" icon="mdi-file-clock-outline" color="warning" :loading="loading" />
      </v-col>
    </v-row>

    <!-- Graphs -->
    <v-row>
      <v-col cols="12" lg="6">
        <ratings-line-graph :data="ratingsData" :title="'Equipment Readiness Rating Line Graph'" :loading="loading"/>
      </v-col>
      <v-col cols="12" lg="6">
        <ratings-line-graph :data="ratingsDataMaintenance" :title="'Maintenance Readiness Rating Line Graph'" :loading="loading"/>
      </v-col>
    </v-row>
  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import AppCard from '@/components/common/AppCard.vue'
// import AnnouncementCard from './AnnouncementCard.vue'
// import ReadinessGraph from './ReadinessGraph.vue'
import RatingsLineGraph from './RatingsLineGraph.vue'
import StatCard from './StatCard.vue'
import {currentDate , getCurrentMonth} from "@/utils/dateFormatter.js"
import { getSubmittedPercent } from './chartTheme.js'
const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})



const stats = computed(() => {
  const currentMonth = getCurrentMonth()
  const result = props.data?.equipment?.find(r => r.report_month == currentMonth && r.is_total) || {}
  // console.log('📊 stats filtered:', { currentMonth, result })
  return result
})

// Display only: share of submitted reports for the progress bar
const submittedPercent = computed(() => getSubmittedPercent(stats.value))

const lineValue = computed(() => {
  const result = props.data?.equipment?.filter(r => r.is_total) || []
  return result
})




const readinessData = computed(() => {
  const labels = lineValue.value?.map(item => item.report_month)
  const values = lineValue.value?.map(item => item.actual)
  return {
    labels,
    values
  }
})

const ratingsData = computed(() => {
  const labels = lineValue.value.map(item => item.report_month)
  const values = lineValue.value.map(item => item.rating_equipment)
  const redconStatuses = lineValue.value.map(item => item.redcon_equipment)
  
  // console.log('📈 ratingsData:', { labels, values, redconStatuses })
  
  return {
    labels,
    values,
    redconStatuses // Include REDCON status for color coding
  }
})

const ratingsDataMaintenance = computed(() => {
  const labels = lineValue.value.map(item => item.report_month)
  const values = lineValue.value.map(item => item.rating_maintenance)
  const redconStatuses = lineValue.value.map(item => item.redcon_maintenance)
  
  // console.log('📈 ratingsData:', { labels, values, redconStatuses })
  
  return {
    labels,
    values,
    redconStatuses // Include REDCON status for color coding
  }
})
</script>
