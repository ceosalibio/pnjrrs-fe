<template>
  <div class="trainings-list">
    <v-card class="mb-6">
      <v-card-title>Operationally Ready & Available Crew</v-card-title>
      <v-card-subtitle>Track and manage personnel readiness and availability</v-card-subtitle>
      <v-divider />

      <v-card-text>
        

        <v-table class="data-table">
          <thead>
            <tr class="header-row">
              <th>NR OF PERSONNEL<br>PER UMD</th>
              <th>NR ACTUAL<br>ASSIGNED</th>
              <th>ORAC</th>
              <th>PERCENTAGE</th>
            </tr>

          </thead>
          <tbody>
            <tr class="orac-td">
                <td class="orac-td"></td>
                <td class="orac-td"></td>
                <td class="orac-td"></td>
                <td class="orac-td"></td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')


</script>

<style scoped>
.orac-td {
  height:20vh;  
  font-size: 30px !important;
  font-weight:bold;
  vertical-align: middle !important;
}
</style>
