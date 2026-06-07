<template>
  <v-btn
    :color="color"
    :variant="variant"
    :size="size"
    :disabled="disabled || loading"
    :loading="loading"
    :block="fullWidth"
    v-bind="$attrs"
  >
    <template v-if="icon" #prepend>
      <v-icon>{{ icon }}</v-icon>
    </template>
    <slot>{{ label }}</slot>
  </v-btn>
</template>

<script setup>
defineProps({
  label: String,
  color: {
    type: String,
    default: 'primary'
  },
  variant: {
    type: String,
    default: 'contained',
    validator: (value) => ['contained', 'outlined', 'text', 'elevated', 'tonal', 'plain'].includes(value)
  },
  size: {
    type: String,
    default: 'lg',
    validator: (value) => ['x-small', 'small', 'md', 'lg', 'x-large'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  icon: String
})
</script>
