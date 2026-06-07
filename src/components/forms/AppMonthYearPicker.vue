<template>
  <div class="month-year-picker">
    <v-text-field
      :model-value="displayValue"
      :label="label"
      :placeholder="placeholder"
      readonly
      :error="error"
      :error-messages="errorMessages"
      variant="outlined"
      density="compact"
      class="mb-0"
      @click="isOpen = true"
    >
      <template #append-inner>
        <v-icon @click.stop="isOpen = true">mdi-calendar</v-icon>
      </template>
    </v-text-field>

    <v-dialog v-model="isOpen" width="320">
      <v-card>
        <!-- Header -->
        <div class="picker-header">
          <span class="text-white text-body-1">{{ selectedLabel }}</span>
        </div>

        <v-card-text class="pa-4">
          <!-- Year Navigation -->
          <div class="d-flex align-center justify-space-between mb-4">
            <v-btn
              icon="mdi-chevron-left"
              variant="text"
              size="small"
              :disabled="!canGoPrev"
              @click="prevYear"
            />
            <span class="font-weight-bold text-h6">{{ displayYear }}</span>
            <v-btn
              icon="mdi-chevron-right"
              variant="text"
              size="small"
              :disabled="!canGoNext"
              @click="nextYear"
            />
          </div>

          <!-- Month Grid -->
          <div class="months-grid">
            <v-btn
              v-for="(month, index) in months"
              :key="index"
              :variant="isSelected(index) ? 'flat' : 'text'"
              :color="isSelected(index) ? 'primary' : undefined"
              :disabled="isFutureMonth(index)"
              size="small"
              class="month-btn"
              @click="selectMonth(index)"
            >
              {{ month }}
            </v-btn>
          </div>

          <!-- Actions -->
          <div class="d-flex justify-end gap-2 mt-4">
            <v-btn variant="text" color="primary" @click="isOpen = false">Cancel</v-btn>
            <v-btn variant="text" color="primary" @click="confirm">OK</v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: 'Month and Year' },
  placeholder: { type: String, default: 'MM/YYYY' },
  error: { type: Boolean, default: false },
  errorMessages: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:modelValue'])

const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

const today = new Date()
const currentMonth = today.getMonth()
const currentYear = today.getFullYear()

const isOpen = ref(false)

// Parse modelValue or default to current
const parseValue = () => {
  if (props.modelValue) {
    const [m, y] = props.modelValue.split('/')
    return { month: parseInt(m) - 1, year: parseInt(y) }
  }
  return { month: currentMonth, year: currentYear }
}

const tempMonth = ref(parseValue().month)
const tempYear = ref(parseValue().year)
const displayYear = ref(parseValue().year)

const selectedLabel = computed(() => {
  if (!props.modelValue) return 'Select month'
  const { month, year } = parseValue()
  return `${months[month]} ${year}`
})

const displayValue = computed(() => props.modelValue || '')

const isFutureMonth = (monthIndex) => {
  if (displayYear.value > currentYear) return true
  if (displayYear.value === currentYear && monthIndex > currentMonth) return true
  return false
}

const isSelected = (monthIndex) => {
  return tempMonth.value === monthIndex && tempYear.value === displayYear.value
}

const canGoPrev = computed(() => displayYear.value > 2000)
const canGoNext = computed(() => displayYear.value < currentYear)

const prevYear = () => displayYear.value--
const nextYear = () => displayYear.value++

const selectMonth = (monthIndex) => {
  if (isFutureMonth(monthIndex)) return
  tempMonth.value = monthIndex
  tempYear.value = displayYear.value
}

const confirm = () => {
  const month = String(tempMonth.value + 1).padStart(2, '0')
  emit('update:modelValue', `${month}/${tempYear.value}`)
  isOpen.value = false
}
</script>

<style scoped>
.month-year-picker {
  width: 100%;
}

.picker-header {
  background-color: #1976D2;
  padding: 16px 20px;
}

.months-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
}

.month-btn {
  font-size: 0.8rem;
  letter-spacing: 0.05em;
}
</style>