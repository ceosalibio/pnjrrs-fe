<template>
  <app-card title="Readiness Graph" elevation="1" class="h-100">
    <div class="chart-area">
      <v-skeleton-loader v-if="loading" type="image" class="chart-skeleton" />
      <div v-show="!loading && hasData" class="chart-canvas-wrap">
        <canvas ref="chartCanvas"></canvas>
      </div>
      <div v-if="!loading && !hasData" class="chart-empty">
        <v-icon icon="mdi-chart-bar" size="40" class="mb-2" />
        <div>No data to display yet</div>
      </div>
    </div>
  </app-card>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import Chart from 'chart.js/auto'
import AppCard from '@/components/common/AppCard.vue'
import { CHART_PRIMARY, CHART_GRID, CHART_TEXT, formatMonthLabel } from './chartTheme.js'

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  // Label shown in the tooltip for each bar
  valueLabel: {
    type: String,
    default: 'Readiness Level'
  }
})

const chartCanvas = ref(null)
let chartInstance = null

const hasData = computed(() => (props.data?.values?.length || 0) > 0)

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

          ctx.fillStyle = CHART_TEXT
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
        labels: (props.data.labels || []).map(formatMonthLabel),
        datasets: [
          {
            label: props.valueLabel,
            data: props.data.values,
            backgroundColor: CHART_PRIMARY,
            hoverBackgroundColor: '#165a91',
            borderRadius: 6,
            borderWidth: 0,
            maxBarThickness: 48
          }
        ]
      },
      options: {
        indexAxis: 'x',
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: { top: 20 }
        },
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: CHART_TEXT }
          },
          y: {
            beginAtZero: true,
            max: yAxisMax,
            grid: { color: CHART_GRID },
            ticks: { color: CHART_TEXT, precision: 0 }
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
watch(() => props.data.values, () => {
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

@media (max-width: 600px) {
  .chart-area {
    height: 240px;
  }
}
</style>
