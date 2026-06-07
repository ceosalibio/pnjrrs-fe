<template>
  <v-footer
    class="app-footer bg-primary px-4 py-1 text-white"
  >
    <v-container class="d-flex align-center justify-space-between flex-wrap gap-2 pa-0 h-100">
      <div class="text-sm">
        <p class="ma-0">&copy; 2024 Philippine Navy Management System. All rights reserved.</p>
      </div>

      <div class="d-flex gap-4">
        <v-btn
          variant="text"
          color="white"
          size="small"
          href="#"
        >
          Privacy Policy
        </v-btn>
        <v-btn
          variant="text"
          color="white"
          size="small"
          href="#"
        >
          Terms of Service
        </v-btn>
        <v-btn
          variant="text"
          color="white"
          size="small"
          href="#"
        >
          Contact Us
        </v-btn>
      </div>

      <div class="text-sm">
        System Version 1.0.0
      </div>
    </v-container>
  </v-footer>
</template>

<script setup>
</script>

<style scoped>
.app-footer {
  background: linear-gradient(135deg, #001F54 0%, #0066CC 100%);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  height: 36px;
  flex-shrink: 0;
}

.text-sm {
  font-size: 0.75rem;
}
</style>
