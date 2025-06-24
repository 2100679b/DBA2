import { createRouter, createWebHistory } from 'vue-router'

import ViewLogin from '@/components/sesion/login.vue'
import ViewRegister from '@/components/sesion/register.vue'
import ViewMenu from '@/components/principal/Menu.vue'
import RegistroDispositivo from '@/components/dispositivos/RegistroDispositivo.vue'
import ViewDispositivos from '@/components/dispositivos/ViewDispositivos.vue'

const routes = [
  {
    path: '/',
    redirect: '/login' // Redirige a /login desde la raíz
  },
  {
    path: '/login',
    name: 'login',
    component: ViewLogin
  },
  {
    path: '/register',
    name: 'register',
    component: ViewRegister
  },
  {
    path: '/menu',
    name: 'menu',
    component: ViewMenu,
    children: [
      {
        path: 'dispositivos',
        name: 'dispositivos',
        component: ViewDispositivos
      },
      {
        path: 'dispositivos/agregar',
        name: 'agregar-dispositivo',
        component: RegistroDispositivo
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
