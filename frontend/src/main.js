// main.js
import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// Importa el plugin completo en lugar de solo la función
import ToastPlugin from 'vue-toastification';
import 'vue-toastification/dist/index.css';

import '@popperjs/core';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const app = createApp(App);

// Configuración de Toast
const toastOptions = {
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  icon: true
};

// Registra el plugin globalmente
app.use(ToastPlugin, toastOptions);
app.use(store);
app.use(router);
app.mount('#app');