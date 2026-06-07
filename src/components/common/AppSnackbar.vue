<template>
  <v-snackbar
    v-model="snackbarVisible"
    :type="snackbarType"
    :timeout="timeout"
    position="bottom-right"
    variant="tonal"
  >
    {{ message }}
    
    <template #actions>
      <v-btn
        icon="mdi-close"
        size="small"
        @click="snackbarVisible = false"
      />
    </template>
  </v-snackbar>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  message: String,
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  timeout: {
    type: Number,
    default: 3000
  }
})

const emit = defineEmits(['update:modelValue'])

const snackbarVisible = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  snackbarVisible.value = val
})

watch(snackbarVisible, (val) => {
  emit('update:modelValue', val)
})

const snackbarType = ref(props.type)

watch(() => props.type, (val) => {
  snackbarType.value = val
})
</script>
