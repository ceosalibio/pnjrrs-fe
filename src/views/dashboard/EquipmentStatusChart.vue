<template>
  <app-card title="Equipment Status" elevation="1" class="h-100">
    <v-row no-gutters class="align-center">
      <v-col cols="12" md="8">
        <canvas ref="chartCanvas"></canvas>
      </v-col>
      <v-col cols="12" md="4" class="d-flex flex-column justify-center ps-md-4">
        <div class="d-flex flex-column gap-2">
          <div
            v-for="item in equipmentData"
            :key="item.label"
            class="d-flex flex-column gap-1"
          >
            <div class="d-flex justify-space-between align-center">
              <span class="text-sm">{{ item.label }}</span>
              <span class="font-weight-600">{{ item.value }}</span>
            </div>
            <v-progress-linear
              :model-value="item.percentage"
              height="6"
              :color="getBarColor(item.label)"
            ></v-progress-linear>
          </div>
        </div>
        <v-divider class="my-3"></v-divider>
        <div class="d-flex justify-space-between">
          <span class="text-sm text-gray-600">Total Equipment:</span>
          <span class="font-weight-600">{{ total }}</span>
        </div>
      </v-col>
    </v-row>
  </app-card>
</template>

<script setup>
import { defineProps, onMounted, ref } from 'vue'
import Chart from 'chart.js/auto'
import AppCard from '@/components/common/AppCard.vue'

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const chartCanvas = ref(null)
let chartInstance = null

const equipmentData = props.data.data
const total = props.data.total

const getBarColor = (label) => {
  const colors = {
    'Operational': '#2ca02c',
    'Under Maintenance': '#ff7f0e',
    'For Replacement': '#d62728',
    'Inspection Due': '#1f77b4'
  }
  return colors[label] || '#1f77b4'
}

onMounted(() => {
  if (chartCanvas.value) {
    const ctx = chartCanvas.value.getContext('2d')
    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: equipmentData.map(item => item.label),
        datasets: [
          {
            label: 'Equipment Count',
            data: equipmentData.map(item => item.value),
            backgroundColor: [
              '#2ca02c',
              '#ff7f0e',
              '#d62728',
              '#1f77b4'
            ],
            borderRadius: 4,
            borderWidth: 0
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 250
          }
        }
      }
    })
  }
})

defineExpose({ chartInstance })
</script>

<style scoped>
.text-gray-600 {
  color: #666 !important;
}
</style>
