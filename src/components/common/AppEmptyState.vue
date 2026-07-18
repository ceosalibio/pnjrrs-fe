<template>
  <div class="empty-state-container">
    <div class="empty-state-content">
      <div class="icon-wrapper">
        <v-icon size="80" :color="iconColor">{{ icon }}</v-icon>
      </div>
      
      <h2 class="empty-title">{{ title }}</h2>
      <p class="empty-message">{{ message }}</p>
      
      <div v-if="actionText" class="action-button">
        <v-btn
          variant="tonal"
          :color="actionColor"
          @click="$emit('action')"
        >
          {{ actionText }}
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'No Data'
  },
  message: {
    type: String,
    default: 'Please generate first to view this page'
  },
  icon: {
    type: String,
    default: 'mdi-inbox-outline'
  },
  iconColor: {
    type: String,
    default: '#90a4ae'
  },
  actionText: {
    type: String,
    default: ''
  },
  actionColor: {
    type: String,
    default: 'primary'
  }
})

defineEmits(['action'])
</script>

<style scoped>
.empty-state-container {
  min-height: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #f8fafb 100%);
  border-radius: 8px;
  border: 1px solid #e8ecef;
}

.empty-state-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  text-align: center;
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  margin: 0 auto 32px;
  background: rgba(25, 118, 210, 0.08);
  border-radius: 50%;
  animation: fadeInScale 0.5s ease-out;
}

.empty-title {
  font-size: 24px;
  font-weight: 600;
  color: #263238;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
}

.empty-message {
  font-size: 14px;
  color: #78909c;
  margin-bottom: 28px;
  max-width: 400px;
  line-height: 1.6;
  letter-spacing: 0.3px;
}

.action-button {
  margin-top: 8px;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Responsive */
@media (max-width: 600px) {
  .empty-state-content {
    padding: 40px 24px;
  }

  .icon-wrapper {
    width: 100px;
    height: 100px;
    margin-bottom: 24px;
  }

  .empty-title {
    font-size: 20px;
  }

  .empty-message {
    font-size: 13px;
  }
}
</style>
