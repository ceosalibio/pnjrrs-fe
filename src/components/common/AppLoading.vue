<template>
  <v-overlay
    v-if="isLoading"
    :model-value="isLoading"
    class="align-center justify-center"
    persistent
  >
    <v-progress-circular
      :color="color"
      indeterminate
      :size="size"
    />
    <div v-if="message" class="mt-4 text-white text-center">
      {{ message }}
    </div>
  </v-overlay>
</template>

<script setup>
defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  message: String,
  color: {
    type: String,
    default: 'primary'
  },
  size: {
    type: Number,
    default: 60
  }
})
</script>
