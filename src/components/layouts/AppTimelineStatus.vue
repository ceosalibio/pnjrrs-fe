<template>
  <div class="timeline-wrapper">
    <v-timeline direction="horizontal" side="end">
  <v-timeline-item
    v-for="(item, index) in items"
    :key="index"
    :dot-color="index === activeIndex ? 'primary' : 'grey'"
    size="small"
  >
    <template #opposite></template>

    <div class="timeline-item-content">
      <p class="timeline-label">{{ item.label }}</p>
      <p v-if="item.sublabel" class="timeline-sublabel">
        {{ item.sublabel }}
      </p>
      <p v-if="item.timestamp" class="timeline-timestamp">
        {{ item.timestamp }}
      </p>
    </div>
  </v-timeline-item>
</v-timeline>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'TIMELINE STATUS'
  },
  items: {
    type: Array,
    required: true,
    validator: (value) => Array.isArray(value) && value.length > 0
  },
  activeIndex: {
    type: Number,
    default: 0
  }
})
</script>

<style scoped>
.timeline-wrapper {
  width: 100%;
  padding: 20px;
}

.timeline {
  width: 100%;
  display: flex;
  align-items: center;
}

.timeline-item-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 8px;
  min-width: 140px;
}

.timeline-label {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
  line-height: 1.2;
}

.timeline-sublabel {
  font-size: 11px;
  color: #666;
  margin: 0 0 2px 0;
  font-weight: 500;
}

.timeline-timestamp {
  font-size: 10px;
  color: #999;
  margin: 0;
}

@media (max-width: 640px) {
  .timeline-wrapper {
    padding: 16px;
  }

  .timeline-item-content {
    min-width: 120px;
    padding: 4px;
  }

  .timeline-label {
    font-size: 12px;
  }

  .timeline-sublabel {
    font-size: 10px;
  }

  .timeline-timestamp {
    font-size: 9px;
  }
}
</style>
