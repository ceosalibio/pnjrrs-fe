<template>
  <div class="settings-system">
    <v-card class="mb-6">
      <v-card-title>System Settings</v-card-title>
      <v-card-subtitle>Configure system-wide settings and preferences</v-card-subtitle>
      <v-divider />

      <v-card-text>
        <v-form @submit.prevent="onSubmit">
          <v-section-title>General Settings</v-section-title>
          
          <v-row class="mt-4">
            <v-col cols="12" md="6">
              <v-text-field
                v-model="settings.systemName"
                label="System Name"
                variant="outlined"
                required
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="settings.systemVersion"
                label="System Version"
                variant="outlined"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="settings.supportEmail"
                label="Support Email"
                type="email"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="settings.supportPhone"
                label="Support Phone"
                variant="outlined"
              />
            </v-col>
          </v-row>

          <v-divider class="my-6" />

          <v-section-title>Security Settings</v-section-title>

          <v-row class="mt-4">
            <v-col cols="12" md="6">
              <v-switch
                v-model="settings.twoFactorEnabled"
                label="Enable Two-Factor Authentication"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="settings.sessionTimeout"
                label="Session Timeout (minutes)"
                type="number"
                variant="outlined"
              />
            </v-col>
          </v-row>

          <v-divider class="my-6" />

          <v-section-title>Email Settings</v-section-title>

          <v-row class="mt-4">
            <v-col cols="12" md="6">
              <v-text-field
                v-model="settings.smtpServer"
                label="SMTP Server"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="settings.smtpPort"
                label="SMTP Port"
                type="number"
                variant="outlined"
              />
            </v-col>
          </v-row>

          <v-divider class="my-6" />

          <div class="d-flex gap-2 justify-end">
            <v-btn variant="outlined" @click="resetForm">Reset</v-btn>
            <v-btn color="primary" type="submit">Save Settings</v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useAppStore } from '@/stores/appStore'

const appStore = useAppStore()

const settings = reactive({
  systemName: 'Philippine Navy Management System',
  systemVersion: '1.0.0',
  supportEmail: 'support@pnay.gov.ph',
  supportPhone: '+63-2-123-4567',
  twoFactorEnabled: true,
  sessionTimeout: 30,
  smtpServer: 'mail.pnay.gov.ph',
  smtpPort: 587
})

const resetForm = () => {
  settings.systemName = 'Philippine Navy Management System'
  settings.systemVersion = '1.0.0'
  settings.supportEmail = 'support@pnay.gov.ph'
  settings.supportPhone = '+63-2-123-4567'
  settings.twoFactorEnabled = true
  settings.sessionTimeout = 30
  settings.smtpServer = 'mail.pnay.gov.ph'
  settings.smtpPort = 587
}

const onSubmit = () => {
  appStore.showSnackbar('System settings updated successfully!', 'success')
}
</script>

<style scoped>
.settings-system {
  padding: 1rem;
}

::v-deep .v-section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}
</style>
