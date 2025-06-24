import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store' // Importa el store de Vuex
import axios from 'axios'
import { checkAuth, setAuthToken } from './utils/auth'

// Estilos globales necesarios
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

// Configuración base de Axios
axios.defaults.baseURL = process.env.VUE_APP_API_URL || ''

// Verifica la autenticación del usuario
checkAuth()

// Crea la aplicación Vue
const app = createApp(App)

// Inyecta router y store
app.use(router)
app.use(store) // ¡Esta línea es crucial para que Vuex funcione!

// Inyecta Axios globalmente
app.config.globalProperties.$axios = axios

// Manejo global de errores
app.config.errorHandler = (err, vm, info) => {
  console.error(`Error global: ${err.toString()}\nInfo: ${info}`)

  if (err.response && err.response.status === 401) {
    // Token inválido o expirado
    setAuthToken(null)
    router.push('/login')
  }
}

// Monta la aplicación
app.mount('#app')

// Solo en desarrollo: expone el router en consola para depuración
if (process.env.NODE_ENV === 'development') {
  window.$router = router
  window.$store = store // También expone el store para depuración
}