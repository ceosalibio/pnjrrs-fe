<template>
  <div>
    <v-text-field
      v-model="model"
      :label="props.label"
      :placeholder="placeholder"
      :type="props.type"
      :variant="props.variant"
      :density="props.density"
      :clearable="props.clearable"
      :rules="props.rules"
      :block="props.block"
      :maxlength="props.maxlength"
      :readonly="props.readonly"
      @input="handleInput"
      @change="handleChange"
    >
      <slot></slot>
    </v-text-field>
  </div>
</template>

<script setup>
import { maxLength } from '@/utils/rules';
import { readonly } from 'vue';

const model = defineModel();

const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "input",
  },
  variant: {
    type: String,
    default: "outlined",
  },
  density: {
    type: String,
    default: "compact",
  },
  maxlength:{
    type: Number,
    default: 255,
  },
  clearable: {
    type: Boolean,
    default: true,
  },
  block: {
    type: Boolean,
    default: false,
  },
  rules: {
    type: Array,
    default: () => [],
  },
  readonly: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['on-input', 'on-change'])

function handleInput(value) {
  emit('on-input', value)
}

function handleChange(event) {
  emit('on-change', event.target.value)
}
</script>

<style  scoped></style>
