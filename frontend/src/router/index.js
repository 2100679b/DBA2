import { createRouter, createWebHistory } from 'vue-router'
import ViewLogin from '@/components/sesion/ViewLogin.vue'
import ViewMenu from '@/components/principal/ViewMenu.vue'
import RegistroDispositivo from '@/components/dispositivos/RegistroDispositivo.vue'
import ViewDispositivos from '@/components/dispositivos/ViewDispositivos.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: ViewLogin,
    },
    {
      path: '/login',
      name: 'login',
      component: ViewLogin,
    },
    {
      path: '/menu',
      name: 'menu',
      component: ViewMenu,
      children: [
        { path: '/menu/dispositivos', component: ViewDispositivos },
        { path: '/menu/dispositivos/agregar', component: RegistroDispositivo }

      ]
    },
    {
      path: '/registro',
      name: 'registro',
      component: () => import('../components/sesion/ViewRegistroUsuario.vue'),
    },
    {
      path: '/dispositivos',
      name: 'dispositivo',
      component: ViewDispositivos
    },
  ],
})

export default router
