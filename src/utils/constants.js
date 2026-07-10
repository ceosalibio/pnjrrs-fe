export const MENU_ITEMS = [
  {
    title: 'Dashboard',
    icon: 'mdi-view-dashboard',
    to: '/dashboard',
    role: ['admin', 'user', 'officer']
  },
  {
    title: 'Personnel',
    icon: 'mdi-account-multiple',
    to: '/personnel',
    role: ['admin', 'officer'],
    children: [
      { title: 'Fill Up Rating', to: '/personnel/1', icon: 'mdi-view-list' },
      { title: 'Grade Rating', to: '/personnel/2', icon: 'mdi-account-plus' },
      { title: 'Readiness Reports', to: '/personnel/3', icon: 'mdi-file-chart' }
    ]
  },
  {
    title: 'Trainings',
    icon: 'mdi-school',
    to: '/trainings',
    role: ['admin', 'officer', 'user'],
    children: [
      // { title: 'ORAC', to: '/trainings/1', icon: 'mdi-view-list' },
      { title: 'METT', to: '/trainings/1', icon: 'mdi-calendar-plus' },
      { title: 'Readiness Reports', to: '/trainings/2', icon: 'mdi-history' }
    ]
  },
  {
    title: 'Equipment',
    icon: 'mdi-toolbox',
    to: '/equipment',
    role: ['admin', 'officer'],
    children: [
      { title: 'Item Details', to: '/equipment/1', icon: 'mdi-view-list' },
      { title: 'Readiness Report', to: '/equipment/2', icon: 'mdi-plus-circle' },
      // { title: 'Maintenance Readiness Report', to: '/equipment/3', icon: 'mdi-plus-circle' },
      // { title: 'Equipment Status', to: '/equipment/3', icon: 'mdi-check-circle' }
    ]
  },
  {
    title: 'Facilities',
    icon: 'mdi-home-city',
    to: '/facilities',
    role: ['admin', 'officer'],
    children: [
      { title: 'Fill Up', to: '/facilities/1', icon: 'mdi-view-list' },
      { title: 'Rating', to: '/facilities/2', icon: 'mdi-information' },
      { title: 'Readiness Report', to: '/facilities/3', icon: 'mdi-wrench' }
    ]
  },
  {
    title: 'Reports',
    icon: 'mdi-file-document',
    to: '/reports',
    role: ['admin', 'officer', 'user']
  },
  {
    title: 'Settings',
    icon: 'mdi-cog',
    to: '/settings',
    role: ['admin'],
    children: [
      // { title: 'System Settings', to: '/settings/system', icon: 'mdi-cog' },
      { title: 'User Management', to: '/settings/users', icon: 'mdi-account-cog' },
      { title: 'Table Organization Management', to: '/settings/to', icon: 'mdi-cog' },
      { title: 'Personnel Management', to: '/settings/personnel', icon: 'mdi-cog' },
      { title: 'Training Management', to: '/settings/training', icon: 'mdi-cog' },
      { title: 'Equipment Management', to: '/settings/equipment', icon: 'mdi-cog' },
      { title: 'Facilities Management', to: '/settings/facility', icon: 'mdi-cog' },
      { title: 'Report Management', to: '/settings/report', icon: 'mdi-cog' },
      { title: 'Organization Management', to: '/settings/organization', icon: 'mdi-cog' }
    ]

  }
]

export const USER_ROLES = {
  ADMIN: 'admin',
  OFFICER: 'officer',
  USER: 'user'
}

export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful! Redirecting...',
  LOGIN_ERROR: 'Invalid credentials. Please try again.',
  LOGIN_REQUIRED: 'Please log in to continue.',
  CAPTCHA_REQUIRED: 'Please complete the CAPTCHA verification.',
  LOGOUT_SUCCESS: 'You have been logged out.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  NETWORK_ERROR: 'Network error. Please check your connection.'
}

export const VALIDATION_RULES = {
  REQUIRED: 'This field is required.',
  EMAIL: 'Please enter a valid email address.',
  PASSWORD_MIN: 'Password must be at least 8 characters.',
  PASSWORD_PATTERN: 'Password must contain uppercase, lowercase, and numbers.'
}

export const API_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  VERIFY_CAPTCHA: '/api/auth/verify-captcha',
  USER_PROFILE: '/api/user/profile',
  PERSONNEL: '/api/personnel',
  TRAININGS: '/api/trainings',
  EQUIPMENT: '/api/equipment',
  REPORTS: '/api/reports'
}
