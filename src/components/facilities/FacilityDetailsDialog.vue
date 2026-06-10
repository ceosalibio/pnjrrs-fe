<template>
  <!-- Detailed Edit Dialog -->
  <v-dialog
    v-model="isOpen"
    persistent
    width="70%"
    max-width="900px"
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
        <v-table
          class="elevation-1 custom-table"
          fixed-header
          height="70vh"
        >
          <thead>
            <tr>
              <th class="text-left" style="width: 40%">Facility</th>
              <th class="text-center" style="width: 10%">Percentage</th>
              <th class="text-left" style="width: 30%">Parameter</th>
              <th class="text-center" style="width: 20%">Rating</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, i) in facilities" :key="i">
              <!-- Header Row (Group) -->
              <tr v-if="!item.percent" class="item-title-row">
                <td
                  class="item-title"
                  :colspan="!item.code ? 4 : 3"
                >
                  {{ item.detail }}
                </td>
              </tr>

              <!-- Detail Row -->
              <tr v-else class="item-detail-row">
                <td class="item-detail text-left">{{ item.detail }}</td>
                <td class="text-center">
                  {{ item.percent ? item.percent + '%' : '' }}
                </td>
                <td class="text-left">
                  <v-autocomplete
                    v-model="item.parameter"
                    :items="parameterOptions"
                    item-title="text"
                    item-value="value"
                    :readonly="isReadOnly"
                    :clearable="!isReadOnly"
                    density="compact"
                    variant="outlined"
                    class="custom-autocomplete"
                    @update:model-value="handleParameterChange(item)"
                  />
                </td>
                <td class="text-center">
                  {{ item.rating ? item.rating + '%' : '' }}
                </td>
              </tr>
            </template>
          </tbody>
        </v-table>
      </v-card-text>

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
import { computed } from 'vue'

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
    type: Array,
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
const parameterOptions = computed(() => props.parameters)

/**
 * Close dialog
 */
const close = () => {
  isOpen.value = false
}

/**
 * Handle parameter change
 * @param {Object} item - Item with parameter change
 */
const handleParameterChange = (item) => {
  // Map parameter to rating
  const ratingMap = {
    poor: 20,
    fair: 40,
    good: 60,
    very_good: 80,
    excellent: 95
  }
  if (item.parameter) {
    item.rating = ratingMap[item.parameter] || null
  }
  
  // Emit parameter change event
  emit('parameter-change', item)
}

/**
 * Save and close dialog
 */
const save = () => {
  emit('save', props.facilities)
  isOpen.value = false
}
</script>

<style scoped>
.custom-table {
  border-collapse: collapse;
}

.custom-table th {
  background-color: #f5f5f5;
  font-weight: 600;
  border-bottom: 2px solid #e0e0e0;
  padding: 12px 8px;
}

.custom-table td {
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

/* Text alignment */
.text-left {
  text-align: left;
}

.text-center {
  text-align: center;
}

/* Responsive */
@media (max-width: 960px) {
  .custom-table th,
  .custom-table td {
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
  .custom-table {
    font-size: 0.75rem;
  }

  .custom-table th,
  .custom-table td {
    padding: 6px 2px;
  }
}
</style>
