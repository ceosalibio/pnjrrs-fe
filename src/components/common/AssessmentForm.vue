<template>
  <div class="assessment-section">
    <h3 class="assessment-title">{{ title }}</h3>

    <div class="assessment-item">
      <div class="question-header">
        a. {{ questionA }}
      </div>
      <v-text-field
        v-model="localAssessments.a"
        variant="outlined"
        placeholder="Enter assessment..."
        class="mt-2"
        @update:model-value="emitUpdate"
      />
    </div>

    <div class="assessment-item">
      <div class="question-header">
        b. {{ questionB }}
      </div>
      <v-text-field
        v-model="localAssessments.b"
        variant="outlined"
        placeholder="Enter assessment..."
        class="mt-2"
        @update:model-value="emitUpdate"
      />
    </div>

    <div class="assessment-item">
      <div class="question-header">
        c. {{ questionC }}
      </div>
      <v-text-field
        v-model="localAssessments.c"
        variant="outlined"
        placeholder="Enter assessment..."
        class="mt-2"
        @update:model-value="emitUpdate"
      />
    </div>

    <div class="assessment-item">
      <div class="question-header">
        d. {{ questionD }}
      </div>
      <v-text-field
        v-model="localAssessments.d"
        variant="outlined"
        placeholder="Enter assessment..."
        class="mt-2"
        @update:model-value="emitUpdate"
      />
    </div>

    <div class="d-flex gap-2 justify-end mt-6">
      <v-btn variant="outlined" @click="handleClear">{{ clearButtonText }}</v-btn>
      <v-btn color="primary" @click="handleSave">{{ saveButtonText }}</v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  /**
   * Title for the assessment section
   */
  title: {
    type: String,
    default: 'Assessment:'
  },
  /**
   * Question text for item a
   */
  questionA: {
    type: String,
    default: 'What capability shortfall exists or what has occurred to cause the lower assessment, and which elements of operational preparedness are affected?'
  },
  /**
   * Question text for item b
   */
  questionB: {
    type: String,
    default: 'What are the consequences of the lower level of readiness?'
  },
  /**
   * Question text for item c
   */
  questionC: {
    type: String,
    default: 'What is required to remedy the situation?'
  },
  /**
   * Question text for item d
   */
  questionD: {
    type: String,
    default: 'What level is achievable within a prescribed period?'
  },
  /**
   * Initial assessment values
   */
  assessments: {
    type: Object,
    default: () => ({
      a: '',
      b: '',
      c: '',
      d: ''
    })
  },
  /**
   * Text for clear button
   */
  clearButtonText: {
    type: String,
    default: 'Clear'
  },
  /**
   * Text for save button
   */
  saveButtonText: {
    type: String,
    default: 'Save Report'
  }
})

const emit = defineEmits(['update:assessments', 'save', 'clear'])

const localAssessments = ref({
  a: props.assessments.a || '',
  b: props.assessments.b || '',
  c: props.assessments.c || '',
  d: props.assessments.d || ''
})

/**
 * Watch for prop changes and update local values
 */
watch(
  () => props.assessments,
  (newVal) => {
    localAssessments.value = {
      a: newVal.a || '',
      b: newVal.b || '',
      c: newVal.c || '',
      d: newVal.d || ''
    }
  },
  { deep: true }
)

/**
 * Emit update event when assessment values change
 */
const emitUpdate = () => {
  emit('update:assessments', localAssessments.value)
}

/**
 * Handle clear button click
 */
const handleClear = () => {
  localAssessments.value = {
    a: '',
    b: '',
    c: '',
    d: ''
  }
  emit('clear', localAssessments.value)
  emitUpdate()
}

/**
 * Handle save button click
 */
const handleSave = () => {
  emit('save', localAssessments.value)
}
</script>

<style scoped>
.assessment-section {
  margin-top: 2rem;
}

.assessment-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

.assessment-item {
  margin-bottom: 24px;
}

.question-header {
  background-color: #e8e8e8;
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 500;
  color: #333;
  border-radius: 4px 4px 0 0;
  line-height: 1.5;
}

.d-flex {
  display: flex;
}

.gap-2 {
  gap: 0.5rem;
}

.justify-end {
  justify-content: flex-end;
}

.mt-6 {
  margin-top: 1.5rem;
}

.mt-2 {
  margin-top: 0.5rem;
}
</style>
