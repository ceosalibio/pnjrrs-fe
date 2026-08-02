<template>
  <app-card title="Reports Trend (Last 30 Days)" elevation="1" class="h-100">
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
        labels: props.data.dates,
        datasets: [
          {
            label: 'Submitted',
            data: props.data.submitted,
            borderColor: '#1f77b4',
            backgroundColor: 'rgba(31, 119, 180, 0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: '#1f77b4'
          },
          {
            label: 'Approved',
            data: props.data.approved,
            borderColor: '#2ca02c',
            backgroundColor: 'rgba(44, 160, 44, 0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: '#2ca02c'
          },
          {
            label: 'Rejected',
            data: props.data.rejected,
            borderColor: '#d62728',
            backgroundColor: 'rgba(214, 39, 40, 0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: '#d62728'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 15
            }
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
