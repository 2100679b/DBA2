import './assets/main.css'

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'

import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css'; // Importa los estilos

import '@popperjs/core'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

const app = createApp(App)
app.use(Toast);
app.use(store)
app.use(router)
app.mount('#app')