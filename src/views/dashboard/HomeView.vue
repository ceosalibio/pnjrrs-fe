<template>
  <!-- Page Header -->
  <v-row class="mb-6">
    <v-col>
      <h1 class="text-h4 font-weight-600">Dashboard</h1>
      <p class="text-gray-600">Welcome back, {{ userStore.getFullName }}</p>
    </v-col>
    <v-col auto class="d-flex align-center">
      <p class="text-sm text-gray-600">{{ currentDate }}</p>
    </v-col>
  </v-row>

  <!-- Dashboard Stats -->
  <dashboard-stats :stats="dashboardData.stats" />

  <!-- Charts Row 1 -->
  <v-row class="mb-6">
    <v-col cols="12" lg="6">
      <personnel-status-chart :data="dashboardData.personnelStatus" />
    </v-col>
    <v-col cols="12" lg="6">
      <reports-trend-chart :data="dashboardData.reportsTrend" />
    </v-col>
  </v-row>

  <!-- Equipment Status -->
  <v-row class="mb-6">
    <v-col cols="12">
      <equipment-status-chart :data="dashboardData.equipmentStatus" />
    </v-col>
  </v-row>

  <!-- Bottom Section: Schedule, Activities, Announcements -->
  <v-row class="mb-6">
    <v-col cols="12" lg="4">
      <upcoming-schedule :schedules="dashboardData.upcomingSchedule" />
    </v-col>
    <v-col cols="12" lg="4">
      <recent-activities-section :activities="dashboardData.recentActivities" />
    </v-col>
    <v-col cols="12" lg="4">
      <announcements-section :announcements="dashboardData.announcements" />
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { mockDashboardData } from '@/utils/mockData'
import DashboardStats from './DashboardStats.vue'
import PersonnelStatusChart from './PersonnelStatusChart.vue'
import ReportsTrendChart from './ReportsTrendChart.vue'
import EquipmentStatusChart from './EquipmentStatusChart.vue'
import UpcomingSchedule from './UpcomingSchedule.vue'
import RecentActivitiesSection from './RecentActivitiesSection.vue'
import AnnouncementsSection from './AnnouncementsSection.vue'

const router = useRouter()
const userStore = useUserStore()

const dashboardData = ref(mockDashboardData)

const currentDate = computed(() => {
  const today = new Date()
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  return today.toLocaleDateString('en-US', options)
})

const goToPersonnel = () => router.push('/personnel')
const goToTrainings = () => router.push('/trainings')
const goToEquipment = () => router.push('/equipment')
const goToReports = () => router.push('/reports')

onMounted(() => {
  // Load dashboard data
})
</script>

<style scoped>
.text-gray-600 {
  color: #666 !important;
}
</style>
