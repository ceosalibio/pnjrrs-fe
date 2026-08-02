<template>
  <app-card title="Readiness Graph" elevation="1" class="h-100">
    <canvas ref="chartCanvas"></canvas>
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

onMounted(() => {
  if (chartCanvas.value) {
    const ctx = chartCanvas.value.getContext('2d')
    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: props.data.labels || ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5'],
        datasets: [
          {
            label: 'Readiness Level',
            data: props.data.values || [85, 78, 92, 88, 95],
            backgroundColor: [
              '#2ca02c',
              '#1f77b4',
              '#ff7f0e',
              '#d62728',
              '#9467bd'
            ],
            borderRadius: 4,
            borderWidth: 0
          }
        ]
      },
      options: {
        indexAxis: 'x',
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    })
  }
})

defineExpose({ chartInstance })
</script>
