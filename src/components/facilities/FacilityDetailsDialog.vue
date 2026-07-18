<template>
  <!-- Detailed Edit Dialog -->
  <v-dialog
    v-model="isOpen"
    persistent
    width="90%"
    max-width="1500px"
  >
    <v-card>
      <!-- Dialog Header -->
      <v-card-title class="bg-primary text-white pa-4 d-flex align-center">
        <span>{{ title }}</span>
        <v-spacer />
        <v-btn
          icon
          size="small"
          color="white"
          @click="close"
        >
          <v-icon>mdi-close-circle-outline</v-icon>
        </v-btn>
      </v-card-title>

      <!-- Dialog Content -->
      <v-card-text class="pa-6">
        <v-form ref="formRef">
          <v-table
            class="data-table"
            fixed-header
            height="70vh"
          >
          <thead>
            <tr>
              <th class="text-left" style="width: 40%">Categories</th>
              <th class="text-center" style="width: 30%">Equivalent Adjectival Rating</th>
              <th class="text-center" style="width: 10%">Numerical Rating</th>
              <th class="text-center" style="width: 20%">Percentage</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="facilities?.categories && facilities.categories.length > 0" v-for="(category, catIdx) in facilities.categories" :key="catIdx">
              <!-- Category Header Row -->
              <tr class="item-title-row">
                <td
                  class="item-title"
                  colspan="5"
                >
                  {{ category.category_name }}
                </td>
              </tr>

              <!-- Item Rows -->
              <tr v-for="(item, itemIdx) in category.items" :key="`${catIdx}-${itemIdx}`" class="item-detail-row">
                <td class="item-detail text-left">{{ item.item_name }}({{ item.weight_percentage }})%</td>
                <td class="text-center">
                  <div class="mt-5">
                     <AppAutocomplete
                      v-model="item.adjectival_rating"
                      :items="item.options"
                      text="adjectival_rating"
                      value="adjectival_rating"
                      :readonly="isReadOnly"
                      :clearable="false"
                      density="compact"
                      variant="outlined"
                      :rules="getAdjectivalRatingRules(item)"
                      :hide-details="false"
                      @on-change="handleParameterChange(item)"
                    />
                  </div>
                 
                </td>
                <td class="text-center">
                  <!-- Show autocomplete if numerical_rating is array -->
                  <template v-if="isNumericalRatingArray(item)">
                    <div class="mt-5" :class="{ 'has-error': hasNumericalRatingError(item) }">
                      <AppAutocomplete
                        v-model="item.numerical_rating"
                        :items="getNumericalRatingItems(item)"
                        text="text"
                        value="value"
                        :readonly="isReadOnly"
                        :clearable="false"
                        density="compact"
                        variant="outlined"
                        :rules="getNumericalRatingRules(item)"
                        :hide-details="false"
                        @on-change="handleNumericChange(item)"
                      />
                    </div>
                  </template>
                  <!-- Show static text if numerical_rating is single value -->
                  <template v-else>
                    <div class="mt-5" :class="{ 'has-error': hasNumericalRatingError(item) }">
                      <AppTextfield 
                        v-model="item.numerical_rating"
                        :readonly="true"
                        :clearable="false"
                        :rules="getNumericalRatingRules(item)"
                        :hide-details="false"
                      />
                    </div>
                   
                  </template>
                </td>
   

                <td class="text-center">
                  {{ item.percentage }}%
                </td>
              </tr>
              
            </template>
            <tr>
                <td class="item-detail text-left font-weight-bold" colspan="2"></td>
                <td class="text-center font-weight-bold">
                  {{ facilities.total_numerical_rating }}
                </td>
                <td class="text-center font-weight-bold">
                  {{ facilities.total_percentage + '%' }}
                </td>
              </tr>
          </tbody>
          </v-table>
        </v-form>
      </v-card-text>

      <!-- Validation Error Message -->
      <!-- <v-alert
        v-if="validationErrors.length > 0"
        type="error"
        class="ma-4"
        closable
      >
        <div class="font-weight-bold mb-2">Validation Errors:</div>
        <ul class="mb-0">
          <li v-for="(error, idx) in validationErrors" :key="idx">
            {{ error }}
          </li>
        </ul>
      </v-alert> -->

      <!-- Dialog Actions -->
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          color="secondary"
          variant="text"
          @click="close"
        >
          Cancel
        </v-btn>
        <v-btn
          color="success"
          size="large"
          @click="save"
          :disabled="isReadOnly"
          class="px-6"
        >
          UPDATE
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import AppAutocomplete from '../forms/AppAutocomplete.vue'
import AppTextfield from '../forms/AppTextField.vue'

