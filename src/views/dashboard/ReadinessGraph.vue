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

// Custom plugin to draw labels on top of bars
const dataLabelsPlugin = {
  id: 'dataLabels',
  afterDatasetsDraw(chart) {
    const { ctx } = chart
    chart.data.datasets.forEach((datasetMeta, i) => {
      const meta = chart.getDatasetMeta(i)
      if (!meta.hidden) {
        meta.data.forEach((element, index) => {
          const data = chart.data.datasets[i].data[index]
          const { x, y } = element.getProps(['x', 'y'], true)
          
          ctx.fillStyle = '#333'
          ctx.font = 'bold 12px Arial'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'bottom'
          ctx.fillText(Math.round(data), x, y - 5)
        })
      }
    })
  }
}

const initChart = () => {
  if (chartCanvas.value && props.data.values && props.data.values.length > 0) {
    // Destroy existing chart if it exists
    if (chartInstance) {
      chartInstance.destroy()
    }
    
    const ctx = chartCanvas.value.getContext('2d')
    
    // Calculate max value to accommodate all data
    const maxValue = Math.max(...props.data.values)
    const yAxisMax = Math.ceil(maxValue * 1.1) // 10% padding
    
    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: props.data.labels || [],
        datasets: [
          {
            label: 'Readiness Level',
            data: props.data.values,
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
            max: yAxisMax
          }
        }
      },
      plugins: [dataLabelsPlugin]
    })
  }
}

onMounted(() => {
  initChart()
})

// Watch for data changes and recreate chart
import { watch } from 'vue'
watch(() => props.data.values, () => {
  initChart()
}, { deep: true })

defineExpose({ chartInstance })
</script>
