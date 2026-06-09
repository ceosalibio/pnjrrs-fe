<template>
  <v-form ref="formRef" @submit.prevent="onSubmit">
    <v-container>
      <app-text-field
        v-model="formData.email"
        :label="'Email Address'"
        type="email"
        placeholder="Enter your email (e.g., admin@pnay.gov.ph)"
        :rules="emailRules"
        clearable
      />

      <app-text-field
        v-model="formData.password"
        :label="'Password'"
        type="password"
        placeholder="Enter your password"
        :rules="passwordRules"
        show-password-toggle
        class="mb-4"
      />

      <div class="d-flex justify-center mb-4">
        <app-button
            color="white"
            full-width
            :loading="isLoading"
            type="submit"
            size="x-large"
            variant="plain"
        >
          log in
        </app-button> 
        
      </div>

      <!-- <p class="text-center text-xs text-gray-300">
        <a href="#" class="text-blue-300 hover:text-blue-200">Forgot Password?</a>
      </p> -->

      <v-divider class="my-4" />

      <p class="text-center text-xs text-gray-400">
        Contact AC of NS for Operations, N3 for Assistance
      </p>
    </v-container>
  </v-form>
</template>

<script setup>
import { ref, reactive } from 'vue'
import AppTextField from './AppTextField.vue'
import AppButton from '../common/AppButton.vue'
import { required, email, minLength, compose } from '@/utils/rules'

const props = defineProps({
  loading: Boolean
})

const emit = defineEmits(['submit'])

const formData = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const isLoading = ref(props.loading)

// Define validation rules for form fields
const emailRules = [
  required(),
  email()
]

const passwordRules = [
  required(),
  minLength(8, 'Password must be at least 8 characters')
]

const onSubmit = async () => {
  if (formRef.value) {
    const { valid } = await formRef.value.validate()
    if (valid) {
      emit('submit', {
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe
      })
    }
  }
}

const formRef = ref(null)
</script>

<style scoped>
.text-sm {
  font-size: 0.875rem;
}

.text-xs {
  font-size: 0.75rem;
}

.text-gray-300 {
  color: rgba(255, 255, 255, 0.7);
}

.text-gray-400 {
  color: rgba(255, 255, 255, 0.6);
}

.text-blue-300 {
  color: #93c5fd;
  text-decoration: none;
}

.text-blue-300:hover,
.hover\:text-blue-200:hover {
  color: #bfdbfe;
}

.text-center {
  text-align: center;
}

:deep(.v-input__control) {
  padding: 8px 0;
}

:deep(.v-field__input) {
  font-size: 0.95rem;

  color: #fff !important;
  border-radius: 8px;
}

:deep(.v-field__input::placeholder) {
  color: rgba(255, 255, 255, 0.5) !important;
}

:deep(.v-label) {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9) !important;
}

:deep(.v-divider) {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

:deep(.v-field) {
  border-radius: 8px;
}
</style>
