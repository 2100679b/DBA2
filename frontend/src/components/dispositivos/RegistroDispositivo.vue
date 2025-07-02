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

        <!-- Campos de coordenadas separados -->
        <div class="row p-1">
          <div class="col-6">
            <div class="form-floating">
              <input
                type="number"
                id="latitud"
                class="form-control"
                v-model.number="dispositivo.coordenadas.lat"
                placeholder="Latitud"
                step="any"
                required
              />
              <label for="latitud">Latitud</label>
            </div>
          </div>
          <div class="col-6">
            <div class="form-floating">
              <input
                type="number"
                id="longitud"
                class="form-control"
                v-model.number="dispositivo.coordenadas.lng"
                placeholder="Longitud"
                step="any"
                required
              />
              <label for="longitud">Longitud</label>
            </div>
          </div>
        </div>

        <!-- Sección de mediciones opcionales -->
        <div class="row p-2">
          <div class="col">
            <h6>Mediciones (Opcionales)</h6>
          </div>
        </div>

        <!-- Potencia -->
        <div class="row p-1">
          <div class="col-4">
            <div class="form-floating">
              <input
                type="number"
                id="potenciaValor"
                class="form-control"
                v-model.number="dispositivo.potencia.valor"
                placeholder="Potencia"
                step="any"
              />
              <label for="potenciaValor">Potencia</label>
            </div>
          </div>
          <div class="col-4">
            <div class="form-floating">
              <select
                id="potenciaUnidad"
                class="form-select"
                v-model="dispositivo.potencia.unidad"
              >
                <option value="">Seleccionar</option>
                <option value="W">Watts</option>
                <option value="KW">Kilowatts</option>
                <option value="MW">Megawatts</option>
              </select>
              <label for="potenciaUnidad">Unidad</label>
            </div>
          </div>
          <div class="col-4">
            <div class="form-floating">
              <input
                type="datetime-local"
                id="potenciaFecha"
                class="form-control"
                v-model="dispositivo.potencia.fecha"
              />
              <label for="potenciaFecha">Fecha</label>
            </div>
          </div>
        </div>

        <!-- Voltaje -->
        <div class="row p-1">
          <div class="col-4">
            <div class="form-floating">
              <input
                type="number"
                id="voltajeValor"
                class="form-control"
                v-model.number="dispositivo.voltaje.valor"
                placeholder="Voltaje"
                step="any"
              />
              <label for="voltajeValor">Voltaje</label>
            </div>
          </div>
          <div class="col-4">
            <div class="form-floating">
              <select
                id="voltajeUnidad"
                class="form-select"
                v-model="dispositivo.voltaje.unidad"
              >
                <option value="">Seleccionar</option>
                <option value="V">Voltios</option>
                <option value="KV">Kilovoltios</option>
              </select>
              <label for="voltajeUnidad">Unidad</label>
            </div>
          </div>
          <div class="col-4">
            <div class="form-floating">
              <input
                type="datetime-local"
                id="voltajeFecha"
                class="form-control"
                v-model="dispositivo.voltaje.fecha"
              />
              <label for="voltajeFecha">Fecha</label>
            </div>
          </div>
        </div>

        <!-- Corriente -->
        <div class="row p-1">
          <div class="col-4">
            <div class="form-floating">
              <input
                type="number"
                id="corrienteValor"
                class="form-control"
                v-model.number="dispositivo.corriente.valor"
                placeholder="Corriente"
                step="any"
              />
              <label for="corrienteValor">Corriente</label>
            </div>
          </div>
          <div class="col-4">
            <div class="form-floating">
              <select
                id="corrienteUnidad"
                class="form-select"
                v-model="dispositivo.corriente.unidad"
              >
                <option value="">Seleccionar</option>
                <option value="A">Amperes</option>
                <option value="mA">Miliamperes</option>
              </select>
              <label for="corrienteUnidad">Unidad</label>
            </div>
          </div>
          <div class="col-4">
            <div class="form-floating">
              <input
                type="datetime-local"
                id="corrienteFecha"
                class="form-control"
                v-model="dispositivo.corriente.fecha"
              />
              <label for="corrienteFecha">Fecha</label>
            </div>
          </div>
        </div>

        <!-- Caudal -->
        <div class="row p-1">
          <div class="col-4">
            <div class="form-floating">
              <input
                type="number"
                id="caudalValor"
                class="form-control"
                v-model.number="dispositivo.caudal.valor"
                placeholder="Caudal"
                step="any"
              />
              <label for="caudalValor">Caudal</label>
            </div>
          </div>
          <div class="col-4">
            <div class="form-floating">
              <select
                id="caudalUnidad"
                class="form-select"
                v-model="dispositivo.caudal.unidad"
              >
                <option value="">Seleccionar</option>
                <option value="L/min">Litros/min</option>
                <option value="m3/min">m³/min</option>
                <option value="m3/h">m³/hora</option>
              </select>
              <label for="caudalUnidad">Unidad</label>
            </div>
          </div>
          <div class="col-4">
            <div class="form-floating">
              <input
                type="datetime-local"
                id="caudalFecha"
                class="form-control"
                v-model="dispositivo.caudal.fecha"
              />
              <label for="caudalFecha">Fecha</label>
            </div>
          </div>
        </div>

        <!-- Mensajes de estado -->
        <div class="row p-2" v-if="loading">
          <div class="col">
            <div class="d-flex align-items-center">
              <div class="spinner-border spinner-border-sm me-2" role="status">
                <span class="visually-hidden">Guardando...</span>
              </div>
              <span>Guardando dispositivo...</span>
            </div>
          </div>
        </div>

        <div class="row p-2" v-if="alerta.mensaje">
          <div class="col">
            <div 
              class="alert" 
              :class="alerta.tipo === 'success' ? 'alert-success' : 'alert-danger'" 
              role="alert"
            >
              <strong v-if="alerta.tipo === 'success'">¡Éxito!</strong>
              <strong v-else>¡Error!</strong>
              <p v-html="alerta.mensaje"></p>
            </div>
          </div>
        </div>

        <div class="row p-2">
          <div class="col">
            <button 
              class="btn btn-outline-success me-2" 
              type="submit"
              :disabled="loading"
            >
              <i class="bi bi-check-circle"></i> 
              {{ loading ? 'Guardando...' : 'Guardar' }}
            </button>
            <button 
              class="btn btn-outline-secondary" 
              type="button" 
              @click="limpiar"
              :disabled="loading"
            >
              <i class="bi bi-x-circle"></i> Cancelar
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import api from '@/api' // Usando tu configuración de API corregida

