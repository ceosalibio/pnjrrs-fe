<template>
  <app-card title="Personnel by Status" elevation="1" class="h-100">
    <v-row no-gutters class="align-center">
      <v-col cols="12" md="6" class="d-flex justify-center">
        <canvas ref="chartCanvas" style="max-width: 200px; max-height: 200px;"></canvas>
      </v-col>
      <v-col cols="12" md="6" class="d-flex flex-column gap-2 ps-md-4">
        <div class="d-flex flex-column gap-3">
          <div
            v-for="item in personnelData"
            :key="item.label"
            class="d-flex justify-space-between align-center"
          >
            <div class="d-flex align-center gap-2">
              <v-sheet
                :color="item.color"
                width="12"
                height="12"
                class="rounded-circle"
              ></v-sheet>
              <span class="text-sm">{{ item.label }}</span>
            </div>
            <span class="font-weight-600">{{ item.value }}</span>
          </div>
        </div>
        <v-divider class="my-2"></v-divider>
        <div class="d-flex justify-space-between">
          <span class="text-sm text-gray-600">Total:</span>
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

const personnelData = props.data.data
const total = props.data.total

onMounted(() => {
  if (chartCanvas.value) {
    const ctx = chartCanvas.value.getContext('2d')
    chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: personnelData.map(item => item.label),
        datasets: [
          {
            data: personnelData.map(item => item.value),
            backgroundColor: personnelData.map(item => item.color),
            borderWidth: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
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
