import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // No excludes ni external para vue, para que se empaquete correctamente
    rollupOptions: {
      // external: [], // NO marques vue como externo aquí
    },
    target: 'esnext',
    sourcemap: false,
  },
})
