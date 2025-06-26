import { createRouter, createWebHistory } from 'vue-router'

// Vista de Login
import ViewLogin from '@/components/sesion/ViewLogin.vue'

// Vista de Registro de Usuario
import ViewRegistroUsuario from '@/components/sesion/ViewRegistroUsuario.vue'

// Vista principal con menú
import ViewMenu from '@/components/principal/ViewMenu.vue'

// Vistas de dispositivos
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
      path: '/registro',
      name: 'registro',
      component: ViewRegistroUsuario,
    },
    {
      path: '/menu',
      name: 'menu',
      component: ViewMenu,
      children: [
        {
          path: 'dispositivos',
          name: 'dispositivos',
          component: ViewDispositivos,
        },
        {
          path: 'dispositivos/agregar',
          name: 'dispositivos-agregar',
          component: RegistroDispositivo,
        },
      ],
    },
    // Ruta alternativa fuera del menú si se accede directamente
    {
      path: '/dispositivos',
      redirect: '/menu/dispositivos',
    },
  ],
})

export default router
