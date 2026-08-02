export const mockUsers = [
  {
    id: 1,
    email: 'admin@pnay.gov.ph',
    password: 'Admin@12345',
    firstName: 'Juan',
    lastName: 'Dela Cruz',
    rank: 'Commodore',
    role: 'admin',
    avatar: null
  },
  {
    id: 2,
    email: 'officer@pnay.gov.ph',
    password: 'Officer@123',
    firstName: 'Maria',
    lastName: 'Santos',
    rank: 'Captain',
    role: 'officer',
    avatar: null
  },
  {
    id: 3,
    email: 'user@pnay.gov.ph',
    password: 'User@123456',
    firstName: 'Pedro',
    lastName: 'Garcia',
    rank: 'Petty Officer',
    role: 'user',
    avatar: null
  }
]

export const mockDashboardData = {
  stats: [
    { label: 'Total Personnel', value: 2847, icon: 'mdi-account-multiple', color: 'primary', percentage: '100%', trend: 0 },
    { label: 'Active Personnel', value: 2645, icon: 'mdi-check-circle', color: 'success', percentage: '92.9%', trend: 1 },
    { label: 'On Leave Today', value: 65, icon: 'mdi-account-clock', color: 'warning', percentage: '2.3%', trend: 1 },
    { label: 'Pending Reports', value: 23, icon: 'mdi-file-outline', color: 'info', percentage: '6.7%', trend: 2 },
    { label: 'Approved Reports', value: 156, icon: 'mdi-file-check', color: 'info', percentage: '12.4%', trend: 1 },
    { label: 'Overdue Reports', value: 7, icon: 'mdi-alert-circle', color: 'error', percentage: '3.1%', trend: -1 }
  ],
  personnelStatus: {
    total: 2847,
    data: [
      { label: 'Active', value: 2645, percentage: 92.9, color: '#1f77b4' },
      { label: 'On Leave', value: 65, percentage: 2.3, color: '#ff7f0e' },
      { label: 'Training', value: 54, percentage: 1.9, color: '#2ca02c' },
      { label: 'Retired', value: 30, percentage: 1.1, color: '#d62728' },
      { label: 'Inactive', value: 53, percentage: 1.8, color: '#9467bd' }
    ]
  },
  reportsTrend: {
    dates: ['Jul 2', 'Jul 9', 'Jul 16', 'Jul 23', 'Jul 30', 'Aug 1'],
    submitted: [75, 85, 72, 82, 88, 92],
    approved: [45, 52, 48, 55, 60, 65],
    rejected: [8, 10, 7, 9, 11, 8]
  },
  equipmentStatus: {
    total: 318,
    data: [
      { label: 'Operational', value: 210, percentage: 66 },
      { label: 'Under Maintenance', value: 54, percentage: 17 },
      { label: 'For Replacement', value: 23, percentage: 7 },
      { label: 'Inspection Due', value: 31, percentage: 10 }
    ]
  },
  upcomingSchedule: [
    { id: 1, date: 'AUG 02', type: 'System Maintenance', time: '10:00 PM - 2:00 AM', tag: 'System', tagColor: 'primary' },
    { id: 2, date: 'AUG 05', type: 'Advanced Maritime Operations Training', time: '08:00 AM - 05:00 PM', tag: 'Training', tagColor: 'success' },
    { id: 3, date: 'AUG 07', type: 'Monthly Equipment Inspection', time: '09:00 AM - 12:00 PM', tag: 'Inspection', tagColor: 'warning' },
    { id: 4, date: 'AUG 10', type: 'Command Conference', time: '02:00 PM - 04:00 PM', tag: 'Meeting', tagColor: 'info' }
  ],
  recentActivities: [
    { id: 1, type: 'login', user: 'CAPT Maria Santos', action: 'Approved training request', time: '10 mins ago' },
    { id: 2, type: 'report', user: 'PO3 Pedro Garcia', action: 'Submitted personnel inspection report', time: '35 mins ago' },
    { id: 3, type: 'training', user: 'CDR Juan Dela Cruz', action: 'Updated personnel profile', time: '1 hour ago' },
    { id: 4, type: 'equipment', user: 'LTJG Ana Reyes', action: 'Submitted leave request', time: '2 hours ago' }
  ],
  announcements: [
    { id: 1, title: 'System Maintenance', description: 'Scheduled maintenance on Saturday, 10 PM - 2 AM', date: '2026-08-01', tag: 'Urgent', tagColor: 'error' },
    { id: 2, title: 'New Training Program', description: 'Advanced Maritime Operations Training program starts next month', date: '2026-07-29', tag: 'Reminder', tagColor: 'warning' },
    { id: 3, title: 'Equipment Update', description: 'New sonar systems have been delivered and installed', date: '2026-07-28', tag: 'Information', tagColor: 'success' }
  ]
}

export const mockPersonnel = [
  { id: 1, name: 'CAPT Maria Santos', rank: 'Captain', position: 'Operations Officer', status: 'Active' },
  { id: 2, name: 'LT Jose Manuel', rank: 'Lieutenant', position: 'Communications Officer', status: 'Active' },
  { id: 3, name: 'PO3 Pedro Garcia', rank: 'Petty Officer 3rd Class', position: 'Engineering Specialist', status: 'Active' }
]

export const mockTrainings = [
  { id: 1, name: 'Maritime Operations', instructor: 'CAPT Maria Santos', startDate: '2024-06-15', status: 'Scheduled' },
  { id: 2, name: 'Leadership Skills', instructor: 'CDR Juan Dela Cruz', startDate: '2024-07-01', status: 'Scheduled' },
  { id: 3, name: 'Ship Navigation', instructor: 'CAPT Maria Santos', startDate: '2024-05-20', status: 'Completed' }
]

export const mockEquipment = [
  { id: 1, name: 'Sonar System', model: 'SPQ-730', status: 'Operational', lastMaintenance: '2024-05-15' },
  { id: 2, name: 'Radar', model: 'SPS-73', status: 'Operational', lastMaintenance: '2024-05-10' },
  { id: 3, name: 'Communication System', model: 'SRC-90', status: 'Maintenance', lastMaintenance: '2024-05-20' }
]
