<template>
    <v-autocomplete
        v-model="selected"
        :items="options"
        :label="label"
        :variant="variant"
        :density="density"
        :loading="isLoading"
        :error-messages="error"
        @change="$emit('update:modelValue', selected)"
    />
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    modelValue: [String, Number],
    options: {
        type: Array,
        default: () => []
    },
    label: String,
    isLoading: Boolean,
    error: String,
    variant: {
        type: String,
        default: 'outlined'
    },
    density: {
        type: String,
        default: 'compact'
    }
})

const emit = defineEmits(['update:modelValue'])

const selected = ref(props.modelValue)

watch(selected, (newValue) => {
  emit('update:modelValue', newValue)
})
</script>
