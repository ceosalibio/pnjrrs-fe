import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const userId = ref(null)
  const firstName = ref('')
  const lastName = ref('')
  const email = ref('')
  const role = ref('')
  const rank = ref('')
  const avatar = ref(null)
  const department = ref('')

  const getUserId = computed(() => userId.value)
  const getFirstName = computed(() => firstName.value)
  const getLastName = computed(() => lastName.value)
  const getFullName = computed(() => `${firstName.value} ${lastName.value}`.trim())
  const getEmail = computed(() => email.value)
  const getRole = computed(() => role.value)
  const getRank = computed(() => rank.value)
  const getAvatar = computed(() => avatar.value)
  const getDepartment = computed(() => department.value)
  const getInitials = computed(() => {
    const first = firstName.value.charAt(0) || ''
    const last = lastName.value.charAt(0) || ''
    return (first + last).toUpperCase()
  })

  const setUserData = (userData) => {
    userId.value = userData.id
    firstName.value = userData.firstName || ''
    lastName.value = userData.lastName || ''
    email.value = userData.email || ''
    role.value = userData.role || ''
    rank.value = userData.rank || ''
    avatar.value = userData.avatar || null
    department.value = userData.department || ''
  }

  const clearUserData = () => {
    userId.value = null
    firstName.value = ''
    lastName.value = ''
    email.value = ''
    role.value = ''
    rank.value = ''
    avatar.value = null
    department.value = ''
  }

  return {
    userId,
    firstName,
    lastName,
    email,
    role,
    rank,
    avatar,
    department,
    getUserId,
    getFirstName,
    getLastName,
    getFullName,
    getEmail,
    getRole,
    getRank,
    getAvatar,
    getDepartment,
    getInitials,
    setUserData,
    clearUserData
  }
}, {
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'user',
        storage: localStorage,
        paths: ['userId', 'firstName', 'lastName', 'email', 'role', 'rank', 'avatar', 'department']
      }
    ]
  }
})
