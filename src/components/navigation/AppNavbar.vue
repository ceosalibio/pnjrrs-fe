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
    
    <v-icon size="32" class="navbar-icon">mdi-shield-anchor</v-icon>
    
    <v-app-bar-title class="navbar-title font-weight-600">
      Automated Philippine Navy AFPJRRS
    </v-app-bar-title>

    <!-- Right Section -->
    <v-spacer />

    <div class="user-info-container">
      <div class="user-details">
        <div class="user-name">
          {{ userName }}
        </div>
        <div class="unit-name">
          {{ unitName }}
        </div>
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

.navbar-icon {
  margin: 0 8px;
  flex-shrink: 0;
}

.navbar-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  flex-shrink: 1;
}

.user-info-container {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-right: 40px;
  flex-shrink: 0;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.2;
}

.unit-name {
  font-size: 12px;
  opacity: 0.9;
  line-height: 1.2;
}

/* Tablet screens */
@media (max-width: 1024px) {
  .user-info-container {
    margin-right: 20px;
    gap: 8px;
  }

  .navbar-title {
    font-size: 16px;
  }

  .user-name {
    font-size: 13px;
  }

  .unit-name {
    font-size: 11px;
  }
}

/* Mobile devices */
@media (max-width: 768px) {
  .navbar-title {
    font-size: 14px;
    max-width: 150px;
  }

  .user-info-container {
    margin-right: 8px;
    gap: 4px;
  }

  .user-name {
    font-size: 12px;
  }

  .unit-name {
    font-size: 10px;
  }
}

/* Small mobile devices */
@media (max-width: 480px) {
  .navbar-title {
    font-size: 12px;
    max-width: 100px;
  }

  .navbar-icon {
    margin: 0 4px;
  }

  .user-info-container {
    margin-right: 0;
    gap: 0;
    flex-direction: column;
  }

  .user-details {
    gap: 0;
    text-align: right;
  }

  .user-name {
    font-size: 11px;
  }

  .unit-name {
    font-size: 9px;
  }
}
</style>
