<template>
  <v-form ref="formRef" @submit.prevent="onSubmit">
    <v-container class="px-0">
      <v-card elevation="0" class="bg-light-gray mb-4 pa-4">
        <div class="d-flex align-center justify-between mb-4">
          <v-chip
            v-for="(answer, index) in displayCaptcha"
            :key="index"
            size="large"
            class="font-weight-600"
          >
            {{ answer }}
          </v-chip>
          <v-icon size="24" class="cursor-pointer text-white" @click="generateCaptcha">mdi-reload</v-icon>
        </div>

        <p class="text-sm text-gray-600 mb-3">Solve this simple math problem:</p>
        <p class="text-lg font-weight-600 text-center text-white">
          {{ captchaQuestion }}
        </p>
      </v-card>

      <app-text-field
        v-model="formData.answer"
        label="Your Answer"
        type="number"
        placeholder="Enter the answer"
        :rules="answerRules"
        class="mb-4"
      />

      <v-checkbox
        v-model="formData.iamHuman"
        label="I am not a robot"
        class="mb-4"
        @change="robotCheckError = ''"
      />
      <div v-if="robotCheckError" class="text-error text-sm mb-2">
        {{ robotCheckError }}
      </div>
      <div class="d-flex justify-center">
        <app-button
          color="primary"
          full-width
          :loading="isLoading"
          type="submit"
        >
          Verify
        </app-button>
      </div>
      

      <v-divider class="my-4" />
      <div class="d-flex justify-center">
        <app-button
          color="white"
          variant="plain"
          full-width
          @click="$emit('back')"
        >
          Back to login
        </app-button>
      </div>
      
    </v-container>
  </v-form>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import AppTextField from './AppTextField.vue'
import AppButton from '../common/AppButton.vue'
import { required, numeric } from '@/utils/rules'

const props = defineProps({
  loading: Boolean
})
const emit = defineEmits(['submit', 'back'])

const formData = reactive({
  answer: '',
  iamHuman: false
})

const isLoading = computed(() => props.loading)
const formRef = ref(null)

const answerRules = [
  required(),
  numeric('Please enter a valid number')
]

const robotCheckError = ref('')

const problemNum1 = ref(0)
const problemNum2 = ref(0)
const correctAnswer = ref(0)

const generateCaptcha = () => {
  problemNum1.value = Math.floor(Math.random() * 20) + 1
  problemNum2.value = Math.floor(Math.random() * 20) + 1
  correctAnswer.value = problemNum1.value + problemNum2.value
  formData.answer = ''
}

const captchaQuestion = computed(() => {
  return `${problemNum1.value} + ${problemNum2.value} = ?`
})

const displayCaptcha = computed(() => {
  const answers = [
    correctAnswer.value,
    correctAnswer.value + 1,
    correctAnswer.value - 1,
    correctAnswer.value + 2
  ]
  return answers.sort(() => Math.random() - 0.5)
})

const onSubmit = async () => {
  if (!formData.iamHuman) {
    robotCheckError.value = 'Please confirm that you are not a robot.'
    return
  }
  robotCheckError.value = ''

  if (formRef.value) {
    const { valid } = await formRef.value.validate()
    if (!valid) return
  }

  if (parseInt(formData.answer) === correctAnswer.value) {
    emit('submit', {
      answer: formData.answer,
      iamHuman: formData.iamHuman
    })
  } else {
    // Reset for retry
    formData.answer = ''
    generateCaptcha()
  }
}

onMounted(() => {
  generateCaptcha()
})
</script>

<style scoped>
.bg-light-gray {
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.text-gray-600 {
  color: rgba(255, 255, 255, 0.8);
}

.text-center {
  text-align: center;
}

:deep(.v-label) {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9) !important;
}

:deep(.v-checkbox .v-label) {
  color: rgba(255, 255, 255, 0.9) !important;
}

:deep(.v-field__input) {
  background-color: rgba(0, 0, 0, 0.3) !important;
  color: #fff !important;
}
</style>
