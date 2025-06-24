<template>
  <div id="login" class="card bg-transparent mb-3 record-card">
    <div class="card-body">
      <div class="text-center">
        <h4 class="card-title" title="Plataforma para monitoreo de Sistemas de Bombeo">
          Registro Dispositivo
        </h4>
        <hr />
      </div>

      <div class="row p-1">
        <form @submit.prevent="guardar">
          <div class="form-floating p-1">
            <input
              type="text"
              id="identificador"
              ref="identificador"
              class="form-control"
              v-model="dispositivo.identifica.identificador"
              aria-describedby="idHelp"
              placeholder="Identificador"
            />
            <label for="identificador" class="form-text text-muted">Identificador</label>
          </div>

          <div class="form-floating p-1">
            <input
              type="text"
              id="nombreDisp"
              ref="nombreDisp"
              class="form-control"
              v-model="dispositivo.identifica.nombre"
              aria-describedby="nombreHelp"
              placeholder="Nombre del dispositivo"
            />
            <label for="nombreDisp" class="form-text text-muted">Nombre del dispositivo</label>
          </div>

          <div class="form-floating p-1">
            <input
              type="text"
              id="ubicacion"
              ref="ubicacion"
              class="form-control"
              v-model="dispositivo.identifica.ubicacion"
              aria-describedby="ubicacionHelp"
              placeholder="Ubicación"
            />
            <label for="ubicacion" class="form-text text-muted">Ubicación</label>
          </div>
        </form>
      </div>

      <div class="row p-2">
        <div class="col-12">
          <div class="alert alert-danger" role="alert" v-if="alerta.mensaje">
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
import api from '@/api/api'; // Axios con baseURL configurada

export default {
  name: 'RegistroDispositivo',
  data() {
    return {
      dispositivo: this.getDispositivoInicial(),
      alerta: { mensaje: '' }
    };
  },
  methods: {
    getDispositivoInicial() {
      const fecha = new Date().toUTCString();
      return {
        identifica: {
          identificador: '',
          nombre: '',
          ubicacion: '',
          coordenadas: '19.7060° N, 101.1950° W',
          idestatus: 1,
          estatus: 'Operacion Normal',
          potencia: { nominal: 7.400, minimo: 6.200, maximo: 8.600, um: 'KW' },
          voltaje: { nominal: 240, minimo: 230, maximo: 250, um: 'Volts' },
          corriente: { nominal: 30, minimo: 25, maximo: 35, um: 'Amperes' },
          caudal: { nominal: 1, minimo: 0.10, maximo: 1.20, um: 'm3/minuto' },
          fechaRegistro: fecha
        },
        opera: {
          potencia: { valor: 7.200, idEstatus: 1 },
          voltaje: { valor: 240, idEstatus: 1 },
          corriente: { valor: 30, idEstatus: 1 },
          caudal: { valor: 1, idEstatus: 1 },
          idEstatus: 1,
          estatus: 'Operacion Normal',
          fechaRegistro: fecha
        },
        estado: 1
      };
    },
    async guardar() {
      try {
        const response = await api.post('/dispositivos', this.dispositivo);
        this.$store.commit('setDispositivos', [
          ...this.$store.state.dispositivos,
          response.data
        ]);
        this.alerta.mensaje = '';
        this.limpiar();
      } catch (error) {
        this.alerta.mensaje =
          error.response?.data?.error ||
          'Error al guardar el dispositivo: ' + error.message;
      }
    },
    limpiar() {
      this.dispositivo = this.getDispositivoInicial();
      this.alerta.mensaje = '';
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
  /* background: url('@/assets/img/background.png') repeat-x scroll; */
}
</style>
