<template>
  <div class="timeline-container">
    <div class="timeline-header">
      <div class="timeline-title-bar">
        <h3 class="timeline-title">{{ title }}</h3>
        <button class="timeline-toggle" @click="isExpanded = !isExpanded" :title="isExpanded ? 'Collapse' : 'Expand'">
          <v-icon size="18">{{ isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </button>
      </div>
    </div>
    
    <div v-if="isExpanded" class="timeline-content">
      <v-timeline direction="horizontal" side="end">
        <v-timeline-item
          v-for="(item, index) in items"
          :key="index"
          :dot-color="item.isDone ? 'success' : (index === activeIndex ? 'primary' : 'rgba(0, 0, 0, 0.12)')"
          size="large"
          class="timeline-item-wrapper"
          :class="{ 'timeline-item-active': index === activeIndex }"
        >
          <template #opposite></template>

          <div class="timeline-item-content">
            <div class="timeline-item-box" :class="{ 'timeline-item-box-active': index === activeIndex }">
              <div class="timeline-item-inner">
                <p class="timeline-label">{{ item.label }}</p>
                <p v-if="item.sublabel" class="timeline-sublabel">
                  {{ item.sublabel }}
                </p>
                <p v-if="item.timestamp" class="timeline-timestamp">
                  <v-icon size="12" class="timestamp-icon">mdi-clock-outline</v-icon>
                  {{ item.timestamp }}
                </p>
              </div>
            </div>
          </div>
        </v-timeline-item>
      </v-timeline>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isExpanded = ref(false)

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
.timeline-container {
  width: 100%;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.timeline-header {
  margin-bottom: 12px;
}

.timeline-title-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.timeline-title {
  font-size: 12px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.timeline-title::before {
  content: '';
  width: 3px;
  height: 14px;
  background: linear-gradient(180deg, #1976d2 0%, #1565c0 100%);
  border-radius: 2px;
}

.timeline-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px solid rgba(25, 118, 210, 0.2);
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #1976d2;
  padding: 0;
  font-size: 0;
}

.timeline-toggle:hover {
  background: #f3f7ff;
  border-color: #1976d2;
  box-shadow: 0 2px 6px rgba(25, 118, 210, 0.15);
}

.timeline-toggle:active {
  transform: scale(0.95);
}

.timeline-content {
  width: 100%;
  overflow-x: auto;
  padding-bottom: 8px;
}

.timeline-content::-webkit-scrollbar {
  height: 6px;
}

.timeline-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.timeline-content::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.timeline-content::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

.timeline-item-wrapper {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.timeline-item-wrapper:hover {
  transform: translateY(-4px);
}

.timeline-item-active {
  z-index: 10;
}

.timeline-item-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 4px 8px;
  min-width: 160px;
}

.timeline-item-box {
  background: white;
  border: 2px solid rgba(25, 118, 210, 0.1);
  border-radius: 10px;
  padding: 14px 12px;
  width: 100%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.timeline-item-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #1976d2 0%, #1565c0 100%);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.timeline-item-box:hover {
  border-color: rgba(25, 118, 210, 0.3);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.15);
}

.timeline-item-box:hover::before {
  transform: scaleX(1);
}

.timeline-item-box-active {
  border-color: #1976d2;
  background: linear-gradient(135deg, #f3f7ff 0%, #e3f2fd 100%);
  box-shadow: 0 6px 16px rgba(25, 118, 210, 0.25);
}

.timeline-item-box-active::before {
  transform: scaleX(1);
}

.timeline-item-inner {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.timeline-label {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  line-height: 1.3;
  word-break: break-word;
}

.timeline-sublabel {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
  font-weight: 500;
  line-height: 1.2;
}

.timeline-timestamp {
  font-size:13px;
  color: #9ca3af;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  line-height: 1.2;
}

.timestamp-icon {
  color: #1976d2 !important;
  flex-shrink: 0;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .timeline-container {
    padding: 16px;
  }

  .timeline-header {
    margin-bottom: 16px;
  }

  .timeline-title {
    font-size: 14px;
  }

  .timeline-item-content {
    min-width: 140px;
    padding: 2px 6px;
  }

  .timeline-item-box {
    padding: 12px 10px;
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

@media (max-width: 480px) {
  .timeline-container {
    padding: 12px;
  }

  .timeline-title {
    font-size: 12px;
  }

  .timeline-item-content {
    min-width: 120px;
    padding: 2px 4px;
  }

  .timeline-item-box {
    padding: 10px 8px;
  }

  .timeline-label {
    font-size: 11px;
  }

  .timeline-sublabel {
    font-size: 9px;
  }

  .timeline-timestamp {
    font-size: 8px;
  }

  .timeline-title::before {
    width: 3px;
    height: 16px;
  }
}
</style>
