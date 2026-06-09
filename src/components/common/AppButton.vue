<template>
  <div>
    <v-btn
      :color="color"
      :density="density"
      :icon="icon"
      :block="block"
      :disabled="disabled"
      :type="type"
      :loading="loading"
      :variant="variant"
      :size="size"
      @click="handleClick"
    >
      <slot></slot>
    </v-btn>
  </div>
</template>

<script setup>
const emit = defineEmits(['on-click'])

const props = defineProps({
  text: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: 'primary',
  },
  density: {
    type: String,
    default: 'default',
  },
  variant: {
    type: String,
    default: 'elevated',
  },
  icon: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'button',
  },
  block: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  size : {
    type : String,
    default: 'default'
  }
})

function handleClick() {
  emit('on-click')
}
</script>

<style scoped>
/* Add custom styles here if needed */
</style>
