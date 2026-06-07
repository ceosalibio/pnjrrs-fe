<template>
  <v-text-field
    :model-value="modelValue"
    :variant="variant"
    :type="showPassword ? 'text' : type"
    :placeholder="placeholder"
    :label="label"
    :error="!!error"
    :error-messages="error ? [error] : []"
    :disabled="disabled"
    :clearable="clearable"
    :counter="counter"
    :maxlength="maxlength"
    :density="density"
    v-bind="$attrs"
    @update:model-value="$emit('update:modelValue', $event)"
    @blur="$emit('blur')"
    @focus="$emit('focus')"
  >
    <template v-if="$slots.prepend" #prepend>
      <slot name="prepend" />
    </template>
    
    <template v-if="showPasswordToggle && type === 'password'" #append-inner>
      <v-icon
        :icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        tabindex="0"
        role="button"
        size="small"
        @click="togglePassword"
        @keydown.enter="togglePassword"
      />
    </template>
  </v-text-field>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  modelValue: String,
  label: String,
  placeholder: String,
  type: {
    type: String,
    default: 'text'
  },
  variant: {
    type: String,
    default: 'outlined'
  },
  error: String,
  disabled: Boolean,
  clearable: Boolean,
  counter: Boolean,
  maxlength: Number,
  showPasswordToggle: {
    type: Boolean,
    default: false
  },
  density: {
    type: String,
    default: 'compact',
    validator: (value) => ['default', 'comfortable', 'compact'].includes(value)
  }
})

defineEmits(['update:modelValue', 'blur', 'focus'])

const showPassword = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>

<style scoped>

</style>
