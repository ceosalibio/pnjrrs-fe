<template>
  <v-card elevation="1" class="stat-card h-100" :class="`stat-card--${color}`">
    <div class="stat-card__body">
      <v-avatar :color="color" variant="tonal" size="44" rounded="lg" class="stat-card__icon">
        <v-icon :icon="icon" size="24" />
      </v-avatar>
      <div class="stat-card__text">
        <div class="stat-card__label">{{ label }}</div>
        <v-skeleton-loader v-if="loading" type="heading" class="stat-card__skeleton" />
        <div v-else class="stat-card__value">{{ displayValue }}</div>
      </div>
    </div>
    <v-progress-linear
      v-if="progress !== null && !loading"
      :model-value="progress"
      :color="color"
      height="4"
      class="stat-card__progress"
    />
  </v-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  value: { type: [Number, String], default: null },
  icon: { type: String, default: 'mdi-chart-box-outline' },
  color: { type: String, default: 'primary' },
  loading: { type: Boolean, default: false },
  // Optional 0-100 value shown as a bar at the bottom of the card
  progress: { type: Number, default: null }
})

const displayValue = computed(() =>
  props.value === null || props.value === undefined || props.value === '' ? '-' : props.value
)
</script>

<style scoped>
.stat-card {
  border-radius: 10px;
  overflow: hidden;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 31, 84, 0.1) !important;
}

.stat-card__body {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
}

.stat-card__icon {
  flex-shrink: 0;
}

.stat-card__text {
  min-width: 0;
  flex: 1;
}

.stat-card__label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  line-height: 1.3;
}

.stat-card__value {
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
  margin-top: 4px;
}

.stat-card__skeleton {
  background: transparent;
  margin-top: 4px;
}

.stat-card__skeleton :deep(.v-skeleton-loader__heading) {
  margin: 0;
  height: 28px;
  width: 60%;
}

@media (max-width: 600px) {
  .stat-card__body {
    flex-direction: column;
    text-align: center;
    gap: 8px;
    padding: 12px;
  }

  .stat-card__label {
    font-size: 10px;
  }

  .stat-card__value {
    font-size: 22px;
  }
}
</style>
