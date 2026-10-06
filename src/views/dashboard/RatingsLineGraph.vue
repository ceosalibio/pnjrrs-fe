<template>
  <app-card title="Ratings Line Graph" elevation="1" class="h-100">
    <div class="chart-area">
      <v-skeleton-loader v-if="loading" type="image" class="chart-skeleton" />
      <div v-show="!loading && hasData" class="chart-canvas-wrap">
        <canvas ref="chartCanvas"></canvas>
      </div>
      <div v-if="!loading && !hasData" class="chart-empty">
        <v-icon icon="mdi-chart-line" size="40" class="mb-2" />
        <div>No data to display yet</div>
      </div>
    </div>

    <!-- REDCON legend -->
    <div v-if="!loading && hasData && hasRedcon" class="redcon-legend">
      <span v-for="(color, key) in REDCON_COLORS" :key="key" class="redcon-legend__item">
        <span class="redcon-legend__dot" :style="{ backgroundColor: color }" />
        {{ red.redCon(key) }}
      </span>
    </div>
  </app-card>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import Chart from 'chart.js/auto'
import AppCard from '@/components/common/AppCard.vue'
import {
  CHART_PRIMARY,
  CHART_PRIMARY_FILL,
  CHART_GRID,
  CHART_TEXT,
  REDCON_COLORS,
  formatMonthLabel
} from './chartTheme.js'
import { red } from '@/utils/redcon.js'

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const chartCanvas = ref(null)
let chartInstance = null

const chartValues = computed(() => props.data?.values || props.data?.datasets?.[0]?.data || [])
const hasData = computed(() => (props.data?.labels?.length || 0) > 0 && chartValues.value.length > 0)
const hasRedcon = computed(() => (props.data?.redconStatuses || []).some(Boolean))

// Custom plugin to draw the % label above each point, colored by REDCON status
const dataLabelsPlugin = {
  id: 'dataLabels',
  afterDatasetsDraw(chart) {
    const { ctx } = chart
    const redconStatuses = chart.data.redconStatuses || []

    chart.data.datasets.forEach((datasetMeta, i) => {
      const meta = chart.getDatasetMeta(i)
      if (!meta.hidden) {
        meta.data.forEach((element, index) => {
          const data = chart.data.datasets[i].data[index]
          const redcon = redconStatuses[index] || ''
          const { x, y } = element.getProps(['x', 'y'], true)

          // Use REDCON color if available, else default blue
          ctx.fillStyle = REDCON_COLORS[redcon] || CHART_PRIMARY
          ctx.font = 'bold 11px Arial'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'bottom'
          ctx.fillText(Math.round(data) + '%', x, y - 10)
        })
      }
    })
  }
}

const initChart = () => {
  // Handle new format with readiness values and REDCON statuses
  const labels = props.data.labels || []
  const values = chartValues.value
  const redconStatuses = props.data.redconStatuses || []

  if (chartCanvas.value && labels.length > 0 && values.length > 0) {
    // Destroy existing chart if it exists
    if (chartInstance) {
      chartInstance.destroy()
    }

    // Color each point by its REDCON status
    const pointColors = values.map((_, index) => REDCON_COLORS[redconStatuses[index]] || CHART_PRIMARY)

    const ctx = chartCanvas.value.getContext('2d')
    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels.map(formatMonthLabel),
        redconStatuses, // Store REDCON data in chart object
        datasets: [
          {
            label: 'Readiness %',
            data: values,
            borderColor: CHART_PRIMARY,
            backgroundColor: CHART_PRIMARY_FILL,
            tension: 0.4,
            fill: true,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBackgroundColor: pointColors,
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: { top: 24, left: 8, right: 16 }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const redcon = redconStatuses[context.dataIndex]
                const value = Math.round(context.parsed.y)
                return redcon ? `Readiness: ${value}% (${redcon})` : `Readiness: ${value}%`
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: CHART_TEXT }
          },
          y: {
            beginAtZero: true,
            max: 100,
            grid: { color: CHART_GRID },
            ticks: {
              color: CHART_TEXT,
              callback: (value) => `${value}%`
            }
          }
        }
      },
      plugins: [dataLabelsPlugin]
    })
  } else if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
}

onMounted(() => {
  initChart()
})

// Watch for data changes and recreate chart (post flush so the canvas is visible)
watch(() => [props.data.values, props.data.redconStatuses], () => {
  initChart()
}, { deep: true, flush: 'post' })

// Redraw once loading ends, in case the chart was created while hidden
watch(() => props.loading, (isLoading) => {
  if (!isLoading) initChart()
}, { flush: 'post' })

defineExpose({ chartInstance })
</script>

<style scoped>
.chart-area {
  position: relative;
  height: 300px;
}

.chart-canvas-wrap {
  position: relative;
  height: 100%;
}

.chart-skeleton {
  height: 100%;
}

.chart-skeleton :deep(.v-skeleton-loader__image) {
  height: 100%;
}

.chart-empty {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  font-size: 14px;
}

.redcon-legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  margin-top: 12px;
  font-size: 12px;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
}

.redcon-legend__item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.redcon-legend__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

@media (max-width: 600px) {
  .chart-area {
    height: 240px;
  }
}
</style>
