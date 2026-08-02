<template>
  <v-row class="mb-6">
    <v-col
      v-for="stat in stats"
      :key="stat.label"
      cols="12"
      sm="6"
    >
      <app-card elevation="1" class="h-100">
        <div class="d-flex flex-column align-center justify-center pa-4">
          <p class="text-sm text-gray-600 mb-3 text-uppercase font-weight-600">{{ stat.label }}</p>
          <p class="text-h3 font-weight-700">{{ stat.value }}</p>
        </div>
      </app-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { defineProps } from 'vue'
import AppCard from '@/components/common/AppCard.vue'

defineProps({
  stats: {
    type: Array,
    required: true,
    validator: (arr) => arr.length === 4
  }
})
</script>

<style scoped>
.text-gray-600 {
  color: #666 !important;
}
</style>
