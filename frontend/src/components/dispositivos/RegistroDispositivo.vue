<template>
  <div id="login" class="card bg-transparent mb-3 record-card">
    <div class="card-body">
      <div class="text-center">
        <h4 class="card-title" title="Plataforma para monitoreo de Sistemas de Bombeo">Registro Dispositivo</h4>
        <hr />
      </div>

      <form @submit.prevent="guardar">
        <div class="form-floating p-1">
          <input type="text" id="identificadorInput" ref="identificador" class="form-control" v-model="dispositivo.identifica.identificador" placeholder="Identificador" disabled />
          <label for="identificadorInput" class="form-text text-muted">Identificador (Auto-generado)</label>
        </div>

        <div class="form-floating p-1">
          <input type="text" id="nombreDispInput" ref="nombreDisp" class="form-control" v-model="dispositivo.identifica.nombre" @keyup.enter="$refs.ubicacion.focus()" placeholder="Nombre del dispositivo" required />
          <label for="nombreDispInput" class="form-text text-muted">Nombre del dispositivo</label>
        </div>

        <div class="form-floating p-1">
          <input type="text" id="ubicacionInput" ref="ubicacion" class="form-control" v-model="dispositivo.identifica.ubicacion" @keyup.enter="guardar" placeholder="Ubicación" required />
          <label for="ubicacionInput" class="form-text text-muted">Ubicación</label>
        </div>

        <div class="form-floating p-1">
          <input type="text" id="coordenadasInput" ref="coordenadas" class="form-control" v-model="dispositivo.identifica.coordenadas" placeholder="Coordenadas" />
          <label for="coordenadasInput" class="form-text text-muted">Coordenadas</label>
        </div>
      </form>

      <div class="row p-2">
        <div class="col-12">
          <div v-if="alerta.mensaje" class="alert alert-danger" role="alert">
            <strong>¡Error!</strong>
            <p v-html="alerta.mensaje"></p>
          </div>
          <div v-if="alerta.exito" class="alert alert-success" role="alert">
            <strong>¡Éxito!</strong>
            <p v-html="alerta.exito"></p>
          </div>
        </div>
      </div>

      <div class="row p-2">
        <div class="col">
          <button class="btn btn-outline-success" type="button" @click="guardar" :disabled="guardando">
            <i class="bi bi-box-arrow-in-right"></i>
            {{ guardando ? 'Guardando...' : 'Guardar' }}
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
import axios from 'axios'

export default {
  name: 'RegistroDispositivo',
  data() {
    return {
      dispositivo: this.nuevoDispositivo(),
      alerta: {
        mensaje: '',
        exito: ''
      },
      guardando: false,
      apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
    }
  },
  methods: {
    nuevoDispositivo() {
      const ahora = new Date().toISOString();
      return {
        identifica: {
          identificador: 'Auto-generado',
          nombre: '',
          ubicacion: '',
          coordenadas: '19.7060° N, 101.1950° W',
          idestatus: 1,
          estatus: 'Operacion Normal',
          potencia: { nominal: 7.400, minimo: 6.200, maximo: 8.600, um: 'KW' },
          voltaje: { nominal: 240, minimo: 230, maximo: 250, um: 'Volts' },
          corriente: { nominal: 30, minimo: 25, maximo: 35, um: 'Amperes' },
          caudal: { nominal: 1, minimo: 0.10, maximo: 1.20, um: 'm3/minuto' },
          fechaRegistro: ahora
        },
        opera: {
          potencia: { valor: 7.200, idEstatus: 1 },
          voltaje: { valor: 240, idEstatus: 1 },
          corriente: { valor: 30, idEstatus: 1 },
          caudal: { valor: 1, idEstatus: 1 },
          idEstatus: 1,
          estatus: 'Operacion Normal',
          fechaRegistro: ahora
        },
        estado: 1
      }
    },

    async guardar() {
      if (!this.dispositivo.identifica.nombre.trim()) {
        this.alerta.mensaje = 'El nombre del dispositivo es requerido';
        this.alerta.exito = '';
        return;
      }

      if (!this.dispositivo.identifica.ubicacion.trim()) {
        this.alerta.mensaje = 'La ubicación es requerida';
        this.alerta.exito = '';
        return;
      }

      this.guardando = true;
      this.alerta = { mensaje: '', exito: '' };

      try {
        const response = await axios.post(`${this.apiUrl}/dispositivos`, this.dispositivo);

        if (response.status === 201) {
          this.alerta.exito = 'Dispositivo guardado exitosamente';
          this.alerta.mensaje = '';

          if (this.$store) {
            this.$store.dispatch('cargarDispositivos');
          }

          setTimeout(() => {
            this.limpiar();
          }, 1500);
        }
      } catch (error) {
        console.error('Error al guardar dispositivo:', error);

        if (error.response?.data?.error) {
          this.alerta.mensaje = error.response.data.error;
        } else if (error.response?.status === 400) {
          this.alerta.mensaje = 'Datos inválidos. Verifique la información ingresada.';
        } else if (error.response?.status === 500) {
          this.alerta.mensaje = 'Error del servidor. Intente nuevamente más tarde.';
        } else {
          this.alerta.mensaje = 'Error de conexión. Verifique su conexión a internet.';
        }

        this.alerta.exito = '';
      } finally {
        this.guardando = false;
      }
    },

    limpiar() {
      this.dispositivo = this.nuevoDispositivo();
      this.alerta = { mensaje: '', exito: '' };
      this.$router.push('/menu/dispositivos');
    }
  }
}
</script>

<style scoped>
.record-card {
  max-width: 500px;
  min-width: 400px;
  width: 100%;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
