<template>
  <app-card title="Ratings Line Graph" elevation="1" class="h-100">
    <canvas ref="chartCanvas"></canvas>
  </app-card>
</template>

<script setup>
import { defineProps, onMounted, ref, watch } from 'vue'
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

// Custom plugin to draw labels on data points with REDCON color coding
const dataLabelsPlugin = {
  id: 'dataLabels',
  afterDatasetsDraw(chart) {
    const { ctx } = chart
    const redconStatuses = chart.data.redconStatuses || []
    
    // REDCON color mapping
    const redconColors = {
      'R1': '#2ca02c', // Green
      'R2': '#1f77b4', // Blue
      'R3': '#ff7f0e', // Yellow/Orange
      'R4': '#d62728'  // Red
    }
    
    chart.data.datasets.forEach((datasetMeta, i) => {
      const meta = chart.getDatasetMeta(i)
      if (!meta.hidden) {
        meta.data.forEach((element, index) => {
          const data = chart.data.datasets[i].data[index]
          const redcon = redconStatuses[index] || ''
          const { x, y } = element.getProps(['x', 'y'], true)
          
          // Use REDCON color if available, else default blue
          const textColor = redconColors[redcon] || '#1f77b4'
          
          ctx.fillStyle = textColor
          ctx.font = 'bold 11px Arial'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'bottom'
          ctx.fillText(Math.round(data) + '%', x, y - 10)
          
          // Draw REDCON badge below the percentage
          if (redcon) {
            const badgeWidth = 30
            const badgeHeight = 16
            const badgeX = x + 35
            const badgeY = y - 20
            
            // Draw badge background
            ctx.fillStyle = textColor
            ctx.fillRect(badgeX - badgeWidth / 2, badgeY, badgeWidth, badgeHeight)
            
            // Draw REDCON text
            ctx.fillStyle = '#fff'
            ctx.font = 'bold 10px Arial'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(redcon, badgeX, badgeY + badgeHeight / 2)
          }
        })
      }
    })
  }
}

const initChart = () => {
  // Handle new format with readiness values and REDCON statuses
  const labels = props.data.labels || []
  const values = props.data.values || props.data.datasets?.[0]?.data || []
  const redconStatuses = props.data.redconStatuses || []
  
  if (chartCanvas.value && labels.length > 0 && values.length > 0) {
    // Destroy existing chart if it exists
    if (chartInstance) {
      chartInstance.destroy()
    }
    
    const ctx = chartCanvas.value.getContext('2d')
    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        redconStatuses, // Store REDCON data in chart object
        datasets: [
          {
            label: 'Readiness %',
            data: values,
            borderColor: '#1f77b4',
            backgroundColor: 'rgba(31, 119, 180, 0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 5,
            pointHoverRadius: 7,
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
      },
      plugins: [dataLabelsPlugin]
    })
  }
}

onMounted(() => {
  initChart()
})

// Watch for data changes and recreate chart
watch(() => [props.data.values, props.data.redconStatuses], () => {
  initChart()
}, { deep: true })

defineExpose({ chartInstance })
</script>
