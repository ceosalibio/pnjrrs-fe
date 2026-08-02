<template>
  <v-row class="mb-6">
    <v-col
      v-for="stat in stats"
      :key="stat.label"
      cols="12"
      sm="6"
      lg="2"
    >
      <app-card elevation="1" class="h-100">
        <v-row no-gutters class="align-center">
          <v-col cols="8">
            <p class="text-sm text-gray-600 mb-2">{{ stat.label }}</p>
            <p class="text-h5 font-weight-600">{{ stat.value.toLocaleString() }}</p>
            <p class="text-xs text-gray-500 mt-1">
              {{ stat.percentage }}
              <v-icon
                :color="stat.trend > 0 ? 'success' : stat.trend < 0 ? 'error' : 'gray'"
                size="12"
                class="ms-1"
              >
                {{ stat.trend > 0 ? 'mdi-trending-up' : stat.trend < 0 ? 'mdi-trending-down' : 'mdi-minus' }}
              </v-icon>
            </p>
          </v-col>
          <v-col cols="4" class="d-flex justify-end">
            <v-avatar
              :color="`${stat.color}20`"
              size="48"
            >
              <v-icon :color="stat.color" size="24">{{ stat.icon }}</v-icon>
            </v-avatar>
          </v-col>
        </v-row>
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
    required: true
  }
})
</script>

<style scoped>
.text-gray-500 {
  color: #999 !important;
}

.text-gray-600 {
  color: #666 !important;
}
</style>
