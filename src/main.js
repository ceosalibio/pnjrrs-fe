import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersistedstate from 'pinia-plugin-persistedstate'
import router from './router'
import App from './App.vue'
import './style.css'

// Material Design Icons
import '@mdi/font/css/materialdesignicons.css'

// Vuetify Plugin
import vuetify from './plugins/vuetify'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPersistedstate)
app.use(pinia)

// After pinia is created and before router is set up, validate auth state
import { useAuthStore } from './stores/authStore'
const validateAuthOnInit = () => {
  const authStore = useAuthStore()
  // Check if localStorage has user data (handles case where localStorage was cleared)
  const storedUser = localStorage.getItem('user')
  const storedToken = localStorage.getItem('token')
  
  // If user or token is missing from localStorage, logout
  if (!storedUser || !storedToken) {
    authStore.logout()
  }
}
validateAuthOnInit()

app.use(router)
app.use(vuetify)

app.mount('#app')
