<template>
  <v-text-field
    :model-value="modelValue"
    :label="label"
    :error="!!error"
    :error-messages="error ? [error] : []"
    :disabled="disabled"
    :variant="variant"
    type="date"
    class="app-date-picker"
    v-bind="$attrs"
    @update:model-value="$emit('update:modelValue', $event)"
    :hide-details="hideDetails"
  />
</template>

<script setup>
defineProps({
  modelValue: String,
  label: String,
  variant: {
    type: String,
    default: 'outlined'
  },
  error: String,
  disabled: Boolean,
  hideDetails: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.app-date-picker {
  transition: all 0.3s ease;
}
</style>