export default {
  name: 'RegistroDispositivo',
  data() {
    return {
      loading: false,
      dispositivo: {
        nombre: '',
        ubicacion: '',
        coordenadas: {
          lat: 19.7060,
          lng: -101.1950
        },
        potencia: {
          valor: null,
          unidad: '',
          fecha: ''
        },
        voltaje: {
          valor: null,
          unidad: '',
          fecha: ''
        },
        corriente: {
          valor: null,
          unidad: '',
          fecha: ''
        },
        caudal: {
          valor: null,
          unidad: '',
          fecha: ''
        },
        registro_usuario: 0
      },
      alerta: {
        mensaje: '',
        tipo: ''
      }
    };
  },
  methods: {
    async guardar() {
      try {
        this.loading = true;
        this.alerta = { mensaje: '', tipo: '' };

        // Limpiar objetos vacíos antes de enviar
        const dispositivoLimpio = this.limpiarDatos();

        console.log('Enviando datos:', dispositivoLimpio);

        const response = await api.post('/dispositivos', dispositivoLimpio);
        
        this.alerta = {
          mensaje: `Dispositivo "${response.data.dispositivo.nombre}" guardado exitosamente`,
          tipo: 'success'
        };

        // Limpiar formulario después de 2 segundos
        setTimeout(() => {
          this.limpiar();
        }, 2000);

      } catch (error) {
        console.error('Error al guardar:', error);
        
        let mensaje = 'Error desconocido al guardar el dispositivo';
        
        if (error.response?.data?.error) {
          mensaje = error.response.data.error;
        } else if (error.message) {
          mensaje = error.message;
        }

        this.alerta = {
          mensaje: mensaje,
          tipo: 'error'
        };
      } finally {
        this.loading = false;
      }
    },

    limpiarDatos() {
      const dispositivo = { ...this.dispositivo };

      // Limpiar mediciones vacías
      ['potencia', 'voltaje', 'corriente', 'caudal'].forEach(campo => {
        const medicion = dispositivo[campo];
        if (!medicion.valor || !medicion.unidad) {
          dispositivo[campo] = {};
        }
      });

      return dispositivo;
    },

    limpiar() {
      this.dispositivo = {
        nombre: '',
        ubicacion: '',
        coordenadas: {
          lat: 19.7060,
          lng: -101.1950
        },
        potencia: {
          valor: null,
          unidad: '',
          fecha: ''
        },
        voltaje: {
          valor: null,
          unidad: '',
          fecha: ''
        },
        corriente: {
          valor: null,
          unidad: '',
          fecha: ''
        },
        caudal: {
          valor: null,
          unidad: '',
          fecha: ''
        },
        registro_usuario: 0
      };

      this.alerta = { mensaje: '', tipo: '' };
      
      // Navegar solo si no hay errores
      if (this.alerta.tipo !== 'error') {
        this.$router.push('/menu/dispositivos');
      }
    },

    // Método para establecer fecha actual
    setCurrentDateTime(campo) {
      const now = new Date();
      const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      this.dispositivo[campo].fecha = localDateTime;
    }
  },

  mounted() {
    // Establecer fecha actual por defecto para todas las mediciones
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    
    ['potencia', 'voltaje', 'corriente', 'caudal'].forEach(campo => {
      this.dispositivo[campo].fecha = localDateTime;
    });
  }
};
</script>

<style scoped>
.record-card {
  max-width: 600px;
  min-width: 500px;
  width: 100%;
  margin: 0 auto;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

.form-floating {
  margin-bottom: 0.5rem;
}

h6 {
  color: #6c757d;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.alert {
  margin-bottom: 0;
}
</style>