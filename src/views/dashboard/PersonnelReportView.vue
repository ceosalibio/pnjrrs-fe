<template>
  <section class="dashboard-section">
    <!-- Section Header -->
    <div class="section-header">
      <v-avatar color="primary" variant="tonal" rounded="lg" size="40">
        <v-icon icon="mdi-account-group" />
      </v-avatar>
      <div>
        <h2 class="section-title">Personnel Readiness Report</h2>
        <p class="section-subtitle">Overview of personnel status and performance ratings</p>
      </div>
    </div>

    <!-- Stats Section -->
    <v-row class="mb-2">
      <v-col cols="6" md="3">
        <stat-card label="Required TO" :value="personnelStats.required" icon="mdi-clipboard-list-outline" color="indigo" :loading="loading" />
      </v-col>
      <v-col cols="6" md="3">
        <stat-card label="Actual Personnel" :value="personnelStats.actual" icon="mdi-account-check-outline" color="primary" :loading="loading" />
      </v-col>
      <v-col cols="6" md="3">
        <stat-card label="Submitted Report" :value="personnelStats.submitted" icon="mdi-file-check-outline" color="success" :progress="submittedPercent" :loading="loading" />
      </v-col>
      <v-col cols="6" md="3">
        <stat-card label="Not Yet Submitted" :value="personnelStats.not_submitted" icon="mdi-file-clock-outline" color="warning" :loading="loading" />
      </v-col>
    </v-row>

    <!-- Graphs -->
    <v-row>
      <v-col cols="12" lg="6">
        <readiness-graph :data="readinessData" :title="'Active Personnel Graph'" value-label="Active Personnel" :loading="loading"/>
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



const personnelStats = computed(() => {
  const currentMonth = getCurrentMonth()
  const result = props.data?.personnel?.find(r => r.report_month == currentMonth && r.is_total) || {}
  // console.log('📊 PersonnelStats filtered:', { currentMonth, result })
  return result
})

// Display only: share of submitted reports for the progress bar
const submittedPercent = computed(() => getSubmittedPercent(personnelStats.value))

const personnelValue = computed(() => {
  const result = props.data?.personnel?.filter(r => r.is_total) || []
  return result
})
// Watch to see changes

watch(() => personnelStats.value, (newVal) => {
  // console.log('👁️ PersonnelStats changed:', newVal)
}, { deep: true })

const readinessData = computed(() => {
  const labels = personnelValue.value.map(item => item.report_month)
  const values = personnelValue.value.map(item => item.actual)
  // console.log('📈 readinessData:', { labels, values })
  return {
    labels,
    values
  }
})

const ratingsData = computed(() => {
  const labels = personnelValue.value.map(item => item.report_month)
  const values = personnelValue.value.map(item => item.readiness)
  const redconStatuses = personnelValue.value.map(item => item.redcon)
  
  // console.log('📈 ratingsData:', { labels, values, redconStatuses })
  
  return {
    labels,
    values,
    redconStatuses // Include REDCON status for color coding
  }
})
</script>
