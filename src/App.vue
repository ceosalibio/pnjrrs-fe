<template>
  <v-app>
    <!-- Example: Navbar -->
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>My Vue 3 App</v-toolbar-title>
      <v-spacer />
      <v-btn to="/" text>Home</v-btn>
      <v-btn to="/about" text>About</v-btn>
    </v-app-bar>

    <!-- Main content -->
    <v-main>
      <router-view />
    </v-main>

    <!-- Example: Footer -->
    <v-footer app color="grey lighten-4">
      <span class="ml-3">&copy; {{ new Date().getFullYear() }} My Company</span>
    </v-footer>
  </v-app>
</template>

<script setup>
// no script logic needed here for now
</script>

<style>
/* global styles can go here */
</style>
