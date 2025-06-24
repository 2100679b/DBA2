<template>
  <div id="login" class="card bg-transparent mb-3 record-card">
    <div class="card-body">
      <div class="text-center">
        <h4 class="card-title">Registro Dispositivo</h4>
        <hr />
      </div>

      <form @submit.prevent="guardar">
        <div class="row p-1">
          <div class="form-floating p-1">
            <input
              type="text"
              id="identificador"
              class="form-control"
              v-model="dispositivo.identifica.identificador"
              aria-describedby="Id"
              placeholder="Identificador"
            />
            <label for="identificador" class="form-text text-muted">Identificador</label>
          </div>

          <div class="form-floating p-1">
            <input
              type="text"
              id="nombreDisp"
              class="form-control"
              v-model="dispositivo.identifica.nombre"
              aria-describedby="Nombre"
              placeholder="Nombre del dispositivo"
            />
            <label for="nombreDisp" class="form-text text-muted">Nombre del dispositivo</label>
          </div>

          <div class="form-floating p-1">
            <input
              type="text"
              id="ubicacion"
              class="form-control"
              v-model="dispositivo.identifica.ubicacion"
              aria-describedby="Ubicacion"
              placeholder="Ubicación"
            />
            <label for="ubicacion" class="form-text text-muted">Ubicación</label>
          </div>
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
import axios from 'axios'

export default {
  name: 'RegistroDispositivo',
  data() {
    return {
      dispositivo: this.getDispositivoInicial(),
      alerta: {
        mensaje: ''
      }
    }
  },
  methods: {
    getDispositivoInicial() {
      return {
        identifica: {
          identificador: 0,
          nombre: '',
          ubicacion: '',
          coordenadas: '19.7060° N, 101.1950° W',
          potencia: { nominal: 7.2, minimo: 6.2, maximo: 8.6, um: 'KW' },
          voltaje: { nominal: 240, minimo: 230, maximo: 250, um: 'Volts' },
          corriente: { nominal: 30, minimo: 25, maximo: 35, um: 'Amperes' },
          caudal: { nominal: 1, minimo: 0.1, maximo: 1.2, um: 'm3/minuto' },
          fechaRegistro: new Date().toUTCString()
        },
        opera: {
          potencia: { valor: 7.2, idEstatus: 1 },
          voltaje: { valor: 240, idEstatus: 1 },
          corriente: { valor: 30, idEstatus: 1 },
          caudal: { valor: 1, idEstatus: 1 },
          idEstatus: 1,
          estatus: 'Operacion Normal',
          fechaRegistro: new Date().toUTCString()
        },
        estado: 1
      }
    },
    async guardar() {
  try {
    const apiUrl = import.meta.env.VITE_API_URL
    if (!apiUrl) throw new Error('API URL no configurada')

    const response = await axios.post(`${apiUrl}/dispositivos`, this.dispositivo)
    console.log('✅ Dispositivo creado:', response.data)

    this.limpiar()
  } catch (error) {
    console.error('❌ Error al guardar:', error)
    this.alerta.mensaje =
      error.response?.data?.error ||
      error.message ||
      'No se pudo guardar el dispositivo. Intente más tarde.'
  }
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
</style>
