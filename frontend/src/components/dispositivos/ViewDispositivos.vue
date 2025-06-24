<template>
  <div class="card">
    <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
      <div class="btn-group me-2" role="group" aria-label="Second group">
        <button type="button" class="btn btn-secondary" @click="refresh">Refresh</button>
        <button type="button" class="btn btn-secondary" @click="start">Iniciar</button>
        <button type="button" class="btn btn-secondary" @click="stop">Detener</button>
      </div>
    </div>
    <div class="card-body">
      <div class="row row-cols-1 row-cols-md-3 g-4">
        <Dispositivo
          v-for="(item, index) in dispositivos"
          :key="item.identificador || index"
          :dispositivo="item"
          @setDispositivo="setDispositivo"
        />
      </div>
    </div>
    <DispositivoDialogo
      v-if="dispositivo"
      :dispositivo="dispositivo"
      @close="dispositivo = null"
    />
  </div>
</template>

<script>
import axios from 'axios'
import Dispositivo from './Dispositivo.vue'
import DispositivoDialogo from './DispositivoDialogo.vue'

export default {
  name: 'ViewDispositivos',
  components: {
    Dispositivo,
    DispositivoDialogo
  },
  data() {
    return {
      nIntervId: null,
      dispositivo: null,
      dispositivosData: [] // ← datos desde backend
    }
  },
  computed: {
    dispositivos() {
      // Usamos los datos del backend, no del store (puedes cambiar si usas Vuex)
      return this.dispositivosData
    }
  },
  methods: {
    setDispositivo(dispositivo) {
      this.dispositivo = dispositivo
    },
    async fetchDispositivos() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/dispositivos`)
        this.dispositivosData = res.data
      } catch (err) {
        console.error('Error al obtener dispositivos del backend:', err)
      }
    },
    refresh() {
      this.fetchDispositivos()
    },
    start() {
      if (!this.nIntervId) {
        this.nIntervId = setInterval(() => {
          this.refresh()
        }, 2000)
      }
    },
    stop() {
      clearInterval(this.nIntervId)
      this.nIntervId = null
    }
  },
  mounted() {
    this.fetchDispositivos()
  }
}
</script>
