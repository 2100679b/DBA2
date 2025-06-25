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
            <h6>Potencia (KW)</h6>
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
              <label for="potenciaNominal">Nominal</label>
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
              <label for="potenciaMinimo">Mínimo</label>
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
              <label for="potenciaMaximo">Máximo</label>
            </div>
          </div>
        </div>

        <!-- Sección de Voltaje -->
        <div class="row p-1">
          <div class="col-12">
            <h6>Voltaje (Volts)</h6>
          </div>
          <div class="col-4">
            <div class="form-floating">
              <input
                type="number"
                step="0.1"
                id="voltajeNominal"
                class="form-control"
                v-model.number="dispositivo.voltaje.nominal"
                placeholder="Nominal"
              />
              <label for="voltajeNominal">Nominal</label>
            </div>
          </div>
          <div class="col-4">
            <div class="form-floating">
              <input
                type="number"
                step="0.1"
                id="voltajeMinimo"
                class="form-control"
                v-model.number="dispositivo.voltaje.minimo"
                placeholder="Mínimo"
              />
              <label for="voltajeMinimo">Mínimo</label>
            </div>
          </div>
          <div class="col-4">
            <div class="form-floating">
              <input
                type="number"
                step="0.1"
                id="voltajeMaximo"
                class="form-control"
                v-model.number="dispositivo.voltaje.maximo"
                placeholder="Máximo"
              />
              <label for="voltajeMaximo">Máximo</label>
            </div>
          </div>
        </div>

        <!-- Sección de Corriente -->
        <div class="row p-1">
          <div class="col-12">
            <h6>Corriente (Amperes)</h6>
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
              <label for="corrienteNominal">Nominal</label>
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
              <label for="corrienteMinimo">Mínimo</label>
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
                placeholder="Máximo"
              />
              <label for="corrienteMaximo">Máximo</label>
            </div>
          </div>
        </div>

        <!-- Sección de Caudal -->
        <div class="row p-1">
          <div class="col-12">
            <h6>Caudal (m³/minuto)</h6>
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
              <label for="caudalNominal">Nominal</label>
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
              <label for="caudalMinimo">Mínimo</label>
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
              <label for="caudalMaximo">Máximo</label>
            </div>
          </div>
        </div>

        <!-- Estado -->
        <div class="row p-1">
          <div class="form-floating p-1">
            <select
              id="estado"
              class="form-select"
              v-model.number="dispositivo.estado"
            >
              <option value="1">Activo</option>
              <option value="0">Inactivo</option>
            </select>
            <label for="estado" class="form-text text-muted">Estado</label>
          </div>
        </div>

        <!-- Alertas -->
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

        <!-- Botones -->
        <div class="row p-2">
          <div class="col">
            <button class="btn btn-outline-success" type="submit" :disabled="guardando">
              <i class="bi bi-box-arrow-in-right"></i> 
              {{ guardando ? 'Guardando...' : 'Guardar' }}
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
      guardando: false,
      alerta: {
        mensaje: '',
        exito: ''
      }
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
          nominal: 1, 
          minimo: 0.1, 
          maximo: 1.2, 
          um: 'm3/minuto' 
        },
        estado: 1,
        registro_usuario: 1 // ID del usuario que registra
      }
    },

    async guardar() {
      try {
        this.guardando = true
        this.alerta.mensaje = ''
        this.alerta.exito = ''

        // Validar campos requeridos
        if (!this.dispositivo.nombre.trim()) {
          throw new Error('El nombre del dispositivo es requerido')
        }
        if (!this.dispositivo.ubicacion.trim()) {
          throw new Error('La ubicación es requerida')
        }
        if (!this.dispositivo.coordenadas.trim()) {
          throw new Error('Las coordenadas son requeridas')
        }

        const apiUrl = import.meta.env.VITE_API_URL
        if (!apiUrl) throw new Error('API URL no configurada')

        console.log('📤 Enviando dispositivo:', this.dispositivo)

        const response = await axios.post(`${apiUrl}/dispositivos`, this.dispositivo)
        
        console.log('✅ Dispositivo creado:', response.data)
        
        this.alerta.exito = 'Dispositivo registrado exitosamente'
        
        // Limpiar formulario después de 2 segundos
        setTimeout(() => {
          this.limpiar()
        }, 2000)

      } catch (error) {
        console.error('❌ Error al guardar:', error)
        
        let mensaje = 'No se pudo guardar el dispositivo. Intente más tarde.'
        
        if (error.response?.data?.error) {
          mensaje = error.response.data.error
        } else if (error.response?.data?.message) {
          mensaje = error.response.data.message
        } else if (error.message) {
          mensaje = error.message
        }
        
        // Manejar errores específicos
        if (mensaje.includes('duplicate key') || mensaje.includes('unique constraint')) {
          mensaje = 'Ya existe un dispositivo con ese nombre. Use un nombre diferente.'
        }
        
        this.alerta.mensaje = mensaje
      } finally {
        this.guardando = false
      }
    },

    limpiar() {
      this.dispositivo = this.getDispositivoInicial()
      this.alerta.mensaje = ''
      this.alerta.exito = ''
      this.guardando = false
    }
  }
}
</script>

<style scoped>
.record-card {
  max-width: 600px;
  min-width: 400px;
  width: 100%;
}

.form-floating {
  margin-bottom: 0.5rem;
}

h6 {
  color: #6c757d;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>