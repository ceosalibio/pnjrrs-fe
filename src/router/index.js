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
        name: 'PersonnelReadinessReports',
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
        name: 'TrainingReadinessReports',
        component: () => import('@/views/trainings/ReadinessReports.vue')
      },

      // Equipment Routes
      {
        path: 'equipment',
        redirect: '/equipment/1'
      },
      {
        path: 'equipment/1',
        name: 'EquipmentList',
        component: () => import('@/views/equipment/ItemDetails.vue')
      },
      {
        path: 'equipment/2',
        name: 'EquipmentReadinessReport',
        component: () => import('@/views/equipment/ReadinessReport.vue')
      },
      // {
      //   path: 'equipment/3',
      //   name: 'EquipmentStatus',
      //   component: () => import('@/views/equipment/EquipmentStatusView.vue')
      // },

      // Facilities Routes
      {
        path: 'facilities',
        redirect: '/facilities/1'
      },
      {
        path: 'facilities/1',
        name: 'FillUp',
        component: () => import('@/views/facilities/Fillup.vue')
      },
      {
        path: 'facilities/2',
        name: 'Rating',
        component: () => import('@/views/facilities/Rating.vue')
      },
      {
        path: 'facilities/3',
        name: 'FacilityReadinessReport',
        component: () => import('@/views/facilities/ReadinessReport.vue')
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
