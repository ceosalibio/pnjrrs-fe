<template>
  <v-app-bar
    color="primary"
    dark
    elevation="2"
    class="app-navbar"
  >
    <!-- Left Section -->
    <v-app-bar-nav-icon
      icon="mdi-menu"
      @click="appStore.toggleSidebar()"
    />
    
    <v-icon size="32" class="mx-2">mdi-shield-anchor</v-icon>
    
    <v-app-bar-title class="font-weight-600">
      Automated Philippine Navy AFPJRRS
    </v-app-bar-title>

    <!-- Right Section -->
    <v-spacer />

    <div class="align-center gap-3 mr-10">
      <div>
        {{ userName }}
      </div>
      <div>
        {{ unitName }}
      </div>

      <!-- User Info -->
      <!-- <v-menu offset-y>
        <template #activator="{ props }">
          <v-btn
            variant="text"
            color="white"
            v-bind="props"
            class="text-none"
          >
            <v-avatar
              :color="user.avatar ? 'transparent' : 'secondary'"
              :image="user.avatar"
              size="32"
              class="mr-2"
            >
              <span v-if="!user.avatar" class="text-white font-weight-600">
                {{ userInitials }}
              </span>
            </v-avatar>
            <span class="hidden-sm-and-down mr-1">{{ user.firstName }} {{ user.lastName }}</span>
            <v-icon size="20">mdi-chevron-down</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            title="My Profile"
            prepend-icon="mdi-account"
            @click="goToProfile"
          />
          <v-list-item
            title="Change Password"
            prepend-icon="mdi-lock"
            @click="goToChangePassword"
          />
          <v-list-item
            title="Settings"
            prepend-icon="mdi-cog"
            @click="goToSettings"
          />
          <v-divider />
          <v-list-item
            title="Logout"
            prepend-icon="mdi-logout"
            @click="handleLogout"
          />
        </v-list>
      </v-menu> -->
    </div>
  </v-app-bar>

  <!-- Logout Confirmation Dialog -->
  <app-dialog
    v-model="showLogoutDialog"
    title="Logout Confirmation"
    message="Are you sure you want to logout?"
    confirm-text="Yes, Logout"
    confirm-color="error"
    @confirm="confirmLogout"
  />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/appStore'
import { useUserStore } from '@/stores/userStore'
import { useAuthStore } from '@/stores/authStore'
import { useAuth } from '@/composables/useAuth'
import AppDialog from '../common/AppDialog.vue'

const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()
const authStore = useAuthStore()
const { logout } = useAuth()

const showLogoutDialog = ref(false)

const user = computed(() => ({
  firstName: userStore.getFirstName,
  lastName: userStore.getLastName,
  avatar: userStore.getAvatar
}))

const userInitials = computed(() => userStore.getInitials)
const userName = computed(() => {
  const rankName = authStore?.getUser?.rank?.name || ''
  const userName = authStore?.getUser?.name || ''
  return `${rankName} ${userName}`.trim()
})

const unitName = computed(() => authStore?.getUser?.unit?.name)


// const goToProfile = () => {
//   router.push('/profile')
// }

// const goToChangePassword = () => {
//   router.push('/change-password')
// }

// const goToSettings = () => {
//   router.push('/settings')
// }

// const handleLogout = () => {
//   showLogoutDialog.value = true
// }

const confirmLogout = async () => {
  await logout()
}
</script>

<style scoped>
.app-navbar {
  box-shadow: 0 2px 8px rgba(0, 31, 84, 0.1);
}
</style>
