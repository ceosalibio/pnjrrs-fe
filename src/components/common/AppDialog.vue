<template>
  <v-dialog
    v-model="model"
    :max-width="maxWidth"
    persistent
  >
    <v-card>
      <v-card-title v-if="title" class="text-h6 font-weight-600">
        {{ title }}
      </v-card-title>
      
      <v-card-text class="py-4">
        <slot>{{ message }}</slot>
      </v-card-text>
      
      <v-card-actions class="justify-end ga-2">
        <app-button
          v-if="showCancel"
          :variant="'plain'"
          @click="handleCancel"
          :color="'default'"
        >
          {{ cancelText }}
        </app-button>
        <app-button
          :color="confirmColor"
          @click="handleConfirm"
          :variant="'plain'"
        >
          {{ confirmText }}
        </app-button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import AppButton from './AppButton.vue'

const model = defineModel();

const props = defineProps({
  title: String,
  message: String,
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  showCancel: {
    type: Boolean,
    default: true
  },
  confirmColor: {
    type: String,
    default: 'primary'
  },
  maxWidth: {
    type: String,
    default: '400px'
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const handleConfirm = () => {
  emit('confirm')
  // dialogOpen.value = false
}

const handleCancel = () => {
  emit('cancel')
  model.value = false
}
</script>
