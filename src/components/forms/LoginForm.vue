<template>
  <v-form ref="form" @submit.prevent="onSubmit">
    <v-container>
      <app-text-field
        v-model="formData.email"
        :label="'Email Address'"
        type="email"
        placeholder="Enter your email (e.g., admin@pnay.gov.ph)"
        :error="errors.email"
        clearable
        @blur="validateField('email')"
        @input="clearError('email')"
      />

      <app-text-field
        v-model="formData.password"
        :label="'Password'"
        type="password"
        placeholder="Enter your password"
        :error="errors.password"
        show-password-toggle
        class="mb-4"
        @blur="validateField('password')"
        @input="clearError('password')"
      />

      <div class="d-flex justify-center mb-4">
        <app-button
            label="Log in"
            color="white"
            full-width
            :loading="isLoading"
            type="submit"
            size="x-large"
        />
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
import { validateEmail, validatePassword } from '@/utils/validators'

const props = defineProps({
  loading: Boolean
})

const emit = defineEmits(['submit'])

const formData = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const errors = reactive({
  email: '',
  password: ''
})

const isLoading = ref(props.loading)

const clearError = (field) => {
  errors[field] = ''
}

const validateField = (field) => {
  switch (field) {
    case 'email':
      if (!formData.email.trim()) {
        errors.email = 'Email is required.'
      } else {
        const emailError = validateEmail(formData.email)
        errors.email = emailError === true ? '' : emailError
      }
      break
    case 'password':
      if (!formData.password) {
        errors.password = 'Password is required.'
      } else {
        const passwordError = validatePassword(formData.password)
        errors.password = passwordError === true ? '' : passwordError
      }
      break
  }
}

const onSubmit = () => {
  validateField('email')
  validateField('password')

  if (!errors.email && !errors.password) {
    emit('submit', {
      email: formData.email,
      password: formData.password,
      rememberMe: formData.rememberMe
    })
  }
}
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