// Form ref
const formRef = ref(null)

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Update Details'
  },
  facilities: {
    type: Object,
    required: true
  },
  parameters: {
    type: Array,
    default: () => [
      { text: 'Poor', value: 'poor' },
      { text: 'Fair', value: 'fair' },
      { text: 'Good', value: 'good' },
      { text: 'Very Good', value: 'very_good' },
      { text: 'Excellent', value: 'excellent' }
    ]
  },
  isReadOnly: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'update:modelValue',
  'save',
  'parameter-change'
])

// Dialog state
const isOpen = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

// Parameter options
const parameterOptions = computed(() => {
  return Array.isArray(props.parameters) ? props.parameters : []
})

/**
 * Get validation rules for adjectival rating
 * @param {Object} item - Item object
 * @returns {Array} Array of validation rule functions
 */
const getAdjectivalRatingRules = (item) => {
  return [
    (value) => !!value || 'Adjectival Rating is required'
  ]
}

/**
 * Check if item has validation error
 * @param {Object} item - Item object
 * @returns {boolean}
 */
const hasNumericalRatingError = (item) => {
  // If adjectival_rating is selected but numerical_rating is not
  if (item.adjectival_rating && (item.numerical_rating === null || item.numerical_rating === undefined || item.numerical_rating === '')) {
    return true
  }
  return false
}

/**
 * Get validation rules for numerical rating
 * @param {Object} item - Item object
 * @returns {Array} Array of validation rule functions
 */
const getNumericalRatingRules = (item) => {
  return [
    (value) => {
      // Only validate if adjectival_rating is selected
      if (!item.adjectival_rating) return true
      // Check if value exists (can be 0, which is falsy)
      return (value !== null && value !== undefined && value !== '') || 'Numerical Rating is required'
    }
  ]
}

/**
 * Validate form - check if adjectival_rating is filled but numerical_rating is empty
 * @returns {Array} Array of validation error messages
 */
const validateForm = () => {
  const errors = []
  
  // Check if facilities exists and has categories
  if (!props.facilities || !props.facilities.categories || !Array.isArray(props.facilities.categories)) return errors
  
  // Check each category and item
  props.facilities.categories.forEach((category) => {
    if (!category.items || !Array.isArray(category.items)) return
    
    category.items.forEach((item) => {
      // If adjectival_rating is selected but numerical_rating is not
      if (item.adjectival_rating && (item.numerical_rating === null || item.numerical_rating === undefined || item.numerical_rating === '')) {
        errors.push(`${category.category_name} > ${item.item_name}: Please select a Numerical Rating`)
      }
    })
  })
  
  return errors
}

/**
 * Validation errors
 */
const validationErrors = computed(() => {
  return validateForm()
})

/**
 * Check if form is valid
 */
const isFormValid = computed(() => {
  return validationErrors.value.length === 0
})

/**
 * Calculate total numerical rating
 */
const calculateTotalNumericalRating = () => {
  let total = 0
  if (!props.facilities || !props.facilities.categories || !Array.isArray(props.facilities.categories)) return total
  
  props.facilities.categories.forEach((category) => {
    if (!category.items || !Array.isArray(category.items)) return
    category.items.forEach((item) => {
      if (item.numerical_rating && !isNaN(item.numerical_rating)) {
        total += parseFloat(item.numerical_rating)
      }
    })
  })
  
  return parseFloat(total.toFixed(2))
}

/**
 * Calculate total percentage
 */
const calculateTotalPercentage = () => {
  let total = 0
  if (!props.facilities || !props.facilities.categories || !Array.isArray(props.facilities.categories)) return total
  
  props.facilities.categories.forEach((category) => {
    if (!category.items || !Array.isArray(category.items)) return
    category.items.forEach((item) => {
      if (item.percentage && !isNaN(item.percentage)) {
        total += parseFloat(item.percentage)
      }
    })
  })
  
  return parseFloat(total.toFixed(2))
}

/**
 * Update totals in facilities object
 */
const updateTotals = () => {
  if (props.facilities) {
    props.facilities.total_numerical_rating = calculateTotalNumericalRating()
    props.facilities.total_percentage = calculateTotalPercentage()
  }
}

/**
 * Watch for dialog open to update totals
 */
watch(() => isOpen.value, (newVal) => {
  if (newVal) {
    updateTotals()
  }
}, { immediate: true })

