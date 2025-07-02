<template>
  <div id="login" class="card bg-transparent mb-3 record-card">
    <div class="card-body">
      <div class="text-center">
        <h4 class="card-title">Registro Dispositivo</h4>
        <hr />
      </div>

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

        <!-- Mostrar mensaje de error si existe -->
        <div class="row p-2" v-if="alerta.mensaje">
          <div class="col">
            <div class="alert alert-danger" role="alert">
              <strong>¡Error!</strong>
              <p>{{ alerta.mensaje }}</p>
            </div>
          </div>
        </div>

        <div class="row p-2">
          <div class="col">
            <button class="btn btn-outline-success" type="submit">
              <i class="bi bi-box-arrow-in-right"></i> Guardar
            </button>
            <button class="btn btn-outline-secondary" type="button" @click="limpiar">
              <i class="bi bi-x-circle"></i> Cancelar
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from '@/api'; // Asegúrate de que la ruta a src/api.js sea correcta

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
        const res = await axios.post('/dispositivos', this.dispositivo);
        // Usar el toast global inyectado como $toast
        this.$toast.success(`✅ Dispositivo guardado: ${res.data.nombre}`);
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
      this.alerta.mensaje = ''; // Limpiar el mensaje de error
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