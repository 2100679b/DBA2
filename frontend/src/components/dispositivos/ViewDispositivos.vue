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
      dispositivo: null // dispositivo seleccionado para el diálogo
    }
  },
  computed: {
    dispositivos() {
      // Copia defensiva si quieres modificar localmente
      return this.$store.state.dispositivos || []
    }
  },
  methods: {
    setDispositivo(dispositivo) {
      this.dispositivo = dispositivo
    },
    refresh() {
      // Aquí idealmente deberías usar una mutación Vuex para actualizar el estado,
      // pero si quieres hacerlo localmente, mejor copia la lista y la modifiques.
      this.$store.commit('actualizarDispositivos', this.generarDatosSimulados())
    },
    generarDatosSimulados() {
      // Aquí deberías construir un nuevo arreglo con los dispositivos actualizados
      // usando la lógica de desviación, rangos y estatus.
      // Por simplicidad, este método retornaría un array modificado.
      return this.dispositivos.map((item) => {
        // Calcular valores simulados (voltaje, corriente, etc.)
        // ... (código igual que el refresh original)
        // Devuelve el dispositivo actualizado con la nueva propiedad 'opera'
        return {
          ...item,
          opera: {
            // valores simulados aquí...
          }
        }
      })
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
    },
    nuevo(dispositivo) {
      this.$store.commit('agregarDispositivo', dispositivo)
    }
  },
  created() {
    // Cargar dispositivos iniciales
    // this.$store.commit('setDispositivos', DSDispositivos.getListaDataStore())
  }
}
</script>
