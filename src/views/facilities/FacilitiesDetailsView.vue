<template>
  <div class="facilities-details">
    <v-row>
      <v-col cols="12" md="8">
        <v-card class="mb-6">
          <v-card-title>Facility Details</v-card-title>
          <v-card-subtitle v-if="facility">{{ facility.name }}</v-card-subtitle>
          <v-divider />

          <v-card-text v-if="facility">
            <v-row class="mb-4">
              <v-col cols="12" md="6">
                <div class="text-caption text-grey">Facility Name</div>
                <div class="text-h6">{{ facility.name }}</div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="text-caption text-grey">Type</div>
                <div class="text-h6">{{ facility.type }}</div>
              </v-col>
            </v-row>

            <v-row class="mb-4">
              <v-col cols="12" md="6">
                <div class="text-caption text-grey">Location</div>
                <div class="text-h6">{{ facility.location }}</div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="text-caption text-grey">Capacity</div>
                <div class="text-h6">{{ facility.capacity }}</div>
              </v-col>
            </v-row>

            <v-row class="mb-4">
              <v-col cols="12">
                <div class="text-caption text-grey">Status</div>
                <v-chip :color="facility.status === 'operational' ? 'success' : 'warning'">
                  {{ facility.status }}
                </v-chip>
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <div>
              <div class="text-caption text-grey">Description</div>
              <div>{{ facility.description }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Quick Actions</v-card-title>
          <v-divider />
          <v-card-text>
            <div class="d-flex flex-column gap-2">
              <v-btn color="primary" block @click="$router.push('/facilities/maintenance')">
                View Maintenance
              </v-btn>
              <v-btn color="info" block>
                Edit Facility
              </v-btn>
              <v-btn color="warning" block>
                Schedule Maintenance
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const facility = ref({
  name: 'Naval Base Cavite',
  type: 'Naval Base',
  location: 'Cavite',
  capacity: '5000 personnel',
  status: 'operational',
  description: 'Main naval base serving as headquarters for naval operations and personnel training.'
})
</script>

<style scoped>
.facilities-details {
  padding: 1rem;
}
</style>
