<template>
  <!-- Page Header -->
  <v-row class="mb-6 header-row">
    <v-col>
      <h1 class="text-h4 font-weight-600 header-title">Facilities Readiness Report</h1>
      <p class="text-gray-600 header-subtitle">Overview of facility status and ratings</p>
    </v-col>

  </v-row>

  <!-- Stats Section (2x2 grid) -->
  <v-row class="mb-6">
    <v-col cols="3" sm="6" md="3">
      <app-card elevation="1" class="h-100 stats-card">
        <div class="d-flex flex-column align-center justify-center pa-4 stats-card-content text-center">
          <p class="text-sm text-gray-600 mb-3 text-uppercase font-weight-600">Submitted Report</p>
          <p class="text-h3 font-weight-700">{{stats.submitted}}</p>
        </div>
      </app-card>
    </v-col>
    <v-col cols="3" sm="6" md="3">
      <app-card elevation="1" class="h-100 stats-card">
        <div class="d-flex flex-column align-center justify-center pa-4 stats-card-content text-center">
          <p class="text-sm text-gray-600 mb-3 text-uppercase font-weight-600">Not Yet Submitted</p>
          <p class="text-h3 font-weight-700">{{stats.not_submitted}}</p>
        </div>
      </app-card>
    </v-col>
  </v-row>

  <!-- Main Content: Announcement + Graphs -->
  <v-row class="mb-6">

    <!-- Ratings Line Graph (Bottom Right) -->
    <v-col cols="12" lg="12">
      <ratings-line-graph :data="ratingsData" :title="'Facilities Readiness Rating Line Graph'"/>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import AppCard from '@/components/common/AppCard.vue'
// import AnnouncementCard from './AnnouncementCard.vue'
// import ReadinessGraph from './ReadinessGraph.vue'
import RatingsLineGraph from './RatingsLineGraph.vue'
import { getCurrentMonth} from "@/utils/dateFormatter.js"
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})



const stats = computed(() => {
  const currentMonth = getCurrentMonth()
  const result = props.data?.training?.find(r => r.report_month == '06/2026' && r.is_total) || {}
  // console.log('📊 stats filtered:', { currentMonth, result })
  return result
})

const lineValue = computed(() => {
  const result = props.data?.facility?.filter(r => r.is_total) || []
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
  const values = lineValue.value.map(item => item.rating)
  const redconStatuses = lineValue.value.map(item => item.redcon)
  
  console.log('📈 ratingsData:', { labels, values, redconStatuses })
  
  return {
    labels,
    values,
    redconStatuses // Include REDCON status for color coding
  }
})
</script>

<style scoped>
.text-gray-600 {
  color: #666 !important;
}

.header-row {
  display: flex;
  align-items: flex-start;
}

.header-title {
  margin: 0 !important;
  line-height: 1.3;
}

.header-subtitle {
  margin: 8px 0 0 0 !important;
}

.stats-card-content {
  padding: 16px !important;
}

.stats-card-content p:first-child {
  font-size: 12px !important;
  margin-bottom: 12px !important;
}

.stats-card-content p:last-child {
  font-size: 24px !important;
}

/* Mobile devices */
@media (max-width: 768px) {
  .header-row {
    text-align: center;
    justify-content: center;
  }

  .header-title {
    font-size: 20px !important;
  }

  .header-subtitle {
    font-size: 14px !important;
  }

  .stats-card-content {
    padding: 12px !important;
  }

  .stats-card-content p:first-child {
    font-size: 10px !important;
    margin-bottom: 8px !important;
  }

  .stats-card-content p:last-child {
    font-size: 18px !important;
  }
}

/* Small mobile devices */
@media (max-width: 480px) {
  .header-title {
    font-size: 18px !important;
  }

  .header-subtitle {
    font-size: 12px !important;
  }

  .stats-card-content {
    padding: 10px !important;
  }

  .stats-card-content p:first-child {
    font-size: 9px !important;
    margin-bottom: 6px !important;
  }

  .stats-card-content p:last-child {
    font-size: 16px !important;
  }
}
</style>
