<template>
  <app-card title="Ratings Line Graph" elevation="1" class="h-100">
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
      type: 'line',
      data: {
        labels: props.data.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Rating',
            data: props.data.values || [75, 80, 78, 85, 88, 92],
            borderColor: '#1f77b4',
            backgroundColor: 'rgba(31, 119, 180, 0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: '#1f77b4',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            position: 'top'
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
