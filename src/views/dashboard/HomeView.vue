<template>
  <div class="dashboard">
    <!-- Page Header -->
    <div class="dashboard-header">
      <div>
        <h1 class="dashboard-title">Dashboard</h1>
        <p class="dashboard-date">
          <v-icon icon="mdi-calendar-today" size="16" class="mr-1" />
          {{ currentDate }}
        </p>
      </div>
    </div>

    <v-alert
      v-if="loadFailed"
      type="warning"
      variant="tonal"
      density="compact"
      class="mb-4"
      text="Unable to load the latest dashboard data. Please refresh the page or try again later."
    />

    <!-- More than one report: show as tabs -->
    <template v-if="sections.length > 1">
      <v-tabs v-model="activeTab" color="primary" class="dashboard-tabs mb-4" show-arrows>
        <v-tab v-for="section in sections" :key="section.key" :value="section.key">
          <v-icon :icon="section.icon" start />
          {{ section.label }}
        </v-tab>
      </v-tabs>

      <v-window v-model="activeTab">
        <v-window-item v-for="section in sections" :key="section.key" :value="section.key">
          <component :is="section.component" :data="dashboardData || {}" :loading="isLoading" />
        </v-window-item>
      </v-window>
    </template>

    <!-- Single report: show directly -->
    <component
      v-else-if="sections.length === 1"
      :is="sections[0].component"
      :data="dashboardData || {}"
      :loading="isLoading"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.js'
import { executeReportAction } from '@/services/reportService.js'

import PersonnelReportView from './PersonnelReportView.vue'
import TrainingReportView from './TrainingReportView.vue'
import EquipmentReportView from './EquipmentReportView.vue'
import FacilitiesReportView from './FacilitiesReportView.vue'
import './dashboard.css'

const router = useRouter()
const authStore = useAuthStore()
const dashboardData = ref('')
const statsStatus = ref(true)
const currentDate = computed(() => {
  const today = new Date()
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  return today.toLocaleDateString('en-US', options)
})

// UI state only
const isLoading = ref(true)
const loadFailed = ref(false)
const activeTab = ref(null)

// Same office rules as before; only decides which report sections are shown
const sections = computed(() => [
  { key: 'personnel', label: 'Personnel', icon: 'mdi-account-group', component: PersonnelReportView, offices: [1, 3] },
  { key: 'training', label: 'Training', icon: 'mdi-bullseye-arrow', component: TrainingReportView, offices: [8, 3] },
  { key: 'equipment', label: 'Equipment', icon: 'mdi-toolbox', component: EquipmentReportView, offices: [4, 6, 3] },
  { key: 'facilities', label: 'Facilities', icon: 'mdi-home-city', component: FacilitiesReportView, offices: [4, 6, 3] }
].filter(section => section.offices.includes(authStore.office)))

const getStatsData = async () =>{
  // If admin (hpn=true), see all data (unit_id=null). Otherwise, filter by own unit
  // Derived from the persisted user (authStore.hpn isn't persisted, so it's null after a reload)
  const isAdmin = authStore.user?.unit_id == 1
  const payload = {
    unit_id: isAdmin ? null : authStore.user?.unit_id
  }
  const response = await executeReportAction(payload, 'all','stats')
  dashboardData.value = response.data
  return response.status == 'success' ? true : false
}

onMounted(async () => {
  const maxRetries = 5
  let retryCount = 0
  let delay = 1000 // Start with 1 second delay

  try {
    while (retryCount < maxRetries) {
      statsStatus.value = await getStatsData()
      // console.log('📊 Dashboard stats status:', statsStatus.value)

      if (statsStatus.value) {
        // console.log('✅ Dashboard stats loaded successfully')
        break
      }

      retryCount++
      if (retryCount < maxRetries) {
        console.error(`Failed to fetch dashboard stats data. Retry ${retryCount}/${maxRetries} in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
        delay *= 2 // Exponential backoff: 1s, 2s, 4s, 8s, 16s
      } else {
        console.error('Failed to fetch dashboard stats data after all retries')
      }
    }
  } finally {
    isLoading.value = false
    loadFailed.value = !statsStatus.value
  }
})
</script>

<style scoped>
.dashboard-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
}

.dashboard-title {
  font-size: 1.75rem;
  font-weight: 600;
  line-height: 1.2;
  margin: 0;
}

.dashboard-date {
  display: flex;
  align-items: center;
  margin: 6px 0 0;
  font-size: 0.9rem;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
}

.dashboard-tabs {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

@media (max-width: 600px) {
  .dashboard-title {
    font-size: 1.35rem;
  }

  .dashboard-date {
    font-size: 0.8rem;
  }
}
</style>
