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
      { title: 'Qualification Rating', to: '/personnel/1', icon: 'mdi-view-list' },
      { title: 'Strength by Grade', to: '/personnel/2', icon: 'mdi-account-plus' },
      { title: 'Readiness Reports', to: '/personnel/3', icon: 'mdi-file-chart' }
    ]
  },
  {
    title: 'Trainings',
    icon: 'mdi-school',
    to: '/trainings',
    role: ['admin', 'officer', 'user'],
    children: [
      { title: 'ORAC', to: '/trainings/1', icon: 'mdi-view-list' },
      { title: 'METT', to: '/trainings/2', icon: 'mdi-calendar-plus' },
      { title: 'Readiness Reports', to: '/trainings/3', icon: 'mdi-history' }
    ]
  },
  {
    title: 'Equipment',
    icon: 'mdi-toolbox',
    to: '/equipment',
    role: ['admin', 'officer'],
    children: [
      { title: 'View Equipment', to: '/equipment/list', icon: 'mdi-view-list' },
      { title: 'Add Equipment', to: '/equipment/add', icon: 'mdi-plus-circle' },
      { title: 'Equipment Status', to: '/equipment/status', icon: 'mdi-check-circle' }
    ]
  },
  {
    title: 'Facilities',
    icon: 'mdi-home-city',
    to: '/facilities',
    role: ['admin', 'officer'],
    children: [
      { title: 'View Facilities', to: '/facilities/list', icon: 'mdi-view-list' },
      { title: 'Facility Details', to: '/facilities/details', icon: 'mdi-information' },
      { title: 'Facility Maintenance', to: '/facilities/maintenance', icon: 'mdi-wrench' }
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
      { title: 'System Settings', to: '/settings/system', icon: 'mdi-cog' },
      { title: 'User Management', to: '/settings/users', icon: 'mdi-account-cog' },
      { title: 'Permissions', to: '/settings/permissions', icon: 'mdi-lock-outline' }
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
