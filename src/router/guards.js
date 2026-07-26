import { useAuthStore } from '@/stores/authStore'
import { useReportStore } from '@/stores/reportStore'

export const setupRouterGuards = (router) => {
  const publicPaths = ['/login']
  const authPaths = ['/captcha-verification', '/change-password']
  const protectedPaths = ['/dashboard', '/personnel', '/trainings', '/equipment', '/reports', '/facilities', '/settings', '/profile']

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
      if (authStore.getIsAuthenticated && authStore.getCaptchaVerified) {
        // If already fully logged in, redirect to dashboard
        next('/dashboard')
      } else if (authStore.getIsAuthenticated && !authStore.getCaptchaVerified) {
        // If logged in but CAPTCHA not verified, redirect to CAPTCHA
        next('/captcha-verification')
      } else {
        // Not authenticated, allow access to login
        next()
      }
    } else if (authPaths.includes(to.path)) {
      // Auth routes - CAPTCHA verification and password change
      console.log(`🔐 Auth path detected: ${to.path}`)
      
      // Change password - only accessible when pending password change
      if (to.path === '/change-password') {
        console.log('🔑 Change password route')
        console.log('   getPendingUsername:', authStore.getPendingUsername)
        console.log('   getPendingPassword:', authStore.getPendingPassword ? 'Present' : 'Missing')
        
        if (authStore.getPendingUsername && authStore.getPendingPassword) {
          console.log('✅ Allowing access to /change-password')
          next()
        } else {
          console.log('❌ Redirecting to /login (no pending data)')
          next('/login')
        }
      }
      // CAPTCHA verification routes - only accessible after login
      else if (authStore.getIsAuthenticated && !authStore.getCaptchaVerified) {
        console.log('✅ Allowing access to CAPTCHA verification')
        next()
      } else if (authStore.getIsAuthenticated && authStore.getCaptchaVerified) {
        // If already verified, redirect to dashboard
        console.log('⚠️ Already verified, redirecting to dashboard')
        next('/dashboard')
      } else {
        // If not logged in, redirect to login
        console.log('❌ Not logged in, redirecting to /login')
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