/**
 * Close dialog
 */
const close = () => {
  isOpen.value = false
}

/**
 * Get selected option from item.options by adjectival_rating
 * @param {Object} item - Item object
 * @returns {Object|null} Selected option object
 */
const getSelectedOption = (item) => {
  if (!item.options || !item.adjectival_rating) return null
  return item.options.find(opt => opt.adjectival_rating === item.adjectival_rating)
}

/**
 * Check if numerical_rating is an array
 * @param {Object} item - Item object
 * @returns {boolean}
 */
const isNumericalRatingArray = (item) => {
  const selectedOption = getSelectedOption(item)
  return selectedOption && Array.isArray(selectedOption.numerical_rating)
}

/**
 * Get numerical rating items for autocomplete
 * @param {Object} item - Item object
 * @returns {Array} Array of items with text and value properties
 */
const getNumericalRatingItems = (item) => {
  const selectedOption = getSelectedOption(item)
  if (selectedOption && Array.isArray(selectedOption.numerical_rating)) {
    return selectedOption.numerical_rating.map(num => ({
      text: num.toString(),
      value: num
    }))
  }
  return []
}

/**
 * Handle parameter change
 * @param {Object} item - Item with parameter change
 */
const handleParameterChange = (item) => {
  const selectedOption = getSelectedOption(item)
  if (selectedOption) {
    // Set numerical_rating based on the selected option
    if (!Array.isArray(selectedOption.numerical_rating)) {
      // If it's a single value, auto-set it
      item.numerical_rating = selectedOption.numerical_rating
      item.percentage = selectedOption.numerical_rating
    } else {
      // If it's an array, clear the current value so user can select
      item.numerical_rating = null
      item.percentage = 0
    }
  }
  
  console.log('Parameter changed for:', item)
  console.log('facilities :', props.facilities)
  
  // Update totals
  updateTotals()
  
  // Emit parameter change event
  emit('parameter-change', item)
}

const handleNumericChange = (item) => {
  console.log('Numerical rating changed for:', item)
  // Set percentage based on numerical_rating
  item.percentage = item.numerical_rating
  
  // Update totals
  updateTotals()
  
  // Emit parameter change event
  emit('parameter-change', item)
}

/**
 * Save and close dialog
 */
const save = async () => {
  // Validate form using Vuetify form validation
  if (formRef.value) {
    const isValid = await formRef.value.validate()
    if (!isValid.valid) {
      console.warn('Form validation failed')
      return
    }
  }
  
  // Also validate using our custom validation
  if (!isFormValid.value) {
    console.warn('Custom validation failed:', validationErrors.value)
    return
  }
  
  emit('save', props.facilities)
  isOpen.value = false
}
</script>

<style scoped>
.data-table {
  border-collapse: collapse;
}

.data-table th {
  background-color: #f5f5f5;
  font-weight: 600;
  border-bottom: 2px solid #e0e0e0;
  padding: 12px 8px;
}

.data-table td {
  border-bottom: 1px solid #e0e0e0;
  padding: 12px 8px;
}

/* Title Row Styling */
.item-title-row {
  background-color: #e3f2fd;
}

.item-title {
  font-weight: 600;
  background-color: #2196F3;
  color: white;
  padding: 12px 16px !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Detail Row Styling */
.item-detail-row {
  background-color: #fafafa;
}

.item-detail-row:hover {
  background-color: #f5f5f5;
}

.item-detail {
  font-weight: 500;
  padding: 12px 16px !important;
}

/* Numeric Display */
.numeric-display {
  font-weight: 600;
  color: #1976d2;
  padding: 8px 12px;
  display: inline-block;
  background-color: #f0f7ff;
  border-radius: 4px;
}

/* Error state */
.has-error :deep(.v-field) {
  border-color: #d32f2f !important;
  background-color: #ffebee;
}

.has-error :deep(.v-field__outline) {
  color: #d32f2f;
}

/* Text alignment */
.text-left {
  text-align: left;
}

.text-center {
  text-align: center;
}

/* Responsive */
@media (max-width: 960px) {
  .data-table th,
  .data-table td {
    padding: 8px 4px;
    font-size: 0.85rem;
  }

  .item-title {
    padding: 8px 12px !important;
  }

  .item-detail {
    padding: 8px 12px !important;
  }
}

@media (max-width: 600px) {
  .data-table {
    font-size: 0.75rem;
  }

  .data-table th,
  .data-table td {
    padding: 6px 2px;
  }
}
</style>
