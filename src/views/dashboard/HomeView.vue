<template>

  <PersonnelReportView :data="dashboardData" v-if="[1,3].includes(authStore.office)"/>
  <TrainingReportView  :data="dashboardData" v-if="[8,3].includes(authStore.office)"/>
  <EquipmentReportView :data="dashboardData" v-if="[4,6,3].includes(authStore.office)"/>
  <FacilitiesReportView :data="dashboardData" v-if="[4,6,3].includes(authStore.office)"/>/>

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

const router = useRouter()
const authStore = useAuthStore()

const dashboardData = ref('')

const currentDate = computed(() => {
  const today = new Date()
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  return today.toLocaleDateString('en-US', options)
})

const getStatsData = async () =>{
  // If admin (hpn=true), see all data (unit_id=null). Otherwise, filter by own unit
  const isAdmin = authStore.hpn
  const payload = {
    unit_id: isAdmin ? null : authStore.user?.unit_id
  }
  const response = await executeReportAction(payload, 'all','stats')
  dashboardData.value = response.data
}

onMounted(() => {
  getStatsData()
})
</script>

<style scoped>
.text-gray-600 {
  color: #666 !important;
}
</style>
