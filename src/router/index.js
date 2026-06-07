import { createRouter, createWebHistory } from 'vue-router'
import { setupRouterGuards } from './guards'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue')
  },
  {
    path: '/captcha-verification',
    name: 'CaptchaVerification',
    component: () => import('@/views/auth/CaptchaView.vue')
  },
  {
    path: '/',
    component: () => import('@/layouts/DashboardLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/HomeView.vue')
      },

      // Personnel Routes
      {
        path: 'personnel',
        redirect: '/personnel/1'
      },
      {
        path: 'personnel/1',
        name: 'QualityRating',
        component: () => import('@/views/personnel/QualityRating.vue')
      },
      {
        path: 'personnel/2',
        name: 'StrengthByGrade',
        component: () => import('@/views/personnel/StrengthByGrade.vue')
      },
      {
        path: 'personnel/3',
        name: 'ReadinessReports',
        component: () => import('@/views/personnel/ReadinessReports.vue')
      },

      // Trainings Routes
      {
        path: 'trainings',
        redirect: '/trainings/1'
      },
      {
        path: 'trainings/1',
        name: 'Orac',
        component: () => import('@/views/trainings/Orac.vue')
      },
      {
        path: 'trainings/2',
        name: 'Mett',
        component: () => import('@/views/trainings/Mett.vue')
      },
      {
        path: 'trainings/3',
        name: 'ReadinessReports',
        component: () => import('@/views/trainings/ReadinessReports.vue')
      },

      // Equipment Routes
      {
        path: 'equipment',
        redirect: '/equipment/list'
      },
      {
        path: 'equipment/list',
        name: 'EquipmentList',
        component: () => import('@/views/equipment/EquipmentListView.vue')
      },
      {
        path: 'equipment/add',
        name: 'EquipmentAdd',
        component: () => import('@/views/equipment/EquipmentAddView.vue')
      },
      {
        path: 'equipment/status',
        name: 'EquipmentStatus',
        component: () => import('@/views/equipment/EquipmentStatusView.vue')
      },

      // Facilities Routes
      {
        path: 'facilities',
        redirect: '/facilities/list'
      },
      {
        path: 'facilities/list',
        name: 'FacilitiesList',
        component: () => import('@/views/facilities/FacilitiesListView.vue')
      },
      {
        path: 'facilities/details',
        name: 'FacilitiesDetails',
        component: () => import('@/views/facilities/FacilitiesDetailsView.vue')
      },
      {
        path: 'facilities/maintenance',
        name: 'FacilitiesMaintenance',
        component: () => import('@/views/facilities/FacilitiesMaintenanceView.vue')
      },

      // Reports Route
      {
        path: 'reports',
        name: 'Reports',
        component: () => import('@/views/ReportsView.vue')
      },

      // Settings Routes
      {
        path: 'settings',
        redirect: '/settings/system'
      },
      {
        path: 'settings/system',
        name: 'SettingsSystem',
        component: () => import('@/views/settings/SettingsSystemView.vue')
      },
      {
        path: 'settings/users',
        name: 'SettingsUsers',
        component: () => import('@/views/settings/SettingsUsersView.vue')
      },
      {
        path: 'settings/permissions',
        name: 'SettingsPermissions',
        component: () => import('@/views/settings/SettingsPermissionsView.vue')
      }
    ]
  },

  // 404 Not Found
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Setup guards
setupRouterGuards(router)

export default router
