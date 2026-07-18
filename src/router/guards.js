import { useAuthStore } from '@/stores/authStore'
import { useReportStore } from '@/stores/reportStore'

export const setupRouterGuards = (router) => {
  const publicPaths = ['/login']
  const authPaths = ['/captcha-verification']
  const protectedPaths = ['/dashboard', '/personnel', '/trainings', '/equipment', '/reports', '/facilities', '/settings', '/profile', '/change-password']

  // Helper function to get report type from path
  const getReportType = (path) => {
    if (path.startsWith('/personnel')) return 'personnel'
    if (path.startsWith('/trainings')) return 'trainings'
    if (path.startsWith('/equipment')) return 'equipment'
    if (path.startsWith('/facilities')) return 'facilities'
    return null
  }

  router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    const reportStore = useReportStore()

    // Clear reportStore when switching between different report types
    const fromReportType = getReportType(from.path)
    const toReportType = getReportType(to.path)

    if (fromReportType && toReportType && fromReportType !== toReportType) {
      reportStore.clearReportData()
    }

    if (publicPaths.includes(to.path)) {
      // Public routes
      if (authStore.getIsAuthenticated) {
        // If already logged in, redirect to dashboard
        next('/dashboard')
      } else {
        next()
      }
    } else if (authPaths.includes(to.path)) {
      // CAPTCHA verification routes - only accessible after login
      if (authStore.getIsAuthenticated && !authStore.getCaptchaVerified) {
        next()
      } else if (authStore.getIsAuthenticated && authStore.getCaptchaVerified) {
        // If already verified, redirect to dashboard
        next('/dashboard')
      } else {
        // If not logged in, redirect to login
        next('/login')
      }
    } else if (protectedPaths.includes(to.path)) {
      // Protected routes - requires authentication and CAPTCHA verification
      if (authStore.getIsAuthenticated && authStore.getCaptchaVerified) {
        next()
      } else if (authStore.getIsAuthenticated && !authStore.getCaptchaVerified) {
        // If logged in but CAPTCHA not verified, redirect to CAPTCHA
        next('/captcha-verification')
      } else {
        // If not logged in, redirect to login
        next('/login')
      }
    } else {
      // For other routes, allow access
      next()
    }
  })
}
