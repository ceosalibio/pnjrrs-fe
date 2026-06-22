<template>
  <div>
    <v-autocomplete
      v-model="model"
      :label="label"
      :variant="variant"
      :density="density"
      :clearable="clearable"
      :items="items"
      :item-title="text"
      :item-value="itemValueKey"
      :readonly="readonly"
      :rules="rules"
      @update:model-value="handleChange"
      hide-details
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Props
const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  items: {
    type: Array,
    default: () => [],
  },
  text: {
    type: String,
    default: '',
  },
  value: {
    type: [String, Number],
    default: '',
  },
  type: {
    type: String,
    default: 'input',
  },
  variant: {
    type: String,
    default: 'outlined',
  },
  density: {
    type: String,
    default: 'compact',
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  rules: {
    type: Array,
    default: () => [],
  },
})

// Emits
const emit = defineEmits(['on-change'])

// Model
const model = defineModel()

// Computed item value key
const itemValueKey = computed(() => {
  return typeof props.value === 'number' ? String(props.value) : props.value
})

// Emit change
function handleChange(value) {
  emit('on-change', value)
}
</script>

<style scoped >
/* Add your styles here if needed */
</style>
