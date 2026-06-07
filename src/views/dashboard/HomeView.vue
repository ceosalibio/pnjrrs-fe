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

  <!-- Summary Cards -->
  <v-row class="mb-6">
    <v-col
      v-for="stat in dashboardData.stats"
      :key="stat.label"
      cols="12"
      sm="6"
      lg="3"
    >
      <app-card elevation="1">
        <v-row no-gutters class="align-center">
          <v-col cols="8">
            <p class="text-sm text-gray-600 mb-2">{{ stat.label }}</p>
            <p class="text-h5 font-weight-600">{{ stat.value }}</p>
          </v-col>
          <v-col cols="4" class="d-flex justify-end">
            <v-avatar
              :color="`${stat.color}20`"
              size="48"
            >
              <v-icon :color="stat.color" size="24">{{ stat.icon }}</v-icon>
            </v-avatar>
          </v-col>
        </v-row>
      </app-card>
    </v-col>
  </v-row>

  <!-- Main Content -->
  <v-row>
    <!-- Recent Activities -->
    <v-col cols="12" lg="8">
      <app-card title="Recent Activities" elevation="1">
        <v-timeline layout="compact">
          <v-timeline-item
            v-for="activity in dashboardData.recentActivities"
            :key="activity.id"
            dot-color="primary"
            size="small"
          >
            <div class="d-flex justify-space-between align-start">
              <div>
                <p class="font-weight-600">{{ activity.user }}</p>
                <p class="text-sm text-gray-600">{{ getActivityType(activity.type) }}</p>
              </div>
              <p class="text-sm text-gray-600">{{ activity.time }}</p>
            </div>
          </v-timeline-item>
        </v-timeline>
      </app-card>
    </v-col>

    <!-- Announcements -->
    <v-col cols="12" lg="4">
      <app-card title="Announcements" elevation="1">
        <div class="d-flex flex-column gap-3">
          <v-card
            v-for="announcement in dashboardData.announcements"
            :key="announcement.id"
            flat
            border
            class="pa-3"
          >
            <p class="font-weight-600 mb-1">{{ announcement.title }}</p>
            <p class="text-sm text-gray-600 mb-2">{{ announcement.description }}</p>
            <p class="text-xs text-gray-400">{{ announcement.date }}</p>
          </v-card>
        </div>
      </app-card>
    </v-col>
  </v-row>

  <!-- Quick Actions -->
  <v-row class="mt-6">
    <v-col cols="12">
      <app-card title="Quick Actions" elevation="1">
        <v-row>
          <v-col cols="12" sm="6" md="3">
            <app-button
              label="Add Personnel"
              icon="mdi-account-plus"
              color="primary"
              full-width
              @click="goToPersonnel"
            />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <app-button
              label="Schedule Training"
              icon="mdi-school-outline"
              color="success"
              full-width
              @click="goToTrainings"
            />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <app-button
              label="Equipment Status"
              icon="mdi-toolbox-outline"
              color="info"
              full-width
              @click="goToEquipment"
            />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <app-button
              label="View Reports"
              icon="mdi-file-document-outline"
              color="warning"
              full-width
              @click="goToReports"
            />
          </v-col>
        </v-row>
      </app-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { mockDashboardData } from '@/utils/mockData'
import AppCard from '@/components/common/AppCard.vue'
import AppButton from '@/components/common/AppButton.vue'

const router = useRouter()
const userStore = useUserStore()

const dashboardData = ref(mockDashboardData)

const currentDate = computed(() => {
  const today = new Date()
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  return today.toLocaleDateString('en-US', options)
})

const getActivityType = (type) => {
  const types = {
    login: 'User logged in',
    report: 'Report submitted',
    training: 'Training scheduled',
    equipment: 'Equipment updated'
  }
  return types[type] || 'Activity'
}

const goToPersonnel = () => router.push('/personnel')
const goToTrainings = () => router.push('/trainings')
const goToEquipment = () => router.push('/equipment')
const goToReports = () => router.push('/reports')

onMounted(() => {
  // Load dashboard data
})
</script>
