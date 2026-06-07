<template>
  <div class="equipment-add">
    <v-card class="mb-6">
      <v-card-title>Add Equipment</v-card-title>
      <v-card-subtitle>Register new equipment to the inventory</v-card-subtitle>
      <v-divider />

      <v-card-text>
        <v-form @submit.prevent="onSubmit">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.name"
                label="Equipment Name"
                variant="outlined"
                placeholder="Enter equipment name"
                required
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.category"
                label="Category"
                :items="['Electronics', 'Communications', 'Navigation', 'Weapons', 'Machinery']"
                variant="outlined"
                required
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.serialNumber"
                label="Serial Number"
                variant="outlined"
                placeholder="Enter serial number"
                required
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.quantity"
                label="Quantity"
                type="number"
                variant="outlined"
                required
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.condition"
                label="Condition"
                :items="['excellent', 'good', 'fair', 'poor']"
                variant="outlined"
                required
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.location"
                label="Location"
                variant="outlined"
                placeholder="Enter location"
                required
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-textarea
                v-model="form.remarks"
                label="Remarks"
                variant="outlined"
                placeholder="Enter any additional remarks"
                rows="3"
              />
            </v-col>
          </v-row>

          <v-divider class="my-6" />

          <div class="d-flex gap-2 justify-end">
            <v-btn variant="outlined" @click="$router.back()">Cancel</v-btn>
            <v-btn color="primary" type="submit">Add Equipment</v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/appStore'

const router = useRouter()
const appStore = useAppStore()

const form = reactive({
  name: '',
  category: '',
  serialNumber: '',
  quantity: '',
  condition: 'good',
  location: '',
  remarks: ''
})

const onSubmit = async () => {
  appStore.showSnackbar('Equipment added successfully!', 'success')
  router.push('/equipment/list')
}
</script>

<style scoped>
.equipment-add {
  padding: 1rem;
}
</style>
