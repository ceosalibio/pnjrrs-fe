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
    { label: 'Total Personnel', value: 2847, icon: 'mdi-account-multiple', color: 'primary' },
    { label: 'Active Personnel', value: 2645, icon: 'mdi-check-circle', color: 'success' },
    { label: 'Pending Reports', value: 23, icon: 'mdi-file-outline', color: 'warning' },
    { label: 'Approved Reports', value: 156, icon: 'mdi-file-check', color: 'info' }
  ],
  recentActivities: [
    { id: 1, type: 'login', user: 'CAPT Maria Santos', time: '2 hours ago' },
    { id: 2, type: 'report', user: 'PO3 Pedro Garcia', time: '4 hours ago' },
    { id: 3, type: 'training', user: 'CAPT Maria Santos', time: '1 day ago' },
    { id: 4, type: 'equipment', user: 'CDR Juan Dela Cruz', time: '2 days ago' }
  ],
  announcements: [
    { id: 1, title: 'System Maintenance', description: 'Scheduled maintenance on Saturday, 10 PM - 2 AM', date: '2024-06-10' },
    { id: 2, title: 'New Training Program', description: 'Advanced Maritime Operations Training program starts next month', date: '2024-06-05' },
    { id: 3, title: 'Equipment Update', description: 'New sonar systems have been delivered and installed', date: '2024-06-01' }
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
