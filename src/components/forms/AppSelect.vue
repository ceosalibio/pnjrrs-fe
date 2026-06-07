<template>
  <v-select
    :model-value="modelValue"
    :items="items"
    :item-title="itemTitle"
    :item-value="itemValue"
    :variant="variant"
    :label="label"
    :error="!!error"
    :error-messages="error ? [error] : []"
    :disabled="disabled"
    :clearable="clearable"
    :multiple="multiple"
    class="app-select"
    v-bind="$attrs"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>

<script setup>
defineProps({
  modelValue: [String, Number, Array],
  items: {
    type: Array,
    default: () => []
  },
  itemTitle: {
    type: String,
    default: 'title'
  },
  itemValue: {
    type: String,
    default: 'value'
  },
  label: String,
  variant: {
    type: String,
    default: 'outlined'
  },
  error: String,
  disabled: Boolean,
  clearable: Boolean,
  multiple: Boolean
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.app-select {
  transition: all 0.3s ease;
}
</style>
