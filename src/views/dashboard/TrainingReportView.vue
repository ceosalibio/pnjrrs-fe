<template>
  <section class="dashboard-section">
    <!-- Section Header -->
    <div class="section-header">
      <v-avatar color="success" variant="tonal" rounded="lg" size="40">
        <v-icon icon="mdi-bullseye-arrow" />
      </v-avatar>
      <div>
        <h2 class="section-title">Training Readiness Report</h2>
        <p class="section-subtitle">Overview of training programs and completion ratings</p>
      </div>
    </div>

    <!-- Stats Section -->
    <v-row class="mb-2">
      <v-col cols="6" md="3">
        <stat-card label="Nr of METT Programmed" :value="stats.required" icon="mdi-calendar-text-outline" color="indigo" :loading="loading" />
      </v-col>
      <v-col cols="6" md="3">
        <stat-card label="Nr of METT Conducted" :value="stats.actual" icon="mdi-calendar-check-outline" color="primary" :loading="loading" />
      </v-col>
      <v-col cols="6" md="3">
        <stat-card label="Submitted Report" :value="stats.submitted" icon="mdi-file-check-outline" color="success" :progress="submittedPercent" :loading="loading" />
      </v-col>
      <v-col cols="6" md="3">
        <stat-card label="Not Yet Submitted" :value="stats.not_submitted" icon="mdi-file-clock-outline" color="warning" :loading="loading" />
      </v-col>
    </v-row>

    <!-- Graphs -->
    <v-row>
      <v-col cols="12" lg="6">
        <readiness-graph :data="readinessData" :title="'Nr of METT Conducted Graph'" value-label="METT Conducted" :loading="loading"/>
      </v-col>
      <v-col cols="12" lg="6">
        <ratings-line-graph :data="ratingsData" :title="'Readiness Rating Line Graph'" :loading="loading"/>
      </v-col>
    </v-row>
  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import AppCard from '@/components/common/AppCard.vue'
// import AnnouncementCard from './AnnouncementCard.vue'
import ReadinessGraph from './ReadinessGraph.vue'
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
  const result = props.data?.training?.find(r => r.report_month == currentMonth && r.is_total) || {}
  // console.log('📊 stats filtered:', { currentMonth, result })
  return result
})

// Display only: share of submitted reports for the progress bar
const submittedPercent = computed(() => getSubmittedPercent(stats.value))

const lineValue = computed(() => {
  const result = props.data?.training?.filter(r => r.is_total) || []
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
  const values = lineValue.value.map(item => item.readiness)
  const redconStatuses = lineValue.value.map(item => item.redcon)
  
  // console.log('📈 ratingsData:', { labels, values, redconStatuses })
  
  return {
    labels,
    values,
    redconStatuses // Include REDCON status for color coding
  }
})
</script>
