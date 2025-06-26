<template>
  <div id="login" class="card bg-transparent mb-3 record-card">
    <div class="card-body">
      <div class="text-center">
        <h4 class="card-title">Registro Dispositivo</h4>
        <hr />
      </div>
      <div class="row p-1">
        <form @submit.prevent="guardar">
          <div class="form-floating p-1">
            <input
              type="text"
              id="nombreDisp"
              class="form-control"
              v-model="dispositivo.nombre"
              placeholder="Nombre del dispositivo"
              required
            />
            <label for="nombreDisp">Nombre del dispositivo</label>
          </div>
          <div class="form-floating p-1">
            <input
              type="text"
              id="ubicacion"
              class="form-control"
              v-model="dispositivo.ubicacion"
              placeholder="Ubicación"
              required
            />
            <label for="ubicacion">Ubicación</label>
          </div>
        </form>
      </div>

      <div class="row p-2" v-if="alerta.mensaje">
        <div class="col">
          <div class="alert alert-danger" role="alert">
            <strong>¡Error!</strong>
            <p v-html="alerta.mensaje"></p>
          </div>
        </div>
      </div>

      <div class="row p-2">
        <div class="col">
          <button class="btn btn-outline-success" type="button" @click="guardar">
            <i class="bi bi-box-arrow-in-right"></i> Guardar
          </button>
          <button class="btn btn-outline-secondary" type="button" @click="limpiar">
            <i class="bi bi-x-circle"></i> Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/api' // asegúrate de tener src/api.js configurado con axios

export default {
  name: 'RegistroDispositivo',
  data() {
    return {
      dispositivo: {
        nombre: '',
        ubicacion: '',
        coordenadas: '19.7060° N, 101.1950° W',
        potencia: { nominal: 7.4, minimo: 6.2, maximo: 8.6, um: 'KW' },
        voltaje: { nominal: 240, minimo: 230, maximo: 250, um: 'Volts' },
        corriente: { nominal: 30, minimo: 25, maximo: 35, um: 'Amperes' },
        caudal: { nominal: 1.0, minimo: 0.10, maximo: 1.20, um: 'm3/minuto' },
        estado: 1,
        registro_usuario: 0
      },
      alerta: {
        mensaje: ''
      }
    };
  },
  methods: {
    async guardar() {
      try {
        const res = await axios.post('/api/dispositivos', this.dispositivo);
        alert('✅ Dispositivo guardado: ' + res.data.dispositivo.nombre);
        this.limpiar();
      } catch (error) {
        console.error(error);
        this.alerta.mensaje =
          error.response?.data?.error || 'Error al guardar el dispositivo.';
      }
    },
    limpiar() {
      this.dispositivo = {
        nombre: '',
        ubicacion: '',
        coordenadas: '19.7060° N, 101.1950° W',
        potencia: { nominal: 7.4, minimo: 6.2, maximo: 8.6, um: 'KW' },
        voltaje: { nominal: 240, minimo: 230, maximo: 250, um: 'Volts' },
        corriente: { nominal: 30, minimo: 25, maximo: 35, um: 'Amperes' },
        caudal: { nominal: 1.0, minimo: 0.10, maximo: 1.20, um: 'm3/minuto' },
        estado: 1,
        registro_usuario: 0
      };
      this.$router.push('/menu/dispositivos');
    }
  }
};
</script>

<style scoped>
.record-card {
  max-width: 500px;
  min-width: 400px;
  width: 100%;
}
</style>
