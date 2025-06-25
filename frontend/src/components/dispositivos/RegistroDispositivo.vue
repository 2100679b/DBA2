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
              id="nombre"
              class="form-control"
              v-model="dispositivo.nombre"
              aria-describedby="Nombre"
              placeholder="Nombre del dispositivo"
              required
            />
            <label for="nombre" class="form-text text-muted">Nombre del dispositivo</label>
          </div>

          <div class="form-floating p-1">
            <input
              type="text"
              id="ubicacion"
              class="form-control"
              v-model="dispositivo.ubicacion"
              aria-describedby="Ubicacion"
              placeholder="Ubicación"
              required
            />
            <label for="ubicacion" class="form-text text-muted">Ubicación</label>
          </div>

          <div class="form-floating p-1">
            <input
              type="text"
              id="coordenadas"
              class="form-control"
              v-model="dispositivo.coordenadas"
              aria-describedby="Coordenadas"
              placeholder="Coordenadas"
              required
            />
            <label for="coordenadas" class="form-text text-muted">Coordenadas</label>
          </div>
        </div>

        <!-- Sección de Potencia -->
        <div class="row p-1">
          <div class="col-12">
            <h6 class="text-muted">Configuración de Potencia</h6>
          </div>
          <div class="col-4">
            <div class="form-floating">
              <input
                type="number"
                step="0.1"
                id="potenciaNominal"
                class="form-control"
                v-model.number="dispositivo.potencia.nominal"
                placeholder="Nominal"
              />
              <label for="potenciaNominal" class="form-text text-muted">Nominal (KW)</label>
            </div>
          </div>
          <div class="col-4">
            <div class="form-floating">
              <input
                type="number"
                step="0.1"
                id="potenciaMinimo"
                class="form-control"
                v-model.number="dispositivo.potencia.minimo"
                placeholder="Mínimo"
              />
              <label for="potenciaMinimo" class="form-text text-muted">Mínimo (KW)</label>
            </div>
          </div>
          <div class="col-4">
            <div class="form-floating">
              <input
                type="number"
                step="0.1"
                id="potenciaMaximo"
                class="form-control"
                v-model.number="dispositivo.potencia.maximo"
                placeholder="Máximo"
              />
              <label for="potenciaMaximo" class="form-text text-muted">Máximo (KW)</label>
            </div>
          </div>
        </div>

        <!-- Sección de Voltaje -->
        <div class="row p-1">
          <div class="col-12">
            <h6 class="text-muted">Configuración de Voltaje</h6>
          </div>
          <div class="col-4">
            <div class="form-floating">
              <input
                type="number"
                step="1"
                id="voltajeNominal"
                class="form-control"
                v-model.number="dispositivo.voltaje.nominal"
                placeholder="Nominal"
              />
              <label for="voltajeNominal" class="form-text text-muted">Nominal (V)</label>
            </div>
          </div>
          <div class="col-4">
            <div class="form-floating">
              <input
                type="number"
                step="1"
                id="voltajeMinimo"
                class="form-control"
                v-model.number="dispositivo.voltaje.minimo"
                placeholder="Mínimo"
              />
              <label for="voltajeMinimo" class="form-text text-muted">Mínimo (V)</label>
            </div>
          </div>
          <div class="col-4">
            <div class="form-floating">
              <input
                type="number"
                step="1"
                id="voltajeMaximo"
                class="form-control"
                v-model.number="dispositivo.voltaje.maximo"
                placeholder="Máximo"
              />
              <label for="voltajeMaximo" class="form-text text-muted">Máximo (V)</label>
            </div>
          </div>
        </div>

        <!-- Sección de Corriente -->
        <div class="row p-1">
          <div class="col-12">
            <h6 class="text-muted">Configuración de Corriente</h6>
          </div>
          <div class="col-4">
            <div class="form-floating">
              <input
                type="number"
                step="0.1"
                id="corrienteNominal"
                class="form-control"
                v-model.number="dispositivo.corriente.nominal"
                placeholder="Nominal"
              />
              <label for="corrienteNominal" class="form-text text-muted">Nominal (A)</label>
            </div>
          </div>
          <div class="col-4">
            <div class="form-floating">
              <input
                type="number"
                step="0.1"
                id="corrienteMinimo"
                class="form-control"
                v-model.number="dispositivo.corriente.minimo"
                placeholder="Mínimo"
              />
              <label for="corrienteMinimo" class="form-text text-muted">Mínimo (A)</label>
            </div>
          </div>
          <div class="col-4">
            <div class="form-floating">
              <input
                type="number"
                step="0.1"
                id="corrienteMaximo"
                class="form-control"
                v-model.number="dispositivo.corriente.maximo"
                placeholder="Máximo (A)"
              />
              <label for="corrienteMaximo" class="form-text text-muted">Máximo (A)</label>
            </div>
          </div>
        </div>

        <!-- Sección de Caudal -->
        <div class="row p-1">
          <div class="col-12">
            <h6 class="text-muted">Configuración de Caudal</h6>
          </div>
          <div class="col-4">
            <div class="form-floating">
              <input
                type="number"
                step="0.1"
                id="caudalNominal"
                class="form-control"
                v-model.number="dispositivo.caudal.nominal"
                placeholder="Nominal"
              />
              <label for="caudalNominal" class="form-text text-muted">Nominal (m³/min)</label>
            </div>
          </div>
          <div class="col-4">
            <div class="form-floating">
              <input
                type="number"
                step="0.1"
                id="caudalMinimo"
                class="form-control"
                v-model.number="dispositivo.caudal.minimo"
                placeholder="Mínimo"
              />
              <label for="caudalMinimo" class="form-text text-muted">Mínimo (m³/min)</label>
            </div>
          </div>
          <div class="col-4">
            <div class="form-floating">
              <input
                type="number"
                step="0.1"
                id="caudalMaximo"
                class="form-control"
                v-model.number="dispositivo.caudal.maximo"
                placeholder="Máximo"
              />
              <label for="caudalMaximo" class="form-text text-muted">Máximo (m³/min)</label>
            </div>
          </div>
        </div>

        <div class="row p-2">
          <div class="col-12">
            <div class="alert alert-danger" role="alert" v-if="alerta.mensaje">
              <strong>¡Error!</strong>
              <p v-html="alerta.mensaje"></p>
            </div>
            <div class="alert alert-success" role="alert" v-if="alerta.exito">
              <strong>¡Éxito!</strong>
              <p v-html="alerta.exito"></p>
            </div>
          </div>
        </div>

        <div class="row p-2">
          <div class="col">
            <button class="btn btn-outline-success" type="submit" :disabled="enviando">
              <i class="bi bi-box-arrow-in-right"></i> 
              {{ enviando ? 'Guardando...' : 'Guardar' }}
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
        mensaje: '',
        exito: ''
      },
      enviando: false
    }
  },
  methods: {
    getDispositivoInicial() {
      return {
        nombre: '',
        ubicacion: '',
        coordenadas: '19.7060° N, 101.1950° W',
        potencia: { 
          nominal: 7.2, 
          minimo: 6.2, 
          maximo: 8.6, 
          um: 'KW' 
        },
        voltaje: { 
          nominal: 240, 
          minimo: 230, 
          maximo: 250, 
          um: 'Volts' 
        },
        corriente: { 
          nominal: 30, 
          minimo: 25, 
          maximo: 35, 
          um: 'Amperes' 
        },
        caudal: { 
          nominal: 1.0, 
          minimo: 0.1, 
          maximo: 1.2, 
          um: 'm³/minuto' 
        },
        estado: 1
      }
    },

    limpiar() {
      this.dispositivo = this.getDispositivoInicial()
      this.alerta.mensaje = ''
      this.alerta.exito = ''
    },

    validarDatos() {
      const errores = []

      if (!this.dispositivo.nombre.trim()) {
        errores.push('El nombre del dispositivo es requerido')
      }

      if (!this.dispositivo.ubicacion.trim()) {
        errores.push('La ubicación es requerida')
      }

      if (!this.dispositivo.coordenadas.trim()) {
        errores.push('Las coordenadas son requeridas')
      }

      // Validar rangos numéricos
      const validarRango = (config, nombre) => {
        if (config.minimo >= config.nominal) {
          errores.push(`El valor mínimo de ${nombre} debe ser menor al nominal`)
        }
        if (config.maximo <= config.nominal) {
          errores.push(`El valor máximo de ${nombre} debe ser mayor al nominal`)
        }
      }

      validarRango(this.dispositivo.potencia, 'potencia')
      validarRango(this.dispositivo.voltaje, 'voltaje')
      validarRango(this.dispositivo.corriente, 'corriente')
      validarRango(this.dispositivo.caudal, 'caudal')

      return errores
    },

    async guardar() {
      this.alerta.mensaje = ''
      this.alerta.exito = ''

      // Validar datos
      const errores = this.validarDatos()
      if (errores.length > 0) {
        this.alerta.mensaje = errores.join('<br>')
        return
      }

      try {
        this.enviando = true
        const apiUrl = import.meta.env.VITE_API_URL
        if (!apiUrl) throw new Error('API URL no configurada')

        // Preparar datos para la BD (formato compatible con sistemas.dispositivos)
        const dispositivoDB = {
          nombre: this.dispositivo.nombre.trim(),
          ubicacion: this.dispositivo.ubicacion.trim(),
          coordenadas: this.dispositivo.coordenadas.trim(),
          potencia: this.dispositivo.potencia,
          voltaje: this.dispositivo.voltaje,
          corriente: this.dispositivo.corriente,
          caudal: this.dispositivo.caudal,
          estado: this.dispositivo.estado,
          registro_usuario: this.getUsuarioActual() // Debes implementar esta función
        }

        const response = await axios.post(`${apiUrl}/dispositivos`, dispositivoDB)
        console.log('✅ Dispositivo creado:', response.data)

        this.alerta.exito = 'Dispositivo registrado exitosamente'
        
        // Limpiar formulario después de 2 segundos
        setTimeout(() => {
          this.limpiar()
        }, 2000)

      } catch (error) {
        console.error('❌ Error al guardar:', error)
        this.alerta.mensaje =
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          'No se pudo guardar el dispositivo. Intente más tarde.'
      } finally {
        this.enviando = false
      }
    },

    getUsuarioActual() {
      // Implementa según tu sistema de autenticación
      // Por ejemplo, obtener del localStorage, Vuex store, etc.
      return localStorage.getItem('userId') || 0
    }
  }
}
</script>

<style scoped>
.record-card {
  max-width: 800px;
  min-width: 600px;
  width: 100%;
}

.form-floating {
  margin-bottom: 0.5rem;
}

h6.text-muted {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 0.25rem;
}

.alert {
  margin-top: 1rem;
}
</style>