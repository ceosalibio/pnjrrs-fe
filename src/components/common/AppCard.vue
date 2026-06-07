<template>
  <v-card
    :elevation="elevation"
    :class="{ 'app-card': true, [cardClass]: cardClass }"
    class="transition-all"
  >
    <v-card-title v-if="title" class="text-h6 font-weight-600">
      {{ title }}
    </v-card-title>
    
    <v-card-subtitle v-if="subtitle" class="text-sm">
      {{ subtitle }}
    </v-card-subtitle>
    
    <v-card-text>
      <slot />
    </v-card-text>
    
    <v-card-actions v-if="$slots.actions">
      <slot name="actions" />
    </v-card-actions>
  </v-card>
</template>

<script setup>
defineProps({
  title: String,
  subtitle: String,
  elevation: {
    type: Number,
    default: 1
  },
  cardClass: String
})
</script>

<style scoped>
.app-card {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.app-card:hover {
  box-shadow: 0 8px 24px rgba(0, 31, 84, 0.1);
}
</style>
