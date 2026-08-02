<template>
  <v-navigation-drawer
    :model-value="appStore.getSidebarOpen"
    :width="280"
    class="app-sidebar"
    @update:model-value="appStore.setSidebarOpen"
  >
    <!-- Sidebar Header -->
    <v-card
      color="primary"
      dark
      elevation="0"
      class="pa-4 text-center"
    >
      <v-icon size="48" class="mb-2">mdi-shield-anchor</v-icon>
      <h3 class="text-h6 font-weight-600">Philippine Navy</h3>
      <p class="text-sm opacity-75">AFPJRRS</p>
    </v-card>

    <v-divider />

    <!-- Navigation Items -->
    <v-list class="pa-3">
      <template v-for="item in menuItems" :key="item.to">
        <!-- Item with children (submenu) -->
        <v-list-group v-if="item.children" :value="item.title">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              :prepend-icon="item.icon"
              :title="item.title"
              :class="[
                'mb-2 rounded',
                hasActiveChild(item.children) ? 'active-parent' : ''
              ]"
            />
          </template>

          <!-- Submenu Items -->
          <v-list-item
            v-for="child in item.children"
            :key="child.to"
            :active="isActive(child.to)"
            :to="child.to"
            :prepend-icon="child.icon"
            :title="child.title"
            :class="[
              'mb-2 ml-4 rounded submenu-item',
              isActive(child.to) ? 'active-submenu' : ''
            ]"
            link
          />
        </v-list-group>

        <!-- Regular item without children -->
        <v-list-item
          v-else
          :active="isActive(item.to)"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          class="mb-2 rounded"
          link
        />
      </template>
    </v-list>

    <!-- Sidebar Footer -->
    <template #append>
      <v-divider />
      <v-list class="pa-3">
        <v-list-item
          prepend-icon="mdi-logout"
          title="Logout"
          @click="handleLogout"
        />
      </v-list>
    </template>
  </v-navigation-drawer>

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
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/stores/appStore'
import { useAuthStore } from '@/stores/authStore'
import { useAuth } from '@/composables/useAuth'
import { MENU_ITEMS } from '@/utils/constants'
import AppDialog from '../common/AppDialog.vue'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const authStore = useAuthStore()
const { logout } = useAuth()

const showLogoutDialog = ref(false)

// Check if user has access to item based on role and office
const hasAccess = (item) => {
  if (!authStore.user) return false

  const userRole = authStore.user.role
  const userOffice = authStore.office

  console.log(`Checking ${item.title}: role=${userRole}, office=${userOffice}`, item)

  // Check role: if 'all' is in role array, show to everyone
  // Also treat role 0 as admin (can access everything)
  const roleAllowed = item.role?.includes('all') || item.role.includes(userRole) || userRole === 0
  const officeAllowed = item.office?.includes(userOffice)
  console.log(`  Role allowed: ${roleAllowed} (item.role=${item.role}, userRole=${userRole})`)
  if (!roleAllowed && !officeAllowed) return false

  // Check office: if no office restriction, show it
  if (!item.office || item.office.length === 0) {
    console.log(`  Office allowed: true (no restriction)`)
    return true
  }

  return true
}

// Check if child has access (considers both parent and child permissions)
const childHasAccess = (child, parent) => {
  if (!authStore.user) return false
  
  const userRole = authStore.user.role
  const userOffice = authStore.office
  
  // Use child's role/office if defined, otherwise use parent's
  const itemToCheck = child.role || child.office ? child : parent
  
  // Check role: if 'all' is in role array, show to everyone
  // Also treat role 0 as admin (can access everything)
  const roleAllowed = itemToCheck.role?.includes('all') || itemToCheck.role?.includes(userRole) || userRole === 0
  const officeAllowed = itemToCheck.office?.includes(userOffice)
  
  if (!roleAllowed && !officeAllowed) return false

  // Check office: if no office restriction, show it
  if (!itemToCheck.office || itemToCheck.office.length === 0) {
    return true
  }

  return officeAllowed
}

const menuItems = computed(() => {
  return MENU_ITEMS.filter(item => hasAccess(item))
    .map(item => {
      if (item.children) {
        const filteredChildren = item.children.filter(child => childHasAccess(child, item))
        // Only show parent if it has at least one child visible
        if (filteredChildren.length === 0) return null
        return {
          ...item,
          children: filteredChildren
        }
      }
      return item
    })
    .filter(item => item !== null)
})

const isActive = (itemPath) => {
  return route.path === itemPath
}

const hasActiveChild = (children) => {
  return children.some(child => isActive(child.to))
}

const handleLogout = () => {
  showLogoutDialog.value = true
}

const confirmLogout = async () => {
  await logout()
}
</script>

<style scoped>
.app-sidebar {
  transition: all 0.3s ease;
}

::v-deep .v-list-item__title {
  overflow: visible !important;
  white-space: normal !important;
  word-break: break-word;
  max-width: 100% !important;
}

::v-deep .v-list-group__items .v-list-item {
  padding-left: 12px !important;
}

::v-deep .v-list-group__items .v-list-item__title {
  font-size: 0.875rem;
  overflow: visible !important;
  white-space: normal !important;
}

::v-deep .v-list-item--nav {
  min-height: auto;
  padding-top: 4px;
  padding-bottom: 4px;
}

/* Active menu item highlighting */
::v-deep .v-list-item.v-list-item--active {
  background-color: rgba(15, 51, 153, 0.6) !important;
  border-left: 3px solid #fff;
  padding-left: 13px !important;
}

::v-deep .v-list-item.v-list-item--active .v-list-item__prepend .v-icon {
  color: #fff !important;
}

::v-deep .v-list-item.v-list-item--active .v-list-item__title {
  color: #fff !important;
  font-weight: 600;
}

/* Active parent menu highlighting */
.active-parent ::v-deep {
  background-color: rgba(15, 51, 153, 0.4) !important;
}

.active-parent ::v-deep .v-list-item__prepend .v-icon {
  color: #fff !important;
}

/* Active submenu item styling */
.active-submenu ::v-deep {
  background-color: rgba(15, 51, 153, 0.5) !important;
  font-weight: 600;
}

.active-submenu ::v-deep .v-list-item__prepend .v-icon {
  color: #fff !important;
}

.submenu-item ::v-deep .v-list-item__title {
  color: rgba(255, 255, 255, 0.9);
}
</style>
