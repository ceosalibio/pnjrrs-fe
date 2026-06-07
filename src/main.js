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
app.use(router)
app.use(vuetify)

app.mount('#app')
