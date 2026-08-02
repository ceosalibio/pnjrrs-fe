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
    path: '/change-password',
    name: 'ChangePassword',
    component: () => import('@/views/auth/ChangePassword.vue')
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
        redirect: '/personnel/1',
        meta: {
          requiresAuth: true,
          allowedRoles: [1],
          allowedOffices: [1,3]
        }
      },
      {
        path: 'personnel/1',
        name: 'QualityRating',
        component: () => import('@/views/personnel/QualityRating.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: [1],
          allowedOffices: [1,3]
        }
      },
      {
        path: 'personnel/2',
        name: 'StrengthByGrade',
        component: () => import('@/views/personnel/StrengthByGrade.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: [1],
          allowedOffices: [1, 3]
        }
      },
      {
        path: 'personnel/3',
        name: 'PersonnelReadinessReports',
        component: () => import('@/views/personnel/ReadinessReports.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: [1],
          allowedOffices: [1, 3]
        }
      },

      // Trainings Routes
      {
        path: 'trainings',
        redirect: '/trainings/1'
      },
      // {
      //   path: 'trainings/1',
      //   name: 'Orac',
      //   component: () => import('@/views/trainings/Orac.vue')
      // },
      {
        path: 'trainings/1',
        name: 'Mett',
        component: () => import('@/views/trainings/Mett.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: [1],
          allowedOffices: [8,3]
        }
      },
      {
        path: 'trainings/2',
        name: 'TrainingReadinessReports',
        component: () => import('@/views/trainings/ReadinessReports.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: [1],
          allowedOffices: [8,3]
        }
      },

      // Equipment Routes
      {
        path: 'equipment',
        redirect: '/equipment/1'
      },
      {
        path: 'equipment/1',
        name: 'EquipmentList',
        component: () => import('@/views/equipment/ItemDetails.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: [1],
          allowedOffices: [4,6,3]
        }
      },
      {
        path: 'equipment/2',
        name: 'EquipmentReadinessReport',
        component: () => import('@/views/equipment/ReadinessReport.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: [1],
          allowedOffices: [4,6,3]
        }
      },
      // {
      //   path: 'equipment/3',
      //   name: 'MaintenanceReadinessReport',
      //   component: () => import('@/views/equipment/MaintenanceReadinessReport.vue')
      // },

      // Facilities Routes
      {
        path: 'facilities',
        redirect: '/facilities/1'
      },
      {
        path: 'facilities/1',
        name: 'FillUp',
        component: () => import('@/views/facilities/Fillup.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: [1],
          allowedOffices: [4,3]
        }
      },
      // {
      //   path: 'facilities/2',
      //   name: 'Rating',
      //   component: () => import('@/views/facilities/Rating.vue')
      // },
      {
        path: 'facilities/2',
        name: 'FacilityReadinessReport',
        component: () => import('@/views/facilities/ReadinessReport.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: [1],
          allowedOffices: [4,3]
        }
      },

      // Reports Route
      {
        path: 'reports',
        name: 'Reports',
        component: () => import('@/views/reports/ReportsView.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: [1],
          allowedOffices: [4,6,3,8,1]
        }
      },

      // Settings Routes
      {
        path: 'settings',
        redirect: '/settings/users'
      },
      
      {
        path: 'settings/users',
        name: 'SettingsUsers',
        component: () => import('@/views/settings/SettingsUsersView.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: [1],
          allowedOffices: [3]
        }
      },
      {
        path: 'settings/organization',
         name: 'OrganizationManagement',
        component: () => import('@/views/settings/SettingOrganization.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: [1],
          allowedOffices: [3]
        }
      },
      {
        path: 'settings/to',
         name: 'TableOrganization',
        component: () => import('@/views/settings/SettingTableOrganization.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: [1],
          allowedOffices: [1,3]
        }
      },
      // {
      //   path: 'settings/personnel',
      //   name: 'SettingPersonnel',
      //   component: () => import('@/views/settings/SettingPersonnel.vue')
      // },
      {
        path: 'settings/training',
        name: 'SettingTraining',
        component: () => import('@/views/settings/SettingTraining.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: [1],
          allowedOffices: [3,8]
        }
      },
      {
        path: 'settings/equipment',
        name: 'SettingEquipment',
        component: () => import('@/views/settings/SettingEquipment.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: [1],
          allowedOffices: [4,6,3]
        }
      },
      {
        path: 'settings/facility',
        name: 'SettingFacility',
        component: () => import('@/views/settings/SettingFacility.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: [1],
          allowedOffices: [4,3]
        }
      },
      {
        path: 'settings/report',
        name: 'SettingReport',
        component: () => import('@/views/settings/SettingReport.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: [1],
          allowedOffices: [4,6,8,3,1]
        }
      },
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
